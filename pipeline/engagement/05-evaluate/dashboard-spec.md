# Consolidated L1–L4 dashboard · monthly sponsor view

> Why this artefact: K.M. (sponsor) reviews progress monthly with the CRO conversation in view (brief §4, §8). This dashboard consolidates the four-level signal into one screen so a missed L4 number is read alongside its leading indicators and its confounds. Frameworks: Kirkpatrick four levels (#3) · Phillips evaluation (D-008) · LTEM tier-3 framing for L1 (#12, D-003) · cognitive-load minimisation for the sponsor as the reader.

The dashboard is a single screen. Top-to-bottom, the sponsor sees the headline number, then leading indicators, then the confound check, then the decision rules that fire from this view.

---

## 1 · Wireframe (top-to-bottom)

```
+----------------------------------------------------------------------------------+
| FinTechCard · SDR Onboarding · L1-L4 Dashboard                                   |
| Cohort window: rolling 4 cohorts · refresh: nightly · monthly review with K.M.   |
+----------------------------------------------------------------------------------+

[ TILE 1 · HEADLINE · MEAN RAMP TO FIRST PAID QUOTA ]
+---------------------------+
| 95d --> 71d target        |
|                           |
|   o-o-o-o-o-o-o 73 d      |
|                  - - - -  |
|                  baseline |
|   target line at 71 d     |
+---------------------------+
Rolling 4-cohort mean. Confound caveat applies (see Tile 7).

[ TILE 2 · DAY-120 RETENTION BY COHORT · TARGET >= 92 % ]
+---------------------------------------------------------------+
| Cohort 1 (Jul) ################  94%                          |
| Cohort 2 (Aug) ###############   90%   ! within tolerance     |
| Cohort 3 (Sep) ################  93%                          |
| Cohort 4 (Oct) ################  92%                          |
+---------------------------------------------------------------+

[ TILE 3 · L3 ADHERENCE BY POD · HEATMAP · FLAG ANY POD < 70 % ]
+---------------------------------------------------------------+
| Pod                  | M1 % | M2 % | M3 % | Rubric mean       |
|----------------------|------|------|------|-------------------|
| UK-Manchester (J.T.) |  87  |  82  |  85  | 4.1               |
| UK-London-A (H.M.)   |  74  |  68  |  71  | 3.4  !            |
| UK-London-B (F.O.)   |  79  |  72  |  76  | 3.6               |
| UK-Belfast (D.W.)    |  62  |  58  |  64  | 2.9  !! sprint 6.2.A |
| DE-Berlin (M.K.)     |  85  |  81  |  83  | 4.0               |
| DE-Munich (S.B.)     |  73  |  70  |  72  | 3.5               |
| ES-Barcelona (I.C.)  |  76  |  71  |  74  | 3.5               |
| NL-Amsterdam (T.V.)  |  82  |  78  |  80  | 3.8               |
| IT-Milan (G.R.)      |  72  |  68  |  70  | 3.4  !            |
+---------------------------------------------------------------+

[ TILE 4 · L2 · FIRST-ATTEMPT + 7-DAY RETENTION BY MODULE ]
+---------------------------------------------------------------+
| Module                          | First-attempt | +7d         |
|---------------------------------|---------------|-------------|
| 1 · Diagnostic Opener (M1)      |  84 %         |  76 %       |
| 2 · Objection Acknowledge (M2)  |  79 %  !      |  68 %  !    |
| 3 · Calendar Close (M3)         |  88 %         |  78 %       |
| 4 · ICP Buyer Fit               |  82 %         |  73 %       |
| 5 · Product Prop Mapping        |  85 %         |  75 %       |
| 6 · Regulatory Deflection       |  90 %         |  81 %       |
+---------------------------------------------------------------+

[ TILE 5 · L1 · APPLICATION-INTENT BY MODULE (LTEM TIER 3) ]
+---------------------------------------------------------------+
| Module                          | Q1 mean / 5  | Response rate |
|---------------------------------|--------------|---------------|
| 1 · Diagnostic Opener (M1)      |  4.3          |  88 %        |
| 2 · Objection Acknowledge (M2)  |  3.8  !       |  86 %        |
| 3 · Calendar Close (M3)         |  4.2          |  89 %        |
| 4 · ICP Buyer Fit               |  4.1          |  84 %        |
| 5 · Product Prop Mapping        |  4.0          |  85 %        |
| 6 · Regulatory Deflection       |  4.4          |  90 %        |
+---------------------------------------------------------------+
Top 2 themes (Module 2): forgotten-move:acknowledge-first, friction-point:transcript-length. Full verbatim in monthly report.

[ TILE 6 · CONFOUND WATCH · D-008 ]
+---------------------------------------------------------------+
| Marketing lead-quality index (R.K. source)                    |
|   Q-1: 72  -->  This month: 69  (down 3 pts)  ! trending down |
|                                                                |
| SPIF activity flag                                             |
|   18 % of cohort reps flagged this month                      |
|   (threshold for escalation: > 25 %)                          |
+---------------------------------------------------------------+

[ TILE 7 · ATTRIBUTION CAVEAT · footer on every export ]
+---------------------------------------------------------------+
| This dashboard uses a cohort-comparison design, not an RCT.   |
| Movement can reflect program effect, lead-quality drift,      |
| comp dynamics, hiring mix, or seasonality. Lines B + C in     |
| Tile 1 + the confound panel exist for honest joint reading.   |
| Per K.M. §8: "the conversation with the CRO is honest         |
| either way."                                                  |
+---------------------------------------------------------------+

[ TILE 8 · PHASE-7 ITERATION TRIGGERS · WHAT FIRED THIS MONTH ]
+---------------------------------------------------------------+
| !! UK-Belfast adherence < 70 %  ->  Sprint 6.2.A (D.W. calib.)|
| !  Module 2 first-attempt 79 %  ->  Sprint 6.1.B (item review)|
| !  Module 2 +7d retention 68 %  ->  Sprint 6.1.C (retrieval)  |
| !  Module 2 L1 = 3.8            ->  Sprint 6.1.A (M2 redesign)|
+---------------------------------------------------------------+
```

> **Numbers above are illustrative placeholders — synthetic data for wireframe purposes only (e.g., UK-Belfast 62 %, Module 2 L1 = 3.8, lead-quality 72 → 69).** The live dashboard reads from Salesforce + Sana + HRIS nightly.

---

## 2 · Reading order (intentional)

The sponsor reads top-to-bottom and the order matches K.M.'s framing in §8:

1. **Tile 1 (L4 ramp)** — the public number. The CRO conversation hangs on this.
2. **Tile 2 (L4 retention)** — the second public number; trails L1–L3 in lag time so it's listed second.
3. **Tile 3 (L3 by pod)** — the leading behaviour indicator. K.M. §8: "If you can put a floor under [manager 1:1 quality], the program lands." Pod-level visibility is the heart of L3.
4. **Tile 4 (L2 by module)** — the learning signal. Earliest signal of content vs delivery problem.
5. **Tile 5 (L1 by module)** — the fastest signal (within hours of module completion). LTEM tier 3, not satisfaction.
6. **Tile 6 (confound watch)** — the lead-quality + SPIF check K.M. explicitly asked for (§8).
7. **Tile 7 (attribution caveat)** — footer band, always visible. D-008.
8. **Tile 8 (iteration triggers)** — the decision rules that fired this month. Maps directly to `06-iterate/` sprints.

---

## 3 · Phase-7 iteration trigger decision rules

These are the rules that populate Tile 8. Single source of truth lives in `kirkpatrick-measurement-plan.md` §6 and in this dashboard; if they ever drift, this file is overridden by the measurement plan.

| Signal | Threshold | Sprint in `06-iterate/` |
|---|---|---|
| L1 module Q1 mean | < 3.5 | 6.1.A · worked-example pass |
| L1 theme `forgotten-move` cited by ≥ 30 % | per cohort | spaced-retrieval item added |
| L1 theme `friction-point` cited ≥ 3 times same issue | per quarter | 6.1.D · UX-trim pass |
| L2 first-attempt | < 70 % on any item | 6.1.B · item rewrite |
| L2 first-attempt | < 75 % on a module | 6.1.B · content review |
| L2 +7-day | < 60 % | 6.1.C · spaced-retrieval redesign |
| L3 pod adherence (any move) | < 70 % | 6.2.A · pod manager calibration |
| L3 rubric row mean | < 3.0 | 6.2.B · that move's job-aid rebuild |
| L4 program cohort ramp + confounds quiet | ramp flat or worse | 6.3 · full content review |
| L4 confound flags | active | 6.4 · attribution-recovery (NOT content change) |
| L4 cohort retention | < 84 % | 6.4 + emergency exit-interview pull |

---

## 4 · Cadence

| Frequency | Action |
|---|---|
| Nightly | All tiles refresh from Salesforce + Sana + HRIS |
| Weekly | M.B. codes L1 free-text themes; updates Tile 5 themes |
| Monthly | K.M. + M.B. + J.V. dashboard review (60 min) |
| Quarterly | Confound joint review with K.M. + R.K. (CMO) + J.V. (RevOps) |

The monthly review produces a one-page text report attached to the dashboard export. Template lives in `06-iterate/monthly-report-template.md` (Phase 6 deliverable).

---

## 5 · Access + permissions

| Role | Access |
|---|---|
| K.M. (sponsor) | Full read |
| D.R. (Head of People) | Full read |
| J.V. (RevOps · owner) | Full read + write (data sources) |
| A.S. (Head of SDR) | Full read + pod-level drill |
| Pod managers (9) | Their pod only · Tiles 3, 4, 5 (read) · cannot see Tile 6 confound or Tile 7 caveat tile |
| Reps | Their own L2 score · no L3/L4 access |

The SPIF flag (Tile 6) is invisible to pod managers by design — it flags the *comp design*, not reps (per `l4-ramp-retention-tracking.md` §8). Restricting it to sponsor-tier read keeps the flag in the policy conversation, not the coaching conversation.

---

## 6 · What this dashboard deliberately does **not** show

To prevent vanity-metric drift:

1. **No NPS or satisfaction score.** Per D-003 + K.M. §8 anti-smile-sheet stance.
2. **No "engagement minutes" or completion-time metrics.** Per brief §8 K.M. verbatim: "Another Articulate slide-deck no one finishes" — time-on-task is not transfer.
3. **No leaderboards.** Per exit-interview §10.5: "Every Monday I was bottom 3 and everyone could see it." A.S. + K.M. signed off on no public leaderboards in v1.
4. **No per-rep L1/L2 names visible to managers.** L1 is anonymised (per `l1-pulse-survey.md` §7); L2 per-rep is shown only to the rep + their direct manager, not pod-wide.

---

## 7 · Failure modes the dashboard guards against

| Failure mode | Guard |
|---|---|
| Sponsor sees green L4 but program is not the cause | Tile 6 confound watch + Tile 7 attribution caveat |
| Manager pressure on L1 scores → reps fake satisfaction | Q1 is intent-of-use, not satisfaction; manager visibility on L1 is aggregated per module, not per rep |
| L2 mastery declines silently because items are easy | Item p-value quality check in `l2-quiz-blueprint.md` §7 |
| Pod hides behind average | Pod heatmap (Tile 3) breaks the average |
| Confound (lead-quality / SPIF) drives a false attribution argument | Three-line chart + binary flag in Tile 6 |
| K.M. exits org during engagement | Decisions log + signed phase-gate docs preserve the trail (§20 risk) |

---

## References

- `case-study-tz.md` §4, §5, §8, §10.5, §15, §17, §20
- `00-project-management/decisions-log.md` D-003, D-004, D-008
- `00-project-management/master-plan.md` §5
- `00-project-management/frameworks-applied.md` #3, #11, #12
- `05-evaluate/kirkpatrick-measurement-plan.md` §6 (single source of truth for iteration triggers)
- `05-evaluate/l1-pulse-survey.md` · `l2-quiz-blueprint.md` · `l3-call-rubric.md` · `l4-ramp-retention-tracking.md`
- `06-iterate/` (Phase 6 sprints triggered from Tile 8)
