> Why this artefact: Brief §20 risk row "Cohort cadence (every 4 weeks) leaves no slack for v2 mid-rollout" — there is exactly one 4-week window between cohorts to ship change. This template makes that window operable: week-by-week tasks, deliverables, gate criteria, SCORM versioning rules, and A/B mechanics that do not invalidate the L4 baseline (per D-008). Frameworks: ADDIE Phase-3 / Phase-5 hybrid for in-flight rebuild + Phillips iteration cycle + Renkl/Atkinson worked-example fading discipline preserved across versions.

---

# Content-refresh sprint · 4-week template

## When this template fires

Triggered from `iteration-playbook.md` rules **L1-A**, **L1-B**, **L2-A**, **L2-B**, and the content-side branch of **L4-A** post-triage. Also fires on a non-signal basis when:

- A new product proposition launches (e.g. a 5th value prop or pricing tier change).
- A new competitive scenario emerges from SME interviews (e.g. Brex withdraws from EU → a new displacement pattern).
- The manager rubric needs refinement after a week-6 calibration session (covered as a 2-week sub-template at §5).

The sprint slots into the 4-week window between cohort starts. The cohort cadence is sacrosanct — sprints do not extend it. If a refresh needs > 4 weeks, it ships in two phases.

---

## 1 · Sprint roles

| Role | Person | Time commitment in sprint |
|---|---|---|
| Sprint lead | In-house designer | ~60 % of FTE for 4 weeks |
| SME (rep-side) | One top-decile rep (M.G. or L.D. rotation) | 2 × 30-min interviews |
| SME (manager-side) | J.T. (UK Pod 1) or M.K. (DE Pod 1) | 1 × 30-min validation |
| LMS admin | Sana administrator | 2 × 60-min uploads + cohort enrollment |
| Sponsor sign-off | K.M. (or successor) | 1 × 15-min gate review at end of Week 3 |
| Critic | A second internal designer or A.S. as proxy | 1 × asynchronous review at Week 4 |

---

## 2 · The 4-week sequence

### Week 1 · Diagnose + decide

**Goal.** Convert the trigger signal into a sharp design problem.

| Day | Task | Deliverable |
|---|---|---|
| Mon | Pull signal data: L1 open-responses, L2 item-level scores, L3 Gong tag deltas, L4 dashboard cuts. | `sprint-XX-diagnosis.md` §1: raw data |
| Tue | Run 1 × 30-min interview with a top-decile rep on the failing module's scenario. | Interview notes appended to `sprint-XX-diagnosis.md` §2 |
| Wed | Tag the gap with Dirksen's 5-dimension lens (knowledge / skill / motivation / environment / communication). Decide: training-fixable OR escalate. | `sprint-XX-diagnosis.md` §3: tagged gap + decision |
| Thu | If training-fixable: draft the design hypothesis ("we believe replacing the GC-XX worked example with GC-YY will lift +7-d retention from 65 % to 75 %"). | Hypothesis statement |
| Fri | Critic walkthrough of diagnosis + hypothesis. **Gate criterion 1:** hypothesis is falsifiable and tied to a numeric signal. | Critic note |

**Week 1 gate criteria:**
- [ ] Diagnosis cites the specific dashboard cut + week.
- [ ] Gap tagged with Dirksen dimension; if dimension ≠ knowledge/skill, route to **escalate to sponsor** instead of continuing the sprint.
- [ ] Hypothesis is falsifiable from a known instrument.

### Week 2 · Build + version

**Goal.** Produce the new content artefacts and version the SCORM package.

