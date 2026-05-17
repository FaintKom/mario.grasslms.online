# L3 call-review rubric · M1 / M2 / M3 × 1–5

> Why this artefact: D-004 commits the manager rubric to exactly 3 rows × 5 anchored levels, single A4 page. Brief §8 is K.M. verbatim ("a single sheet with 3 rows (one per move) and 1–5 scoring with anchored descriptors"). Brief §10.6 J.T. and §10.8 confirm the highest-cadence pod managers already converged on this design and are waiting to adopt a calibrated version. Brief §10.1 M.G. examples + §11 Gong calls supply the anchors. Frameworks: criterion-referenced rubric (Wiggins & McTighe 2005), cognitive-load minimisation for the grader.

This is the single page managers print and keep on the desk for the 4-calls-per-rep-per-month review.

---

## 1 · One-page rubric (the actual artefact)

> **FinTechCard · SDR Call Review Rubric · v1.0**
> Rep: _________________ · Date of call: _________ · Reviewer: _________ · Gong call ID: GC-______
>
> Score each row 1–5. Circle the anchor that best matches what the rep did.

### Row 1 · M1 · Diagnostic opener (first 60 seconds)

| Score | Anchor |
|:-:|---|
| **1 — Absent** | Rep launches into pitch within 15 seconds. No diagnostic question. Example: "Hi, I'm calling from FinTechCard, our card is cheaper than your bank's." *(GC-19, GC-20 pattern.)* |
| **2 — Partial / wrong** | Generic question, no anchor to the buyer's specific situation. "Do you have a moment to talk about corporate spending?" *(GC-21 pattern.)* |
| **3 — Present but generic** | A diagnostic question is asked, but it could apply to any business. "Who currently approves expense reports?" — no buyer-specific anchor. |
| **4 — Specific + situational** | Diagnostic anchored to something observable about *this* buyer. "I noticed you've opened a second location in the last 6 months — who's approving expense reports across both stores now?" *(M.G. pattern, GC-01, GC-02, GC-07.)* |
| **5 — Anchored + buyer-back-in-buyer-words** | Specific diagnostic + the rep stays silent for ≥ 4 seconds to let the buyer answer, then re-states what the buyer said before continuing. *(M.G. §10.1 "5 seconds feels like an hour"; L.D. quant-anchored opener §10.2, GC-03, GC-06, GC-08.)* |

### Row 2 · M2 · Objection acknowledge

| Score | Anchor |
|:-:|---|
| **1 — Absent** | Rep argues with the objection. "But our fees are lower / our controls are better." *(GC-19, GC-20, P.B. §10.4 verbatim "I argue. I know I'm not supposed to.")* |
| **2 — Partial / wrong** | Rep deflects the objection ("let me come back to that") or talks past it. *(GC-12 pattern.)* |
| **3 — Present but generic** | Rep acknowledges in a textbook way: "I hear you." No buyer-specific re-statement. |
| **4 — Specific + situational** | Rep names the objection back accurately and waits for buyer to expand. "So you've got the card-issuing side sorted." Then silence. *(M.G. §10.1 verbatim, GC-01, GC-07.)* |
| **5 — Anchored + buyer-back-in-buyer-words** | Rep re-states in the buyer's exact phrasing, then asks the one question that surfaces the real broken thing. "So you've got the card-issuing side sorted — what's not working about it?" Buyer reveals actual pain. *(L.D. Brex-displacement, GC-06, GC-03; M.G. GC-01.)* |

### Row 3 · M3 · Calendar close

| Score | Anchor |
|:-:|---|
| **1 — Absent** | "I'll follow up." No calendar action. *(GC-10, GC-19, GC-20, GC-22 entire P.B. + exit-interview sample.)* |
| **2 — Partial / wrong** | "I'll send you some times by email." No live calendar move. *(GC-11 pattern.)* |
| **3 — Present but generic** | "Let me check my calendar and get back to you" or "When's good for you?" — calendar acknowledged but not opened live. |
| **4 — Specific + situational** | Rep names two specific slots from a live calendar. "Tuesday 11 or Thursday 2 — which works?" *(GC-05 partial; reaching for M.G. pattern.)* |
| **5 — Anchored + buyer-back-in-buyer-words** | Rep ties the slot to what the buyer just said. "You mentioned the bookkeeper is overwhelmed by Q-end — let me book 20 minutes Tuesday 11 to show your accountant the Xero sync." Calendar invite goes out same-call. *(M.G. §10.1 verbatim "I do not say I'll send you something"; GC-01, GC-02, GC-07, GC-08.)* |

> **Totals.** M1 ___ / 5 · M2 ___ / 5 · M3 ___ / 5 · **Total ___ / 15**
>
> **Coaching focus for next week:** the *lowest* row, not the average. Per J.T. §10.6: the rubric is a self-coaching tool, not a surveillance score.
>
> **Reviewer note (free text, ≤ 30 words):** _________________________________________________

---

## 2 · Scoring instructions for managers

1. **One rep, one call, one rubric.** Each rubric scores exactly one call. Do not average across calls inside a single rubric.
2. **Pick the closest anchor.** If the call sits between two anchors, score the lower of the two and note why in the free-text field.
3. **Score what was done, not what was intended.** "He was about to acknowledge but the buyer interrupted" → score the actual behaviour.
4. **Silence on M2 counts as M2 = n/a if there was no objection.** Record `n/a`; do not score it as 1. Brief §11 GC-04, GC-12 are precedents.
5. **The total is not the point.** The lowest row is the coaching focus. Total is for trend tracking only.

