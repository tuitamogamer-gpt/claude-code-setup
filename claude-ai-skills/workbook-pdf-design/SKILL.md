---
name: workbook-pdf-design
description: >-
  Produce a beautifully designed multi-page workbook PDF with the signature
  look — warm cream pages, organic yellow/orange corner blobs, an orange accent
  system (eyebrow labels, numbered badges, plus-bullets, fill-in writing lines),
  and a vivid coral-to-magenta gradient cover. ALWAYS use this skill whenever the
  user asks for "workbook dizajn PDF", "workbook design PDF", a "radna sveska",
  a coaching / journaling / self-help / exercise workbook, a printable PDF
  worksheet or vježbenica, or any branded fill-in PDF in this cream-and-orange
  style — even if they only say "napravi mi workbook" or "make me a workbook PDF"
  without describing the look. This is the default visual identity for any
  workbook/worksheet PDF unless the user explicitly asks for a different style.
---

# Workbook PDF Design

This skill renders polished, print-ready **A4 workbook PDFs** from hand-written
HTML, using a fixed design system: cream paper, organic yellow→orange corner
blobs, orange accents, generous writing lines, and a coral→magenta gradient
cover. The output should look like a professionally designed coaching workbook —
calm, warm, and premium.

## How it works

You write a plain HTML file using the documented classes (one
`<section class="page">` per printed page), then run the render script. The
script auto-attaches the stylesheet and embeds the fonts, so your HTML needs
**no `<link>`, no `<style>`, and no inline CSS** — just the documented classes.

```bash
# $SKILL = this skill's folder (where this SKILL.md lives)
python3 "$SKILL/assets/render.py" workbook.html workbook.pdf
```

Then present `workbook.pdf` to the user.

> Want to eyeball it first? `pdftoppm -png -r 90 workbook.pdf /tmp/p` rasterizes
> each page to a PNG you can view.

## Core rules

- **One page = one `<section class="page">`.** Each `.page` is a fixed A4 sheet;
  content does **not** reflow onto the next page. If a page looks crowded, split
  it into more `.page` sections rather than cramming.
- **Use only the documented classes and `:root` tokens.** Don't introduce new
  colors, ad-hoc inline styles, or new fonts — the consistency is the point.
- **The cover comes first**, then optional section dividers, then content pages.
- **Keep the corner blob clear:** content pages already pad the top so the
  eyebrow/title sit cleanly below the blob — don't fight it with negative margins.
- **Language:** Mulish (body) and the Poppins cover face both cover Latin
  including č ć ž š đ. Mulish also covers Cyrillic; Poppins does **not**, so a
  Cyrillic cover title gracefully falls back to Mulish — still clean.

## Document skeleton

```html
<!DOCTYPE html>
<html lang="bs">
<head><meta charset="utf-8"></head>
<body>
  <div class="workbook">
    <!-- pages go here, in order -->
  </div>
</body>
</html>
```

`.workbook` resets the page counter; every `.page` inside it auto-increments it
(used by the optional footer).

---

## Page types

### 1. Cover (coral→magenta gradient)

```html
<section class="page cover">
  <div class="cover__top">
    <div class="cover__brand">Radna sveska · Coaching</div>
  </div>
  <div class="cover__spacer"></div>
  <div class="cover__kicker">Lični rast</div>
  <h1 class="cover__title">Vrijednosti,<br>fokus i navike</h1>
  <p class="cover__subtitle">Praktične vježbe za jasnije ciljeve i mirnije odluke.</p>
  <div class="cover__meta">
    <div class="cover__meta-row"><b>Format:</b> PDF</div>
    <div class="cover__meta-row"><b>Strana:</b> 18</div>
  </div>
</section>
```

`cover__top` holds the brand line; `cover__spacer` pushes the title block to the
lower third. `cover__kicker`, `cover__subtitle`, and `cover__meta` are all
optional. Use `<br>` to control title line breaks.

### 2. Section divider (big number)

```html
<section class="page section section--accent">
  <div class="section__index">Prvi dio</div>
  <div class="section__num">01</div>
  <h2 class="section__title">Vrijednosti i smjer</h2>
  <p class="section__desc">Kratak uvod u ono što ovaj dio pokriva.</p>
</section>
```

`section--accent` adds the large warm blob bottom-right. `section__desc` is
optional. Great for chaptering a long (18-page) workbook.

### 3. Content / exercise page

The workhorse. Eyebrow → title → lead → steps/bullets → writing lines → note.

```html
<section class="page">
  <div class="eyebrow">Vježba 1</div>
  <h1 class="title">Moj vrijednosni profil</h1>
  <p class="lead">Cilj ove vježbe je da osvijestiš sopstvene vrijednosti.</p>

  <ol class="steps">
    <li><strong>Izdvoji glavne sfere svog života.</strong> Posao, porodica,
      odnosi, zdravlje, odmor i slično.</li>
    <li><strong>Za svaku sferu zapiši jednu vrijednost</strong> koja ti je
      najvažnija.</li>
  </ol>

  <p class="label-inline">Moje sfere života:</p>
  <div class="lines r5"></div>

  <div class="note">
    <div class="note__title">Savjet</div>
    <p>Ako zapneš, zamisli običan radni dan i šta bi ga učinilo zadovoljnim.</p>
  </div>
</section>
```

### 4. Help / reference list