| Day | Task | Deliverable |
|---|---|---|
| Mon | Update storyboard inside `02-design/module-storyboards/module-N.md`. Preserve the Merrill activation-demonstration-application-integration spine (D-002 / `frameworks-applied.md` #14). | Storyboard v.N+1 |
| Tue | Re-author worked example + completion problem + solo problem (Renkl-Atkinson fading preserved). | Updated module assets in `03-develop/module-N/v.N+1/` |
| Wed | Update item bank (L2 quiz) inline with the new worked example. Each item tagged with Bloom verb at Apply or above. | Item bank v.N+1 |
| Thu | Run SME validation interview (manager-side, 30 min). | Validation note |
| Fri | Build new SCORM package. Bump manifest. **See §3 for versioning rules.** | `module-N-v.N+1.zip` |

**Week 2 gate criteria:**
- [ ] All edits preserve the keystone move (M1, M2, or M3) the module was designed to teach.
- [ ] No outcome added at Bloom Remember/Understand level (per D-002).
- [ ] SCORM manifest version bumped per §3.

### Week 3 · Test + sponsor gate

**Goal.** Validate in SCORM Cloud, run a learner dry-run, get sponsor sign-off.

| Day | Task | Deliverable |
|---|---|---|
| Mon | Upload to SCORM Cloud preview environment. Smoke test: launch, complete, score reports. | SCORM Cloud test log |
| Tue | Time a dry-run with a willing SDR (not part of the next cohort). Confirm ≤ 10 min completion (cohort tolerance constraint, brief §7). | Dry-run timing log |
| Wed | WCAG 2.1 AA spot-check (keyboard nav, contrast ≥ 4.5:1, alt text, focus visible) per `03-develop/scorm-shell/a11y-audit.md` checklist. | A11y delta note |
| Thu | 15-min sponsor gate review with K.M. (or successor). Present diagnosis, hypothesis, new content, expected lift. | Sign-off note in `decisions-log.md` (D-009+) |
| Fri | Slack the manager population: "module N v.N+1 ships in cohort N+1; here's what's changed" — 1 paragraph max. | Manager pre-read |

**Week 3 gate criteria:**
- [ ] SCORM Cloud preview passes (load + complete + score).
- [ ] Dry-run timed ≤ 10 min.
- [ ] WCAG 2.1 AA conformance preserved.
- [ ] Sponsor sign-off captured in decisions log.

### Week 4 · Ship + A/B + measure

**Goal.** Deploy to Sana, run the A/B without breaking the L4 baseline, schedule the next-window read.

| Day | Task | Deliverable |
|---|---|---|
| Mon | LMS admin uploads `module-N-v.N+1.zip` to Sana. Cohort-level enrollment routing per §4 (A/B rules). | Sana deployment log |
| Tue | Update cohort comms: kickoff email mentions the changed module. Manager pre-read confirms. | Comms files in `04-implement/launch-comms/` (Phase 4) |
| Wed | Schedule the next L2 +7-d quiz + L1 pulse to read the new version. | Sana schedule confirmation |
| Thu | Log the change in `decisions-log.md` and in the L4 dashboard annotation (so the CRO review deck slide 5 carries the confound). | Decisions log entry |
| Fri | Sprint retrospective (30 min, designer + sponsor). Capture what to keep + what to do differently next sprint. | `sprint-XX-retro.md` |

**Week 4 gate criteria:**
- [ ] Sana deployment confirmed by LMS admin.
- [ ] A/B routing documented per §4.
- [ ] Decisions log + L4 dashboard annotation both written.

---

## 3 · SCORM versioning in Sana

The Sana LMS does not natively diff SCORM versions. The convention below makes versions traceable and rolls back cleanly.

**Naming:** `module-N-v.MAJOR.MINOR.zip` where:

- `MAJOR` bumps when the keystone move (M1 / M2 / M3 / ICP fit / Prop mapping / Reg deflection) is reframed.
- `MINOR` bumps for worked-example swaps, item-bank rewrites, scenario refreshes.

**`imsmanifest.xml` identifier:**

```xml
<manifest identifier="FTC-SDR-M1-v1.2" version="1.2">
```

**Sana upload rule:** never overwrite an existing SCORM in place. Always upload as a new course version. Sana retains the prior version for 90 days, which covers two trailing cohorts for rollback.

**Rollback rule:** if cohort N+1's L1 or L2 signal drops below pre-refresh baseline by > 5 %, in-house designer triggers rollback to v.N. Rollback ships in the next 1-week window, not the next sprint window.

---

## 4 · A/B between cohorts without breaking the L4 baseline (per D-008)

The temptation is to split a single cohort in two and A/B the new vs old module. **Do not do this.** Reasons:

1. Cohort size (10–15 reps) is too small to power a single-cohort A/B.
2. Splitting inside a cohort introduces a between-rep confound on the manager 1:1 cadence (different reps, different managers).
3. L4 attribution per D-008 is already constrained — adding a within-cohort split makes attribution impossible.

**A/B rule for this program:**

- Run the **new version only** in cohort N+1 (no split).
- Compare cohort N+1's signal against the trailing-3-cohort baseline.
- If the lift exceeds the noise floor (defined as ≥ 5 % delta on the targeted signal, sustained for 2 cohorts), the change is adopted.
- The L4 baseline (mean ramp + day-120 retention) is computed on the **trailing-4-cohort** window so a single content change does not invalidate it. The trailing window absorbs the change.

This is a slow A/B (2 cohorts = 8 weeks minimum to confirm a lift), but it preserves L4 baseline integrity and respects the cohort-size constraint.

---

## 5 · Sub-template — rubric refinement after week-6 calibration (2 weeks)

Triggered by `iteration-playbook.md` rule **L3-B** (inter-rater variance > 1.5).

| Week | Task | Deliverable |
|---|---|---|
| 1 | Pull the disagreement calls (Gong) + score sheets. Cluster the disagreements by rubric row. Rewrite anchor descriptors for the failing row(s). | New rubric v.N+1 |
| 1 | Run 30-min validation with J.T. (UK Pod 1) and M.K. (DE Pod 1) — the two highest-cadence managers per §10.6 / §10.7. | Validation notes |
| 2 | Schedule re-calibration session (60 min, all pod managers). Re-score the same 3 sample calls under the new rubric. | Re-calibration session log |
| 2 | Update Gong scorecard schema if anchor descriptor changes shift the 1–5 scale alignment. | Gong scorecard updated |
| 2 | Decisions-log entry; rubric circulated. | Entry + 1-page PDF |

**Done criterion:** pairwise variance ≤ 1.0 in this calibration **and** the next one (8 weeks later).

---

## 6 · Sub-template — new product prop or competitive scenario (4 weeks, lighter touch)

When a new product proposition launches or a competitive scenario emerges, run the standard 4-week sequence above, but with two changes:

- **Week 1 diagnosis** is replaced with an SME pull from the product team + 2 SDR interviews (one top-decile, one mid-band) on how the new prop / scenario reframes the existing keystone moves.
- **Week 2 build** focuses on Module 5 (Product Prop Mapping) and/or Module 4 (ICP Buyer Fit) — the two modules most prop-sensitive per `02-design/4cid-blueprint.md`. M1/M2/M3 modules rarely need prop-driven updates.

---

## 7 · What this template does NOT cover

- New module creation (a 7th module). That is a Phase 3 re-open and follows the storyboard + develop sprint discipline in `master-plan.md` §3, not this template.
- Translation work (ES + DE rollout). That is the v2 plan in `handoff-pack.md` §v2.
- Mini-OS shell changes (window manager, app launcher). That is engineering work in `03-develop/scorm-shell/`, not content work.

---

## References

- Brief §7 (cohort tolerance ≤ 10 min) · §10.6 / §10.7 (manager-side SMEs) · §16 (tooling — Sana, SCORM Cloud, Articulate).
- `frameworks-applied.md` #1 (ADDIE), #10 (worked-example fading), #11 (spaced retrieval), #14 (Merrill).
- `decisions-log.md` D-002 (4C/ID + Merrill spine), D-005 (custom SCORM), D-006 (no audio), D-008 (L4 attribution constraint).
- `iteration-playbook.md` rules L1-A, L1-B, L2-A, L2-B, L4-A (triggers that fire this template).
- `master-plan.md` §3 Phase-3 develop sprints (referenced for new-module creation).
