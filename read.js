// Renders one piece of writing on read.html?piece=<slug>.
//
// Each piece's text lives in writing/<slug>.js, which calls WRITING(`...`).
// It's loaded as a script rather than fetched so the page also works when
// opened straight from disk.
(() => {
  const $ = (sel) => document.querySelector(sel);
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const italics = (t) => esc(t).replace(/(^|\W)_(.+?)_(?=\W|$)/g, "$1<em>$2</em>");

  // One paragraph per line; a blank line adds a pause before the next one;
  // "…" alone is a scene break; "## " a heading; "- " a list item;
  // "![description](path)" a picture.
  function render(text) {
    let html = "", list = false, pause = false;
    for (const raw of text.split("\n")) {
      const line = raw.trim();
      if (list && !line.startsWith("- ")) { html += "</ul>"; list = false; }
      if (!line) { pause = html !== ""; continue; }
      const cls = pause ? ' class="after-pause"' : "";
      pause = false;
      const pic = line.match(/^!\[(.*)\]\((.+)\)$/);
      if (pic) html += `<figure${cls}><img src="${esc(pic[2])}" alt="${esc(pic[1])}" loading="lazy" /></figure>`;
      else if (line === "…" || line === "***") html += '<hr class="scene-break" />';
      else if (line.startsWith("## ")) html += `<h2>${italics(line.slice(3))}</h2>`;
      else if (line.startsWith("- ")) {
        if (!list) { html += `<ul${cls}>`; list = true; }
        html += `<li>${italics(line.slice(2))}</li>`;
      } else html += `<p${cls}>${italics(line)}</p>`;
    }
    return html + (list ? "</ul>" : "");
  }

  const body = $("[data-piece-body]");
  const slug = new URLSearchParams(location.search).get("piece");
  const piece = (window.SITE.fun.writing || []).find((w) => w.slug === slug);
  if (!piece) {
    $("[data-piece-title]").textContent = "Piece not found";
    body.innerHTML = `<p class="after-pause">That piece isn't on the shelf. <a href="monkeying-around.html#writing">Back to the writing shelf</a>.</p>`;
    return;
  }

  $("[data-piece-title]").innerHTML = italics(piece.title);
  $("[data-piece-kind]").textContent = piece.kind + (piece.minutes ? ` · ${piece.minutes} min read` : "");
  document.title = `${piece.title.replace(/_/g, "")} · ${window.SITE.name}`;

  window.WRITING = (text) => { body.innerHTML = render(text); };
  const script = document.createElement("script");
  script.src = `writing/${encodeURIComponent(piece.slug)}.js`;
  script.onerror = () => { body.innerHTML = '<p class="after-pause">This piece couldn\'t be loaded.</p>'; };
  document.body.appendChild(script);
})();
