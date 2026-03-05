#!/usr/bin/env bash
set -euo pipefail

# Package the extension for Chrome and Firefox with the new name

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
cd "$ROOT_DIR"

NAME="xyhelper-login"

# Extract version from manifest.json without jq
VERSION=$(grep -oE '"version"\s*:\s*"[^"]+"' manifest.json | sed -E 's/.*"([^"]+)".*/\1/')
if [[ -z "${VERSION:-}" ]]; then
  echo "Failed to read version from manifest.json" >&2
  exit 1
fi

OUT_DIR="dist"
mkdir -p "$OUT_DIR"

CHROME_ZIP="$OUT_DIR/${NAME}-v${VERSION}-chrome.zip"
FIREFOX_ZIP="$OUT_DIR/${NAME}-v${VERSION}-firefox.zip"

echo "Packing Chrome build (MV3) -> $CHROME_ZIP"
rm -f "$CHROME_ZIP"
zip -r "$CHROME_ZIP" . \
  -x "dist/*" \
  -x ".git/*" \
  -x "scripts/*" \
  -x "manifest.firefox.json" \
  -x "*.DS_Store"

echo "Packing Firefox build (MV2) -> $FIREFOX_ZIP"
rm -f "$FIREFOX_ZIP"
TMP_DIR=$(mktemp -d)
cp -R . "$TMP_DIR/" >/dev/null 2>&1 || true
rm -rf "$TMP_DIR/.git" "$TMP_DIR/dist" "$TMP_DIR/scripts"
cp "$TMP_DIR/manifest.firefox.json" "$TMP_DIR/manifest.json"
rm -f "$TMP_DIR/manifest.firefox.json"
cd "$TMP_DIR"
zip -r "$OLDPWD/$FIREFOX_ZIP" . -x "*.DS_Store"
cd "$OLDPWD"
rm -rf "$TMP_DIR"

echo "Done. Files created:"
ls -lh "$CHROME_ZIP" "$FIREFOX_ZIP"
