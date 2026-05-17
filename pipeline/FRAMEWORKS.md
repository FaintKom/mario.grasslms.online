# Framework Explainer Cards — B1 output

14 cards, one per framework named on the pipeline page.
Each card = standalone source-of-truth for the chip + tooltip + section copy.

**Per-card QC:** F (factual) and P (pedagogical) scored here. JD / Self-evident / Visual / Density scored at page-build time.

---

### 01 · ADDIE

**Author:** US military / Florida State University · **Year:** 1975
**One line:** Five linear phases — Analyse, Design, Develop, Implement, Evaluate — done in order.
**When:** compliance-heavy, regulated, or large-cohort content where requirements are stable.
**Avoid:** fast-moving products where requirements shift mid-build.
**Used in my work:** **BEAM Institute of Technology · Data Governance course** — needs analysis with Billigence SMEs → curriculum architecture → content development → quality review. Full cycle ADDIE because the regulatory content demanded sign-off at every phase.

QC: F=5 P=5

---

### 02 · SAM (Successive Approximation Model)

**Author:** Michael Allen · **Year:** 2012
**One line:** Short iterative cycles of prototype → review → revise; preparation phase up front, then SAM iterations until ship.
**When:** rapid prototyping, agile teams, content that needs early learner feedback.
**Avoid:** stakeholders who can only review one final version.
**Used in my work:** **GrassLMS** — built iteratively over 2025–2026 as solo dev. 80+ features, 9 lesson types, 11 exercise formats added in SAM-style short cycles; every feature prototyped end-to-end before scaling.

QC: F=5 P=5

---

### 03 · 4C/ID — Four-Component Instructional Design

**Author:** Jeroen van Merriënboer · **Year:** original 1997, *Ten Steps* 2007
**One line:** Four interlocking components — **learning tasks · supportive info · procedural info · part-task practice** — for whole-task complex cognitive skill.
**When:** roles requiring transfer of complex cognitive skill (analyst, designer, developer, problem-solver).
**Avoid:** rote knowledge or single-step procedures (over-engineered).
**Used in my work:** **GrassLMS 4C/ID course generator script** — automatically transforms raw course content into 4C/ID-formatted curriculum. Also `ai-course-for-ids` (course for instructional designers on AI) and `sat-math-pro` (SAT Math prep) both built on 4C/ID structure.

QC: F=5 P=5

---

### 04 · Backward Design

**Author:** Grant Wiggins + Jay McTighe · **Year:** 1998 (*Understanding by Design*)
**One line:** Start from desired learner outcomes → assessment evidence → learning experiences. Design backwards.
**When:** every project starting point, regardless of which delivery framework follows.
**Avoid:** never avoid — it is foundational.
**Used in my work:** **Yandex Practicum · UX / UI program** — designed end-to-end curriculum aligned with industry hiring requirements; began from "what should a UX / UI hire be able to do on day one" and worked backwards through assessments to lesson architecture.

QC: F=5 P=5

---

### 05 · Bloom's Taxonomy (revised)

**Author:** Lorin Anderson + David Krathwohl · **Year:** 2001 (revision of Bloom 1956)
**One line:** Six cognitive levels — **remember · understand · apply · analyse · evaluate · create** — for calibrating learning objectives verb-by-verb.
**When:** writing assessable learning objectives, picking the right exercise format per level.
**Avoid:** treating levels as strict hierarchy in adult expert learners (Bloom himself flagged this).
**Used in my work:** **GrassLMS — 11 interactive exercise formats** mapped to Bloom levels: quiz / matching = remember-understand, code editor + math interactives = apply-analyse, 3D exploration worlds + open assignments = evaluate-create.

QC: F=5 P=5

---

### 06 · Action Mapping

