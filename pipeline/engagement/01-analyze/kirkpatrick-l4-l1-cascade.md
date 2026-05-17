> Why this artefact: Reverse-engineers L4 → L3 → L2 → L1 from K.M.'s public commitments (brief §5) so every level traces upward to the L4 number she's accountable for to the CRO. Makes explicit the attribution caveats from `D-008` — L4 is associative, not causal — so the eventual sponsor conversation is honest in both directions.

# Kirkpatrick L4 → L1 cascade

## 1 · Why reverse-engineered, not designed forward

K.M. has committed the L4 number publicly to the CRO (brief §4). Every level below must trace upward to that number. We start at L4 and work *down*, so any level that doesn't enable the level above gets cut. This is the discipline Wiggins & McTighe's *Backwards Design* (Stage-1) pairs with Kirkpatrick.

## 2 · Cascade · per level

### Level 4 · Results

| L4 metric | Baseline | 6-month target | 12-month target | Source (brief §15.1, §15.2) | Cascade rationale |
|---|---|---|---|---|---|
| Mean ramp to first paid quota | 95 d (§1) | ≤ 71 d (−25 %) | ≤ 65 d (−32 %) | Salesforce `Ramp_Time__c` field | This is the **public CRO commitment** (§4 + §5). Every L3 must demonstrably enable faster ramp. |
| Day-120 retention | ~83 % (§1) | ≥ 92 % (churn ≤ 8 %) | ≥ 95 % (churn ≤ 5 %) | HRIS `Day_120_Retained` (boolean) + Salesforce | Each pre-payback churn ~€90K (§4). Retention is the *second* L4 to which L3 cascades. |

**Confounds** (per `D-008`):
- Marketing-source lead-quality decline (§8).
- Comp-SPIF distortion (§17).
- Manager-cadence variance — partly addressed by the rubric layer (§8).

The L4 dashboard surfaces **three lines** (per `D-008`): program cohort ramp, baseline ramp, marketing-lead-quality index. Movement is interpreted *jointly*, never in isolation.

### Level 3 · Behaviour (on-the-job)

| L3 metric | Baseline | 6-month target | 12-month target | Source | Cascade rationale (why this L3 enables this L4) |
|---|---|---|---|---|---|
| Talk-track adherence weeks 4–8 | ~52 % (§5) | ≥ 80 % | ≥ 85 % | Gong `tag:diagnostic-opener` adherence flag (§15.3) | A.S.'s §9 evidence shows M1 adherence distinguishes top from bottom decile on every Gong call. M1 → buyer engagement → call duration → demo bookings → paid quota → ramp. |
| Objection-handling rubric, week 4 | ~2.4 / 5 (§5) | ≥ 3.5 / 5 | ≥ 4.0 / 5 | Manager rubric (3-row, built in Phase 2; per `D-004`) | M2 (objection acknowledge) is the hinge for hostile cold calls (Class 3 in `task-inventory.md`). Without M2, calls die at 0:30 (per §11 bottom-quartile avg 0:31). |
| Calendar-close rate (M3) | Implied 0 % bottom · 88 % top from §11 (7/8) | ≥ 60 % mid-band | ≥ 75 % mid-band | Gong `tag:calendar-booked` + Salesforce `Next_Step_Booked__c` | M3 directly creates pipeline. Booked-same-call = no re-engagement-from-cold-attrition. Pipeline → paid quota → ramp. |
| Manager rubric coverage (4 calls/rep/month) | 0 % outside J.T./M.K. pods (§9) | 9/9 pods adopting | 9/9 pods sustained | Gong scorecards → Salesforce `Call_Review__c` (§15.3) | Per K.M. §8: "If you can put a floor under that, the program lands." The rubric is the L3-evidence vehicle *and* the manager-cadence floor. |

**Cascade rationale at L3:** these four metrics, jointly, are the leading indicators of L4 ramp. The §11 evidence is the strongest link in the brief between behaviour and outcome (top decile hits all three moves; bottom hits none; ramp diverges accordingly).

### Level 2 · Learning

