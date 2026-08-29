// Real data carried over from the live site (amarjeetmishra.com).
// All media is served from Cloudflare R2 behind the CDN domain below —
// video bytes never pass through this app's server.

export const CDN_URL = "https://media.amarjeetmishra.com";

export const LogoImg = `${CDN_URL}/images/logo.png`;
export const placeholderImg = `${CDN_URL}/images/placeholder.svg`;
export const bg1 = `${CDN_URL}/images/Bg-gradient1.jpg`;
export const bg1Min = `${CDN_URL}/images/bg-gradient.webp`;
export const bg2Min = `${CDN_URL}/images/bg-gradient1.webp`;

export const HeroImg = `${CDN_URL}/amar-in-action/hero-14/hd.webp`;
export const HeroImgBlur = `${CDN_URL}/amar-in-action/hero-3/blur.webp`;

// Behind-the-scenes reels of Amar on set — four HLS videos on R2.
export interface ActionReel {
  id: string;
  mediaUrl: string;
  posterUrl: string;
  /** Tiny blur placeholder — empty until R2 has blur-thumbnail.webp for these assets. */
  blurUrl: string;
}

export const actionReels: ActionReel[] = [1, 2, 3, 4].map((n) => ({
  id: `amar-in-action-${n}`,
  mediaUrl: `${CDN_URL}/assets/Videos/amar-in-action/${n}/master.m3u8`,
  posterUrl: `${CDN_URL}/assets/Videos/amar-in-action/${n}/master.webp`,
  // blur-thumbnail.webp not yet generated for amar-in-action assets on R2
  // (verified 404 for /1–/4); leave empty so ReelCard skips the blur layer
  // instead of hitting /_next/image?url=…/blur-thumbnail.webp → 404.
  blurUrl: "",
}));

export const brand = {
  name: "Amar",
  full: "Amarjeet Mishra",
  tagline: "Video editor, filmmaker & teacher",
  location: "Ludhiana, Punjab",
  email: "hello@amarjeetmishra.com",
  emailGmail: "amarjeetmishra008@gmail.com",
  // TODO: populate — real WhatsApp number in international format, e.g. "919812345678"
  whatsapp: "",
  // TEMPORARY TEST VALUE — using the amar-in-action reel so the modal can be tested.
  // TODO: replace with the real 2026 showreel URL, or set back to "" to hide the button.
  showreelUrl: `${CDN_URL}/assets/Videos/amar-in-action/1/master.m3u8` as string,
} as const;

// Raw socials from the live site. "#" means no account / not public yet.
export const socials = {
  insta: "https://www.instagram.com/edit_with_amar",
  twitter: "#",
  youtube: "https://www.youtube.com/@AmarEditzOfficial",
  fiverr: "https://www.fiverr.com/amarmishra008",
  linkedin: "https://www.linkedin.com/in/amarjeetmishra001/",
  freelancer: "#",
} as const;

export interface SocialLink {
  label: string;
  url: string;
}

// Only links with a real URL are rendered anywhere on the site.
export const socialLinks: SocialLink[] = [
  { label: "Instagram", url: socials.insta },
  { label: "YouTube", url: socials.youtube },
  { label: "Fiverr", url: socials.fiverr },
  { label: "LinkedIn", url: socials.linkedin },
  { label: "Twitter", url: socials.twitter },
  { label: "Freelancer", url: socials.freelancer },
].filter((link) => link.url.startsWith("http"));

// Service offering — wording adapted from the design exploration files.
// TODO: confirm copy with Amar before launch.
export interface Service {
  id: string;
  num: string;
  title: string;
  desc: string;
  tags: string[];
}

export const services: Service[] = [
  {
    id: "reels",
    num: "01",
    title: "Instagram Reels",
    desc: "Short-form vertical content engineered for the scroll — hooks, pacing, captions, sound.",
    tags: ["Hooks", "Pacing", "Captions"],
  },
  {
    id: "brand-films",
    num: "02",
    title: "Brand films & commercials",
    desc: "Cinematic narratives that define how the world sees your brand.",
    tags: ["Concept", "Shoot", "Grade"],
  },
  {
    id: "product",
    num: "03",
    title: "Product & model shoots",
    desc: "Studio-grade product films and lookbook shoots with a consistent grade.",
    tags: ["Lighting", "Direction", "Retouch"],
  },
  {
    id: "podcast",
    num: "04",
    title: "Podcast production",
    desc: "Multi-cam recording, mixing, and clip-ready episodes for YouTube & Instagram.",
    tags: ["Capture", "Mix", "Cutdowns"],
  },
  {
    id: "photography",
    num: "05",
    title: "Photography",
    desc: "Editorial and commercial stills with a consistent cinematic grade.",
    tags: ["Stills", "Editorial"],
  },
  {
    id: "edit",
    num: "06",
    title: "Video editing",
    desc: "Edit-only engagements for footage you already have. You shoot it — I cut it.",
    tags: ["Cut", "Sound", "Color"],
  },
];

