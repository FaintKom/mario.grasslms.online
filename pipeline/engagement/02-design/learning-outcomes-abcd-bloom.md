> Why this artefact: Locks every learning outcome to Mager's ABCD discipline (Audience-Behaviour-Condition-Degree) and Anderson & Krathwohl's revised Bloom taxonomy (Apply/Analyse/Evaluate/Create only — no Remember-only outcomes). Mints the canonical outcome IDs that Phase 5's `l2-quiz-blueprint.md`, `l3-call-rubric.md`, and `l4-ramp-retention-tracking.md` reconcile against. Inherits the six task classes from `01-analyze/task-inventory.md` §2 and the L4→L1 cascade from `01-analyze/kirkpatrick-l4-l1-cascade.md` §2.

# Learning outcomes · ABCD + Bloom revised

## 1 · Notation

Every outcome below is written as a single sentence with four named slots:

- **A** Audience — who the learner is.
- **B** Behaviour — the observable verb, drawn from Anderson & Krathwohl's revised Bloom taxonomy (2001).
- **C** Condition — the work-context in which the behaviour is performed (per `D-007` mini-OS realism + `D-005` SCORM custom shell).
- **D** Degree — the criterion for success, drawn from brief §5 targets and `01-analyze/kirkpatrick-l4-l1-cascade.md` §3.

Bloom level tags: **Apply**, **Analyse**, **Evaluate**, **Create**. Knowledge dimension noted where it shifts (Factual / Conceptual / Procedural / Metacognitive).

Outcome IDs are the canonical reference for Phase 5 instruments. Where Phase 5 used placeholders (e.g. `LO-M1.1`), this file is the definition.

---

## 2 · Terminal program outcome (T1)

### T1 · Whole-task program terminal

> **A:** Newly-hired SDR (Mid-band / Bottom-quartile entry profile per `01-analyze/learner-personas.md` §3–§4)
> **B:** executes the M1 diagnostic opener + M2 objection acknowledge + M3 calendar close as one integrated sequence
> **C:** on a live cold call against an SMB ICP buyer (Maria / Tom / Emma / Lukas archetype · brief §12) inside the rep's actual workstation (Outreach → Phone dialler → Salesforce → Gong post-call review)
> **D:** achieving ≥ 80 % Gong-tag adherence per the L3 talk-track adherence metric (brief §5) by week 8 of tenure.

**Bloom:** **Apply** (Procedural knowledge) at point of demonstration; **Evaluate** (Metacognitive) when the rep self-tags own calls in Gong post-call.

**Evidence trace.** Brief §9 (A.S. — "those three moves are always there"); §11 (top decile M1 8/8, M2 7/7, M3 7/8; bottom 0/4 across all three); §5 (≥ 80 % adherence as 6-mo target). Frameworks: 4C/ID configural whole task (`D-002`); Backwards Design Stage 1 (Wiggins & McTighe 2005).

---

## 3 · Module-level terminal outcomes (T2–T7)

One terminal outcome per module; each maps to one of the six 4C/ID task classes from `01-analyze/task-inventory.md` §2.

### T2 · Module 1 · M1 Diagnostic Opener · Task Class 2 (Cold outbound to receptive buyer)

> **A:** Newly-hired SDR
> **B:** opens a cold call with a buyer-specific diagnostic question (anchored to one LinkedIn / Companies House signal) and waits ≥ 4 seconds for the buyer to answer
> **C:** inside the mini-OS workspace with the buyer's LinkedIn / Companies House tab and Outreach dialler open
> **D:** scoring ≥ 4 on the M1 rubric row (`l3-call-rubric.md` §1, anchor 4 — "specific + situational") on 4 of 5 simulated calls in the solo-problem block.

**Bloom:** **Apply** (Procedural). Threshold concept exposure: "the 5-second silence" (Meyer & Land 2005 lens · per `frameworks-applied.md` §19).

### T3 · Module 2 · M2 Objection Acknowledge · Task Class 3 (Cold outbound to hostile buyer)

