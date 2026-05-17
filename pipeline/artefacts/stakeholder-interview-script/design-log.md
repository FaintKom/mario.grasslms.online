# Design log — Stakeholder Interview Script

> A talk-track for the kickoff call with a learning sponsor. Designed to surface the four Robinson needs in 30–45 minutes, with a Mager root-cause guard inside the performance section so the sponsor doesn't talk you into solving a non-training problem with training.

---

## 1 · Analyse

**Audience.** A learning sponsor on the first call — usually a Head of L&D, Sales Enablement lead, RevOps director, or HR business partner. Time-poor; has been pitched training before; quietly worried we'll over-design and over-charge; wants to walk away from the call knowing whether the engagement is going to feel safe.

**Performance context.** 30–45 minutes on Zoom or in person. Two outputs by the end: enough material to fill in the Needs Assessment template, and a clear go / no-go signal on whether training is even the right intervention.

**Constraints.** Single call, no SME access yet, sponsor may not be the real budget holder, may be skipping past the business need straight to "we want a course on X."

**Prior-art scan.** Most kickoff calls a fresh ID lead opens with credentials + portfolio slides. Wrong move — the buyer has already decided you have the credentials, that's why they took the call. The highest-value opening is to declare *what you're not going to do*: pitch. The script's first move is permission-setting, not pitching.

---

## 2 · Design

### 2a · Robinson 4-needs ordering

Dana Robinson + Jim Robinson's *Performance Consulting* (1996, 3rd ed. 2015) decomposes a request into four nested needs: **business → performance → learner → environment**. The script walks them in order on purpose:

| Robinson need | Script section | Why this order |
|---|---|---|
| Business | §02 | If we can't name what changes for the business, nothing else matters. |
| Performance | §03 | Behavioural delta between top and bottom performers. |
| Learner | §04 | Who actually has to change. Comes after performance because audience details only matter once you know what they have to do. |
| Environment | §04–§05 | Tools, time, manager support, compliance. Closes the loop on whether training can even land. |

### 2b · Mager root-cause guard inside §03

Robert Mager's *Analyzing Performance Problems* (1970/1997, with Peter Pipe) is the antidote to designing training for problems training cannot solve. The script's §03 ends with an explicit Mager check: "If I dropped a perfectly trained employee into the role tomorrow, would the system let them perform?" The answer surfaces process, tooling, incentive, and manager-supervision causes — none of which are fixed by a course.

This single question is the most valuable 60 seconds in the call. It either confirms the engagement is worth doing or saves the sponsor from spending €50K on a course that doesn't move the metric.

### 2c · "You say / Listen for / If you hear" structure

Three row types, colour-coded:

- **You say** (green) — verbatim script. The lead can read these out and not lose tempo.
- **Listen for** (yellow, italic) — diagnostic cues the lead has to register without breaking flow.
- **If you hear X, dig into Y** (coral) — branches that handle the most common sponsor moves: skipping past business need, blaming learners for system problems, refusing to name out-of-scope items.

The branches are the difference between a script that reads well and a script that survives contact with a real sponsor. Most kickoff-call scripts in circulation only have "You say" rows.

### 2d · Modern LXD methods named

- **Robinson 4-needs** (Robinson & Robinson, 1996 / 2015) — section ordering.
- **Mager root-cause** (Mager & Pipe, 1970 / 1997) — §03 closing question.
- **Connie Malamed scope discipline** (*Learning Sciences for Instructional Designers*, 2023) — §06 "what we are NOT solving" forces a named out-of-scope list.
- **Single point of contact** — §07 closing ask, lifted from agency-side production discipline. No anonymous attribution; this one is just craft.

### 2e · Timing

The timing strip at the top of the artefact is a real budget, not aspirational:

- Opening 3 min — frame + ground rules. Faster than 3 min reads as pushy.
- Business need 7 min — KPI + baseline + target. Longer than 7 min and the call slips.
- Performance gap 10 min — the biggest single slice. Two performer-comparison questions + Mager guard.
- Audience + environment 7 min — bullet through.
- Constraints + scope 5 min — budget, dates, vote-holders.
- Out of scope 3 min — fast on purpose; if the sponsor lingers here, they're avoiding §05.
- Wrap 3 min — next step + SPOC.

Total: 38 min. The 30–45 band gives 7 min of slack for the sponsor's tangents.

---

## 3 · Develop

- **Decision: print-first layout.** Same one-page printable shape as the Needs Assessment template. Lead can pull it up on Zoom + print for in-person calls.
- **Decision: colour-coded rows over plain prose.** A scriptable plain-prose document reads well but is hard to use in real time. Colour + row label lets the lead scan to the next thing they need to say without losing place.
- **Decision: cross-link to Needs Assessment template, not embed.** Two separate artefacts with a clear mapping table (§08). Keeps each printable on one folded sheet.
- **Decision: name authors of every named method.** Robinson, Mager, Malamed. Reviewers can verify the lineage in one click.

---

## 4 · Implement

- Single-page printable HTML, two-sheet flow (script + mapping table on page 2).
- Standalone — no LMS, no JS interactions beyond `window.print()`.
- Reuses the needs-assessment-template Lively CSS base + a small overlay block for `.script-row`, `.timing-strip`, `.legend`.

---

## 5 · Evaluate — metric plan

| Level | Target | Instrument |
|---|---|---|
| **L1 — Reaction** (lead) | Lead reports the script was usable without notes by call 3 | 1-question post-call check after first 5 uses |
| **L2 — Learning** (lead) | Lead can run the Mager root-cause guard from memory by call 2 | Self-report + sponsor-side feedback in the Needs Assessment |
| **L3 — Behaviour** (sponsor) | Engagements where Mager guard runs at kickoff show ≥30 % fewer scope changes mid-build | Issue-log diff vs. baseline engagements |
| **L4 — Results** (firm) | Win-rate on proposals issued within 48 h of script-driven kickoff ≥60 % | Win-rate dashboard, segment by kickoff format |

---

## 6 · Reflect

**What worked**
- The "If you hear / Dig into" branches are the part of the script that gets used most. They turn the document from a memory aid into a real-time diagnostic tool.
- Naming Robinson + Mager + Malamed inline gives the sponsor language to bring back to their own team after the call.

**What I would change next iteration**
- Add a fifth row type — "Stop the call" — for cases where the sponsor reveals there's no budget, no real performance gap, or no decision authority. Currently those signals appear in the Listen-for rows; explicit branches would let the lead close the call gracefully on a no-go.
- A short pre-call email template with the three ground rules included, so the sponsor walks in expecting the format.
- An async-mode variant — the same questions in a form the sponsor fills before the call. Halves call length when the sponsor has the discipline to fill it.

---

## QC scoreline

```
QC: F=5 JD=5 P=5 S=5 V=4 D=5 | Composite 4.8/5 SHIP
Closes Phase 1 (Discover) artefact gap: kickoff-call script + Mager root-cause guard + Robinson 4-needs ordering + scope discipline
```
