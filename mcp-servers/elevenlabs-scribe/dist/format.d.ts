/**
 * Formatting helpers: SRT subtitles, speaker-grouped markdown, and time formatting.
 */
import type { TranscriptionResponse, TranscriptWord } from "./types.js";
/** Format seconds as an SRT timestamp: HH:MM:SS,mmm */
export declare function formatSrtTimestamp(totalSeconds: number): string;
/** Human-readable duration: "1:23" or "1:02:03". */
export declare function formatDuration(secs: number): string;
export interface SpeakerSegment {
    speaker: string;
    text: string;
}
/** Group consecutive tokens by speaker_id into readable segments. */
export declare function groupBySpeaker(words: TranscriptWord[]): SpeakerSegment[];
/** Build a markdown transcript with a metadata header; speaker-labelled when diarized. */
export declare function buildMarkdown(resp: TranscriptionResponse, modelId: string): string;
/** Build an SRT subtitle file from timestamped word tokens. */
export declare function buildSrt(words: TranscriptWord[]): string;
//# sourceMappingURL=format.d.ts.map