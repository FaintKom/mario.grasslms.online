> Why this artefact: Storyboard for Module 3 — M3 Calendar Close — the keystone-completing module. Inherits `_template.md`. Instantiates the M3 keystone across both Class 1 (warm) and Class 2 (cold receptive) close patterns per `01-analyze/task-inventory.md` §2. Threshold concept *"Calendar in second tab is a habit, not a tool"*. Worked example uses M.G. + Maria close (§10.1 verbatim + GC-01). Solo problem switches to Emma (§12.3) and includes the instrumented "Calendar must be open before dial" habit gate.

# Module 3 · M3 Calendar Close

## Storyboard header

| Field | Value |
|---|---|
| Module ID | M3 |
| Terminal outcome | **T4** — SDR names two specific calendar slots aloud, sends the calendar invite during the live call, and confirms acceptance before hanging up; ≥ 4 on M3 rubric on 3 of 5 simulated calls; Salesforce `Next_Step_Booked__c = TRUE` on each successful close. |
| Enabling outcomes | **LO-M3.1** Open calendar pre-dial (habit) · **LO-M3.2** State two slots + send invite during call |
| Task class | Class 1 + Class 2 close pattern (warm + cold) |
| Time budget | 10:00 (brief §7) |
| Mini-OS apps used | LinkedIn / Companies House · Outreach · Phone-dialler · Calendar · Salesforce · Gong · Slack |
| Pre-requisite outcomes | T2 (M1) + T3 (M2) |
| Spaced-retrieval drop | +7 days on LO-M3.1 + LO-M3.2 |

## Gagné event timeline · seconds-level pacing

### 0:00–0:30 · Gain attention · trigger scenario

**Screen.** GC-22-style transcript (exit-interview rep, §11):

> **Buyer:** *Yeah, that does sound interesting. Send me something?*
> **Rep:** *I'll follow up — let me know what works.* `[end of call · no re-engage]`

Muted-red annotation: *"Rep exited at month 4.5. All 3 calls sampled ended in 'follow up'. None re-engaged."* (Exit interview §10.5.)

### 0:30–1:00 · State outcome

> **By the end of these 10 minutes the calendar invite goes out *during* the call. Not after.**

Brand-voice peer line (§18.2): *"'I'll follow up' is where deals go to die. Two slots. One invite. Sent before you hang up."* (M.G. §10.1 paraphrase: *"I do not say 'I'll send you something.' I have lost too many deals to follow-up."*)

### 1:00–1:30 · Recall prior

"M1 opened the call. M2 kept it alive past the pushback. M3 turns it into pipeline. The calendar has to already be open when you dial — that's the habit."

### 1:30–3:00 · Present stimulus + guide · worked example

**Screen — side-by-side (Mayer spatial contiguity).** Left half: Gong transcript window. Right half: mini-OS Calendar app showing M.G.'s actual two free slots.

```
[12:08] Buyer:  ...so yeah, the bookkeeper is overwhelmed at Q-end.

[12:14] Rep:    You mentioned the bookkeeper is overwhelmed by Q-end —
                let me book 20 minutes Tuesday 11 to show your        [Calendar] [M3]
                accountant the Xero sync.

                [Calendar invite "Maria + bookkeeper · Xero sync demo"
                 sent during call — 12:32]

[12:42] Buyer:  Sounds good — I'll forward to Sarah.

[12:48] Rep:    Perfect — Sarah will get the invite in about a minute.
                                                                       [Check] [M3 confirmed]

[Salesforce: Next_Step_Booked__c = TRUE · cmi.activity logged]
```

**Mayer signalling.** M3 line carries (1) primary-green chip; (2) Phosphor `Calendar` icon; (3) text label `[M3]`. Calendar pane on the right pulses subtly when the invite send fires (reduced-motion: instant render).

### 3:00–5:00 · Elicit performance · completion problem

**Stem.** Buyer (Tom, §12.2): *"Yeah, FX is a real headache. What would a demo even look like?"*

**Rep close (best of 4):**

