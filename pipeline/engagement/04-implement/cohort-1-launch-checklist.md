> Why this artefact: Operationalises the 1 July 2026 hard launch date (brief §3, §8) into a literal checkbox list anyone in the chain can run. Backwards Design (Wiggins & McTighe 2005) — every checkpoint names the success signal *before* the activity, so the team can falsify the launch, not just perform it.

# Cohort 1 launch checklist · Day -14 through Day +120

**Cohort:** `cohort-2026-07-W27`
**Day 0:** Tuesday 1 July 2026
**Cohort size:** 10–15 SDRs (per brief §3 cadence)
**Slack channel:** `#sdr-cohort-2026-07-W27`

**Legend:**
- **Owner** = single named person accountable.
- **Artefact** = the deliverable or link used at that checkpoint.
- **Signal** = what tells you the checkpoint succeeded (falsifiable).
- **Escalation** = who to ping if signal fails.

---

## Phase A · Pre-launch (Day -14 to Day -1)

### Day -14 · Tuesday 17 June 2026

> Cross-ref: `launch-comms-plan.md` §1 + §3 — same date, same checkpoint, single source of truth.

| ☐ | Checkpoint | Owner | Artefact | Signal | Escalation |
|---|---|---|---|---|---|
| ☐ | Manager pre-read sent to 9 pod managers | A.S. | [`launch-comms-plan.md`](launch-comms-plan.md) §3 | All 9 managers read receipt / Slack reaction within 24 h | A.S. → K.M. |
| ☐ | Week-2 calibration session (15 July, 14:00 UK) on all 9 manager calendars | A.S. | Outlook invite, room booked | 9/9 accepts within 48 h; declines escalate | A.S. → K.M. |
| ☐ | Week-6 calibration session (12 August, 14:00 UK) on all 9 manager calendars | A.S. | Outlook invite, room booked | 9/9 accepts within 48 h | A.S. → K.M. |
| ☐ | Anchor call (GC-15, O.B. Manchester) shared with managers for pre-scoring | A.S. | Gong link + rubric PDF | Pre-scores received from ≥7/9 managers by Day -7 | A.S. → designer |

### Day -9 · Monday 22 June 2026

| ☐ | Checkpoint | Owner | Artefact | Signal | Escalation |
|---|---|---|---|---|---|
| ☐ | Sponsor email sent to CRO + sales-leadership group | K.M. | [`launch-comms-plan.md`](launch-comms-plan.md) §2 | Email + Slack cross-post visible; CRO acknowledgement within 48 h | K.M. → CRO direct |

### Day -7 · Tuesday 24 June 2026

| ☐ | Checkpoint | Owner | Artefact | Signal | Escalation |
|---|---|---|---|---|---|
| ☐ | All 6 SCORM modules uploaded to Sana, validated, marked Published | LMS admin | [`lms-deployment-runbook.md`](lms-deployment-runbook.md) §2 | Sana admin shows 6 published modules tagged `cohort-2026-07-W27` | LMS admin → designer |
| ☐ | All 10 prerequisites in deployment runbook §1 ticked off | LMS admin | [`lms-deployment-runbook.md`](lms-deployment-runbook.md) §1 | 10/10 sign-offs logged | LMS admin → A.S. |
| ☐ | Cohort enrollment list pulled from HRIS, matched to Okta group | LMS admin | Okta group `sdr-cohort-2026-07-W27` | Member count = HRIS new-hire count for hire_cohort `2026-07-W27` | LMS admin → People ops (D.R.) |
| ☐ | Sana enrollment API call executed; all reps see Module 1 locked in their queue | LMS admin | [`lms-deployment-runbook.md`](lms-deployment-runbook.md) §3 | API returns 201; spot-check 2 random reps confirms queue visible | LMS admin → designer |
| ☐ | L1 micro-pulse + L2 +7-day quiz scheduler tested end-to-end | LMS admin | `05-evaluate/l1-pulse-survey.md` (Phase 5 dep) | Accelerated test fires both instruments correctly | LMS admin → designer |

### Day -1 · Monday 30 June 2026

