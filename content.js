// All site content lives here. Edit this file to update the website;
// index.html and main.js only handle layout and rendering.
window.SITE = {
  name: "Mihir Mahesh",
  role: "Computer Science (Honors) & Mathematics at UMD",
  tagline:
    "I research low-level systems and computer architecture, in both classical and quantum computing, by building simulators, compressors, and runtime systems.",
  email: "mahesh.mihir.c@gmail.com",
  links: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/mihir-mahesh-600a50275/" },
    { label: "Email", url: "mailto:mahesh.mihir.c@gmail.com" },
  ],
  resumeUrl: "resume.html",
  photo: "assets/photo.jpg",

  education: {
    school: "University of Maryland, College Park",
    degree: "B.S. Computer Science (Honors) and Mathematics",
    date: "May 2027",
    gpa: "3.925",
    honors: "Dean’s List (2023 – Present)",
    logo: "assets/logos/umd.svg",
    courses: {
      Graduate: [
        "Domain Specific Architecture", "Analysis of Algorithms", "Computer & Network Security",
        "Applied Cryptographic Systems and Privacy Enhancing Technologies", "Foundations of Parallel Computing",
      ],
      Undergraduate: [
        "Computer Architecture", "Multimodal Deep Learning", "Robotics", "Programming Languages",
        "Networks", "Binary Exploitation", "Numerical Analysis", "Abstract Algebra",
        "Probability Theory", "Real Analysis",
      ],
    },
  },

  experience: [
    {
      title: "Facilitator, The Coding Interview (CMSC389O)",
      org: "UMD Computer Science Department",
      logo: "assets/logos/umd-cs.jpeg",
      place: "College Park, MD",
      date: "Aug. 2026 – Present",
      points: [
        "Co-teaching a 90-student course on preparing for technical interviews.",
        "Grading, running mock interviews, writing lecture plans, and lecturing a section of 30 students.",
      ],
    },
    {
      title: "Computer Architecture Research Assistant",
      org: "CASL",
      url: "https://casl.cs.umd.edu",
      logo: "assets/logos/casl.png",
      place: "College Park, MD",
      date: "Jun. 2026 – Present",
      points: [
        "Working with applications of Agentic AI to streaming accelerators.",
        "Developing lossless memory compression techniques for efficient storage of embedding vectors.",
      ],
    },
    {
      title: "Quantum Computing OS Research Assistant",
      org: "Verified Quantum Computing Lab",
      url: "https://vqc.cs.umd.edu",
      logo: "assets/logos/vqc.svg",
      place: "College Park, MD",
      date: "Mar. 2026 – Present",
      points: [
        "Developing Operating Systems for Neutral Atom Quantum Computers.",
      ],
    },
  ],

  projects: [
    {
      title: "GGUF Parser Differential Analysis",
      date: "Sep. 2026 – Present",
      summary:
        "Investigating whether differences in how GGUF model files are parsed open security vulnerabilities. Initial tests found 16 cases where Ollama and gguf-py diverge.",
    },
    {
      title: "Hey Doug",
      date: "Apr. 2026",
      links: [
        { label: "Devpost", url: "https://devpost.com/software/hey-doug" },
        { label: "GitHub", url: "https://github.com/jordanabe23/bitcamp2026-vscode-extension" },
      ],
      summary:
        "A hardware-integrated, multilingual AI code tutor for non-native English speakers, with a VS Code extension that highlights the code the tutor wants you to look at.",
    },
    {
      title: "Cyber Sentinel",
      date: "Apr. 2025",
      links: [
        { label: "Devpost", url: "https://devpost.com/software/cyber-sentinel" },
        { label: "GitHub", url: "https://github.com/Suvrath421/bitcamp2025" },
      ],
      summary:
        "A Raspberry Pi-powered web threat detector paired with a browser extension. It flags anomalous CPU, RAM, and network usage during page loads with z-scores, scans site JavaScript with Semgrep and YARA rules, and blocks suspicious requests until you allow them, all locally.",
    },
    {
      title: "ConvoNav",
      links: [{ label: "Paper", url: "CMSC498K.pdf" }],
      summary:
        "A robot navigation agent that walks around people's conversations instead of through them. A graph neural network fuses camera frames and 4-channel spatial audio to find who is talking to whom (91% recall on conversation pairs), and a PPO policy plans routes that avoid cutting through those groups.",
    },
  ],

  skills: {
    Languages: ["Python", "Java", "C/C++", "Rust", "Go", "OCaml", "x86 Assembly", "Bash", "SQL", "JavaScript", "TypeScript", "MATLAB"],
    "Libraries & Frameworks": ["PyTorch", "TensorFlow", "NumPy", "Pandas", "scikit-learn", "LangChain", "Matplotlib", "JUnit", "pwntools"],
    Tools: ["Git", "Linux", "Docker", "AWS", "MongoDB", "Raspberry Pi", "Ghidra", "Wireshark", "Splunk", "YARA"],
  },

  // The résumé page (resume.html) shows everything above plus these extras,
  // which stay off the home page
  resume: {
    experience: [
      {
        title: "Sr. Associate – Application Development Intern",
        org: "Sutherland",
        place: "Dallas, TX",
        date: "Jul. 2025 – Oct. 2025",
        points: [
          "Designed a multi-agent AI system to automate insurance database migration, reducing manual data entry by over 50%.",
          "Cut execution time by over 60% for tables with 200+ entries through efficient prompts and LLM calls.",
          "Built an Angular UI for modular execution and an Azure DevOps pipeline for automated, headless end-to-end runs.",
          "Created a synthetic insurance data generator to measure speed and validate code with realistic input.",
        ],
      },
    ],
    projects: [
      {
        title: "BitTorrent Client",
        date: "Nov. 2025 – Dec. 2025",
        summary:
          "A BitTorrent client in Go with concurrent piece downloads, multi-file torrents, and SHA-1 piece verification. It talks to trackers over UDP and HTTPS, and verified 100% of piece hashes on real-world torrents.",
      },
      {
        title: "Chip-8 Emulator",
        date: "Aug. 2025",
        summary:
          "A full-cycle Chip-8 emulator written from scratch in Rust that runs original .ch8 ROMs, simulating memory, the call stack, audio, timers, and a realistic CPU clock speed.",
      },
    ],
    awards: [
      { title: "ISCA uArch Workshop 2026", detail: "Selected participant (fully funded)", date: "Mar. 2026" },
      { title: "Bitcamp 2025 Hackathon", detail: "Best Hardware Hack winner", date: "Apr. 2025" },
      { title: "U.S. Patent 11,948,541", detail: "Trombone finger positioner and gripper", date: "Apr. 2024" },
      { title: "President’s Scholarship", detail: "$50K merit-based scholarship", date: "Apr. 2023" },
    ],
  },

  // "me" is bolded in the author list.
  publications: {
    me: "Mihir Mahesh",
    // status shows where a paper stands; venue, year and links are optional
    items: [
      {
        title: "A Multiprogramming Operating System for Neutral Atom Quantum Computers",
        authors: ["Hongzheng Zhu", "Mihir Mahesh", "Runzhou Tao"],
        status: "Under review",
      },
      {
        title: "Asterope: An Agentic-AI Cycle-Level Simulator for Dataflow-driven Streaming Accelerators",
        authors: ["Mihir Mahesh", "Ubaid Bakhtiar", "Bahar Asgari"],
        status: "In preparation",
      },
      {
        title: "Ardra: Accelerating Vector Compression for Disk-Based Approximate Nearest Neighbor Search",
        authors: ["Mihir Mahesh", "Bahar Asgari"],
        status: "In preparation",
      },
    ],
  },

  // The "Monkeying Around" page (monkeying-around.html): life outside work.
  fun: {
    tagline: "When serious business turns into monkey business.",
    hobbies: [
      // "look" picks the monkey's outfit (a key of LOOKS in forest.js); "links" adds buttons; "chess" pulls live rapid stats from chess.com's public API on every page load
      { emoji: "♟️", title: "Chess", blurb: "Mostly rapid. These numbers come live from my chess.com account.", chess: "jaboychipsahoy" },
      {
        emoji: "📚", title: "Reading", look: "elf",
        blurb: "I especially love fantasy stories. My all-time favorite is _The Lord of the Rings_.",
        links: [{ label: "Goodreads profile", url: "https://www.goodreads.com/user/show/197900115-mihir" }],
      },
      { emoji: "🎮", title: "Video Games", blurb: "I really like RPGs like _Zelda_ and _Elden Ring_. I'm also pretty good at _Mario Kart Wii_ (Daisy Mach Bike 🔛 🔝).", look: "mario" },
      { emoji: "📺", title: "Anime & Manga", blurb: "_One Piece_ is easily the best, but _Naruto_ and _Vinland Saga_ are also peak. I guess part of this is technically reading too.", look: "luffy" },
    ],
    // Each piece's text lives in writing/<slug>.js and opens on read.html?piece=<slug>.
    // _underscores_ in a title make italics. minutes = reading time (~230 words a minute).
    writing: [
      {
        slug: "performance",
        title: "Performance",
        kind: "Short story",
        minutes: 24,
        blurb: "A customer service rep who gave up on dancing hears a street saxophonist on the walk home, and starts to wonder whether it's too late to choose differently.",
      },
      {
        slug: "potluck",
        title: "The Potluck",
        kind: "Short story",
        minutes: 21,
        blurb: "A famous baker in a creative slump moves to a small town, and can't figure out why everyone at the yearly potluck keeps choosing a beginner's cake over his.",
      },
      {
        slug: "white-star",
        title: "A White Star Over Mordor",
        kind: "Drawing & essay",
        minutes: 4,
        blurb: "My drawing of my favorite moment in _The Lord of the Rings_, when Sam sees a star through the clouds over Mordor, and why I drew it the way I did.",
      },
      {
        slug: "recovery",
        title: "Recovery in _The Lord of the Rings_ and _A Wizard of Earthsea_",
        kind: "Essay",
        minutes: 8,
        blurb: "How Tolkien's idea of \"Recovery\" explains why two very different fantasy stories both leave you appreciating an ordinary life.",
      },
      {
        slug: "sackville-bagginses",
        title: "The Sackville-Bagginses' Relevance to the Overarching Story",
        kind: "Essay",
        minutes: 5,
        blurb: "Bilbo's greedy relatives barely appear in _The Lord of the Rings_, but they set up its themes of greed and envy, show the Shire's flaws, and echo Bilbo's own journey.",
      },
    ],
  },
};
