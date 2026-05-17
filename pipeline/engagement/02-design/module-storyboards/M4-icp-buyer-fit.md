> Why this artefact: Storyboard for Module 4 — ICP Buyer Fit — the *integration* module where M1+M2+M3 are interleaved against all four §12 ICP archetypes. Inherits `_template.md`. Operationalises the 4C/ID variability-of-practice principle (Van Merriënboer 2018 Ch. 5) explicitly named in `01-analyze/task-inventory.md` §7 — *"we will not sequence 'all Maria calls, then all Tom calls' — we'll interleave so the rep cannot pattern-match on superficial cues."* Drill D4 (archetype identification ≤ 5 s) is the part-task block.

# Module 4 · ICP Buyer Fit

## Storyboard header

| Field | Value |
|---|---|
| Module ID | M4 |
| Terminal outcome | **T5** — SDR identifies which of the four §12 ICP archetypes (Maria · Tom · Emma · Lukas) the buyer matches in under 5 seconds from a 4-field signal preview and selects the archetype's ideal diagnostic + best-fit prop; runs M1+M2+M3 against ≥ 3 of the 4 archetypes in the solo block. |
| Enabling outcomes | **LO-ICP.1** Discriminate 4 archetypes ≤ 5 s · **LO-ICP.2** Select archetype's ideal opener · **LO-ICP.3** Run M1+M2+M3 × 3+ archetypes interleaved · **LO-ICP.4** Pick best-fit prop per archetype |
| Task class | Classes 2 / 3 / 4 integrated under variability |
| Time budget | 10:00 (brief §7) |
| Mini-OS apps used | LinkedIn / Companies House · Outreach · Phone-dialler · Calendar · Salesforce · Gong · Slack |
| Pre-requisite outcomes | T2 + T3 + T4 (M1 + M2 + M3 all completed) |
| Spaced-retrieval drop | +7 days on LO-ICP.1 / LO-ICP.2 / LO-ICP.3 / LO-ICP.4 |

## Gagné event timeline · seconds-level pacing

### 0:00–0:30 · Gain attention · trigger scenario

**Screen.** A blank "buyer preview" card slides in with four fields and no archetype label:

```
Industry: Industrial manufacturing · regional SMB
FTE: 78
Card spend: ~€42K / month, heavy on raw materials
Stage: 4 years in role, reports to MD
```

Caption (muted red): *"You have 5 seconds. Maria, Tom, Emma, or Lukas? Pick wrong and you open the wrong call."*

### 0:30–1:00 · State outcome

> **By the end of these 10 minutes you pick the buyer in under 5 seconds and run M1+M2+M3 against three of them back-to-back — without warming up between calls.**

Brand-voice peer line (§18.2): *"Real day: three dials, three buyers, three minutes. The pattern-match has to be fast."*

### 1:00–1:30 · Recall prior

"M1, M2, M3 are locked. Now the variable changes — it's *which buyer*. That dictates the opener, the objection probability, and the prop."

### 1:30–3:00 · Present stimulus + guide · four micro worked examples

**Screen.** Four 30-second worked-example flashcards, one per archetype. Each shows: buyer preview (4 fields) → ideal opener (per §12) → most-likely objection (per §10 / §12) → best-fit prop (per §13.1).

| Archetype | Buyer preview | Ideal opener (§12) | Likely objection | Best-fit prop (§13.1) |
|---|---|---|---|---|
| **Maria** §12.1 | Retail · 2 stores · 35 FTE · $25K/mo spend | *"Who's currently approving every expense report, and how long does it take?"* | "We already have a Visa" | Prop 4 (receipt capture + sync) |
| **Tom** §12.2 | SaaS · pre-rev · 22 FTE · €18K/mo · Series-B just raised | *"I see you closed your Series-B last quarter — how are you handling per-employee card issuance for your new hires?"* | "We already use Brex" | Prop 2 + Prop 3 (multi-user cards + auto-FX) |
| **Emma** §12.3 | Manufacturing · 78 FTE · €42K/mo · 3 sites | *"How much time does your bookkeeping team spend re-keying supplier receipts every month?"* | "Our accountant won't deal with another tool" | Prop 4 |
| **Lukas** §12.4 | DE Hospitality · 4 restaurants · 52 FTE · €31K/mo | *"I noticed you opened a fourth location in Hamburg last month — how are you handling spend visibility across the 4 sites?"* | "I don't trust new fintechs" | Prop 1 + Prop 2 |

