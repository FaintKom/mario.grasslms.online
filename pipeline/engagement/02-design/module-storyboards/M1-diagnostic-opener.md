> Why this artefact: Storyboard for Module 1 — M1 Diagnostic Opener — the keystone-anchoring first module. Inherits the `_template.md` scaffold; instantiates it for the M1 keystone against 4C/ID Task Class 2 (cold outbound to receptive buyer · `01-analyze/task-inventory.md` §2). The threshold concept *"5 seconds of silence is where the deal happens"* (M.G. §10.1 verbatim) is exposed here. Worked example anchored on M.G. + Maria (GC-01 pattern, §11). Solo problem switches to Tom (§12.2) for variability of practice (Van Merriënboer 2018 Ch. 5).

# Module 1 · M1 Diagnostic Opener

## Storyboard header

| Field | Value |
|---|---|
| Module ID | M1 |
| Terminal outcome | **T2** — SDR opens a cold call with a buyer-specific diagnostic question (anchored to one LinkedIn / Companies House signal) and waits ≥ 4 seconds for the buyer to answer; scoring ≥ 4 on M1 rubric row on 4 of 5 simulated calls. |
| Enabling outcomes | **LO-M1.1** Extract diagnostic-worthy signal · **LO-M1.2** Phrase diagnostic ≤ 15 words · **LO-M1.3** Tolerate 5-s silence |
| Task class | Class 2 — Cold outbound to receptive buyer |
| Time budget | 10:00 (brief §7) |
| Mini-OS apps used | LinkedIn / Companies House · Outreach · Phone-dialler · Gong · Slack (job-aid access) |
| Pre-requisite outcomes | None (program-anchoring module). Pre-training: 3-move card + ICP card already read. |
| Spaced-retrieval drop | +7 days (3-item mini-quiz, novel stems, outcomes LO-M1.1 / LO-M1.2 / LO-M1.3) |

## Gagné event timeline · seconds-level pacing

### 0:00–0:30 · Gain attention · trigger scenario

**Screen.** Mini-OS desktop fades up. Phone-dialler app opens with an incoming-call appearance. A muted-red transcript ribbon shows P.B.-style hang-up call (per GC-19 pattern, §11):

> **Rep:** *Hi, this is P. calling from FinTechCard. Do you have a moment to talk about your corporate spending?*
> **Buyer:** *No.* `[click — 0:08]`

A floating annotation in muted red: *"This is the third hang-up this morning. The next call doesn't have to be."* (P.B. §10.4 — anonymised paraphrase of *"That was the third one this morning."*)

**Mayer principle.** Signalling on the failure pattern; coherence (no other UI distraction).

### 0:30–1:00 · State outcome

**Screen.** Phone-dialler dissolves; outcome card slides in (no decorative motion if `prefers-reduced-motion: reduce`):

> **By the end of these 10 minutes you open every cold call with a buyer-specific diagnostic — and you tolerate 5 seconds of silence before you fill it.**

Below the outcome: a single line in §18.2 brand voice (peer-to-peer): *"5 seconds feels like an hour. That's where the deal happens."* — M.G. §10.1 verbatim.

### 1:00–1:30 · Recall prior

**Screen.** "This is your first module. Two things you already know going in: (1) the 3-move sequence M1 → M2 → M3. (2) the four buyers (Maria · Tom · Emma · Lukas). Both cards stay pinned in Slack." Slack pinned-channel preview shows the two cards.

### 1:30–3:00 · Present stimulus + guide · worked example

**Screen.** Mini-OS Gong window opens. Transcript fades in turn-by-turn. Buyer is **Maria** (§12.1 — retail SMB owner, 2 stores). SME is M.G. (top decile, §10.1; GC-01 pattern).

```
GC-01-style worked example · Manchester · Tue 14:02 · M.G. → Maria

[0:00]  Rep:    Hi Maria — quick one.            [Eye] [M1]
        Rep:    I noticed on Companies House you've opened a second
                location in the last 6 months — who's approving
                expense reports across both stores now?

[0:14]  Buyer:  ...                              [silence 0:04]

[0:18]  Buyer:  Well, my bookkeeper does, but honestly she's
                drowning. Receipts pile up.

[0:38]  Rep:    So you've got someone in seat but the workflow is
                breaking.                        [ArrowsClockwise] [M2 preview]

(... rest of call — 14 minutes total. Module 2 picks up the M2 thread.)
```

**Signalling cues per Mayer.** M1 line is annotated with **(1)** primary-green chip on the rep line; **(2)** Phosphor `Eye` icon at line start; **(3)** text label `[M1]`. The 4-second silence is annotated with `[silence 0:04]` — making the threshold visible.

**Spatial contiguity.** Annotations sit on the same line as the move, not in a sidebar.

