# merimerimeri.com

[![CI](https://github.com/smeriwether/merimerimeri.com/actions/workflows/ci.yml/badge.svg)](https://github.com/smeriwether/merimerimeri.com/actions/workflows/ci.yml)

Personal site for Stephen Meriwether and MeriMeriMeri Software. Built with Jekyll 4.4, Liquid templates, Tailwind CSS 3, and PostCSS. Deployed to Cloudflare Pages.

See it live at [merimerimeri.com](https://merimerimeri.com).

## Development

Requires Ruby, Bundler, Node.js, and npm.

Runtime files in this repo:

- `.ruby-version`: Ruby 3.2.1
- `.nvmrc`: Node.js 20
- `.tool-versions`: Ruby 3.3.4 and Node.js 22.11.0 for mise/asdf users

GitHub Actions currently builds with Ruby 3.2.1 and Node.js 20. If changing runtime versions, update the version files and workflows together.

Install dependencies:

```bash
./bin/setup
```

The setup script installs Bundler if needed, then runs `bundle install` and `npm ci` when `package-lock.json` is present.

Run the local server:

```bash
bundle exec jekyll serve
```

The site runs at `http://localhost:4000`. Restart the server after changing `_config.yml`.

Build for production:

```bash
JEKYLL_ENV=production bundle exec jekyll build
```

The generated site is written to `_site/`.

## Site structure

- `index.html` - home page with project cards for active MeriMeriMeri Software products.
- `blog/index.html` - writing landing page at `/writing/`.
- `consulting/index.html` - consulting page at `/consulting/`.
- `_posts/` - active Jekyll posts.
- `_archive/` - older or retired posts.
- `_layouts/` and `_includes/` - shared Liquid templates.
- `css/site.css` - Tailwind imports plus custom component and content styles.
- `tailwind.config.js` and `postcss.config.js` - Tailwind and PostCSS configuration.

## CI

GitHub Actions runs a path-filtered build check for site-related pull requests and pushes to non-main branches. The workflow installs Ruby and Node dependencies, then runs:

```bash
bundle exec jekyll build
```

To run the same check locally:

```bash
bundle install && npm install
JEKYLL_ENV=production bundle exec jekyll build
```

## Deployment

Pushes to `main` with site-related changes trigger a separate GitHub Actions workflow that builds the Jekyll site and deploys `_site/` to the Cloudflare Pages project `merimerimeri`.

README-only changes are outside the deploy workflow's path filter.