```html
<section class="page page--accent">
  <div class="eyebrow eyebrow--soft">Pomoć</div>
  <h1 class="title">Lista vrijednosti</h1>
  <p class="lead">Zaokruži ono što ti odzvanja, pa dopuni svojim riječima.</p>
  <ul class="plus">
    <li>autonomija i sloboda da sam biram</li>
    <li>bliskost i iskreni odnosi</li>
    <li>radoznalost, učenje i razvoj</li>
  </ul>
  <p class="label-inline">Moje dodatne vrijednosti:</p>
  <div class="lines r4"></div>
</section>
```

`page--accent` adds a small warm blob bottom-right for visual rhythm. Use it on
roughly every other content page so the workbook doesn't feel flat.

### 5. Reflection / free-writing page

```html
<section class="page">
  <div class="eyebrow">Refleksija</div>
  <h1 class="title">Šta nosim sa sobom</h1>
  <p class="lead">Zapiši tri uvida i jedan mali korak za ovu sedmicu.</p>
  <div class="field">
    <div class="field__label">Tri uvida</div>
    <div class="lines r4"></div>
  </div>
  <div class="field">
    <div class="field__label">Jedan konkretan korak</div>
    <div class="lines r3"></div>
  </div>
  <div class="footer">
    <span class="footer__brand">Radna sveska</span>
    <span class="footer__num"></span>
  </div>
</section>
```

---

## Component reference

| Class | Use |
|---|---|
| `.eyebrow` | Small uppercase orange label above a title (e.g. "VJEŽBA 1"). `.eyebrow--soft` makes it muted grey (for "Pomoć", "Napomena"). |
| `.title` | Page heading (ExtraBold). `.title--lg` for a larger variant. |
| `.subtitle` | Secondary heading under a title. |
| `.lead` | Intro paragraph, slightly larger than body. |
| `<p>` | Body text. Wrap emphasis in `<strong>` (renders strong + near-black). |
| `.label-inline` | Inline bold lead-in like `Algoritam:` or a field label on its own line. |
| `.muted` | De-emphasised grey text. |
| `ol.steps > li` | Numbered steps with auto-numbered orange gradient badges. Numbering is automatic — never type the numbers. |
| `ul.plus > li` | Bullet list with soft orange ⊕ icons (the signature bullet). |
| `ul.dash > li` | Lighter list with a short orange dash marker. |
| `.lines` | A block of fill-in writing lines (see cheat-sheet below). |
| `.field` + `.field__label` | A labelled answer area (label, then `.lines`). |
| `.note` + `.note__title` | Soft amber callout box with an orange left bar — tips, "Suština vježbe", definitions. |
| `.prompt` | Bold question block with a soft amber left border — for reflective questions. |
| `.rule` | Thin horizontal divider (`<hr class="rule">`). |
| `.footer` + `.footer__brand` + `.footer__num` | Bottom strip: brand text left, auto page number (orange dot) right. |
| `.page--accent` | Page modifier: adds a small warm blob bottom-right. |

### Writing-lines cheat-sheet

`.lines` draws one line every 10 mm. Pick a height with a row class:

`r3` ≈ 3 lines · `r4` ≈ 4 · `r5` ≈ 5 · `r6` ≈ 6 · `r7` ≈ 7 · `r8` ≈ 8 · `r10` ≈ 10.

```html
<div class="lines r5"></div>          <!-- five lines -->
<div class="lines" style="height:46mm"></div>   <!-- custom height -->
```

Prefer generous space — a workbook is meant to be written in. A typical exercise
page ends with `r5`–`r8`.

---

## Branding & recoloring

The default identity (warm cream + orange/yellow + coral cover) is the intended
look — keep it unless the user explicitly wants a different palette.

**Per-document tweaks** (brand name, accent, cover colors) — add a tiny `<style>`
in `<head>` overriding the `:root` tokens; it wins over the stylesheet:

```html
<head><meta charset="utf-8">
<style>:root{
  --accent:#C96A12;            /* eyebrow / dash / note bar / footer dot */
  --badge-1:#F8B12C; --badge-2:#EF8C14;  /* number badges */
  --cover-1:#F2553E; --cover-2:#E12C77; --cover-3:#B81E9A; /* cover gradient */
}</style></head>
```

These tokens drive the cover gradient, eyebrow, number badges, note bar, prompt
border, dash bullets, and footer dot.

**Two elements are baked into SVG** and won't follow tokens: the **corner blobs**
and the **⊕ plus-bullet icon**. To recolor those for a full re-theme, edit the
`stop-color` values inside the `data:image/svg+xml` URIs in
`assets/workbook.css` (`.page::before`, `.page--accent::after`,
`.section--accent::after`, and `ul.plus > li::before`). Make a copy of the CSS
and pass it via `render.py --css mycopy.css` rather than editing in place.

To change the body/display typefaces, drop new TTFs into `assets/fonts/` and
update the `@font-face` blocks at the top of `assets/workbook.css`.

---

## Designing a good workbook (rhythm for ~18 pages)

- **Cover → section divider → 2–4 exercise pages → reflection**, repeated per
  theme. End the whole book with a closing reflection page.
- **One idea per page.** If an exercise has lots of steps + lots of writing,
  give the writing its own page.
- **Alternate `page--accent`** on roughly every other content page so corners
  feel lively without being busy.
- **Vary page types** — don't stack five identical exercise pages; weave in a
  help/list page, a note-heavy explanation page, and reflection pages.
- Keep paragraphs short and warm; lead with a one-line `.lead` that says what
  the exercise is for.

## Worked example

A complete, multi-page sample (cover, section divider, three content/exercise
styles, help list, reflection) lives in `examples/sample_workbook.html`, with its
rendered output `examples/sample_workbook.pdf`. Read the HTML to see how the
components fit together, and mirror its structure when building a new workbook.
