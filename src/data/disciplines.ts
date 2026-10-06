// Content for the three discipline deep-dive pages (/web, /ai, /mobile).
// Static rather than fetched like the home page's sections — these pages are
// long-form write-ups that change rarely, and keeping them typed here means
// one shared DisciplinePage component can render all three.

export type DisciplineKey = 'web' | 'ai' | 'mobile';

export interface DisciplineLink { label: string; url: string; inactive?: boolean; }

export interface DisciplineProject {
  title: string;
  /** Short mono label above the title, e.g. "Personal · 2026". */
  meta: string;
  summary: string;
  highlights: string[];
  tags: string[];
  imageUrl?: string;
  imageAlt?: string;
  /** Pixel nudges for the case-study image from its imagePosition anchor
   *  (default centre) — same convention as WorkItem.imageOffsetX / imageOffsetY.
   *  Positive X moves the image right, positive Y moves it down. */
  imageOffsetX?: number;
  imageOffsetY?: number;
  /** Raw CSS object-position fallback for the case-study image crop. */
  imagePosition?: string;
  /** Zoom factor for the case-study image, e.g. 1.2 for 20% larger — scales
   *  around the offset/position focal point, so it zooms into the part of the
   *  image the offsets already frame. Defaults to 1 (no zoom). */
  imageScale?: number;
  /** Frame shape of the case-study image, as a CSS aspect-ratio such as
   *  "16/9" or "1". The text wraps around this frame, so the image keeps its
   *  shape however long the write-up gets. Defaults to "4/3". */
  imageAspect?: string;
  /** Gallery entries: images, video files (.mp4/.mov/.webm…) or YouTube/Vimeo
   *  URLs — the viewer is picked per entry. A bare file name resolves to
   *  /img/ (images) or /files/ (videos). See utils/media.ts. */
  slideshowImages?: string[];
  links: DisciplineLink[];
}

export interface DisciplinePrinciple { icon: string; title: string; text: string; }

export interface DisciplineStat { value: string; label: string; }

export interface Discipline {
  key: DisciplineKey;
  path: string;
  /** Tab / nav label. */
  label: string;
  heading: string;
  sub: string;
  intro: string[];
  stats: DisciplineStat[];
  stack: string[];
  principles: DisciplinePrinciple[];
  projects: DisciplineProject[];
  seoTitle: string;
  seoDescription: string;
}

