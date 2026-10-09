#!/bin/sh
# dev server for local screenshots (Vite replaces this in real use)
cd "$(dirname "$0")/.." && (python3 -m http.server 5173 >/tmp/srv.log 2>&1 &) ; sleep 1
