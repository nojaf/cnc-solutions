#!/usr/bin/env bash
# Deploys the site by running the "Deploy website" GitHub Actions workflow,
# which builds src/client with Bun and publishes dist/ to GitHub Pages.
set -euo pipefail
gh workflow run deploy.yml --ref "${1:-master}"
