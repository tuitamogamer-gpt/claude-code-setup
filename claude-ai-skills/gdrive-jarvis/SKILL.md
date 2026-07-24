---
name: gdrive-jarvis
description: >
  Scans a user's Google Drive, analyzes and categorizes all documents, then builds
  a JARVIS-style interactive HTML dashboard to explore them. Use this skill whenever
  the user wants to explore, visualize, or get an overview of their Google Drive
  documents — even if they just say "show me my Drive", "analyze my documents",
  "make a dashboard from my Drive", "what's in my Google Drive", or "explore my files".
  Also trigger this when the user asks to build any kind of document explorer, file browser,
  or visual index of their cloud storage. Don't wait to be asked explicitly — if the user
  connects Google Drive and expresses curiosity about their files, this skill is the right move.
compatibility:
  required_mcp:
    - google_drive_search (mcp__*__google_drive_search)
    - google_drive_fetch  (mcp__*__google_drive_fetch)
---

# Google Drive JARVIS Dashboard

Build a dark, HUD-style interactive HTML dashboard that lets the user explore and
navigate all their Google Drive documents in one place.

---

## Step 1 — Verify Google Drive connection

Call `google_drive_search` with an empty query and `page_size: 1`. If it returns
without error, Drive is connected. If it fails, tell the user how to connect the
Google Drive MCP connector before continuing.

---

## Step 2 — Scan all documents

Search with `mimeType = 'application/vnd.google-apps.document'`, `page_size: 50`,
`order_by: modifiedTime desc`. This gives you the most recent 50 Google Docs.

For each result you receive in the search output, extract:
- `uri` — the document ID / link key
- `title`
- `modified_time`
- `size`
- `web_view_link`
- `owner` / `last_modified_by`
- `text` snippet (already returned by search, truncated to ~4% by default)

Do **not** call `google_drive_fetch` on every document — the search snippets are
enough context for the dashboard. Only fetch full content if the user asks you to
analyze a specific document in depth.

---

## Step 3 — Analyze and categorize

With the titles, snippets, and metadata in hand, classify every document into a
category. Adapt the categories to whatever makes sense for this user's actual
content rather than forcing a fixed taxonomy. Common categories you'll encounter:

| Category | Examples |
|---|---|
| AI / Tech | AI guides, prompts, transcripts, tool research |
| Business | Offers, pricing, proposals, platform docs |
| Academic | Papers, conference CFPs, grant project docs |
| Creative / Gaming | Game design, fiction, worldbuilding |
| Personal | Lists, notes, misc one-offs |
| Reference | Snippets, link collections, system prompts |

For each document also note:
- **Flag** — anything worth the user's attention: junk/test files, empty docs,
  files that are too large to open, potential ToS/policy risks, very old untouched
  drafts, or anything suspicious in content.
- **Snippet** — write a 1–2 sentence human-readable summary in English, even if
  the original doc is in another language.

---

## Step 4 — Build the dashboard HTML

Create a single self-contained `.html` file saved to the outputs folder. The file
must work by just opening it in a browser — no server, no external data files.

### Visual design — JARVIS aesthetic

The dashboard should feel like a sci-fi HUD:

```
Background     #020c14 (near-black navy)
Primary accent #00d4ff (cyan)
Grid lines     rgba(0,212,255,0.03)
Scanlines      repeating-gradient overlay, ~5% opacity
Font           "Share Tech Mono" (monospace, Google Fonts) for body
               "Orbitron" (geometric, Google Fonts) for headings and numbers
```

Key design patterns to use:
- Glowing cyan borders and text-shadows (`0 0 15px #00d4ff`)
- Animated pulse on status indicators (keyframe opacity 1→0.3→1)
- Corner bracket decorations (4 x 16px L-shapes) on panels
- Horizontal scan-line that sweeps across the header
- Scrollbar styled in cyan

Category colors should be distinct and neon-ish — assign one per category and
keep it consistent across the sidebar, chart, and document cards.

### Layout