| ☐ | Checkpoint | Owner | Artefact | Signal | Escalation |
|---|---|---|---|---|---|
| ☐ | Cohort-1 welcome Slack DMs sent to each enrolled rep | A.S. (drafted by designer) | [`launch-comms-plan.md`](launch-comms-plan.md) §4 | 10–15 DMs sent; rep reactions within 4 h target | A.S. → manager of any non-responsive rep |
| ☐ | SCORM Cloud smoke test passes on all 6 modules | O.B. (designated SME runner) | [`lms-deployment-runbook.md`](lms-deployment-runbook.md) §4 | All 9 boxes ticked in smoke-test checklist | O.B. → designer (Mario) |
| ☐ | Slack channel `#sdr-cohort-2026-07-W27` topic + pinned message set | LMS admin | Channel pinned message includes links to runbook, comms, dashboard | Channel visible to all members, pinned message confirmed | LMS admin → designer |
| ☐ | Dashboard pre-flight: Salesforce `Ramp_Time__c`, `Pod__c`, `Tenure_Cohort__c` fields populated for all enrolled reps | J.V. (RevOps) | Dashboard `cohort-2026-07-W27` view | All reps appear in dashboard with Day-0 baseline values | J.V. → K.M. |

---

## Phase B · Cohort start + early ramp (Day 0 to Day +28)

### Day 0 · Tuesday 1 July 2026 · COHORT START

| ☐ | Checkpoint | Owner | Artefact | Signal | Escalation |
|---|---|---|---|---|---|
| ☐ | Module 1 (Diagnostic Opener / M1) unlocked at 09:00 local time per rep | Sana auto-trigger | Sana scheduler | First module launch within 60 min of unlock for ≥50 % of cohort | LMS admin → A.S. |
| ☐ | Designer on-call in `#sdr-cohort-2026-07-W27` for the day | Designer (Mario) | Slack presence | All reported issues triaged within 30 min during business hours | Designer → LMS admin |
| ☐ | First-completion check: at least 1 rep finishes Module 1 by EOD | A.S. | Sana completion report | ≥1 completion logged with `cmi.core.lesson_status = "completed"` | A.S. → designer if 0 completions |

### Day +7 · Tuesday 8 July 2026

| ☐ | Checkpoint | Owner | Artefact | Signal | Escalation |
|---|---|---|---|---|---|
| ☐ | Module 2 (Objection Acknowledge / M2) unlocked | Sana auto-trigger | Sana scheduler | All enrolled reps see Module 2 in queue | LMS admin → A.S. |
| ☐ | Module 1 +7-day retention mini-quiz fires for all reps who completed Module 1 on Day 0 | Sana auto-trigger | Sana scheduler | Quiz appears in queue; ≥70 % first-attempt mastery target (brief §5 L2) | LMS admin → designer (if mastery <60 %, flag rollback) |
| ☐ | L1 micro-pulse Module 1 data first-pass review | Designer | `05-evaluate/l1-pulse-survey.md` results | Mean "I could use this on a call today" ≥4.0 / 5 across first 5 responses | Designer → K.M. if <3.5 |

### Day +14 · Tuesday 15 July 2026 · WEEK-2 CALIBRATION

| ☐ | Checkpoint | Owner | Artefact | Signal | Escalation |
|---|---|---|---|---|---|
| ☐ | Module 3 (Calendar Close / M3) unlocked | Sana auto-trigger | Sana scheduler | All reps see Module 3 in queue | LMS admin |
| ☐ | Week-2 manager calibration session runs 14:00 UK · 60 min | A.S. facilitates · K.M. observes · designer holds rubric | [`manager-calibration-session-plan.md`](manager-calibration-session-plan.md) §1 | 9/9 managers attend; anchor-call inter-rater variance ≤1 point per row | A.S. → K.M. if attendance <7 or variance >1.5 |
| ☐ | Each manager has booked 4 call-review sessions per rep in their pod for weeks 3–6 | 9 pod managers | Outlook + pod 1:1 templates | All bookings visible in shared cadence tracker | A.S. → manager directly |
| ☐ | Rubric (`02-design/rubric-design.md`) introduced and printed/distributed to cohort SDRs | A.S. | A4 PDF | Every rep has the rubric; acknowledges in Slack DM | A.S. |

### Day +21 · Tuesday 22 July 2026

