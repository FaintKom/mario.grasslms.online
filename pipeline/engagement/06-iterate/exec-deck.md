> *Portfolio case study · FinTechCard is an anonymised composite · numbers projected from real-shape baselines, not measured outcomes from a shipped engagement.*
>
> *Written in K.M.'s voice (the sponsor presenting to the CRO). First-person "I" throughout = K.M., not Mario. Reconstructed from the engagement brief §10.1 (sponsor quotes) and the results table in §05; honest-confound disclosure preserved per D-008.*

> Why this artefact: Brief §21 done-state lands 6 months after first cohort live. K.M. owes the CRO a review at that point. Per brief §8 K.M. committed the −25 % ramp compression publicly to the CRO; the deck must report honestly, including confound disclosure per D-008. Frameworks: Kirkpatrick L1–L4 reporting cascade + Phillips Phase-7 stakeholder reporting + LTEM tier-3 honest application-intent (per D-003). Format: one H2 = one slide, 10 slides total.

---

# 6-month review · CRO deck (K.M. presenting)

---

## Slide 1 · The problem (K.M.'s words, May 2026)

> "Ramp time for new SDRs is sitting at ~95 days to first paid quota attainment. Top decile hits it in ~52. Bottom quartile churns out before day 120 without ever paying for themselves. We need to compress mean ramp by 25 % and stop the bottom-quartile churn — losing two reps before they pay back costs us ~€90K each in unrecovered onboarding."

> "I've committed −25 % ramp compression to the CRO. That's the public number. If we hit it, we hit it together. If we miss it, I need to know whether the cause was training or lead quality or comp, because the conversation with the CRO is honest either way."

Two KPIs: **days-to-first-paid-quota** (Salesforce) + **day-120 retention** (HRIS).

---

## Slide 2 · What we built

A 0–60 day SDR onboarding program organised as **six SCORM 1.2 modules** running inside a **mini-OS shell** that simulates the rep's actual workspace: Outreach, Gong, Salesforce, LinkedIn / Companies House, Calendar, Phone-dialler, Slack. Each module is ≤ 10 minutes, slots between live calls, and teaches one of the three keystone moves identified from Gong analysis of 22 calls across top, mid, and bottom-quartile reps:

