# Counties Badminton — Shopify theme

Custom Shopify theme for Counties Badminton, built on [Shopify Horizon](https://github.com/Shopify/horizon) (v4.3.0).

## Requirements

- Node.js 22.12 or newer
- Access to the Counties Badminton Shopify store (staff/collaborator account), or a Theme Access password

The Shopify CLI is a project dependency, so you don't need a global install.

## Setup

```sh
git clone https://github.com/weareignition/counties-badminton.git
cd counties-badminton
git remote add upstream https://github.com/Shopify/horizon.git
npm install
```

The store (`countiesbadmintonproshop.myshopify.com`) is set in `shopify.theme.toml`.

## Local development

```sh
npm run dev
```

This uploads the theme to a private development theme on the store and serves a hot-reloading preview at http://127.0.0.1:9292. On first run the CLI opens a browser to log in to Shopify.

| Command | What it does |
| --- | --- |
| `npm run dev` | Local preview with hot reload |
| `npm run check` | Lint with Theme Check |
| `npm run pull` | Pull a theme from the store (prompts for which one) |
| `npm run push` | Push to a theme on the store (prompts for which one) |
| `npm run list` | List the store's themes |
| `npm run package` | Build a `.zip` for manual upload |

Pass extra CLI flags after `--`, for example `npm run dev -- --theme-editor-sync` to sync theme editor changes back to your local files.

### Logging in without a store account

Install the [Theme Access](https://apps.shopify.com/theme-access) app on the store, then export its password before running any command:

```sh
export SHOPIFY_CLI_THEME_TOKEN=shptka_...
export SHOPIFY_FLAG_STORE_PASSWORD=...   # only if the storefront is password protected
```

## Project structure

```
assets/      CSS, JS, images, fonts
blocks/      Theme blocks (Horizon builds most UI from these)
config/      settings_schema.json (theme settings) and settings_data.json (saved values)
layout/      theme.liquid and password.liquid
locales/     Translation strings
sections/    Sections
snippets/    Reusable Liquid partials
templates/   JSON page templates
```

Only those folders are uploaded to Shopify. Root files such as `package.json` stay local.

## Pulling in Horizon updates

This repo keeps Horizon's git history, so upstream releases merge in directly:

```sh
npm run upstream:update   # git fetch upstream && git merge upstream/main
```

Resolve any conflicts, run `npm run check`, and preview with `npm run dev` before pushing. Horizon's release notes are in `release-notes.md`.

To make updates easier, keep custom work in new files (for example `sections/cb-*.liquid` and `blocks/cb-*.liquid`) rather than editing Horizon's files where possible.

## Licence

Horizon is © Shopify Inc. and licensed for themes delivered directly to a merchant as part of a services engagement. A derived theme can't be sold, listed or redistributed. See [LICENSE.md](LICENSE.md).
