> Why this artefact: Translates K.M.'s kickoff commitments (brief §§4, 5, 8) into a Cathy Moore Action Map — *business goal → observable behaviours → barriers → only-then training*. Establishes the −25 % ramp compression and day-120 retention as the contractual L4, and isolates the three confounds K.M. pre-acknowledged so the eventual L4 attribution conversation is honest.

# Business goal analysis · Action Map

## 1 · The business case in K.M.'s own words

> "Ramp time for new SDRs is sitting at ~95 days to first paid quota attainment. Top decile hits it in ~52. Bottom quartile churns out before day 120 without ever paying for themselves. We need to compress mean ramp by 25 % and stop the bottom-quartile churn — losing two reps before they pay back costs us ~€90K each in unrecovered onboarding." — K.M., brief §4

> "I've committed −25 % ramp compression to the CRO. That's the public number. If we hit it, we hit it together. If we miss it, I need to know whether the cause was training or lead quality or comp, because the conversation with the CRO is honest either way." — K.M., brief §4

Two things are notable in that quote *as design inputs*:

- The L4 target is **public** — committed to the CRO, not just inside enablement. This raises the cost of an inflated attribution claim later.
- The sponsor pre-names three confounds (training, lead quality, comp) and asks for *honest* attribution. This is the trigger for decision `D-008`: L4 surfaces three lines on the dashboard, not one.

## 2 · Action Map · top-level

Following Moore (2017), the Action Map is read **right-to-left at design time** (start at the goal, end at training):

```
                       ┌──────────────────────────────┐
                       │  BUSINESS GOAL (L4)          │
                       │  Mean ramp ≤ 71 d (-25 %)    │
                       │  Day-120 retention ≥ 92 %    │
                       └──────────────┬───────────────┘
                                      │ enabled by
            ┌─────────────────────────┼─────────────────────────┐
            ▼                         ▼                         ▼
   ┌────────────────┐        ┌────────────────┐        ┌────────────────┐
   │ M1 Diagnostic  │        │ M2 Acknowledge │        │ M3 Calendar-   │
   │ opener within  │        │ objection in   │        │ close booked   │
   │ first 60 s     │        │ buyer's words  │        │ live on call   │
   └────────┬───────┘        └────────┬───────┘        └────────┬───────┘
            │                         │                         │
            │ blocked by              │ blocked by              │ blocked by
            ▼                         ▼                         ▼
  ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
  │ • No diagnostic  │     │ • Defensive arg  │     │ • "I'll follow   │
  │   pre-loaded     │     │   instinct       │     │   up" reflex     │
  │ • Pitch-launch   │     │ • No objection   │     │ • Calendar not   │
  │   reflex         │     │   inventory      │     │   in second tab  │
  │ • Reg-bank uncer-│     │ • Buyer-language │     │ • Comp SPIF      │
  │   tainty         │     │   reframing un-  │     │   distortion     │
  │   blocks open    │     │   practised      │     │   (env-only)     │
  └──────────────────┘     └──────────────────┘     └──────────────────┘
            │                         │                         │
            ▼                         ▼                         ▼
       training                  training                  training + env
```

## 3 · L4 commitments (the contract)

| Measure | Baseline | 6-month target | 12-month target | Source | Brief ref |
|---|---|---|---|---|---|
| Mean ramp to first paid quota | 95 d | ≤ 71 d (−25 %) | ≤ 65 d (−32 %) | Salesforce `Ramp_Time__c` | §5 |
| Day-120 retention | ~83 % | ≥ 92 % (churn ≤ 8 %) | ≥ 95 % (churn ≤ 5 %) | HRIS exit rollup + Salesforce | §5 |

**Economic frame.** K.M. estimates ~€90K unrecovered onboarding cost per pre-payback churn (§4). The brief does not document the derivation of that figure; we treat it as sponsor-stated, not independently audited, and we do **not** roll it forward into a Phillips-L5 ROI claim in v1 (per `frameworks-applied.md` §3 footnote).

## 4 · Observable behaviours that drive the goal

Source: A.S., brief §9 (top-vs-bottom delta) — the **only behaviour-level evidence in the brief that distinguishes top decile from bottom quartile across every Gong call**. The aggregate at §11 confirms it numerically (top decile M1: 8/8; bottom: 0/4).

> "Three things stand out from Gong reviews. One — top reps spend the first 60 seconds of every cold call asking one diagnostic question that exposes which pain to pitch against. The rest of them launch into the pitch in the first 15 seconds. Two — when the buyer pushes back, top reps re-state the objection back in the buyer's own words before responding. The rest of them argue. Three — top reps end every call with a written next step booked in the calendar before they hang up. The rest say 'I'll follow up.'" — A.S., §9

| Move | Observable behaviour | L3 metric | Gong tag |
|---|---|---|---|
| **M1** Diagnostic opener | Within the first 60 s, rep asks one ICP-specific diagnostic question (sourced from LinkedIn / Companies House) and *waits ≥ 3 s* for response. | `tag:diagnostic-opener` detection rate | §15.3 |
| **M2** Objection acknowledge | Rep restates the buyer's objection in the buyer's own words before responding. | `tag:objection-acknowledged` | §15.3 |
| **M3** Calendar-close | Calendar invite is *sent and accepted* before the call ends; `Next_Step_Booked__c` flips TRUE same-call. | `tag:calendar-booked` + Salesforce flag | §15.3 + §15.1 |

