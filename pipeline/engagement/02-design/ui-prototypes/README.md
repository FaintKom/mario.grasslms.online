> Why this artefact: Low-fidelity UI prototypes for the mini-OS shell. Implements the `ux-design-system.md` paradigm in ASCII-art form for cold-readability without binary asset dependency. Drives Phase 3 SCORM shell build (`03-develop/scorm-shell/`). The five mockups below cover the most load-bearing screens identified across the six module storyboards.

# UI prototypes · low-fi mockups

Each mockup is a markdown / ASCII representation of one mini-OS state. Phase 3 implements these as HTML/CSS components per `ux-design-system.md`.

Conventions used below:
- `[Btn]` = primary green action button
- `[btn]` = secondary outline button
- `(•)` = M-move indicator chip (green)
- `▣` = focused / selected item
- `→` = read order / tab order

---

## 1 · Desktop view · Outreach + Gong side-by-side (M1 worked example)

```
+----------------------------------------------------------------------+
|  ⬢ FTC  |  Module 1 · M1 Diagnostic Opener · 1:42 / 10:00  | [?Help] |
|  [Outreach](•) [Gong](•) [SF] [LinkedIn] [Cal] [Phone] [Slack]       |
+----------------------------------------------------------------------+
|                                                                      |
|  +-- Outreach ────────────────+    +-- Gong · GC-01 worked──────+    |
|  | Queue · 4 leads             |    | Manchester · Tue 14:02     |    |
|  |                             |    |                            |    |
|  | ▣ Maria (Retail · 2 stores) |    | [0:00] Rep:  (•)[M1]      |    |
|  |   Last touch: 3 d ago       |    |   "Hi Maria — quick one.  |    |
|  |   [Btn Dial]                |    |    I noticed on Companies |    |
|  |                             |    |    House you've opened a  |    |
|  |   Tom (Series-B SaaS)       |    |    second location in the |    |
|  |   [btn Dial]                |    |    last 6 months — who's  |    |
|  |                             |    |    approving expense      |    |
|  |   Emma (Mfg · 78 FTE)       |    |    reports across both    |    |
|  |   [btn Dial]                |    |    stores now?"           |    |
|  |                             |    |                            |    |
|  |   Lukas (DE Hospitality)    |    | [0:14] Buyer: ...          |    |
|  |   [btn Dial]                |    |        [silence 0:04]      |    |
|  |                             |    |                            |    |
|  +-----------------------------+    | [0:18] Buyer: "Well, my   |    |
|                                     |        bookkeeper does,    |    |
|                                     |        but she's drowning."|    |
|                                     +----------------------------+    |
|                                                                      |
+----------------------------------------------------------------------+
```

**Tab order →** Outreach queue (Maria row first since focused) → Maria's Dial CTA → Tom row → ... → Gong transcript turn-by-turn → silence annotation → buyer answer turn.

**Mayer spatial contiguity** — the M1 annotation `[M1]` sits *on the rep line itself*, not in a sidebar. Per `ux-design-system.md` §6.1.

**No-audio compensation** — silence shown as `[silence 0:04]` in mono font + ARIA live announcement.

---

## 2 · Phone-dialler in-call state with live M1/M2/M3 indicators

```
+----------------------------------------------------------------------+
|  ⬢ FTC  |  Module 1 · solo problem · 5:48 / 10:00      | [?Help]    |
+----------------------------------------------------------------------+
|                                                                      |
|     +-- Phone-dialler ──────────────────────────────────────────+    |
|     |                                                            |    |
|     |   Calling: Tom (Series-B SaaS founder)                     |    |
|     |   ────────────────────────────────────────                 |    |
|     |                                                            |    |
|     |   ┌─────────┐  ┌─────────┐  ┌─────────┐                   |    |
|     |   │ (•) M1  │  │ ( ) M2  │  │ ( ) M3  │                   |    |
|     |   │ ✓ asked │  │ pending │  │ pending │                   |    |
|     |   └─────────┘  └─────────┘  └─────────┘                   |    |
|     |                                                            |    |
|     |   ┌────────────────────────────────────┐                   |    |
|     |   │   Silence countdown: 0:03 / 0:04   │  (aria-live)     |    |
|     |   │   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░     │                  |    |
|     |   └────────────────────────────────────┘                   |    |
|     |                                                            |    |
|     |   Diagnostic asked (word count: 14)                        |    |
|     |   "I see you closed your Series-B last quarter — how       |    |
|     |   are you handling per-employee card issuance for hires?"  |    |
|     |                                                            |    |
|     |   [btn End call]                  [Btn Take notes]         |    |
|     |                                                            |    |
|     +------------------------------------------------------------+    |
|                                                                      |
+----------------------------------------------------------------------+
```

**M-move chips.** Green-filled when registered, outline when pending. Three-cue redundancy preserved: colour + icon (above) + text label (`✓ asked` / `pending`).

**Silence countdown.** Ticks 0:00 → 0:04 in 1-second increments. ARIA live announces *"buyer is thinking — 1, 2, 3, 4 seconds"*. Per `M1-diagnostic-opener.md` solo problem.