| L2 metric | Baseline | 6-month target | 12-month target | Source | Cascade rationale (why this L2 enables this L3) |
|---|---|---|---|---|---|
| SCORM module quiz mastery, first attempt | n/a — new instrument | ≥ 80 % | ≥ 85 % | Sana `cmi.core.score.raw` (§5 + §16) | First-attempt mastery shows the rep *can* identify the move in context. Without identification, behaviour can't follow. |
| Spaced retrieval at +7 d | n/a | ≥ 70 % | ≥ 75 % | LMS-scheduled mini-quiz (§5) | Per Roediger & Karpicke 2006: +7-day retrieval predicts long-term behavioural carryover. K.M.'s explicit ask (§5). |
| Part-task drill completion rate | n/a | ≥ 95 % per drill | ≥ 95 % | Sana SCORM activity tracking | Drills D1–D6 (per `task-inventory.md`) automate sub-skills so working memory frees up for the live call (per `cognitive-load-analysis.md`). |

**Cascade rationale at L2:** the L2 instruments test whether the rep has built the schemas in *germane load* terms (per `cognitive-load-analysis.md` §5). If L2 doesn't move, L3 won't — there's nothing to deploy.

### Level 1 · Reaction (LTEM tier-3, *not* satisfaction)

Per `D-003`: L1 is *not* a smile-sheet. It is a Thalheimer LTEM tier-3 (decision-relevant feedback) instrument.

| L1 instrument | Baseline | 6-month target | 12-month target | Source | Cascade rationale (why this L1 enables this L2) |
|---|---|---|---|---|---|
| "I could use this on a call today" (Likert 1–5) | n/a | ≥ 4.0 / 5 (§5) | ≥ 4.2 / 5 | Post-module micro-pulse (Thalheimer 2018) | Decision-relevant intent predicts engagement → completion → mastery. The §5 wording is already application-intent, not satisfaction. |
| Open question: "the move I'm most likely to forget" | n/a | Coded weekly | Coded weekly + L2 retention correlation | Free text → coded by Mario weekly | Surfaces specific schema-fragility per cohort. Feeds Phase 6 iteration. |
| Open question: "what I'd remove" | n/a | Coded weekly | Same | Free text | Surfaces extraneous-load violations the designers missed. |

**Cascade rationale at L1:** if reps say "I couldn't use this," L2 mastery will be hollow — they aren't engaging with the schema-construction. L1 is the earliest leading indicator we have (within 30 s of module completion).

## 3 · The full cascade — one table

| Level | Headline metric | 6-mo target | Enables → next level (chain of logic) |
|---|---|---|---|
| L1 | "Use it on a call today" Likert | ≥ 4.0 / 5 | If reps see decision-relevance, they engage → L2 mastery |
| L2 | First-attempt SCORM mastery | ≥ 80 % | If reps build schemas, they can perform → L3 behaviour |
| L2 | +7-day retention | ≥ 70 % | Schemas persist into the workflow → L3 sustained |
| L3 | M1 adherence (talk-track) | ≥ 80 % | M1 starts the call right → conversation continues → L4 ramp |
| L3 | M2 rubric score | ≥ 3.5 / 5 | M2 keeps the call alive past objection → L4 |
| L3 | M3 calendar-close (mid-band) | ≥ 60 % | M3 creates pipeline → L4 paid quota |
| L3 | Rubric coverage 9/9 pods | 100 % | Feedback loop closes → L4 retention (no exit-interview-style 6-week silence) |
| L4 | Mean ramp | ≤ 71 d | The contractual goal |
| L4 | Day-120 retention | ≥ 92 % | The contractual goal |

## 4 · Attribution caveats — per `D-008`

This cascade is *associative, not causal*. The brief itself names three confounds (§8 + §17 + §20). The L4 dashboard treats them as visible peer-lines, not invisible noise:

| Confound | Effect on L4 | How surfaced |
|---|---|---|
| Marketing lead quality declined 12 % → 8 % close-rate | Worsens ramp regardless of training | Third dashboard line: lead-quality index (J.V. supplies) |
| Comp-SPIF distorts toward stale leads | Suppresses M3 net-new behaviour | Fourth dashboard line: `Sequence_Completion_Rate` (§15.4) high + conversion low = SPIF-chasing flag |
| Manager-cadence variance | Suppresses L3 → L4 transfer in low-cadence pods | Cadence dashboard (per pod) — A.S. owns visibility |