export const DISCIPLINES: Record<DisciplineKey, Discipline> = {
  web: {
    key: 'web',
    path: '/web',
    label: 'Web',
    heading: 'Web & Backend',
    sub: 'React · TypeScript · Blazor WASM · ASP.NET Core · Node',
    intro: [
      'React and TypeScript are my primary web toolkit, with Blazor WebAssembly for projects that live closer to .NET. Most of what I build is full-stack — the UI, the API behind it, and the deployment it runs on.',
      'Backends are ASP.NET Core minimal APIs or Node/Express, deployed to DigitalOcean behind nginx and systemd, with shared infrastructure like a multi-tenant auth server reused across projects rather than rebuilt for each.',
    ],
    stats: [
      { value: 'React', label: 'Primary toolkit' },
      { value: 'Blazor', label: '.NET-integrated UI' },
      { value: '.NET', label: '& Node backends' },
      { value: 'Self', label: 'Hosted & deployed' },
    ],
    stack: ['React 19', 'TypeScript', 'Vite', 'Blazor WASM', 'ASP.NET Core', 'Node / Express', 'MySQL', 'TipTap', 'nginx', 'systemd', 'DigitalOcean'],
    principles: [
      { icon: '◧', title: 'Preview what you print', text: 'Document tools render a live, print-ready preview beside the editor, so the PDF is never a surprise.' },
      { icon: '⇆', title: 'Shared infrastructure', text: 'Auth, email, and SEO live in reusable services and packages instead of being re-implemented per site.' },
      { icon: '▤', title: 'Data-driven content', text: 'Content is JSON with typed fallbacks, so sites update without a rebuild and still render when a fetch fails.' },
    ],
    projects: [
      {
        title: 'Scribbler 2026',
        meta: 'Personal · Full-stack',
        summary: 'A collaborative writing platform for organising work into Collections and Articles, with suggestions, appraisal notifications, messaging, and distraction-free rich-text editing.',
        highlights: [
          'Rich-text editing built on TipTap, kept distraction-free by default',
          'Collections → Articles hierarchy for organising long-form work',
          'Suggestions and appraisal notifications between collaborators, plus direct messaging',
          'React + TypeScript front end over an Express API and MySQL',
        ],
        tags: ['React', 'TypeScript', 'Express', 'MySQL', 'TipTap'],
        imageUrl: '/img/scribbler-2.png',
        imageAlt: 'Scribbler',
        links: [{ label: 'Coming soon', url: 'https://scribbler.carkus.com', inactive: true }],
      },
      {
        title: 'AI Forms — PDF Builder',
        meta: 'Personal · Blazor + .NET',
        summary: 'A browser-based drag-and-drop editor for building and exporting PDF forms. Describe a form in plain text and an AI pipeline generates the fields and layout, with pre-filled values.',
        highlights: [
          'Drag-and-drop form canvas in Blazor WebAssembly',
          'Backed by MarkdownForms.Api — form schemas defined in Markdown, exported as PDFs with real AcroForm fields',
          'Plain-language form generation via an agentic LangGraph / LlamaIndex pipeline and the Claude API',
        ],
        tags: ['Blazor', 'ASP.NET Core', 'PDF Generation', 'Claude API'],
        imageUrl: '/img/pdf_form.png',
        imageAlt: 'AI Forms PDF Builder',
        links: [{ label: 'Open editor', url: 'https://editor.carkus.com/form-editor' }],
      },
      {
        title: 'FPG Receipts',
        meta: 'Client · Fitzroy Public Gallery',
        summary: 'A receipt generator built for the Fitzroy Public Gallery — line items, commission and GST calculation, and bank details, laid out live against a print-ready preview pane for one-click PDF export.',
        highlights: [
          'Commission and GST calculated as line items are entered',
          'Side-by-side live preview that matches the exported PDF',
          'React + TypeScript front end with an ASP.NET Core API',
        ],
        tags: ['React', 'TypeScript', 'ASP.NET Core'],
        imageUrl: '/img/fpg_logo.jpg',
        imageAlt: 'FPG Receipts',
        links: [{ label: 'Open FPG Receipts', url: 'https://carkus.com/fpg' }],
      },
      {
        title: 'Smooth Software',
        meta: 'Business site · React + .NET',
        summary: 'Marketing site for Smooth Software — websites, apps, and admin tools built fast at straight rates. An 80s-homage design with animated CRT-glow borders and retro type.',
        highlights: [
          'React + Vite front end with a CSS-only retro animation layer',
          'ASP.NET Core minimal-API backend: contact form → email via Mailgun',
        ],
        tags: ['React', 'TypeScript', 'ASP.NET Core', 'Mailgun'],
        imageUrl: '/img/smooth_software_wide.png',
        imageAlt: 'Smooth Software',
        imagePosition: '10% center',
        links: [{ label: 'Open Smooth Software', url: 'https://smoothsoftware.carkus.com' }],
      },
      {
        title: 'Auth Login',
        meta: 'Shared infrastructure',
        summary: 'A multi-tenant auth server shared by my other projects — registration, login, token refresh, email verification, and password reset.',
        highlights: [
          'JWT access tokens with refresh-token rotation',
          'Auto-provisions a siteId per consuming project, so new sites get auth without new code',
          'Email verification and password-reset flows built in',
        ],
        tags: ['ASP.NET Core', 'JWT', 'Multi-tenant'],
        links: [{ label: 'auth.carkus.com', url: 'https://auth.carkus.com' }],
      },
      {
        title: 'This site',
        meta: 'Portfolio · React',
        summary: 'This portfolio — converted from a Blazor WebAssembly original to React 19 + TypeScript, with JSON-driven sections, a light/dark theme, and an "Ask AI" widget backed by ChattyPrayers.Api.',
        highlights: [
          'Each section fetches its own JSON with a typed fallback, so content updates need no rebuild',
          'Shared SEO hook package (@carkus/seo-react) reused across sites',
          'Single flat stylesheet driven by CSS custom properties for theming',
        ],
        tags: ['React', 'TypeScript', 'Vite', 'CSS Custom Properties'],
        links: [],
      },
    ],
    seoTitle: 'Web & Backend — Mark Scicluna',
    seoDescription: 'Web and backend projects by Mark Scicluna — React, TypeScript, Blazor WebAssembly, ASP.NET Core and Node, from collaborative editors to PDF form builders.',
  },

  ai: {
    key: 'ai',
    path: '/ai',
    label: 'AI',
    heading: 'AI Systems',
    sub: 'Agentic systems · MCP · RAG · Structured output · Local LLMs',
    intro: [
      'My MSc thesis was on heuristic search in robotic task planning. The same problem — break a goal into steps and decide what to do next — is now central to my LLM work: agents that plan their own subtasks, choose their own tools, and check their own output.',
      'Across these projects I hold to the same standard: production API integration with real error handling and cost control, schema-first prompts with validated outputs, retrieval over my own data, local models where privacy matters, and a human in the loop before anything ships.',
    ],
    stats: [
      { value: '4', label: 'Providers cascaded' },
      { value: '2', label: 'MCP servers built' },
      { value: 'UCB1', label: 'Model selection' },
      { value: 'MSc', label: 'AI task planning' },
    ],
    stack: ['Claude API', 'Gemini API', 'OpenAI', 'Ollama', 'MCP', 'RAG', 'Embeddings', 'LangGraph', 'LlamaIndex', 'Python', 'ASP.NET Core', 'AWS Lambda'],
    principles: [
      { icon: '▤', title: 'Schema first, then validate', text: 'Prompts carry a concrete JSON example; responses are parsed into typed records and retried once with a correction prompt if they fail.' },
      { icon: '⇄', title: 'Never one provider', text: 'Cloud → cloud → local fallback cascades, with every failover logged so silent degradation stays visible.' },
      { icon: '⌂', title: 'Local where it matters', text: 'Ollama runs as a last-resort fallback in production and as a fully local option in development.' },
      { icon: '◉', title: 'Human in the loop', text: 'Plans are shown before they are built; agents are published as tools only after a person has exercised them.' },
    ],
    projects: [
      {
        title: 'Agent One — Self-Scaffolding Agents',
        meta: 'Personal · Python + React',
        summary: 'Describe a task in plain language and Agent One designs the agent to do it — system prompt, tool definitions, and implementations — then runs it in a tool-use loop. A master agent can delegate subtasks to purpose-built worker agents it bootstraps on the fly.',
        highlights: [
          'Bootstrap call designs the whole agent from a purpose string; implementation code is compile-checked and broken tools are retried or dropped',
          'MCP client: picks vetted tools (time, fetch, Tavily web search) from real MCP servers instead of generating code, using the live tool schema rather than a guess',
          'MCP server: published agents are exposed as callable tools to Claude Desktop, Claude Code, or any MCP client, behind a per-consumer API key',
          'RAG-grounded bootstrapping — past successful agents are retrieved as few-shot examples for similar new purposes',
          'Self-evaluation on every response feeds a UCB1 bandit that recommends the best-performing provider/model',
          'Gemini in the cloud or Ollama fully local, including the bootstrap step',
        ],
        tags: ['Agentic', 'MCP', 'RAG', 'UCB1 Bandit', 'Gemini', 'Ollama', 'AWS Lambda', 'React'],
        imageUrl: '/img/AgentOne_logo.jpg',
        imageAlt: 'Agent One',
        links: [{ label: 'Open Agent One', url: 'https://agent.carkus.com' }],
      },
      {
        title: 'JobFit™ — AI Job Match Analyser',
        meta: 'Personal · .NET + TypeScript',
        summary: 'Scores a CV against a job description, surfaces matched skills and gaps, generates ATS-compliant resumes, and drafts cover letters — and exposes all of it as MCP tools for direct use from Claude.',
        highlights: [
          'Provider cascade OpenAI → Anthropic → Gemini → Ollama, with availability cached and ping-tested',
          'Typed AppraisalResult record; schema example embedded in the prompt; one correction-prompt retry before heuristic fallback',
          'Parallel multi-provider ensemble for recommendation discussion via Task.WhenAll',
          'Per-call token and latency capture via AsyncLocal, surfaced in the UI',
          'MCP server exposing analyze_job_fit, generate_cover_letter, and fetch_job_from_url',
        ],
        tags: ['.NET', 'TypeScript', 'MCP', 'Structured Output', 'Multi-provider'],
        imageUrl: '/img/jobfit_AI_square.png',
        imageAlt: 'JobFit',
        links: [{ label: 'Open JobFit', url: 'https://jobfit.carkus.com' }],
      },
      {
        title: 'Chatty Prayers & ChattyPrayers.Api',
        meta: 'Personal · Blazor + ASP.NET Core',
        summary: 'A personality-driven AI platform — one-on-one chat, confidant reflection, and structured multi-participant debate — on top of an API that also powers the "Ask AI" widget on this site.',
        highlights: [
          'ILlmProvider abstraction with a Claude → Gemini → Ollama cascade; every failover logged',
          'SSE streaming from all three providers, Ollama NDJSON included',
          'RAG conversation search: Ollama nomic-embed-text embeddings with in-memory cosine ranking',
          'Live context injection — weather and news providers fetched in parallel and appended to the system prompt',
          'SVG generation with boundary extraction and a correction-prompt retry',
          'Public portfolio endpoints, rate-limited per IP and pinned to a fixed system prompt to bound cost',
        ],
        tags: ['Blazor', 'ASP.NET Core', 'Claude API', 'Gemini API', 'Ollama', 'RAG', 'SSE'],
        imageUrl: '/img/chatty_prayers.png',
        imageAlt: 'Chatty Prayers',
        links: [{ label: 'Open Chatty Prayers', url: 'https://moot.carkus.com' }],
      },
      {
        title: 'Claude Assistant for ComfyUI',
        meta: 'Personal · Python + JS',
        summary: 'A ComfyUI custom node package that lets Claude read and edit the live node graph from a chat panel, plan a whole subgraph from one goal, and run as a node mid-workflow.',
        highlights: [
          'Graph edits via structured tool calls, using the real input and output names of installed node types',
          'Goal → plan → subgraph: subtasks shown to the user before anything is built, then wired by dependency',
          'Auto-layout by dependency depth, sized from each node’s real rendered dimensions',
          'Per-workflow chat history and notes persisted beside each workflow file',
        ],
        tags: ['Claude API', 'Tool Use', 'Python', 'aiohttp', 'JavaScript'],
        links: [],
      },
      {
        title: 'Baby Meta-Agent',
        meta: 'Educational · Python, local-only',
        summary: 'A from-scratch, no-framework teaching repo — 13 lessons building one agent class on a local GGUF model via llama.cpp, ending in goal-driven swarms that choose their own tools and sub-agents.',
        highlights: [
          'Atom-of-Thought planner turns a goal into a dependency graph of subtasks',
          'Per-subtask tool selection, with scope enforced in code — out-of-scope calls raise, not just discouraged in the prompt',
          'Upstream results flow into downstream sub-agents; one model instance shared across the swarm',
        ],
        tags: ['Python', 'llama.cpp', 'Local LLM', 'Agentic', 'Planning'],
        links: [],
      },
      {
        title: 'Research in AI Task Planning',
        meta: 'MSc · RMIT University',
        summary: 'Thesis research into heuristic search and search efficiency in autonomous robotic task planning — graduated with Distinction.',
        highlights: [
          'Heuristic search algorithms applied to PDDL-modelled robotics domains',
          'The groundwork for how I approach LLM planning and agent decomposition today',
        ],
        tags: ['AI Research', 'Heuristic Search', 'PDDL', 'Task Planning'],
        imageUrl: 'https://images.unsplash.com/photo-1647427060118-4911c9821b82?w=900&q=80',
        imageAlt: 'Robotics research',
        links: [],
      },
    ],
    seoTitle: 'AI Systems — Mark Scicluna',
    seoDescription: 'AI systems by Mark Scicluna — self-scaffolding agents, MCP clients and servers, multi-provider LLM cascades, RAG, structured output validation, and local LLMs.',
  },

  mobile: {
    key: 'mobile',
    path: '/mobile',
    label: 'Mobile',
    heading: 'Mobile & Spatial',
    sub: 'Swift / SwiftUI · Flutter · Kotlin · React Native · visionOS · Android XR',
    intro: [
      'Mobile cross-platform across native iOS and Android or cross-platform using Flutter or React Native. Also native middleware.',
      'ZOME Shipped as a launch partner for both Apple Vision Pro and Samsung Galaxy XR, a journey in maintaining new hardware four platforms consistently and reliably.',
    ],
    stats: [
      { value: '8yr', label: 'On ZOME' },
      { value: '4', label: 'Platforms shipped' },
      { value: 'Day 1', label: 'Vision Pro partner' },
      { value: 'Day 1', label: 'Galaxy XR' },
    ],
    stack: ['Swift', 'SwiftUI', 'visionOS', 'RealityKit', 'ARKit', 'Flutter', 'Kotlin', 'Jetpack Compose', 'Android XR', 'React Native', 'Expo'],
    principles: [
      { icon: '◫', title: 'One product, many platforms', text: 'Design intent carried consistently across iOS, Android, visionOS, and Android XR despite real platform differences.' },
      { icon: '⧉', title: 'Native where it counts', text: 'Shared cross-platform UI over native middleware layers — platform SDKs used directly for location, AR, and spatial input.' },
      { icon: '↻', title: 'Ship and maintain', text: 'Owned the mobile build and release process end to end, across years of SDK and tooling change.' },
    ],
    projects: [
      {
        title: 'ZOME: Spatial Messenger — visionOS & XR',
        meta: 'Rhizomenet · 2017–2026',
        summary: 'ZOME lets you plant messages anywhere in the world, at any location and even at points in time. The spatial edition brings that to Apple Vision Pro and Android XR.',
        highlights: [
          'Early visionOS developer within the team; day-one Apple Vision Pro launch partner',
          'SwiftUI spatial UI over RealityKit and ARKit, with a hand-tracking gesture system',
          'Custom entity animation via RealityKit’s FromToByAnimation',
          'Day-one availability on Samsung Galaxy XR via Android XR',
        ],
        tags: ['Swift', 'SwiftUI', 'visionOS', 'RealityKit', 'ARKit', 'Android XR'],
        imageUrl: '/img/ZOME_vision_ui.png',
        imageAlt: 'ZOME on visionOS',
        slideshowImages: ['/img/zome_ar1.png', '/img/zome_ar2.png', '/img/zome_ar3.png', '/img/zome_ar4.png', '/img/zome_ar5.png', '/img/zome_ar6.png', '/img/zome_ar7.png'],
        links: [
          { label: 'App Store', url: 'https://itunes.apple.com/us/app/zome/id1382123356?ls=1&mt=8' },
          { label: 'Play Store', url: 'https://play.google.com/store/apps/details?id=com.zomecorp.zome' },
        ],
      },
      {
        title: 'ZOME: Spatial Messenger — Mobile',
        meta: 'Rhizomenet · iOS & Android',
        summary: 'The phone edition of ZOME: a location-anchored messenger built cross-platform, with native iOS and Android middleware underneath.',
        highlights: [
          'Cross-platform UI layer in Flutter shared across iOS and Android',
          'Native Swift and Kotlin middleware for platform SDKs',
          'Adapted designs and user flows across several product generations',
          'Owned build and release to the App Store and Play Store',
        ],
        tags: ['Flutter', 'Swift', 'Kotlin', 'Cross-platform'],
        imageUrl: '/img/zome_banner_mobile_no_button.png',
        imageAlt: 'ZOME mobile',
        imagePosition: 'left center',
        imageScale: 1.3,
        slideshowImages: ['/img/zome_phone1.png', '/img/zome_phone2.png', '/img/zome_phone3.png', '/img/zome_phone4.png', '/img/zome_phone5.png', '/img/zome_phone6.png', '/img/zome_phone7.png'],
        links: [
          { label: 'App Store', url: 'https://itunes.apple.com/us/app/zome/id1382123356?ls=1&mt=8' },
          { label: 'Play Store', url: 'https://play.google.com/store/apps/details?id=com.zomecorp.zome' },
        ],
      },
      {
        title: 'Spatial UI Components for visionOS',
        meta: 'Library · visionOS & Android XR',
        summary: 'A library of reusable spatial UI components for Apple Vision Pro, using RealityKit and SwiftUI.',
        highlights: [
          'Composable SwiftUI + RealityKit building blocks for spatial layouts',
          'Spatial UI architecture shaped by production visionOS work',
        ],
        tags: ['visionOS', 'SwiftUI', 'RealityKit', 'Android XR'],
        imageUrl: '/img/spatial_architect.png',
        imageAlt: 'Spatial UI Components',
        links: [],
      },
      {
        title: 'Panic Stations',
        meta: 'Personal · React Native',
        summary: 'A turn-based sci-fi roguelike RPG built with React Native and Expo — procedurally generated space stations, tap-to-move pathfinding, and fog-of-war exploration.',
        highlights: [
          'Procedural station generation for each run',
          'Tap-to-move pathfinding over the station grid',
          'Fog-of-war exploration; game state managed with Zustand',
        ],
        tags: ['React Native', 'Expo', 'TypeScript', 'Zustand', 'Game Dev'],
        imageUrl: '/img/panic_stations_square.png',
        imageAlt: 'Panic Stations',
        imagePosition: 'center 20%',
        links: [],
      },
    ],
    seoTitle: 'Mobile & Spatial — Mark Scicluna',
    seoDescription: 'Mobile and spatial computing work by Mark Scicluna — eight years on ZOME across iOS, Android, Apple Vision Pro and Android XR, plus React Native and Flutter projects.',
  },
};

export const DISCIPLINE_ORDER: DisciplineKey[] = ['web', 'ai', 'mobile'];