These three are the **keystone moves**. They are not the *only* behaviours that matter, but they are the only ones the brief has evidence-of-difference for. Anything else we add to training in Phase 2 has to clear a higher evidence bar.

## 5 · Barriers — Moore's "is it really training?" pass

For each behaviour, Moore asks: *would the person do it tomorrow if they wanted to and were rewarded for it?* If the answer is yes, it's not a training problem.

| Behaviour | Barriers | Training-fixable? | Environment-fixable? |
|---|---|---|---|
| M1 Diagnostic opener | (a) Rep doesn't know which diagnostic to pick for which ICP archetype. (b) Pitch-launch reflex under rejection-rate pressure. (c) Anxiety around partner-bank credibility silences openers. | Yes — (a) and (c) are knowledge + skill; (b) is skill under load | Partly — (b) is partly comp-driven |
| M2 Objection acknowledge | (a) Reframing the buyer's words is a *skill* (P.B. §10.4: "I argue. I know I'm not supposed to."). (b) No objection inventory pre-loaded. | Yes — (a) is part-task drillable; (b) is supportive information | No |
| M3 Calendar-close | (a) "Follow up" reflex. (b) Calendar not in second tab. (c) Comp plan rewards closed-won regardless of how booked. | Partly — (a) and (b) are training + tooling | Yes — (c) is comp redesign, RevOps-owned |

## 6 · The three named confounds (environment-only, surfaced not solved)

K.M. pre-acknowledged these in §8. They are documented here so the L4 attribution conversation can be honest:

### 6.1 · Lead quality

> "Lead quality is messy. Marketing-sourced inbound close-rate dropped 12 % → 8 % over the last two quarters. I've told the CMO. Not your problem, but I want you to know I know it's in the picture." — K.M., §8

- **Owner:** R.K. (CMO), with K.M. driving the conversation. Out of training scope (brief §6 out-of-scope #6).
- **L4 attribution impact:** if marketing-sourced close-rate keeps declining, **ramp time will worsen even with a perfect training intervention** because new reps spend more dials per paid quota. The L4 dashboard surfaces this as a third line per `D-008`.
- **Mitigation in training scope:** part-task practice on cold-outbound (not just inbound-warm) so reps are resilient to lower-quality top-of-funnel.

### 6.2 · Comp plan

> "Comp plan rewards closed-won regardless of source. New reps grind on stale leads chasing the SPIF rather than working the day-1 list. RevOps owns the redesign. I'm not asking you to fix it; I am asking you to surface it." — K.M., §8

- **Owner:** J.V. (RevOps), has redesign on Q3 roadmap (§17).
- **L4 attribution impact:** while SPIF rewards stale-lead closure, M3 (calendar-close on net-new) is *competing with the comp signal*. Training can teach the behaviour; the comp plan punishes it. This is an Action-Mapping environment-fix that must be flagged in every phase summary.
- **Mitigation in training scope:** Module 3 includes an explicit framing of "net-new pipeline is what gets you to ramp, even if the SPIF says otherwise" — a *motivational scaffold* (Dirksen) inside a *skill* module.

### 6.3 · Manager 1:1 cadence variance

> "Manager 1:1 quality varies massively. I've got pods where managers do 30-min weekly call reviews with rubrics, and pods where the manager hasn't sat in on a call in a month. If you can put a floor under that, the program lands. If you can't, the program lives on the LMS and never makes it into 1:1s." — K.M., §8

- **Owner:** A.S. (Head of SDR) for adoption; pod managers for execution.
- **L4 attribution impact:** the brief's own §9 evidence (pod-by-pod cadence table) shows ramp-rate variance follows manager-cadence variance. Without a floor, training delivered to LMS doesn't reach the call.
- **Mitigation in training scope (this is what K.M. is paying for):** shared 3-row rubric + week-2 and week-6 calibration sessions. **This is the only one of the three confounds that has a training-side lever.** Per `D-004`, the rubric is single-page, 3 rows × 5 anchors.

## 7 · What this analysis sends to Phase 2 (Design)

| Sends | To |
|---|---|
| The three keystone moves (M1/M2/M3) as terminal-outcome anchors | `learning-outcomes-abcd-bloom.md` |
| The training/environment split | `4cid-blueprint.md` task-class list (skips comp-fix and lead-quality-fix) |
| Manager rubric as the bridge artefact between training and the workflow | `rubric-design.md` |
| The three confounds as L4 dashboard "lines 2 + 3 + 4" (alongside cohort ramp) | `kirkpatrick-measurement-plan.md` |

## 8 · What is out of scope, by K.M.'s co-signature

Per §6 of the brief and `D-001`:

1. Regulatory / compliance training (KYC, AML, SCA, PSD2, GDPR) — Cornerstone team owns separate modules. We address *deflection* during a call, not the formal training.
2. Manager hiring + onboarding.
3. Mid-Market + Enterprise SDR motion.
4. Comp-plan redesign (RevOps).
5. CRM / tooling swap.
6. Marketing-source lead-quality fix.

## References

- Brief §§3, 4, 5, 6, 8, 9, 11, 14, 17, 19, 20.
- Moore, C. (2017). *Map it: The hands-on guide to strategic training design.* Montesa Press.
- Dirksen, J. (2015). *Design for how people learn* (2nd ed.). New Riders.
- Decisions `D-001`, `D-002`, `D-004`, `D-008`.
