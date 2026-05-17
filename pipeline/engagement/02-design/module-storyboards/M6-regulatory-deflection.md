> Why this artefact: Storyboard for Module 6 — Regulatory Deflection — the *job-aid-in-use* module. Inherits `_template.md`. Operationalises 4C/ID Task Class 6 from `01-analyze/task-inventory.md` §2. The §19 deflection table is productionised as a 1-page desktop job aid (Rossett & Schafer 2007 per `frameworks-applied.md` §20) — the module trains the rep to *use* the aid, not memorise it. Threshold concept *"Deflect to proof, never invent."*

> **Evidence note (per `critic-log.md` Phase 1 Pass 1 issue (c)).** Task Class 6 is derived from brief §19 (the regulatory deflection table — KYC / AML / SCA / PSD2 / GDPR with rep responses) + §12.4 (Lukas — German hospitality, low-trust on fintechs, who explicitly raises the trust + bank-segregation question per §12.4 closing move). No §11 Gong call contains regulatory-deflection content. **Phase 5 cohort-1 Gong validation hook:** A.S. + M.B. weekly Gong sample, weeks 5–8 post-cohort-1 launch, generates the base-rate corpus for the frequency and distribution of buyer regulatory questions. If buyer reg questions cover < 80 % of the §19 5-row table, the v2 backlog extends the table; if a 4th rubric row for "deflect-vs-escalate" decision quality is justified by the corpus, it is added in Phase 6 (current `D-004` constraint = 3 rows; revisited at Phase 6 per critic discipline). Storyboard `D` criterion is re-validated against that corpus.

# Module 6 · Regulatory Deflection

## Storyboard header

| Field | Value |
|---|---|
| Module ID | M6 |
| Terminal outcome | **T7** — SDR responds to any KYC / AML / SCA / PSD2 / GDPR question with one sentence from the §19 deflection table verbatim, without inventing; correctly distinguishes answer-here vs escalate-to-Compliance on ≤ 1 incorrect call out of 5. |
| Enabling outcomes | **LO-REG.1** Match buyer Q to §19 row ≤ 3 s · **LO-REG.2** Deliver §19 verbatim + escalate decision |
| Task class | Class 6 — Regulatory-question deflection (`task-inventory.md` §2) |
| Time budget | 10:00 (brief §7) |
| Mini-OS apps used | LinkedIn / Companies House · Outreach · Phone-dialler · Calendar · Salesforce · Gong · **Slack (§19 job aid forced visible)** |
| Pre-requisite outcomes | All prior modules (T2 + T3 + T4 + T5 + T6) — reg-deflection is *additive* to the keystone, never a replacement |
| Spaced-retrieval drop | +7 days on LO-REG.1 + LO-REG.2 |

## Gagné event timeline · seconds-level pacing

### 0:00–0:30 · Gain attention · trigger scenario

**Screen.** Lukas-style call (§12.4 verbatim):

> **Lukas:** *I don't trust new fintechs with my money. What happens to my money if you go under?*

Caption (muted red): *"You have three seconds. Pitch your way out of this and you lose the call. Defer to the regulator page and you keep it."*

### 0:30–1:00 · State outcome

> **By the end of these 10 minutes you respond to any regulatory question with one sentence from a single sheet on your desktop — and you know when to escalate.**

Brand-voice peer line (§18.1 + §19 honest carve-out): *"Sales reps don't sell against regulation; we defer to it. The sheet does the heavy lifting — your job is to know which row to point at."*

### 1:00–1:30 · Recall prior

"All the moves are locked. This is the move *on top of* the moves. Reg questions are not objections — don't try to acknowledge-and-restate. They're proof requests. The proof is on the sheet."

### 1:30–3:00 · Present stimulus + guide · five micro worked examples (§19 row-per-row)

**Screen.** Mini-OS Slack pinned-channel window forced open showing the 1-page job aid (the §19 table productionised). Each row shows: acronym · what it actually means · rep's response · "where in cohort" (per §19 column 4 — used for Module 6 anchor).

| Row | Buyer Q (synthetic, anchored to archetypes) | Rep response (§19 verbatim) | Module 6 anchor |
|---|---|---|---|
| **KYC** | Maria: *"How long does signup take? My bookkeeper hates paperwork."* | *"We run KYC at signup. Takes 10 minutes for the owner. We've done it for 12 000+ businesses; the process is smoother than your bank's."* (§19) | LO-REG.1 + LO-REG.2 |
| **AML** | Tom: *"What about transaction monitoring — do you flag stuff?"* | *"Every transaction is monitored. You will not see this as a customer unless something gets flagged, which is rare and we walk you through it."* (§19) | LO-REG.1 + LO-REG.2 |
| **SCA** | Emma: *"Will my employees have to do 2FA on every coffee?"* | *"Every card transaction over €30 triggers SCA. Your team will see a push to approve. Takes 2 seconds."* (§19) | LO-REG.1 + LO-REG.2 |
| **PSD2** | (rare ask, Tom) *"Are you PSD2 compliant?"* | *"We're PSD2-compliant. The short version: it's the regulation that lets us be additive to your bank, not a replacement."* (§19) | LO-REG.1 + LO-REG.2 |
| **GDPR** | Lukas: *"Where does my company data live? Can I see your DPA?"* | *"Your card data lives in the EU. We don't sell it. We don't share it. Here's our DPA — happy to send it over."* (§19) | LO-REG.1 + LO-REG.2 |

