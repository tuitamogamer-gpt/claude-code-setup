#!/usr/bin/env node
/**
 * ElevenLabs Scribe MCP server.
 *
 * Exposes Speech-to-Text transcription over the Model Context Protocol (stdio).
 * Tools:
 *   - elevenlabs_transcribe_audio: transcribe one local file or remote URL into
 *     text/markdown/json/srt, optionally exporting docx/pdf/html/srt/txt/segmented_json.
 *   - elevenlabs_transcribe_batch: transcribe many files/URLs at once, saving each to disk.
 *   - elevenlabs_check_connection: verify the API key and report account info.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";

import { CHARACTER_LIMIT } from "./constants.js";
import {
  EXT_BY_FORMAT,
  buildStructured,
  defaultDir,
  renderBody,
  resolvePath,
  saveExportedFormats,
  sourceBaseName,
  uniquePath,
} from "./core.js";
import { ElevenLabsError, checkConnection, transcribeAudio } from "./elevenlabs.js";
import { formatDuration } from "./format.js";
import { transliterateResponseInPlace } from "./translit.js";
import type { TranscriptionResponse } from "./types.js";
import {
  BatchTranscribeInputSchema,
  TranscribeInputSchema,
} from "./schemas.js";

const SERVER_NAME = "elevenlabs-scribe-mcp-server";
const SERVER_VERSION = "1.3.0";

// --- Helpers ---------------------------------------------------------------

function errorResult(text: string) {
  return { content: [{ type: "text" as const, text }], isError: true };
}

function formatError(err: unknown): string {
  if (err instanceof ElevenLabsError) return `Error: ${err.message}`;
  if (err instanceof Error) return `Error: ${err.message}`;
  return `Error: ${String(err)}`;
}

/** Transliterate Serbian Cyrillic → Latin when requested (only affects detected Serbian). */
function applyScript(resp: TranscriptionResponse, script: "latin" | "cyrillic"): void {
  if (script === "latin" && resp.language_code === "srp") {
    transliterateResponseInPlace(resp);
  }
}

// --- Server ----------------------------------------------------------------

const server = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION });

const TranscribeOutputShape = {
  text: z.string().describe("The full transcript text."),
  language_code: z.string().optional().describe("Detected language code."),
  language_probability: z.number().optional().describe("Language detection confidence (0-1)."),
  audio_duration_secs: z.number().optional().describe("Transcribed audio length in seconds."),
  word_count: z.number().describe("Number of word tokens (excludes spacing and audio events)."),
  speakers_detected: z.number().optional().describe("Distinct speakers found (when diarized)."),
  transcription_id: z.string().optional().describe("ElevenLabs transcription id."),
  model_id: z.string().describe("Model used."),
  format: z.string().describe("The response_format that was rendered."),
  saved_to: z.string().optional().describe("Absolute path the transcript was written to, if saved."),
  exported_files: z
    .array(z.string())
    .optional()
    .describe("Absolute paths of server-side exported files (docx/pdf/srt/...), if requested."),
};