export const tickerWords = [
  "Instagram Reels",
  "Brand Films",
  "Podcasts",
  "YouTube Shorts",
  "Color Grading",
  "Photography",
  "Sound Design",
  "Ludhiana → Anywhere",
];

// Real testimonials only. None exist in the data layer yet, so testimonial
// sections render nothing. TODO: populate with real client quotes.
export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export const testimonials: Testimonial[] = [];

// ── learnsimm — real program data from learnsimm.com (Shiva Institute of
// Modern Media), fetched June 2026. Presented in the richer card layout
// from the design exploration.
export interface LearnModule {
  num: string;
  title: string;
  duration: string;
  desc: string;
  tools: string[];
  outcomes: string[];
}

export const learn = {
  name: "learnsimm",
  fullName: "Shiva Institute of Modern Media",
  url: "https://learnsimm.com",
  tagline: "From Learning to Earning",
  positioning: "Punjab's Premier Media Institute · ISO Certified",
  promise: "Your complete career in media starts here.",
  // "Why SIMM" — real selling points from learnsimm.com
  whyPoints: [
    {
      title: "ISO Certified",
      desc: "Globally recognized certification that carries weight on a CV and with clients.",
    },
    {
      title: "Earn from Day 1",
      desc: "The business module is built so students can take paid work before graduating.",
    },
    {
      title: "Real Client Projects",
      desc: "Training on actual client work, not classroom exercises. Every shoot is a career opportunity.",
    },
    {
      title: "Industry Faculty",
      desc: "Instructors who are actively working in media — teaching what they did this week, not last decade.",
    },
    {
      title: "Portfolio Built",
      desc: "Graduates leave with a showreel and a working portfolio, not just a certificate.",
    },
    {
      title: "Professional Gear",
      desc: "Real cameras, gimbals, drones, and lighting setups in your hands from the start.",
    },
    {
      title: "AI-Powered Skills",
      desc: "AI tools taught as income multipliers — faster workflows, more deliverables, new revenue streams.",
    },
    {
      title: "Multiple Income Streams",
      desc: "Freelance projects, agency jobs, studio ownership, brand retainers, and AI content paths.",
    },
  ],
  approach: [
    "Real projects — not just theory. Every skill you learn is immediately applied to actual client work.",
    "Every shoot is a career opportunity.",
  ],
  placement: [
    "Industry referrals and job alerts",
    "Lifetime alumni network access",
    "Freelancing strategy guidance",
    "Placement support post-graduation",
  ],
  // Real student testimonials from learnsimm.com
  testimonials: [
    {
      quote:
        "SIMM changed how I think about media. The business module alone helped me land my first paying client before graduation.",
      author: "Arjun",
      role: "Freelance Videographer, Chandigarh",
    },
    {
      quote:
        "The business module made my career. Real project experience from the very first month.",
      author: "Rahul Singh",
      role: "Content Creator & Editor, Ludhiana",
    },
    {
      quote:
        "I came in with zero knowledge. Today I run my own photography and video production studio.",
      author: "Priya Malhotra",
      role: "Studio Owner, Amritsar",
    },
  ],
  contact: {
    address: "Shiva Tower, Laxmi Cinema Road, Karimpura, Ludhiana, Punjab 141008",
    phone: "+91 7986862253",
    email: "learnsimm@gmail.com",
    hours: "Mon–Sat · 10:30 AM – 6:30 PM",
  },
  admission: [
    "EMI payment options available",
    "Free counselling sessions",
    "24-hour callback on every enquiry",
  ],
  stats: [
    { value: "500+", label: "Students trained" },
    { value: "6 mo", label: "Full program" },
    { value: "3", label: "Core modules" },
    { value: "ISO", label: "Certified" },
  ],
  program: {
    duration: "6 months",
    price: "₹70,000",
    priceNote: "All-inclusive · EMI available",
    // TODO: confirm next batch date — learnsimm.com currently shows a stale date
    nextBatch: "",
  },
  modules: [
    {
      num: "01",
      title: "Creative Software",
      duration: "8 weeks",
      desc: "Video editing, design, and animation training on professional tools — from your first timeline to client-ready deliverables.",
      tools: ["Premiere Pro", "After Effects", "Lightroom", "CapCut", "Canva"],
      outcomes: [
        "YouTube videos & brand reels",
        "Ad films & motion graphics",
        "Social content & documentaries",
      ],
    },
    {
      num: "02",
      title: "Camera & Production",
      duration: "10 weeks",
      desc: "Hands-on cinematography and production gear mastery — camera operation, gimbal, drone, and lighting.",
      tools: ["Camera", "Gimbal", "Drone", "Lighting"],
      outcomes: [
        "Food & fashion photography",
        "Interior / real-estate shoots",
        "Commercial ads & YouTube content",
      ],
    },
    {
      num: "03",
      title: "Business, Freelancing & AI",
      duration: "6 weeks",
      desc: "Client management, pricing strategy, portfolio building, and AI-powered workflows — the business behind the craft.",
      tools: ["Freelancing roadmap", "Workflow", "AI tools"],
      outcomes: [
        "Freelance projects & agency jobs",
        "Studio ownership & brand retainers",
        "AI-assisted revenue streams",
      ],
    },
  ] satisfies LearnModule[],
};