| ☐ | Checkpoint | Owner | Artefact | Signal | Escalation |
|---|---|---|---|---|---|
| ☐ | Module 4 (ICP Buyer Fit) unlocked | Sana auto-trigger | Sana scheduler | All reps see Module 4 in queue | LMS admin |
| ☐ | First manager-rubric scores landing in Salesforce `Call_Review__c` | J.V. | Salesforce object query | ≥10 rubric-scored calls logged across the 9 pods | J.V. → A.S. if <5 |

### Day +28 · Tuesday 29 July 2026

| ☐ | Checkpoint | Owner | Artefact | Signal | Escalation |
|---|---|---|---|---|---|
| ☐ | Module 5 (Product Prop Mapping) unlocked | Sana auto-trigger | Sana scheduler | All reps see Module 5 in queue | LMS admin |
| ☐ | L2 first-attempt mastery across modules 1–4 ≥80 % | Designer | `05-evaluate/l2-quiz-blueprint.md` data | Sana report shows ≥80 % first-attempt across the 4 modules | Designer → K.M. if <70 % on any single module |
| ☐ | Manager-side adoption check: 9/9 pods have logged ≥2 rubric-scored calls this week | A.S. | Salesforce `Call_Review__c` rollup | ≥18 rows for this week (4 × 9 / 2 = 18 floor) | A.S. → individual manager if pod = 0 |

---

## Phase C · Mid-cohort to first measurement (Day +35 to Day +60)

### Day +35 · Tuesday 5 August 2026

| ☐ | Checkpoint | Owner | Artefact | Signal | Escalation |
|---|---|---|---|---|---|
| ☐ | Module 6 (Regulatory Deflection) unlocked — last module of cohort 1 | Sana auto-trigger | Sana scheduler | All reps see Module 6 in queue | LMS admin |
| ☐ | Cohort-2 (`cohort-2026-08-W31`) prerequisites started — deployment runbook §1 reopened | LMS admin | [`lms-deployment-runbook.md`](lms-deployment-runbook.md) §1 | Runbook re-execution begun in parallel | LMS admin → designer |

### Day +42 · Tuesday 12 August 2026 · WEEK-6 CALIBRATION

| ☐ | Checkpoint | Owner | Artefact | Signal | Escalation |
|---|---|---|---|---|---|
| ☐ | Week-6 manager calibration session runs 14:00 UK · 60 min | A.S. facilitates · K.M. observes · designer holds rubric | [`manager-calibration-session-plan.md`](manager-calibration-session-plan.md) §2 | 9/9 managers attend; 3 cohort-1 sample calls scored with cross-pod variance ≤1 point per row; v2 rubric ambiguity log produced | A.S. → K.M. if variance >1.5 on any row |
| ☐ | Managers commit (in writing in the session) to ongoing 4-call-per-rep-per-month cadence | 9 pod managers | Session output doc | 9/9 commitments captured | A.S. |

### Day +60 · Sun 30 August 2026 · RAMP CHECKPOINT (L3 first measurement)

> Calendar note: Day +60 from 1 July lands on a Sunday. L3 measurement is **data-pull**, not a live session — pull date stays Day +60 (Sun 30 Aug) for arithmetic integrity. The follow-on manager review of the pull will run the next working Tuesday (1 Sept) to fit floor-schedule. L3 / L4 measurement dates remain anchored to actual Day +N.

| ☐ | Checkpoint | Owner | Artefact | Signal | Escalation |
|---|---|---|---|---|---|
| ☐ | L3 talk-track adherence (weeks 4–8 of cohort 1 ramp) first measurement pulled from Gong | J.V. + designer | Gong opener-tag adherence flag | Adherence ≥80 % across cohort (brief §5 L3 target) | Designer → K.M. if <70 % |
| ☐ | L3 objection-handling rubric mean score (week 4) | A.S. via manager rubric data | Salesforce `Call_Review__c` rollup | Mean ≥3.5 / 5 (brief §5 L3 target) | A.S. → K.M. if <3.0 |
| ☐ | Cohort-1 progress narrative drafted for K.M.'s monthly CRO update | Designer | `05-evaluate/monthly-evaluation-report.md` cohort-1 entry | Report delivered to K.M. by EOD Day +60 | Designer → K.M. |
| ☐ | Any cohort-1 SDR flagged red on rubric scores → manager 1:1 intervention plan in motion | 9 pod managers | Manager 1:1 notes | All red-flagged reps have an intervention plan documented | Manager → A.S. |

