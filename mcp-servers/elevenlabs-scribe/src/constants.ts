/**
 * Shared constants for the ElevenLabs Scribe MCP server.
 */

export const API_BASE_URL = "https://api.elevenlabs.io/v1";
export const STT_ENDPOINT = `${API_BASE_URL}/speech-to-text`;
export const USER_ENDPOINT = `${API_BASE_URL}/user`;

/**
 * Default Scribe model. scribe_v2 is the newer, more accurate model; scribe_v1 is
 * the previous generation. Override globally via the ELEVENLABS_DEFAULT_MODEL env var
 * or per call via the model_id argument.
 */
export const DEFAULT_MODEL_ID = process.env.ELEVENLABS_DEFAULT_MODEL?.trim() || "scribe_v2";

/**
 * Default transcription language (ISO-639-1/3). Serbian ("sr", Cyrillic) by default.
 * Override globally via the ELEVENLABS_DEFAULT_LANGUAGE env var, per call via the
 * language_code argument, or pass "auto" to let the model auto-detect.
 */
export const DEFAULT_LANGUAGE = process.env.ELEVENLABS_DEFAULT_LANGUAGE?.trim() || "sr";

/**
 * Default output script for Serbian: "latin" (transliterate Cyrillic→Latin) or
 * "cyrillic" (keep ElevenLabs' native output). Latin by default; override via the
 * ELEVENLABS_DEFAULT_SCRIPT env var or the per-call `script` argument.
 */
export const DEFAULT_SCRIPT: "latin" | "cyrillic" =
  process.env.ELEVENLABS_DEFAULT_SCRIPT?.trim().toLowerCase() === "cyrillic" ? "cyrillic" : "latin";

/** Maximum response size (characters) before we truncate the displayed text and save the full transcript to disk. */
export const CHARACTER_LIMIT = 25000;

/** ElevenLabs direct upload limit (5 GB). Larger files must be hosted and passed via source_url. */
export const MAX_FILE_BYTES = 5 * 1024 * 1024 * 1024;

/** Request timeout for transcription. Long audio can take a while, so default to 1 hour; configurable via env. */
export const DEFAULT_TIMEOUT_MS = (() => {
  const raw = process.env.ELEVENLABS_TIMEOUT_MS;
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 3_600_000;
})();

/** Shorter timeout for the lightweight connection check. */
export const CONNECTION_TIMEOUT_MS = 30_000;
