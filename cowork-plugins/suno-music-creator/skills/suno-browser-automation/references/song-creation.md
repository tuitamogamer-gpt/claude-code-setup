# Song Creation on Suno — Step by Step

## Full Workflow

### 1. Navigate to Create Page

```
navigate: https://suno.com/create
```

Take a screenshot to verify the page loaded and check current mode.

### 2. Switch to Custom Mode

Suno has two modes:
- **Simple mode**: Just a text prompt, Suno generates everything
- **Custom mode**: Full control over lyrics, style, and title

Look for a "Custom" toggle/button. Use `find` to locate it:
```
find: "Custom mode toggle" or "Custom button"
```

### 3. Set Song Lyrics

The lyrics field is a `<textarea>`. Use the React setter pattern:

```javascript
const textarea = document.querySelector('textarea');
const setter = Object.getOwnPropertyDescriptor(
  window.HTMLTextAreaElement.prototype, 'value'
).set;
setter.call(textarea, `[Verse 1]
Your lyrics here...

[Chorus]
Chorus lyrics...

[Verse 2]
More lyrics...`);
textarea.dispatchEvent(new Event('input', { bubbles: true }));
textarea.dispatchEvent(new Event('change', { bubbles: true }));
```

### 4. Set Style/Genre Tags

The style field is typically an `<input>` element. Find it by placeholder or position:

```javascript
// Find the style input - look for placeholder containing "style" or "genre"
const inputs = document.querySelectorAll('input');
let styleInput;
inputs.forEach(inp => {
  if (inp.placeholder.toLowerCase().includes('style')) styleInput = inp;
});

const setter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype, 'value'
).set;
setter.call(styleInput, 'Serbian trap, turbo-folk rap, 808s, male vocals');
styleInput.dispatchEvent(new Event('input', { bubbles: true }));
styleInput.dispatchEvent(new Event('change', { bubbles: true }));
```

**Effective style tag examples:**
- `Serbian epic trap, turbo-folk anthem, cinematic rap, 808s, orchestral elements, proud male vocals, Balkan hip hop`
- `Serbian aggressive trap, diss track, turbo-folk rap, hard 808s, angry male vocals, Balkan drill, intense`
- `Serbian dark trap, sad turbo-folk rap, piano melody, 808s, haunting male vocals, nostalgic Balkan, emotional`
- `Serbian romantic trap, soft turbo-folk rap, dreamy 808s, emotional male vocals, lo-fi Balkan, autotune, love song`
- `Serbian party trap, turbo-folk rap, accordion samples, 808s, upbeat, drinking anthem, male vocals, Balkan club`
- `Serbian trap, dark rap, turbo-folk fusion, heavy bass, 808s, atmospheric, male vocals, moody Balkan trap`
- `Serbian street rap, hard trap, turbo-folk drill, aggressive 808s, gritty male vocals, Balkan gangsta rap, raw`
- `Serbian trap ballad, emotional rap, turbo-folk melodies, 808s, autotune, melancholic, male vocals, Balkan pop`
- `Serbian trap, turbo-folk rap, heavy 808s, deep bass, Balkan melodies, male vocals, aggressive flow`
- `Serbian anthem trap, turbo-folk rap finale, upbeat 808s, triumphant, male vocals, Balkan celebration, epic closing track`

### 5. Set Song Title

Find the title input and set it:

```javascript
// Title input is usually near the style input
const titleInput = document.querySelector('input[placeholder*="title" i]')
  || document.querySelector('input[placeholder*="Title" i]');

const setter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype, 'value'
).set;
setter.call(titleInput, 'Song Title Here');
titleInput.dispatchEvent(new Event('input', { bubbles: true }));
titleInput.dispatchEvent(new Event('change', { bubbles: true }));
```

### 6. Click Create

Use `find` to locate the Create button:
```
find: "Create button"
```
Click the ref. Take a screenshot after 3-5 seconds to verify creation started.

### 7. Wait for Generation

Songs take 30-90 seconds to generate. Monitor with periodic screenshots. The progress is visible on the page. Wait until two song variants appear with play buttons.

### 8. Verify in Library

Navigate to `https://suno.com/me` to see the created songs. They appear in reverse chronological order (newest first).

## Batch Creation Tips

When creating 10 songs for an album:
- Create songs one at a time
- Wait for each to finish before starting the next (Suno queues but free accounts may have limits)
- Each creation uses credits (check credit count in the sidebar)
- Write all lyrics beforehand so you can paste them in sequence
- Keep a list of created songs to track progress

## Suno v5 Model

As of 2026, Suno uses the v5 model by default. Songs created with v5 show a "v5" badge. No special action needed to select the model.
