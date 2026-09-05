# Session contract for the Astro port

This folder is the Astro rewrite of the Gatsby site in
`/Users/nojaf/Projects/cnc-solutions/src/client`. Read `PORTING_GUIDE.md`
in full before touching any file. It is the source of truth for how Gatsby
markup and Bootstrap styles map to Astro and Tailwind.

## Dev servers

- Gatsby runs at http://localhost:8000 and Astro at http://localhost:4321.
- Both are already running. Never start, stop or restart either one, and
  never run `astro dev`, `gatsby develop`, `bun run dev` or similar.
- If a server does not respond, say so and stop. Do not try to fix it.

## Verifying a port

- Compare computed styles, not screenshots. Run
  `bun run compare --selector "<css>" --pages <paths>` or write a
  probe under `scripts/probes/` and pass it with `--probe`. Paste the
  resulting diff in your summary.
- Check every viewport the script covers by default: 375, 600, 800, 992
  and 1200. A component that is right at 375 and 1200 is not done.
- A shared component (`PageIntroduction`, `Header`, `Footer`,
  `Navigation`, anything in `global.css`) must be re-verified on every
  page that uses it after a change.

## Keep the guide current

- When the user corrects something, or a port surprises you, add the
  lesson to the "Lessons" section of `PORTING_GUIDE.md` in the same
  change. One or two lines: what was wrong, what is right.
- If a rule in the guide turns out to be unclear or contradicted by the
  code, fix the rule rather than working around it.

## Scope and git

- One page or component per session. Finish it, verify it, write the
  commit message with `/commit-msg`, and stop.
- Never commit or push. The user commits.
- Bun is the package manager (`bun.lock`). Use `bun add`, `bunx`.
