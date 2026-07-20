# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # dev server at http://localhost:5173
npm run build      # tsc type-check + vite production build → dist/
npm run preview    # serve the dist/ build locally
npm run lint       # eslint
```

Deployment scripts (PowerShell):

```powershell
.\deploy.ps1       # npm run build then WinSCP sync dist/ → root@170.64.223.82:/var/www/carkus.com
.\deploy-data.ps1  # (lives in CV_carkus_landing — not used here; data is managed directly in the carkus-data repo)
```

## Architecture

This is a React 19 + TypeScript personal CV/portfolio site for Mark Scicluna, converted from a .NET Blazor WebAssembly project at `c:\_work\CV_carkus_landing`. The Blazor source is the authoritative reference for intended design and behaviour.

**Routing:** `src/App.tsx` — two routes via react-router-dom BrowserRouter: `/` (Home) and `/profile` (Profile).

**Pages:**

- `src/pages/Home.tsx` — assembles all section components and wires the scroll-reveal IntersectionObserver (adds `.visible` to `.reveal` elements).
- `src/pages/Profile.tsx` — standalone page with full reference letters, YouTube embeds, a local `.MOV` video, and press links. Has its own sticky nav; does not use the shared NavBar.

**Data loading:** Each data-driven component fetches from `https://raw.githubusercontent.com/carkus/carkus-data/main/*.json` on mount with a hardcoded fallback array matching the JSON shape. Data is managed directly in the `carkus-data` GitHub repo. No global state — each component owns its fetch.

**CSS:** All styles are in `src/index.css` — a single flat file using CSS custom properties (`--ink`, `--navy`, `--slate`, `--steel`, `--mist`, `--silver`, `--chalk`, `--accent`, `--accent2`). No CSS modules, no Tailwind. The `App.css` from the Vite scaffold is unused and can be deleted.

**Fonts & icons:** Loaded via `index.html` `<link>` tags — Google Fonts (Cormorant Garamond, DM Mono, Instrument Sans) and devicons CDN. Skill icons use either a `devicon-*` class on an `<i>`, an `img/` path for local SVGs, or a Unicode character (◆) for custom entries.

**Scroll-reveal animation:** `.reveal` elements start at `opacity:0; transform:translateY(28px)`. Home.tsx attaches a single IntersectionObserver after mount that adds `.visible` to trigger the transition. Skills section has its own separate cascade animation managed inside `SkillsSection.tsx` via a second IntersectionObserver on the board element.

**Skill proficiency stars:** Each `.skill-row` renders a 5-star rating (`.skill-row-stars`), one star per 20% of `s.pct`, filled count via `Math.round(s.pct / 20)`. The `revealed` class (added by the cascade timer inside `SkillsSection.tsx`) triggers the row's flip-in animation; star fill color is static, not animated separately.

**Hero rotating card:** `HeroSection.tsx` filters `workitems.json` for `featured: true` items and cycles through them on an 8-second interval with a 700 ms opacity fade (controlled by a `visible` boolean state).

**Expertise drag-scroll:** `ExpertiseSection.tsx` attaches raw `mousedown/mousemove/mouseup/mouseleave` listeners to the scroll container ref — same logic as the original Blazor `initDragScroll` JS function.

**Static assets:** `public/img/` for local project images, `public/files/` for the CV PDF and visionOS MOV video. Image paths in `workitems.json` that begin with `img/` are served from `public/img/`.

**Types:** `src/types.ts` — `WorkItem`, `WorkLink`, `WorkCredit`, `Skill`, `ExpertisePanel`, `TimelineEntry`.
