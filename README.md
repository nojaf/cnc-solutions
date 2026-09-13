# CNC Solutions

## Combining Umbraco with Astro

- Umbraco instance (on Azure) for content management
- Code in `src/server` exposes the data from Umbraco via http / websockets
- Code in `src/client` captures this in an Astro project to create a statically generated website

## Client

```sh
cd src/client
bun install
bun run dev      # http://localhost:4321
bun run build    # writes dist/
```

## Deploying

The site is hosted on GitHub Pages at cncsolutions.be. Run the "Deploy website"
workflow from the Actions tab, or `./publish.sh` (needs the `gh` CLI). It builds
`src/client` with Bun and uploads `dist/`. CI (`build.yml`) runs
`astro check` and a build on every push and pull request to `master`.