- A) *I'll send you some times by email.* — *(distractor: GC-11 pattern, "I'll email"; re-engage-from-cold failure)*
- B) *Want me to follow up next week?* — *(distractor: closed question + delayed action; GC-19 / GC-22 pattern)*
- C) *What's the best 20 minutes next week to walk you through the FX-cost vs Brex on your last month's spend — Tuesday 11 or Thursday 2?* ✓ *(per L.D. §12.2 closing move + M.G. two-slot pattern · `l2-quiz-blueprint.md` §4.3)*
- D) *Let me know when works for you.* — *(distractor: open-ended; no two-slot anchor)*

### 5:00–8:00 · Elicit performance · solo problem

**Buyer profile (variability).** **Emma** (§12.3) — Manufacturing operations head, 78 FTE, multi-site spend pain.

**Mini-OS sequence — habit-gated.**

1. **Pre-dial habit gate (LO-M3.1).** Mini-OS Outreach dial button is **disabled** until the Calendar app is open in a second window. Coach-mark surfaces if rep clicks dial without Calendar: *"Open Calendar before dialling — second tab."* Event log captures `calendar_open_before_dial: true/false`.
2. **Dial.** Phone-dialler opens.
3. **M1 + M2 recap.** Rep does M1 + M2 (already automated from prior modules); Phone-dialler auto-tags.
4. **Buyer interest signal.** Emma: *"Honestly... if your tool actually pulls supplier receipts off-platform, that would save my bookkeeper a week per month."*
5. **LO-M3.2 close.** Rep selects two slots from the visible Calendar pane, speaks them in one sentence, clicks "Send invite". Mini-OS Calendar app sends invite. Salesforce `Next_Step_Booked__c` field flips to TRUE *during the call*.
6. **Confirm acceptance.** Buyer line: *"Tuesday 11 works. I'll bring my accountant."*
7. **End-of-solo.** Event log committed.

**Success criteria (instrumented).**
- LO-M3.1 `calendar_open_before_dial = true`.
- LO-M3.2 two slots stated in one sentence (token count check); invite sent before call end timestamp; Salesforce flag TRUE before `call_end_reason`.

### 8:00–9:00 · Feedback · self-score + manager-rubric preview

L3 rubric row M3 (`l3-call-rubric.md` row 3). Self-score; anchor highlight. Bottom card includes M.G. §10.1 verbatim: *"I have my calendar open in a second tab the entire time."*

### 9:00–9:30 · Assess · 3-item quiz

From `l2-quiz-blueprint.md` §4.3:

- Item 1 (LO-M3.2): worked-example completion on two-slot close (the §4.3 verbatim item with Tuesday 11 / Thursday 2).
- Item 2 (LO-M3.1): scenario — *"You dial without opening Calendar. Buyer shows interest. What happens?"* Correct: *invite delayed → re-engagement risk · GC-11 pattern*.
- Item 3 (LO-M3.2): scenario — *"Buyer accepts a slot but you forgot to send the invite during the call. What's the cost?"* Correct: *Salesforce flag stays FALSE; re-engage from cold next week → drops to GC-10 pattern*.

### 9:30–10:00 · Enhance retention/transfer

**Key-takeaway card:**

> *"Calendar in second tab. Two slots. One invite. Sent before you hang up. 'Follow up' is the failure mode — make it impossible by sending live." — M.G., Manchester pod.*

**+7-day mini-quiz** auto-scheduled. **L1 pulse** fires.

---

## Worked-example specification

| Field | Detail |
|---|---|
| Buyer profile | Maria (§12.1); GC-01 close pattern |
| SME pattern | M.G. §10.1 verbatim — closing move + "I do not say 'I'll send you something'" + second-tab calendar habit |
| M-move highlight points | `[M3]` Calendar icon on rep slot-statement line; invite-send event marked `[12:32]`; `[Check] [M3 confirmed]` on acceptance line |
| Mayer principles | Signalling, **Spatial contiguity** (Gong + Calendar side-by-side — explicit Mayer principle citation), Segmenting, Pre-training, Coherence |
| Length | ≤ 90 s reading time |