**Quasi-experimental design** (rejecting RCT per `D-008`):

- **Cohort comparison:** pre-program baseline ramp cohort vs post-program cohort 1–4.
- **Pod-level slice:** ramp by pod, controlled against pod-cadence variable.
- **Time-series:** baseline → cohort-1 → cohort-2 etc. on rolling 4-cohort average (per brief §21 "rolling-4-cohort average").

This gives an *honest direction-of-effect*, not a clean causal claim. K.M.'s §4 quote — "I need to know whether the cause was training or lead quality or comp" — is satisfied by surfacing the three confounds visibly, not by adjusting them away.

## 5 · The cascade backwards — what would falsify this design

A useful sanity check: at each level, what *evidence would prove this program did not cause the L4 improvement*?

| Level | Falsifier |
|---|---|
| L4 | Mean ramp ≤ 71 d hit, but lead-quality index recovered the same amount → confound explains result. |
| L3 | M1 adherence > 80 %, but ramp unchanged → adherence is being scored without the schema (gaming the metric). |
| L3 | Rubric coverage 9/9, but no inter-rater reliability (managers grade differently) → calibration sessions failed. |
| L2 | First-attempt mastery 80 %, +7-day retention < 50 % → schemas built but not durable. |
| L1 | "Could use today" ≥ 4.0 but L2 < 60 % → reps liked the feel, didn't engage with the content (the slide-deck failure mode K.M. flagged). |

These falsifiers are baked into the Phase 5 monthly evaluation report as explicit check items.

## 6 · Phillips L5 — explicitly NOT committed in v1

Per `frameworks-applied.md` §3 footnote and `D-001`:

- K.M.'s €90K-per-churn figure (§4) is sponsor-stated, not externally audited.
- Phillips L5 (ROI) requires defensible cost inputs the brief does not provide.
- We surface the ROI math in `05-evaluate/` appendix; we do not commit to it as a phase-gate metric.

If K.M. asks for L5 mid-engagement, the conversation is: "We'll need to audit the €90K input first. Once audited, we can run the math; until then we can show *cost avoided per retained rep* as a directional indicator."

## 7 · What this cascade sends downstream

| Sends | To |
|---|---|
| L1/L2/L3/L4 metric definitions + sources | Phase 5 `05-evaluate/kirkpatrick-measurement-plan.md` |
| L2 instrument design (mastery + +7-day retention) | Phase 2 `02-design/assessment-design.md` |
| L3 rubric design (3-row, 1–5 anchors) | Phase 2 `02-design/rubric-design.md` |
| L1 instrument design (Likert + 2 open questions) | Phase 2 `02-design/assessment-design.md` |
| The three-confound dashboard architecture | Phase 5 sprint 5.3 (J.V. dashboard wiring) |
| Falsifiers list | Phase 5 monthly evaluation report template |

## 8 · Sponsor-facing summary (what the L4 dashboard reads in one sentence)

> "After 4 cohorts, mean ramp is X days against a baseline of 95 and a target of 71; day-120 retention is Y % against 83 % baseline and 92 % target. Marketing lead-quality has moved Z % over the same period; comp-SPIF distortion as measured by sequence-completion-vs-conversion is W. Manager-rubric coverage stands at N of 9 pods sustained."

This is the L4 narrative K.M. takes to the CRO at month 6. Per `D-008` and §4, the honesty of those numbers — including their confounds — is the engagement's actual deliverable.

## References

- Brief §§1, 4, 5, 8, 9, 11, 14, 15.1, 15.2, 15.3, 15.4, 17, 20, 21.
- Kirkpatrick, D. L., & Kirkpatrick, J. D. (2016). *Kirkpatrick's Four Levels of Training Evaluation.* ATD.
- Phillips, J. J. (2003). *Return on investment in training and performance improvement programs* (2nd ed.). Routledge.
- Thalheimer, W. (2018). *The Learning-Transfer Evaluation Model.* Work-Learning Research.
- Wiggins, G., & McTighe, J. (2005). *Understanding by Design* (2nd ed.). ASCD.
- Roediger, H. L., & Karpicke, J. D. (2006). *Perspectives on Psychological Science*, 1(3), 181–210.
- Decisions `D-001`, `D-003`, `D-004`, `D-008`.