Below the table: a sixth row in muted style — *"If the buyer goes deeper than these five rows: defer to compliance. The honest carve-out (§19) is not a weakness; it's the trust move."* This is the LO-REG.2 escalate-vs-answer threshold.

**Mayer signalling.** Each row's response is highlighted in primary green when the rep mouses / focuses on the buyer question. **Spatial contiguity** — buyer question and rep response sit side-by-side per row.

### 3:00–5:00 · Elicit performance · D6 drill (part-task replaces completion)

**Drill D6 — Regulatory deflection one-liner.** 5 cards, one per acronym. Each card: a buyer's reg question. Rep must select the correct §19 row in ≤ 3 s, then speak/type the §19 verbatim response. Mini-OS event log captures `row_pick_time_ms` + `verbatim_match_score` (token overlap with §19 text).

**Pass criterion.** ≥ 95 % on 5 cards (`task-inventory.md` §6). Below 95 % triggers re-drill after +7-day mini-quiz.

### 5:00–8:00 · Elicit performance · solo problem (5 calls with distractors + escalate)

**The 5-call composition.**

| Call | Buyer | Buyer's mid-call question | Correct rep move |
|---|---|---|---|
| 1 | Maria (§12.1) | "How fast is signup?" | KYC row — *deflect and answer* |
| 2 | Tom (§12.2) | "What's your AWS bill / What's your spend visibility?" | **DISTRACTOR — not a reg question.** Correct: continue M1+M2+M3 normally, do *not* deflect. |
| 3 | Emma (§12.3) | "Will my accountant see every transaction?" | **DISTRACTOR — not a reg question** (it's a product question). Correct: Prop 4 framing from Module 5, no deflection. |
| 4 | Lukas (§12.4) | "What happens to my money if you go under?" | Combined KYC + bank-segregation — deflect with bank-tier-1 + regulator page line (per §12.4 closing move + §13.4 + §19 KYC row composite) |
| 5 | Tom (§12.2) | "How do you handle data subject access requests when ex-employees ask for their card history?" | **ESCALATE.** This goes beyond the §19 GDPR row. Correct: *"That's a deeper GDPR question than I should answer on the fly — let me get our compliance team on the next call. I'll put it on the calendar."* (Per §19 honest carve-out.) |

The two distractors (calls 2 + 3) force the rep to *not* over-apply the deflection move. The escalate case (call 5) forces LO-REG.2 evaluation.

**Mini-OS event log per call.** `is_reg_question_true_or_distractor`, `row_picked`, `response_token_overlap_with_§19`, `escalate_decision`, `calendar_invite_for_escalate_sent`.

**Success criteria.**
- LO-REG.1 row identified on calls 1, 4 in ≤ 3 s; calls 2 + 3 *not* flagged as reg.
- LO-REG.2 response verbatim on calls 1, 4; escalate on call 5; ≤ 1 incorrect decision across all 5.

### 8:00–9:00 · Feedback · self-score

**Screen.** Five-row matrix (one per call) with three columns: row-picked (or N/A for distractor) · response-correct-yes-no · escalate-decision-correct. Mini-OS surfaces the §19 honest carve-out line again as the framing of the rep's escalate decision.

> Note: v1 manager rubric (`l3-call-rubric.md`) has 3 rows (M1/M2/M3) per `D-004`. A 4th row for "regulatory deflection" is on the v2 backlog (`rubric-design.md` §5) pending cohort-1 Gong validation per the Evidence note above.

### 9:00–9:30 · Assess · 3-item quiz

From `l2-quiz-blueprint.md` §4.6:

- Item 1 (LO-REG.1): decision-card lookup — Lukas's trust question (the §4.6 verbatim item).
- Item 2 (LO-REG.1): distractor item — *"Tom asks 'how do you handle expense categories?' Which row?"* Correct: *None — this is a product question, not regulatory.*
- Item 3 (LO-REG.2): escalate decision — *"Buyer asks a GDPR follow-up about cross-border data transfer between EU and Switzerland. What do you do?"* Correct: *Escalate — beyond the §19 GDPR row.*

### 9:30–10:00 · Enhance retention/transfer

**Key-takeaway card:**

> *"Don't sell against regulation — defer to it. The sheet is your working memory. When the question goes deeper than the sheet, escalating *is* the trust move." — composite of §19 honest carve-out + brand voice §18.1.*

**Job aid hand-off.** The §19 one-pager is e-mailed to the rep + pinned to their actual desktop Slack channel — Rossett & Schafer's *point-of-use support* principle. This is the deliverable the rep keeps after the program ends.

**+7-day mini-quiz** auto-scheduled. **L1 pulse** fires. **Program-end key-takeaway card** also fires — *"You opened. You acknowledged. You closed. You did it across four buyers, you mapped pain to prop, and you deferred regulation honestly. That's the program."*

---

## Worked-example specification

| Field | Detail |
|---|---|
| Buyer profile | 5 archetype-anchored buyer questions (Maria/Tom/Emma/Tom/Lukas spread) drawn from §12 + §19 |
| SME pattern | §19 verbatim responses — no SME interview required for the deflection (the table IS the canon) |
| Call timeline | Not full transcripts — 5 mini Q+A pairs in the job-aid sidebar |
| M-move highlight points | Each §19 row highlighted on focus; the honest carve-out row is muted style (LO-REG.2 escalate cue) |
| Mayer principles | **Spatial contiguity** (buyer Q + rep response per row, side-by-side); **Pre-training** (the job aid is the supportive info — rep doesn't memorise); Signalling, Coherence |
| Length | 5 rows × ≈ 50 words = ≤ 90 s reading total |

## Completion-problem specification

**Replaced by drill D6** — 5-card row identification + §19 verbatim. Pass = ≥ 95 %.

## Solo-problem specification

| Field | Detail |
|---|---|
| Buyer profile | 5-call mixed-archetype sequence with 2 distractors + 1 escalate case |
| Success criteria | LO-REG.1 (correct row identification on actual reg Qs; no false-positive on distractors) · LO-REG.2 (§19 verbatim on answerable cases; escalate-with-calendar-invite on the deep GDPR case) |
| Hint affordances | The §19 job aid is **forced visible** the entire module — there is no "show me the move" hint because the job aid *is* the move |
| Time | ≤ 3 min total (≈ 35 s per call) |
| Apps active | Full mini-OS stack with Slack pinned-channel forced open |
| Event-log | `is_reg_question_true_or_distractor`, `row_picked`, `response_token_overlap_with_§19`, `escalate_decision`, `calendar_invite_for_escalate_sent` |

## Mini-OS app set used

Full stack. **Slack pinned-channel is forced visible** with the §19 1-pager — this is the only module where a job aid is mandatory rather than optional, because LO-REG outcomes *require* job-aid use (per Rossett & Schafer 2007 + brief §19 honest carve-out).

## Accessibility checklist

- [ ] §19 job-aid table is rendered as semantic `<table>` with `<th scope="row">` per acronym row.
- [ ] Row-pick is keyboard operable: number keys 1–5 map to KYC/AML/SCA/PSD2/GDPR rows; Escape selects "this isn't a reg question" (distractor pathway).
- [ ] `aria-live="polite"` announces row selection: *"Row selected: KYC"*.
- [ ] Escalate button has `aria-label="Escalate to Compliance — book follow-up"`.
- [ ] Distractor calls do not present a row-picker by default — the rep must explicitly invoke it (`Cmd/Ctrl + R`) so the "not a reg question" path is the default; this prevents over-deflection by accident.
- [ ] Reduced-motion: row-highlight transitions disabled; replaced with instant background colour change.

## References

- Brief §§5, 7, 9, 11 (no direct Gong evidence — see Evidence note), 12.1–12.4, 13.4 (regulatory positioning), 18.1, **§19 (the canonical deflection table — every response verbatim from here)**.
- `01-analyze/task-inventory.md` §2 Class 6; §6 drill D6; §3 component C8.
- `01-analyze/cognitive-load-analysis.md` §6 off-load-to-job-aid (Rossett & Schafer); §8 Class 6.
- `01-analyze/gap-analysis.md` §3 regulatory-deflection gap.
- `02-design/learning-outcomes-abcd-bloom.md` T7, LO-REG.1, LO-REG.2 (LO-REG.2 carries the cohort-1 Gong validation hook).
- `02-design/curriculum-blueprint.md` §3.2 Module 6 (with Evidence note).
- `02-design/4cid-blueprint.md` §3.1 Class 6; §4 supportive info (reg deflection table); §6 D6 part-task.
- `02-design/module-storyboards/_template.md`.
- `02-design/rubric-design.md` §5 — v2 backlog item for 4th rubric row pending cohort-1 validation.
- `05-evaluate/l1-pulse-survey.md`; `05-evaluate/l2-quiz-blueprint.md` §4.6; `05-evaluate/l3-call-rubric.md` (current 3-row scope).
- `05-evaluate/kirkpatrick-measurement-plan.md` Sprint 5.2 — receives the cohort-1 Gong validation hook for LO-REG.2.
- Decisions `D-002` (4C/ID), `D-004` (3-row rubric, with v2 backlog escape), `D-005` (custom SCORM), `D-006` (no audio), `D-007` (mini-OS + job aids).
- Frameworks: Gagné (1985), Merrill (2002), Renkl & Atkinson (2003), Mayer (2014), Van Merriënboer & Kirschner (2018), Rossett & Schafer (2007 — job aid central to this module), Sweller (2011).