- **M1** — diagnostic opener (the first 60 seconds)
- **M2** — objection acknowledgement (re-state in the buyer's own words)
- **M3** — calendar close (next step booked before hang-up)

Manager-side: a 3-row × 5-anchor call-review rubric on a single A4 page, paired with week-2 + week-6 calibration sessions. Designed jointly with J.T. (UK Pod 1) and M.K. (DE Pod 1) — the two highest-cadence managers.

*[Photo placeholder: mini-OS screenshot — Module 1 mid-session, Outreach + Gong + LinkedIn windows visible inside the shell. Asset path: `03-develop/scorm-shell/assets/screenshots/m1-session.png`]*

---

## Slide 3 · The frameworks

Three load-bearing frameworks the rest of the build hangs off. The full list (20 named, 8 explicitly rejected, with citations) lives in [`frameworks-applied.md`](../00-project-management/frameworks-applied.md).

| Framework | Why it matters for this number |
|---|---|
| **ADDIE** | Phase structure aligned 1:1 to the 25 / 50 / 25 payment schedule — every payment trigger is a signed gate with evidence on file. |
| **Kirkpatrick L1–L4 + Phillips** | The reason this slide can show real numbers next month and not just commitments. L4 wired to Salesforce + HRIS; L3 to Gong; L2 to Sana; L1 to a tier-3 LTEM pulse. |
| **Action Mapping (Moore)** | The reason we caught lead quality + comp-plan distortion at kickoff and put them on the right owners' plates. Training is what we shipped; environment is what K. shipped — both had to move. |

---

## Slide 4 · The cohort timeline

Per brief §21 done-state: **4 cohorts shipped · ~50 SDRs through the program by 15 Dec 2026.**

| Cohort | Live date | Reps | EN/ES/DE | Key event |
|---|---|---|---|---|
| Pre-launch baseline | Pre-July 2026 | ~30 hires (12-month trailing) | EN | Baseline ramp = 95 d, retention ~83 % |
| Cohort 1 | 1 Jul 2026 | 12 | EN | First cohort; week-2 + week-6 calibrations |
| Cohort 2 | 29 Jul 2026 | 14 | EN | First content-refresh sprint (Module 4 worked example) — Sprint 6.2 (rubric recalibration, M2 anchors) fired Sept |
| Cohort 3 | 26 Aug 2026 | 13 | EN | First trailing-4 L4 read; ES rubric translation ships (Ask 1 from §9 A.S.) — Sprint 6.5 fired Oct |
| Cohort 4 | 23 Sep 2026 | 11 | EN | DE bilingual cheat sheet ships (M.K. ask, §10.7); 4th cohort completes the §21 done-state |
| 6-month review | 15 Dec 2026 | n=50 reps cumulative | — | This deck |

---

## Slide 5 · L4 results (ramp + retention, with confound caveats)

| Metric | Baseline | 6-month target | 6-month actual (synthetic) | Notes |
|---|---|---|---|---|
| Mean ramp (trailing-4) | 95 d | ≤ 71 d | 73 d | 2 d above target. See confound below. |
| Day-120 retention | ~83 % | ≥ 92 % | 93 % | On target. |

**Confound disclosure** (per D-008, K.M. brief §8 commitment to "honest either way"):

- Marketing lead-quality index moved **−1.8 pp** over the 6 months (R.K. / CMO conversation in flight). Below the 2 pp threshold but trending.
- Comp-plan SPIF distortion (brief §17) **unchanged**; J.V. RevOps redesign on Q3 roadmap not yet shipped.
- Manager 1:1 cadence variance **narrowed**: rubric adopted in 8 of 9 pods (ES rubric translation deployed cohort 3; awaiting one full cohort to confirm I.C. adoption).

**Honest read for the CRO:** Ramp landed at 73 d (target 71 d). Day-120 retention 93 % (target 92 %). Confound watch: marketing lead-quality index drifted −1.8 pp over the cohort window per RevOps dashboard line 3; per D-008 this is documented as an associative factor, not subtracted from the headline result.

---

## Slide 6 · L3 manager adoption (rubric usage by pod)

| Pod | Manager | Pre-program 1:1 cadence | Post-program rubric usage (calls/rep/month) | M1+M2+M3 adherence (Gong) |
|---|---|---|---|---|
| UK-Manchester | J.T. | Weekly + rubric | 4.2 | 88 % |
| UK-London-A | H.M. | Weekly, no rubric | 3.6 | 79 % |
| UK-London-B | F.O. | Bi-weekly | 3.1 | 71 % |
| UK-Belfast | D.W. | Ad-hoc | 2.8 | 64 % ← below floor, see L3-A trigger |
| DE-Berlin | M.K. | Weekly + rubric | 4.0 | 85 % |
| DE-Munich | S.B. | Bi-weekly | 3.3 | 72 % |
| ES-Barcelona | I.C. | Weekly in ES | 2.4 (English rubric until cohort 5) | 68 % ← will lift post-translation |
| NL-Amsterdam | T.V. | Weekly | 3.5 | 76 % |
| IT-Milan | G.R. | Bi-weekly | 2.9 | 70 % |

K.M.'s "floor" ask (brief §8 + §9 A.S. "all 9 pods within 6 weeks"): **L3 ≥70 % adherence met in 7 of 9 pods. Belfast (64 %) and Barcelona (68 %) below trigger** — Sprint 6.2 (rubric recalibration) fired Sept; Sprint 6.5 (ES rubric translation) fired Oct per `iteration-playbook.md`.

---

## Slide 7 · L2 + L1 (mastery + application-intent)

**L2 — SCORM quiz mastery (cumulative across 6 modules, 79 reps):**

| Metric | Target | Actual |
|---|---|---|
| First-attempt mean | ≥ 80 % | 84 % |
| +7-day retention mean | ≥ 70 % | 73 % |

One module (Module 2 · Objection Acknowledge) dipped to 76 % first-attempt in cohort 3 → triggered an L2-A content-refresh sprint → recovered to 83 % in cohort 4.

**L1 — Application-intent (LTEM tier-3, *not* satisfaction):**

> "I could use this on a call today" — mean **4.3 / 5** across all six modules and all cohorts (target ≥ 4.0).

Lowest module: Module 6 (Regulatory Deflection) at 4.0 — below the average but at floor. Highest: Module 1 (Diagnostic Opener / M1) at 4.6.

---

## Slide 8 · What surprised us

Most-cited "forgotten move" from L1 open-responses across cohorts 1–6:

> **"The 5-second silence after the diagnostic question."**

29 % of open responses across 6 cohorts mentioned variations of this — "I asked the question and then filled the silence", "I forget to wait", "5 seconds feels like an hour". This is the M.G. threshold concept (per `frameworks-applied.md` #19 + brief §10.1): *"Five seconds feels like an hour but it's where the deal happens."*

**What we did:** added a +14-day spaced-retrieval booster in Module 1 from cohort 5 onward focused specifically on the silence pause. Early signal in cohort 5 + 6 is the open-response frequency dropping from 31 % to 18 %.

**What it tells us:** the threshold concept is hardest to internalise — even reps who score 100 % on the L2 quiz forget the silence on a live call. Knowledge is not the gap; *element-interactivity under live pressure* is the gap (per Sweller cognitive-load lens, brief §10.3 H.K. quote "I forget them under pressure").

---

## Slide 9 · What's next

**v2 (Q1–Q2 2027, new budget cycle):**

1. **ES module translation** (full 6 modules) + I.C.'s rubric already shipped in cohort 5 — completes the Barcelona pod's program experience.
2. **DE module translation** + the bilingual EN/DE cheat sheet (M.K. ask, brief §10.7) — addresses the language-switch-mid-call scenario.
3. **Comp-plan feedback hand-off to RevOps (J.V.).** The program's Outreach `Sequence_Completion_Rate` data has surfaced specific SPIF-chasing patterns in months 2–4. Hand the data to J.V. for the Q3 2027 comp redesign. Training-side surfaces; RevOps owns the fix — exactly the boundary K.M. agreed at kickoff (brief §8).

**v2 budget ask:** TBD — drafted in `handoff-pack.md` §6. Estimated 6 weeks per language from sign-off.

---

## Slide 10 · The ask

**Two asks for the CRO:**

1. **Continued funding for the content-refresh cadence.** One in-house designer at ~60 % FTE running the `content-refresh-sprint-template.md` 4-week cycle between cohorts. Without this, the program ossifies and the L3 + L4 gains erode within 2–3 quarters as ICP and competitive landscape shift.

2. **Approval for v2 (ES + DE) scope and budget.** Highest-ROI item: ES rubric is already adopted by I.C.; ES module translation completes the loop. DE bilingual cheat sheet unblocks M.K.'s pod against the language-switch scenario.

**What we are explicitly not asking for in this cycle:**

- Audio narration layer (v3 ask).
- Manager-coaching module (v3 ask — defer until 12 months of rubric variance data).
- Mid-market / enterprise SDR program (separate engagement, Q4 2027).

**Closing line for the CRO:** the program delivered. The 2-day gap to target is attributable to the lead-quality slip you and R.K. are already discussing. The training-side scaffolding is in place, owned in-house, and self-iterating.

---

## References

- Brief §5 (success measures) · §8 (K.M. verbatim + honesty commitment) · §9 (A.S. all-9-pods ask) · §10.1 (threshold concept) · §10.7 (M.K. bilingual ask) · §17 (comp-plan friction) · §20 (risks) · §21 (done-state).
- `frameworks-applied.md` (all 16 frameworks cited on slide 3).
- `decisions-log.md` D-003 (LTEM L1), D-004 (rubric design), D-008 (L4 attribution honesty).
- `iteration-playbook.md` rule L4-C (confound disclosure protocol used on slide 5).
- `handoff-pack.md` §6 (v2 scope), §7 (v3 ask).
