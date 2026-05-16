# Design log — Top-7 SMB objections · job aid

> Single-page performance-support reference. Used by a sales rep mid-call to find the right acknowledge → respond → ask-back move in under 3 seconds. Companion to the SCORM module and facilitator guide. JD requirements closed: job aids, performance support (5 Moments of Need), micro-format, sales-enablement context.

---

## Open questions at start

- **Q1.** 10 objections or 7? Density vs scannability.
- **Q2.** Print A4 portrait or landscape one-sheet? Reps prefer pocket-foldable.
- **Q3.** How much pedagogy ("why this works") vs pure performance ("what to say")? It's a job aid, not a course.
- **Q4.** Include QR back to SCORM Screen 5 for re-training? Or keep card pure?

---

## References pulled

- **Bob Mosher + Conrad Gottfredson — *Innovative Performance Support* (2012)** — 5 Moments of Need. Job aid lives at the **Solve** moment (something just went wrong / unexpected). The card answers "what do I say *now*".
- **George A. Miller — *The Magical Number Seven, Plus or Minus Two* (1956)** — short-term memory chunk limit. 7 objections is the upper bound for mid-call scan-and-recall.
- **Cathy Moore — Action Mapping** — anchor on the on-the-job action: the literal sentence the rep says.
- **Patti Shank — Practice and Feedback** — response specificity (the literal sentence) rather than vague guidance.
- **Connie Malamed — eLearning Coach principles** — performance support: glanceable, scannable, in-context, in the moment.
- **Allen Tough — *Adults' Learning Projects* (1971)** — adult learners prefer self-directed micro-resources over scheduled training. Card = self-directed.

---

## 1 · Analyse

**Audience persona.** Same SDR / AE as the SCORM module + workshop. Already trained. Just landed in their first live SMB calls and is going to hit an objection in the first 90 seconds.

**Performance context.** Live call. Rep has 2–3 seconds to glance, find the row, and pivot back to the buyer. The card lives on the rep's desk, taped to a monitor, or folded in a notebook.

**Constraints.**
- One sheet of A4 portrait — printable on a home printer.
- Scannable in 3 seconds — meaning category bands + clear row separation + ≤7 entries.
- No app, no login, no scroll.
- Must work in landscape laptop view *and* print clean to paper.

**Prior-art scan.** Most sales objection cards in the wild fail in one of two ways: (a) too dense (15+ objections with paragraph-long responses — unscannable) or (b) too vague (5 categories with no literal language to say). The card splits the difference: 7 rows, each with a *literal* acknowledge + respond + ask-back template.

---

## 2 · Design

### 2a · ADDIE.Design — chose performance-support model (Mosher 5 Moments)

This is **not training**. It is a Performance Support Intervention. ADDIE / SAM / 4C/ID are course models; the right model here is **5 Moments of Need** — specifically the *Solve* moment (something just went wrong, learner needs help right now).

### 2b · 4C/ID — partial application

Of the four components, only **Procedural Information** applies. The card is the just-in-time how-to. The whole-task practice (Learning Tasks) and the supportive info (Why) live in the SCORM module + workshop, not here.

### 2c · Kolb — single stage (Active Experimentation)

The card is the AE stage of Kolb. The CE / RO / AC already happened in the SCORM + workshop. The card is what the learner uses to *apply in a new context* — the real call.

### 2d · Kirkpatrick — L3 only

This artefact is an L3 instrument, not a training instrument.

| Level | In this artefact |
|---|---|
| L1 | n/a (it is not training) |
| L2 | n/a (no learning event) |
| **L3** | Did the rep use the card in real calls? Did the acknowledge → respond → ask-back pattern appear in their call recordings? |
| L4 | inherited from SCORM + workshop (ramp, win-rate) |

### 2e · Modern LXD methods applied

- **5 Moments of Need (Mosher / Gottfredson)** — designed for the Solve moment.
- **Miller 7 ± 2 chunk limit** — exactly 7 objections, not 10.
- **Action Mapping (Cathy Moore)** — every row anchored on the literal sentence the rep says.
- **Shank specificity** — response field contains the *literal* opener, not a category like "talk about security".
- **Malamed performance-support principles** — glanceable, scannable, in-context.