**Diagnostic preview.** Word count gives LO-M1.2 ≤ 15-word feedback inline.

---

## 3 · Salesforce next-step booking modal with calendar peek (M3 close)

```
+----------------------------------------------------------------------+
|  ⬢ FTC  |  Module 3 · M3 Calendar Close · 7:12 / 10:00 | [?Help]   |
+----------------------------------------------------------------------+
|                                                                      |
|  +-- Gong · live call ────────+    +-- Calendar (2nd tab) ────+     |
|  | [12:08] Buyer:             |    |        Week of 8 Jul     |     |
|  |   "...so the bookkeeper    |    |  Mon | Tue | Wed | Thu   |     |
|  |    is overwhelmed at       |    | ──── | ──── | ──── | ──── |     |
|  |    Q-end."                 |    |      |  ▣  |      |  ▣  |     |
|  |                            |    |      | 11:00|      | 14:00|     |
|  | [12:14] Rep: (•)[M3]       |    |      |  20m |      |  20m |     |
|  |   "Let me book 20 mins     |    |      | free |      | free |     |
|  |    Tuesday 11 — Xero       |    |      |      |      |      |     |
|  |    sync demo."             |    |      |      |      |      |     |
|  |                            |    +-----------------------------+   |
|  +----------------------------+                                       |
|                                                                      |
|  +-- Salesforce · Account: Maria's Retail Co. ──────────────────+   |
|  |                                                                |   |
|  |   Next_Step_Booked__c:  [ ] FALSE → [▣] TRUE   (just flipped)| |
|  |   First_Paid_Quota_Date__c: —                                  |   |
|  |   Pod__c: UK-Manchester                                        |   |
|  |   Tenure_Cohort__c: 2026-Q3-W27                                |   |
|  |                                                                |   |
|  |   [Btn Send invite to Maria + bookkeeper]                      |   |
|  |   ✓ Calendar invite sent at 12:32 during call                  |   |
|  +----------------------------------------------------------------+   |
|                                                                      |
+----------------------------------------------------------------------+
```

**Spatial contiguity** — Gong + Calendar side-by-side per `M3-calendar-close.md`. Both slot options visible at once; rep selects one (▣).

**Salesforce flag flip.** `Next_Step_Booked__c` shown transitioning. ARIA live announces *"Next step booked: true"*.

**Salesforce-blue.** This is the only window where the Salesforce blue (`#1B5297`) appears — per `ux-design-system.md` §4.3 authentic-context realism.

---

## 4 · Module-end summary card with key-takeaway + +7-day quiz preview

```
+----------------------------------------------------------------------+
|  ⬢ FTC  |  Module 1 complete · 9:48 / 10:00            | [?Help]    |
+----------------------------------------------------------------------+
|                                                                      |
|         +-- Key takeaway ────────────────────────────────+           |
|         |                                                 |           |
|         |   "Pick one signal. Phrase one question.       |           |
|         |    Wait five seconds.                          |           |
|         |    The buyer fills the silence — that's       |           |
|         |    where the call begins."                     |           |
|         |                                                 |           |
|         |                            — M.G., Manchester  |           |
|         +-------------------------------------------------+          |
|                                                                      |
|         +-- Next up ──────────────────────────────────────+          |
|         |                                                 |           |
|         |   📅  +7-day mini-quiz · scheduled              |           |
|         |       3 items · ≤ 2 min · drops in Sana on     |           |
|         |       Mon 22 Jul                                |           |
|         |                                                 |           |
|         |   📋  Module 2 · M2 Objection Acknowledge      |           |
|         |       unlocks now                               |           |
|         |       [Btn Start Module 2]                     |           |
|         |                                                 |           |
|         +-------------------------------------------------+          |
|                                                                      |
|         +-- Pulse · 30 seconds ────────────────────────────+         |
|         |                                                   |          |
|         |   Q1. I could use this on a call today.          |          |
|         |       ◯ 1   ◯ 2   ◯ 3   ◯ 4   ◯ 5                |          |
|         |                                                   |          |
|         |   Q2. Move you're most likely to forget?         |          |
|         |       [ ____________________________ ]            |          |
|         |                                                   |          |
|         |   Q3. What would you remove from this module?    |          |
|         |       [ ____________________________ ]            |          |
|         |                                                   |          |
|         |   [Btn Submit]                                   |          |
|         +---------------------------------------------------+          |
|                                                                      |
+----------------------------------------------------------------------+
```

**Personalisation principle.** "You" not "the learner." Brand voice §18.2 peer-to-peer.

**L1 instrument.** Three items from `l1-pulse-survey.md`. ≤ 30 seconds.

**+7-day mini-quiz preview.** Pre-training principle — telling the learner it's coming reduces the surprise / friction at retrieval.

---

## 5 · Manager rubric overlay · in-module self-score moment (Gagné event 7)

