/**
 * Serbian Cyrillic → Latin (Gajica) transliteration.
 *
 * ElevenLabs returns Serbian ("srp") in Cyrillic. Serbian is digraphically
 * standardized, so Cyrillic↔Latin is a deterministic, lossless 1:1 mapping
 * (љ→lj, њ→nj, џ→dž, ђ→đ, ћ→ć, ч→č, ш→š, ж→ž). This converts the transcript to
 * Latin without re-running transcription.
 */
const SINGLE = {
    а: "a", б: "b", в: "v", г: "g", д: "d", ђ: "đ", е: "e", ж: "ž", з: "z",
    и: "i", ј: "j", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", ћ: "ć", у: "u", ф: "f", х: "h", ц: "c", ч: "č", ш: "š",
    А: "A", Б: "B", В: "V", Г: "G", Д: "D", Ђ: "Đ", Е: "E", Ж: "Ž", З: "Z",
    И: "I", Ј: "J", К: "K", Л: "L", М: "M", Н: "N", О: "O", П: "P", Р: "R",
    С: "S", Т: "T", Ћ: "Ć", У: "U", Ф: "F", Х: "H", Ц: "C", Ч: "Č", Ш: "Š",
};
const LOWER_DIGRAPH = { љ: "lj", њ: "nj", џ: "dž" };
// Uppercase digraphs map to [ALL-CAPS, Title-case] depending on the next letter.
const UPPER_DIGRAPH = {
    Љ: ["LJ", "Lj"],
    Њ: ["NJ", "Nj"],
    Џ: ["DŽ", "Dž"],
};
function isUpperLetter(ch) {
    return !!ch && ch !== ch.toLowerCase() && ch === ch.toUpperCase();
}
/** Transliterate a single string of Serbian Cyrillic to Latin. Non-Cyrillic passes through. */
export function serbianCyrillicToLatin(text) {
    if (!text)
        return text;
    const chars = Array.from(text);
    let out = "";
    for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        const lower = LOWER_DIGRAPH[ch];
        if (lower) {
            out += lower;
            continue;
        }
        const upper = UPPER_DIGRAPH[ch];
        if (upper) {
            // "ЏЕЗ" → "DŽEZ" (next is upper) but "Џез" / standalone → "Dž".
            out += isUpperLetter(chars[i + 1]) ? upper[0] : upper[1];
            continue;
        }
        out += SINGLE[ch] ?? ch;
    }
    return out;
}
/** Transliterate text, words, character timings, and text-based exports in place. */
export function transliterateResponseInPlace(resp) {
    if (resp.text)
        resp.text = serbianCyrillicToLatin(resp.text);
    for (const word of resp.words ?? []) {
        if (word.text)
            word.text = serbianCyrillicToLatin(word.text);
        if (word.characters) {
            for (const c of word.characters) {
                if (c.text)
                    c.text = serbianCyrillicToLatin(c.text);
            }
        }
    }
    // Text-based server exports (srt/txt/html/segmented_json). Binary docx/pdf are
    // base64 and keep their original script.
    for (const f of resp.additional_formats ?? []) {
        if (f && !f.is_base64_encoded && f.content) {
            f.content = serbianCyrillicToLatin(f.content);
        }
    }
}
//# sourceMappingURL=translit.js.map