> **A:** Newly-hired SDR
> **B:** restates the buyer's objection in the buyer's own words in one sentence and asks the one follow-up question that surfaces the actual broken thing — overriding the argumentation reflex
> **C:** on a live cold call after the buyer has delivered one of the five most common §12 / §10 objections ("we already have a Visa", "we already use Brex", "our accountant won't deal with another tool", "fees are lower elsewhere", "I don't trust new fintechs")
> **D:** scoring ≥ 4 on the M2 rubric row on 4 of 5 simulated calls; objection-inventory drill (D2) completed at ≥ 95 % per `01-analyze/task-inventory.md` §6.

**Bloom:** **Apply** + **Analyse** (the rep must analyse which objection family the buyer's phrasing belongs to before restating).

### T4 · Module 3 · M3 Calendar Close · Task Class 1 + Class 2 (warm + cold close pattern)

> **A:** Newly-hired SDR
> **B:** names two specific calendar slots aloud in one sentence, sends the calendar invite during the live call, and confirms acceptance before hanging up
> **C:** with calendar open in a second tab inside the mini-OS and Salesforce `Next_Step_Booked__c` field visible
> **D:** scoring ≥ 4 on the M3 rubric row on 3 of 5 simulated calls (mid-band entry threshold per `01-analyze/kirkpatrick-l4-l1-cascade.md` §2.L3); Salesforce `Next_Step_Booked__c = TRUE` on each successful close.

**Bloom:** **Apply** (Procedural). Habit-formation framing: the calendar-in-second-tab is a *habit*, not a tool (per Mid-band persona need, `learner-personas.md` §3).

### T5 · Module 4 · ICP Buyer Fit · Task Classes 2/3/4 integrated, four archetypes (variability of practice)

> **A:** Newly-hired SDR
> **B:** identifies which of the four §12 ICP archetypes (Maria · Tom · Emma · Lukas) the buyer matches in under 5 seconds from a signal-set (industry · FTE · spend · stage) and selects the archetype's ideal diagnostic + best-fit prop accordingly
> **C:** given a LinkedIn / Companies House profile preview inside the mini-OS pre-dial workflow
> **D:** D4 archetype-identification drill ≥ 95 % on 20-card set; M1+M2+M3 sequence executed correctly against ≥ 3 of the 4 archetypes in the solo-problem block (per 4C/ID variability principle, `frameworks-applied.md` §2).

**Bloom:** **Analyse** (Conceptual — discriminating between archetypes) + **Apply** (Procedural — running the keystone sequence inside the discriminated context).

### T6 · Module 5 · Product Prop Mapping · Task Class 5 (multi-stakeholder)

> **A:** Newly-hired SDR
> **B:** maps a stated buyer pain to the correct one of the four product props (Real-time spend control · Multi-user cards · Auto-FX · Receipt capture + sync, brief §13.1) and frames the prop in the buyer's own language — on a call where two stakeholders are present (founder + finance OR owner + accountant)
> **C:** with the 4-prop decision card (job aid, per `D-007` + Rossett & Schafer 2007) visible in the mini-OS sidebar
> **D:** D5 prop-to-objection drill ≥ 95 % on 15-card set; correct prop selected for ≥ 4 of 5 simulated multi-stakeholder calls; both stakeholders' availability captured in the same calendar invite.

**Bloom:** **Analyse** (mapping pain → prop) + **Apply** (delivering the framing under multi-voice load · 7-element interactivity per `01-analyze/cognitive-load-analysis.md` §8).

### T7 · Module 6 · Regulatory Deflection · Task Class 6

> **A:** Newly-hired SDR
> **B:** responds to a buyer's regulatory question (KYC · AML · SCA · PSD2 · GDPR) by deferring to the §19 brief deflection table verbatim, in one sentence, without inventing
> **C:** with the regulatory deflection job aid (1-page desktop artefact, `D-007` + brief §19) open in the mini-OS pinned-Slack channel
> **D:** D6 deflection-one-liner drill ≥ 95 % on the 5 reg-acronym set; rep correctly distinguishes "answer in one sentence from the table" vs "escalate to compliance" on ≤ 1 incorrect call out of 5.

**Bloom:** **Apply** (Procedural with strong job-aid scaffold) + **Evaluate** (deciding "answer here vs escalate"). Deliberately *not* Remember — the rep never has to memorise §19; the job aid is the working memory.

---

## 4 · Enabling outcomes (E-Mx.y) per module

Three to five enabling outcomes per module. These are the canonical IDs Phase 5 references. Each is ABCD-complete, Bloom-tagged, and mapped to the L2 quiz items / L3 rubric rows / L4 metric it supports.

### 4.1 · Module 1 (M1 Diagnostic Opener) · LO-M1.1 through LO-M1.3

#### LO-M1.1 · Extract a diagnostic-worthy signal from a buyer's LinkedIn / Companies House profile

> **A:** SDR · **B:** identifies one specific observable signal (new location opened, recent funding round, headcount growth, supplier shift) from a LinkedIn / Companies House profile · **C:** within 90 seconds of opening the profile in the mini-OS pre-dial workflow · **D:** correct signal identified on ≥ 8 of 10 D1 drill cards.

**Bloom:** **Analyse** (Conceptual). Maps to L2 quiz `LO-M1.1` (scenario-classification, `l2-quiz-blueprint.md` §3) + L3 rubric M1 row anchor 4 ("specific + situational").

#### LO-M1.2 · Phrase a diagnostic question that pairs the signal with a who-controls-what question

> **A:** SDR · **B:** writes a single diagnostic question in ≤ 15 words combining the extracted signal with a who-approves-what / who-handles-what framing · **C:** given a LinkedIn snippet in the D1 part-task drill · **D:** ≥ 95 % drill completion; phrasing scored ≥ 4 on M1 row anchor on ≥ 4 of 5 worked-example completions.

**Bloom:** **Create** (Procedural — generating a novel question) + **Apply**. Maps to L2 `LO-M1.2` (worked-example completion).

#### LO-M1.3 · Tolerate the 5-second silence after asking the diagnostic

> **A:** SDR · **B:** stays silent for ≥ 4 seconds after asking the diagnostic, resisting the reflex to fill the air · **C:** on a live simulated cold call inside the mini-OS phone-dialler with countdown indicator visible · **D:** silence ≥ 4 s on 4 of 5 solo-problem calls; self-reported in L1 instrument Q2 if violated.

**Bloom:** **Evaluate** (Metacognitive — monitoring own behaviour against the threshold) + **Apply**. Threshold-concept outcome per `frameworks-applied.md` §19; M.G. §10.1 verbatim source. Maps to L2 `LO-M1.3` + L3 rubric M1 anchor 5.

### 4.2 · Module 2 (M2 Objection Acknowledge) · LO-M2.1 through LO-M2.3

#### LO-M2.1 · Classify a buyer objection into one of the five §12 / §10 families

> **A:** SDR · **B:** identifies which family ("we already have X" / "fees" / "accountant friction" / "trust" / "Brex displacement") a buyer's objection statement belongs to · **C:** within 3 seconds of hearing/reading the objection on a live simulated call · **D:** D2 drill ≥ 95 % on 10-objection card set.

**Bloom:** **Analyse** (Conceptual). Maps to L2 `LO-M2.1` (scenario-classification).

#### LO-M2.2 · Restate the objection in the buyer's own words in one sentence

> **A:** SDR · **B:** speaks a single sentence that re-uses ≥ 2 of the buyer's actual words and contains no rebuttal language · **C:** immediately after the buyer delivers the objection in a simulated mini-OS phone call · **D:** ≥ 4 of 5 solo-problem restatements scored ≥ 4 on the M2 rubric anchor.

**Bloom:** **Apply** + **Create**. Maps to L2 `LO-M2.2` (worked-example completion) + L3 rubric M2 row anchor 4 + 5.

#### LO-M2.3 · Ask the one follow-up question that surfaces the actual broken thing

> **A:** SDR · **B:** follows the restatement with a single open-ended question ("what's not working about it?" / "what's broken about the current setup?") and waits silently · **C:** on the same live call · **D:** ≥ 3 of 5 follow-ups elicit a buyer-revealed pain (manager-rubric "buyer reveals actual broken thing" anchor 5).

**Bloom:** **Apply** + **Analyse**. Maps to L2 `LO-M2.3` (scenario-classification) + L3 rubric M2 anchor 5.

### 4.3 · Module 3 (M3 Calendar Close) · LO-M3.1 + LO-M3.2

#### LO-M3.1 · Open calendar in a second tab as a pre-call habit before dial

> **A:** SDR · **B:** opens the mini-OS Calendar app in a second window before clicking dial in Outreach · **C:** in every simulated dial sequence inside the module · **D:** 100 % of dial sequences in the solo-problem block start with Calendar already open (instrumented via mini-OS event log).

**Bloom:** **Apply** (Procedural — habit formation). Maps to L3 rubric M3 anchor 4-5 prerequisite. No L2 item — instrumented via SCORM activity, not quizzed.

#### LO-M3.2 · State two specific calendar slots aloud and send the invite during the live call

> **A:** SDR · **B:** speaks two specific calendar slots in one sentence ("Tuesday 11 or Thursday 2?") and sends the calendar invite via the mini-OS Calendar app *during* the call (not after) · **C:** when the buyer has shown any interest signal · **D:** scored ≥ 4 on M3 rubric anchor on 3 of 5 solo-problem calls; Salesforce `Next_Step_Booked__c = TRUE` for each.

**Bloom:** **Apply**. Maps to L2 `LO-M3.1` + `LO-M3.2` (worked-example completion + scenario-classification) + L3 rubric M3 row + L4 `Next_Step_Booked__c` proxy.

### 4.4 · Module 4 (ICP Buyer Fit) · LO-ICP.1 through LO-ICP.4

#### LO-ICP.1 · Discriminate the four ICP archetypes from signal-sets

> **A:** SDR · **B:** identifies Maria / Tom / Emma / Lukas from a 4-field signal preview (industry · FTE · card-spend · stage) · **C:** in the D4 drill and pre-dial mini-OS preview · **D:** D4 drill ≥ 95 % on 20-card set; ≤ 5 s per card.

**Bloom:** **Analyse** (Conceptual). Maps to L2 `LO-ICP.1` (decision-card lookup).

#### LO-ICP.2 · Select the archetype's ideal opener template

> **A:** SDR · **B:** picks the §12 ideal opener for the matched archetype before dial · **C:** in the mini-OS pre-dial workflow · **D:** ≥ 4 of 5 cold-call simulations open with the correct archetype template; M1 rubric anchor ≥ 4 on those calls.

**Bloom:** **Apply**. Maps to L2 `LO-ICP.2` + L3 rubric M1 row.

#### LO-ICP.3 · Run the M1+M2+M3 sequence against the matched archetype under variability of practice

> **A:** SDR · **B:** executes M1+M2+M3 against ≥ 3 of the 4 archetypes (interleaved, not blocked) · **C:** in the Module 4 solo-problem block · **D:** rubric anchor ≥ 4 across all three rows on ≥ 3 archetypes; no over-fitting to one buyer pattern.

**Bloom:** **Apply** + **Evaluate** (the rep evaluates whether their pattern-match is right under interleaving). Maps to L2 `LO-ICP.3` + L3 rubric across rows.

#### LO-ICP.4 · Pick best-fit prop per archetype

> **A:** SDR · **B:** selects the §12 / §13.1 best-fit prop for the matched archetype before pitching · **C:** during the solo-problem block · **D:** ≥ 4 of 5 calls deploy the correct prop; bridges to Module 5.

**Bloom:** **Analyse**. Maps to L2 `LO-ICP.4` (decision-card lookup).

### 4.5 · Module 5 (Product Prop Mapping) · LO-PP.1 through LO-PP.4

#### LO-PP.1 · Map stated buyer pain → product prop

> **A:** SDR · **B:** picks the correct prop (1/2/3/4) given a stated pain statement · **C:** D5 drill (15 cards) inside Module 5 · **D:** ≥ 95 % drill completion; correct prop on ≥ 13 of 15 cards.

**Bloom:** **Analyse**. Maps to L2 `LO-PP.1` (scenario-classification).

#### LO-PP.2 · Frame the prop in the buyer's own language (anti-jargon per §18.1)

> **A:** SDR · **B:** rephrases the prop without using FinTechCard internal terms (no "spend-control platform"; replace with the §18.1 verbatim "you'll see every transaction the moment it clears") · **C:** in the worked-example completion block · **D:** scored ≥ 4 on a 1-5 jargon-detector rubric (zero internal-jargon tokens detected).

**Bloom:** **Create** (Procedural — translation) + **Apply**. Maps to L2 `LO-PP.2` + brand-voice §18.1 self-check.

#### LO-PP.3 · Hold two simultaneous stakeholder diagnostics on the same call

> **A:** SDR · **B:** asks one diagnostic per stakeholder (founder-style + finance-style; OR owner-style + accountant-style) in sequence without interrupting either · **C:** in the Module 5 multi-stakeholder solo-problem · **D:** ≥ 3 of 5 calls demonstrate both diagnostics; M1 rubric anchor ≥ 4 for each stakeholder.

**Bloom:** **Apply** + **Analyse** (high element-interactivity, per `cognitive-load-analysis.md` §8 — 7 elements at peak). Maps to L3 rubric M1 row, two scores per call. **Phase 5 cohort-1 validation hook:** §11 has no multi-stakeholder Gong calls in the brief sample; cohort-1 Gong tags surface base rate of correct dual-diagnostic execution and validate this outcome's degree threshold.

#### LO-PP.4 · Book a calendar slot that captures both stakeholders' availability

> **A:** SDR · **B:** sends a single calendar invite containing both stakeholders' email addresses with two slots offered · **C:** during the live multi-stakeholder simulated call · **D:** ≥ 3 of 5 calls produce a multi-stakeholder calendar invite; Salesforce `Next_Step_Booked__c = TRUE`.

**Bloom:** **Apply**. Maps to L2 `LO-PP.4` + L3 rubric M3 row + L4 `Next_Step_Booked__c` proxy.

### 4.6 · Module 6 (Regulatory Deflection) · LO-REG.1 + LO-REG.2

#### LO-REG.1 · Match a buyer regulatory question to the correct §19 row in ≤ 3 seconds

> **A:** SDR · **B:** identifies whether the buyer's question is about KYC / AML / SCA / PSD2 / GDPR · **C:** with the §19 deflection job aid open in the mini-OS Slack-pinned channel · **D:** D6 drill ≥ 95 % on 5-acronym set; ≤ 3 s per identification.

**Bloom:** **Analyse**. Maps to L2 `LO-REG.1` (decision-card lookup).

#### LO-REG.2 · Deliver the §19 response verbatim in one sentence, then decide answer-here vs escalate

> **A:** SDR · **B:** speaks the §19 verbatim response in one sentence, then explicitly decides whether the buyer's follow-up requires a Compliance escalation (per §19 "Honest carve-out") · **C:** during the Module 6 solo-problem block · **D:** ≥ 4 of 5 deflections delivered correctly; ≤ 1 incorrect escalate-vs-answer decision per 5-call set.

**Bloom:** **Apply** + **Evaluate**. Maps to L2 `LO-REG.2` (decision-card lookup) + manager-rubric extension (Phase 6 v2 backlog: §19 row could be added as a fourth rubric row if cohort-1 validates the need; not in v1 per `D-004`'s 3-row constraint). **Phase 5 cohort-1 validation hook:** §11 has zero Gong calls with regulatory-deflection content; cohort-1 Gong listening (A.S. + M.B. weekly sample, weeks 5–8) generates the base-rate corpus and confirms whether the 1-sentence-from-table deflection covers ≥ 80 % of buyer reg questions or whether a wider table is needed in v2.

---

## 5 · Outcome traceability matrix

| Outcome ID | ABCD (short) | Bloom | Module | Keystone / lineage | L-level measure | Phase 1 evidence trace |
|---|---|---|---|---|---|---|
| T1 | New SDR / executes M1+M2+M3 / on live cold call / ≥ 80 % Gong tag by W8 | Apply + Evaluate | Program | M1+M2+M3 integrated | L3 talk-track adherence + L4 ramp | brief §5, §9, §11; cascade §2 |
| T2 | SDR / opens with buyer-specific diagnostic / mini-OS + LinkedIn / ≥ 4 on M1 rubric on 4/5 | Apply | M1 | M1 | L3 M1 rubric row | personas §1; task-inv §2 Class 2; Gong GC-01..08 |
| T3 | SDR / restates objection in buyer words / hostile call / ≥ 4 on M2 rubric on 4/5 | Apply + Analyse | M2 | M2 | L3 M2 rubric row | §10.1, §10.2; task-inv Class 3; Gong GC-09, 14, 17, 19, 20 |
| T4 | SDR / states 2 slots + invite during call / calendar tab open / ≥ 4 on M3 rubric on 3/5 | Apply | M3 | M3 | L3 M3 rubric row + L4 `Next_Step_Booked__c` | §10.1; task-inv Class 1+2; Gong GC-01..08 vs 19..22 |
| T5 | SDR / picks archetype + runs M1+M2+M3 / 4 archetypes interleaved / ≥ 3 of 4 archetypes ≥ 4 rubric | Analyse + Apply | M4 | M1+M2+M3 × ICP | L2 + L3 across rows | §12.1–§12.4; personas §1–§4 |
| T6 | SDR / maps pain→prop, frames in buyer language, dual diagnostic / multi-stakeholder call / 4/5 correct prop | Analyse + Apply | M5 | M1+M2+M3 × Prop | L2 + L3 + cohort-1 Gong (hook) | §13.1, §12.3; gap §3; **§12 evidence substrate** |
| T7 | SDR / deflects per §19 verbatim / job aid open / ≥ 4/5 correct + escalate decision | Apply + Evaluate | M6 | Reg deflection | L2 + manager observation (v2 rubric row backlog) | §19, §12.4; **§19 evidence substrate** |
| LO-M1.1 | Extract signal in ≤ 90 s | Analyse | M1 | M1 | L2 scenario-classification + D1 drill | §10.1; task-inv §3 C1 |
| LO-M1.2 | Phrase diagnostic ≤ 15 words | Create + Apply | M1 | M1 | L2 worked-example completion + D1 | §10.1; task-inv §3 C3 |
| LO-M1.3 | Tolerate 5 s silence ≥ 4 of 5 | Evaluate + Apply | M1 | M1 threshold | L3 M1 rubric anchor 5 + L1 Q2 self-report | §10.1 verbatim |
| LO-M2.1 | Classify objection family ≤ 3 s | Analyse | M2 | M2 | L2 scenario + D2 drill | §10.4 P.B.; §11 GC-09, 17, 19, 20 |
| LO-M2.2 | Restate in buyer words 1 sentence | Apply + Create | M2 | M2 | L2 worked-example + L3 M2 anchor 4–5 | §10.1, §10.2 verbatim |
| LO-M2.3 | Follow-up question surfaces pain | Apply + Analyse | M2 | M2 | L2 scenario + L3 M2 anchor 5 | §10.1; GC-06 |
| LO-M3.1 | Open calendar pre-dial | Apply (habit) | M3 | M3 | mini-OS event log (no L2) | §10.1 verbatim; mid-band gap |
| LO-M3.2 | Two slots aloud + send during call | Apply | M3 | M3 | L2 + L3 M3 row + L4 proxy | §10.1; GC-01, 02, 07, 08 |
| LO-ICP.1 | Discriminate 4 archetypes ≤ 5 s | Analyse | M4 | M1 prerequisite | L2 decision-card + D4 drill | §12.1–§12.4 |
| LO-ICP.2 | Select archetype's ideal opener | Apply | M4 | M1 | L2 + L3 M1 row | §12 opener column |
| LO-ICP.3 | Run M1+M2+M3 × 3+ archetypes interleaved | Apply + Evaluate | M4 | M1+M2+M3 | L2 + L3 across rows | task-inv §7 variability |
| LO-ICP.4 | Pick best-fit prop per archetype | Analyse | M4 | bridges to M5 | L2 decision-card | §12 best-pitch-prop column |
| LO-PP.1 | Map pain → prop | Analyse | M5 | Prop selection | L2 scenario + D5 drill | §13.1; §12 |
| LO-PP.2 | Frame prop in buyer language (no jargon) | Create + Apply | M5 | Prop framing | L2 + §18.1 brand-voice check | §18.1 verbatim |
| LO-PP.3 | Dual diagnostic on multi-stakeholder call | Apply + Analyse | M5 | M1 ×2 | L3 M1 row ×2 + **cohort-1 Gong validation hook** | §12.3 Emma; gap §3 multi-stakeholder |
| LO-PP.4 | Multi-stakeholder calendar invite | Apply | M5 | M3 | L2 + L3 M3 row + L4 proxy | §12.3, §10.7 multi-voice |
| LO-REG.1 | Match buyer Q to §19 row ≤ 3 s | Analyse | M6 | Reg | L2 decision-card + D6 drill | §19 verbatim |
| LO-REG.2 | Deliver §19 response verbatim + escalate decision | Apply + Evaluate | M6 | Reg | L2 + **cohort-1 Gong validation hook** | §19; §12.4 Lukas |

---

## 6 · What this file does NOT define (deliberately)

- **Knowledge-of-product-features as a standalone outcome.** The §14 current onboarding already does this; per `D-002` we do not replicate it. Product facts are *supportive information* delivered inside outcomes T5 + T6, not memorised outcomes.
- **Tool-stack proficiency as a standalone outcome.** Per §14 audit verdict ("Tools learned in isolation, not in workflow") + `D-007`, tooling is procedural information delivered as mini-OS coach-marks, not assessed as a separate outcome.
- **Compliance-side regulatory training.** Out of scope per brief §6; covered by Cornerstone team's Reg-101 / AML / GDPR modules.

---

## 7 · What this file sends downstream

| Sends | To |
|---|---|
| Canonical outcome IDs (T1–T7, LO-Mx.y, LO-ICP.y, LO-PP.y, LO-REG.y) | `02-design/curriculum-blueprint.md`, `02-design/module-storyboards/*` |
| Item-to-outcome trace | `02-design/assessment-design.md` |
| Rubric-anchor-to-outcome trace | `02-design/rubric-design.md` |
| Reconciled LO-IDs (replaces placeholders) | `05-evaluate/l2-quiz-blueprint.md` §3 |
| Module 5 + 6 cohort-1 Gong validation hooks | `05-evaluate/kirkpatrick-measurement-plan.md` (Phase 5 sprint 5.2 deliverable) |

## References

- Brief §§5, 9, 10.1, 10.2, 10.4, 11, 12, 13.1, 14, 18.1, 19.
- Mager, R. F. (1962/1997). *Preparing instructional objectives* (3rd ed.).
- Anderson, L. W., & Krathwohl, D. R. (2001). *A taxonomy for learning, teaching, and assessing.* Longman.
- Heinich, R., Molenda, M., Russell, J. D., & Smaldino, S. E. (2002). *Instructional media and technologies for learning.*
- Van Merriënboer, J. J. G., & Kirschner, P. A. (2018). *Ten steps to complex learning* (3rd ed.). Routledge.
- Wiggins, G., & McTighe, J. (2005). *Understanding by Design* (2nd ed.).
- Meyer, J. H. F., & Land, R. (2005). "Threshold concepts and troublesome knowledge (2)." *Higher Education*, 49(3), 373–388.
- Rossett, A., & Schafer, L. (2007). *Job aids and performance support.*
- `01-analyze/task-inventory.md`, `01-analyze/learner-personas.md`, `01-analyze/gap-analysis.md`, `01-analyze/kirkpatrick-l4-l1-cascade.md`, `01-analyze/cognitive-load-analysis.md`.
- Decisions `D-002`, `D-004`, `D-005`, `D-007`.