server.registerTool(
  "elevenlabs_transcribe_audio",
  {
    title: "Transcribe Audio (ElevenLabs Scribe)",
    description: `Transcribe an audio or video file to text using ElevenLabs Scribe (Speech-to-Text).

Accepts EITHER a local file path (file_path) OR a remote URL (source_url) — exactly one. Supports common audio and video formats; URLs may include hosted media, YouTube, or TikTok links. Optionally diarizes (labels speakers), tags audio events like (laughter), returns word-level timestamps, and can export the transcript to docx/pdf/html/srt/txt/segmented_json files.

Args:
  - file_path (string, optional): Path to a local audio/video file. Max 5 GB.
  - source_url (string, optional): Public URL to audio/video. Max 2 GB.
  - model_id (string): 'scribe_v2' (newer, more accurate, default) or 'scribe_v1'.
  - language_code (string): ISO-639-1/3 code. Defaults to 'sr' (Serbian). Pass e.g. 'hr' for Croatian or 'en' for English; pass 'auto' to auto-detect.
  - script ('latin' | 'cyrillic'): Serbian output script. Default 'latin' (transliterates Cyrillic→Latin). Only affects Serbian; docx/pdf exports keep their original script.
  - diarize (boolean): Label different speakers. Default false.
  - num_speakers (integer, optional): Expected max speakers (1-32); use with diarize.
  - tag_audio_events (boolean): Tag non-speech sounds. Default true.
  - timestamps_granularity ('none' | 'word' | 'character'): Default 'word'. Required ('word'+) for srt/exports.
  - temperature (number, optional): 0.0-2.0 sampling randomness.
  - seed (integer, optional): Reproducible sampling.
  - response_format ('text' | 'markdown' | 'json' | 'srt'): Inline output shape. Default 'text'.
  - export_formats (array, optional): Also save server-side files: any of 'docx','pdf','html','srt','txt','segmented_json'. Auto-enables diarization + word timestamps.
  - output_dir (string, optional): Where to write exported/auto-saved files. Default: source file's directory (or cwd for URLs).
  - save_to_path (string, optional): Also write the inline transcript to this file path.

Returns:
  Text content in the requested format, plus structuredContent:
  {
    "text": string, "language_code": string, "language_probability": number,
    "audio_duration_secs": number, "word_count": number, "speakers_detected": number,
    "transcription_id": string, "model_id": string, "format": string,
    "saved_to": string,            // present if written to disk
    "exported_files": string[]     // present if export_formats requested
  }

Examples:
  - "Transcribe /Users/me/interview.mp3 with speaker labels" -> { file_path: "/Users/me/interview.mp3", diarize: true, response_format: "markdown" }
  - "Make subtitles for clip.mp4" -> { file_path: "clip.mp4", response_format: "srt" }
  - "Transcribe meeting.m4a and also save docx + pdf + srt" -> { file_path: "meeting.m4a", export_formats: ["docx","pdf","srt"] }

Errors:
  - "Missing ELEVENLABS_API_KEY" if the key is not configured.
  - "File not found ..." if file_path is invalid.
  - "Validation error ..." (HTTP 422) for bad parameters or unsupported files.`,
    inputSchema: TranscribeInputSchema.shape,
    outputSchema: TranscribeOutputShape,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  async (args) => {
    try {
      if (!args.file_path && !args.source_url) {
        return errorResult(
          "Error: Provide either 'file_path' (a local file) or 'source_url' (a remote URL).",
        );
      }
      if (args.file_path && args.source_url) {
        return errorResult("Error: Provide only one of 'file_path' or 'source_url', not both.");
      }

      const wantsExports = (args.export_formats?.length ?? 0) > 0;
      // The export endpoint requires diarization + timestamps; enable them transparently.
      const diarize = args.diarize || wantsExports;
      let granularity = args.timestamps_granularity;
      if ((args.response_format === "srt" || wantsExports) && granularity === "none") {
        granularity = "word";
      }

      const resp = await transcribeAudio({
        filePath: args.file_path,
        sourceUrl: args.source_url,
        modelId: args.model_id,
        languageCode: args.language_code,
        diarize,
        numSpeakers: args.num_speakers,
        tagAudioEvents: args.tag_audio_events,
        timestampsGranularity: granularity,
        temperature: args.temperature,
        seed: args.seed,
        exportFormats: args.export_formats,
      });
      applyScript(resp, args.script);

      const body = renderBody(resp, args.response_format, args.model_id);
      const ext = EXT_BY_FORMAT[args.response_format];
      const structured = buildStructured(resp, args.model_id, args.response_format);

      const taken = new Set<string>();
      const outDir = args.output_dir
        ? resolvePath(args.output_dir)
        : defaultDir(args.file_path);
      const baseName = sourceBaseName(args.file_path, args.source_url);

      // Server-side exported formats (docx/pdf/srt/...).
      let exportedFiles: string[] = [];
      if (wantsExports) {
        exportedFiles = await saveExportedFormats(resp.additional_formats, outDir, baseName, taken);
        if (exportedFiles.length) structured.exported_files = exportedFiles;
      }

      // Explicit save of the inline transcript.
      let savedTo: string | undefined;
      if (args.save_to_path) {
        savedTo = uniquePath(resolvePath(args.save_to_path), taken);
        await writeFile(savedTo, body, "utf8");
      }

      // Keep the inline response within a sane size; auto-save the full text if needed.
      let displayText = body;
      if (body.length > CHARACTER_LIMIT) {
        if (!savedTo) {
          await mkdir(outDir, { recursive: true });
          savedTo = uniquePath(join(outDir, `${baseName}.${ext}`), taken);
          await writeFile(savedTo, body, "utf8");
        }
        displayText =
          body.slice(0, CHARACTER_LIMIT) +
          `\n\n[... transcript truncated for display (${body.length} characters total). ` +
          `Full transcript saved to: ${savedTo} ...]`;
      } else if (savedTo) {
        displayText = `${body}\n\n[Saved to: ${savedTo}]`;
      }
      if (savedTo) structured.saved_to = savedTo;

      if (exportedFiles.length) {
        displayText +=
          `\n\n[Exported ${exportedFiles.length} file(s):\n` +
          exportedFiles.map((p) => `  - ${p}`).join("\n") +
          "]";
      }

      return {
        content: [{ type: "text" as const, text: displayText }],
        structuredContent: structured,
      };
    } catch (err) {
      return errorResult(formatError(err));
    }
  },
);

server.registerTool(
  "elevenlabs_transcribe_batch",
  {
    title: "Batch Transcribe (ElevenLabs Scribe)",
    description: `Transcribe MANY audio/video files and/or URLs in one call. Each item is transcribed and its transcript is written to disk; a compact summary is returned (full transcripts are NOT inlined). Items are processed one at a time; a failure on one item does not stop the others.

Args:
  - file_paths (string[], optional): Local audio/video file paths.
  - source_urls (string[], optional): Remote URLs (incl. YouTube/TikTok). Provide at least one of file_paths/source_urls.
  - model_id, language_code, script, diarize, num_speakers, tag_audio_events, timestamps_granularity: same meaning as elevenlabs_transcribe_audio, applied to every item. language_code defaults to 'sr' (Serbian) and script to 'latin'; override per call or pass language_code 'auto'.
  - response_format ('text' | 'markdown' | 'json' | 'srt'): format each saved transcript uses. Default 'text'.
  - export_formats (array, optional): also save docx/pdf/html/srt/txt/segmented_json for every item.
  - output_dir (string, optional): directory for all outputs. Default: each source file's directory (cwd for URLs).

Returns:
  A markdown summary (one line per item: status, language, duration, word count, saved path), plus structuredContent:
  {
    "total": number, "succeeded": number, "failed": number,
    "results": [ { "input": string, "ok": boolean, "language_code"?: string,
                   "audio_duration_secs"?: number, "word_count"?: number,
                   "saved_to"?: string, "exported_files"?: string[], "error"?: string } ]
  }

Examples:
  - "Transcribe all three interviews to SRT" -> { file_paths: ["a.mp3","b.mp3","c.mp3"], response_format: "srt" }
  - "Transcribe these clips and save docx for each" -> { file_paths: [...], export_formats: ["docx"] }`,
    inputSchema: BatchTranscribeInputSchema.shape,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  async (args) => {
    try {
      const items: { kind: "file" | "url"; value: string }[] = [
        ...(args.file_paths ?? []).map((value) => ({ kind: "file" as const, value })),
        ...(args.source_urls ?? []).map((value) => ({ kind: "url" as const, value })),
      ];
      if (items.length === 0) {
        return errorResult(
          "Error: Provide at least one entry in 'file_paths' or 'source_urls'.",
        );
      }

      const wantsExports = (args.export_formats?.length ?? 0) > 0;
      const diarize = args.diarize || wantsExports;
      let granularity = args.timestamps_granularity;
      if ((args.response_format === "srt" || wantsExports) && granularity === "none") {
        granularity = "word";
      }

      interface BatchItemResult {
        input: string;
        ok: boolean;
        language_code?: string;
        audio_duration_secs?: number | null;
        word_count?: number;
        saved_to?: string;
        exported_files?: string[];
        error?: string;
      }

      const results: BatchItemResult[] = [];

      for (const item of items) {
        const filePath = item.kind === "file" ? item.value : undefined;
        const sourceUrl = item.kind === "url" ? item.value : undefined;
        try {
          const resp = await transcribeAudio({
            filePath,
            sourceUrl,
            modelId: args.model_id,
            languageCode: args.language_code,
            diarize,
            numSpeakers: args.num_speakers,
            tagAudioEvents: args.tag_audio_events,
            timestampsGranularity: granularity,
            exportFormats: args.export_formats,
          });
          applyScript(resp, args.script);

          const body = renderBody(resp, args.response_format, args.model_id);
          const ext = EXT_BY_FORMAT[args.response_format];
          const baseName = sourceBaseName(filePath, sourceUrl);
          const outDir = args.output_dir ? resolvePath(args.output_dir) : defaultDir(filePath);
          const taken = new Set<string>();

          const exported = wantsExports
            ? await saveExportedFormats(resp.additional_formats, outDir, baseName, taken)
            : [];

          await mkdir(outDir, { recursive: true });
          const savedTo = uniquePath(join(outDir, `${baseName}.${ext}`), taken);
          await writeFile(savedTo, body, "utf8");

          const words = resp.words ?? [];
          results.push({
            input: item.value,
            ok: true,
            language_code: resp.language_code,
            audio_duration_secs: resp.audio_duration_secs ?? null,
            word_count: words.filter((w) => w.type === "word").length,
            saved_to: savedTo,
            ...(exported.length ? { exported_files: exported } : {}),
          });
        } catch (err) {
          results.push({
            input: item.value,
            ok: false,
            error: formatError(err).replace(/^Error:\s*/, ""),
          });
        }
      }

      const succeeded = results.filter((r) => r.ok).length;
      const failed = results.length - succeeded;

      const lines = [`# Batch transcription: ${succeeded}/${results.length} succeeded`, ""];
      for (const r of results) {
        if (r.ok) {
          const dur = r.audio_duration_secs != null ? formatDuration(r.audio_duration_secs) : "?";
          lines.push(
            `- ✅ **${r.input}** — ${r.language_code ?? "?"}, ${dur}, ${r.word_count} words → \`${r.saved_to}\``,
          );
          if (r.exported_files?.length) {
            lines.push(`    exports: ${r.exported_files.map((p) => `\`${p}\``).join(", ")}`);
          }
        } else {
          lines.push(`- ❌ **${r.input}** — ${r.error}`);
        }
      }

      return {
        content: [{ type: "text" as const, text: lines.join("\n") }],
        structuredContent: { total: results.length, succeeded, failed, results },
      };
    } catch (err) {
      return errorResult(formatError(err));
    }
  },
);

server.registerTool(
  "elevenlabs_check_connection",
  {
    title: "Check ElevenLabs Connection",
    description: `Verify that the ELEVENLABS_API_KEY is configured and valid by querying the account.

Takes no arguments. Returns a short status report including the subscription tier and (for the TTS character quota) usage, when available. Use this to confirm setup before transcribing.

Note: this calls the account endpoint, which requires the "User: Read" permission on the API key. Transcription itself only needs the "Speech to Text" permission, so a restricted key may still transcribe even if this check reports a permission error.

Returns: human-readable status text. Reports "Missing ELEVENLABS_API_KEY" or an authorization error if the key is absent or invalid.`,
    inputSchema: {},
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  async () => {
    try {
      const info = await checkConnection();
      const sub = info.subscription ?? {};
      const lines = ["# ElevenLabs connection: OK", ""];
      if (sub.tier) lines.push(`- **Tier:** ${sub.tier}`);
      if (sub.status) lines.push(`- **Status:** ${sub.status}`);
      if (sub.character_count != null && sub.character_limit != null) {
        lines.push(
          `- **TTS characters used:** ${sub.character_count.toLocaleString()} / ${sub.character_limit.toLocaleString()}`,
        );
      }
      lines.push("", "The API key is valid and Speech-to-Text is ready to use.");
      return { content: [{ type: "text" as const, text: lines.join("\n") }] };
    } catch (err) {
      return errorResult(formatError(err));
    }
  },
);

// --- Entry point -----------------------------------------------------------

async function main(): Promise<void> {
  // Note: stdio servers must never write to stdout (it carries the protocol). Log to stderr.
  if (!process.env.ELEVENLABS_API_KEY) {
    console.error(
      `[${SERVER_NAME}] WARNING: ELEVENLABS_API_KEY is not set. Tools will return a configuration error until it is provided.`,
    );
  }
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`[${SERVER_NAME}] v${SERVER_VERSION} running on stdio`);
}

main().catch((err) => {
  console.error(`[${SERVER_NAME}] fatal:`, err instanceof Error ? err.message : err);
  process.exit(1);
});
