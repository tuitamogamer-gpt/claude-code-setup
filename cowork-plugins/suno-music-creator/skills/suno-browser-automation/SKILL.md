---
name: suno-browser-automation
description: >
  This skill provides expert knowledge for automating Suno.com music creation via browser.
  Use when the user asks to "create songs on Suno", "make an album on Suno", "generate music",
  "create a Suno playlist", "add songs to Suno playlist", "generate cover art on Suno",
  or any task involving browser automation on suno.com. Covers React input handling,
  reliable UI interaction patterns, song creation workflows, and playlist management.
version: 0.1.0
---

# Suno.com Browser Automation

Expert guide for creating music, managing playlists, and navigating Suno.com via Chrome browser automation tools.

## Prerequisites

- User must be logged into suno.com in Chrome
- Chrome MCP tools must be available (tabs_context_mcp, navigate, find, computer, form_input, javascript_tool, read_page)
- Always call `tabs_context_mcp` first to get available tab IDs

## Critical Pattern: React Input Handling

Suno uses React, which manages form state internally. The standard `form_input` tool sets the DOM value but **React does not detect the change**. This causes buttons to remain disabled or submissions to fail silently.

**Always use the native JavaScript setter pattern for text inputs on Suno:**

```javascript
// 1. Find the input element (by placeholder, index, or selector)
const input = document.querySelector('textarea[placeholder*="your lyrics"]');

// 2. Use the native HTMLInputElement/HTMLTextAreaElement value setter
const setter = Object.getOwnPropertyDescriptor(
  window.HTMLTextAreaElement.prototype, 'value'
).set;
setter.call(input, 'your text here');

// 3. Dispatch both input and change events with bubbles
input.dispatchEvent(new Event('input', { bubbles: true }));
input.dispatchEvent(new Event('change', { bubbles: true }));
```

For `<input>` elements, use `HTMLInputElement.prototype` instead of `HTMLTextAreaElement.prototype`.

**When to use this pattern:**
- Setting song lyrics in the creation form
- Setting song title, style/tags
- Setting playlist names or descriptions
- Setting cover art generation prompts
- Any text field on Suno that doesn't respond to `form_input`

## Reliable Click Patterns

### Use ref-based clicks, not coordinate clicks

The `find` tool returns element references (ref_xxx) that are far more reliable than coordinate-based clicks for Suno's dynamic UI.

**Workflow for context menu actions (e.g., adding to playlist):**

1. Use `find` to locate the "More options" button for the target song:
   ```
   find: "More options button for [Song Name]"
   ```
2. Click the ref for the correct song's button
3. Use `find` again to locate "Add to Playlist" in the opened menu:
   ```
   find: "Add to Playlist menu item"
   ```
4. Click the "Add to Playlist" ref
5. In the playlist dialog, click the target playlist (coordinate click at the playlist row is OK here since the dialog is stable)

**Common pitfall:** Suno song rows have both a "Remix/Edit" dropdown AND a separate "..." (More options) button. The "Add to Playlist" option is under "More options" (...), NOT under "Remix/Edit". Always search for "More options" specifically.

### Navigation: Prefer direct URLs

Instead of clicking sidebar navigation links (which can trigger upgrade modals), navigate directly:

- Library: `https://suno.com/me`
- Create: `https://suno.com/create`
- Playlist: `https://suno.com/playlist/[playlist-id]`
- Song: `https://suno.com/song/[song-id]`

## Song Creation Workflow

Detailed step-by-step instructions are in `references/song-creation.md`.

**Summary:**
1. Navigate to `https://suno.com/create`
2. Switch to Custom mode (if not already active)
3. Set lyrics using the React setter pattern
4. Set style/genre tags using the React setter pattern
5. Set title using the React setter pattern
6. Click Create
7. Wait for generation (take screenshots to monitor progress)
8. Each creation produces 2 variants — pick the best one for the playlist

## Playlist Management

Detailed instructions are in `references/playlist-management.md`.

**Summary:**
1. Navigate to Library (`https://suno.com/me`)
2. Go to Playlists tab to create a new playlist, or use More options on songs to add to existing
3. For cover art: use the playlist settings to generate AI art with the React setter pattern for the prompt
4. Songs are added one at a time via: More options → Add to Playlist → Select playlist

## Handling Duplicate Songs

Suno generates 2 variants per creation. When building an album:
- Each song title will appear twice in the library
- Pick the first variant (usually the longer/better one)
- The `find` tool returns refs for both — use the first ref listed for each song title

## Error Recovery

- **Button doesn't respond after setting input:** The React setter pattern wasn't used. Re-set the value with JavaScript.
- **Modal/popup blocks the page:** Look for an X close button or press Escape. If it's an upgrade modal, close it and navigate directly via URL.
- **Song not appearing in library:** Wait and refresh. Suno takes 30-60 seconds to generate.
- **"Add to Playlist" menu closes without opening dialog:** This is intermittent. Try again using ref-based click. If it persists, scroll the song into better view first.
- **Library pagination:** Suno shows ~7 songs per page. Scroll down or use page navigation arrows to find more songs.

## Input Field Discovery

When you need to find the right input field index for JavaScript injection:

```javascript
const inputs = document.querySelectorAll('input');
const allInputs = [];
inputs.forEach((inp, i) => {
  allInputs.push({
    index: i, type: inp.type,
    placeholder: inp.placeholder,
    value: inp.value, name: inp.name
  });
});
JSON.stringify(allInputs);
```

Use this to identify which input index corresponds to which field (e.g., cover art prompt, search, etc.).