### 3:00–5:00 · Elicit performance · completion problem

**Screen.** Same Maria, same Companies House context. Rep is shown:

> **Rep:** *Hi Maria — quick one. ______*

**Options (4 multiple choice):**

- A) *Do you have a moment to talk about your corporate spending?* — *(distractor: GC-19 P.B. pattern; led to hang-up at 0:08)*
- B) *I noticed on Companies House you've opened a second location in the last 6 months — who's approving expense reports across both stores now?* ✓
- C) *Our card is cheaper than your bank's — worth 10 minutes?* — *(distractor: GC-20 P.B. fees-argument pattern; hung up at 0:24)*
- D) *We help SMB owners get real-time visibility into their team spend. Can I tell you more?* — *(distractor: pitch-launch pattern, GC-10 / GC-17 mid-band failure)*

**Feedback on incorrect.** Single sentence: *"This is the pattern in GC-XX — call ended at YY seconds."* No long explanation.

### 5:00–8:00 · Elicit performance · solo problem

**Buyer profile (different from worked example — variability).** **Tom** (§12.2) — Series-B tech founder, 22 FTE, just raised €15M.

**Mini-OS sequence:**

1. **Pre-dial.** LinkedIn / Companies House app opens with Tom's profile. Rep has 90 seconds (LO-M1.1) to identify one signal. Three signals are visible: (a) Series-B announcement last quarter; (b) 8 new hires LinkedIn-public in 30 days; (c) AWS spend mention in TechCrunch coverage.
2. **Draft diagnostic.** Rep types a ≤ 15-word diagnostic question (LO-M1.2). Character counter and Phosphor `Lightbulb` hint icon are visible; one "show me the move" hint allowed.
3. **Dial.** Phone-dialler opens. Outreach queue logs the dial. Rep speaks (or types in v1 no-audio) the diagnostic.
4. **Silence countdown.** Phone-dialler shows a 4-second silence counter after the diagnostic delivers. `aria-live="polite"` announces *"buyer is thinking"*. Mini-OS event log captures `silence_duration_ms`.
5. **Buyer response.** Tom: *"We're using a mix of personal cards and one shared corporate card — it's a mess."*
6. **End-of-solo.** Rep clicks "end call". Mini-OS event log committed.

**Success criteria (instrumented).**
- LO-M1.1: correct signal selected (any of a/b/c — all three are valid diagnostic anchors per §12.2).
- LO-M1.2: diagnostic ≤ 15 words, pairs signal with who-controls-what question.
- LO-M1.3: silence ≥ 4 s before rep speaks again.

### 8:00–9:00 · Feedback · self-score + manager-rubric preview

**Screen.** Three rows of the L3 rubric (`l3-call-rubric.md` §1, row M1). Rep self-scores 1–5. The anchor that matches their behaviour (extracted from the event log) is highlighted in primary green.

Bottom card: *"Your manager will score your real calls on this same row in week 4-8 of your tenure. This is a self-coaching tool, not surveillance."* (Per §18 self-determination framing.)

### 9:00–9:30 · Assess performance · 3-item quiz

End-of-module quiz from `l2-quiz-blueprint.md` §4.1:

- Item 1 (LO-M1.1): scenario-classification on Maria-style opener (the §4.1 verbatim item).
- Item 2 (LO-M1.2): worked-example completion on Tom-style opener (variability — not the same buyer as the worked example).
- Item 3 (LO-M1.3): scenario judgement — "the buyer pauses for 6 seconds after your diagnostic. What do you do?" Correct: *wait.*

Score → `cmi.core.score.raw`. Mastery threshold 80 % (per `l2-quiz-blueprint.md` §8).

### 9:30–10:00 · Enhance retention/transfer

**Key-takeaway card (≤ 30 words):**

> *"Pick one signal. Phrase one question. Wait five seconds. The buyer fills the silence — that's where the call begins." — M.G., Manchester pod.*

**+7-day mini-quiz scheduled.** Sana auto-schedules 3 items on outcomes LO-M1.1 / LO-M1.2 / LO-M1.3 with novel stems (per `l2-quiz-blueprint.md` §6).

**L1 pulse fires.** Three-item `l1-pulse-survey.md` instrument. ≤ 30 s.

---

## Worked-example specification

