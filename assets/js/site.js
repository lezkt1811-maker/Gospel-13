/* Lilith & Eve — site script.
   You should not need to edit this file. All your text, links and
   artwork details live in  config.js  at the top of the repository. */
(function () {
  "use strict";

  var S = window.SITE;

  /* ---------- tiny helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (attrs[k] === null || attrs[k] === undefined || attrs[k] === false) return;
      if (k === "class") n.className = attrs[k]; else n.setAttribute(k, attrs[k]);
    });
    if (html !== undefined) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pad2(n) { return n < 10 ? "0" + n : String(n); }
  function roman(n) {
    var map = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
    var out = ""; map.forEach(function (p) { while (n >= p[0]) { out += p[1]; n -= p[0]; } });
    return out;
  }
  function list(v) {
    if (Array.isArray(v)) return v.map(function (x) { return typeof x === "string" ? x.trim() : x; }).filter(Boolean);
    if (typeof v === "string" && v.trim()) return v.split(/\n\s*\n/).map(function (s) { return s.trim(); }).filter(Boolean);
    return [];
  }
  function paragraphs(arr) { return arr.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join(""); }
  function abs(rel) { try { return new URL(rel, location.href).href; } catch (e) { return rel; } }

  $$("[data-year]").forEach(function (n) { n.textContent = new Date().getFullYear(); });

  /* ---------- settings file check ---------- */
  if (!S || typeof S !== "object") {
    var box = $("#config-error");
    if (box) {
      var err = window.__configError;
      box.innerHTML = "<strong>The settings file <code>config.js</code> has a typo" +
        (err && err.line ? " near line " + err.line : "") + ".</strong> " +
        "Usually it’s a missing comma at the end of a line, a missing quote mark, or a curly quote “ ” instead of a straight one \". " +
        "Open <code>config.js</code>, fix that line, and save — the site comes back on its own.";
      box.hidden = false;
    }
    return;
  }

  var AUTHOR = S.authorName || "Katy Lynn Thomas";
  var NOTES = S.showSetupNotes !== false;

  var DEFAULTS = {
    bookOne: { slug: "one", num: "I", word: "One", title: "The Gospel of Lilith and Eve", subtitle: "What Mary Kept from the Flames", folder: "images/book-one/" },
    bookTwo: { slug: "two", num: "II", word: "Two", title: "The Gospel of Eve and Lilith", subtitle: "Feminine Earth Grid", folder: "images/book-two/" }
  };
  var KEY_BY_SLUG = { one: "bookOne", two: "bookTwo" };

  function cleanUrl(u) {
    if (typeof u !== "string") return { url: "", problem: "" };
    u = u.trim();
    if (!u) return { url: "", problem: "" };
    var parsed;
    try { parsed = new URL(u); } catch (e) { return { url: "", problem: "isn’t a complete web address — it must start with https://" }; }
    if (!/^https?:$/.test(parsed.protocol)) return { url: "", problem: "must start with https://" };
    var host = parsed.hostname.toLowerCase();
    var amazon = /(^|\.)amazon\.[a-z.]{2,}$/.test(host) || /(^|\.)amzn\.(to|com|eu|asia)$/.test(host) || host === "a.co";
    return { url: parsed.href, problem: amazon ? "" : "doesn’t look like an Amazon address (it will still be used)" };
  }

  function getBook(key) {
    var d = DEFAULTS[key], b = S[key] || {};
    var title = b.title || d.title, subtitle = b.subtitle || d.subtitle;
    var folder = (b.artFolder || d.folder).replace(/\/?$/, "/");
    var count = parseInt(b.artCount, 10); if (!(count >= 0)) count = 26; count = Math.min(count, 300);
    var amz = cleanUrl(b.amazonUrl);
    return {
      key: key, slug: d.slug, num: d.num, word: d.word,
      title: title, subtitle: subtitle, fullTitle: title + ": " + subtitle,
      amazonUrl: amz.url, amazonProblem: amz.problem, amazonRaw: (b.amazonUrl || "").trim(),
      description: list(b.description),
      cover: b.cover || (folder + "cover.jpg"),
      folder: folder, count: count,
      ext: String(b.artExtension || "jpg").replace(/^\./, ""),
      featured: Array.isArray(b.featured) ? b.featured : [],
      art: (b.art && typeof b.art === "object") ? b.art : {}
    };
  }
  var BOOKS = { bookOne: getBook("bookOne"), bookTwo: getBook("bookTwo") };

  function artItem(book, n) {
    var e = book.art[n] || book.art[String(n)] || {};
    var file = e.file || ("art-" + pad2(n) + "." + book.ext);
    var id = book.slug + "-" + pad2(n);
    var title = (e.title || "").trim();
    var plate = "Plate " + roman(n);
    return {
      n: n, id: id, book: book,
      src: book.folder + file,
      title: title, plate: plate,
      name: title || plate,
      caption: list(e.caption),
      alt: (e.alt || "").trim() ||
        (title ? title + " — artwork from " + book.fullTitle + " by " + AUTHOR
               : plate + ", artwork from " + book.fullTitle + " by " + AUTHOR),
      pin: (e.pin || "").trim() ||
        ((title ? title + " — " : "") + "Artwork from “" + book.fullTitle + "” by " + AUTHOR + "."),
      page: "art.html?art=" + id
    };
  }
  function allItems(book) { var out = []; for (var i = 1; i <= book.count; i++) out.push(artItem(book, i)); return out; }

  /* ---------- does an image exist? (cheap HEAD request, falls back to loading it) ---------- */
  var probes = {};
  function imageProbe(src) {
    return new Promise(function (res) { var i = new Image(); i.onload = function () { res(true); }; i.onerror = function () { res(false); }; i.src = src; });
  }
  function exists(src) {
    if (probes[src]) return probes[src];
    var p;
    if (location.protocol === "file:" || !window.fetch) p = imageProbe(src);
    else p = fetch(src, { method: "HEAD" }).then(function (r) {
      var type = (r.headers.get("content-type") || "image").toLowerCase();
      return r.ok && type.indexOf("image") === 0;
    }, function () { return imageProbe(src); });
    probes[src] = p;
    return p;
  }
  function available(book) {
    return Promise.all(allItems(book).map(function (it) {
      return exists(it.src).then(function (ok) { return ok ? it : null; });
    })).then(function (arr) { return arr.filter(Boolean); });
  }

  /* ---------- setup notes ---------- */
  function note(html) {
    if (!NOTES) return null;
    return el("p", { class: "todo" }, '<span class="todo-tag">✎ To supply</span> ' + html);
  }
  function after(node, n) { if (n && node && node.parentNode) node.parentNode.insertBefore(n, node.nextSibling); }

  /* ---------- Amazon buttons ---------- */
  function wireAmazon(a, book) {
    if (book.amazonUrl) {
      a.href = book.amazonUrl;
      a.target = "_blank";
      a.rel = "noopener";
      a.setAttribute("aria-label", a.textContent.trim() + ": " + book.fullTitle + " (opens Amazon in a new tab)");
      a.classList.remove("is-pending");
    } else {
      a.removeAttribute("href");
      a.setAttribute("aria-disabled", "true");
      a.classList.add("is-pending");
      a.textContent = "Amazon link coming soon";
    }
  }
  function amazonNote(book) {
    if (book.amazonUrl && !book.amazonProblem) return null;
    if (book.amazonProblem) return note("The Book " + book.word + " Amazon link in <code>config.js</code> " + esc(book.amazonProblem) + ".");
    return note("Paste the Book " + book.word + " Amazon link into <code>config.js</code> → <code>" + book.key + "</code> → <code>amazonUrl</code>.");
  }

  /* ---------- covers ---------- */
  function coverPlaceholder(book) {
    return '<div class="cover-ph" aria-hidden="true">' +
      '<span class="cph-num">' + book.num + '</span>' +
      '<span class="cph-title">' + esc(book.title) + '</span>' +
      '<span class="cph-rule"></span>' +
      '<span class="cph-sub">' + esc(book.subtitle) + '</span>' +
      '<span class="cph-author">' + esc(AUTHOR) + '</span></div>';
  }
  function fillCover(node, book, eager) {
    node.classList.add("cover--" + book.slug);
    node.innerHTML = coverPlaceholder(book);
    node.setAttribute("role", "img");
    node.setAttribute("aria-label", "Cover of " + book.fullTitle);
    return exists(book.cover).then(function (ok) {
      if (!ok) return false;
      var img = el("img", { src: book.cover, alt: "Cover of " + book.fullTitle + " by " + AUTHOR, decoding: "async", loading: eager ? null : "lazy" });
      node.removeAttribute("role"); node.removeAttribute("aria-label");
      node.innerHTML = ""; node.appendChild(img); node.classList.add("has-image");
      return true;
    });
  }

  /* ---------- tiles ---------- */
  function tile(it, cls) {
    var li = el("li", { class: cls });
    var a = el("a", { href: it.page, class: cls + "-link" });
    var img = el("img", {
      src: it.src, alt: it.alt, loading: "lazy", decoding: "async",
      "data-pin-description": it.pin,
      "data-pin-url": S.pinterestLinksTo === "amazon" && it.book.amazonUrl ? it.book.amazonUrl : abs(it.page),
      "data-pin-media": abs(it.src)
    });
    img.addEventListener("error", function () { li.remove(); });
    img.addEventListener("load", function () { li.classList.add("is-loaded"); });
    a.appendChild(img);
    a.appendChild(el("span", { class: cls + "-cap" },
      '<span class="plate">' + it.plate + "</span>" + (it.title ? ' <span class="name">' + esc(it.title) + "</span>" : "")));
    li.appendChild(a);
    return li;
  }

  /* =====================================================================
     HOME PAGE
     ===================================================================== */
  function initHome() {
    // Amazon buttons + one note per book under its top button
    $$("[data-amazon]").forEach(function (a) { var b = BOOKS[a.getAttribute("data-amazon")]; if (b) wireAmazon(a, b); });
    ["bookOne", "bookTwo"].forEach(function (key) {
      var book = BOOKS[key];
      var sec = $("#book-" + book.slug);
      if (sec) after($(".book-head .buy-row", sec), amazonNote(book));
    });

    // Covers
    $$("[data-cover]").forEach(function (node) {
      var book = BOOKS[node.getAttribute("data-cover")];
      if (!book) return;
      var large = node.classList.contains("cover--lg");
      fillCover(node, book, !large).then(function (ok) {
        if (!ok && large) after(node, note("Upload the Book " + book.word + " cover as <code>" + esc(book.cover) + "</code>."));
      });
    });

    // Descriptions
    $$("[data-description]").forEach(function (box) {
      var book = BOOKS[box.getAttribute("data-description")];
      if (!book) return;
      if (book.description.length) box.innerHTML = paragraphs(book.description);
      else { var n = note("Your Book " + book.word + " description — add it in <code>config.js</code> → <code>" + book.key + "</code> → <code>description</code>."); if (n) box.appendChild(n); }
    });

    // Art: featured strips + galleries
    ["bookOne", "bookTwo"].forEach(function (key) {
      var book = BOOKS[key];
      available(book).then(function (items) {
        var featBox = $('[data-featured="' + key + '"]');
        var panel = $('[data-gallery="' + key + '"]');

        // featured
        if (featBox) {
          var grid = $(".selected-grid", featBox);
          var byN = {}; items.forEach(function (it) { byN[it.n] = it; });
          var picks = book.featured.map(function (n) { return byN[parseInt(n, 10)]; }).filter(Boolean);
          if (!picks.length) picks = items.slice(0, 3);
          if (picks.length) picks.slice(0, 6).forEach(function (it) { grid.appendChild(tile(it, "sel")); });
          else {
            grid.remove();
            $(".text-link", featBox).remove();
            var n = note("Upload your artwork as <code>art-01." + esc(book.ext) + "</code>, <code>art-02." + esc(book.ext) + "</code>… into <code>" + esc(book.folder) + "</code>. It appears here automatically.");
            if (n) featBox.appendChild(n); else featBox.hidden = true;
          }
        }

        // gallery
        if (panel) {
          var ul = $(".masonry", panel);
          if (items.length) {
            items.forEach(function (it) { ul.appendChild(tile(it, "m")); });
            var t = $(".panel-title", panel);
            if (t) t.appendChild(el("span", { class: "count" }, " · " + items.length + (items.length === 1 ? " work" : " works")));
          } else {
            ul.replaceWith(el("div", { class: "empty" },
              '<p class="empty-mark" aria-hidden="true">✦</p><p>The artwork for this book is on its way.</p>'));
            var n2 = note("Artwork for Book " + book.word + " shows here once files are in <code>" + esc(book.folder) + "</code>.");
            if (n2) $(".empty", panel).appendChild(n2);
          }
        }
      });
    });

    // About
    var bio = $("[data-bio]");
    if (bio) {
      var b = list(S.about && S.about.bio);
      if (b.length) bio.innerHTML = paragraphs(b);
      else { var n3 = note("Your biography — add it in <code>config.js</code> → <code>about</code> → <code>bio</code>."); if (n3) bio.appendChild(n3); }
    }
    var photoBox = $("[data-author-photo]");
    var photo = S.about && S.about.photo;
    if (photoBox && photo) exists(photo).then(function (ok) {
      if (!ok) return;
      var img = $("img", photoBox); img.src = photo; img.alt = "Portrait of " + AUTHOR; photoBox.hidden = false;
      $("#about").classList.add("has-photo");
    });
    var linkBox = $("[data-author-links]");
    if (linkBox) {
      var links = (S.about && Array.isArray(S.about.links) ? S.about.links : []).filter(function (l) { return l && l.label && cleanUrl(l.url).url; });
      if (links.length) links.forEach(function (l) {
        var li = el("li"); li.appendChild(el("a", { href: cleanUrl(l.url).url, target: "_blank", rel: "noopener" }, esc(l.label) + ' <span aria-hidden="true">↗</span>'));
        linkBox.appendChild(li);
      }); else linkBox.remove();
    }

    initTabs();
  }

  /* ---------- gallery tabs ---------- */
  function initTabs() {
    var tabs = $$('[role="tab"]');
    if (!tabs.length) return;
    function select(key, focus) {
      tabs.forEach(function (t) {
        var on = t.id === "tab-" + key;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        $("#" + t.getAttribute("aria-controls")).hidden = !on;
        if (on && focus) t.focus();
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t.id.replace("tab-", "")); });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var next = tabs[(i + d + tabs.length) % tabs.length];
        select(next.id.replace("tab-", ""), true);
      });
    });
    $$("[data-open-tab]").forEach(function (a) {
      a.addEventListener("click", function () { select(a.getAttribute("data-open-tab")); });
    });
    // Shareable links straight to a book's gallery:  index.html#gallery-one  /  #gallery-two
    function fromHash() {
      var m = /^#gallery-(one|two)$/.exec(location.hash);
      if (!m) return;
      select(KEY_BY_SLUG[m[1]]);
      var g = $("#gallery"); if (g) g.scrollIntoView();
    }
    window.addEventListener("hashchange", fromHash);
    fromHash();
  }

  /* =====================================================================
     SINGLE ARTWORK PAGE  (art.html?art=one-07)
     ===================================================================== */
  function initArt() {
    var q = new URLSearchParams(location.search).get("art") || "";
    var m = /^(one|two)-(\d{1,3})$/.exec(q.trim().toLowerCase());
    var missing = $("[data-art-missing]");
    var missingText = $("[data-art-missing-text]");

    if (!m) {
      $("[data-art-title]").textContent = "Artwork not found";
      $(".art-book").hidden = true;
      $(".art-actions").hidden = true;
      missingText.innerHTML = 'We couldn’t find that artwork. <a href="index.html#gallery">Visit the gallery</a>.';
      missing.hidden = false;
      return;
    }

    var book = BOOKS[KEY_BY_SLUG[m[1]]];
    var it = artItem(book, parseInt(m[2], 10));
    var pageUrl = abs(it.page);

    document.title = it.name + " — " + book.title + " | " + AUTHOR;
    var desc = it.caption[0] || ("Artwork from " + book.fullTitle + " by " + AUTHOR + ".");
    setMeta('meta[name="description"]', desc);
    setMeta('meta[property="og:title"]', it.name + " — " + book.fullTitle);
    setMeta('meta[property="og:description"]', desc);
    setMeta('meta[property="og:image"]', abs(it.src));
    var canon = el("link", { rel: "canonical", href: pageUrl }); document.head.appendChild(canon);

    document.body.classList.add("art--" + book.slug);
    $("[data-art-kicker]").textContent = "Book " + book.num + " · " + it.plate;
    $("[data-art-title]").textContent = it.name;
    $("[data-art-booktitle]").textContent = book.fullTitle;
    $("[data-art-booklink]").href = "index.html#book-" + book.slug;
    $("[data-back]").href = "index.html#gallery-" + book.slug;
    if (it.caption.length) $("[data-art-caption]").innerHTML = paragraphs(it.caption);

    var amz = $("[data-art-amazon]");
    amz.textContent = "Buy the book on Amazon";
    wireAmazon(amz, book);
    after($(".art-actions"), amazonNote(book));

    var pin = $("[data-pin]");
    var dest = (S.pinterestLinksTo === "amazon" && book.amazonUrl) ? book.amazonUrl : pageUrl;
    pin.href = "https://www.pinterest.com/pin/create/button/?url=" + encodeURIComponent(dest) +
      "&media=" + encodeURIComponent(abs(it.src)) + "&description=" + encodeURIComponent(it.pin);

    var img = $("[data-art-img]");
    img.alt = it.alt;
    img.setAttribute("data-pin-description", it.pin);
    img.setAttribute("data-pin-url", dest);
    img.onload = function () { img.hidden = false; missing.hidden = true; };
    img.onerror = function () {
      img.hidden = true;
      pin.hidden = true;
      missing.hidden = false;
      var n = note("Upload this image as <code>" + esc(it.src) + "</code>.");
      if (n) missing.appendChild(n);
    };
    img.src = it.src;

    // Share / copy link
    var shareBtn = $("[data-share]"), shareLabel = $("[data-share-label]");
    shareBtn.addEventListener("click", function () {
      var data = { title: it.name + " — " + book.title, text: it.pin, url: pageUrl };
      if (navigator.share) { navigator.share(data).catch(function () {}); return; }
      function done() { shareLabel.textContent = "Link copied ✓"; setTimeout(function () { shareLabel.textContent = "Share this artwork"; }, 2400); }
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(pageUrl).then(done, function () { window.prompt("Copy this link:", pageUrl); });
      else window.prompt("Copy this link:", pageUrl);
    });

    // Previous / next among uploaded artwork of the same book
    available(book).then(function (items) {
      var idx = -1; items.forEach(function (x, i) { if (x.n === it.n) idx = i; });
      if (idx < 0) return;
      var prev = items[idx - 1], next = items[idx + 1];
      if (prev) { var p = $("[data-art-prev]"); p.href = prev.page; p.hidden = false; p.setAttribute("aria-label", "Previous: " + prev.name); }
      if (next) { var x = $("[data-art-next]"); x.href = next.page; x.hidden = false; x.setAttribute("aria-label", "Next: " + next.name); }
    });
  }

  function setMeta(sel, val) { var n = document.querySelector(sel); if (n) n.setAttribute("content", val); }

  if ($("[data-art-page]")) initArt(); else initHome();
})();
