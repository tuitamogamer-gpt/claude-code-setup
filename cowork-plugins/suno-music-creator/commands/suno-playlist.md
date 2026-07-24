---
description: Create or manage a Suno playlist from existing songs
argument-hint: [playlist-name] [song-names...]
---

Create a new playlist on suno.com and add existing songs to it, or manage an existing playlist.

**First, read the suno-browser-automation skill** for the reliable UI interaction patterns.

## Process

### 1. Understand the Request

Arguments: $ARGUMENTS

Determine:
- Playlist name (required)
- Which songs to add (by name, or "all recent", or a count like "last 10")
- Whether to generate cover art
- Playlist description

### 2. Navigate to Library

Go to `https://suno.com/me` (do NOT click the Library sidebar link — it may trigger an upgrade modal on free accounts).

### 3. Add Songs to Playlist

For each song to add, follow this exact sequence:

1. **Find the button:** `find: "More options button for [Song Name]"`
2. **Click it:** Use the ref returned by find (ref-based click)
3. **Find Add to Playlist:** `find: "Add to Playlist menu item"`
4. **Click it:** Use the ref (ref-based click — this is critical, coordinate clicks are unreliable here)
5. **Select playlist:** Click the playlist name in the dialog (coordinate click is fine here)
6. **Verify:** Dialog closes = success

If creating a new playlist, type the name in the "Playlist Name" field at the bottom of the dialog and click "Create Playlist" on the first song addition.

### 4. Handle Pagination

Suno shows ~7 songs per page in the library. If songs aren't visible:
- Scroll down to reveal more
- Use page navigation arrows at the bottom
- After processing visible songs, scroll or navigate to find remaining ones

### 5. Generate Cover Art (Optional)

If requested, navigate to the playlist page and generate cover art using the React setter pattern for the image prompt input.

### 6. Verify

Navigate to the playlist URL and take a screenshot showing all songs are present. Confirm the song count matches expectations.

Share the playlist URL with the user.
