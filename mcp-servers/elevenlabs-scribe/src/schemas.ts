/**
 * Zod input schemas for the MCP tools.
 */

import { z } from "zod";
import { DEFAULT_LANGUAGE, DEFAULT_MODEL_ID, DEFAULT_SCRIPT } from "./constants.js";

const SCRIPT_DESCRIPTION =
  `Output script for Serbian: 'latin' (default) transliterates Cyrillic→Latin; 'cyrillic' keeps ElevenLabs' native Serbian Cyrillic. Only affects Serbian (detected 'srp'); other languages are unchanged. Note: docx/pdf exports keep their original script.`;

export const RESPONSE_FORMATS = ["text", "markdown", "json", "srt"] as const;
export const TIMESTAMP_GRANULARITIES = ["none", "word", "character"] as const;
export const EXPORT_FORMATS = ["docx", "pdf", "html", "srt", "txt", "segmented_json"] as const;

export const TranscribeInputSchema = z.object({
  file_path: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Absolute or relative path to a local audio or video file to transcribe. Provide EITHER this OR source_url (exactly one). Max 5 GB.",
    ),
  source_url: z
    .string()
    .url()
    .optional()
    .describe(
      "Public URL to an audio/video file (also supports YouTube and TikTok links). Provide EITHER this OR file_path (exactly one). Max 2 GB.",
    ),
  model_id: z
    .string()
    .default(DEFAULT_MODEL_ID)
    .describe(
      `Scribe model id. 'scribe_v2' (newer, more accurate) or 'scribe_v1' (previous generation). Default: '${DEFAULT_MODEL_ID}'.`,
    ),
  language_code: z
    .string()
    .default(DEFAULT_LANGUAGE)
    .describe(
      `ISO-639-1/3 language code. Default: '${DEFAULT_LANGUAGE}' (Serbian). Pass another code to override (e.g. 'hr' for Croatian, 'en' for English), or 'auto' to let the model auto-detect.`,
    ),
  script: z.enum(["latin", "cyrillic"]).default(DEFAULT_SCRIPT).describe(SCRIPT_DESCRIPTION),
  diarize: z
    .boolean()
    .default(false)
    .describe(
      "Detect and label different speakers. Set true for multi-speaker recordings such as interviews or meetings.",
    ),
  num_speakers: z
    .number()
    .int()
    .min(1)
    .max(32)
    .optional()
    .describe(
      "Expected maximum number of speakers (1-32). Only meaningful with diarize=true. Omit to let the model decide.",
    ),
  tag_audio_events: z
    .boolean()
    .default(true)
    .describe("Tag non-speech events like (laughter) or (applause) inside the transcript."),
  timestamps_granularity: z
    .enum(TIMESTAMP_GRANULARITIES)
    .default("word")
    .describe(
      "Timestamp detail: 'none', 'word' (default), or 'character'. 'word' or finer is required for srt output.",
    ),
  temperature: z
    .number()
    .min(0)
    .max(2)
    .optional()
    .describe("Sampling randomness 0.0-2.0. Lower is more deterministic. Optional."),
  seed: z
    .number()
    .int()
    .min(0)
    .max(2147483647)
    .optional()
    .describe("Seed for reproducible sampling. Optional."),
  response_format: z
    .enum(RESPONSE_FORMATS)
    .default("text")
    .describe(
      "Output shape: 'text' (plain transcript, default), 'markdown' (metadata header + speaker-labelled body), 'json' (full API response incl. word timestamps), or 'srt' (subtitle file).",
    ),
  save_to_path: z
    .string()
    .optional()
    .describe(
      "If set, also write the formatted transcript to this file path on disk (e.g. '/Users/me/out.txt' or 'subtitles.srt'). Relative paths resolve against the server's working directory.",
    ),
  export_formats: z
    .array(z.enum(EXPORT_FORMATS))
    .optional()
    .describe(
      "Also request server-side exported transcript files from ElevenLabs and write them to disk. Allowed: 'docx', 'pdf', 'html', 'srt', 'txt', 'segmented_json'. Auto-enables diarization + word timestamps (required by the API). Binary formats (docx/pdf) are decoded and saved.",
    ),
  output_dir: z
    .string()
    .optional()
    .describe(
      "Directory for exported files (and the auto-saved transcript). Default: the source file's directory, or the current directory for URLs.",
    ),
});

export type TranscribeInput = z.infer<typeof TranscribeInputSchema>;

export const BatchTranscribeInputSchema = z.object({
  file_paths: z
    .array(z.string().min(1))
    .optional()
    .describe("List of local audio/video file paths to transcribe. Combine with source_urls as needed."),
  source_urls: z
    .array(z.string().url())
    .optional()
    .describe("List of remote URLs (incl. YouTube/TikTok) to transcribe."),
  model_id: z
    .string()
    .default(DEFAULT_MODEL_ID)
    .describe(`Scribe model id (default: '${DEFAULT_MODEL_ID}'). 'scribe_v2' or 'scribe_v1'.`),
  language_code: z
    .string()
    .default(DEFAULT_LANGUAGE)
    .describe(
      `ISO-639-1/3 language code applied to every item. Default: '${DEFAULT_LANGUAGE}' (Serbian). Override with e.g. 'hr'/'en', or 'auto' to auto-detect.`,
    ),
  script: z.enum(["latin", "cyrillic"]).default(DEFAULT_SCRIPT).describe(SCRIPT_DESCRIPTION),
  diarize: z.boolean().default(false).describe("Label different speakers in every item."),
  num_speakers: z
    .number()
    .int()
    .min(1)
    .max(32)
    .optional()
    .describe("Expected maximum number of speakers (1-32), used with diarize."),
  tag_audio_events: z.boolean().default(true).describe("Tag non-speech events like (laughter)."),
  timestamps_granularity: z
    .enum(TIMESTAMP_GRANULARITIES)
    .default("word")
    .describe("Timestamp detail for every item: 'none', 'word' (default), or 'character'."),
  response_format: z
    .enum(RESPONSE_FORMATS)
    .default("text")
    .describe("Format for each saved transcript: 'text', 'markdown', 'json', or 'srt'. Default 'text'."),
  export_formats: z
    .array(z.enum(EXPORT_FORMATS))
    .optional()
    .describe("Server-side export formats to also save for every item (docx/pdf/html/srt/txt/segmented_json)."),
  output_dir: z
    .string()
    .optional()
    .describe(
      "Directory to write all transcripts and exports into. Default: each source file's directory (or the current directory for URLs).",
    ),
});

export type BatchTranscribeInput = z.infer<typeof BatchTranscribeInputSchema>;
