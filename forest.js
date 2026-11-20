// The forest and its monkeys.
//
// Every content block is a sign. Monkeys hold the signs up from branches that
// grow out of two big trunks on either side of the page. Where the blocks are
// stacked too tightly to stand beneath (Experience), two monkeys stand level
// with the sign and play tug-of-war with it instead.
//
// Monkeys are small inline SVGs placed with CSS next to their sign. Once the
// page is laid out, their feet are measured and the forest (one static SVG,
// plus vines and fireflies as separate animated elements) is drawn so each
// branch ends right under a monkey.
(() => {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];

  function mulberry32(a) {
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const f = (n) => Math.round(n * 10) / 10;

  // ---------- Monkeys ----------
  // Drawn in a 120×150 box with the feet on the bottom edge. Limbs are
  // stroked twice (dark then fur) to get a cartoon outline.
  const limb = (d, w = 8.5) => `<path d="${d}" class="m-limb-o" style="stroke-width:${w + 4.5}"/><path d="${d}" class="m-limb" style="stroke-width:${w}"/>`;

  const eyes = (r = 5.2, pr = 2.8, look = 1) => `<g class="m-eyes">
    <ellipse cx="51" cy="57" rx="${r}" ry="${r + 1}" fill="#fff" stroke="#3b2410" stroke-width="1.5"/>
    <ellipse cx="69" cy="57" rx="${r}" ry="${r + 1}" fill="#fff" stroke="#3b2410" stroke-width="1.5"/>
    <circle cx="${51 + look}" cy="58" r="${pr}" fill="#1e120a"/><circle cx="${69 + look}" cy="58" r="${pr}" fill="#1e120a"/>
    <circle cx="${52.2 + look}" cy="56.4" r="1.1" fill="#fff"/><circle cx="${70.2 + look}" cy="56.4" r="1.1" fill="#fff"/></g>`;
  const cheeks = `<circle cx="44" cy="68" r="4" fill="#ff8a80" opacity=".55"/><circle cx="76" cy="68" r="4" fill="#ff8a80" opacity=".55"/>`;
  const grin = `<path d="M50 71 Q60 86 70 71 Z" fill="#7a1f1f" stroke="#3b2410" stroke-width="1.8" stroke-linejoin="round"/><ellipse cx="60" cy="78" rx="5" ry="2.4" fill="#ff8fa3"/>`;

  // Expression and headwear for each section's monkeys
  const LOOKS = {
    scholar: {
      face: eyes(5, 2.6) +
        `<path d="M45 47 Q51 43 56 46 M64 46 Q69 43 75 47" fill="none" stroke="#3b2410" stroke-width="2.2" stroke-linecap="round"/>
         <g fill="rgba(255,255,255,.25)" stroke="#2a1a0c" stroke-width="2"><circle cx="51" cy="57" r="8"/><circle cx="69" cy="57" r="8"/></g>
         <path d="M59 57h2" stroke="#2a1a0c" stroke-width="2"/>
         <path d="M52 73 Q60 80 68 73" fill="none" stroke="#3b2410" stroke-width="2.4" stroke-linecap="round"/>`,
      hat: `<path d="M47 37 L47 44 Q60 50 73 44 L73 37Z" fill="#26375c"/>
         <path d="M32 33 L60 23 L88 33 L60 43Z" fill="#1d2b4a" stroke="#0f182b" stroke-width="1.5" stroke-linejoin="round"/>
         <path d="M60 33 L84 37 L85 49" fill="none" stroke="#f4c430" stroke-width="2"/><circle cx="85" cy="51" r="3" fill="#f4c430"/>`,
      chest: `<path d="M53 84 L60 88 L53 92Z M67 84 L60 88 L67 92Z" fill="#c62828" stroke="#7f1717" stroke-width="1"/><circle cx="60" cy="88" r="2.2" fill="#8e1b1b"/>`,
    },
    tug: {
      face: eyes(4.6, 2.6, 2) +
        `<path d="M44 48 L56 54 M76 48 L64 54" stroke="#3b2410" stroke-width="3.2" stroke-linecap="round"/>
         <rect x="50" y="70" width="20" height="8" rx="2.5" fill="#fff" stroke="#3b2410" stroke-width="1.8"/>
         <path d="M55 70v8M60 70v8M65 70v8M50 74h20" stroke="#3b2410" stroke-width="1.1"/>
         <path class="m-sweat" d="M85 40 q5 7 0 10 q-5 -3 0 -10z" fill="#9adbff" stroke="#3b88c9" stroke-width="1"/>`,
      hat: "",
      chest: (c) => `<path d="M56 85 L64 85 L62 90 L58 90Z" fill="${c}"/><path d="M58 90 L62 90 L65 104 L60 110 L55 104Z" fill="${c}" stroke="rgba(0,0,0,.25)" stroke-width="1"/>`,
    },
    builder: {
      face: eyes(6.4, 3.4) + cheeks + grin,
      hat: `<path d="M37 45 Q37 22 60 22 Q83 22 83 45Z" fill="#ffc83d" stroke="#c9900a" stroke-width="2"/>
         <path d="M60 23 V44" stroke="#ffe08a" stroke-width="5"/>
         <rect x="31" y="42" width="58" height="7" rx="3.5" fill="#ffb300" stroke="#c9900a" stroke-width="2"/>`,
      chest: `<rect x="40" y="114" width="40" height="6" rx="2" fill="#6d4c41" stroke="#3e2723" stroke-width="1"/><rect x="66" y="113" width="7" height="10" rx="1.5" fill="#8d6e63"/>`,
    },
    ninja: {
      face: `<path d="M42 51h16v4q0 8 -8 8q-8 0 -8 -8z M62 51h16v4q0 8 -8 8q-8 0 -8 -8z" fill="#151515"/>
         <path d="M58 53h4" stroke="#151515" stroke-width="2.5"/>
         <path d="M45 54l4 -2 M65 54l4 -2" stroke="#fff" stroke-width="1.5" opacity=".75" stroke-linecap="round"/>
         <path d="M53 74 Q61 77 68 70" fill="none" stroke="#3b2410" stroke-width="2.4" stroke-linecap="round"/>`,
      hat: `<path d="M35 43 Q60 35 85 43 L85 50 Q60 42 35 50Z" fill="#e53935" stroke="#9a1c1c" stroke-width="1.5"/>
         <path d="M84 45 Q97 40 106 48 M84 48 Q95 53 100 62" fill="none" stroke="#e53935" stroke-width="4" stroke-linecap="round"/>`,
      chest: `<rect x="39" y="112" width="42" height="5" fill="#222"/><path d="M60 112 l-5 9 M60 112 l5 9" stroke="#222" stroke-width="3"/>`,
    },
    author: {
      face: eyes(5.4, 3) + cheeks +
        `<path d="M45 47 Q51 44 56 47 M64 47 Q69 44 75 47" fill="none" stroke="#3b2410" stroke-width="2.2" stroke-linecap="round"/>
         <path d="M51 72 Q60 81 69 72" fill="none" stroke="#3b2410" stroke-width="2.6" stroke-linecap="round"/>`,
      hat: `<ellipse cx="57" cy="36" rx="25" ry="9" fill="#7b1f3a" stroke="#4d1022" stroke-width="2" transform="rotate(-10 57 36)"/>
         <circle cx="56" cy="27" r="3" fill="#4d1022"/>`,
      chest: `<path d="M44 84 Q60 92 76 84 L76 90 Q60 98 44 90Z" fill="#2e7d32" stroke="#1b5e20" stroke-width="1.2"/>
         <path d="M66 89 L70 104 L63 102Z" fill="#2e7d32" stroke="#1b5e20" stroke-width="1.2"/>
         <path d="M50 86 L52 92 M58 88 L59 94" stroke="#a5d6a7" stroke-width="1.6"/>`,
    },
    // Monkeying Around: off-duty monkeys
    writer: {
      face: eyes(5, 2.8, 0) +
        `<path d="M45 47 Q51 45 56 48 M64 48 Q69 45 75 47" fill="none" stroke="#3b2410" stroke-width="2.2" stroke-linecap="round"/>
         <path d="M42 59h15q0 8 -7.5 8q-7.5 0 -7.5 -8z M63 59h15q0 8 -7.5 8q-7.5 0 -7.5 -8z" fill="rgba(255,255,255,.3)" stroke="#2a1a0c" stroke-width="2"/>
         <path d="M57 60h6" stroke="#2a1a0c" stroke-width="2"/>
         <path d="M53 74 Q60 79 67 74" fill="none" stroke="#3b2410" stroke-width="2.4" stroke-linecap="round"/>`,
      hat: `<g transform="rotate(-38 88 48)"><path d="M84 48 Q101 37 120 45 Q102 51 84 48Z" fill="#fff" stroke="#3b2410" stroke-width="1.4"/>
         <path d="M84 48 L118 45" stroke="#b0a99a" stroke-width="1"/><path d="M78 48.5 L85 48" stroke="#3b2410" stroke-width="2" stroke-linecap="round"/></g>`,
      chest: `<path d="M46 86 L60 101 L74 86" fill="none" stroke="#6a3d9a" stroke-width="5" stroke-linejoin="round"/>
         <circle cx="60" cy="108" r="1.9" fill="#3b2410"/><circle cx="60" cy="115" r="1.9" fill="#3b2410"/>`,
    },
    king: {
      face: eyes(5, 2.6, 1.5) + cheeks +
        `<path d="M45 49 Q51 46 56 49 M64 45 Q69 41 75 44" fill="none" stroke="#3b2410" stroke-width="2.2" stroke-linecap="round"/>
         <path d="M52 74 Q60 78 69 71" fill="none" stroke="#3b2410" stroke-width="2.4" stroke-linecap="round"/>`,
      hat: `<path d="M42 41 L43 22 L52 31 L60 17 L68 31 L77 22 L78 41Z" fill="#ffc83d" stroke="#a87400" stroke-width="2" stroke-linejoin="round"/>
         <rect x="41" y="38" width="38" height="6" rx="2" fill="#f4b400" stroke="#a87400" stroke-width="1.6"/>
         <circle cx="60" cy="33" r="2.6" fill="#e53935"/><circle cx="50" cy="35" r="1.8" fill="#1e88e5"/><circle cx="70" cy="35" r="1.8" fill="#1e88e5"/>`,
      chest: `<path d="M51 84 L60 88 L51 92Z" fill="#fff" stroke="#3b2410" stroke-width="1.2"/><path d="M69 84 L60 88 L69 92Z" fill="#222" stroke="#3b2410" stroke-width="1.2"/>
         <circle cx="60" cy="88" r="2.2" fill="#3b2410"/>`,
    },
    chill: {
      face: cheeks + grin +
        `<path d="M41 51h16v3q0 9 -8 9q-8 0 -8 -9z M63 51h16v3q0 9 -8 9q-8 0 -8 -9z" fill="#25213b" stroke="#e91e63" stroke-width="2"/>
         <path d="M57 53h6 M41 53 L35 50 M79 53 L85 50" stroke="#e91e63" stroke-width="2.2"/>
         <path d="M44 54l4 -2.5 M66 54l4 -2.5" stroke="#fff" stroke-width="1.6" opacity=".8" stroke-linecap="round"/>`,
      hat: `<g transform="translate(86 42)" stroke="#3b2410" stroke-width="1.2">
         <circle cx="0" cy="-6" r="5" fill="#ff5c8a"/><circle cx="5.7" cy="-1.9" r="5" fill="#ff5c8a"/><circle cx="3.5" cy="4.9" r="5" fill="#ff5c8a"/>
         <circle cx="-3.5" cy="4.9" r="5" fill="#ff5c8a"/><circle cx="-5.7" cy="-1.9" r="5" fill="#ff5c8a"/><circle r="2.6" fill="#ffd54f"/></g>`,
      chest: [[44, 84], [48, 89], [54, 92.5], [60, 94], [66, 92.5], [72, 89], [76, 84]]
        .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="4.2" fill="${["#ff5c8a", "#ffd54f", "#ff8a3d"][i % 3]}" stroke="#3b2410" stroke-width="1"/>`).join(""),
    },
    dj: {
      face: cheeks +
        `<path d="M45 59 Q51 52 57 59 M63 59 Q69 52 75 59" fill="none" stroke="#3b2410" stroke-width="2.6" stroke-linecap="round"/>
         <path d="M51 71 Q60 83 69 71Z" fill="#7a1f1f" stroke="#3b2410" stroke-width="1.8" stroke-linejoin="round"/>
         <g fill="#3b2410"><path d="M96 26v12" stroke="#3b2410" stroke-width="2"/><ellipse cx="93" cy="38" rx="3.6" ry="2.8"/>
         <path d="M104 14v11 M104 14l8 -3v11" fill="none" stroke="#3b2410" stroke-width="2"/><ellipse cx="101" cy="25" rx="3.4" ry="2.6"/><ellipse cx="109" cy="22" rx="3.4" ry="2.6"/></g>`,
      hat: `<path d="M33 60 Q31 28 60 28 Q89 28 87 60" fill="none" stroke="#3b2410" stroke-width="8" stroke-linecap="round"/>
         <path d="M33 60 Q31 28 60 28 Q89 28 87 60" fill="none" stroke="#546e7a" stroke-width="4.5" stroke-linecap="round"/>
         <rect x="25" y="50" width="14" height="20" rx="6" fill="#1e88e5" stroke="#3b2410" stroke-width="2"/>
         <rect x="81" y="50" width="14" height="20" rx="6" fill="#1e88e5" stroke="#3b2410" stroke-width="2"/>`,
      chest: `<path d="M41 98 Q60 104 79 98" fill="none" stroke="#ffd54f" stroke-width="3"/><path d="M41 104 Q60 110 79 104" fill="none" stroke="#ffd54f" stroke-width="3"/>`,
    },
    // Red cap, big mustache and blue overalls: a certain plumber
    mario: {
      face: eyes(5.4, 3) + cheeks +
        `<path d="M55 79 Q60 83 65 79" fill="none" stroke="#3b2410" stroke-width="2.2" stroke-linecap="round"/>
         <path d="M60 70 Q55 66 49 69 Q43 72 45 76 Q50 73 53 76 Q57 73 60 75 Q63 73 67 76 Q70 73 75 76 Q77 72 71 69 Q65 66 60 70Z" fill="#2a1a0c" stroke="#1a0f06" stroke-width="1"/>`,
      hat: `<path d="M33 47 Q31 22 60 21 Q89 22 87 47 Q60 40 33 47Z" fill="#e53935" stroke="#8e1b1b" stroke-width="2" stroke-linejoin="round"/>
         <path d="M31 47 Q60 39 89 47 Q91 52 86 52 Q60 45 34 52 Q29 52 31 47Z" fill="#c62828" stroke="#8e1b1b" stroke-width="2" stroke-linejoin="round"/>
         <circle cx="60" cy="33" r="7.5" fill="#fff" stroke="#8e1b1b" stroke-width="1.4"/>
         <path d="M56 37 V29.5 L60 34 L64 29.5 V37" fill="none" stroke="#e53935" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>`,
      chest: `<path d="M45 85 Q60 92 75 85 L76 98 Q60 104 44 98Z" fill="#e53935" stroke="#8e1b1b" stroke-width="1.2" stroke-linejoin="round"/>
         <path d="M44 98 Q60 104 76 98 L79 116 Q78 129 60 130 Q42 129 41 116Z" fill="#1e5aa8" stroke="#123a6e" stroke-width="1.6" stroke-linejoin="round"/>
         <path d="M47 86 L49 99 M73 86 L71 99" stroke="#1e5aa8" stroke-width="5" stroke-linecap="round"/>
         <circle cx="49" cy="100" r="2.6" fill="#ffd54f" stroke="#a87400" stroke-width="1"/><circle cx="71" cy="100" r="2.6" fill="#ffd54f" stroke="#a87400" stroke-width="1"/>`,
    },
    // Straw hat, scar under the eye, open red vest, yellow sash and blue shorts
    luffy: {
      face: eyes(6, 3.2) + cheeks + grin +
        `<path d="M66 65 h10 M68.5 63 v4 M71 63 v4 M73.5 63 v4" stroke="#7a3b1f" stroke-width="1.3" stroke-linecap="round"/>`,
      hat: `<path d="M41 41 Q40 21 60 21 Q80 21 79 41Z" fill="#f2c94c" stroke="#a87b1d" stroke-width="2" stroke-linejoin="round"/>
         <path d="M41.5 34 Q60 30 78.5 34 L79 41 Q60 37 41 41Z" fill="#d32f2f" stroke="#8e1b1b" stroke-width="1.2"/>
         <ellipse cx="60" cy="41.5" rx="35" ry="6.5" fill="#f2c94c" stroke="#a87b1d" stroke-width="2"/>
         <path d="M33 41 Q60 46 87 41" fill="none" stroke="#d9ad3a" stroke-width="1.4"/>`,
      chest: `<path d="M42 90 Q38 104 41 116 L54 116 L55 88 Q47 85 42 90Z M78 90 Q82 104 79 116 L66 116 L65 88 Q73 85 78 90Z" fill="#d32f2f" stroke="#8e1b1b" stroke-width="1.6" stroke-linejoin="round"/>
         <circle cx="52" cy="97" r="1.6" fill="#ffd54f"/><circle cx="52" cy="105" r="1.6" fill="#ffd54f"/>
         <path d="M40 114 Q60 119 80 114 L80 120 Q60 125 40 120Z" fill="#f4c430" stroke="#a87400" stroke-width="1.3" stroke-linejoin="round"/>
         <path d="M40.5 120 Q60 125 79.5 120 Q80 129 72 131 L48 131 Q40 129 40.5 120Z" fill="#3d6fb6" stroke="#22477d" stroke-width="1.5" stroke-linejoin="round"/>`,
    },
    // A grey-green elven cloak, pinned with a leaf brooch
    elf: {
      face: eyes(5.4, 3) + cheeks +
        `<path d="M45 47 Q51 44 56 47 M64 47 Q69 44 75 47" fill="none" stroke="#3b2410" stroke-width="2.2" stroke-linecap="round"/>
         <path d="M51 72 Q60 81 69 72" fill="none" stroke="#3b2410" stroke-width="2.6" stroke-linecap="round"/>`,
      hat: "",
      chest: `<path d="M41 88 Q36 110 33 130 Q42 133 50 129 Q48 108 53 90Z M79 88 Q84 110 87 130 Q78 133 70 129 Q72 108 67 90Z" fill="#6b8a5a" stroke="#34472a" stroke-width="1.6" stroke-linejoin="round"/>
         <path d="M40 87 Q60 97 80 87 L78 82 Q60 91 42 82Z" fill="#7c9b69" stroke="#34472a" stroke-width="1.6" stroke-linejoin="round"/>
         <path d="M60 85 Q67 90 60 97 Q53 90 60 85Z" fill="#8fd17c" stroke="#2e6b2a" stroke-width="1.3"/><path d="M60 87 V95" stroke="#cfe8b4" stroke-width="1" stroke-linecap="round"/>`,
    },
  };

  // A pencil tucked behind the right ear
  const EAR_PENCIL = `<g transform="rotate(-28 92 50)"><rect x="80" y="47" width="26" height="6" rx="1.5" fill="#ffca28" stroke="#3b2410" stroke-width="1.5"/>
    <path d="M106 47 L112 50 L106 53Z" fill="#f3d3a8" stroke="#3b2410" stroke-width="1.2"/><rect x="77" y="47" width="4" height="6" fill="#f48fb1"/></g>`;

  // Faces for the publication monkeys, who share the author's beret and scarf
  const STUDY_FACES = {
    lens: eyes(5.6, 3, 2) +
      `<path d="M45 45 Q51 41 56 45 M64 45 Q69 41 75 45" fill="none" stroke="#3b2410" stroke-width="2.2" stroke-linecap="round"/>
       <ellipse cx="62" cy="74" rx="3.4" ry="4" fill="#7a1f1f" stroke="#3b2410" stroke-width="1.6"/>`,
    notes: eyes(5, 2.8, 2.5) + cheeks +
      `<path d="M45 48 L56 50 M64 50 L75 48" stroke="#3b2410" stroke-width="2.2" stroke-linecap="round"/>
       <path d="M53 72 Q60 76 67 72" fill="none" stroke="#3b2410" stroke-width="2.2" stroke-linecap="round"/>
       <path d="M63 73.5 q2 7 6.5 3 q-1 -3 -2 -4" fill="#ff8fa3" stroke="#3b2410" stroke-width="1.2"/>`,
  };

  function head(look) {
    return `<circle cx="35" cy="60" r="9" class="m-fur"/><circle cx="35" cy="60" r="4.5" class="m-face"/>
      <circle cx="85" cy="60" r="9" class="m-fur"/><circle cx="85" cy="60" r="4.5" class="m-face"/>
      <circle cx="60" cy="58" r="26" class="m-fur"/>
      <path class="m-face" d="M60 49 C54 39 37 41 39 56 C40 65 43 71 46 75 C51 83 69 83 74 75 C77 71 80 65 81 56 C83 41 66 39 60 49Z"/>
      <ellipse cx="57" cy="67" rx="1.6" ry="1.2" fill="#3b2410"/><ellipse cx="63" cy="67" rx="1.6" ry="1.2" fill="#3b2410"/>
      ${look.face}${look.hat}`;
  }

  // Arms up, holding a sign overhead
  function holdPose(look, chest) {
    return limb("M77 120 C99 126 108 108 99 99 C93 94 85 99 90 105", 6) +
      limb("M52 124 L47 140", 9) + limb("M68 124 L73 140", 9) +
      `<ellipse cx="44" cy="144" rx="9" ry="5" class="m-face-o"/><ellipse cx="76" cy="144" rx="9" ry="5" class="m-face-o"/>
       <ellipse cx="60" cy="106" rx="21" ry="24" class="m-fur"/><ellipse cx="60" cy="110" rx="13" ry="16" class="m-face"/>
       ${chest}` +
      limb("M45 94 Q29 60 31 15") + limb("M75 94 Q91 60 89 15") +
      head(look) +
      `<circle cx="31" cy="11" r="7" class="m-face-o"/><circle cx="89" cy="11" r="7" class="m-face-o"/>`;
  }

  // Leaning back with both arms out, pulling a sign to the right
  function pullPose(look, chest) {
    return limb("M46 118 C26 124 14 106 23 98 C29 93 37 98 32 104", 6) +
      limb("M54 122 L36 140", 9) + limb("M62 124 L75 140", 9) +
      `<ellipse cx="33" cy="144" rx="9" ry="5" class="m-face-o"/><ellipse cx="78" cy="144" rx="9" ry="5" class="m-face-o"/>
       <g transform="rotate(-14 58 108)"><ellipse cx="58" cy="104" rx="21" ry="24" class="m-fur"/><ellipse cx="58" cy="108" rx="13" ry="16" class="m-face"/>
       <g transform="translate(-2 -2)">${chest}</g></g>` +
      limb("M66 98 Q88 95 108 88") + limb("M62 90 Q86 83 109 76") +
      `<g transform="translate(-10 0) rotate(-10 60 58)">${head(look)}</g>` +
      `<circle cx="111" cy="88" r="7" class="m-face-o"/><circle cx="112" cy="75" r="7" class="m-face-o"/>`;
  }

  // Standing beside a sign (to its right) and holding it up by its edge with
  // one hand, while the other either peers at it through a magnifying glass
  // or scribbles notes straight onto it with an oversized pencil
  function studyPose(look, chest, tool) {
    // The scribbler is writing with its ear pencil; the inspector keeps its
    // pencil behind the left ear, clear of the magnifying glass
    const face = {
      ...look,
      face: STUDY_FACES[tool],
      hat: look.hat + (tool === "lens" ? `<g transform="translate(120 0) scale(-1 1)">${EAR_PENCIL}</g>` : ""),
    };
    const grip = `<circle cx="110" cy="94" r="7" class="m-face-o"/>
      <path d="M108 89.5 q4.5 .5 6 4 M108.5 96 q4 .5 5.5 3.5" fill="none" stroke="#3b2410" stroke-width="1.6" stroke-linecap="round"/>`;
    let s = limb("M44 118 C24 124 16 108 25 100 C31 95 38 100 33 106", 6) +
      limb("M52 124 L47 140", 9) + limb("M68 124 L73 140", 9) +
      `<ellipse cx="44" cy="144" rx="9" ry="5" class="m-face-o"/><ellipse cx="76" cy="144" rx="9" ry="5" class="m-face-o"/>
       <ellipse cx="58" cy="106" rx="21" ry="24" class="m-fur"/><ellipse cx="58" cy="110" rx="13" ry="16" class="m-face"/>${chest}` +
      limb("M70 100 Q92 104 108 95") +
      `<g transform="translate(4 0)">${head(face)}</g>`;
    if (tool === "lens") {
      s += limb("M72 90 Q90 80 100 71") +
        `<path d="M101 70 L107 61" stroke="#5d4037" stroke-width="4.5" stroke-linecap="round"/>
         <circle cx="113" cy="52" r="11" fill="rgba(200,235,255,.45)" stroke="#424242" stroke-width="3.5"/>
         <path d="M107 48 q3 -4 8 -4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
         <circle cx="101" cy="70" r="7" class="m-face-o"/>`;
    } else {
      s += limb("M72 90 Q90 82 103 68") +
        `<path d="M96 57 L120 77" stroke="#ffca28" stroke-width="5.5" stroke-linecap="round"/>
         <path d="M96 57 L99 59.5" stroke="#f48fb1" stroke-width="5.5" stroke-linecap="round"/>
         <path d="M119.5 76.5 L124 80" stroke="#3b2410" stroke-width="2.5" stroke-linecap="round"/>
         <path d="M127 83 q3 -4 5 0 q2 4 5 0 q2 -4 5 0" fill="none" stroke="#5e5141" stroke-width="1.6" stroke-linecap="round"/>
         <circle cx="104" cy="67" r="7" class="m-face-o"/>`;
    }
    return s + grip;
  }

  function monkey(kind, pose, side, opts = {}) {
    const look = LOOKS[kind];
    const chest = typeof look.chest === "function" ? look.chest(opts.tie) : look.chest;
    const body = pose === "hold" ? holdPose(look, chest) : pose === "study" ? studyPose(look, chest, opts.tool) : pullPose(look, chest);
    const style = opts.at != null ? `left:${opts.at}%` : "";
    return `<div class="monkey ${pose} ${side}" style="${style}" aria-hidden="true"><div class="m-inner">
      <svg viewBox="0 0 120 150">${body}</svg></div></div>`;
  }

  // The opening photo is held aloft by an aviator monkey under a parachute,
  // gritting its teeth as the frame drags it down. Drawn in a 240×300 box:
  // canopy at the top, hands on the bottom edge gripping the frame.
  function parachuteMonkey() {
    const look = {
      face: LOOKS.tug.face,
      hat: `<path d="M34 52 Q33 26 60 26 Q87 26 86 52 L80 54 Q60 44 40 54Z" fill="#8d5524" stroke="#3b2410" stroke-width="2"/>
        <path d="M36 50 Q60 40 84 50" fill="none" stroke="#5d3615" stroke-width="5"/>
        <circle cx="50" cy="38" r="7" fill="#9ad7ff" stroke="#4a4a4a" stroke-width="3"/>
        <circle cx="70" cy="38" r="7" fill="#9ad7ff" stroke="#4a4a4a" stroke-width="3"/>
        <path d="M47 35l3 -2 M67 35l3 -2" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>`,
    };
    const lines = "#6b4423";
    return `<div class="monkey para-monkey" aria-hidden="true"><svg viewBox="0 0 240 300">
      <path d="M22 98 Q20 6 120 6 Q220 6 218 98 Q194 84 170 98 Q145 84 120 98 Q95 84 70 98 Q46 84 22 98Z" fill="#e53935" stroke="#3b2410" stroke-width="3" stroke-linejoin="round"/>
      <path d="M120 7 C102 18 80 52 70 98 Q95 84 120 98Z M120 7 C138 18 160 52 170 98 Q145 84 120 98Z" fill="#fff" stroke="#3b2410" stroke-width="2" stroke-linejoin="round"/>
      <path d="M120 7 C112 30 118 70 120 98" fill="none" stroke="#3b2410" stroke-width="2"/>
      <path d="M24 97 L103 186 M70 97 L106 184 M170 97 L134 184 M216 97 L137 186" stroke="${lines}" stroke-width="1.6"/>
      <g transform="translate(60 92)">
        ${limb("M78 120 C96 128 104 116 98 108 C94 103 88 107 92 112", 6)}
        ${limb("M52 124 Q36 132 30 148", 9)}${limb("M68 124 Q84 132 90 148", 9)}
        <ellipse cx="28" cy="150" rx="8" ry="5" class="m-face-o" transform="rotate(-30 28 150)"/>
        <ellipse cx="92" cy="150" rx="8" ry="5" class="m-face-o" transform="rotate(30 92 150)"/>
        <ellipse cx="60" cy="106" rx="21" ry="24" class="m-fur"/><ellipse cx="60" cy="110" rx="13" ry="16" class="m-face"/>
        <path d="M42 96 L78 96 M44 112 L76 112" stroke="#5d3615" stroke-width="4" stroke-linecap="round"/>
        ${limb("M44 96 Q22 140 18 198")}${limb("M76 96 Q98 140 102 198")}
        ${head(look)}
        <circle cx="18" cy="200" r="7.5" class="m-face-o"/><circle cx="102" cy="200" r="7.5" class="m-face-o"/>
      </g></svg></div>`;
  }

  function addMonkeys() {
    const para = $(".para");
    if (para) para.insertAdjacentHTML("afterbegin", parachuteMonkey());
    const pair = (sel, kind) => { const el = $(sel); if (el) el.insertAdjacentHTML("beforeend", monkey(kind, "hold", "", { at: 16 }) + monkey(kind, "hold", "", { at: 84 })); };
    pair("[data-education]", "scholar");
    $$(".job").forEach((li, i) => {
      li.style.setProperty("--tug-time", `${f(3 + (i % 3) * 0.35)}s`);
      li.style.setProperty("--tug-delay", `${f(-i * 0.9)}s`);
      li.insertAdjacentHTML("beforeend",
        monkey("tug", "pull", "left", { tie: "#1e88e5" }) + monkey("tug", "pull", "right", { tie: "#e53935" }));
    });
    $$(".project").forEach((card) => card.insertAdjacentHTML("beforeend", monkey("builder", "hold", "", { at: 50 })));
    pair("[data-skills]", "ninja");
    // One studious monkey per paper, alternating sides and activities
    $$(".pub").forEach((card, i) => card.insertAdjacentHTML("beforeend",
      monkey("author", "study", i % 2 ? "right" : "left", { tool: i % 2 ? "notes" : "lens" })));
    // Monkeying Around page
    $$(".hobby").forEach((card, i) => card.insertAdjacentHTML("beforeend",
      monkey(LOOKS[card.dataset.look] ? card.dataset.look : card.classList.contains("hobby-chess") ? "king" : i % 2 ? "dj" : "chill", "hold", "", { at: 50 })));
    pair("[data-fun-writing]", "writer");
  }

  // ---------- Forest ----------
  const forest = document.createElement("div");
  forest.className = "forest";
  forest.setAttribute("aria-hidden", "true");
  document.body.appendChild(forest);

  // A leafy clump: dark circles underneath, the main colour, then highlights
  function clump(cx, cy, R, tone, rnd) {
    let shade = "", base = "", hi = "";
    const n = 6 + ((rnd() * 3) | 0);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rnd() * 0.5;
      const x = cx + Math.cos(a) * R * 0.55, y = cy + Math.sin(a) * R * 0.38;
      const r = R * (0.42 + rnd() * 0.2);
      shade += `<circle cx="${f(x)}" cy="${f(y + R * 0.14)}" r="${f(r)}"/>`;
      base += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.92)}"/>`;
    }
    base += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R * 0.55)}"/>`;
    for (let i = 0; i < 3; i++) {
      hi += `<circle cx="${f(cx - R * (0.1 + rnd() * 0.35))}" cy="${f(cy - R * (0.2 + rnd() * 0.25))}" r="${f(R * (0.14 + rnd() * 0.1))}"/>`;
    }
    return `<g class="${tone}-d">${shade}</g><g class="${tone}">${base}</g><g class="${tone}-h">${hi}</g>`;
  }

  // A branch from the trunk out to a point, with a flat top for standing on
  function branch(x0, x1, y, rnd, leafy = true) {
    const dir = Math.sign(x1 - x0) || 1, len = Math.abs(x1 - x0);
    const tip = 8, root = 26;
    let s = `<path class="branch" d="M${f(x0)} ${f(y - 12)} Q${f(x0 + dir * len * 0.35)} ${f(y)} ${f(x1)} ${f(y)}
      Q${f(x1 + dir * 7)} ${f(y + tip / 2)} ${f(x1)} ${f(y + tip)} Q${f(x0 + dir * len * 0.5)} ${f(y + tip + 5)} ${f(x0)} ${f(y + root + 6)}Z"/>
      <path class="bark-line" d="M${f(x0 + dir * 20)} ${f(y + 9)} Q${f(x0 + dir * len * 0.5)} ${f(y + 7)} ${f(x1 - dir * 20)} ${f(y + 4)}"/>`;
    if (leafy) {
      const tx = x0 + dir * len * (0.4 + rnd() * 0.15);
      s += `<path class="twig" d="M${f(tx)} ${f(y + 2)} Q${f(tx + dir * 8)} ${f(y - 22)} ${f(tx + dir * 26)} ${f(y - 36)}"/>`;
      s += clump(tx + dir * 30, y - 44, 26 + rnd() * 8, "leaf-near", rnd);
      s += clump(x1 + dir * 4, y - 4, 20 + rnd() * 6, "leaf-near", rnd);
    }
    return s;
  }

  function trunk(cx, w, top, bottom, rnd) {
    const hw = w / 2;
    let s = `<path class="bark" d="M${f(cx - hw * 0.85)} ${f(top)} L${f(cx - hw)} ${f(bottom - 60)}
      Q${f(cx - hw * 1.1)} ${f(bottom - 15)} ${f(cx - hw * 2.1)} ${f(bottom + 10)} L${f(cx + hw * 2.1)} ${f(bottom + 10)}
      Q${f(cx + hw * 1.1)} ${f(bottom - 15)} ${f(cx + hw)} ${f(bottom - 60)} L${f(cx + hw * 0.85)} ${f(top)}Z"/>`;
    s += `<rect class="bark-hi" x="${f(cx - hw * 0.62)}" y="${f(top)}" width="${f(hw * 0.28)}" height="${f(bottom - top - 70)}" rx="${f(hw * 0.14)}"/>`;
    for (let y = top + 80; y < bottom - 120; y += 120 + rnd() * 160) {
      const x = cx + (rnd() - 0.3) * hw * 0.8;
      s += `<path class="bark-line" d="M${f(x)} ${f(y)} q${f(hw * 0.25)} 30 0 ${f(60 + rnd() * 40)}"/>`;
      if (rnd() < 0.25) s += `<ellipse class="knot" cx="${f(cx + (rnd() - 0.5) * hw * 0.6)}" cy="${f(y + 40)}" rx="${f(hw * 0.2)}" ry="${f(hw * 0.32)}"/>`;
    }
    return s;
  }

  function mushroom(x, y, s) {
    return `<g class="mush" transform="translate(${f(x)} ${f(y)}) scale(${s})">
      <path d="M-5 0 Q-6 -14 -3 -18 L3 -18 Q6 -14 5 0Z" fill="#fff3e0" stroke="#3b2410" stroke-width="2"/>
      <path class="shroom" d="M-17 -16 Q-16 -34 0 -35 Q16 -34 17 -16Z" stroke="#3b2410" stroke-width="2"/>
      <circle cx="-7" cy="-26" r="3" fill="#fff"/><circle cx="6" cy="-28" r="2.5" fill="#fff"/><circle cx="10" cy="-20" r="2" fill="#fff"/></g>`;
  }

  let lastKey = "";

  function build() {
    const about = $("main .section");
    const footer = $(".footer");
    const W = document.documentElement.clientWidth;
    const top = about.getBoundingClientRect().top + scrollY - 170; // tallest crowns reach the Education section
    const docH = footer.getBoundingClientRect().bottom + scrollY;
    const H = Math.round(docH - top);

    // Where every visible monkey's feet are, in forest coordinates
    const feet = $$("main .monkey").filter((m) => m.offsetParent).map((m) => {
      const r = m.getBoundingClientRect();
      const x = m.classList.contains("left") ? r.left + r.width * 0.46 : m.classList.contains("right") ? r.right - r.width * 0.46 : r.left + r.width / 2;
      return { x, y: r.bottom + scrollY - top - 3 };
    });

    const key = `${W}|${H}|${feet.map((p) => `${Math.round(p.x)},${Math.round(p.y)}`).join(";")}`;
    if (key === lastKey) return;
    lastKey = key;

    const rnd = mulberry32(42);
    const narrow = W < 700;
    const groundH = narrow ? 120 : 150;
    const groundTop = H - groundH;
    const tw = Math.max(26, Math.min(84, W * 0.055));
    const tx = Math.max(10, Math.min(70, W * 0.045));
    const trunks = [tx, W - tx];

    forest.style.top = `${top}px`;
    forest.style.height = `${H}px`;

    let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <defs>
        <linearGradient id="under" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="under-a"/><stop offset="1" class="under-b"/></linearGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="ground-a"/><stop offset="1" class="ground-b"/></linearGradient>
      </defs>
      <rect x="0" y="300" width="${W}" height="${H - 300}" fill="url(#under)"/>`;

    // Sunbeams slanting down through the canopy
    for (let i = 0; i < Math.max(3, W / 260); i++) {
      const x = rnd() * W, w = 40 + rnd() * 90, len = 900 + rnd() * 1200;
      s += `<path class="ray" d="M${f(x)} 320 L${f(x + w)} 320 L${f(x + w + len * 0.35)} ${f(320 + len)} L${f(x + len * 0.35)} ${f(320 + len)}Z"/>`;
    }

    // Far and middle rows of trees forming the canopy
    const far = [], mid = [];
    for (let x = -60 + rnd() * 60; x < W + 80; x += 110 + rnd() * 80) far.push({ x, y: 250 + rnd() * 90, R: 75 + rnd() * 45, w: 14 + rnd() * 12 });
    for (let x = -40 + rnd() * 80; x < W + 80; x += 150 + rnd() * 90) mid.push({ x, y: 330 + rnd() * 110, R: 85 + rnd() * 45, w: 20 + rnd() * 14 });
    for (const t of far) s += `<rect class="bark-far" x="${f(t.x - t.w / 2)}" y="${f(t.y)}" width="${f(t.w)}" height="${f(groundTop - t.y + 20)}"/>`;
    for (const t of far) s += clump(t.x, t.y, t.R, "leaf-far", rnd);
    for (const t of mid) s += `<rect class="bark-mid" x="${f(t.x - t.w / 2)}" y="${f(t.y)}" width="${f(t.w)}" height="${f(groundTop - t.y + 20)}"/>`;
    for (const t of mid) s += clump(t.x, t.y, t.R, "leaf-mid", rnd);

    // Forest floor
    let ground = `M0 ${groundTop + 14}`;
    for (let x = 0; x <= W + 80; x += 80) ground += ` Q${x + 40} ${f(groundTop - 8 + rnd() * 16)} ${x + 80} ${f(groundTop + 6 + rnd() * 12)}`;
    s += `<path d="${ground} L${W} ${H} L0 ${H}Z" fill="url(#ground)"/>`;

    // Branches to every monkey, then a few spare ones for good measure
    const used = [[], []];
    for (const p of feet) {
      const side = p.x < W / 2 ? 0 : 1;
      const dir = side === 0 ? 1 : -1;
      used[side].push(p.y);
      s += branch(trunks[side], p.x + dir * 55, p.y, rnd);
    }
    for (let side = 0; side < 2; side++) {
      const dir = side === 0 ? 1 : -1;
      for (let y = 420; y < groundTop - 260; y += 260 + rnd() * 220) {
        if (used[side].some((u) => Math.abs(u - y) < 110)) continue;
        s += branch(trunks[side], trunks[side] + dir * (60 + rnd() * (narrow ? 20 : 70)), y, rnd);
      }
    }

    // The two big trees, crowns reaching up to the Education section
    for (const x of trunks) {
      s += trunk(x, tw, 160, groundTop + 10, rnd);
      s += clump(x, 150, tw * 1.4 + 70, "leaf-near", rnd);
      s += clump(x + (x < W / 2 ? 1 : -1) * (tw + 40), 215, tw + 45, "leaf-near", rnd);
    }

    // Bushes, grass, mushrooms and flowers along the floor
    for (let x = rnd() * 60; x < W; x += 140 + rnd() * 200) s += clump(x, groundTop + 6, 30 + rnd() * 22, "leaf-near", rnd);
    let tufts = "";
    for (let x = rnd() * 10; x < W; x += 14 + rnd() * 16) {
      const y = groundTop + 22 + rnd() * (groundH - 40);
      tufts += `M${f(x - 5)} ${f(y)} q2 -9 -3 -14 M${f(x)} ${f(y)} q0 -10 1 -16 M${f(x + 5)} ${f(y)} q-1 -8 4 -13 `;
    }
    s += `<path class="tuft" d="${tufts}"/>`;
    s += mushroom(trunks[0] + tw * 1.6, groundTop + 34, 1.1) + mushroom(trunks[0] + tw * 1.6 + 26, groundTop + 40, 0.75);
    s += mushroom(trunks[1] - tw * 1.7, groundTop + 38, 0.95);
    if (!narrow) s += mushroom(W * 0.62, groundTop + 60, 0.8);
    for (let i = 0; i < W / 40; i++) {
      const x = rnd() * W, y = groundTop + 30 + rnd() * (groundH - 50);
      s += `<g class="flower" transform="translate(${f(x)} ${f(y)})"><circle r="3.2" cy="-3.5" fill="${rnd() < 0.5 ? "#fff" : "#ffd54f"}"/><circle r="1.6" cy="-3.5" fill="#f57f17"/></g>`;
    }
    s += `</svg>`;

    // Vines hanging from the canopy, each in its own layer so swaying is cheap
    let vines = "";
    for (let i = 0; i < W / 130; i++) {
      const x = 60 + rnd() * (W - 120);
      if (trunks.some((t) => Math.abs(t - x) < tw * 1.5)) continue;
      const len = 140 + rnd() * (narrow ? 200 : 420);
      let leaves = "";
      for (let y = 24; y < len - 6; y += 18 + rnd() * 10) {
        const side = (y / 18) % 2 < 1 ? -1 : 1;
        leaves += `<ellipse cx="${f(12 + side * 7)}" cy="${f(y)}" rx="7" ry="3.6" transform="rotate(${side * 35} ${f(12 + side * 7)} ${f(y)})"/>`;
      }
      vines += `<div class="vine" style="left:${f(x)}px;top:${f(340 + rnd() * 70)}px;height:${f(len)}px;--sway:${f(4 + rnd() * 4)}s;--delay:${f(-rnd() * 6)}s">
        <svg width="24" height="${f(len)}"><path class="vine-stem" d="M12 0 C4 ${f(len * 0.3)} 20 ${f(len * 0.6)} 12 ${f(len)}"/><g class="leaf-near">${leaves}</g></svg></div>`;
    }

    // Fireflies come out at night
    let flies = "";
    for (let i = 0; i < Math.max(14, W / 45); i++) {
      flies += `<i class="firefly" style="left:${f(rnd() * W)}px;top:${f(420 + rnd() * (H - 600))}px;--t:${f(3 + rnd() * 4)}s;--d:${f(-rnd() * 6)}s"></i>`;
    }

    forest.innerHTML = s + vines + `<div class="fireflies">${flies}</div>`;
    forest.querySelectorAll(".vine, .firefly").forEach(watch);
  }

  // ---------- Only animate what's on screen ----------
  // Anything scrolled out of view gets .paused, which stops its animations
  // (and its children's) until it comes back.
  const offscreen = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        for (const en of entries) en.target.classList.toggle("paused", !en.isIntersecting);
      }, { rootMargin: "100px 0px" })
    : null;
  function watch(el) { if (offscreen) offscreen.observe(el); }

  // Start each sign's swing and its two monkeys' leaning on the same clock
  function syncTugs() {
    if (!document.getAnimations) return;
    requestAnimationFrame(() => {
      const t = document.timeline.currentTime;
      for (const job of $$(".job")) job.getAnimations({ subtree: true }).forEach((a) => { if (a.animationName !== "drip") a.startTime = t; });
    });
  }

  // Blinking: rather than every monkey running its own endless animation,
  // one timer makes a single visible monkey blink every so often.
  function startBlinking() {
    setInterval(() => {
      if (document.hidden || document.documentElement.classList.contains("still")) return;
      const awake = $$(".monkey:not(.paused)");
      if (!awake.length) return;
      const m = awake[(Math.random() * awake.length) | 0];
      m.classList.add("blink");
      setTimeout(() => m.classList.remove("blink"), 260);
    }, 900);
  }

  addMonkeys();
  // Tug-of-war monkeys pause and resume with their sign (the whole .job),
  // never on their own, so the pulling always lines up with the sign's motion
  $$(".monkey.hold, .monkey.study, .job, .para").forEach(watch);
  syncTugs();
  addEventListener("motionchange", syncTugs); // animations restart from scratch when motion comes back
  startBlinking();

  let timer;
  const schedule = () => { clearTimeout(timer); timer = setTimeout(build, 120); };
  addEventListener("resize", schedule);
  if ("ResizeObserver" in window) new ResizeObserver(schedule).observe(document.body);
  Promise.race([document.fonts ? document.fonts.ready : null, new Promise((r) => setTimeout(r, 1200))]).then(build);
})();
