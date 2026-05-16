# Demo-Artefact Production Cycle

**Applies to:** every demo material in `portfolio/pipeline/artefacts/` — assignments, cases, SCORM / xAPI modules, facilitator guides, job aids, evaluation plans.

**Purpose:** make every demo defensible against any ID interview question. Each artefact ships with a `design-log.md` showing the framework application — the *process* is part of the proof.

---

## Required cycle per artefact

Each demo runs through a full **ADDIE** loop, with named framework application at each phase. Skipping a phase = blocking the ship.

```
┌───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐
│  Analyse  │──>│  Design   │──>│  Develop  │──>│ Implement │──>│ Evaluate  │
└───────────┘   └───────────┘   └───────────┘   └───────────┘   └───────────┘
        ▲                                                                  │
        └──────────────────────── Reflect ─────────────────────────────────┘
```

---

## Phase 1 · Analyse

- **Audience persona** — role, prior knowledge, motivation, constraints (time, device, language).
- **Performance context** — where the learning will be applied (call, deal, support ticket, code review, etc.).
- **Constraints** — budget, time, tooling, compliance, brand.
- **Prior-art scan** — what already exists in the org or in the public domain; what's the gap; what's worth borrowing.
- **Karpathy-style research log** — open questions stated, references pulled, decisions reasoned in text.

**Output of phase:** short brief inside `design-log.md` section `## 1 · Analyse`.

---

## Phase 2 · Design — apply 5 frameworks visibly

### 2a · ADDIE.Design

Pick the structural model and justify why over the alternatives:
- ADDIE (linear, compliance-friendly)
- SAM (iterative, agile)
- 4C/ID (whole-task, complex cognitive)

### 2b · 4C/ID architecture

Map the artefact to the four components (van Merriënboer):

| Component | What it is | In this artefact |
|---|---|---|
| **Learning Tasks** | Whole-task practice ordered easy → hard | (specify) |
| **Supportive Information** | Why / when knowledge — read before/with the task | (specify) |
| **Procedural Information** | How-to steps — given at moment of application | (specify) |
| **Part-task Practice** | Drill of single sub-skill until automatic | (specify) |

### 2c · Kolb experiential cycle

Map at least one full Kolb loop:

| Kolb stage | In this artefact |
|---|---|
| **Concrete Experience** | (what the learner directly does) |
| **Reflective Observation** | (where they review / debrief) |
| **Abstract Conceptualisation** | (where the model is named / explained) |
| **Active Experimentation** | (where they apply in a new context) |

### 2d · Kirkpatrick measurement plan — reverse from L4

Decide measurement *before* developing:

| Level | What it measures | Instrument in this artefact |
|---|---|---|
| **L4 — Results** | Business outcome | (target metric + source) |
| **L3 — Behaviour** | On-the-job application | (rubric / observation / system telemetry) |
| **L2 — Learning** | Knowledge / skill gained | (quiz / scenario / artefact submission) |
| **L1 — Reaction** | Learner perception | (post-survey / NPS / micro-pulse) |

### 2e · Modern LXD frameworks to reference where applicable

Pull at least one explicitly per artefact:

- **Action Mapping** (Cathy Moore) — anchor every element on a behaviour
- **Worked-example fading** (Sweller / Renkl) — procedural-skill scaffolding
- **5 Moments of Need** (Mosher / Gottfredson) — performance support layer
- **Mayer multimedia principles** — visual + narration design
- **Scenario-based learning** (Sabramowicz / Dirksen) — situated practice
- **70-20-10** (Charles Jennings) — formal / social / experiential mix decision
- **Microlearning** + **spacing effect** — cadence design
- **LX Design Canvas** — one-page intent capture
- **Performance consulting** (Jeppe Hansgaard, Dana Robinson) — outcome-first framing

---

## Phase 3 · Develop

Build log:
- What was built, file-by-file
- Decision points with reasoning (why this exercise type, why this interaction, why this length)
- Failures / dead ends, what we learned, what we changed
- Code / asset choices (e.g. SCORM 1.2 vs xAPI vs vanilla HTML)

**Format:** chronological, reasoning explicit. Karpathy nanoGPT-style — no glossing.

---

## Phase 4 · Implement

- Deployment shape (standalone / SCORM package / LMS hosted)
- File layout
- LMS compatibility checklist (manifest, API discovery, status / score reporting)
- Standalone fallback behaviour (localStorage, etc.)
- How a reviewer opens it without an LMS

---

## Phase 5 · Evaluate

| Metric class | Target | How measured |
|---|---|---|
| **L1 — Reaction** | (e.g. ≥4.2/5 satisfaction, NPS ≥30) | (post-module 3-Q micro-pulse, embedded) |
| **L2 — Learning** | (e.g. quiz mastery 80 %, retention 70 % at 7d) | (SCORM quiz, spaced retrieval mini-quiz at +7d) |
| **L3 — Behaviour** | (e.g. talk-track adherence ≥80 %, sales-call rubric) | (call recording rubric, manager observation form) |
| **L4 — Results** | (e.g. ramp time reduction 25 %, win-rate +5 pts on SMB segment) | (CRM data, ramp metric source) |
| **Engagement** | completion ≥85 %, mean time on module ±20 % of design, interaction count per learner ≥N | (LMS telemetry / xAPI statements) |
| **Authoring quality** | content error rate <2 %, refresh cycle ≤90 days | (review pipeline + issue log) |

**Targets are stated even if unmeasured in this portfolio context** — that itself is part of the demo (showing how I would measure if shipped at scale).

---

## Phase 6 · Reflect

- What worked
- What broke / surprised
- What I would change next iteration
- Open questions for stakeholder

---

## Karpathy-style log format

Every `design-log.md` follows this transparent-reasoning structure:

```
# Design log — [artefact name]

> One-line summary. JD requirement closed: [requirement].

## Open questions at start
- Q1: …
- Q2: …

## References pulled
- [author/source] — [why relevant]
- [author/source] — [why relevant]

## 1 · Analyse
…

## 2 · Design
### 2a ADDIE.Design — pick
…
### 2b 4C/ID architecture
…
### 2c Kolb cycle mapping
…
### 2d Kirkpatrick reverse from L4
…
### 2e Modern LXD methods applied
…

## 3 · Develop — build log
- Decision: chose X over Y because …
- Failure: tried Z, broke because …
- Reverted to …

## 4 · Implement
…

## 5 · Evaluate — metric plan
…

## 6 · Reflect
…

## QC scoreline
F=… JD=… P=… S=… V=… D=… | Closes JD: […]
```

---

## Gate update

The shipping gate from `QUALITY.md` now requires:

- Existing 6-dim QC rubric ≥ ship gate
- **PLUS** a complete `design-log.md` next to the artefact, with all 6 phases populated and at least one modern LXD method named per artefact
- **PLUS** Kirkpatrick L4 → L1 measurement plan stated (targets allowed to be qualitative if no production telemetry available)
- **PLUS** failures honestly logged in Phase 3 (not just successes)

Without all three, the artefact does not ship to the pipeline page.
