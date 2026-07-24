/**
 * TypeScript interfaces describing the ElevenLabs Speech-to-Text API responses.
 * See: https://elevenlabs.io/docs/api-reference/speech-to-text/convert
 */
export interface WordCharacter {
    text: string;
    start: number | null;
    end: number | null;
}
export interface TranscriptWord {
    /** The token text (a word, a run of spacing, or an audio event label). */
    text: string;
    /** Start time in seconds (null when timestamps_granularity is "none" or for some spacing tokens). */
    start: number | null;
    /** End time in seconds. */
    end: number | null;
    /** "word" for normal words, "spacing" for whitespace, "audio_event" for non-speech sounds like (laughter). */
    type: "word" | "spacing" | "audio_event" | string;
    /** Speaker label when diarize=true (e.g. "speaker_0"). */
    speaker_id?: string | null;
    /** Model log-probability for the token (closer to 0 = more confident). */
    logprob?: number;
    /** Per-character timing when timestamps_granularity="character". */
    characters?: WordCharacter[] | null;
    /** Channel index for multichannel audio. */
    channel_index?: number | null;
}
/** A server-side exported transcript format (srt/txt/html/docx/pdf/segmented_json). */
export interface AdditionalFormat {
    /** The format that was requested (e.g. "srt", "docx"). */
    requested_format: string;
    /** File extension for the exported content (e.g. "srt", "docx"). */
    file_extension: string;
    /** MIME type of the content. */
    content_type: string;
    /** True for binary formats (docx, pdf) whose content is base64-encoded. */
    is_base64_encoded: boolean;
    /** The exported content (plain text, or base64 when is_base64_encoded). */
    content: string;
}
export interface TranscriptionResponse {
    /** Detected language code (e.g. "eng", "hrv"). */
    language_code?: string;
    /** Confidence of the detected language (0-1). */
    language_probability?: number;
    /** Full transcript text. */
    text: string;
    /** Token-level breakdown with timestamps. */
    words?: TranscriptWord[];
    /** Server-side transcription identifier. */
    transcription_id?: string | null;
    /** Total transcribed audio length in seconds. */
    audio_duration_secs?: number | null;
    /** Requested additional export formats (docx/srt/etc.), if any. */
    additional_formats?: AdditionalFormat[] | null;
    /** Present only for multichannel responses. */
    transcripts?: TranscriptionResponse[];
}
export interface SubscriptionInfo {
    tier?: string;
    status?: string;
    character_count?: number;
    character_limit?: number;
    [key: string]: unknown;
}
export interface UserInfo {
    user_id?: string;
    subscription?: SubscriptionInfo;
    is_new_user?: boolean;
    [key: string]: unknown;
}
//# sourceMappingURL=types.d.ts.map