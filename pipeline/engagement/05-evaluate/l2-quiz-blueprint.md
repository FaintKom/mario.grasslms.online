# L2 quiz blueprint · end-of-module + 7-day spaced retrieval

> Why this artefact: brief §5 sets two distinct L2 targets — first-attempt mastery (≥80 %) and spaced retrieval at +7 days (≥70 %). Frameworks: spaced retrieval practice (frameworks-applied #11, Roediger & Karpicke 2006), worked-example fading (#10), Bloom revised verbs (#5), ABCD outcomes (#4). Items are scored via Sana `cmi.core.score.raw` per §15.3 / §16 of the brief.

Two instruments per module. Same outcomes, different stems. Identical rigor.

---

## 1 · Quiz architecture per module

| Instrument | Items | Pass | When fired | SCO | Cadence |
|---|---|---|---|---|---|
| **End-of-module quiz** | 5–7 | ≥ 80 % first attempt | Immediately after final completion problem in module | Same SCORM SCO as the module | Once per learner per module |
| **+7-day spaced retrieval mini-quiz** | 3 | ≥ 70 % | Sana auto-schedules 7 days post-completion | Separate SCO ("Module N · +7d") | Once per learner per module |
| **+30-day retrieval — v2 backlog** | _deferred to v2_ | n/a (v1) | n/a — not built in v1 | n/a | Reason: Sana xAPI LRS dependency (see §6). Trigger to re-evaluate: Sana LRS GA + sponsor request. |

Both report to `cmi.core.score.raw` (SCORM 1.2). The two scores roll up to the per-module L2 metric in the dashboard.

---

## 2 · Item types used

Three item types only, chosen to match how the move is actually performed:

| Type | What it tests | Example use |
|---|---|---|
| **Scenario-classification** | "Which M-move applies?" — give a buyer line, the rep must pick the right move. | "Buyer: 'We already have a Visa.' What does the rep do *first*?" → M2 acknowledge before pitch. |
| **Worked-example completion** | Fill the blank inside a real rep transcript. | "Rep: 'I noticed you've opened a second location in the last 6 months — ____' (best continuation)" |
| **Decision-card lookup** | Module 4 (ICP) and Module 6 (regulatory) — does the rep know which card to reach for? | "A retail SMB owner asks about KYC delay. Where does the rep go?" → Reg-101 deflection card. |

Multiple-choice with 4 options. One correct, three distractors drawn from real failure patterns surfaced in the §10 SME interviews and §11 Gong reviews.

---

## 3 · Outcome linkage table

> **Reconciliation required.** Outcome IDs LO-Mx.y below are placeholders. Phase 2 `02-design/learning-outcomes-abcd-bloom.md` defines the canonical IDs. Reconcile before W17 cohort-1 launch.

Each item ties to an outcome ID from `02-design/learning-outcomes-abcd-bloom.md` (to be created in Phase 2). Placeholder IDs below; M.B. cross-walks on Phase 2 completion.

| Module | Outcome ID (placeholder) | Bloom level | Item type used | # items end-of-module | # items +7d |
|---|---|---|---|---|---|
| 1 · Diagnostic Opener (M1) | LO-M1.1 / LO-M1.2 / LO-M1.3 | Apply / Analyse | Scenario-classification + worked-example completion | 6 | 3 |
| 2 · Objection Acknowledge (M2) | LO-M2.1 / LO-M2.2 / LO-M2.3 | Apply / Analyse | Scenario-classification + worked-example completion | 6 | 3 |
| 3 · Calendar Close (M3) | LO-M3.1 / LO-M3.2 | Apply | Worked-example completion + scenario-classification | 5 | 3 |
| 4 · ICP Buyer Fit | LO-ICP.1 / LO-ICP.2 / LO-ICP.3 / LO-ICP.4 | Analyse | Decision-card lookup + scenario-classification | 7 | 3 |
| 5 · Product Prop Mapping | LO-PP.1 / LO-PP.2 / LO-PP.3 / LO-PP.4 | Apply / Analyse | Scenario-classification | 6 | 3 |
| 6 · Regulatory Deflection | LO-REG.1 / LO-REG.2 | Apply (Remember on jargon) | Decision-card lookup | 5 | 3 |

**Open dependency.** The Phase 2 outcomes file does not yet exist. When created, IDs above are reconciled and any item not tied to a live outcome is rewritten.

---

## 4 · Sample items per module (actual text)

### 4.1 · Module 1 · Diagnostic Opener (M1)

**End-of-module item · scenario-classification:**

> You're calling Maria, a retail SMB owner with 2 stores. You noticed on Companies House that she opened the second location 6 months ago. Which opener is most likely to keep her on the line past 60 seconds?
>
> **A)** "Hi Maria, this is [name] from FinTechCard. Do you have a moment to discuss your corporate spending?"
> **B)** "Hi Maria — I noticed you've opened a second store in the last 6 months. Who's currently approving expense reports across both locations?" ✓
> **C)** "Hi Maria, we help SMB owners get real-time visibility into their team spend. Can I tell you about it?"
> **D)** "Hi Maria, I'll be quick — our card is cheaper than your bank's. Worth 10 minutes?"
>
> *Correct: B. Distractors A, C, D are the three failure modes Gong tagged in GC-19, GC-20, GC-22 (P.B. / exit interview bottom-quartile).*

