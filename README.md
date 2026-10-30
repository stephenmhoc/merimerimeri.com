# merimerimeri.com

[![CI](https://github.com/smeriwether/merimerimeri.com/actions/workflows/ci.yml/badge.svg)](https://github.com/smeriwether/merimerimeri.com/actions/workflows/ci.yml)

Personal site for Stephen Meriwether and MeriMeriMeri Software. Built with Jekyll 4.4, Liquid templates, Tailwind CSS 3, and PostCSS. Deployed to Cloudflare Workers with the `cf` CLI.

See it live at [merimerimeri.com](https://merimerimeri.com).

## Development

Requires Ruby, Bundler, Node.js, and npm.

Runtime files in this repo:

- `.ruby-version`: Ruby 3.2.1
- `.nvmrc`: Node.js 26
- `.tool-versions`: Ruby 3.3.4 and Node.js 26.12.1 for mise/asdf users

GitHub Actions currently builds with the latest Ruby 3.2 and Node.js 26. The `cf` CLI needs Node.js 22.23+, 24.22+, or 26.12+. If changing runtime versions, update the version files and workflows together.

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

The site is a static-assets Cloudflare Worker (`merimerimeri-com`), deployed with the [`cf` CLI](https://developers.cloudflare.com/cf/). Don't use `wrangler pages deploy`; the old Pages project is retired.

- `cloudflare.config.ts` - Worker name, custom domain, and asset settings (404 page).
- `wrangler.config.ts` - points the asset build at `_site/`.

Deploy from your machine:

```bash
npx cf auth login   # once
JEKYLL_ENV=production bundle exec jekyll build
npx cf deploy
```

`cf deploy` uploads whatever is in `_site/`, so always build first. `npm run deploy` runs `cf deploy` too.

Pushes to `main` with site-related changes also trigger a GitHub Actions workflow that builds the site and runs `cf deploy`. It needs the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repo secrets; the token needs Workers Scripts edit access on the account.

README-only changes are outside the deploy workflow's path filter.