**Author:** Cathy Moore · **Year:** 2008+ (*Map It*, 2017)
**One line:** Start from the on-the-job action the learner must take; strip every piece of content that doesn't connect to that action.
**When:** content bloat is killing engagement; SME wants to "include everything"; performance > knowledge.
**Avoid:** purely informational / awareness content with no behavioural target.
**Used in my work:** **TripleTen (Nebius Group) — LATAM B2B localization** — adapted 15+ courses by cutting culturally non-portable scenarios and rewriting examples to LATAM business actions, keeping the on-the-job behaviour as the anchor.

QC: F=5 P=5

---

### 07 · Merrill First Principles of Instruction

**Author:** M. David Merrill · **Year:** 2002
**One line:** Effective lessons share five principles — **problem-centred · activation of prior knowledge · demonstration · application · integration into real life**.
**When:** designing any single lesson; structural checklist for lesson quality.
**Avoid:** abstract-only content with no real-world problem.
**Used in my work:** **Algonova · 36-lesson computer literacy course (ages 9–11)** — every lesson opens with an in-story problem; learners activate prior episodes, watch a character demonstrate, then apply via interactive program simulators, then integrate through quest progression.

QC: F=5 P=5

---

### 08 · Mayer Multimedia Principles

**Author:** Richard E. Mayer · **Year:** cognitive theory of multimedia learning, 2001+
**One line:** Twelve principles for visual + narration design — coherence · signalling · redundancy · spatial / temporal contiguity · segmenting · pre-training · modality · multimedia · personalisation · voice · image · embodiment.
**When:** designing e-learning, slide decks, narrated video, any media that pairs words and pictures.
**Avoid:** as nothing (cognitive load principles apply universally to multimedia).
**Used in my work:** **Algonova · presentation generator** — Python tool that converts JSON lesson content into branded decks following coherence + signalling + redundancy principles (no decorative chrome, headers signal structure, narration drives the slide). Cut slide creation from 2 hours to 15 minutes per deck.

QC: F=5 P=5

---

### 09 · Knowles Andragogy

**Author:** Malcolm Knowles · **Year:** 1968+ andragogy work; codified in *The Modern Practice of Adult Education* (1970)
**One line:** Adults learn best when content is problem-centred · relevant to their role · respects their experience · supports self-direction · explains the why.
**When:** any adult learner audience, especially professionals.
**Avoid:** K–12 pedagogy by default (children need different scaffolding).
**Used in my work:** **BEAM Institute · Data Governance course** — adult data professionals; content anchored in their day-to-day governance decisions, SME-validated scenarios, learner-paced rather than lock-step, with explicit "why this matters in your role" framing.

QC: F=5 P=5

---

### 10 · Kirkpatrick Four Levels

**Author:** Donald Kirkpatrick · **Year:** 1959 (*New World Kirkpatrick Model* with Jim & Wendy Kirkpatrick, 2016)
**One line:** Evaluate at four levels — **L1 reaction · L2 learning · L3 behaviour · L4 results** — and design measurement backwards from L4.
**When:** every training program that claims business impact.
**Avoid:** stopping at L1 happy sheets (most common L&D failure).
**Used in my work:** **Algonova · video-lesson analysis pipeline** — 25+ Python scripts (~4 700 LOC) using Whisper transcription, video frame extraction, Google Sheets / Drive aggregation, and Excel pedagogical scoring reports. L2 (lesson quality score) + L3 (team-wide instructor behaviour change) measured on a 500 MB dataset.

QC: F=5 P=5

---

### 11 · 5 Moments of Need

**Author:** Bob Mosher + Conrad Gottfredson · **Year:** 2012 (*Innovative Performance Support*)
**One line:** Learners need help at five moments — **New · More · Apply · Solve · Change** — and the last three are performance support, not training.
**When:** designing job aids, in-flow help, performance support layers.
**Avoid:** treating every "Apply" or "Solve" moment as a formal training need.
**Used in my work:** **Lesson Review Toolkit** (Python pipeline + interactive HTML viewers) — supports the "Solve" moment for instructors reviewing student work: normalised JSON issue database lets reviewers pull a relevant past case at the moment of need rather than re-derive judgement.

