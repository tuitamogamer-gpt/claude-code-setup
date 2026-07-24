/**
 * ElevenLabs API client: Speech-to-Text transcription and a lightweight connection check.
 *
 * Uses the native fetch / FormData / Blob globals (Node 18+). Local files are streamed
 * lazily via fs.openAsBlob so we never load a multi-gigabyte file fully into memory.
 */
import type { TranscriptionResponse, UserInfo } from "./types.js";
/** Error type carrying an HTTP status and the raw API detail when available. */
export declare class ElevenLabsError extends Error {
    status?: number;
    detail?: unknown;
    constructor(message: string, status?: number, detail?: unknown);
}
/** Read and validate the API key from the environment. */
export declare function getApiKey(): string;
export interface TranscribeParams {
    filePath?: string;
    sourceUrl?: string;
    modelId: string;
    languageCode?: string;
    diarize: boolean;
    numSpeakers?: number;
    tagAudioEvents: boolean;
    timestampsGranularity: "none" | "word" | "character";
    temperature?: number;
    seed?: number;
    /** Server-side export formats to request (docx, pdf, html, srt, txt, segmented_json). */
    exportFormats?: string[];
}
/** POST audio to the Speech-to-Text endpoint and return the parsed transcription. */
export declare function transcribeAudio(params: TranscribeParams): Promise<TranscriptionResponse>;
/** GET the current user to verify the API key is valid and report basic account info. */
export declare function checkConnection(): Promise<UserInfo>;
//# sourceMappingURL=elevenlabs.d.ts.map