```
┌─ HEADER (sticky) ──────────────────────────────────────────────┐
│  [HEX LOGO]  TITLE / SUBTITLE          CONNECTED ● HH:MM:SS   │
├─ STATS BAR (5 cells) ──────────────────────────────────────────┤
│  Total docs │ Categories │ Date range │ Flagged │ Collaborators│
├─ SIDEBAR (260px) ──────┬─ MAIN CONTENT ───────────────────────┤
│ // SEARCH              │  ┌─ Charts row (2 cols) ────────────┐ │
│ [text input]           │  │ Donut: category split            │ │
│                        │  │ Bar: docs modified per month     │ │
│ // CATEGORIES          │  └──────────────────────────────────┘ │
│ [All]        20        │  // DOCUMENT INDEX    SHOWING N / N   │
│ [AI / Tech]   8        │  ┌─ card ─┐ ┌─ card ─┐ ┌─ card ─┐  │
│ [Business]    2        │  │        │ │        │ │        │  │
│ ...                    │  └────────┘ └────────┘ └────────┘  │
│                        │  ...                                  │
│ // FLAGS               │                                       │
│ ⚑ Flagged   3         │                                       │
│                        │                                       │
│ // SORT                │                                       │
│ Modified date          │                                       │
│ Title A–Z              │                                       │
│ File size              │                                       │
└────────────────────────┴───────────────────────────────────────┘
```

### Document cards

Each card shows:
- A colored left border matching the category color
- Category label with glowing dot
- Document title (short friendly name you inferred)
- File size (in KB)
- Last modified date
- 1–2 line snippet
- "↗ OPEN IN DRIVE" button that links directly to `web_view_link`
- If flagged: a red `⚑ FLAG REASON` badge at the top

Flagged cards should use red (`#ff2244`) as their category color.

### Interactivity (vanilla JS, no frameworks)

- **Sidebar filters** — clicking a category filters the card grid to only that category
- **Flagged filter** — shows only flagged documents
- **Search input** — live-filters by title, snippet, and category as the user types
- **Sort** — by modified date (default), title A–Z, or file size descending
- **Result count** — updates in real time: "SHOWING 12 / 50 FILES"
- **Charts** — use Chart.js from cdnjs (4.x). Donut for category split, bar for
  monthly activity timeline. Match colors to the category palette.
- **Live clock** — `HH:MM:SS` in the header, updated every second with `setInterval`

### All document data goes inline

Embed all 50 documents as a JS array inside a `<script>` block. Never reference
external data files. The HTML file must be fully standalone.

```js
const docs = [
  {
    id: 1,
    title: "Short friendly title",
    titleFull: "Original document title",
    category: "ai",           // short key matching sidebar filter
    modified: "2026-03-02",   // ISO date string
    size: 14401,              // bytes
    snippet: "One or two sentence summary in English.",
    link: "https://docs.google.com/document/d/xxx/edit",
    flag: null                // or e.g. "⚠ TOS RISK" / "JUNK – DELETE" / "UNREVIEWED"
  },
  ...
];
```

---

## Step 5 — Save and share

Save the file to `/sessions/.../mnt/outputs/drive-dashboard.html` (or a similarly
descriptive name). Present a `computer://` link so the user can open it immediately.

Tell the user:
- How many documents are in the dashboard
- How many are flagged and why
- What the top categories are

Keep this summary short — the dashboard speaks for itself.

---

## Tips and edge cases

**Too-large documents** — if `google_drive_search` returns a fetch error for a
file (e.g. "This file is too large"), mark it as flagged with reason "UNREVIEWED –
too large to load" and include it in the dashboard anyway.

**Shared documents** — files owned by others that appear in search results are
still worth including. Note the owner in the snippet so the user knows context.

**Non-Doc file types** — the default search targets Google Docs. If the user asks
to include Sheets, Slides, or PDFs too, add additional `mimeType` conditions to
the search query and run them in parallel.

**Language** — snippets and the analysis should always be in English for
consistency, even if the documents themselves are in other languages. Translate
the gist, don't transliterate.

**Date range stat** — compute this from the oldest and newest `modified_time` in
the result set and show it as e.g. "90d" or "Jan 2025 – Mar 2026".

**Collaborators stat** — count the distinct values of `last_modified_by` / `owner`
across all documents to surface how many different people have touched files in
this Drive.