QC: F=5 P=5

---

### 12 · Worked-example fading (Cognitive Load Theory)

**Author:** John Sweller + Alexander Renkl (CLT lineage) · **Year:** 1980s–2000s
**One line:** Procedural skill is best learned by reading a complete worked example, then partial examples, then bare problems — fading scaffolding as schema forms.
**When:** procedural / algorithmic / formula-based skills; novice → intermediate transition.
**Avoid:** ill-defined open creative tasks (no single correct procedure).
**Used in my work:** **`sat-math-pro` widget generator** — Python tool that generates interactive Desmos / graph / formula widgets per task. Course structure (4C/ID + Heart of Algebra starter) sequences fully worked examples → partial scaffolds → bare problems across 675 KB of generated content.

QC: F=5 P=5

---

### 13 · Microlearning

**Author:** general practice (no single attribution; Hug 2005 popularised the term)
**One line:** Short, single-objective bursts (3–7 min) spaced over time; aligns with spacing-effect research.
**When:** mobile-first audiences, refresher content, just-in-time onboarding.
**Avoid:** complex whole-task skills that need extended practice cycles.
**Used in my work:** **GrassLMS · 9 lesson types** designed for single-objective bursts; lessons author one outcome at a time and pair with the gradebook for spaced retrieval.

QC: F=5 P=5

---

### 14 · Sales Enablement model

**Author:** Forrester (post-SiriusDecisions acquisition) · **Year:** 2010s contemporary
**One line:** Equip sales reps with **content · training · coaching · tools** mapped to buyer-journey stages and competency milestones.
**When:** B2B sales rep onboarding + ongoing competency programs.
**Avoid:** generic "product training" with no buyer-stage mapping.
**Used in my work:** **FinTech B2B Card Onboarding — sample artefact built for this pipeline page** (Phase 4 deliverable). Covers a sales kickoff workshop with facilitator guide, participant workbook, SCORM-packaged microlearning module, and an objection-handling job aid — a stand-in for the role I'm pitching for.

QC: F=5 P=5

---

## Cross-card validation

- **Attributions** locked against `QUALITY.md` reference table. All 14 match.
- **"Used in my work"** examples — fact-checked against `resume_en.md` + `portfolio/index.html` PROJECTS:
  - 01 BEAM Data Governance → resume L80–82 ✅
  - 02 GrassLMS solo build → resume L24–35 ✅
  - 03 GrassLMS 4C/ID generator → resume L35; `ai-course-for-ids` portfolio L2528–2547; `sat-math-pro` portfolio L2741–2760 ✅
  - 04 Yandex UX / UI → resume L94–98 ✅
  - 05 GrassLMS 11 exercise formats → resume L31 ✅
  - 06 TripleTen 15+ B2B LATAM → resume L87 ✅
  - 07 Algonova 36-lesson course → resume L52 ✅
  - 08 Algonova presentation generator → resume L57 ✅
  - 09 BEAM adult professionals → resume L80–82 + adult-learner inference ✅
  - 10 Algonova video-lesson analysis pipeline → resume L60 ✅
  - 11 Lesson Review Toolkit → portfolio L2567–2583 ✅
  - 12 `sat-math-pro` widget generator → portfolio L2741–2760 ✅
  - 13 GrassLMS 9 lesson types → resume L31 ✅
  - 14 FinTech B2B card onboarding → to-build artefact (Phase 4 C-block); flagged as built-for-page, not restating fact

- **Restricted companies / NDA projects:** none referenced.
- **Numeric claims:** every number above traces to resume or portfolio file.

## JD coverage tally after B1

Frameworks chip strip alone closes the target-role JD requirement **"adult learning principles + ID methodologies in remote-first orgs"** (4 cards alone — Knowles, ADDIE, SAM, 4C/ID — make the case).