**Mayer signalling.** Each archetype card is colour-tagged with primary-green + one Phosphor icon (`Storefront` for Maria, `Rocket` for Tom, `Factory` for Emma, `ForkKnife` for Lukas). Three signalling cues per Mayer rule.

### 3:00–5:00 · Elicit performance · D4 drill (part-task replaces completion)

**Drill D4 — Archetype identification.** 20 cards. Each card: 4-field buyer preview (industry · FTE · spend · stage). Rep picks archetype within 5 s. Mini-OS event log captures `pick_time_ms` per card.

**Pass criterion.** ≥ 95 % on 20 cards (per `01-analyze/task-inventory.md` §6). Below 95 % triggers re-drill after the +7-day mini-quiz.

This replaces the standard completion-problem block in this module because the part-task drill *is* the completion stage for LO-ICP.1.

### 5:00–8:00 · Elicit performance · solo problem · 3 interleaved calls

**Critical 4C/ID variability rule (`task-inventory.md` §7 + `4cid-blueprint.md` §3.3):** the three calls are **interleaved**, not blocked. The mini-OS randomises which three archetypes appear (always 3 of the 4); the rep cannot predict what's coming.

**Per call (≈ 60 seconds each, 180 s total):**

1. Buyer preview shown.
2. Rep picks archetype (LO-ICP.1).
3. Mini-OS auto-loads §12 ideal opener as a *reference cue* (not auto-filled — rep must speak/type it; LO-ICP.2).
4. Rep dials. M1 plays out (LO-ICP.2 + threshold silence from LO-M1.3).
5. Buyer delivers most-likely objection. Rep does M2 (recap of LO-M2.1–3).
6. Rep selects prop (LO-ICP.4); pitches the prop in buyer language.
7. M3 close (recap of LO-M3.1–2). Salesforce `Next_Step_Booked__c` flips.

**Success criteria across the three calls.**
- LO-ICP.1 archetype correct on ≥ 3 of 3 previews.
- LO-ICP.3 rubric anchors ≥ 4 across M1 + M2 + M3 rows on ≥ 3 of 3 calls (calls scored cumulatively).
- LO-ICP.4 best-fit prop selected on ≥ 3 of 3.

### 8:00–9:00 · Feedback · self-score across rubric × archetypes

**Screen.** A 3 × 3 matrix: rubric row (M1 / M2 / M3) × call number (call 1 / 2 / 3). Self-score each cell 1–5. Mini-OS surfaces variance: if any cell drops > 1 point between calls, the rep is shown the corresponding worked-example snippet from M1/M2/M3 modules — micro-remediation (Renkl/Atkinson fading inside the integration module).

### 9:00–9:30 · Assess · 3-item quiz

From `l2-quiz-blueprint.md` §4.4:

- Item 1 (LO-ICP.1): decision-card lookup — *"buyer is a Series-B tech founder who just raised €15M"* → Tom (§4.4 verbatim).
- Item 2 (LO-ICP.4): "Lukas. Best-fit prop?" Correct: Prop 1 + Prop 2.
- Item 3 (LO-ICP.3): cross-archetype — *"you ran M1+M2+M3 perfectly against Maria but bombed against Lukas. What changed?"* Correct: *I didn't switch the opener style — Lukas needs a quant-anchored signal-statement, not behavioural*. (Drives the §10.2 L.D. cultural-frame split into the assessment.)

### 9:30–10:00 · Enhance retention/transfer

**Key-takeaway card:**

> *"M1+M2+M3 don't change. The buyer does. Pick the buyer first — in five seconds — then run the moves. The moves are the same; the framing is the buyer's." — composite of M.G. §10.1 + L.D. §10.2.*

**+7-day mini-quiz** auto-scheduled. **L1 pulse** fires.

---