```
+----------------------------------------------------------------------+
|  ⬢ FTC  |  Module 2 · feedback · 8:24 / 10:00          | [?Help]    |
+----------------------------------------------------------------------+
|                                                                      |
|  +-- L3 rubric · self-score ──────────────────────────────────────+ |
|  |                                                                  | |
|  |  Score the solo call you just made on M2 (1–5).                 | |
|  |  This is the same rubric your manager will use on real calls.   | |
|  |                                                                  | |
|  |  Row M2 · Objection acknowledge                                 | |
|  |  ─────────────────────────────────────────────────────────────  | |
|  |                                                                  | |
|  |  ◯ 1 · Absent · Argued with the objection                       | |
|  |       "But our fees are lower"                                  | |
|  |       (P.B. §10.4 pattern, GC-19/20)                            | |
|  |                                                                  | |
|  |  ◯ 2 · Partial · Deflected / talked past                        | |
|  |       (GC-12 pattern)                                            | |
|  |                                                                  | |
|  |  ◯ 3 · Present but generic · "I hear you"                       | |
|  |                                                                  | |
|  |  ▣ 4 · Specific + situational · ←  (this matches your call)    | |
|  |       Named the objection back; waited.                         | |
|  |       (M.G. §10.1, GC-01)                                        | |
|  |                                                                  | |
|  |  ◯ 5 · Anchored + buyer-back-in-buyer-words                     | |
|  |       Restate + the one question that surfaces broken thing.    | |
|  |       (L.D. §10.2, GC-06)                                        | |
|  |                                                                  | |
|  |  Lowest row = coaching focus for next week.                     | |
|  |  This stays between you and your manager. No leaderboard.       | |
|  |                                                                  | |
|  |                                          [Btn Submit self-score]| |
|  +------------------------------------------------------------------+|
|                                                                      |
+----------------------------------------------------------------------+
```

**Anchor highlight.** Anchor 4 is highlighted (▣) because the mini-OS event log detected the rep's call matched that anchor (buyer-word overlap ≥ 2, zero rebuttal tokens). The rep can change the selection — self-determination autonomy support.

**Anchor provenance.** Every anchor cites its evidence (GC ID + §10 SME quote). Per `rubric-design.md` §4 provenance discipline.

**Anti-leaderboard.** Last two lines are verbatim §10.5 anti-public-shaming framing.

---

## 6 · App icons taskbar reference

```
[Outreach]   PaperPlaneRight icon · queue-style avatar
[Gong]       Waveform icon · transcript-style avatar
[SF]         Cloud icon (Salesforce-blue tint inside the icon only)
[LinkedIn]   GlobeNetwork icon
[Cal]        Calendar icon (Phosphor)
[Phone]      Phone icon
[Slack]      Hash icon
[?Help]      Question icon
[Progress]   Circular progress arc (e.g. ⬢ 17%)
```

All Phosphor icons (open-source MIT, per §18.3). Each has `aria-label` per `ux-design-system.md` §8.

---

## 7 · Card-stack mode (viewport < 1024 px) reference

When the viewport narrows below 1024 px, draggable windows collapse to a stacked card-list. The narrative order is preserved — paired windows (e.g. Gong + Calendar in M3) appear adjacent in the stack so spatial contiguity becomes vertical proximity.

```
+--------------------------------+
|  ⬢ FTC  | M3 · 7:12 / 10:00   |
| [Gong][Cal][SF][Phone][≡ more] |
+--------------------------------+
|  ▣ Gong · live call            |
|     ...transcript...           |
+--------------------------------+
|  Calendar (2nd tab)            |
|     ...slot grid...            |
+--------------------------------+
|  Salesforce · account record   |
|     ...next-step modal...      |
+--------------------------------+
```

Per `ux-design-system.md` §3.1 — pure-CSS responsive collapse, no JS condition required for the layout.

---

## 8 · What these prototypes send downstream

| Sends | To |
|---|---|
| Per-screen wireframe + tab order | `03-develop/scorm-shell/screens/*` |
| App-icon + Phosphor mapping | `03-develop/scorm-shell/components/AppIcon.tsx` (or .html) |
| Card-stack collapse breakpoint | `03-develop/scorm-shell/tokens.css` viewport rules |
| Self-score rubric overlay structure | `03-develop/scorm-shell/components/RubricSelfScore.html` + WAI-ARIA roles |
| L1 pulse screen | `03-develop/scorm-shell/components/L1Pulse.html` |

## References

- Brief §§7, 15.1, 18.2, 18.3.
- `02-design/ux-design-system.md` (tokens, signalling, a11y).
- `02-design/module-storyboards/*` (every screen above is the wireframe-form of an event in one of the six storyboards).
- `02-design/rubric-design.md` (§5 self-score overlay).
- `05-evaluate/l1-pulse-survey.md` (§4 pulse screen).
- Mayer (2014) — spatial contiguity, segmenting, signalling, redundancy, pre-training.
- W3C WCAG 2.1 (tab order, focus management, ARIA roles).
- Phosphor Icons (open-source MIT).
- Decisions `D-005`, `D-006`, `D-007`.
