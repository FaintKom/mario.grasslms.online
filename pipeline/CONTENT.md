# Course Design Pipeline — Content Mapping

> *This is the canonical content-mapping document for the pipeline page. Published publicly for transparency — shows how I plan a multi-artefact intervention before I build it. Not the polished output (that lives on `/pipeline/`); this is the planning doc.*


**Goal:** interactive scrollytelling page demonstrating Mario's full course-design pipeline, grounded in real portfolio artefacts and named frameworks.

**Target use:** primary portfolio link for senior Instructional Designer / Learning Experience Designer / Sales Enablement ID applications.

**Style:** GrassLMS Lively v1 (green/sun/coral, Manrope + Geist Mono, press-buttons, sun-marker highlight).

---

## 4 Operating Principles (top strip)

1. **Start with the end** — backward design from learner behaviour, not content.
2. **Frameworks as tools, not religion** — pick ADDIE / SAM / 4C/ID per project context.
3. **AI as a multiplier** — own LMS, own pipelines, own automation.
4. **Measure beyond happy sheets** — Kirkpatrick L3+ or it didn't ship.

---

## 7 Pipeline Phases

### Phase 1 · DISCOVER (Needs Analysis)

| Slot | Content |
|---|---|
| **Eyebrow** | 01 · DISCOVER |
| **Headline** | Find the *real* problem before designing anything |
| **Methodologies (chips)** | Needs Analysis · Stakeholder Mapping · Learner Persona · SME Interviews · Listen → Map (Plata 30/60 framework) |
| **Real example** | BEAM Institute · Data Governance course — SME interviews with Billigence experts to define competency outcomes |
| **Existing portfolio artefact** | Lesson Review Toolkit (`collect_reviews.py` → `extract_content.py` → `normalize_items.py`) — needs/feedback collection pipeline |
| **New artefact needed** | Stakeholder interview script · Learner persona one-pager · Needs-assessment template |
| **Tools** | Notion · Miro · Google Docs · Sheets |
| **Deliverables shown** | Persona PDF · SME interview transcript sample · Stakeholder map (Miro export) |

---

### Phase 2 · DEFINE (Objectives + Outcomes)

| Slot | Content |
|---|---|
| **Eyebrow** | 02 · DEFINE |
| **Headline** | Turn business outcomes into *assessable* learner behaviours |
| **Methodologies (chips)** | Backward Design · Bloom's Taxonomy · Competency Mapping · Action Mapping (Cathy Moore) |
| **Real example** | Yandex Practicum — designed end-to-end UX / UI curriculum aligned with industry hiring requirements; coordinated cross-functional pipeline of designers, developers, reviewers |
| **Existing portfolio artefact** | `ai-course-for-ids` 4C/ID structure · `sat-math-pro` 4C/ID modules · `cs-course-9-11` 36-lesson outcomes |
| **New artefact needed** | Learning Objectives sheet template · Assessment blueprint (1-page) |
| **Tools** | Docs · Sheets · Miro |
| **Deliverables shown** | Objectives sheet (Bloom-coded) · Assessment blueprint mock |

---

### Phase 3 · DESIGN (Architecture)

| Slot | Content |
|---|---|
| **Eyebrow** | 03 · DESIGN |
| **Headline** | Pick the framework that fits the *project*, not the resumé |
| **Methodologies (chips)** | **ADDIE** · **SAM (Successive Approximation)** · **4C/ID (Four-Component ID)** · Merrill First Principles · Mayer Multimedia · Knowles Andragogy · 5 Moments of Need |
| **Why each, when** | ADDIE = compliance / scale · SAM = fast iteration / rapid prototyping · 4C/ID = complex cognitive skill (UX/UI, math, programming) |
| **Real example** | Algonova `cs-course-9-11` — 36-lesson narrative-driven curriculum with quest progression for kids 9–11 |
| **Existing portfolio artefact** | `ai-course-for-ids` (4C/ID) · `sat-math-pro` (4C/ID + widget pipeline) · `beam-course-site` (static site + course materials) |
| **New artefact needed** | Course blueprint template · Blended-learning mix diagram · "When to use which framework" decision matrix |
| **Tools** | Figma · Miro · Notion |
| **Deliverables shown** | Course blueprint PDF · Module map · Framework decision matrix |

---

### Phase 4 · DEVELOP (Production) — **KEY PHASE for Sales Enablement roles**

| Slot | Content |
|---|---|
| **Eyebrow** | 04 · DEVELOP |
| **Headline** | Author at speed without losing pedagogy |
| **Methodologies (chips)** | Authoring tools fluency · Microlearning · Worked-example fading · AI-assisted production · Mayer multimedia principles |
| **Real example** | Algonova presentation generator — JSON → branded deck, 2 h → 15 min per deck (60–85 % cut) |
| **Existing portfolio artefact** | `presentation-generator` · `miro-board-creator` · `math-slides` add-on · `sat-math-pro` widget generator (63 KB Python) · `teacher-autofill` (Flask + Tampermonkey) |
| **New artefacts needed** (Sales-Enablement-critical) | **Rise 360 sample** (6–8 screens, hosted) · **Storyline interaction** (objection-handling simulation) · **Facilitator guide PDF** (Sales Kickoff 90-min) · **Participant workbook** · **Job aid 1-pager** (Top-10 objections) · **Video script** + Vyond clip (optional) |
| **Tools** | Rise 360 · Articulate Storyline · Vyond · Adobe Captivate · Figma · Adobe Illustrator · Google Apps Script · Python |
| **Deliverables shown** | Embedded Rise iframe · Storyline preview · Facilitator guide PDF preview · Job aid card · Video poster |

