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

- Static HTML / CSS / vanilla JS — no build step
- Hosted on GitHub Pages
- Custom domain: `mario.grasslms.online` (per `CNAME`)
- HTTPS via Let's Encrypt (provisioned by GitHub Pages)

## Local dev

Open `index.html` directly in browser, or:

```bash
python -m http.server 8094
# → http://localhost:8094
```

## Deploy

Production: <https://mario.grasslms.online>

Pushes to `main` auto-publish via GitHub Pages (no Actions workflow,
no servers). Typical propagation: 30–90 seconds after push.

## Structure

```
.
├── index.html               ← landing
├── block-*.html             ← 5 capability demo pages
├── CNAME                    ← custom domain config for Pages
├── README.md
└── .gitignore
```

## Notes

- All demos are sanitized recreations. Production work under NDA.
- DNS: `mario.grasslms.online` CNAME → `faintkom.github.io`.
