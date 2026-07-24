# elevenlabs-scribe-mcp-server

An [MCP](https://modelcontextprotocol.io) server that turns **ElevenLabs Scribe**
(Speech-to-Text) into an on-demand transcription tool for Claude Code, Claude
Desktop, or any MCP client. Give it an audio/video file (or a URL) and get back a
transcript — as plain text, speaker-labelled markdown, full JSON with word
timestamps, or an `.srt` subtitle file.

## Tools

| Tool | What it does |
|------|--------------|
| `elevenlabs_transcribe_audio` | Transcribe a local file **or** a remote URL. Options: language, speaker diarization, audio-event tagging, timestamp granularity, output format (`text` / `markdown` / `json` / `srt`), saving to disk, and **exporting to `docx` / `pdf` / `html` / `srt` / `txt` / `segmented_json`** files. |
| `elevenlabs_transcribe_batch` | Transcribe **many files/URLs at once**. Each transcript is saved to disk; a compact summary is returned. One failed item doesn't stop the rest. |
| `elevenlabs_check_connection` | Verify the API key is valid and show account info. Run this first to confirm setup. |

## Requirements

- Node.js 18+ (you have Node 22 ✅)
- An ElevenLabs API key — create one at <https://elevenlabs.io/app/settings/api-keys>

## Install & build

```bash
cd ~/Downloads/MCPelevenscribe
npm install
npm run build
```

This produces the runnable server at `dist/index.js`.

## Configure your API key

The server reads the key from the `ELEVENLABS_API_KEY` **environment variable**.
For security, put it in your MCP client config (below) rather than anywhere in
the code. Never commit it.

### Claude Code (this CLI)

Run once to register the server for all your projects (user scope):

```bash
claude mcp add elevenlabs-scribe \
  --scope user \
  --env ELEVENLABS_API_KEY=YOUR_ELEVENLABS_API_KEY \
  -- node ~/Downloads/MCPelevenscribe/dist/index.js
```

Verify:

```bash
claude mcp list
```

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` and add:

```json
{
  "mcpServers": {
    "elevenlabs-scribe": {
      "command": "~/.local/bin/node",
      "args": ["~/Downloads/MCPelevenscribe/dist/index.js"],
      "env": {
        "ELEVENLABS_API_KEY": "YOUR_ELEVENLABS_API_KEY"
      }
    }
  }
}
```

Then fully quit and reopen Claude Desktop.

## Verify it works (end-to-end, real API)

A bundled script runs the whole stack against a real transcription. Your API key
stays in your shell — it is never written to disk.

```bash
# transcribes the included samples/hr-test.wav
ELEVENLABS_API_KEY=YOUR_ELEVENLABS_API_KEY node scripts/verify.mjs

# or transcribe your own file / URL
ELEVENLABS_API_KEY=YOUR_ELEVENLABS_API_KEY node scripts/verify.mjs /path/to/audio.mp3
```

You should see your account tier, then the transcript, then `✅ End-to-end OK.`

## Usage examples

Once configured, just ask in natural language:

- *"Check my ElevenLabs connection"* → runs `elevenlabs_check_connection`
- *"Transcribe `/Users/me/interview.mp3` and label the speakers"*
  → `elevenlabs_transcribe_audio` with `diarize: true`, `response_format: "markdown"`
- *"Make subtitles for `clip.mp4`"* → `response_format: "srt"`
- *"Transcribe this Croatian audio and save it to `notes.txt`"*
  → `language_code: "hr"`, `save_to_path: "notes.txt"`
- *"Transcribe this YouTube link"* → pass the URL as `source_url`
- *"Transcribe `meeting.m4a` and also save docx, pdf and srt"*
  → `export_formats: ["docx", "pdf", "srt"]`
- *"Transcribe all the files in this folder to SRT"* → `elevenlabs_transcribe_batch`
  with `file_paths: [...]`, `response_format: "srt"`

## Parameters (transcribe)

| Parameter | Type | Default | Notes |
|-----------|------|---------|-------|
| `file_path` | string | — | Local audio/video file. Use this **or** `source_url`. Max 5 GB. |
| `source_url` | string | — | Public URL (incl. YouTube/TikTok). Max 2 GB. |
| `model_id` | string | `scribe_v2` | or `scribe_v1` (set default via `ELEVENLABS_DEFAULT_MODEL`) |
| `language_code` | string | `sr` | ISO-639-1/3, e.g. `sr`, `hr`, `en`. Pass `auto` to auto-detect. |
| `script` | enum | `latin` | Serbian output script: `latin` (transliterate Cyrillic→Latin) or `cyrillic`. |
| `diarize` | boolean | `false` | Label speakers |
| `num_speakers` | integer | auto | 1–32, used with `diarize` |
| `tag_audio_events` | boolean | `true` | Tag `(laughter)` etc. |
| `timestamps_granularity` | enum | `word` | `none` / `word` / `character` |
| `temperature` | number | — | 0.0–2.0 |
| `seed` | integer | — | Reproducible sampling |
| `response_format` | enum | `text` | `text` / `markdown` / `json` / `srt` |
| `export_formats` | string[] | — | Also save server-side files: `docx` / `pdf` / `html` / `srt` / `txt` / `segmented_json`. Auto-enables diarization + word timestamps. |
| `output_dir` | string | — | Directory for exported/auto-saved files (default: source file's directory) |
| `save_to_path` | string | — | Also write transcript to disk |

The **batch** tool (`elevenlabs_transcribe_batch`) takes `file_paths` and/or `source_urls`
arrays plus the same options (`language_code`, `diarize`, `response_format`, `export_formats`,
`output_dir`, …) and saves every transcript to disk.

## Development

```bash
npm run dev     # run from source with auto-reload (tsx)
npm run build   # typecheck + compile to dist/
```

Test interactively with the MCP Inspector:

```bash
ELEVENLABS_API_KEY=YOUR_KEY npx @modelcontextprotocol/inspector node dist/index.js
```

## Notes & limits

- **Default output is Serbian in Latin script.** Transcription runs as Serbian
  (`language_code: "sr"`) for best accuracy, then the Cyrillic result is transliterated to
  Latin (`script: "latin"`, the default). Pass `script: "cyrillic"` to keep Cyrillic, or
  `language_code: "hr"` / `"en"` / `"auto"` to change the language. Globals: the
  `ELEVENLABS_DEFAULT_LANGUAGE` and `ELEVENLABS_DEFAULT_SCRIPT` env vars.
  Note: `docx`/`pdf` exports keep ElevenLabs' native Cyrillic; text outputs (text/markdown/json/srt/txt/html/segmented_json) are transliterated.
- `elevenlabs_check_connection` calls the account endpoint, which requires the
  **"User: Read"** permission on your API key. Transcription itself only needs the
  **"Speech to Text"** permission — so a restricted key can still transcribe even if
  the connection check reports a permission error.
- Long transcripts are truncated in the chat response and the full text is saved
  to a sibling file automatically (path returned in `saved_to`).
- Transcription of long audio can take a while; the request timeout defaults to
  1 hour and is configurable via `ELEVENLABS_TIMEOUT_MS`.
- Files are streamed from disk (via `fs.openAsBlob`), so large files are not
  loaded fully into memory.

## License

MIT
