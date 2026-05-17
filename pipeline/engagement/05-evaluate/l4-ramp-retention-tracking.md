# L4 ramp + retention tracking · dashboard + attribution spec

> Why this artefact: brief §5 fixes two L4 numbers (mean ramp ≤ 71 d; day-120 retention ≥ 92 %). K.M. publicly committed both to the CRO (§4, §8). D-008 binds the engagement to a *bounded* attribution stance — cohort comparison, not RCT — with three lines on the chart so confounds are visible. Brief §15 supplies the Salesforce / HRIS schema; §17 documents the SPIF confound; §20 lists lead-quality as risk row 1. Framework: Kirkpatrick L4 (#3) + Phillips ROI methodology, the cohort-comparison stance.

The L4 dashboard is the artefact K.M. shows the CRO. It has to be honest about what it can and cannot say.

---

## 1 · Headline KPIs (verbatim from brief §5)

| KPI | Baseline | 6-mo target | 12-mo target | Source |
|---|---|---|---|---|
| Mean ramp to first paid quota · rolling-4-cohort | 95 d | ≤ 71 d (−25 %) | ≤ 65 d (−32 %) | Salesforce `Ramp_Time__c` + `First_Paid_Quota_Date__c` |
| Day-120 retention · per hire cohort | ~83 % | ≥ 92 % | ≥ 95 % | HRIS `Day_120_Retained` joined to Salesforce `Tenure_Cohort__c` |

---

## 2 · Data sources

### 2.1 · Salesforce (existing schema, brief §15.1)

| Field | Type | Purpose |
|---|---|---|
| `Ramp_Time__c` | Number (days) | Days hire → first paid quota |
| `Tenure_Cohort__c` | Picklist | Onboarding cohort ID (e.g. `2026-Q3-W27`) |
| `Pod__c` | Picklist | UK-Manchester / UK-London-A / UK-London-B / UK-Belfast / DE-Berlin / DE-Munich / ES-Barcelona / NL-Amsterdam / IT-Milan |
| `First_Paid_Quota_Date__c` | Date | First paid commission date |
| `Next_Step_Booked__c` | Checkbox | TRUE if a calendar invite went out same-call (M3 proxy) |
| `Sequence_Completion_Rate` | Percentage | Outreach completion · used for SPIF-chasing detection |

### 2.2 · HRIS (BambooHR-equivalent, brief §15.2)

| Field | Type | Purpose |
|---|---|---|
| `Day_120_Retained` | Boolean | Computed nightly: TRUE if rep still active 120 days post-hire |
| `Hire_Date` | Date | Anchor for cohort grouping |
| `Pod` | String | Joined to Salesforce `Pod__c` |

### 2.3 · RevOps composite (existing, owned by J.V.)

| Field | Type | Purpose |
|---|---|---|
| `Marketing_Lead_Quality_Index` | Number 0–100 | Composite of close-rate, response-rate, SQL-ratio per CMO source. Pre-existing RevOps metric. |
| `SPIF_Activity_Flag` | Boolean | TRUE for any rep-month with `Sequence_Completion_Rate` > 90 % AND net-new pipeline below pod median |

---

## 3 · Dashboard layout

```
+-------------------------------------------------------------------------+
| L4 · Ramp & Retention · Rolling 4-cohort view · refresh: nightly        |
+-------------------------------------------------------------------------+
|                                                                         |
|  MEAN RAMP TO FIRST PAID QUOTA · target ≤ 71 d                          |
|   +--------------------------------------------------------+            |
|   |                                                        |            |
|   |      Line A (program cohorts) ────                     |            |
|   |      Line B (baseline / pre-program) ─ ─ ─             |            |
|   |      Line C (marketing lead-quality index) ····        |            |
|   |                                                        |            |
|   |  95d -----o-----o-----o-----o-----o-----o-----         |            |
|   |              o     o     o                             |            |
|   |              71d ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄       |            |
|   +--------------------------------------------------------+            |
|                                                                         |
|  DAY-120 RETENTION BY COHORT · target >= 92 %                           |
|   [Bar chart: each cohort retention rate, target line at 92 %]          |
|                                                                         |
|  POD-SEGMENTED RAMP  +  COHORT-SEGMENTED RAMP                           |
|   [Two side-by-side small-multiples grids: 9 pods × cohort waves]       |
|                                                                         |
|  CONFOUND WATCH                                                         |
|   > Marketing lead-quality index: [trend sparkline + delta vs Q-1]      |
|   > SPIF activity flag: [% reps with flag = TRUE this month]            |
|                                                                         |
+-------------------------------------------------------------------------+
```

---

## 4 · The three-line chart · D-008 implementation

K.M. §8 verbatim:

> "If we miss it, I need to know whether the cause was training or lead quality or comp, because the conversation with the CRO is honest either way."

The ramp chart carries three series:

1. **Line A · Program-cohort ramp.** Mean `Ramp_Time__c` for reps whose `Tenure_Cohort__c` falls inside or after `2026-Q3-W27` (first cohort live 1 July 2026 per brief §3). Rolling 4-cohort average to smooth noise.

2. **Line B · Baseline / pre-program ramp.** Same metric for reps whose `Tenure_Cohort__c` is before the program-live date and who are still inside their first 120 days at each measurement point. Anchored at the §5 baseline of 95 d for periods before the engagement.

3. **Line C · Marketing lead-quality index.** Inverted-scale overlay (so "improving lead quality" trends the same direction as "improving ramp" for visual parity). Confound visibility, not a target line.

**Interpretation matrix** — same as `kirkpatrick-measurement-plan.md` §4.1:

| Line A trend | Line B trend | Line C trend | Read |
|---|---|---|---|
| ↓ improving | ≈ flat | ≈ flat | Program works · clean attribution |
| ↓ | ↓ | flat | Org tailwind · program contribution unclear |
| ↓ | flat | ↑ | Lead-quality + program co-vary · not isolable |
| flat | flat | ↓ | Lead-quality drag masks program · escalate to CMO |
| ↑ worse | flat | flat | Program not landing · trigger Phase 6 sprint 6.1 + 6.2 |

---

## 5 · Segmentation views

### 5.1 · Pod-segmented

9 pods × rolling-4-cohort mean. Heatmap-style table. Flags any pod where:

- Pod-level mean ramp > 80 days, OR
- Pod-level retention < 88 %, OR
- Pod-level L3 manager rubric adherence (from `l3-call-rubric.md` flow) < 70 %.

A flagged pod triggers Phase 6 sprint 6.2.A — that pod's manager calibration.

### 5.2 · Cohort-segmented

Each cohort tracked as its own row, with month-by-month ramp progress. Top-decile and bottom-quartile sub-bands visible. Lets the sponsor see whether cohort N is doing better/worse than cohort N-1 — the only fair comparison while the org-wide baseline shifts.

---

## 6 · Refresh + ownership

| Component | Refresh | Owner |
|---|---|---|
| Line A · program-cohort ramp | Nightly | J.V. (RevOps) |
| Line B · baseline ramp | Weekly (recomputes the tail) | J.V. |
| Line C · lead-quality index | Weekly (RevOps existing job) | J.V. (data) · R.K. (interpretation) |
| Day-120 retention | Daily | D.R. (data) · J.V. (rollup) |
| Pod heatmap | Nightly | J.V. |
| Confound watch panel | Daily | J.V. |
| Monthly sponsor review | Monthly meeting | K.M. + M.B. + J.V. |

J.V. (RevOps Director) is the named L4 dashboard owner per brief §2 and master plan §5.

---

## 7 · Attribution caveats · what the dashboard does NOT claim

Per D-008 the dashboard does not assert causation. The following caveats are **printed in the dashboard footer**, every page, every export:

> *Attribution caveat. This dashboard uses a cohort-comparison design, not a randomised control trial. Movement in ramp time can reflect program effect, lead-quality drift, comp-plan dynamics, hiring-mix changes, or seasonality. Lines B and C are surfaced to support honest joint interpretation. Per K.M. (sponsor) §8: "the conversation with the CRO is honest either way."*

This carve-out exists because:

- **Sample size.** Cohort cadence is 10–15 reps per cohort (§3). Underpowered for inferential tests.
- **No control group.** Withholding training from new hires was rejected on ethical and operational grounds (D-008).
- **Pre-period data granularity.** Insufficient for difference-in-differences with synthetic control (D-008).

---

## 8 · SPIF / comp-plan confound flag (per brief §17)

K.M. §8 verbatim:

> "Comp plan rewards closed-won regardless of source. New reps grind on stale leads chasing the SPIF rather than working the day-1 list. RevOps owns the redesign. I'm not asking you to fix it; I am asking you to surface it."

**Detection.** A binary `SPIF_Activity_Flag` per rep-month, TRUE when:

- `Sequence_Completion_Rate` > 90 % (Outreach grind), AND
- Net-new pipeline below pod median for that month, AND
- A SPIF is active in the comp calendar for that month.

**Surface.** Confound watch panel shows `% reps with flag = TRUE this month`. If > 25 % of the cohort under review is flagged, the monthly report includes an explicit "L4 reading is influenced by active SPIF; comp-plan redesign is RevOps Q3 roadmap (§17)".

**What this is not.** It is not a punitive flag against reps. It is a flag against the *comp design*, surfaced to RevOps as documented K.M. ask. The flag is invisible to pod managers; it shows only in the sponsor-facing dashboard.

---

## 9 · Day-120 retention interpretation rules

| Cohort retention | Action |
|---|---|
| ≥ 92 % | On-target. No action. |
| 88–91.9 % | Within tolerance. Note in monthly report; watch trend. |
| 84–87.9 % | Below tolerance. Trigger qualitative pull: 1:1 exit interview review by D.R. + A.S. |
| < 84 % | Major regression. Triggers Phase 6 sprint 6.4 (attribution-recovery deep-dive) + emergency cohort review. |

**Exit-interview integration.** Per brief §10.5 the recent exit interview surfaced three reasons (no call feedback, public bottom-3 leaderboard, cold-call rejection rate). Each cohort exit gets a structured exit interview using the same three-bucket structure; results feed Phase 6.

---

## 10 · Phase-6 iteration triggers (from L4)

Mirrors `kirkpatrick-measurement-plan.md` §6:

| L4 signal | Phase-6 sprint |
|---|---|
| Program-cohort ramp improving, confounds quiet | No iteration · preserve content |
| Program-cohort ramp flat, confounds quiet | Sprint 6.3 — full content review |
| Program-cohort ramp worse | Sprint 6.1 + 6.2 — content + manager calibration |
| Confound flags active (lead-quality or SPIF) | Sprint 6.4 — attribution-recovery, NOT content change |
| Pod-level flag (any of the three pod thresholds) | Sprint 6.2.A — that pod's manager calibration |
| Cohort retention < 84 % | Sprint 6.4 + emergency exit-interview pull |

---

## References

- `case-study-tz.md` §3, §4, §5, §8, §10.5, §15.1, §15.2, §15.4, §17, §20
- `00-project-management/decisions-log.md` D-008
- `00-project-management/frameworks-applied.md` #3 (Kirkpatrick · Phillips)
- `05-evaluate/kirkpatrick-measurement-plan.md` §4
- `05-evaluate/l3-call-rubric.md` §4 (Call_Review__c rollup feeds pod-level adherence)
- Phillips, J. J. (2003). *Return on investment in training and performance improvement programs* (2nd ed.). Routledge.
