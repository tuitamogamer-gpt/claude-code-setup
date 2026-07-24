# Playlist Management on Suno — Step by Step

## Creating a New Playlist

### Method 1: From Library → Playlists Tab

1. Navigate to `https://suno.com/me`
2. Click the "Playlists" tab
3. Look for a "Create Playlist" or "+" button
4. Set playlist name, description, and optionally generate cover art

### Method 2: From Song Context Menu

1. Navigate to `https://suno.com/me` (Songs tab)
2. Click "More options" (...) on any song
3. Click "Add to Playlist"
4. In the dialog, type a name in the "Playlist Name" field and click "Create Playlist"
5. The song is automatically added to the new playlist

## Adding Songs to an Existing Playlist

This is the most common operation when building an album. The reliable workflow:

### Step 1: Find the Song's "More Options" Button

```
find: "More options button for [Song Name]"
```

This returns refs for all matching songs (duplicates from Suno's 2-variant generation). Use the first ref for each unique song title.

### Step 2: Click "More Options"

```
computer: left_click ref=[ref_id]
```

A context menu appears with options: Remix/Edit, Create, Get Stems, Add to Queue, **Add to Playlist**, Move to Workspace, Publish, Song Details, Generate Cover Art, Visibility & Permissions, Share, Download, Report, Move to Trash.

### Step 3: Click "Add to Playlist"

```
find: "Add to Playlist menu item"
```

Then click the returned ref. **Important:** Use ref-based clicks here, not coordinates. Coordinate clicks on this menu item are unreliable and sometimes close the menu without opening the dialog.

### Step 4: Select the Target Playlist

The "Add to Playlist" dialog shows all playlists. Click on the target playlist name. Coordinate clicks work fine here since the dialog is a stable overlay — the playlist rows are consistently positioned.

### Step 5: Verify

The dialog closes automatically after adding. The song is now in the playlist.

## Reliable Batch Addition

When adding multiple songs to a playlist (e.g., building a 10-song album):

1. Start at `https://suno.com/me` (Songs tab, sorted by Newest)
2. Process songs in order as they appear on screen
3. After each addition, the page state may shift — use `find` again to locate the next song's "More options" button
4. Songs at the bottom of the page may require scrolling — they become visible as you process songs above them
5. Library shows ~7 songs per page; scroll or paginate to find all songs
6. After finishing all additions, navigate to the playlist URL to verify the count

## Generating Playlist Cover Art

### From Playlist Settings

1. Navigate to the playlist page: `https://suno.com/playlist/[id]`
2. Look for a settings/edit button (gear icon or edit option)
3. Find the cover art generation section

### From Playlist Creation Dialog

When creating a playlist, there's usually an option to generate cover art with an AI prompt.

**Setting the cover art prompt (React input):**

```javascript
// Find the prompt input — enumerate all inputs to find the right index
const inputs = document.querySelectorAll('input');
// Look for one with placeholder containing "Prompt" or "AI" or "generat"
let promptInput;
inputs.forEach((inp, i) => {
  if (inp.placeholder.toLowerCase().includes('prompt') ||
      inp.placeholder.toLowerCase().includes('generat')) {
    promptInput = inp;
  }
});

const setter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype, 'value'
).set;
setter.call(promptInput, 'Serbian rapper in neon Belgrade cityscape at night, trap aesthetic, turbo-folk vibes, dark moody atmosphere, purple and gold colors');
promptInput.dispatchEvent(new Event('input', { bubbles: true }));
promptInput.dispatchEvent(new Event('change', { bubbles: true }));
```

Then click the "Generate" button. Wait for the image to appear, then save/confirm.

## Playlist URLs

After creation, every playlist has a permanent URL:
```
https://suno.com/playlist/[uuid]
```

Save this URL to share with the user at the end of the workflow.

## Common Issues

### "Add to Playlist" closes without opening dialog
- **Cause:** Intermittent UI issue, especially with coordinate-based clicks
- **Fix:** Always use ref-based clicks from the `find` tool. Retry if needed.

### Song appears twice in playlist
- **Cause:** Accidentally added both variants of the same song
- **Fix:** Remove the duplicate from the playlist settings page

### Library sidebar click triggers upgrade modal
- **Cause:** The "Library" link in the sidebar triggers a Premier upgrade modal on free accounts
- **Fix:** Navigate directly to `https://suno.com/me` instead of clicking the sidebar link. Close any modal by finding the X button or pressing Escape.

### Songs not visible in library
- **Cause:** Songs are on page 2+ or still generating
- **Fix:** Scroll down or click the pagination arrows. Wait for generation to complete.
