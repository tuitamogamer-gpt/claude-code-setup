/**
 * Shared constants for the ElevenLabs Scribe MCP server.
 */
export declare const API_BASE_URL = "https://api.elevenlabs.io/v1";
export declare const STT_ENDPOINT = "https://api.elevenlabs.io/v1/speech-to-text";
export declare const USER_ENDPOINT = "https://api.elevenlabs.io/v1/user";
/**
 * Default Scribe model. scribe_v2 is the newer, more accurate model; scribe_v1 is
 * the previous generation. Override globally via the ELEVENLABS_DEFAULT_MODEL env var
 * or per call via the model_id argument.
 */
export declare const DEFAULT_MODEL_ID: string;
/**
 * Default transcription language (ISO-639-1/3). Serbian ("sr", Cyrillic) by default.
 * Override globally via the ELEVENLABS_DEFAULT_LANGUAGE env var, per call via the
 * language_code argument, or pass "auto" to let the model auto-detect.
 */
export declare const DEFAULT_LANGUAGE: string;
/**
 * Default output script for Serbian: "latin" (transliterate Cyrillic→Latin) or
 * "cyrillic" (keep ElevenLabs' native output). Latin by default; override via the
 * ELEVENLABS_DEFAULT_SCRIPT env var or the per-call `script` argument.
 */
export declare const DEFAULT_SCRIPT: "latin" | "cyrillic";
/** Maximum response size (characters) before we truncate the displayed text and save the full transcript to disk. */
export declare const CHARACTER_LIMIT = 25000;
/** ElevenLabs direct upload limit (5 GB). Larger files must be hosted and passed via source_url. */
export declare const MAX_FILE_BYTES: number;
/** Request timeout for transcription. Long audio can take a while, so default to 1 hour; configurable via env. */
export declare const DEFAULT_TIMEOUT_MS: number;
/** Shorter timeout for the lightweight connection check. */
export declare const CONNECTION_TIMEOUT_MS = 30000;
//# sourceMappingURL=constants.d.ts.map