---

## 3 · Cadence (per brief §8 + master plan §3)

| Cadence | Action | Per rep | Per pod manager |
|---|---|---|---|
| **Weekly** | Manager listens to 1 call per rep | 1 / week | 4–6 / week (1 per direct report) |
| **Monthly** | 4 calls per rep scored on the rubric | 4 / month | 16–24 / month |
| **Quarterly** | Calibration session — all 9 pod managers score the same 3 sample calls | — | 3 calls × 9 managers |

The 4-calls-per-rep-per-month floor is K.M.'s explicit ask (§8). Managers in the highest-cadence pods (J.T. UK Pod 1, M.K. DE Pod 1) already exceed this; the floor is binding on the others.

---

## 4 · Data flow · Gong scorecards → Salesforce

```
[Manager listens to call in Gong]
        |
        v
[Manager opens Gong Scorecard "FTC · L3 · M1-M2-M3 v1.0"]
        |
        v
[3 row scores + free-text note saved in Gong]
        |
        v  (nightly sync, owned by J.V. / RevOps)
        v
[Salesforce custom object Call_Review__c]
   |- Call_ID__c            (Gong ID, GC-XXXX)
   |- Rep_ID__c             (Salesforce User lookup)
   |- Reviewer_ID__c        (Salesforce User lookup)
   |- Review_Date__c
   |- M1_Score__c           (number, 1-5)
   |- M2_Score__c           (number, 1-5 or null for n/a)
   |- M3_Score__c           (number, 1-5)
   |- Reviewer_Note__c      (long text)
   |- Pod__c                (denormalised picklist)
        |
        v
[Dashboard rollup: pod-level adherence + rep-level trend]
```

Schema additions to `Call_Review__c` are minimal (per §15.3 of the brief the object already exists with rubric scores destination). The `M1/M2/M3_Score__c` field naming is consistent with the auto-tag pattern in §15.3.

---

## 5 · Auto-tag vs rubric · two signals, jointly interpreted

| Signal | What it is | Cost | Noise | Used for |
|---|---|---|---|---|
| Gong auto-tag (`tag:diagnostic-opener` etc.) | NLP detects keyword pattern + structure | Free, nightly | High false-positive on M2 in particular | Aggregate trend lines (master plan §3) |
| Manager rubric score | Human judgement against anchors | ~5 min per call × 4 calls/rep/month | Low after calibration | Coaching + L3 dashboard scoring |

The two signals **must not be conflated**. The auto-tag drives the L3 *adherence* metric (brief §5 "talk-track adherence weeks 4–8 → ≥ 80 %"); the rubric drives the *quality* metric (§5 "objection-handling rubric → ≥ 3.5 / 5"). The dashboard surfaces both.

**Cross-check rule.** If Gong auto-tag adherence and manager rubric score diverge by > 1.5 points on the same call sample, recalibrate. Tag drift = first hypothesis.

---

## 6 · Anchored examples · provenance map

Every anchor at score 4 and 5 traces back to a real call or SME quote. If an anchor is updated, the source must update with it.

| Row | Score | Source |
|---|---|---|
| M1 | 4 | M.G. opener pattern, §10.1; GC-01, GC-02, GC-07 |
| M1 | 5 | M.G. + L.D. patterns, §10.1, §10.2; GC-03, GC-06, GC-08; the 5-second silence is M.G. verbatim |
| M2 | 4 | M.G. "card-issuing side sorted" §10.1; GC-01, GC-07 |
| M2 | 5 | L.D. Brex displacement §10.2; GC-03, GC-06; M.G. §10.1 |
| M3 | 4 | M.G. §10.1 "I have my calendar open in a second tab" |
| M3 | 5 | M.G. §10.1 closing move; GC-01, GC-02, GC-07, GC-08 |

---

## 7 · Calibration session structure (week-6, repeated quarterly)

60 minutes. All 9 pod managers + A.S. Three sample calls (one each at score 5, score 3, score 1 — chosen by A.S.). Each manager scores cold, then debate:

1. **Sample 1 (5 min listening + 5 min scoring + 10 min debate)** — calibration on the top end.
2. **Sample 2 (same structure)** — calibration on the middle.
3. **Sample 3 (same structure)** — calibration on the bottom.

Disagreements are not closed by vote; they're closed by clarifying the anchor wording. Updated anchors version-bump the rubric (v1.1, v1.2). Version history lives in `06-iterate/rubric-version-log.md`.

---

## 8 · Multilingual note (per brief §10.7 M.K. + §10.3 R.A.)

- v1 anchors are EN-only.
- ES + DE translations are a v2 deliverable (post-pilot, per brief §3).
- Phase 6 schedules the ES translation first (R.A. §10.3 explicit ask) and DE second (M.K. §10.7).
- Calibration sessions in the ES + DE pods continue in EN during v1; managers may discuss in local language but the rubric anchors stay in EN until v2.

---

## References

- `case-study-tz.md` §5, §8, §10.1, §10.2, §10.6, §10.7, §10.8, §11, §15.3, §18.2
- `00-project-management/decisions-log.md` D-004
- `00-project-management/frameworks-applied.md` #8 (Cognitive Load for grader)
- `05-evaluate/kirkpatrick-measurement-plan.md` §3
- Wiggins, G., & McTighe, J. (2005). *Understanding by Design* (2nd ed.). ASCD.
