/* =====================================================================
   SITE SETTINGS  —  this is the ONLY file you need to edit.
   =====================================================================

   HOW TO EDIT SAFELY (especially on a phone):
   • Change only the text BETWEEN the "straight quotes".
   • Keep every comma at the end of a line.
   • Use plain straight quotes  "  — not curly quotes  “ ”.
     (iPhone: Settings › General › Keyboard › turn OFF Smart Punctuation
      while you edit, then turn it back on.)
   • Apostrophes are fine inside text:  "Katy's book"  works.
   • If you need a double quote INSIDE your text, type  \"  instead.
   • Lines starting with  //  are notes for you. The website ignores them.

   Anything marked   ✎ TO SUPPLY   is waiting for your information.
   If you make a typo, the website shows a red banner telling you which
   line to look at — nothing is permanently broken.
   ===================================================================== */

window.SITE = {

  // Your website address. Already set for your GitHub repository.
  siteUrl: "https://lezkt1811-maker.github.io/Gospel-13/",

  authorName: "Katy Lynn Thomas",

  // true  = show the dashed "To supply" reminders on the site (helpful while building)
  // false = hide them from visitors once everything is filled in
  showSetupNotes: true,

  // Where a Pinterest pin should send people when they tap it:
  //   "artPage" = the artwork's own page on this site (it has the Amazon button)  ← recommended
  //   "amazon"  = straight to the book's Amazon listing
  pinterestLinksTo: "artPage",


  /* -------------------------------------------------------------------
     BOOK ONE
     ------------------------------------------------------------------- */
  bookOne: {
    title: "The Gospel of Lilith and Eve",
    subtitle: "What Mary Kept from the Flames",

    // ✎ TO SUPPLY — paste your full Amazon link between the quotes.
    // Example shape: "https://www.amazon.com/dp/XXXXXXXXXX"
    amazonUrl: "",

    // ✎ TO SUPPLY — your book description. One paragraph per pair of quotes.
    description: [
      // "First paragraph of your description goes here.",
      // "Second paragraph goes here.",
    ],

    // Book cover: upload your cover as  images/book-one/cover.jpg
    cover: "images/book-one/cover.jpg",

    // Artwork: upload files named  art-01.jpg, art-02.jpg ... art-26.jpg
    // into the folder  images/book-one/   They appear automatically.
    artFolder: "images/book-one/",
    artCount: 26,
    artExtension: "jpg",        // change to "png" if your files are .png

    // Which artwork numbers to show under "Selected artwork" in the book section.
    featured: [1, 2, 3],

    // OPTIONAL — titles and captions for individual artworks.
    // Copy a line, remove the  //  at the start, and fill it in.
    // "alt" describes the image for blind visitors and search engines.
    art: {
      // 1: { title: "", caption: "", alt: "" },
      // 2: { title: "", caption: "", alt: "" },
    },
  },


  /* -------------------------------------------------------------------
     BOOK TWO
     ------------------------------------------------------------------- */
  bookTwo: {
    title: "The Gospel of Eve and Lilith",
    subtitle: "Feminine Earth Grid",

    // ✎ TO SUPPLY — paste your full Amazon link between the quotes.
    amazonUrl: "",

    // ✎ TO SUPPLY — your book description. One paragraph per pair of quotes.
    description: [
      // "First paragraph of your description goes here.",
      // "Second paragraph goes here.",
    ],

    cover: "images/book-two/cover.jpg",

    artFolder: "images/book-two/",
    artCount: 26,
    artExtension: "jpg",

    featured: [1, 2, 3],

    art: {
      // 1: { title: "", caption: "", alt: "" },
    },
  },


  /* -------------------------------------------------------------------
     ABOUT THE AUTHOR
     ------------------------------------------------------------------- */
  about: {
    // ✎ TO SUPPLY — your biography. One paragraph per pair of quotes.
    bio: [
      // "Katy Lynn Thomas is ...",
    ],

    // OPTIONAL — upload a portrait as  images/author/photo.jpg
    photo: "images/author/photo.jpg",

    // OPTIONAL — links shown under your bio (Instagram, Pinterest, Amazon Author Page...).
    // Remove the  //  to use a line.
    links: [
      // { label: "Amazon Author Page", url: "" },
      // { label: "Pinterest", url: "" },
      // { label: "Instagram", url: "" },
    ],
  },

};