---

### Phase 5 · DELIVER (Launch)

| Slot | Content |
|---|---|
| **Eyebrow** | 05 · DELIVER |
| **Headline** | Ship to the LMS, enable the facilitators, brief the learners |
| **Methodologies (chips)** | LMS deploy · Facilitator enablement · Launch comms · Pilot → Scale |
| **Real example** | `ai-course-for-ids` — `seed_course.py` logs into GrassLMS, creates course, uploads modules/lessons, publishes, enrolls test student via REST API |
| **Existing portfolio artefact** | **GrassLMS — full LMS built solo** (80+ features, 59 routes, FastAPI + Next.js 16) · `beam-course-site` GH Pages deploy |
| **New artefact needed** | Roll-out plan template · Launch comms checklist · Facilitator briefing one-pager |
| **Tools** | Sana · Moodle · GrassLMS · REST APIs · Slack / Email comms |
| **Deliverables shown** | LMS screenshot (GrassLMS course view) · Roll-out plan PDF · Comms checklist |

---

### Phase 6 · MEASURE (Evaluation)

| Slot | Content |
|---|---|
| **Eyebrow** | 06 · MEASURE |
| **Headline** | Beyond *happy sheets* — measure behaviour and business impact |
| **Methodologies (chips)** | **Kirkpatrick L1–L4** · Learning analytics · NPS · Drop-off analysis · A/B testing |
| **Real example** | Algonova **video-lesson analysis pipeline** — 25+ Python scripts (~4 700 LOC): Whisper transcription of recorded lessons, video frame extraction, Google Sheets / Drive aggregation, Excel pedagogical scoring reports — used to iterate on team-wide lesson quality based on a 500 MB dataset |
| **Existing portfolio artefact** | Lesson Review Toolkit (`collect_reviews.py` → `extract_content.py` → `normalize_items.py` → `apply_to_checklist.py`; normalized JSON issue DB, interactive HTML viewers) |
| **New artefact needed** | NPS / L1 survey template · L2 quiz analytics dashboard mock · L3 on-the-job rubric · L4 KPI dashboard mock · Kirkpatrick plan |
| **Tools** | LMS analytics · Lesson Review Toolkit · Sheets · Looker / Metabase |
| **Deliverables shown** | Kirkpatrick L1–L4 plan PDF · Drop-off heatmap (Lesson Review Toolkit) · NPS template |

---

### Phase 7 · ITERATE (Continuous Improvement)

| Slot | Content |
|---|---|
| **Eyebrow** | 07 · ITERATE |
| **Headline** | Treat the course like a product — version it, refresh it, kill what doesn't work |
| **Methodologies (chips)** | Continuous improvement · A/B testing · Content refresh cycles · Performance support (Mosher / Gottfredson 5 Moments of Need) |
| **Real example** | TripleTen (Nebius Group) — localized 15+ B2B courses for the Latin American market, adapting content to cultural and professional context · designed and implemented a cross-functional status tracking system that improved team visibility and reduced handoff delays |
| **Existing portfolio artefact** | Lesson Review Toolkit (collect → extract → normalize → apply pipeline) |
| **New artefact needed** | Iteration log template · Content refresh schedule · Performance support map |
| **Tools** | Sheets · Lesson Review Toolkit · A/B framework |
| **Deliverables shown** | Iteration log · Refresh schedule · Sample A/B card |

---

## Cross-cutting band: Frameworks I use (sticky chip strip)

ADDIE · SAM · 4C/ID · Backward Design · Bloom's Taxonomy · Action Mapping (Cathy Moore) · Merrill First Principles · Mayer Multimedia Principles · Knowles Andragogy · Kirkpatrick L1–L4 · 5 Moments of Need (Mosher) · Worked-example Fading · Microlearning · Sales Enablement (SiriusDecisions / Forrester)

---

## Cross-cutting band: Tools I author with

Rise 360 · Articulate Storyline · Adobe Captivate · Vyond · Figma · Adobe Illustrator · Notion · Miro · Google Workspace · Sana · Moodle · GrassLMS · Python · FastAPI · Next.js · Google Apps Script · Tampermonkey

---

## Footer CTA

- See full portfolio → `/` (main portfolio)
- Book a call → `/#contact`
- Download CV → `resume_en.pdf`

---

## Build sequence

| Order | Phase | Status |
|---|---|---|
| A1 | Content mapping (this file) | done |
| B1 | Framework explainer cards (markdown content) | next |
| C1 | Rise 360 sample (fintech B2B card onboarding demo) | parallel |
| C2 | Facilitator guide PDF | parallel |
| C3 | Job aid 1-pager | parallel |
| D1 | DS extraction → `portfolio/pipeline/index.html` skeleton | after B1 |
| D2 | Phase sections build + content paste | after D1 |
| D3 | GSAP scrollytelling + reveal animations | after D2 |
| D4 | Modal embeds (Rise iframe / PDF preview / images) | after C1–C3 |
| E1 | Fix SSL on `mario.grasslms.online` | parallel |
| E2 | Deploy fresh portfolio + pipeline | last |
| F1 | Cross-link main portfolio ↔ pipeline | last |
| G | Smoke test + Lighthouse + share | last |

---

## Open content questions (resolve before C1–C3 build)

1. **Rise 360 / Storyline seat** — есть активный? Если нет → 30-day trial или fallback H5P.
2. **Brand naming in demo** — use a specific target employer name (trademark / presumption risk) or generic «FinTech B2B card onboarding» with «demo, not affiliated» note? → resolved: generic.
3. **Application deadline** — fix a date to manage scope?