---

## Phase D · Retention checkpoint (Day +120)

### Day +120 · Thu 29 October 2026 · L4 FIRST MEASUREMENT

> Calendar note: Day +120 from 1 July is Thursday 29 October 2026. L4 measurement is a **data-pull + dashboard review**, not a live session — date stays anchored to actual Day +120 for measurement integrity. K.M. / J.V. / designer joint review may slide to the next Tuesday (3 Nov, Day +125) for diary reasons; the Day +N measurement timestamp does not move.

| ☐ | Checkpoint | Owner | Artefact | Signal | Escalation |
|---|---|---|---|---|---|
| ☐ | Cohort-1 day-120 retention measured from HRIS | J.V. (RevOps) | HRIS `Day_120_Retained` field rolled up | Retention ≥92 % across cohort 1 (brief §5 L4 6-month target) | J.V. → K.M. if <88 % |
| ☐ | Cohort-1 mean ramp-to-first-paid-quota computed (Salesforce `Ramp_Time__c`) | J.V. | Dashboard `cohort-2026-07-W27` view | Mean ≤71 days (brief §5 L4 6-month target) — noting first cohort gives partial signal only | J.V. → K.M. |
| ☐ | L4 dashboard 3-line view (cohort ramp · baseline ramp · marketing-lead-quality index) reviewed | K.M. + J.V. + designer | Dashboard L4 panel | Joint interpretation logged; D-008 attribution discipline applied | K.M. → CRO update prep |
| ☐ | Phase 6 iteration sprint for cohort 2/3 launched based on cohort-1 signals | Designer | `06-iterate/` cycle log | Sprint 6.1 scoped + scheduled | Designer → K.M. |

---

## Cross-cutting escalation policy

- **Any "Blocking" symptom from runbook §5.1** → LMS admin posts in `#sdr-cohort-2026-07-W27` within 30 min and tags designer + A.S.
- **L1 mean <3.5 / 5 on any module** → designer triages within 24 h; iteration sprint considers within 1 week.
- **L2 first-attempt <60 % on any module** → trigger runbook §5 rollback discussion.
- **Manager calibration variance >1.5 points on any row** → A.S. + designer co-design a v1.1 rubric anchor refinement within 1 week of the session.
- **K.M. or A.S. unavailable** → D.R. (Head of People) is sponsor backstop per brief §2.

## Owner accountability summary

| Role | Owns | Backup |
|---|---|---|
| K.M. (sponsor) | Sponsor email · L4 + L3 sign-off · CRO escalation | D.R. |
| A.S. (Head of SDR) | Manager pre-read · welcome DMs · calibration session facilitation · L3 rubric data | K.M. |
| LMS admin | Deployment runbook · Sana operations · enrollment · smoke-test · rollback | Designer (cohorts 1–2 only) |
| J.V. (RevOps) | Dashboard wiring · L4 data · Call_Review__c writes | K.M. |
| Designer (Mario) | Comms drafting · on-call for cohorts 1–2 · Phase 6 iteration trigger | LMS admin |
| 9 pod managers | Rubric scoring · 4 calls / rep / month · calibration session attendance | A.S. |
| D.R. (Head of People) | Contract / payment trigger sign-off at Phase 4 gate | — |

---

### References

- Brief: §3 (1 July hard date), §5 (L1/L2/L3/L4 cadence + targets), §8 (sponsor framing of measurement), §10.8 (manager calibration ask), §20 (risk register esp. row 1 marketing lead quality).
- Frameworks: Backwards Design (success signal before activity, per Wiggins & McTighe 2005) · Kirkpatrick L1–L4 cadence (2016) · LTEM tier-3 L1 (Thalheimer 2018, via D-003) · Spaced retrieval at Day +7 (Roediger & Karpicke 2006).
- Internal: [`README.md`](README.md) · [`launch-comms-plan.md`](launch-comms-plan.md) · [`lms-deployment-runbook.md`](lms-deployment-runbook.md) · [`manager-calibration-session-plan.md`](manager-calibration-session-plan.md) · `00-project-management/decisions-log.md` D-003, D-004, D-007, D-008 · `05-evaluate/*` (Phase 5 dependencies for L1/L2/L3/L4 instruments) · `06-iterate/*` (Phase 6 iteration sprint trigger).