| Field | Detail |
|---|---|
| Buyer profile | Maria · §12.1 · retail SMB, 2 stores, 35 FTE, ~$25K/mo card spend, top pain "who spent what" |
| SME pattern | M.G., Manchester, 14 months, §10.1 verbatim opener; Gong call ID GC-01 pattern |
| Call timeline | 4-line transcript (0:00 rep diagnostic · 0:14 silence · 0:18 buyer answer · 0:38 rep M2 preview); 14-minute total call referenced (Module 2 picks up M2) |
| M-move highlight points | M1 (green chip + Phosphor `Eye` + `[M1]` label); silence annotation `[silence 0:04]`; M2 preview cue in faded preview style |
| Mayer principles applied | Signalling (3 cues on M1), Spatial contiguity (line-level annotation), Segmenting (turn-by-turn fade-in), Pre-training (3-move + ICP cards pre-loaded), Coherence (no decorative motion) |
| Length | ~ 180 words on screen; ≤ 90 s reading time |

## Completion-problem specification

| Field | Detail |
|---|---|
| Stem | Maria, Companies House context already shown; rep's opening sentence redacted |
| Options | A (P.B. opener · GC-19 pattern) · B (M.G. M1 ✓) · C (P.B. fees pattern · GC-20) · D (mid-band pitch-launch · GC-10/17) |
| Scoring rubric | One correct; no partial credit |
| Feedback on incorrect | "This is the pattern in GC-19 — Maria hung up at 0:08." (single sentence; cites Gong ID) |
| Time allowance | ≤ 2 min |

## Solo-problem specification

| Field | Detail |
|---|---|
| Buyer profile | **Tom** · §12.2 · Series-B founder, 22 FTE, €15M just raised — *different* archetype from Maria (variability) |
| Success criteria | LO-M1.1 (signal extracted) · LO-M1.2 (diagnostic ≤ 15 words, signal + who-controls-what) · LO-M1.3 (silence ≥ 4 s) |
| Hint affordances | One "show me the move" hint = peek at M.G. pattern. Hint use logged; flagged as completion-stage in event log; no score penalty |
| Time allowance | ≤ 3 min |
| Mini-OS apps active | LinkedIn / Companies House · Outreach · Phone-dialler · Gong (post-call only) · Slack (job aid) |
| Event-log instrumentation | `signal_selected`, `diagnostic_word_count`, `silence_duration_ms`, `hint_used`, `call_end_reason` |

## Mini-OS app set used

| App | Purpose this module |
|---|---|
| LinkedIn / Companies House | Pre-dial signal scan (90 s window) |
| Outreach | Dial queue + disposition log |
| Phone-dialler | Live call state + 4-s silence countdown overlay |
| Gong | Worked example transcript host; post-call self-tag |
| Slack (pinned) | 3-move card + ICP archetype card (pre-training reference) |

Apps **not visible** this module: Salesforce (added in M3), Calendar (M3).

## Accessibility checklist

- [ ] All event-log indicators have `aria-live="polite"` announcements (silence countdown spoken to screen reader).
- [ ] Phosphor `Eye` icon for M1 has `aria-label="M1 diagnostic move"`.
- [ ] Primary green `#00b67a` chip verified ≥ 4.5:1 against white surface and ≥ 3:1 against dark.
- [ ] Tab order: trigger → outcome → recall card → transcript (one focus per turn) → completion options → solo screens → debrief → quiz → retention card → L1 pulse.
- [ ] Reduced-motion: transcript turn-fades disabled; replaced with instant render when `prefers-reduced-motion: reduce`.
- [ ] No audio dependency: silence is conveyed by `[silence 0:04]` text + countdown timer + `aria-live` announcement (3-cue redundancy per `D-006`).
- [ ] Language: `lang="en"` root.

## References

- Brief §§5, 7, 9, 10.1 (M.G.), 10.4 (P.B.), 11 (GC-01, GC-19, GC-20, GC-10, GC-17), 12.1 (Maria), 12.2 (Tom), 18.2.
- `01-analyze/task-inventory.md` §2 Class 2; §6 drill D1; §3 component skills C1, C3, C4.
- `01-analyze/learner-personas.md` §1 M.G. + §4 P.B.
- `01-analyze/cognitive-load-analysis.md` §8 Class 2 reduction strategy.
- `02-design/learning-outcomes-abcd-bloom.md` T2, LO-M1.1, LO-M1.2, LO-M1.3.
- `02-design/curriculum-blueprint.md` §3.2 Module 1 narrative.
- `02-design/4cid-blueprint.md` §3.1 Class 2 row; §3.3 variability axis.
- `02-design/module-storyboards/_template.md`.
- `05-evaluate/l1-pulse-survey.md`; `05-evaluate/l2-quiz-blueprint.md` §4.1; `05-evaluate/l3-call-rubric.md` row M1.
- Decisions `D-002` (4C/ID), `D-005` (custom SCORM), `D-006` (no audio), `D-007` (mini-OS).
- Frameworks: Gagné (1985), Merrill (2002), Renkl & Atkinson (2003), Mayer (2014), Van Merriënboer & Kirschner (2018), Meyer & Land (2005) for threshold concept, Sweller (2011) for cognitive load.
