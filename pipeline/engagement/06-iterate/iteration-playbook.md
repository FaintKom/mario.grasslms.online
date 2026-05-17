> Why this artefact: Brief §20 lists six standing risks (lead-quality drift, uneven manager adoption, top-rep articulation gap, cadence-pressure with no slack, sponsor turnover, ES delayed). The playbook converts each risk and each Kirkpatrick instrument into a testable IF-THEN rule with a named owner and a defined "done", so iteration runs without designer intervention. Frameworks: Kirkpatrick L1–L4 (Kirkpatrick & Kirkpatrick 2016) + Action Mapping decision logic (Moore 2017) + Phillips Phase-7 iteration (Phillips 2003) + LTEM tier-3 framing for L1 (Thalheimer 2018, per D-003).

---

# Iteration playbook · post-launch decision rules

## How to read this file

Each rule has the same five fields:

| Field | Meaning |
|---|---|
| **Trigger signal** | An observable, measurable condition pulled from the dashboard or instrument. Always quantitative + time-bounded. |
| **Sprint type** | One of: *content refresh · rubric recalibration · cohort-comms tweak · escalate to sponsor*. |
| **Owner** | The single accountable person. RACI's "A" — never split. |
| **Timeline** | When the sprint fires inside the 4-week cohort cadence. |
| **Definition of done** | Signal returns to acceptable range for **two consecutive cohorts** (not one — single-cohort recovery is noise). |

All rules are stated as `IF [signal] THEN [sprint]` so they are testable from the dashboard alone.

The cohort cadence is every 4 weeks (brief §3). Inside one cadence window: Week 1 = cohort start · Week 2 = manager week-2 calibration · Week 3 = mid-cohort pulse · Week 4 = cohort wrap + next-cohort prep. Sprints slot into this rhythm.

---

## 1 · Level 1 (Reaction · Thalheimer LTEM tier-3 application-intent)

### Rule L1-A — Application-intent below floor

**IF** L1 item "I could use this on a call today" mean < 4.0 / 5 on any single module for any single cohort **THEN** fire **content-refresh sprint** on that module.

| | |
|---|---|
| Trigger signal | Module mean < 4.0 on N≥8 responses |
| Sprint type | Content refresh (worked example replacement + scenario re-anchor) |
| Owner | In-house designer |
| Timeline | Week 3 of triggering cohort → ships before Week 1 of next cohort |
| Definition of done | Module mean ≥ 4.0 for 2 consecutive cohorts post-refresh |

### Rule L1-B — Open-response forgotten-move pattern

**IF** the same "move I'm most likely to forget" appears in ≥30 % of open responses across 2 cohorts **THEN** fire **content-refresh sprint** to add a spaced-retrieval booster on that move.

| | |
|---|---|
| Trigger signal | Coded open-response frequency ≥ 30 % over 2 cohorts |
| Sprint type | Content refresh (mini-quiz at +14 d slot) |
| Owner | In-house designer (coding) · LMS admin (scheduling) |
| Timeline | Week 4 wrap → ship in next cohort |
| Definition of done | Frequency drops below 15 % for 2 consecutive cohorts |

---

## 2 · Level 2 (Learning · SCORM mastery + spaced retrieval)

### Rule L2-A — First-attempt mastery below 80 %

**IF** SCORM `cmi.core.score.raw` first-attempt mean < 80 % on any module for any cohort **THEN** fire **content-refresh sprint** focused on the failing item bank.

| | |
|---|---|
| Trigger signal | First-attempt < 80 % on module N for one cohort |
| Sprint type | Content refresh (item-level diagnostics → worked example fix) |
| Owner | In-house designer |
| Timeline | Week 2 of next cohort (after item analysis from prior cohort completes) |
| Definition of done | First-attempt ≥ 80 % for 2 consecutive cohorts |

### Rule L2-B — +7-day retention below 70 %

**IF** Sana-scheduled +7-day mini-quiz mean < 70 % on any module for any cohort **THEN** fire **content-refresh sprint** to extend the spaced-retrieval schedule (add +14 d touch).