**+7-day mini-quiz item · worked-example completion (same outcome LO-M1.1):**

> Rep: "I see you closed your Series-B last quarter — ____"
> Best continuation:
> **A)** "Want to hear how we handle FX for cross-border SaaS spend?"
> **B)** "Do you have a moment to talk about corporate cards?"
> **C)** "How are you handling per-employee card issuance for your new hires?" ✓
> **D)** "We're built for EU multi-currency. Are you interested?"
>
> *Correct: C. The opener pairs an observation with a who-controls-what question (per M.G. §10.1).*

### 4.2 · Module 2 · Objection Acknowledge (M2)

**End-of-module item · scenario-classification:**

> Buyer: "We already use Brex." The rep's *first* sentence should:
>
> **A)** Point out Brex's weaknesses on EU FX.
> **B)** State that FinTechCard is different and explain why.
> **C)** Restate the buyer's position in the buyer's own words, then ask what's not working. ✓
> **D)** Move to closing for a 10-minute demo.
>
> *Correct: C. Per §10.2 L.D. and §10.1 M.G. — acknowledge first, in buyer-back-in-buyer-words form, before any displacement language.*

**+7-day mini-quiz item · worked-example completion:**

> Buyer: "Our accountant won't deal with another tool."
> Rep (best response): "____ — what's broken about the current setup?"
> **A)** "Our Xero sync is automated — you won't add work."
> **B)** "So you're protecting your accountant's bandwidth." ✓
> **C)** "Have you tried showing them our integration page?"
> **D)** "Most accountants love us once they see it."
>
> *Correct: B. Acknowledge → wait → buyer reveals the actual broken thing.*

### 4.3 · Module 3 · Calendar Close (M3)

**End-of-module item · worked-example completion:**

> The buyer has shown interest. The rep has the calendar open in a second tab. Best move:
>
> **A)** "I'll send you some times by email."
> **B)** "Want me to follow up next week?"
> **C)** "What's the best 20 minutes next week to walk you through the SMB version — I have Tuesday 11 or Thursday 2?" ✓
> **D)** "Let me know when works for you."
>
> *Correct: C. Pattern from M.G. §10.1 — name slots, do not leave to follow-up.*

### 4.4 · Module 4 · ICP Buyer Fit · decision-card lookup

> The buyer is a Series-B tech founder who just raised €15M. Which ICP card should the rep open?
>
> **A)** Maria (retail SMB)
> **B)** Tom (Series-B tech, Brex-comparison) ✓
> **C)** Emma (manufacturing operations)
> **D)** Lukas (restaurant group, DE)
>
> *Correct: B. ICP archetype per §12.2.*

### 4.5 · Module 5 · Product Prop Mapping

> Emma (manufacturing ops, 78 FTE) says: "Our bookkeeper re-keys every supplier receipt." Best prop to lead with:
>
> **A)** Prop 1 (real-time spend control)
> **B)** Prop 2 (multi-user cards + per-card limits)
> **C)** Prop 3 (auto FX at interbank)
> **D)** Prop 4 (receipt capture + accounting sync) ✓
>
> *Correct: D. Per §12.3 + §13.1.*

