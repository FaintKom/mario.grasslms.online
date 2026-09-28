#!/bin/sh
# Compiles the mini-case JSX sources into plain scripts the pages load.
# Edit case-*-app.jsx, then run: sh pipeline/mini-cases/build.sh
# React and ReactDOM come from ../_shared/vendor/ as globals.
set -e
cd "$(dirname "$0")"
for f in case-a-app case-b-app case-c-app; do
  npx --yes esbuild@0.24.2 "$f.jsx" --outfile="$f.js" \
    --format=iife --target=es2019 --minify --legal-comments=none \
    --jsx=transform --jsx-factory=React.createElement --jsx-fragment=React.Fragment
done
