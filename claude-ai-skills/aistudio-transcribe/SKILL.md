---
name: aistudio-transcribe
description: >
  Transcribe YouTube videos using Google AI Studio (Gemini) via browser automation. Use this skill whenever the user wants to: transcribe a video, get text with timestamps from a YouTube video, convert video speech to text, create subtitles or captions from a video, or analyze video content for quotes/excerpts. Also triggers on: "transkribuj video", "napravi transkripciju", "izvuci tekst iz videa", "timestampovi", "pretvorite govor u tekst", or any request that involves a YouTube URL and extracting spoken content. Use this skill even if the user only says "transcribe this" and provides a YouTube link.
---

# Google AI Studio Video Transcription

This skill automates transcribing YouTube videos using Gemini in Google AI Studio via browser automation. You provide a YouTube URL — Gemini returns a full timestamped transcript.

## Critical insight: YouTube URL, not file upload

**Never attempt to upload video files directly** to AI Studio. The "Upload files" button opens a native OS file picker that cannot be automated. The correct approach:
- Use the **YouTube Video** input option via the "+" button in the chat
- Works for any public or unlisted YouTube video, regardless of file size
- Gemini loads the entire video as context (a 45-min video ≈ 279,000 tokens)

If the user has only a local file, ask them to upload it to YouTube (unlisted is fine) and provide the URL.

## Step 1: Gather inputs

Before opening the browser, confirm:
- **YouTube URL** of the video
- **Language** of the spoken content (for accuracy; default: auto-detect)
- **Output format**: timestamped text, SRT subtitles, plain text, or saved `.txt`/`.srt` file
- **Video length** if known — affects strategy (see token limit section below)

## Step 2: Open Google AI Studio

Navigate to:
```
https://aistudio.google.com/prompts/new_chat?model=gemini-2.0-flash
```

**Verify model** in the top-right panel — it should say "Gemini 2.0 Flash". If not, click the model name and search for `gemini-2.0-flash`. This model has the best free-tier quota and output speed.

## Step 3: Add the YouTube video

1. Click the **"+"** (insert media) button near the chat input
2. Select **"YouTube Video"** from the menu
3. Paste the YouTube URL and press Enter/Confirm
4. Wait for "Video loaded" — token count in the header updates when ready

If the option isn't immediately visible, look for "Add media", "Insert", or a paperclip/attachment icon near the prompt input area.

## Step 4: Send the transcription prompt

### Short/medium videos (under ~15 minutes)

```
Transkribuj cijeli ovaj video u [LANGUAGE] s timestampovima.
Format svake linije: [MM:SS] tekst

Budi precizan s timestampovima. Svaki novi govornik ili pauza = nova linija.
```

Or in English:
```
Transcribe the entire video in [LANGUAGE] with timestamps.
Format each line as: [MM:SS] spoken text

Be precise with timestamps. New speaker or pause = new line.
```

### Long videos (15+ minutes) — chunked strategy

For long videos, the 8,192 output token limit will truncate a full transcript. Use a multi-turn approach:

**Turn 1:**
```
Transcribe the video from the beginning through minute 15 with timestamps.
Format: [MM:SS] text
```

**Turn 2:**
```
Continue transcription from [15:00] through [30:00].
```

**Turn 3:**
```
Continue from [30:00] to the end.
```

Combine the turns into one document at the end.

⚠️ **Token limit**: Gemini 2.0 Flash outputs max ~8,192 tokens in free tier. A 45-minute transcript is ~30,000+ tokens. Always chunk long videos.

## Step 5: Wait for completion and capture output

- Generation complete when: "Stop" button reverts to "Run", and thumbs up/down icons appear
- Large videos: allow 30–90 seconds
- If the response ends mid-sentence or mid-word, the output was truncated — use the chunked approach

**Extract the full transcript via JavaScript** (more reliable than manual scrolling):

```javascript
(async function() {
  // Get all model response text from the page
  const responses = document.querySelectorAll('ms-chat-turn[role="model"] .response-content');
  const allText = Array.from(responses).map(r => r.innerText).join('\n\n---\n\n');
  console.log(allText);
  return allText;
})();
```

Or simpler fallback:
```javascript
document.body.innerText.substring(
  document.body.innerText.lastIndexOf('[00:'),
  document.body.innerText.lastIndexOf('[00:') + 50000
);
```

## Step 6: Save output

Save the transcript to a file in the user's workspace:

```python
transcript = """[the full extracted text]"""

with open("/path/to/output/transcript.txt", "w", encoding="utf-8") as f:
    f.write(transcript)
```

For SRT format, convert timestamps:
```python
# Convert [MM:SS] format to SRT
import re

def to_srt(transcript_text):
    lines = transcript_text.strip().split('\n')
    srt_lines = []
    for i, line in enumerate(lines):
        match = re.match(r'\[(\d+):(\d+)\]\s+(.*)', line)
        if match:
            m, s, text = match.groups()
            start = f"00:{m.zfill(2)}:{s.zfill(2)},000"
            # Use next timestamp as end, or +3 seconds for last
            srt_lines.append(f"{i+1}\n{start} --> {start}\n{text}\n")
    return '\n'.join(srt_lines)
```

## Common issues and fixes

| Problem | Fix |
|---------|-----|
| "Upload files" dialog, can't pick file | Use YouTube Video option from "+" menu instead |
| Python API calls fail with 403 Forbidden | VM proxy blocks googleapis.com — browser JS works, Python doesn't |
| Transcript cuts off mid-video | Use chunked multi-turn strategy for videos over 15 min |
| Quota exceeded error | Switch to Gemini 2.0 Flash (not Flash Preview or Gemini 3) |
| Wrong model selected | Click model name, search "gemini-2.0-flash" explicitly |
| Timestamps jump from 04:xx to end | Gemini hit output limit — continue from last timestamp in next turn |
| Response shows page UI text mixed in | Use the JS extraction snippet above instead of copy-paste |

## Output

Always present the transcript as:
1. A saved `.txt` file with a `computer://` download link
2. A brief summary of the video content (1–2 sentences)
3. Total duration covered and word count if possible

Example:
```
Transkripcija je sačuvana:
[transcript_BoroKonverzija.txt](computer:///path/to/transcript_BoroKonverzija.txt)

Video traje ~45 minuta, govornik diskutuje o AI agentima i predviđanjima za 2025/2026.
Transkripcija pokriva [00:00]–[44:58], ~8,200 riječi.
```
