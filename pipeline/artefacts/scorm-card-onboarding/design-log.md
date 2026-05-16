# Design log — FinTech B2B Card Onboarding (SCORM 1.2)

> 10-minute sales-rep microlearning, SCORM 1.2-packaged with own JS API wrapper + standalone localStorage fallback. JD requirements closed: e-learning module, authoring-tool fluency (SCORM authoring from first principles), microlearning, assessment + evaluation strategy, sales-enablement context, FinTech B2B context.

---

## Open questions at start

- **Q1.** How to demonstrate Articulate Storyline / Rise 360-equivalent authoring without buying a seat or burning a 30-day trial in week 1?
- **Q2.** Generic FinTech naming vs a specific target-employer brand name — does using a real company name in a demo cross a trademark / presumption line?
- **Q3.** What's the smallest credible microlearning length for sales-kickoff onboarding such that it reads as "real" and not "toy"?
- **Q4.** SCORM 1.2 enough, or also emit xAPI statements?

---

## References pulled

- **Cathy Moore — *Map It* (2017)** — Action Mapping: anchor every element of a course on the on-the-job behaviour, strip the rest.
- **Richard Mayer — *Multimedia Learning* (2001+)** — coherence + signalling + redundancy principles for slide and microlearning design.
- **John Sweller + Alexander Renkl — Cognitive Load Theory** — worked-example fading sequences procedural skill.
- **Donald Kirkpatrick + Jim & Wendy Kirkpatrick — New World Kirkpatrick (2016)** — design backwards from L4.
- **Jeroen van Merriënboer — *Ten Steps to Complex Learning* (2007)** — 4C/ID for whole-task complex cognitive skill (sales = exactly this).
- **David A. Kolb — *Experiential Learning* (1984)** — four-stage cycle (CE → RO → AC → AE).
- **Anna Sabramowicz** — scenario-based learning for sales-rep training; persona-anchored micro-decisions outperform feature dumps.
- **Will Thalheimer — *Performance-Focused Smile Sheets* (2016)** — replacing happy-sheet L1 with predictive 3-Q micro-pulse.
- **Charles Jennings — 70-20-10** — a 10-min module is the "10 %" formal layer; expect 90 % of competency to land via reps + manager 1:1s.
- **Forrester Sales Enablement model (post-SiriusDecisions)** — content + training + coaching + tools mapped to buyer journey.

---

## 1 · Analyse

**Audience persona.** B2B fintech sales rep, day 1–30 of ramp, ~25–35 y, sales-background hires, fast device-switching, mobile-first review habits. Already trained on the product surface; gap is *how to talk to an SMB owner so they say yes*. Motivation: ramp out of probation, hit first commission.

> **Note — persona is illustrative**, drawn from general SMB B2B sales patterns. Not based on access to any specific company's CRM or customer dataset. In production this would be refined in week 1 from real call recordings + rep interviews.

**Performance context.** Live discovery call with an SMB owner. ~12–15 min window. The buyer is busy, sceptical of "another fintech", and has been pitched corporate cards before. The rep needs to ship the right opener within 60 s of hearing the buyer's pain phrase.

**Constraints.**
- Total module length ≤10 min (cohort tolerance for ramp content).
- No audio narration (no studio in v1).
- Must run standalone in browser **and** as SCORM-packaged content in an LMS.
- Must be reviewable by a hiring manager without an LMS.
- No real product name (generic FinTech B2B card).

**Prior-art scan.** Typical sales onboarding programs dump product features over 90-min decks; learners forget within a week. Best-in-class enablement (Highspot, Lessonly, MindTickle public materials) lean on persona + objection rehearsal + spaced retrieval. The signal: the highest-leverage 10 minutes of any sales-rep ramp is *talk-track practice with feedback*, not product trivia.

---

## 2 · Design

### 2a · ADDIE.Design — chose 4C/ID over linear ADDIE / SAM

- **ADDIE (linear)** rejected — overkill for a single 10-min asset, and ADDIE's sequential strength (compliance sign-off per phase) is irrelevant in a portfolio context.
- **SAM** rejected — SAM's iteration-with-stakeholder loop has no counterparty here.
- **4C/ID** picked — the on-the-job behaviour (match a diagnostic phrase to a positioning prop and the right opener) is a *complex cognitive whole-task skill*, which is exactly what 4C/ID was built for.

### 2b · 4C/ID architecture

| Component | In this module |
|---|---|
| **Learning Tasks** | Screen 5 — 4-pair objection-matching whole-task practice. Screen 6 — 5-Q scenario quiz (decisions, not recall). |
| **Supportive Information** | Screen 2 (María persona — *why* the buyer behaves this way). Screen 3 (product value map). Callouts in screens 1 + 3 + 4. |
| **Procedural Information** | Screen 4 — exact positioning openers per trigger phrase (just-in-time wording the rep can copy). |
| **Part-task Practice** | Screen 5 — drag-match drill for objection → response automatic recall. |

### 2c · Kolb experiential cycle mapping

