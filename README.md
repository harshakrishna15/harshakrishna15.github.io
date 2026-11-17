# harshakrishna15.github.io

The portfolio uses Astro and Node 24.

```sh
npm ci
npm run dev
npm run check
npm run build
```

Edit the email in `src/data/site.ts`. Projects live in `src/data/projects.ts` and papers in `papers/papers.json`. Keep entry IDs stable so existing links continue to work.

In the repository’s **Settings → Pages**, select **GitHub Actions** as the publishing source. The workflow checks pull requests and publishes the build from `main`.