| | |
|---|---|
| Trigger signal | +7 d quiz < 70 % on module N |
| Sprint type | Content refresh (retrieval schedule + retrieval-mode questions, not recognition) |
| Owner | LMS admin (schedule) · in-house designer (item rewrite) |
| Timeline | Slotted into next cohort's Week 2 |
| Definition of done | +7 d quiz ≥ 70 % for 2 consecutive cohorts |

---

## 3 · Level 3 (Behaviour · Gong adherence + manager rubric)

### Rule L3-A — Pod adherence below 70 % for 2 consecutive cohorts

**IF** Gong `tag:diagnostic-opener` (M1) **OR** `tag:objection-acknowledged` (M2) **OR** `tag:calendar-booked` (M3) adherence in any single pod < 70 % for **2 consecutive cohorts** **THEN** fire **cohort-comms tweak + manager 1:1 escalation** (not a content refresh — the content is working in other pods).

| | |
|---|---|
| Trigger signal | Pod-level adherence on any of M1/M2/M3 < 70 % across 2 cohorts |
| Sprint type | Cohort-comms tweak + manager escalation |
| Owner | Manager population (RACI: A = pod manager · C = A.S.) |
| Timeline | Within 2 weeks of triggering cohort 2 close |
| Definition of done | Pod adherence ≥ 70 % for 2 consecutive cohorts after escalation |

### Rule L3-B — Inter-rater variance > 1.5 scale points

**IF** in the week-6 calibration session, managers' scores on the same sample call differ by > 1.5 points on any single rubric row **THEN** fire **rubric recalibration sprint**.

| | |
|---|---|
| Trigger signal | Pairwise score range > 1.5 on M1, M2 or M3 row across ≥3 calibration calls |
| Sprint type | Rubric recalibration (anchor descriptors rewritten, calibration session re-run) |
| Owner | In-house designer (rubric authoring) · A.S. (facilitator) |
| Timeline | Within 2 weeks of failing calibration; re-run at next week-6 |
| Definition of done | Pairwise score range ≤ 1.0 in two consecutive week-6 calibrations |

### Rule L3-C — Manager calibration attendance < 80 %

**IF** week-2 or week-6 calibration session attendance < 80 % of pod managers for any cohort **THEN** **escalate to sponsor** (K.M.).

