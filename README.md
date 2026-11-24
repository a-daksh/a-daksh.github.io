# Daksh Adhar's Portfolio

Source for my personal website: **https://a-daksh.github.io**

Built with [Gatsby 5](https://www.gatsbyjs.com/) and React, based on
[Brittany Chiang's v4 portfolio](https://github.com/bchiang7/v4) (design credit to her; if you want
something similar, fork her repo).

---

## Quick start

Requirements: **Node 22** (see `.nvmrc`; 20+ works) and Yarn 1 (`npx yarn@1` works if it isn't installed).

```sh
yarn              # install dependencies
yarn develop      # dev server at http://localhost:8000
yarn build        # production build into /public
yarn serve        # preview the production build at http://localhost:9000
yarn lint         # ESLint
yarn format       # Prettier
```

A pre-commit hook (husky + lint-staged) formats and lints staged files.

## Deploying

**Push to `main` and the site deploys itself.** The GitHub Actions workflow
(`.github/workflows/deploy.yml`) lints, builds and publishes `/public` to the `gh-pages` branch,
which GitHub Pages serves. Progress is visible in the repo's **Actions** tab (takes ~2–3 min);
a run can also be started by hand there ("Deploy site" → Run workflow).

Manual fallback from your machine: `yarn deploy` (same build, pushed with `gh-pages --nojekyll`).

Tip: build and preview locally first (`yarn build && yarn serve`) before pushing to `main`.

---

## Where things live

```
content/              All page content, as markdown (edit these to update the site)
  featured/<Folder>/  Home page "Featured Projects"   (newest folder name first)
  projects/<Folder>/  /archive page projects          (newest folder name first)
  jobs/<Company>/     "Where I've Worked" tabs        (sorted by `date`)
  news/*.md           News list                       (sorted by `date`)
  publications/<X>/   Publications                    (sorted by `date`, used as an order number)
src/
  components/         React components (layout, nav, cards, 3D hero, ...)
    sections/         One file per home-page section
  config.js           Social links, nav links (email lives in utils/email.js, obfuscated)
  styles/             Global styles, theme colours (GlobalStyle.js), mixins
  images/             Portrait, favicon, background images
static/               Copied as-is: resume PDF, og.png, sw.js, 3D hero assets (dexterlab/)
tools/                Scripts for regenerating media (not part of the site build)
```

### Updating content

- **Resume**: replace `static/Daksh_Adhar.pdf` (keep the file name).
- **About text**: `src/components/sections/about.js`. **Portrait**: `src/images/DakshAdhar.jpg`
  (use at least 600 px wide so it stays sharp on high-DPI screens).
- **New job**: add `content/jobs/<Company>/index.md` with `date`, `title`, `company`, `location`,
  `range`, optional `url`, and the bullet list in the body.
- **News item**: add `content/news/<name>.md` with `date: 'YYYY-MM-DD'` and optional `emoji`.

### Adding a project

Create `content/featured/ProjectN/` (or `content/projects/ProjectN/` for the archive) with:

```md
---
title: 'My Project'
cover: './cover.jpg' # required still image (also the poster under a video)
video: './video.mp4' # optional looping clip
github: 'https://github.com/...' # optional
external: 'https://...' # optional (report, demo, ...)
tech:
  - PyTorch
  - MuJoCo
---

One-paragraph description.
```

Make `video.mp4` + `cover.jpg` from any clip or GIF with the helper (needs ffmpeg; on Windows run it in
WSL or Git Bash):

```sh
tools/media/make-cover.sh input.mp4 content/featured/ProjectN --start 12 --duration 20 --speed 2
```

It trims, speeds up, scales to at most 1600 px, encodes a small web-friendly MP4 and writes the first
frame as `cover.jpg`. Run it with no arguments to see all options (crop, fps, quality, frame folders).

Videos only download when scrolled near and pause off-screen; visitors who prefer reduced motion
see the still cover.

---

## The 3D hero (DexterLab)

The robot in the hero (`src/components/heroRobot.js`) is a UR5e arm + Allegro hand replaying my
teleoperated DexterLab demos with three.js. Its assets in `static/dexterlab/` are exported from MuJoCo:

```sh
# 1. inside the DexterLab repo's Python environment
MUJOCO_GL=osmesa python tools/dexterlab/export_web.py \
  --demos-dir <DexterLab>/data/demos/pick_and_place --out static/dexterlab
# 2. in this repo: compress the geometry (~4x smaller)
yarn compress:3d
```

The poses (`dexterlab.bin.gz`) are frame-delta encoded and gzipped by the export script; the model
(`dexterlab.glb`) is meshopt-compressed by step 2. The hero decodes both in the browser.

`tools/dexterlab/render_cover.py` renders the DexterLab project video the same way. The still
`poster-dark.webp` / `poster-light.webp` images are screenshots of the hero, shown while the 3D scene
loads or when WebGL is unavailable.

three.js and these assets load only after the page has finished loading, never on data-saver or slow
connections, and rendering pauses when the hero is off-screen.

## Theme

Colours are CSS variables in `src/styles/GlobalStyle.js` (dark by default, light under
`<html data-theme="light">`). `gatsby-ssr.js` applies the saved theme before first paint;
`src/contexts/ThemeContext.js` handles the toggle.

| Token         | Dark                  | Light                 |
| ------------- | --------------------- | --------------------- |
| background    | `#1E201E`             | `#ECDFCC`             |
| text / accent | `#FFFFFF` / `#ECDFCC` | `#1E201E` / `#323232` |

Fonts: Calibre (sans) and SF Mono (mono), self-hosted from `src/fonts/`.

## Maintenance notes

- **Keep `static/sw.js`.** Old versions of the site installed an offline service worker; this file
  removes it (and its caches) from returning visitors' browsers.
- **Keep the 3D model licences.** The UR5e and Allegro meshes are BSD-licensed:
  `static/dexterlab/THIRD_PARTY_NOTICES.txt` must stay deployed next to `dexterlab.glb`.
- Shell scripts must keep LF line endings (enforced by `.gitattributes`).
- Typing `beep` anywhere on the site opens an easter egg (`src/components/galaxy.js`).

## Credits

- Design and original code: [Brittany Chiang](https://github.com/bchiang7/v4) (MIT).
- 3D robot models: UR5e © ROS-Industrial Consortium (BSD-3-Clause) and Allegro hand © SimLab
  (BSD-2-Clause), via [MuJoCo Menagerie](https://github.com/google-deepmind/mujoco_menagerie).
