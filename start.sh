#!/usr/bin/env bash
# Starts the Astro dev server on http://localhost:4321.
set -euo pipefail
cd "$(dirname "$0")/src/client"
bun install
bun run dev