## Worked-example specification

| Field | Detail |
|---|---|
| Buyer profile | All four archetypes (Maria · Tom · Emma · Lukas), 30-s flashcard each |
| SME pattern | Composite — M.G. (UK behavioural) for Maria/Emma; L.D. (DE quant) for Tom/Lukas |
| Call timeline | Not full transcripts — flashcards with the four-field preview + opener + objection + prop |
| M-move highlight points | Archetype chip primary-green; Phosphor icon per archetype (`Storefront`/`Rocket`/`Factory`/`ForkKnife`); opener text labelled `[M1 archetype-specific]` |
| Mayer principles | **Pre-training** (cards reactivate the archetype schemas built in pre-training), Signalling (3 cues per archetype), Coherence, Multimedia (preview + icon + label) |
| Length | 4 cards × ≈ 25 words = ≤ 90 s reading total |

## Completion-problem specification

**Replaced by drill D4** — 20-card archetype identification at ≤ 5 s per card. Pass = ≥ 95 %.

## Solo-problem specification

| Field | Detail |
|---|---|
| Buyer profile | **3 interleaved** of 4 archetypes — random per attempt |
| Success criteria | LO-ICP.1 (≥ 3/3 correct) · LO-ICP.3 (rubric ≥ 4 across M1+M2+M3 on ≥ 3/3) · LO-ICP.4 (best-fit prop on ≥ 3/3) |
| Variability discipline | Interleaved (Maria → Lukas → Tom · or any 3-of-4 permutation) — **never blocked** (Van Merriënboer 2018 Ch. 5) |
| Hint affordances | One "show me the move" hint usable on any single call |
| Time | ≤ 3 min total (≈ 60 s per call) |
| Apps active | Full mini-OS stack: LinkedIn · Outreach · Phone-dialler · Calendar · Salesforce · Gong · Slack |
| Event-log | `archetype_pick_time_ms` × 3, `opener_match_score` × 3, `m1_m2_m3_rubric_self_scores` matrix |

## Mini-OS app set used

Full stack from prior modules — all seven apps available. This is the first module where the rep operates the whole workspace under variability.

## Accessibility checklist

- [ ] Archetype-pick is keyboard operable (1/2/3/4 number keys map to Maria/Tom/Emma/Lukas; also Tab + Enter).
- [ ] Each Phosphor archetype icon has `aria-label="<archetype name>"`.
- [ ] D4 drill timer announces remaining seconds via `aria-live="polite"` at 3-s and 1-s marks.
- [ ] Interleaved-solo state announced at call boundaries: *"Call 1 of 3 · buyer is <archetype>"*.
- [ ] 3 × 3 self-score matrix has labelled axes (rubric row / call number) for screen reader; cell input is numeric 1-5 with `aria-valuemin/max`.
- [ ] Reduced-motion: archetype-card flip animations replaced with instant render.

## References

- Brief §§5, 7, 9, 10.1, 10.2, 11, 12.1–12.4, 13.1, 18.2.
- `01-analyze/task-inventory.md` §2 Classes 2/3/4; §6 drill D4; §7 variability rule.
- `01-analyze/learner-personas.md` §1 M.G., §2 L.D.
- `01-analyze/cognitive-load-analysis.md` §8 Class 4 — competitive frame element E9 enters.
- `02-design/learning-outcomes-abcd-bloom.md` T5, LO-ICP.1–4.
- `02-design/curriculum-blueprint.md` §3.2 Module 4.
- `02-design/4cid-blueprint.md` §3.1 + §3.3 variability + §7 configural mapping.
- `02-design/module-storyboards/_template.md`.
- `05-evaluate/l1-pulse-survey.md`; `05-evaluate/l2-quiz-blueprint.md` §4.4; `05-evaluate/l3-call-rubric.md`.
- Decisions `D-002`, `D-005`, `D-006`, `D-007`.
- Frameworks: Gagné (1985), Merrill (2002), Renkl & Atkinson (2003), Mayer (2014), Van Merriënboer & Kirschner (2018 — variability Ch. 5), Sweller (2011), Kalyuga (2007 — expertise reversal note).
