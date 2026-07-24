/**
 * Shared transcription helpers used by both the single and batch tools:
 * rendering output formats, building structured content, deriving file names,
 * and writing server-side exported formats (docx/pdf/srt/...) to disk.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { basename, dirname, extname, isAbsolute, join, resolve } from "node:path";
import { buildMarkdown, buildSrt } from "./format.js";
export const EXT_BY_FORMAT = {
    text: "txt",
    markdown: "md",
    json: "json",
    srt: "srt",
};
export function resolvePath(p) {
    return isAbsolute(p) ? p : resolve(process.cwd(), p);
}
/** Directory to write outputs into: the source file's directory, or cwd for URLs. */
export function defaultDir(filePath) {
    return filePath ? dirname(resolvePath(filePath)) : process.cwd();
}
/** Base file name (without extension) derived from a local path or a URL. */
export function sourceBaseName(filePath, sourceUrl) {
    if (filePath)
        return basename(filePath, extname(filePath)) || "transcript";
    if (sourceUrl) {
        try {
            const u = new URL(sourceUrl);
            const last = basename(u.pathname);
            const name = (last || u.hostname).replace(/\.[^.]+$/, "");
            return name || "transcript";
        }
        catch {
            return "transcript";
        }
    }
    return "transcript";
}
/** Reserve a unique path; if already taken, insert a ".transcript" infix before the extension. */
export function uniquePath(desired, taken) {
    if (!taken.has(desired)) {
        taken.add(desired);
        return desired;
    }
    const ext = extname(desired);
    const alt = `${desired.slice(0, desired.length - ext.length)}.transcript${ext}`;
    taken.add(alt);
    return alt;
}
/** Render the API response into the requested output format. */
export function renderBody(resp, format, modelId) {
    switch (format) {
        case "json":
            return JSON.stringify(resp, null, 2);
        case "markdown":
            return buildMarkdown(resp, modelId);
        case "srt": {
            const srt = buildSrt(resp.words ?? []);
            return srt.trim()
                ? srt
                : "(No timestamped words were returned, so the SRT is empty. Ensure timestamps_granularity is 'word' or 'character'.)";
        }
        case "text":
        default:
            return resp.text ?? "";
    }
}
/** Build the machine-readable structured content (without saved_to / exported_files). */
export function buildStructured(resp, modelId, format) {
    const words = resp.words ?? [];
    const speakers = new Set(words.map((w) => w.speaker_id).filter((s) => Boolean(s)));
    const structured = {
        text: resp.text ?? "",
        word_count: words.filter((w) => w.type === "word").length,
        model_id: modelId,
        format,
    };
    if (resp.language_code)
        structured.language_code = resp.language_code;
    if (resp.language_probability != null)
        structured.language_probability = resp.language_probability;
    if (resp.audio_duration_secs != null)
        structured.audio_duration_secs = resp.audio_duration_secs;
    if (speakers.size > 0)
        structured.speakers_detected = speakers.size;
    if (resp.transcription_id)
        structured.transcription_id = resp.transcription_id;
    return structured;
}
/** Write each server-side exported format to `<outputDir>/<baseName>.<ext>` and return the paths. */
export async function saveExportedFormats(formats, outputDir, baseName, taken) {
    if (!formats || formats.length === 0)
        return [];
    await mkdir(outputDir, { recursive: true });
    const written = [];
    for (const f of formats) {
        const ext = (f.file_extension || f.requested_format || "txt").replace(/^\./, "");
        const target = uniquePath(join(outputDir, `${baseName}.${ext}`), taken);
        if (f.is_base64_encoded) {
            await writeFile(target, Buffer.from(f.content ?? "", "base64"));
        }
        else {
            await writeFile(target, f.content ?? "", "utf8");
        }
        written.push(target);
    }
    return written;
}
//# sourceMappingURL=core.js.map