## Completion-problem specification

| Field | Detail |
|---|---|
| Stem | Tom (§12.2) interest signal post-Brex restate |
| Options | A (email · GC-11) · B (follow-up · GC-19/22) · C (two-slot close ✓) · D (open-ended · failure pattern) |
| Time | ≤ 2 min |

## Solo-problem specification

| Field | Detail |
|---|---|
| Buyer profile | **Emma** (§12.3) — multi-site manufacturing ops head; not Maria (variability) |
| Success criteria | LO-M3.1 (`calendar_open_before_dial = true`) · LO-M3.2 (two slots + invite during call + Salesforce flag flips) |
| Habit gate | Dial button disabled until Calendar open |
| Hint affordances | One "show me the move" hint = peek at M.G. two-slot pattern |
| Time | ≤ 3 min |
| Apps active | LinkedIn / Companies House · Outreach · Phone-dialler · **Calendar** (new) · **Salesforce** (new) · Gong · Slack |
| Event-log | `calendar_open_before_dial`, `slots_stated_in_one_sentence`, `invite_sent_during_call_ms`, `salesforce_next_step_booked_set_at`, `call_end_reason` |

## Mini-OS app set used

| App | Purpose |
|---|---|
| LinkedIn / Companies House | Pre-dial signal scan |
| Outreach | Dial queue (with habit-gate disable) |
| Phone-dialler | Live call state |
| **Calendar** | Second-tab habit + two-slot speak + invite send (first time exposed) |
| **Salesforce** | `Next_Step_Booked__c` field visible + flips during call (first time exposed) |
| Gong | Worked-example transcript + post-call self-tag |
| Slack (pinned) | 3-move card visible |

## Accessibility checklist

- [ ] Calendar app keyboard-navigable; two slots selectable via Tab + Enter.
- [ ] Habit-gate disabled-dial-button has `aria-disabled="true"` + `aria-describedby` pointing to the coach-mark.
- [ ] `Calendar` Phosphor icon `aria-label="M3 calendar close move"`; `Check` icon `aria-label="M3 acceptance confirmed"`.
- [ ] Side-by-side Gong + Calendar layout collapses to stacked single-column at narrow viewport (≤ 768 px); spatial-contiguity preserved via vertical proximity.
- [ ] Salesforce flag flip announced via `aria-live="polite"`: *"Next step booked: true"*.
- [ ] Reduced-motion: calendar-pulse on invite-send disabled.

## References

- Brief §§5, 7, 9, 10.1 (M.G. — "calendar in second tab" + closing move), 10.5 (exit interview), 11 (GC-01, GC-10, GC-11, GC-22), 12.1, 12.2, 12.3, 15.1 (Salesforce `Next_Step_Booked__c`), 18.2.
- `01-analyze/task-inventory.md` §2 Class 1 + Class 2 close; §3 components P3 (calendar second-tab) + P2 (Salesforce log); §6 drill D3.
- `01-analyze/learner-personas.md` §1 M.G. + §5 exit interview.
- `02-design/learning-outcomes-abcd-bloom.md` T4, LO-M3.1, LO-M3.2.
- `02-design/curriculum-blueprint.md` §3.2 Module 3.
- `02-design/4cid-blueprint.md` §3.1 close pattern.
- `02-design/module-storyboards/_template.md`.
- `05-evaluate/l1-pulse-survey.md`; `05-evaluate/l2-quiz-blueprint.md` §4.3; `05-evaluate/l3-call-rubric.md` row M3; `05-evaluate/l4-ramp-retention-tracking.md` (`Next_Step_Booked__c` proxy).
- Decisions `D-002`, `D-005`, `D-006`, `D-007`.
- Frameworks: Gagné (1985), Merrill (2002), Renkl & Atkinson (2003), Mayer (2014 — spatial contiguity explicit), Van Merriënboer & Kirschner (2018), Sweller (2011).
