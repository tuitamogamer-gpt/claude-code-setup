/**
 * Formatting helpers: SRT subtitles, speaker-grouped markdown, and time formatting.
 */
/** Format seconds as an SRT timestamp: HH:MM:SS,mmm */
export function formatSrtTimestamp(totalSeconds) {
    const ms = Math.max(0, Math.round(totalSeconds * 1000));
    const hours = Math.floor(ms / 3_600_000);
    const minutes = Math.floor((ms % 3_600_000) / 60_000);
    const seconds = Math.floor((ms % 60_000) / 1000);
    const millis = ms % 1000;
    const pad = (n, len = 2) => String(n).padStart(len, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad(millis, 3)}`;
}
/** Human-readable duration: "1:23" or "1:02:03". */
export function formatDuration(secs) {
    const total = Math.round(secs);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
}
function collapseSpaces(text) {
    return text.replace(/\s+/g, " ").trim();
}
/** Map raw speaker ids (e.g. "speaker_0") to friendly labels ("Speaker 1") in order of appearance. */
function speakerLabeller() {
    const labels = new Map();
    return (id) => {
        const key = id ?? "unknown";
        if (!labels.has(key)) {
            labels.set(key, key === "unknown" ? "Speaker" : `Speaker ${labels.size + 1}`);
        }
        return labels.get(key);
    };
}
/** Group consecutive tokens by speaker_id into readable segments. */
export function groupBySpeaker(words) {
    const label = speakerLabeller();
    const segments = [];
    let current = null;
    const flush = () => {
        if (current) {
            const text = collapseSpaces(current.tokens.join(""));
            if (text)
                segments.push({ speaker: label(current.id), text });
        }
    };
    for (const word of words) {
        const id = word.speaker_id ?? null;
        // Unattributed tokens (e.g. spacing) stay with the current speaker instead of
        // starting a spurious "unknown" segment that would break speaker numbering.
        if (current && (id === null || id === current.id)) {
            current.tokens.push(word.text);
            continue;
        }
        flush();
        current = { id: id ?? "unknown", tokens: [word.text] };
    }
    flush();
    return segments;
}
/** Build a markdown transcript with a metadata header; speaker-labelled when diarized. */
export function buildMarkdown(resp, modelId) {
    const lines = ["# Transcript", ""];
    const meta = [];
    if (resp.language_code) {
        const conf = resp.language_probability != null
            ? ` (confidence ${(resp.language_probability * 100).toFixed(1)}%)`
            : "";
        meta.push(`- **Language:** ${resp.language_code}${conf}`);
    }
    if (resp.audio_duration_secs != null) {
        meta.push(`- **Duration:** ${formatDuration(resp.audio_duration_secs)}`);
    }
    meta.push(`- **Model:** ${modelId}`);
    const words = resp.words ?? [];
    const speakers = new Set(words.map((w) => w.speaker_id).filter((s) => Boolean(s)));
    if (speakers.size > 0) {
        meta.push(`- **Speakers detected:** ${speakers.size}`);
    }
    lines.push(...meta, "", "---", "");
    if (speakers.size > 1) {
        for (const seg of groupBySpeaker(words)) {
            lines.push(`**${seg.speaker}:** ${seg.text}`, "");
        }
    }
    else {
        lines.push(resp.text ?? "");
    }
    return lines.join("\n").trimEnd() + "\n";
}
/** Build an SRT subtitle file from timestamped word tokens. */
export function buildSrt(words) {
    const MAX_CHARS = 84; // ~2 lines
    const MAX_DURATION = 6; // seconds
    const MAX_GAP = 1.0; // seconds of silence that forces a new cue
    const cues = [];
    let current = null;
    let prevEnd = null;
    const flush = () => {
        if (current && current.tokens.length > 0) {
            const text = collapseSpaces(current.tokens.join(""));
            if (text)
                cues.push({ start: current.start, end: current.end, text });
        }
        current = null;
    };
    for (const word of words) {
        const timed = (word.type === "word" || word.type === "audio_event") &&
            typeof word.start === "number" &&
            typeof word.end === "number";
        if (timed) {
            const start = word.start;
            let end = word.end;
            const gap = prevEnd != null && start - prevEnd > MAX_GAP;
            const speakerChange = current != null && word.speaker_id != null && current.speaker !== word.speaker_id;
            // Measure length INCLUDING the incoming token so a cue never overshoots MAX_CHARS.
            const wouldOverflow = current != null &&
                (current.tokens.join("").length + word.text.length > MAX_CHARS ||
                    end - current.start >= MAX_DURATION);
            if (current && (gap || speakerChange || wouldOverflow))
                flush();
            if (!current)
                current = { start, end, tokens: [], speaker: word.speaker_id ?? null };
            // Guard against out-of-order timestamps so a cue never runs backwards.
            if (end < current.start)
                end = current.start;
            current.tokens.push(word.text);
            current.end = Math.max(current.end, end);
            prevEnd = end;
            // Close the cue at sentence boundaries for natural subtitle chunks.
            if (/[.!?…]["')\]]?$/.test(word.text.trim()))
                flush();
        }
        else if (current) {
            // Spacing / untimed tokens keep the spacing of the reconstructed text.
            current.tokens.push(word.text);
        }
    }
    flush();
    return cues
        .map((cue, i) => `${i + 1}\n${formatSrtTimestamp(cue.start)} --> ${formatSrtTimestamp(cue.end)}\n${cue.text}\n`)
        .join("\n");
}
//# sourceMappingURL=format.js.map