// ── Journal — posts seeded from the design exploration (amarv2-2).
// Bodies are ghost-written drafts in Amar's voice.
// TODO: Amar to review/edit every article before launch.
export interface JournalPost {
  slug: string;
  title: string;
  date: string;
  read: string;
  category: string;
  excerpt: string;
  /** Article paragraphs, rendered in order. */
  body: string[];
}

export const journalPosts: JournalPost[] = [
  {
    slug: "edit-to-the-music",
    title: "Editing to the music, not on the beat",
    date: "Apr 14, 2026",
    read: "6 min",
    category: "Craft",
    excerpt:
      "Cutting on the beat makes a music video. Cutting to the music makes a film. The difference is where the emotion lives.",
    body: [
      "Every new editor discovers the beat grid at some point. You drop a track on the timeline, you see the waveform spike, and you start landing every cut exactly on the kick. It feels powerful. The edit suddenly has rhythm, and rhythm feels like skill.",
      "But watch any film sequence you love and count the cuts against the music. They almost never land on the beat. They land just before it, or hang just after it, or ignore it entirely for eight bars and then hit one beat so hard you feel it in your chest. That's the difference between cutting on the music and cutting to it.",
      "Cutting on the beat outsources the emotional decision to the metronome. Every cut carries the same weight, so no cut carries any. The audience's body nods along, but nothing lands, because landing requires contrast — tension held and then released.",
      "What I do instead: I listen to the track three or four times without touching the timeline, and I mark the moments where the music changes its mind. A key change, a drop, a breath where the instruments thin out. Those are the only beats that matter. Everything between them is cut for the footage — for the look, the gesture, the line — not for the snare.",
      "Then, at the moments that matter, I spend the beat deliberately. A hard cut on the drop after twenty seconds of off-beat cutting feels like a punch. The same cut in a sequence that hit every beat before it feels like nothing.",
      "Cutting on the beat makes a music video. Cutting to the music makes a film. Spend your beats like money — rarely, and on purpose.",
    ],
  },
  {
    slug: "first-paying-client",
    title: "How I got my first paying client (and what I'd do differently)",
    date: "Mar 02, 2026",
    read: "8 min",
    category: "Business",
    excerpt:
      "Three years of unpaid edits before the first invoice. The signal that finally worked.",
    body: [
      "For three years I edited for free. Friends' YouTube channels, college events, a cousin's wedding film that took me two weeks. I told myself it was practice — and it was — but it was also hiding. As long as nobody paid me, nobody could be disappointed.",
      "The first paying client didn't come from a portfolio website or a cold DM campaign. It came from one specific change: I stopped showing people everything I could do and started showing them one thing, done the way their business needed it.",
      "I picked a local business, took their existing footage from Instagram, and recut thirty seconds of it the way I would have shot and cut it. Then I sent it to them with two lines: this is what your content could look like, and this is what it costs. No pitch deck, no list of software I knew.",
      "They said yes the same day. Not because the edit was extraordinary — looking back, it wasn't — but because I had removed every step between them and a decision. They could see the exact thing they were buying.",
      "What I'd do differently: I'd do it two years earlier, and I'd charge more. The number I quoted was so low it almost cost me the job — serious businesses are suspicious of cheap. The price you ask communicates the league you play in.",
      "If you're in the unpaid years right now: the work is probably already good enough. The missing piece isn't skill, it's making one specific business an offer that's easier to accept than to ignore.",
    ],
  },
  {
    slug: "color-without-luts",
    title: "Why I stopped using LUTs",
    date: "Feb 18, 2026",
    read: "5 min",
    category: "Craft",
    excerpt:
      "LUTs are training wheels. Useful, until you can't ride without them. Here's the node tree I use instead.",
    body: [
      "I bought LUT packs for two years. Cinematic ones, film-emulation ones, packs named after movies whose colorists would never have used them. Every project started the same way: drop the LUT, watch it break the skin tones, and then fight it for an hour.",
      "The problem isn't that LUTs are bad. It's that a LUT is someone else's answer to someone else's footage. It was built on a specific camera, a specific exposure, a specific light. Your footage is none of those things, so the LUT lands wrong, and you spend your time correcting the correction.",
      "What replaced the packs is a node order I now use on almost everything. First node: balance — exposure and white balance until the image is honest. Second node: contrast, built with curves, before any color decision. Third node: color — and only now, because hue choices made on an unbalanced image are guesses. Last node: the look — the warmth in the highlights, the lift in the shadows, the thing that makes it yours.",
      "The discovery that mattered: the look node is small. When the balance and contrast are right, the 'cinematic' part is two or three gentle moves, not a thirty-point preset. Most of what LUT packs sell you is contrast and balance you should have built yourself.",
      "I still use LUTs for one thing — camera manufacturer conversion from log to a neutral starting point. That's a math problem, not a taste problem, and math is what LUTs are actually good at.",
      "Training wheels are great until the day they're the reason you can't ride. Build the grade by hand for one month and you'll never go back to the packs.",
    ],
  },
  {
    slug: "shooting-for-the-edit",
    title: "The shot you wish you had",
    date: "Jan 27, 2026",
    read: "4 min",
    category: "Production",
    excerpt:
      "Every editor has a list of shots they wish the director had captured. After six years, mine is short and specific.",
    body: [
      "Every editor keeps a private list of shots they needed and never got. After six years of cutting other people's footage and my own, my list has stopped growing. It's four shots long, and I now capture them on every shoot whether the storyboard asks for them or not.",
      "One: the ten seconds before the action. The hands adjusting the collar before the interview. The shop shutter going up. Every edit needs a way in, and the moment before the moment is almost always the best door.",
      "Two: the static wide that holds. Not a move, not a reveal — a locked frame that breathes for fifteen seconds. When the edit gets fast, this shot is the rest between the notes. Directors hate shooting it because it feels like nothing is happening. In the cut, it's where everything settles.",
      "Three: the reaction, held too long. Whoever is listening, keep rolling on them after the line. People do their most honest acting when they think the shot is over.",
      "Four: the detail that proves the place is real. Steam off the chai. The worn button on the machine. One macro shot per location buys credibility for the whole sequence around it.",
      "None of these are hero shots. That's the point — the hero shots always get captured. It's the connective tissue that goes missing, and connective tissue is what an edit is actually made of. Shoot for the edit, and the edit stops being a salvage mission.",
    ],
  },
  {
    slug: "r2-pipeline",
    title: "Why I moved my entire delivery pipeline to Cloudflare R2",
    date: "Jan 09, 2026",
    read: "9 min",
    category: "Tools",
    excerpt:
      "S3 egress fees were eating my margin. Here's what switched and what broke along the way.",
    body: [
      "Client delivery used to be the worst part of my pipeline. Final films went out as download links from cloud storage, portfolio videos streamed from wherever was cheapest that month, and every bill had a line item I'd learned to dread: egress. The more people watched my work, the more I paid for the privilege.",
      "The fix was moving everything — delivery masters, portfolio streams, image galleries — to Cloudflare R2. The headline reason is simple: R2 charges nothing for egress. Storage costs a little, requests cost a little, but bandwidth — the thing that scales with success — is free.",
      "The migration itself was mostly boring, which is a compliment. R2 speaks the S3 API, so the upload tooling carried over with a changed endpoint. The real work was re-encoding the portfolio for streaming: every video became an HLS ladder — a master.m3u8 with quality variants — plus a poster frame and a tiny blur thumbnail generated at the same path. One convention, every video, no exceptions.",
      "What broke: cache headers. R2 behind Cloudflare's CDN caches aggressively, which is what you want until you replace a file and the old version lives on for a day. Now every re-upload gets a new path instead of overwriting — versioned folders, never mutated files.",
      "The numbers after switching: my delivery and hosting cost dropped to roughly the price of storage alone, and streaming got faster in India because the CDN edge is close. The portfolio site you're reading this on serves every frame of video from that bucket, and the server that renders the pages never touches a video byte.",
      "If your work is video and your audience is growing, egress pricing is a tax on your own success. Move the bytes somewhere that doesn't charge you for being watched.",
    ],
  },
];

// ── Compat aliases for v3 incremental migration ──
export const URL = CDN_URL;
export const bg1_min = bg1Min;
export const bg2_min = bg2Min;
export const bg2_min_jpg = `${CDN_URL}/images/bg-gradient-min.jpg`;
