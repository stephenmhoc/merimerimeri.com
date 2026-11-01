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
- `tailwind.config.js` — custom colors (`primary: #FAFAFA`, `secondary: #F0F0F0`), purge paths
- `postcss.config.js` — PostCSS pipeline
- `cloudflare.config.ts` — Worker name, custom domain, asset settings
- `wrangler.config.ts` — points the Worker's assets at `_site/`
- `index.html` — homepage: intro plus an icon-and-text list of projects
- `_projects/*.md` — one file per project; each renders at `/<slug>/` via `_layouts/project.html`. Front matter: `title`, `tagline`, `tags` (platforms, e.g. `[macOS, iOS]`; they render as pills and drive the `/apps/` filter), `order`, `icon` (required), `source`, `download` (Mac DMG), `testflight` (iOS public link; hidden when empty), `screenshot` (or a `screenshots` list), `live`. The list on the homepage and `/apps/` is the shared `_includes/project-list.html`. To add a project, add a file here (and an icon in `assets/icons/` if it has one)
- `blog/index.html` — writing list + activity chart at `/blog/`; `blog/feed.xml` (Atom) and `blog/posts.json` (chart data) sit beside it. `/writing/` is a redirect stub.
- `_blog/*.html` — one file per post, **generated, don't edit by hand**. `bin/sync-blog` mirrors published posts from the private blog Ghost (tailnet-only) into `_blog/` and `assets/blog/`, then the result is committed and pushed so CI deploys it. Needs `GHOST_CONTENT_KEY` (or `GHOST_ADMIN_KEY_FILE`) and Tailscale access. The blog Ghost is empty for now (sports stays on Micro.blog, everything else lives in the journal); the Writing links hide until `_blog/` has posts. Posts tagged `#untitled` render as titleless notes. Write posts in Ghost, never here.

### SEO / AEO

- `_includes/head.html` builds title, description, canonical, Open Graph and Twitter tags from page front matter (`seo_title`, `description`, `image`; projects fall back to `tagline` and `/assets/og/<slug>.png`). `_includes/jsonld.html` adds JSON-LD (Person + WebSite on `/`, SoftwareApplication on projects, BlogPosting on posts).
- Each project needs `description` (one factual sentence: what it is, free, open source, platform) and `category` (a schema.org application category) in front matter.
- Share images live in `assets/og/`. After adding a project or changing a tagline, run `bin/make-og` (headless Chrome) and commit the PNGs.
- `sitemap.xml`, `robots.txt` and `llms.txt` are hand-written at the repo root and list projects (and blog posts once `_blog/` has any). `llms.txt` is the summary for AI crawlers.

### Layouts & Templates

- `_layouts/default.html` — base HTML shell, includes `_includes/head.html`
- `_layouts/post.html` — blog post layout wrapping content in `<div id="content">`
- `_layouts/project.html` — project page: what it is, download, source
- `_layouts/image_page.html` — image-focused pages
- `_includes/head.html` — meta tags, OG tags, favicon links, stylesheet

### Content

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