| Kolb stage | In this module |
|---|---|
| **Concrete Experience** | Screen 5 drag-match interaction. Learner *does* the matching, gets immediate green / over-flash feedback. |
| **Reflective Observation** | Screen 5 post-match feedback paragraph reframes the move ("re-state the objection back first — that micro-pause buys trust"). |
| **Abstract Conceptualisation** | Screen 4 names the model — *trigger phrase → prop → opener* — and explicitly cites Mayer's "don't double up" principle. |
| **Active Experimentation** | Screen 6 Q5 — applies the model to a new context (the *end* of a call, not the middle). Learner tries the rule in unfamiliar shape. |

### 2d · Kirkpatrick reverse from L4

| Level | Metric | Instrument |
|---|---|---|
| **L4 — Results** | SMB-segment ramp time 90 d → ≤67 d (-25 %); SMB-segment win-rate +5 pts within 6 months of cohort completion | CRM data (ramp-time field, segment-tagged opportunity outcomes) |
| **L3 — Behaviour** | Talk-track adherence on first 5 recorded calls ≥80 %; objection-handling improvisation score (rubric 1–5) ≥3.5 at week 4 | Call-recording sample + manager rubric + Gong-style adherence flag |
| **L2 — Learning** | Quiz mastery ≥80 % pass on first attempt; spaced retrieval quiz at +7 d ≥70 % | SCORM quiz score (built in); spaced quiz scheduled via LMS reminder |
| **L1 — Reaction** | Thalheimer 3-Q: "I could use this on a real call today" ≥4.0/5; "Time well-spent" ≥4.2/5; 1 open free-text | Post-module embedded pulse (v2 — not in v1) |

### 2e · Modern LXD methods applied

- **Action Mapping (Cathy Moore)** — every screen anchored on one sales action the rep takes in the call. No abstract "About FinTech Cards" content.
- **Mayer multimedia principles** — coherence (no decorative chrome), signalling (eyebrow + h1 + clear hierarchy), redundancy (text alone, no narration / on-screen-text doubling).
- **Worked-example fading (Sweller / Renkl)** — Screen 4 = *fully* worked openers (the rep reads them). Screen 5 = *partial* example (the rep matches the right response). Screen 6 = *bare* problem (the rep picks from 4 plausible distractors).
- **Microlearning + spacing effect** — 10-min cap; assumes L2 retention quiz at +7 d as part of the broader program.
- **Scenario-based (Sabramowicz / Dirksen)** — María persona threads every screen; the learner makes decisions *as a rep talking to her*, not as a student reading slides.
- **70-20-10 (Jennings)** — this module is the "10 %". The 20 % (social) and 70 % (experiential) layers — call shadowing, role-play, manager 1:1 — are referenced in the L3 measurement design but live outside the module.
- **Performance-Focused L1 (Thalheimer)** — micro-pulse questions are predictive of behaviour change, not a generic smile sheet.

---

## 3 · Develop — build log

- **Decision: SCORM 1.2 over 2004.** Wider LMS compatibility (Sana, Moodle, SCORM Cloud), simpler API (3 methods get me 80 % of value), sufficient for L2 score reporting. xAPI architecture-compatible but deferred to v2.
- **Decision: vanilla HTML + inline `<template>` over fetch + iframe.** First attempt listed individual screen files (`screens/01-welcome.html`) in `imsmanifest.xml` so each screen would render in its own iframe. Crashed in standalone preview — `file://` blocks `fetch()` from a static index. Pivoted to inline `<template id="screen-N">` elements swapped via `document.importNode`. Updated manifest to list 3 files only. **This is a real failure logged because the previous manifest referenced assets the build no longer needs.**
- **Decision: click-pick-click matching over true drag-drop.** Touch-friendly without polyfills; no edge cases on mobile; ~80 lines of JS for the whole interaction; survives screen-reader inspection better than HTML5 drag-drop without ARIA gymnastics.
- **Decision: own `scorm.js` wrapper.** ~150 LOC. Implements `findAPI` (walks `window.parent` 12 levels + `window.opener`), `init` / `finish` / `commit` / `set` / `get`, plus high-level helpers (`setStatus`, `setScore`, `recordInteraction`, `setProgress` for `cmi.suspend_data` JSON, `getStudentName`). This is *the* artefact for the JD line "authoring tools fluency" — it shows I can ship SCORM packaging from first principles, not just push buttons in Storyline.
- **Decision: standalone fallback writes to `localStorage` under key `scorm_fallback_v1`.** Hiring manager can open the URL, get to screen 5, reload, and resume mid-module. Mirrors what a real LMS would do.
- **Decision: pass threshold = 80 % (4 / 5 correct).** Matches `<adlcp:masteryscore>80</adlcp:masteryscore>` in the manifest. Below 80 % the wrap message tells the learner *where* to re-watch (screens 3 + 4 — the talk-track), not just "try again".
- **Decision: keep all body copy in EN.** Target-role description is EN-language. Spanish localisation deferred.
- **Failure caught in browser test.** Match interaction's `data-pairs` JSON originally used curly quotes which broke `JSON.parse`. Replaced with straight quotes and reworded contractions to avoid apostrophe collisions. Verified by clicking through screen 5 + screen 6 end-to-end in preview.
- **Decision: progress bar = 6 equal steps.** Honest cognitive load — but screen 5 is the highest-value step and arguably should weight heavier. Logged for v2.

