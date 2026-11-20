// Cartoon clouds drifting across the opening sky. The sky gradient itself is
// CSS on <body>; the forest below is drawn by forest.js.
//
// Each cloud is a small inline SVG built once; the drifting and bobbing are
// CSS transform animations, so the browser's compositor moves them without
// any per-frame JavaScript or repainting.
(() => {
  const scene = document.querySelector(".scene");

  // Seeded randomness so the sky looks the same on every visit
  function mulberry32(a) {
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const f = (n) => Math.round(n * 10) / 10;

  // ---------- Cartoon clouds ----------
  // A union of circles sitting on a flat, rounded base, in a 100-wide box with
  // the base at y = 0. Filled twice: pale blue first, then white nudged up and
  // clipped to the cloud, leaving a band of shade along the underside.
  function cloudSVG(seed, flat, id) {
    const rnd = mulberry32(seed);
    const circle = (x, y, r) => `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0`;
    const baseH = flat ? 11 : 15;
    const br = baseH / 2;
    let d = circle(6 + br, -br, br) + circle(94 - br, -br, br) + `M${6 + br} ${-baseH}v${baseH}h${88 - baseH}v${-baseH}Z`; // same winding as the circles so overlaps fill
    const n = flat ? 4 : 3 + ((rnd() * 2) | 0);
    let top = -baseH, bottom = 0;
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n;
      const dome = Math.sin(t * Math.PI);
      const r = (flat ? 8 + 5 * dome : 11 + 13 * dome) * (0.88 + rnd() * 0.24);
      const y = -baseH * 0.55 - r * (flat ? 0.25 : 0.45);
      d += circle(15 + 70 * t + (rnd() - 0.5) * 4, y, r);
      top = Math.min(top, y - r);
      bottom = Math.max(bottom, y + r); // lower puffs can hang a little below the base
    }
    const h = -top + 1, below = bottom + 1;
    const svg = `<svg viewBox="0 ${f(-h)} 100 ${f(h + below)}" aria-hidden="true">
      <clipPath id="${id}"><path d="${d}"/></clipPath>
      <path d="${d}" fill="#cbe4fb"/>
      <g clip-path="url(#${id})"><path d="${d}" fill="#fff" transform="translate(0 -3.5)"/></g></svg>`;
    return { svg };
  }

  const layer = document.createElement("div");
  layer.className = "clouds";
  layer.setAttribute("aria-hidden", "true");
  scene.querySelector(".celestial").after(layer); // in front of the sun and moon

  let builtFor = 0;

  function build() {
    const W = document.documentElement.clientWidth;
    if (W === builtFor) return;
    builtFor = W;

    const rnd = mulberry32(21);
    const size = Math.min(1.1, Math.max(0.45, W / 1300));
    let html = "";
    const add = (seed, flat, topPct, scale, speed) => {
      const w = 460 * scale * size;
      const { svg } = cloudSVG(seed, flat, `cloud-${seed}`);
      const travel = W + w;
      const dur = travel / speed;
      const delay = -rnd() * dur; // start somewhere along the path
      const x0 = rnd() * travel - w; // resting spot when motion is reduced
      html += `<div class="cloud" style="top:${f(topPct)}%;width:${f(w)}px;--w:${f(w)}px;--x0:${f(x0)}px;--dur:${f(dur)}s;--delay:${f(delay)}s;--bob-delay:${f(-rnd() * 10)}s">${svg}</div>`;
    };

    // Big clouds in the opening sky, kept away from the very top
    const count = Math.max(3, Math.round(W / 280));
    for (let i = 0; i < count; i++) {
      add(101 + (i % 5) * 17, false, 15 + 62 * ((i + rnd() * 0.8) / count) - 10, 0.6 + rnd() * 0.55, 5 + rnd() * 9);
    }
    // A couple of small ones low in the sky, peeking over the tree tops
    for (let i = 0; i < 2; i++) add(503 + i * 29, true, 88 + rnd() * 8, 0.45 + rnd() * 0.3, 2 + rnd() * 3);

    layer.innerHTML = html;
  }

  // Pause everything in the opening sky (clouds, sun rays, the moon's z's)
  // once it's scrolled out of view
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([en]) => scene.classList.toggle("paused", !en.isIntersecting)).observe(scene);
  }

  let timer;
  addEventListener("resize", () => { clearTimeout(timer); timer = setTimeout(build, 150); });
  build();
})();
