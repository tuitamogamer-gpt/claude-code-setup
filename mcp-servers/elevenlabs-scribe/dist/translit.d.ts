/**
 * Serbian Cyrillic → Latin (Gajica) transliteration.
 *
 * ElevenLabs returns Serbian ("srp") in Cyrillic. Serbian is digraphically
 * standardized, so Cyrillic↔Latin is a deterministic, lossless 1:1 mapping
 * (љ→lj, њ→nj, џ→dž, ђ→đ, ћ→ć, ч→č, ш→š, ж→ž). This converts the transcript to
 * Latin without re-running transcription.
 */
import type { TranscriptionResponse } from "./types.js";
/** Transliterate a single string of Serbian Cyrillic to Latin. Non-Cyrillic passes through. */
export declare function serbianCyrillicToLatin(text: string): string;
/** Transliterate text, words, character timings, and text-based exports in place. */
export declare function transliterateResponseInPlace(resp: TranscriptionResponse): void;
//# sourceMappingURL=translit.d.ts.map