---

## 3 · Develop — build log

- **Decision: 7 objections, not 10.** Miller limit + sales-rep mid-call scanning capacity. The 3 cut: minor (we use cash mainly; can I get a demo with my husband; not now we're busy). Reps handle those in the SCORM module general training; they don't need a card row.
- **Decision: 5-column row layout — Buyer says / They mean / Acknowledge / Respond / Ask back.** "They mean" column is the meta-layer the rep sometimes forgets; teaches diagnosis as well as recital.
- **Decision: colour-code categories (4 colours max).** Trust = green, Switch = sun, Reliability = ink, Cost / Setup / Approval = coral. 4 colours respects cognitive coding limit; more would burden the scan.
- **Decision: "acknowledge prefix" rule banner at top.** One sentence template that applies to ALL 7 rows — `"I hear you. [restate]."` Reduces the rep's per-row recall to just 2 fields (respond + ask back) because the acknowledge follows the rule.
- **Decision: print A4 portrait, one sheet.** Fits 7 rows at readable font (≥11 pt). Foldable to A5 booklet for pocket.
- **Decision: no QR code in v1.** Keeps the card pure. Re-training is the SCORM module + workshop. Add QR in v2 if reps ask.
- **Failure expected: dim conference room.** Card prints OK on home laser at 11 pt body, but in a dim room a rep glancing fast might miss the category colour band. Mitigation: bold left-edge stripe (not just background tint).

---

## 4 · Implement

- **Files:** `index.html`, `style.css`, `design-log.md`. 3 files.
- **Folder:** `portfolio/pipeline/artefacts/job-aid-objections/`.
- **Print:** `@page A4 portrait`. Page-break-inside: avoid on each row. Works on Chrome / Safari / Firefox print preview.
- **Reviewer flow:** open URL → see card on screen → "Print" → renders one A4 sheet clean.

---

## 5 · Evaluate — metric plan

| Metric class | Target | How measured |
|---|---|---|
| **L1** | n/a | n/a (not training) |
| **L2** | n/a | n/a |
| **L3** | Acknowledge prefix detected in ≥70 % of first-month call recordings; correct objection-prop pairing ≥60 % | Call recording rubric (manual or Gong/Modjo automated keyword detection) |
| **L4** | Inherits SCORM + workshop L4 | CRM ramp + win-rate |
| **Engagement** | Adoption: rep has the card visible (on monitor, folded in notebook) in week 2 self-report ≥80 % | Manager 1:1 quick check |
| **Authoring quality** | ≤1 error per cohort run; refresh ≤90 days when product changes | Issue log + facilitator post-cohort form |

---

## 6 · Reflect

**What worked**
- 7-row Miller limit is the right scan-and-recall ceiling.
- Acknowledge prefix banner = single-rule mnemonic. Reps don't have to memorise 7 acknowledges, only one structure.
- Colour bands give 3-second category lookup without text scan.
- 5-column layout teaches *diagnosis* (They mean) and *response* (literal language) together — both are usually missing in market cards.

**What broke / surprised**
- Initial sketch had 10 objections. Cutting to 7 was harder than expected. Cut criteria: rep frequency (how often does this come up in first 30 calls?) × cost-of-mishandling. Three got cut because rep frequency was low.

**What I would change next iteration**
- Add QR back to SCORM Screen 5 for in-the-moment re-training, *if* reps in the field ask for it.
- Localised versions (ES / PT / DE) once a cohort goes live in a non-EN market.
- Side B (back of card): a 5-question discovery-call opener cheat. Same sheet, double-sided print.

**Open questions for stakeholder**
- Which 7 are right for the actual buyer segment? My selection comes from the SCORM module + general SMB B2B patterns. Real cohort data would refine.
- Are there compliance phrases the rep MUST say (e.g. regulator name) per row? If yes, embed them in the respond column.

---

## QC scoreline

```
QC: F=5 JD=5 P=5 S=5 V=- D=5 | (V scored after preview)
Closes JD must-haves: job aids · performance support · adult-learning principles
Closes JD nice-to-haves: sales-enablement context · FinTech B2B context
```
