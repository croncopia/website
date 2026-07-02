# Croncopia

The Croncopia website, built with SvelteKit, Tailwind CSS, and Storybook, deployed to Cloudflare Workers.

## Developing

```sh
npm install
npm run dev
```

## Storybook

Components live in `src/lib/components`, each with a colocated `.stories.svelte` file:

```sh
npm run storybook
```

## Testing

Component tests run through the Storybook Vitest addon (Playwright, Chromium):

```sh
npx vitest run
```

## Building & deploying

```sh
npm run build     # production build
npm run preview   # build + wrangler dev
npm run deploy    # build + wrangler deploy
```
