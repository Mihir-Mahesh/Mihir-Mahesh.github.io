// Renders the résumé on resume.html from the same content.js as the rest of
// the site, plus the résumé-only extras in SITE.resume.
(() => {
  const s = window.SITE;
  const r = s.resume || {};
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const link = (url, label) => `<a href="${esc(url)}"${url.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${esc(label)}</a>`;

  // A title with its date on the right, an optional subtitle, then bullets or a summary
  const entry = ({ title, date, sub, points, summary }) => `
    <div class="rs-entry">
      <div class="rs-head"><h3>${title}</h3>${date ? `<span class="rs-date">${esc(date)}</span>` : ""}</div>
      ${sub ? `<p class="rs-sub">${sub}</p>` : ""}
      ${points ? `<ul>${points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
      ${summary ? `<p class="rs-summary">${esc(summary)}</p>` : ""}
    </div>`;
  // The heading is glued to the first item so a printed page never ends on a bare heading
  const section = (title, items) => `<section class="rs-section">
    <div class="rs-keep"><h2>${title}</h2>${items[0]}</div>${items.slice(1).join("")}</section>`;

  const e = s.education;
  const linkedin = s.links.find((l) => l.url.includes("linkedin"));
  const jobs = [...s.experience, ...(r.experience || [])];
  const projects = [...s.projects, ...(r.projects || [])];
  const pubs = s.publications;

  document.querySelector("[data-resume]").innerHTML = `
    <header class="rs-top">
      <h1>${esc(s.name)}</h1>
      <p class="rs-contact">${link(`mailto:${s.email}`, s.email)}${linkedin ? ` · ${link(linkedin.url, "LinkedIn")}` : ""}</p>
    </header>

    ${section("Education", [entry({
      title: esc(e.school),
      date: e.date,
      sub: `${esc(e.degree)}${e.honors ? ` · ${esc(e.honors)}` : ""} · GPA ${esc(e.gpa)}`,
      points: Object.entries(e.courses).map(([level, list]) => `${level} coursework: ${list.join(", ")}`),
    })])}

    ${section("Experience", jobs.map((x) => entry({
      title: esc(x.title),
      date: x.date,
      sub: `${x.url ? link(x.url, x.org) : esc(x.org)} · ${esc(x.place)}`,
      points: x.points,
    })))}

    ${section("Publications", [`<ol class="rs-pubs">${pubs.items.map((p) => `
      <li><strong>${esc(p.title)}</strong>.
        ${p.authors.map((a, i) => (a === pubs.me ? `<u>${esc(a)}</u>` : esc(a)) + (i < (p.equal || 0) ? "*" : "")).join(", ")}.
        <em>${[p.status, p.venue, p.year].filter(Boolean).map(esc).join(", ")}</em>.${p.equal ? " *Equal contribution." : ""}</li>`).join("")}</ol>`])}

    ${section("Projects", projects.map((p) => entry({
      title: p.links?.length ? link(p.links[0].url, p.title) : esc(p.title),
      date: p.date,
      points: p.points,
      summary: p.summary,
    })))}

    ${section("Skills", [`<dl class="rs-skills">${Object.entries(s.skills).map(([group, list]) => `
      <div><dt>${esc(group)}</dt><dd>${list.map(esc).join(", ")}</dd></div>`).join("")}</dl>`])}

    ${r.awards?.length ? section("Awards & Honors", r.awards.map((a) => `
      <div class="rs-head rs-award"><p><strong>${esc(a.title)}</strong>: ${esc(a.detail)}</p><span class="rs-date">${esc(a.date)}</span></div>`)) : ""}`;

  document.querySelector(".print-plank").addEventListener("click", () => print());
})();
