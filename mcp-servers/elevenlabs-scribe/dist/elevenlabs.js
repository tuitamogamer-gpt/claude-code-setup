/**
 * ElevenLabs API client: Speech-to-Text transcription and a lightweight connection check.
 *
 * Uses the native fetch / FormData / Blob globals (Node 18+). Local files are streamed
 * lazily via fs.openAsBlob so we never load a multi-gigabyte file fully into memory.
 */
import { openAsBlob } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { basename } from "node:path";
import { STT_ENDPOINT, USER_ENDPOINT, DEFAULT_TIMEOUT_MS, CONNECTION_TIMEOUT_MS, MAX_FILE_BYTES, } from "./constants.js";
/** Error type carrying an HTTP status and the raw API detail when available. */
export class ElevenLabsError extends Error {
    status;
    detail;
    constructor(message, status, detail) {
        super(message);
        this.name = "ElevenLabsError";
        this.status = status;
        this.detail = detail;
    }
}
/** Read and validate the API key from the environment. */
export function getApiKey() {
    const key = process.env.ELEVENLABS_API_KEY?.trim();
    if (!key) {
        throw new ElevenLabsError("Missing ELEVENLABS_API_KEY. Set it in your MCP client configuration (the server's env) before transcribing. " +
            "Create a key at https://elevenlabs.io/app/settings/api-keys.");
    }
    return key;
}
/** Create a Blob backed by a file without reading it fully into memory (falls back to a buffer). */
async function fileToBlob(filePath) {
    try {
        return await openAsBlob(filePath);
    }
    catch {
        const buffer = await readFile(filePath);
        return new Blob([buffer]);
    }
}
/** Pull a useful human message out of an ElevenLabs error body (handles string, object, and 422 arrays). */
function extractApiMessage(detail) {
    if (!detail || typeof detail !== "object") {
        return typeof detail === "string" && detail ? detail : undefined;
    }
    const inner = detail.detail ?? detail;
    if (typeof inner === "string")
        return inner;
    if (Array.isArray(inner)) {
        const msgs = inner
            .map((e) => e && typeof e === "object"
            ? (e.msg ?? e.message)
            : undefined)
            .filter((m) => typeof m === "string" && m.length > 0);
        return msgs.length ? msgs.join("; ") : undefined;
    }
    if (inner && typeof inner === "object") {
        const obj = inner;
        const m = obj.message ?? obj.msg;
        return typeof m === "string" ? m : undefined;
    }
    return undefined;
}
const STATUS_HINTS = {
    401: "Invalid or unauthorized ELEVENLABS_API_KEY. Check the key in your MCP config.",
    403: "Forbidden. Your API key lacks permission for Speech-to-Text, or the resource is not accessible.",
    404: "Not found. The Speech-to-Text endpoint path may have changed.",
    413: "Payload too large. The file exceeds upload limits; host it and use source_url instead.",
    422: "Validation error. Check parameters such as model_id, file format, or language_code.",
    429: "Rate limit or quota exceeded. Wait and retry, or review your ElevenLabs plan limits.",
    500: "ElevenLabs server error. Try again shortly.",
    503: "ElevenLabs service unavailable. Try again shortly.",
};
/** Turn a non-2xx Response into a descriptive ElevenLabsError. */
async function buildHttpError(res) {
    let bodyText = "";
    let detail;
    try {
        bodyText = await res.text();
        detail = bodyText ? JSON.parse(bodyText) : undefined;
    }
    catch {
        detail = bodyText;
    }
    const hint = STATUS_HINTS[res.status] ?? `ElevenLabs API error (HTTP ${res.status}).`;
    const apiMessage = extractApiMessage(detail) ?? (bodyText ? bodyText.slice(0, 500) : "");
    const message = apiMessage ? `${hint} Details: ${apiMessage}` : hint;
    return new ElevenLabsError(message, res.status, detail);
}
/** POST audio to the Speech-to-Text endpoint and return the parsed transcription. */
export async function transcribeAudio(params) {
    const apiKey = getApiKey();
    const form = new FormData();
    form.append("model_id", params.modelId);
    if (params.filePath) {
        const info = await stat(params.filePath).catch(() => null);
        if (!info || !info.isFile()) {
            throw new ElevenLabsError(`File not found or not a regular file: ${params.filePath}. Provide a valid path to an audio/video file.`);
        }
        if (info.size === 0) {
            throw new ElevenLabsError(`File is empty: ${params.filePath}`);
        }
        if (info.size > MAX_FILE_BYTES) {
            throw new ElevenLabsError(`File is ${(info.size / 1e9).toFixed(2)} GB, which exceeds the 5 GB direct-upload limit. ` +
                `Host the file and pass source_url instead.`);
        }
        const blob = await fileToBlob(params.filePath);
        form.append("file", blob, basename(params.filePath));
    }
    else if (params.sourceUrl) {
        form.append("source_url", params.sourceUrl);
    }
    else {
        throw new ElevenLabsError("Provide either filePath or sourceUrl.");
    }
    // A language_code of "auto" (or empty) means: let ElevenLabs auto-detect.
    if (params.languageCode && params.languageCode.toLowerCase() !== "auto") {
        form.append("language_code", params.languageCode);
    }
    form.append("diarize", String(params.diarize));
    if (params.numSpeakers != null)
        form.append("num_speakers", String(params.numSpeakers));
    form.append("tag_audio_events", String(params.tagAudioEvents));
    form.append("timestamps_granularity", params.timestampsGranularity);
    if (params.temperature != null)
        form.append("temperature", String(params.temperature));
    if (params.seed != null)
        form.append("seed", String(params.seed));
    if (params.exportFormats && params.exportFormats.length > 0) {
        // The API requires diarization + timestamps when additional formats are requested;
        // callers enable those before reaching here.
        form.append("additional_formats", JSON.stringify(params.exportFormats.map((format) => ({ format }))));
    }
    let res;
    try {
        res = await fetch(STT_ENDPOINT, {
            method: "POST",
            headers: { "xi-api-key": apiKey },
            body: form,
            signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
        });
    }
    catch (err) {
        if (err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")) {
            throw new ElevenLabsError(`Request timed out after ${Math.round(DEFAULT_TIMEOUT_MS / 1000)}s. ` +
                `For very long audio, raise ELEVENLABS_TIMEOUT_MS in the server env.`);
        }
        throw new ElevenLabsError(`Network error contacting ElevenLabs: ${err instanceof Error ? err.message : String(err)}`);
    }
    if (!res.ok) {
        throw await buildHttpError(res);
    }
    return (await res.json());
}
/** GET the current user to verify the API key is valid and report basic account info. */
export async function checkConnection() {
    const apiKey = getApiKey();
    let res;
    try {
        res = await fetch(USER_ENDPOINT, {
            headers: { "xi-api-key": apiKey },
            signal: AbortSignal.timeout(CONNECTION_TIMEOUT_MS),
        });
    }
    catch (err) {
        if (err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")) {
            throw new ElevenLabsError("Connection check timed out. Check your network connection.");
        }
        throw new ElevenLabsError(`Network error contacting ElevenLabs: ${err instanceof Error ? err.message : String(err)}`);
    }
    if (!res.ok) {
        throw await buildHttpError(res);
    }
    return (await res.json());
}
//# sourceMappingURL=elevenlabs.js.map