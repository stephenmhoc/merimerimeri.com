# AGENTS.md

This file provides guidance to coding agents (Claude Code, Codex, etc.) when working with code in this repository.

## Project Overview

Website for MeriMeriMeri Software — a studio that builds focused, delightful software products. Jekyll static site styled with Tailwind CSS, deployed to Cloudflare Workers.

## Commands

```bash
# Install dependencies
bundle install
npm install

# Local development server (http://localhost:4000)
bundle exec jekyll serve

# Production build
JEKYLL_ENV=production bundle exec jekyll build

# Deploy (build first; cf uploads _site/ as it is)
npx cf deploy
```

Note: `_config.yml` changes require restarting the server.

## Architecture

- **Static site generator**: Jekyll 4.4 with Liquid templates
- **CSS**: Tailwind CSS 3 processed via PostCSS (`postcss-import` + `autoprefixer`), integrated through `jekyll-postcss-v2` plugin
- **Deployment**: `cf deploy` (the Cloudflare CLI) uploads `_site/` as a static-assets Worker. Pushes to `main` run the same build and `cf deploy` in GitHub Actions. Use `cf`, not `wrangler pages deploy`; the Pages project is retired. `cf` needs Node.js 22.23+.

### Key Files

- `_config.yml` — site settings, plugin config
- `css/site.css` — main stylesheet (Tailwind imports + custom component styles using `@layer`)
- `tailwind.config.js` — custom colors (`primary: #FFFFFA`, `secondary: #F5F4E9`), purge paths
- `postcss.config.js` — PostCSS pipeline
- `cloudflare.config.ts` — Worker name, custom domain, asset settings
- `wrangler.config.ts` — points the Worker's assets at `_site/`
- `index.html` — homepage: intro plus an icon-and-text list of projects
- `_projects/*.md` — one file per project; each renders at `/<slug>/` via `_layouts/project.html`. Front matter: `title`, `tagline`, `platform`, `order`, `icon`, `source`, `download`, `live`. To add a project, add a file here (and an icon in `assets/icons/` if it has one)
- `blog/index.html` — writing listing page (permalink: `/writing/`)

### Layouts & Templates

- `_layouts/default.html` — base HTML shell, includes `_includes/head.html`
- `_layouts/post.html` — blog post layout wrapping content in `<div id="content">`
- `_layouts/project.html` — project page: what it is, download, source
- `_layouts/image_page.html` — image-focused pages
- `_includes/head.html` — meta tags, OG tags, favicon links, stylesheet

### Content

- `_posts/` — blog posts (markdown with front matter)
- `_archive/` — older/retired posts

### Styling Conventions

- Tailwind utility classes in HTML templates
- Custom components defined in `css/site.css` using `@layer components` (e.g., `.product-card`, `.link`)
- Base content styles in `@layer base` scoped under `#content` (blog post typography)
- Body uses `font-serif` with max-width `650px`

## Voice & Tone

The site's voice is inspired by 37signals/Jason Fried, Derek Sivers, and Seth Godin:
- Short, punchy sentences. Opinionated and direct.
- Anti-bloat, pro-simplicity. Say what you believe, not just what you do.
- No corporate speak or buzzwords.

The focus is entirely on building products — no consulting or services language.

## Runtime Versions

Defined in `.tool-versions`: Node.js 26.12.1, Ruby 3.3.4