### 4.6 · Module 6 · Regulatory Deflection · decision-card lookup

> Lukas (DE restaurant group) asks: "I don't trust new fintechs. What happens to my money if you go under?" The rep should:
>
> **A)** Quote the AML transaction-monitoring stat.
> **B)** Explain SCA on payments over €30.
> **C)** Say funds are held at a regulated tier-1 partner bank and offer the regulator page. ✓
> **D)** Defer to the compliance team.
>
> *Correct: C. Per §13.4 + §19 + §12.4 Lukas closing move.*

---

## 5 · Distractor design rule

Distractors are not random. Every wrong answer is a documented failure pattern from §10 SME interviews or §11 Gong call reviews. This keeps items diagnostic — when a learner picks distractor D, the data tells us which real-world failure mode they are at risk of, and the +7-day mini-quiz can target it.

| Distractor source | Example call IDs (§11) |
|---|---|
| Skip-the-diagnostic opener | GC-10, GC-17, GC-19, GC-20, GC-22 |
| Argue-with-objection | GC-09, GC-14, GC-17, GC-19, GC-20, GC-21 |
| "Follow up" close | GC-10, GC-11, GC-19, GC-21, GC-22 |

---

## 6 · Spaced retrieval design (frameworks-applied #11)

The +7-day mini-quiz is **not** the same items. Same *outcome*, different *stem*. This is the difference between recognition and retrieval — and Roediger & Karpicke (2006) is explicit that retrieval-mode practice at expanding intervals drives durable transfer, not item-recognition repetition.

Sequence:

1. **t = 0** — end-of-module quiz (immediate; high context support).
2. **t = +7 days** — mini-quiz (3 items, novel stems, same outcomes; lower context support).
3. **t = +30 days (v2 backlog)** — second retrieval pass with even less context support. Not in v1 to keep within the no-new-tooling envelope; logged for v2 once Sana's xAPI LRS is fully queryable.

**No re-attempts on the same item within the +7-day window.** Sana enforces this via item-ID tracking. Re-attempts are reserved for failed first-attempt remediation, not for spaced retrieval.

---

## 7 · Item-quality maintenance (Phase 6)

Every quarter A.S. + M.B. (during engagement) / A.S. solo (post-engagement) review item stats:

| Stat | Threshold | Action |
|---|---|---|
| Item p-value (first-attempt correct rate) | < 0.35 or > 0.95 | Rewrite. Too hard or too easy. |
| Distractor selection rate | Any distractor chosen by < 5 % | Replace distractor; it's not pulling weight. |
| Item-total correlation | < 0.20 | Investigate alignment with outcome. |

---

## 8 · Sana implementation notes

- **SCORM version:** 1.2 (matches §16 tooling).
- **Score field:** `cmi.core.score.raw` for both quizzes; `cmi.core.lesson_status` carries pass/fail.
- **Mastery threshold:** set via `cmi.student_data.mastery_score = 80` for end-of-module, `70` for +7d mini-quiz (separate SCO).
- **Auto-schedule for +7d:** Sana cohort settings — set "follow-up assessment" SCO with `start = completion_date + 7 days`.
- **Locked retake policy:** failed first attempt can retry once after a 24-hour cool-down; the *first-attempt* score is the one reported to the L2 dashboard (per §5 brief wording).

---

## References

- `case-study-tz.md` §5, §10, §11, §12, §13, §15, §16, §18.2
- `00-project-management/decisions-log.md` D-002, D-003
- `00-project-management/frameworks-applied.md` #4 (ABCD), #5 (Bloom revised), #10 (worked-example fading), #11 (spaced retrieval)
- `05-evaluate/kirkpatrick-measurement-plan.md` §2
- Roediger, H. L., & Karpicke, J. D. (2006). *Perspectives on Psychological Science*, 1(3), 181–210.
- `02-design/learning-outcomes-abcd-bloom.md` (Phase 2 dependency · placeholder IDs above)
