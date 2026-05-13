# mario.grasslms.online

Static portfolio site. Live at <https://mario.grasslms.online>.

## What

Single-page landing + 5 interactive capability demos:
- `index.html` — landing with 5 capability cards
- `block-a-lesson-generation.html` — AI lesson generation pipeline
- `block-b-lesson-review.html` — Lesson QA pipeline
- `block-c-interactive-exercises.html` — Interactive exercise formats
- `block-d-content-tools.html` — Instructional design tooling
- `block-e-knowledge-rag.html` — Knowledge RAG module (prototype)

All standalone HTML — Manrope + Geist Mono, design tokens inline, no
build step.

## Stack

- Static HTML / CSS / vanilla JS
- nginx:1.27-alpine container
- Reverse-proxied behind `lms-nginx-1` on the shared VPS (host port 8081)

## Local dev

Open `index.html` directly in browser, or:

```bash
python -m http.server 8094
# → http://localhost:8094
```

## Deploy

Production: <https://mario.grasslms.online>

Auto-deploys on push to `main` via `.github/workflows/deploy.yml`:
SSH → `/opt/mario-portfolio` → `git pull` → `docker compose up -d --build`.

Manual rebuild:

```bash
ssh root@204.168.165.41
cd /opt/mario-portfolio
git pull
docker compose up -d --build
```

## Structure

```
.
├── index.html               ← landing
├── block-*.html             ← capability demos
├── Dockerfile               ← nginx:alpine + HTML files
├── nginx.conf               ← container-internal nginx config
├── docker-compose.yml       ← container definition (port 8081)
└── .github/workflows/deploy.yml
```

## Notes

- SSL terminated upstream by `lms-nginx-1` (Let's Encrypt). Container speaks plain HTTP.
- Container exposes only `127.0.0.1:8081:80` — direct external access blocked.
- All demos are sanitized recreations. Production work under NDA.
