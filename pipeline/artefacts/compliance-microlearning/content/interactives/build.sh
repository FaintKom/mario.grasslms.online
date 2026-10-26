#!/bin/sh
# Compiles the Unit 1 JSX sources into plain scripts the pages load, so no
# JSX is compiled in the browser. Edit the .jsx under src/, then run:
#   sh pipeline/artefacts/compliance-microlearning/content/interactives/build.sh
# React and ReactDOM come from pipeline/_shared/vendor/ as globals.
set -e
cd "$(dirname "$0")"
build() {
  npx --yes esbuild@0.24.2 "$1" --outfile="$2" \
    --format=iife --target=es2019 --minify --legal-comments=none \
    --jsx=transform --jsx-factory=React.createElement --jsx-fragment=React.Fragment
}
build src/u1-inbox-simulator.jsx u1-inbox-simulator.js
# The film engine sets its components on window; the film reads them from there.
build v1-would-you-click/src/engine.jsx v1-would-you-click/film-engine.js
build v1-would-you-click/src/film.jsx v1-would-you-click/film.js
