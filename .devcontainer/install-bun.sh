#!/usr/bin/env bash
# Installs Bun, which start.sh needs and the base images do not ship.
set -euo pipefail

# The Bun install script unpacks a zip archive.
if ! command -v unzip > /dev/null; then
  sudo apt-get update
  sudo apt-get install -y --no-install-recommends unzip
  sudo rm -rf /var/lib/apt/lists/*
fi

curl -fsSL https://bun.sh/install | bash

"$HOME/.bun/bin/bun" --version
