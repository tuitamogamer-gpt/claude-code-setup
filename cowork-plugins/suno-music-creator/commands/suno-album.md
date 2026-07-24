---
description: Create a full album of AI-generated songs on Suno
argument-hint: [number-of-songs] [genre/style] [theme]
---

Create a full album of AI-generated songs on suno.com using browser automation.

**First, read the suno-browser-automation skill** to understand the React input patterns and reliable click workflows. This is critical — standard form_input will NOT work on Suno's React UI.

## Process

### 1. Gather Requirements

If not specified in the arguments, ask the user:
- Number of songs (default: 10)
- Genre/style (e.g., "Serbian trap", "lo-fi hip hop", "indie rock")
- Theme or concept for the album (e.g., "love and nightlife in Belgrade")
- Language for lyrics (default: English)
- Playlist name for the final collection

Arguments provided: $ARGUMENTS

### 2. Write All Lyrics First

Before touching the browser, write original lyrics for every song. Each song should have:
- A unique title
- 2-3 verses and a chorus minimum
- Style/genre tags tailored to the song's mood
- Lyrics that fit the album theme while each song has its own angle

Create a tracking list of all songs with their titles, lyrics, and style tags.

### 3. Create Songs on Suno

Navigate to `https://suno.com/create` and create each song one at a time:

1. Switch to Custom mode if not already active
2. Set lyrics using the **React JavaScript setter pattern** (NOT form_input)
3. Set style tags using the same pattern
4. Set title using the same pattern
5. Click Create and wait for generation to complete
6. Take a screenshot to verify before moving to the next song

**Critical:** Use the `javascript_tool` with native value setters for ALL text inputs. The `form_input` tool will silently fail on Suno's React forms.

### 4. Create Playlist and Add Songs

After all songs are created:
1. Navigate to `https://suno.com/me`
2. For each song, use: More options (ref click) → Add to Playlist (ref click) → Select playlist
3. Always use `find` tool to get refs — never guess coordinates for menu items
4. Verify the final playlist has the correct song count

### 5. Generate Cover Art

Generate AI cover art for the playlist with a prompt that matches the album's aesthetic.

### 6. Share Result

Provide the user with the playlist URL.
