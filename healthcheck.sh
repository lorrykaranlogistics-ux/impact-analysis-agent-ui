#!/usr/bin/env bash
set -euo pipefail

check() {
  local url="$1"
  if curl -fsS "$url" >/dev/null; then
    echo "OK   ui -> $url"
    return 0
  fi
  return 1
}

check "http://localhost:5000/health" || check "http://localhost:5173" || {
  echo "FAIL ui -> http://localhost:5000/health or http://localhost:5173"
  exit 1
}
