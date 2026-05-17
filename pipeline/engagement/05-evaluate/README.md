# Phase 5 · Evaluate

> Why this artefact: the brief §5 commits the sponsor to public L4 numbers, and §7 forbids new tooling. This phase wires Kirkpatrick L1–L4 into the existing stack (Salesforce + Gong + HRIS + Sana) so every level traces back to a named data source and owner. Framework spine: Kirkpatrick / Phillips (frameworks-applied #3), reframed at L1 via Thalheimer LTEM (#12) per D-003, with L4 attribution bounded per D-008.

---

## Intent

K.M. publicly committed `−25 %` ramp compression (95 d → 71 d) and `83 % → 92 %` day-120 retention. This phase makes those numbers auditable. The evaluation plan does three things and no more:

1. **Measure at four levels** with instruments that are decision-relevant (not vanity).
2. **Wire each level to the existing stack** — Salesforce custom fields, Gong scorecards + tags, HRIS rollup, Sana SCORM cmi.
3. **Surface confounds explicitly** — marketing-lead-quality index + comp-plan SPIF activity flag — so a missed L4 number has an honest diagnostic, per K.M. verbatim:

> "If we miss it, I need to know whether the cause was training or lead quality or comp, because the conversation with the CRO is honest either way." (§8)

---

## Deliverables (this folder)

| File | Purpose |
|---|---|
| `kirkpatrick-measurement-plan.md` | Master plan, one table per level. Owners, cadence, baselines, targets, interpretation rules. |
| `l1-pulse-survey.md` | The LTEM-tier-3 instrument: one Likert + two open items. Coding rubric. Feed into Phase 6. |
| `l2-quiz-blueprint.md` | End-of-module quiz (≥80 %) + 7-day spaced retrieval mini-quiz (≥70 %). Sample items per module. |
| `l3-call-rubric.md` | 3-row manager call-review rubric (M1/M2/M3 × 1–5). Per D-004. Single A4 page. |
| `l4-ramp-retention-tracking.md` | L4 dashboard spec. Three-line attribution chart. SPIF + lead-quality confound flags. |
| `dashboard-spec.md` | Consolidated L1–L4 dashboard the sponsor reviews monthly. Phase-7 iteration triggers. |

---

## Gate criteria (from `master-plan.md` §5)

- [ ] L1 instrument deliberately *not* a smile-sheet (LTEM tier 3 minimum) · D-003
- [ ] L2 first-attempt + +7-day retention quizzes scheduled in Sana
- [ ] L3 rubric live in Gong scorecards; first calibration session run by week 16
- [ ] L4 dashboard updates nightly; named owner = J.V.
- [ ] L4 attribution caveats documented (three-line method) · D-008

---

## No-new-tooling constraint

Per §7 of the brief, no procurement is permitted. Every instrument below uses tooling FinTechCard already owns:

| Level | Instrument host | Existing tool |
|---|---|---|
| L1 | Post-module micro-pulse | Sana (built-in survey blocks) |
| L2 | SCORM quiz + 7-day mini-quiz | Sana (`cmi.core.score.raw`) |
| L3 | 3-row rubric | Gong scorecards → Salesforce `Call_Review__c` |
| L4 | Ramp + retention dashboard | Salesforce + HRIS rollup |

---

## References

- `case-study-tz.md` §5, §7, §8, §15, §17, §20
- `00-project-management/master-plan.md` §5
- `00-project-management/frameworks-applied.md` #3, #11, #12, #20
- `00-project-management/decisions-log.md` D-003, D-004, D-008
