(() => {
  const s = window.SITE;
  const $ = (sel) => document.querySelector(sel);
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const chips = (items, cls = "chip") => items.map((t) => `<li class="${cls}">${esc(t)}</li>`).join("");
  const logo = (src, alt) => (src ? `<img class="logo" src="${esc(src)}" alt="${esc(alt)} logo" loading="lazy" />` : "");
  // Both pages share this script, so each part only renders if its slot is on the page
  const fill = (sel, html) => { const el = $(sel); if (el) el.innerHTML = typeof html === "function" ? html() : html; };
  const text = (sel, t) => { const el = $(sel); if (el) el.textContent = t; };
  const italics = (t) => esc(t).replace(/(^|\W)_(.+?)_(?=\W|$)/g, "$1<em>$2</em>");

  // Hero
  text("[data-initials]", s.name.split(" ").map((w) => w[0]).join(""));
  text("[data-name]", s.name);
  text("[data-role]", s.role);
  text("[data-tagline]", s.tagline);

  // Profile photo: until the file exists, the frame shows a placeholder
  const photo = $("[data-photo]");
  if (photo) {
    photo.alt = `Photo of ${s.name}`;
    photo.addEventListener("error", () => photo.closest(".photo-frame").classList.add("empty"), { once: true });
    photo.src = s.photo;
  }
  fill("[data-links]", () =>
    (s.resumeUrl ? `<a class="btn btn-primary" href="${esc(s.resumeUrl)}">View résumé</a>` : "") +
    s.links.map((l) => `<a class="btn" href="${esc(l.url)}"${l.url.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${esc(l.label)}</a>`).join(""));

  // Education
  const e = s.education;
  fill("[data-education]", () => `
    <div class="sign-head">
      ${logo(e.logo, e.school)}
      <div class="sign-title">
        <h3>${esc(e.school)}</h3>
        <p class="muted">${esc(e.degree)}</p>
        <p class="gpa">GPA <strong>${esc(e.gpa)}</strong></p>
      </div>
      <span class="date">${esc(e.date)}</span>
    </div>
    ${Object.entries(e.courses).map(([level, list]) => `
      <h4 class="label">${esc(level)} coursework</h4>
      <ul class="chips">${chips(list)}</ul>`).join("")}`);

  // Experience
  fill("[data-experience]", () => s.experience.map((x) => `
    <li class="job">
      <div class="card">
        <div class="sign-head">
          ${x.url ? `<a class="logo-link" href="${esc(x.url)}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">${logo(x.logo, x.org)}</a>` : logo(x.logo, x.org)}
          <div class="sign-title">
            <h3>${esc(x.title)}</h3>
            <p class="muted">${x.url ? `<a class="org-link" href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.org)}</a>` : esc(x.org)} · ${esc(x.place)}</p>
          </div>
          <span class="date">${esc(x.date)}</span>
        </div>
        <ul class="points">${x.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
      </div>
    </li>`).join(""));

  // Projects
  fill("[data-projects]", () => s.projects.map((p) => `
    <article class="card project">
      <h3>${p.links?.length ? `<a class="project-link" href="${esc(p.links[0].url)}" target="_blank" rel="noopener">${esc(p.title)}</a>` : esc(p.title)}</h3>
      <p>${esc(p.summary)}</p>
      <ul class="chips">${(p.links || []).map((l) => `<li><a class="chip chip-link" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a></li>`).join("")}</ul>
    </article>`).join(""));

  // Skills
  fill("[data-skills]", () => Object.entries(s.skills).map(([group, list]) => `
    <div class="skill-group">
      <h4 class="label">${esc(group)}</h4>
      <ul class="chips">${chips(list)}</ul>
    </div>`).join(""));

  // Publications
  const pubs = s.publications;
  fill("[data-publications]", () => pubs.items.map((p) => `
    <article class="card pub">
      <h3>${esc(p.title)}</h3>
      <p class="authors">${p.authors.map((a) => (a === pubs.me ? `<strong>${esc(a)}</strong>` : esc(a))).join(", ")}</p>
      <div class="pub-meta">
        <span class="date">${[p.status, p.venue, p.year].filter(Boolean).map(esc).join(" · ")}</span>
        ${p.links?.length ? `<ul class="chips">${p.links.map((l) => `<li><a class="chip chip-link" href="${esc(l.url)}">${esc(l.label)}</a></li>`).join("")}</ul>` : ""}
      </div>
    </article>`).join(""));

  // Monkeying Around page
  const fun = s.fun;
  text("[data-fun-tagline]", fun.tagline);
  fill("[data-fun-hobbies]", () => fun.hobbies.map((h) => `
    <article class="card hobby${h.chess ? " hobby-chess" : ""}"${h.look ? ` data-look="${esc(h.look)}"` : ""}>
      <span class="hobby-emoji" aria-hidden="true">${esc(h.emoji)}</span>
      <h3>${esc(h.title)}</h3>
      <p>${italics(h.blurb)}</p>
      ${h.chess ? `
      <div class="chess-stats" data-chess="${esc(h.chess)}" aria-live="polite">
        <p class="cs-main"><span class="cs-num">····</span><span class="cs-label">Rapid rating</span></p>
        <dl class="cs-row">
          <div><dt>Best</dt><dd data-cs="best">–</dd></div>
          <div><dt>Wins</dt><dd data-cs="win">–</dd></div>
          <div><dt>Losses</dt><dd data-cs="loss">–</dd></div>
          <div><dt>Draws</dt><dd data-cs="draw">–</dd></div>
        </dl>
      </div>
      <ul class="chips"><li><a class="chip chip-link" href="https://www.chess.com/member/${encodeURIComponent(h.chess)}" target="_blank" rel="noopener">chess.com profile ↗</a></li></ul>` : ""}
      ${h.links?.length ? `<ul class="chips">${h.links.map((l) => `<li><a class="chip chip-link" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a></li>`).join("")}</ul>` : ""}
    </article>`).join(""));

  // Live rapid stats from chess.com's public API (no key needed, and it allows
  // cross-site requests). If it can't be reached, only the profile link shows.
  document.querySelectorAll("[data-chess]").forEach(async (box) => {
    try {
      const res = await fetch(`https://api.chess.com/pub/player/${encodeURIComponent(box.dataset.chess.toLowerCase())}/stats`);
      if (!res.ok) throw new Error(res.status);
      const rapid = (await res.json()).chess_rapid;
      if (!rapid) throw new Error("no rapid games");
      const n = (v) => (v == null ? "–" : Number(v).toLocaleString());
      box.querySelector(".cs-num").textContent = n(rapid.last?.rating);
      box.querySelector('[data-cs="best"]').textContent = n(rapid.best?.rating);
      for (const k of ["win", "loss", "draw"]) box.querySelector(`[data-cs="${k}"]`).textContent = n(rapid.record?.[k]);
      box.classList.add("loaded");
    } catch {
      box.remove();
    }
  });
  // The bookshelf: each piece opens on its own reading page
  // Pieces of the same kind share a spine color
  const SPINES = ["#c0392b", "#1e5aa8", "#d68910", "#2e7d32", "#8e44ad"];
  const kinds = [...new Set(fun.writing.map((w) => w.kind))];
  fill("[data-fun-writing]", () => `<ul class="shelf">${fun.writing.map((w) => `
    <li class="book">
      <span class="spine" style="--spine:${SPINES[kinds.indexOf(w.kind) % SPINES.length]}" aria-hidden="true"></span>
      <div>
        <p class="book-kind">${esc(w.kind)}${w.minutes ? ` · ${esc(w.minutes)} min read` : ""}</p>
        <h3><a href="read.html?piece=${encodeURIComponent(w.slug)}">${italics(w.title)}</a></h3>
        <p>${italics(w.blurb)}</p>
      </div>
    </li>`).join("")}</ul>`);

  // Footer
  const email = $("[data-email]");
  if (email) {
    email.textContent = s.email;
    email.href = `mailto:${s.email}`;
  }
  text("[data-copyright]", `© ${new Date().getFullYear()} ${s.name}`);

  // Reveal sections as they scroll into view
  const reveal = document.querySelectorAll(".section, .job, .project, .hobby");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }, { rootMargin: "0px 0px -10% 0px" });
    reveal.forEach((el) => { el.classList.add("reveal"); io.observe(el); });
  }

  // Nav gets a backdrop once you leave the opening scene (watched, not polled on scroll)
  const nav = $(".nav");
  if ("IntersectionObserver" in window && $(".nav-sentinel")) {
    new IntersectionObserver(([en]) => nav.classList.toggle("scrolled", !en.isIntersecting && en.boundingClientRect.top < 0)).observe($(".nav-sentinel"));
  } else {
    nav.classList.add("scrolled");
  }

  // Motion toggle: remembered per visitor; starts off if their system asks for less motion
  const root = document.documentElement;
  const motionBtn = $(".motion-toggle");
  function setStill(still) {
    root.classList.toggle("still", still);
    if (motionBtn) {
      motionBtn.setAttribute("aria-pressed", String(still));
      motionBtn.querySelector(".mt-label").textContent = still ? "Play motion" : "Pause motion";
    }
    dispatchEvent(new Event("motionchange"));
  }
  let savedMotion = null;
  try { savedMotion = localStorage.getItem("motion"); } catch {}
  setStill(savedMotion ? savedMotion === "still" : matchMedia("(prefers-reduced-motion: reduce)").matches);
  if (motionBtn) motionBtn.addEventListener("click", () => {
    const still = !root.classList.contains("still");
    setStill(still);
    try { localStorage.setItem("motion", still ? "still" : "moving"); } catch {}
  });

  // Day and night: click the sun to set it and raise the moon, click the moon for day.
  // The reading page has no sky, so it gets a "lights" plank instead.
  const sunBtn = $(".sun");
  const moonBtn = $(".moon");
  const lightsBtn = $(".lights-toggle");
  function setNight(night, animate = true) {
    if (!animate) document.body.classList.add("instant");
    document.body.classList.toggle("night", night);
    if (sunBtn) {
      sunBtn.tabIndex = night ? -1 : 0;
      moonBtn.tabIndex = night ? 0 : -1;
    }
    if (lightsBtn) {
      lightsBtn.setAttribute("aria-pressed", String(night));
      lightsBtn.querySelector(".lt-label").textContent = night ? "Lights on" : "Lights off";
      lightsBtn.querySelector(".lt-icon").textContent = night ? "☀" : "☾";
    }
    try { localStorage.setItem("sky", night ? "night" : "day"); } catch {}
    if (!animate) requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.remove("instant")));
  }
  if (sunBtn) {
    sunBtn.addEventListener("click", () => { setNight(true); moonBtn.focus({ preventScroll: true }); });
    moonBtn.addEventListener("click", () => { setNight(false); sunBtn.focus({ preventScroll: true }); });
  }
  if (lightsBtn) lightsBtn.addEventListener("click", () => setNight(!document.body.classList.contains("night")));
  let saved = null;
  try { saved = localStorage.getItem("sky"); } catch {}
  setNight(saved === "night", false);
})();
