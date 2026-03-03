#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

npm install
VITE_API_BASE_URL="${VITE_API_BASE_URL:-http://localhost:8000}" npm run dev