| | |
|---|---|
| Trigger signal | Manager attendance < 80 % at calibration |
| Sprint type | Escalate to sponsor (manager-cadence is K.M.'s policy lever per brief §8) |
| Owner | K.M. (sponsor) · A.S. (data) |
| Timeline | Within 1 week of failed session |
| Definition of done | Attendance ≥ 90 % at next 2 calibrations |

---

## 4 · Level 4 (Results · ramp + retention)

### Rule L4-A — Ramp regression vs cohort N−1

**IF** trailing-4-cohort mean ramp regresses by > 5 days vs the prior trailing-4-cohort window **THEN** convene a **3-way triage** before firing any sprint: training-side (in-house designer) · lead-quality side (R.K. via K.M.) · comp-plan side (J.V.). Per D-008, do not attribute to training alone until the marketing lead-quality index and comp-plan SPIF rate are checked.

| | |
|---|---|
| Trigger signal | Trailing-4 mean ramp Δ > +5 d |
| Sprint type | Triage first, then *one of* content refresh OR escalate to sponsor (depends on triage finding) |
| Owner | K.M. (triage convener) · in-house designer / R.K. / J.V. (data) |
| Timeline | Triage within 1 week of trailing-4 update; sprint within 2 weeks of triage |
| Definition of done | Trailing-4 ramp returns within 5 d of target (≤71 d) for 2 cohorts |

### Rule L4-B — Day-120 retention drop > 3 pp

**IF** day-120 retention drops > 3 percentage points vs prior trailing-4 cohort **THEN** **escalate to sponsor** + run exit-interview deep-dive on the leaving cohort (per §10.5 protocol).

| | |
|---|---|
| Trigger signal | Day-120 retention Δ > −3 pp |
| Sprint type | Escalate to sponsor + exit-interview pull |
| Owner | K.M. (escalation) · D.R. People (interviews) |
| Timeline | Within 2 weeks of HRIS rollup confirming drop |
| Definition of done | Retention returns to ≥ 92 % for 2 trailing-4 windows |

### Rule L4-C — Marketing lead-quality confound (D-008 no-confidence branch)

**IF** marketing-sourced inbound close-rate (RevOps dashboard) shifts by > 2 pp in either direction **THEN** **escalate to sponsor** (K.M. owns CMO conversation per brief §8) and **flag L4 ramp number as non-attributable** for that cohort window. Do not run a content-refresh sprint in response to lead-quality shifts — out of training scope.

| | |
|---|---|
| Trigger signal | Lead-quality index Δ > ±2 pp |
| Sprint type | Escalate to sponsor; annotate L4 dashboard with confound flag |
| Owner | K.M. (sponsor) · J.V. (RevOps data) |
| Timeline | Within 1 week of detected shift |
| Definition of done | L4 dashboard carries the confound annotation; CRO review deck (per `exec-deck.md` slide 5) discloses honestly |

---

## 5 · Standing operational triggers (not Kirkpatrick-coded)

### Rule O-A — SDR cohort attrition during program > 5 %

**IF** any rep leaves the company **during** the 0–60 day program **THEN** **escalate to sponsor** + run an exit interview within 5 working days (per §10.5 protocol, even if cohort attrition stays at 1 person). > 5 % is a multi-cohort signal.

| | |
|---|---|
| Trigger signal | Mid-program attrition > 5 % across trailing-2 cohorts |
| Sprint type | Escalate to sponsor + exit interviews |
| Owner | K.M. (escalation) · D.R. (interviews) · in-house designer (pattern coding) |
| Timeline | Interview within 5 working days; pattern read within 2 weeks |
| Definition of done | Mid-program attrition < 3 % for 2 consecutive cohorts |

### Rule O-B — Sponsor turnover (K.M. departs)

**IF** K.M. announces departure **THEN** within 5 working days the in-house designer triggers the **hand-off pack** (`handoff-pack.md`) walk-through with successor or D.R. interim sponsor. No design decisions are taken in the gap.

| | |
|---|---|
| Trigger signal | K.M. departure announcement |
| Sprint type | Escalate to sponsor (successor) + freeze on design change for 1 cohort cycle |
| Owner | In-house designer · D.R. People |
| Timeline | Walk-through within 5 working days |
| Definition of done | Successor co-signs next decisions-log entry (D-009 or later) |

---

## 6 · Sprint-type cheat sheet

| Sprint type | What it produces | Time-box | Where to look |
|---|---|---|---|
| Content refresh | New worked example, item bank update, new SCORM build (versioned), updated storyboard | 4 weeks | `content-refresh-sprint-template.md` |
| Rubric recalibration | Rewritten anchor descriptors, re-run calibration session, updated Gong scorecard | 2 weeks | `handoff-pack.md` §rubric maintenance |
| Cohort-comms tweak | Updated manager pre-read, kickoff comms, mid-cohort nudge | 1 week | `04-implement/launch-comms/` (Phase 4) |
| Escalate to sponsor | Briefing note to K.M. with signal, data, recommended action | Same week | Templated in `handoff-pack.md` |

---

## 7 · Cadence summary (one cohort window)

```
Week 1: Cohort start. Last cohort's L1+L2 data finalises. Triggers L1-A / L1-B / L2-A / L2-B fire here.
Week 2: Manager week-2 calibration. Trigger L3-C checked. Trigger L3-B checked at week-6 of cohort N−1 (i.e. same week).
Week 3: Mid-cohort pulse. Sprint work in progress.
Week 4: Cohort wrap. Trailing-4 L4 update → Triggers L4-A / L4-B / L4-C checked. Next cohort comms shipped.
```

---

## References

- Brief §5 (success measures) · §8 (K.M. attribution honesty + manager-cadence floor) · §10.5 (exit-interview protocol) · §10.8 (rubric calibration ask) · §17 (comp-plan confound) · §20 (risk register).
- `frameworks-applied.md` #3 (Kirkpatrick), #6 (Action Mapping), #12 (LTEM), #11 (spaced retrieval).
- `decisions-log.md` D-003 (L1 reframe to LTEM tier-3), D-004 (rubric 3 × 5), D-008 (L4 no-attribution-confidence branch).
- `master-plan.md` §6 (Phase-6 gate criteria — playbook must be decision-rule based).
- `05-evaluate/kirkpatrick-measurement-plan.md` (signal sources — referenced forward).
