# Suno Music Creator

Create AI-generated music albums and playlists on Suno.com using browser automation.

## What It Does

This plugin automates the full workflow of creating music on Suno:
- Write original lyrics for multiple songs
- Create songs with custom lyrics, styles, and titles
- Build playlists and add songs to them
- Generate AI cover art for playlists

## Components

### Skills

- **suno-browser-automation** — Domain knowledge for navigating Suno's React-based UI, including the critical native value setter pattern for form inputs, reliable ref-based click workflows, and error recovery strategies.

### Commands

- `/suno-album [count] [genre] [theme]` — Create a full album from scratch: writes lyrics, generates songs, builds a playlist with cover art.
- `/suno-playlist [name] [songs...]` — Create or populate a playlist from existing songs in your Suno library.

## Requirements

- Must be logged into suno.com in Chrome
- Chrome browser automation (Claude in Chrome MCP) must be connected
- Suno free tier works but has credit limits (~50 songs/day)

## Key Technical Details

This plugin encodes lessons learned from extensive Suno automation:

1. **React input handling** — Suno uses React, so standard DOM value setting doesn't trigger state updates. The plugin uses native `HTMLInputElement.prototype.value` setters with event dispatching.

2. **Ref-based clicks** — Menu items like "Add to Playlist" require ref-based clicks (via the `find` tool) rather than coordinate clicks, which are unreliable on Suno's dynamic UI.

3. **Direct URL navigation** — Sidebar links can trigger upgrade modals. The plugin navigates directly to `suno.com/me`, `suno.com/create`, etc.

4. **Duplicate handling** — Suno generates 2 variants per song. The plugin picks the first variant for playlist inclusion.

## Usage

```
/suno-album 10 "Serbian trap" "love and nightlife in Belgrade"
/suno-playlist "My Favorites" Zadnja Runda, Kralj Ulice, Dim i Pepeo
```
