# Design log — Needs Assessment Template

> Single-sheet kickoff worksheet. Triangulates stakeholder, SME, and learner inputs before any architecture decisions. Reusable across engagements. JD requirements closed: stakeholder communication, needs assessment, full lifecycle (front-end analysis), Phase 1 / Discover artefact.

---

## Open questions at start

- **Q1.** Form-based (fillable fields) or worksheet (free-form prompts)?
- **Q2.** One sheet or two? Risk of cramming.
- **Q3.** Domain-neutral or sales-flavoured? It's a template, not the FinTech workshop.

---

## References pulled

- **Cathy Moore — *Map It* (2017)** — performance-first questions ("what must the learner do?") before content questions.
- **Dana Robinson + Jim Robinson — *Performance Consulting* (3rd ed.)** — separate the business need, performance need, learner need, and learning-environment need.
- **Robert F. Mager — *Analyzing Performance Problems* (3rd ed.)** — root-cause vs symptom; not every gap is a training gap.
- **Connie Malamed — *eLearning Coach* needs-assessment patterns** — practical templates emphasising scope and out-of-scope clarity.
- **Allen Tough — *Adults' Learning Projects*** — learner-self-direction signal questions.

---

## 1 · Analyse

**Audience persona.** ID / LXD practitioner (me or a colleague) opening a new engagement. Senior enough to drive the kickoff conversation; needs a structured prompt list to keep stakeholders on rails.

**Performance context.** 30–60 minute kickoff conversation, often hybrid. Filled live during the call or in the 24 hours after. Becomes the source-of-truth document referenced through the whole project.

**Constraints.** Single A4 sheet (print-foldable). Domain-neutral so the same template works for sales enablement, technical onboarding, compliance, K-12. Filled by hand or in browser.

**Prior-art scan.** Most needs-assessment forms in the wild either (a) collect 30 fields and never get filled, or (b) skip the *business* outcome and go straight to *learning* objectives — guaranteed to produce a course nobody asked for. This template forces the business outcome first, then performance, then learning.

---

## 2 · Design

### 2a · ADDIE.Design

This artefact lives entirely inside ADDIE's **Analyse** phase. Picked the **Performance Consulting** framing (Robinson) over a pure ADDIE checklist because the Robinson 4-needs split (business / performance / learner / environment) is the strongest single ordering principle for kickoff.

### 2b · 4C/ID

Not applicable — this isn't a learning intervention.

### 2c · Kolb

Not applicable — this is a planning artefact.

### 2d · Kirkpatrick

L1–L4 captured as a section in the template (the *measurement-planning hook* during kickoff), not as an evaluation of the template itself.

### 2e · Modern LXD methods applied

- **Robinson 4-needs framing** as the section ordering: Business → Performance → Learner → Environment.
- **Cathy Moore Action Mapping** — the "What does success look like in observable behaviour?" prompt comes before any content prompt.
- **Mager root-cause** — "Have we ruled out non-training root causes?" framed as an explicit prompt.
- **Malamed scope discipline** — explicit "Out of scope" box. Half the value of a needs-assessment is the boundary it draws.

---

## 3 · Develop — build log

- **Decision: 9 sections, 1 page.** First sketch had 14 — too many for live-fill. Cut to 9 by merging persona + motivation into one block, and dropping "competitive landscape" (it's a sales / product question, not a learning one).
- **Decision: each section has 1–3 prompts, no free-form prose blocks.** Filled in 30 min, not 3 hours.
- **Decision: section 9 (Success indicators) seeds L1–L4 placeholders.** Forces the kickoff to surface measurement intent, even if vague at this stage.
- **Decision: domain-neutral copy.** Same template works for the FinTech B2B sales workshop as for the SAT Math Pro course.
- **Failure expected.** Stakeholders try to skip section 3 (performance gap). Mitigation: the section is the largest visual block on the page so it can't be glossed over.

---

## 4 · Implement

- **Files:** `index.html`, `style.css`, `design-log.md`.
- **Folder:** `portfolio/pipeline/artefacts/needs-assessment-template/`.
- **Print:** A4 portrait, one sheet. `@page` rules.
- **Reviewer flow:** open URL → print → fill by hand, or screen-share for live kickoff.

---

## 5 · Evaluate — metric plan

| Metric class | Target | How measured |
|---|---|---|
| **L1** | n/a (planning artefact) | n/a |
| **L2** | n/a | n/a |
| **L3** | Stakeholder reports template filled in ≤30 min for ≥80 % of kickoffs | Self-report tally in project log |
| **L4** | Projects using this template are less likely to scope-creep mid-build (anecdotal target) | Project-retro tally |
| **Engagement** | Adoption: used at every new engagement kickoff (target 100 %) | Project log |
| **Authoring quality** | ≤1 wording error reported per quarter; refresh ≤180 days | Issue log |

---

## 6 · Reflect

**What worked**
- Robinson 4-needs ordering is the right opener — business outcome first, learner persona last.
- Explicit "Out of scope" box catches half the scope drift before it starts.
- Sections 8 + 9 (constraints + success indicators) seed the design decisions made later.

**What broke / surprised**
- "Is this actually a training problem?" prompt (Mager) feels confrontational on live kickoff. Softened wording to "Have we ruled out non-training root causes?".

**What I would change next iteration**
- Side B: a 7-question SME-only interview script for a follow-up call.
- Digital version with auto-save to a project Notion doc.

**Open questions for stakeholder**
- Should we add an explicit DEI / accessibility prompt? Probably yes for any cohort > 50 learners.

---

## QC scoreline

```
QC: F=5 JD=5 P=5 S=5 V=- D=5 | (V scored after preview)
Closes JD must-haves: stakeholder communication + needs assessment · full lifecycle (front-end analysis) · adult-learning principles
```
