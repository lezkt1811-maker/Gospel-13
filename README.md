# Gospel-13 — Lilith & Eve author website

The website for **Katy Lynn Thomas** and her two books:

- **Book One:** *The Gospel of Lilith and Eve: What Mary Kept from the Flames*
- **Book Two:** *The Gospel of Eve and Lilith: Feminine Earth Grid*

Plain HTML, CSS and JavaScript. No build step, no paid services. Hosted free on GitHub Pages.

**Live address (once Pages is on):** https://lezkt1811-maker.github.io/Gospel-13/

---

## The one file you edit: `config.js`

Everything you need to fill in lives in **`config.js`**:

| What | Where in `config.js` |
|---|---|
| Book One Amazon link | `bookOne` → `amazonUrl` |
| Book Two Amazon link | `bookTwo` → `amazonUrl` |
| Book descriptions | `bookOne` / `bookTwo` → `description` |
| Artwork titles & captions (optional) | `bookOne` / `bookTwo` → `art` |
| Which art shows under "Selected artwork" | `featured` |
| Your biography | `about` → `bio` |
| Links (Pinterest, Instagram, Amazon Author Page) | `about` → `links` |
| Hide the "To supply" reminder boxes | `showSetupNotes: false` |

Until something is filled in, the site shows a dashed **✎ To supply** box in its place, so you can see what's missing.
Nothing on the site is invented — no reviews, awards or descriptions.

### Editing from your phone
1. Open the repository on github.com in your phone's browser.
2. Tap **`config.js`**, then the **pencil ✎** icon.
3. Change the text **between the straight quotes** `" "`. Keep the commas at line ends.
4. Scroll down, tap **Commit changes**. The site updates in about a minute.

> **iPhone tip:** turn off *Settings › General › Keyboard › Smart Punctuation* while editing.
> Curly quotes `“ ”` break the file. If that happens, the site shows a red banner naming the line to fix.

---

## Adding your artwork and covers

| Upload to | File names |
|---|---|
| `images/book-one/` | `cover.jpg`, `art-01.jpg` … `art-26.jpg` |
| `images/book-two/` | `cover.jpg`, `art-01.jpg` … `art-26.jpg` |
| `images/author/` | `photo.jpg` (optional portrait) |

- Images appear automatically. Missing numbers are skipped — the site works with 0, 5 or 26 images.
- Two-digit numbers (`art-07`, not `art-7`), lowercase.
- `.png` files? Set `artExtension: "png"` for that book in `config.js`.
- Best size: about 1600 px on the longest side, under ~600 KB each.

**To upload on GitHub:** open the folder → **Add file** → **Upload files** → choose images → **Commit changes**.
(On a phone, use your browser's "Request desktop site" if you don't see *Add file*.)

---

## Pinterest

Every artwork has its own permanent page:

```
https://lezkt1811-maker.github.io/Gospel-13/art.html?art=one-07   ← Book One, image 7
https://lezkt1811-maker.github.io/Gospel-13/art.html?art=two-12   ← Book Two, image 12
```

Each artwork page has:
- the **Buy on Amazon** button for the correct book (automatically — `one-…` uses Book One's link, `two-…` uses Book Two's),
- a **Save to Pinterest** button that pins the image with the book's title and a link back,
- **Share** and **Previous / Next** links.

`pinterestLinksTo` in `config.js` decides where a pin sends people: `"artPage"` (recommended — the artwork page with the Amazon button) or `"amazon"` (straight to Amazon).

Links straight to a book's gallery: `index.html#gallery-one` and `index.html#gallery-two`.

---

## Publishing (one time)

1. On github.com open this repository → **Settings** → **Pages**.
2. Under **Build and deployment**: Source = **Deploy from a branch**, Branch = **main**, folder = **/ (root)** → **Save**.
3. Wait 1–3 minutes, refresh the Pages screen, and your address appears at the top.

---

## Files

```
index.html        Home, Book One, Book Two, Gallery, About
art.html          The single-artwork page (Pinterest / sharing)
config.js         ← YOUR SETTINGS
404.html          "Page not found"
sitemap.xml       For search engines
robots.txt
assets/css/       Styles (colors at the top of site.css)
assets/js/        Site script — no need to edit
assets/img/       Social share card, icons
images/           Your covers and artwork
```

`assets/img/share-card.jpg` is the preview image shown when the site link is shared. To use your own, upload a 1200 × 630 image with that same name.

Fonts (Bodoni Moda and Newsreader) load free from Google Fonts. If they're ever blocked, the site falls back to built-in elegant serif fonts.