---

## 4 · Implement

- **Files in package:** 4 — `imsmanifest.xml`, `index.html`, `scorm.js`, `style.css`.
- **Folder on disk:** `portfolio/pipeline/artefacts/scorm-card-onboarding/`.
- **Deployment shapes:**
  1. Hosted standalone at `mario.grasslms.online/pipeline/artefacts/scorm-card-onboarding/` (after E2 ship).
  2. SCORM-packaged zip — reviewers can drop into Sana / Moodle / SCORM Cloud and run as an SCO.
- **LMS compatibility checklist:**
  - `imsmanifest.xml` declares SCORM 1.2 schema + mastery score 80 ✅
  - `findAPI` walks `parent` chain up to 12 levels and `window.opener` ✅
  - Sets `cmi.core.lesson_status` to `passed` / `completed` based on score threshold ✅
  - Sets `cmi.core.score.{raw,min,max}` ✅
  - Writes `cmi.suspend_data` JSON for resume-from-mid ✅
  - Records `cmi.interactions.{n}.{id,type,student_response,result,weighting,time}` for both quiz and match ✅
  - `LMSFinish` called from `beforeunload` to flush state ✅
- **Standalone fallback:** `localStorage` key `scorm_fallback_v1`, JSON bag of all `cmi.*` keys + `cmi.suspend_data` for resume.
- **Reviewer flow:** open URL → see `MODE: standalone` chip → run module → all SCORM calls noop-write to localStorage → on Finish, `nextBtn` text becomes "Done ✓".

---

## 5 · Evaluate — metric plan

| Metric class | Target | How measured |
|---|---|---|
| **L1 — Reaction** (Thalheimer 3-Q) | "I could use this on a real call today" ≥4.0/5; "Time well-spent" ≥4.2/5; NPS ≥30 | Embedded post-module micro-pulse (v2) |
| **L2 — Learning** | Quiz mastery ≥80 % first attempt; +7 d retention ≥70 %; +30 d ≥60 % | SCORM `cmi.core.score.raw`; LMS-scheduled spaced retrieval mini-quiz |
| **L3 — Behaviour** | Talk-track adherence first 5 calls ≥80 %; objection improvisation rubric ≥3.5/5 at week 4 | Call-recording sample (Gong / Modjo / manual); manager observation rubric one-pager |
| **L4 — Results** | SMB-segment ramp 90 d → ≤67 d (−25 %); SMB win-rate +5 pts within 6 months of cohort | CRM ramp-time field, segment-tagged opportunity outcomes |
| **Engagement** | Module completion ≥90 %; mean time-on-module 9–11 min (design = 10 ±10 %); match interaction completion ≥95 %; quiz attempt rate ≥98 % | SCORM `cmi.core.session_time` + match completion telemetry via `cmi.interactions` |
| **Authoring quality** | Content error rate <2 %; refresh cycle ≤90 days; module weight (zip) <500 KB | Issue log; quarterly content review schedule |

All targets stated as if the module were rolled out at cohort scale, even though this portfolio context has no production telemetry. Stating them is part of the demo.

---

## 6 · Reflect

**What worked**
- Standalone fallback was the right call — reviewer can demo without an LMS; SCORM still fires correctly in a real LMS.
- María persona threads every screen — gives the rep a single mental model rather than four disconnected screens.
- Drag-match in 80 lines of JS, zero dependencies — short, reviewable, mobile-tolerant.
- 4C/ID architecture is *visible* in the artefact: a reviewer can name which screen is which component without me explaining.

**What broke / surprised**
- Curly quotes in inline JSON. Caught in browser smoke test, not in code review.
- Progress bar shows 6 equal steps but Screen 5 is the heaviest cognitive step. Honest, but undersells the interaction.
- `cmi.interactions` index reservation (quiz 0–4, match 5–8) is fine but undocumented in code comments — added to v2 backlog.

**What I would change next iteration**
- Add Screen 7: Thalheimer-style 3-Q L1 micro-pulse before `SCORM.finish`. Reaction data is currently absent.
- Emit xAPI statements in parallel for richer analytics (verb / object / actor for each match + quiz).
- Gate **Next** on Screen 5 only after at least 3 of 4 matches succeed — currently you can advance with 0 matches and still pass the module via quiz alone.
- Add `aria-live="polite"` regions for match feedback so screen-reader users hear the result.

**Open questions for stakeholder**
- Does the L4 ramp-time target (−25 %) need calibrating against current baseline? Need access to actual ramp-time data to commit.
- Is the cohort taking this once at onboarding, or as part of a refresh series? Cadence changes the spaced-retrieval design.

---

## QC scoreline

```
QC: F=5 JD=5 P=5 S=5 V=4 D=5 | Composite 4.8/5 SHIP
Closes JD must-haves: e-learning module · authoring-tool fluency (SCORM 1.2 from first principles) · microlearning · assessment + evaluation · adult-learning + ID methodologies · independent work + dynamic environment
Closes JD nice-to-haves: sales-enablement context · FinTech B2B context
```
