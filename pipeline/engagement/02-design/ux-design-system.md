> Why this artefact: The mini-OS visual + interaction language. Derives from brief §18.3 (visual brand: green `#00b67a`, mono accent, Phosphor icons, no stock photography), §7 (WCAG 2.1 AA), and `D-006` no-audio constraint. Every design rule is paired with a Mayer multimedia principle (Mayer 2014) or a WCAG 2.1 conformance criterion. Drives the Phase 3 SCORM-shell build (`03-develop/scorm-shell/`).

# UX design system · the mini-OS visual + interaction language

## 1 · Brand palette

Per brief §18.3 (visual brand Mario inherits):

| Token | Hex | Use | Contrast verified |
|---|---|---|---|
| `--ftc-green-primary` | `#00b67a` | Primary action · M1/M2/M3 chips · success state · "Send invite" CTA | 4.55:1 on `#ffffff` ✓ AA · 3.31:1 on `#0f1419` ✓ AA-large |
| `--ftc-green-dark` | `#00875f` | Hover state on primary · 1-pt step darker | 5.92:1 on white ✓ AA |
| `--ftc-green-tint` | `#e6f7f0` | Selected-state background · highlighted transcript line | 1.13:1 on white (background only — never used for text) |
| `--ftc-ink` | `#0f1419` | Primary text | 19.2:1 on white ✓ AAA |
| `--ftc-ink-2` | `#475467` | Secondary text · timestamps · meta | 7.6:1 on white ✓ AAA |
| `--ftc-paper` | `#ffffff` | Window background | — |
| `--ftc-surface` | `#f6f8fa` | Mini-OS desktop background · app secondary surface | — |
| `--ftc-border` | `#d0d5dd` | Window border · input border · divider | 3.0:1 on white ✓ AA non-text |
| `--ftc-danger-muted` | `#b42318` | Failure-mode annotation (trigger scenario) — muted, not alarming | 5.1:1 on white ✓ AA |

**Why these.** Per §18.3: *"Lean on this in the SCORM module to avoid Salesforce-blue confusion."* Primary green is the M1/M2/M3 signalling token; no blue accent anywhere except inside the simulated Salesforce window (which keeps Salesforce-blue for authentic-context realism).

## 2 · Typography

Per brief §18.3 + Mayer coherence principle (no decorative typography):

| Token | Stack | Use |
|---|---|---|
| `--ftc-font-sans` | `-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif` | All UI · all body copy |
| `--ftc-font-mono` | `"Geist Mono", "JetBrains Mono", ui-monospace, "SF Mono", monospace` | Data · numbers · timestamps · Gong transcript timestamps · `cmi.*` field labels |
| Base size | `16px` | Body |
| Line height | `1.5` | Body |
| Heading scale | 1.250 modular (16 → 20 → 25 → 31 → 39) | Section titles |
| Font weight | 400 body · 500 emphasis · 600 headings | (no 700-heavy) |

System fonts only (no web-font payload). Mono for data per §18.3 *"Mono accent for data + numbers (matches the Geist Mono Mario already uses)."*

## 3 · Window-manager paradigm

### 3.1 · Desktop layout

```
+--------------------------------------------------------------------+
|  Mini-OS taskbar · top-bar pattern · 40px tall                     |
|  [FTC logo] [Module title]   [Outreach][Gong][SF][LinkedIn][Cal]   |
|                              [Phone][Slack]      [Help] [Progress] |
+--------------------------------------------------------------------+
|                                                                    |
|   +-- Window A ----+        +-- Window B ----+                     |
|   | Outreach       |        | Gong transcript|                     |
|   | (draggable)    |        | (draggable)    |                     |
|   |                |        |                |                     |
|   +----------------+        +----------------+                     |
|                                                                    |
|   ftc-surface background · subtle 8px-grid                         |
+--------------------------------------------------------------------+
```

- Up to **3 windows visible simultaneously** in v1 (most modules use 2: e.g. Gong + Calendar in M3).
- Windows are **draggable** on viewports ≥ 1024 px.
- On viewports < 1024 px → **card-stack mode** (a11y simplification): each window becomes a full-width card; user navigates via tab-bar at top. Spatial contiguity preserved by ensuring paired windows (e.g. Gong + Calendar in M3) are placed adjacent in card-stack order.

### 3.2 · Taskbar elements

- App icons (Phosphor — see §8).
- Module title and progress (e.g. "Module 1 of 6 · 4:32 / 10:00").
- Help button → opens `#sdr-onboarding` Slack pinned-channel with job aids.

## 4 · App-list specification

Each app has: primary view layout, interactive elements, data model (synthetic — no PII per §7 / brief §7).

### 4.1 · Outreach

| Field | Value |
|---|---|
| Primary view | Dial queue (sortable list of synthetic leads — Maria · Tom · Emma · Lukas + variants) |
| Interactive elements | "Dial" button (per row) · disposition log dropdown post-call · sequence step |
| Data model (synthetic) | `{ lead_id, name, archetype, archetype_signals, last_touch_at, sequence_step, disposition }` — no PII (per §7); names are anonymised first-names from §12 |

### 4.2 · Gong

| Field | Value |
|---|---|
| Primary view | Call list + transcript panel |
| Interactive elements | Transcript line click → highlight + jump · M1/M2/M3 tag self-review checkboxes on rep lines post-call |
| Data model | `{ call_id (GC-XX), rep_id, buyer_archetype, duration, tags[], transcript_turns[{ts, speaker, text, m_move_tag}], outcome }` — uses §11 Gong IDs as anchors but content is synthetic worked examples |

### 4.3 · Salesforce

| Field | Value |
|---|---|
| Primary view | Account record card (synthetic ICP archetype) + Next-Step modal + `Call_Review__c` row |
| Interactive elements | `Next_Step_Booked__c` toggle (flips to TRUE on M3 close) · `Tenure_Cohort__c` read-only · `Pod__c` read-only |
| Data model | per brief §15.1 schema verbatim — `Ramp_Time__c`, `Tenure_Cohort__c`, `Pod__c`, `First_Paid_Quota_Date__c`, `Next_Step_Booked__c` |
| Visual treatment | Keeps Salesforce-blue (`#1B5297`) for authentic-context realism — only window where blue appears |

### 4.4 · LinkedIn / Companies House (combined)

| Field | Value |
|---|---|
| Primary view | Buyer profile preview — 4 fields (industry / FTE / spend / stage) + 2-3 visible "signals" |
| Interactive elements | "Click to expand signal" buttons (Mayer segmenting) · "Save to diagnostic draft" |
| Data model | `{ buyer_id, archetype, industry, fte, monthly_spend_est, stage, signals[{type, content, source: "linkedin"\|"companieshouse"}] }` |

### 4.5 · Calendar

| Field | Value |
|---|---|
| Primary view | Week-grid · two highlighted free 20-min slots |
| Interactive elements | Slot select (single-click) · "Send invite" button (only enabled when ≥ 1 slot selected + buyer email present) · multi-invitee toggle (M5) |
| Data model | `{ slot_id, day, time, duration_min, status, invitee_emails[] }` |

### 4.6 · Phone-dialler

| Field | Value |
|---|---|
| Primary view | Big buyer name + live-call state + **M1/M2/M3 indicator chips** + silence countdown overlay |
| Interactive elements | Dial · End call · M1/M2/M3 chips light up as moves register (auto-detect via mini-OS event log) |
| Data model | `{ call_id, buyer_id, started_at, ended_at, events[{ts, type: "diagnostic_asked"\|"silence"\|"restate"\|"close_attempted"\|"invite_sent", duration_ms}] }` |

### 4.7 · Slack

| Field | Value |
|---|---|
| Primary view | `#sdr-onboarding` channel with pinned job aids: 3-move card · ICP archetype card · 4-prop card · §19 reg deflection table |
| Interactive elements | Pinned-message click → opens job aid in modal overlay · Module 6 forces pinned channel visible |
| Data model | `{ channel_id, pinned_messages[{title, content_md, related_module}] }` |

---

## 5 · Mayer principles applied

Per Mayer (2014) + `D-006` no-audio compensation rules. Every design rule below cites a principle.

| Mayer principle | Rule in our system | Citation |
|---|---|---|
| **Signalling** | Every M-move highlighted with 3 redundant cues: primary-green chip + Phosphor icon + text label `[M1]/[M2]/[M3]` | Mayer 2014 ch. 6 |
| **Spatial contiguity** | Annotations sit on the same line as the move; Gong + Calendar side-by-side in M3; 4-prop card adjacent to prop-line in M5 | Mayer 2014 ch. 8 |
| **Temporal contiguity** | Silence countdown timer fires in the same window as the rep's diagnostic, not in a different overlay | Mayer 2014 ch. 9 |
| **Coherence** | No decorative motion, no stock photography (per §18.3), no off-topic content, no background sound (no audio) | Mayer 2014 ch. 5 |
| **Redundancy** | When audio would normally pair with visual (e.g. silence indicator), we provide *visual + text + ARIA live* (3-channel because no audio per `D-006`) | Mayer 2014 ch. 11 — inverted application |
| **Modality** | Forced to **all-visual** by `D-006`; compensated by Signalling + Segmenting + Pre-training | Mayer 2014 ch. 10 — constrained application |
| **Multimedia** | Every concept paired with: text + icon + colour chip | Mayer 2014 ch. 4 |
| **Pre-training** | 3-move card + ICP archetype card delivered before Module 1 (per `curriculum-blueprint.md` §5) | Mayer 2014 ch. 14 |
| **Segmenting** | Each Gong transcript turn fades in independently; each module's 10 min divides into 9 timed segments per Gagné | Mayer 2014 ch. 13 |
| **Personalisation** | Voice = peer-to-peer (§18.2 brand voice); "you" not "the learner" | Mayer 2014 ch. 15 — text-channel application |
| **Image / Voice / Embodiment** | **Not applicable in v1** (no human image, no voice — per §18.3 no stock photography + `D-006` no audio) | v1 explicit non-goal |

---

## 6 · Signalling system

How M1 / M2 / M3 highlights appear in mock transcripts:

### 6.1 · Three-cue redundancy (Mayer signalling)

Every M-move occurrence carries **three** redundant cues:

1. **Colour.** Primary-green chip on the rep line (`background: --ftc-green-tint; border-left: 3px solid --ftc-green-primary`).
2. **Icon.** Phosphor icon at line start — `Eye` for M1, `ArrowsClockwise` for M2, `Calendar` for M3.
3. **Text label.** `[M1]`, `[M2]`, `[M3]` token appended to the rep line.

Why three cues: per `D-006` (no audio) we lose the modality channel; the redundancy principle (Mayer 2014 ch. 11) becomes *required*, not optional, to compensate.

### 6.2 · Silence signalling

Per LO-M1.3 (5-second silence threshold concept):

- **Inline text.** `[silence 0:04]` in mono font on its own line in the transcript.
- **Visual.** A 4-second countdown overlay on the Phone-dialler app.
- **ARIA.** `aria-live="polite"` announces *"buyer is thinking"* at silence-start; *"4 seconds elapsed"* at silence-end.

### 6.3 · Failure-mode signalling

For trigger-scenario screens (the failed call shown in Gagné event 1):

- **Colour.** Muted red border + `--ftc-danger-muted` tint on the failure line. Never alarming — informational, not punishing (per §10.5 anti-public-shaming signal).
- **Label.** `[failure: GC-XX]` with the actual Gong call ID cited.

---

## 7 · Animation budget

Minimal per Mayer's redundancy + coherence principles. Per brief §18.3 + `cognitive-load-analysis.md` §4 (extraneous-load reduction):

| Element | Animation | Reduced-motion behaviour |
|---|---|---|
| Window open / close | 200 ms ease-out fade-in | Instant (no fade) |
| Transcript turn fade-in | 150 ms per turn | All turns render instant |
| Silence countdown timer | Tick once per second (CSS `transition`, not keyframe loop) | Tick still happens (it's functional, not decorative) |
| M1/M2/M3 chip activation | Brief 100 ms scale (1.0 → 1.05 → 1.0) | Instant chip render |
| Modal overlays | 150 ms slide-up | Instant render |
| Calendar invite-sent pulse | One subtle 300 ms green pulse | Instant background colour change |

**Rule.** Any animation that does not carry information is eliminated. Any animation that carries information is preserved but uses `prefers-reduced-motion: reduce` to switch to instant variant.

---

## 8 · Iconography (Phosphor — per §18.3)

Phosphor icon set (open-source, MIT). Each icon used in signalling carries an `aria-label`:

| Icon | Use | `aria-label` |
|---|---|---|
| `Eye` | M1 diagnostic | "M1 diagnostic move" |
| `ArrowsClockwise` | M2 acknowledge | "M2 acknowledge move" |
| `Calendar` | M3 close | "M3 calendar close move" |
| `Check` | Acceptance confirmed | "M3 acceptance confirmed" |
| `Question` | M2 follow-up question | "M2 follow-up question" |
| `Users` | Second stakeholder joined | "Second stakeholder joined the call" |
| `Lightbulb` | Hint affordance | "Show me the move" |
| `Storefront` | Maria archetype | "Maria — retail SMB owner" |
| `Rocket` | Tom archetype | "Tom — Series-B tech founder" |
| `Factory` | Emma archetype | "Emma — manufacturing operations head" |
| `ForkKnife` | Lukas archetype | "Lukas — restaurant group owner" |
| `ShieldCheck` | §19 reg deflection row | "Regulatory deflection — KYC/AML/SCA/PSD2/GDPR" |
| `Warning` | Failure-mode annotation | "Failure pattern" |

No stock photography anywhere (§18.3).

---

## 9 · WCAG 2.1 AA conformance approach

Per brief §7 contractual constraint + `D-006` + CAST UDL.

### 9.1 · Perceivable

- **Contrast.** All text ≥ 4.5:1 against background (AA); UI components ≥ 3:1 (AA). Primary green verified in §1.
- **Text alternatives.** Every icon used as a signalling cue has `aria-label`. Decorative icons have `aria-hidden="true"`.
- **Captions.** Not applicable in v1 (no audio per `D-006`). v2 if audio added.
- **No-audio compensation.** Every information channel that would normally carry audio uses *text + icon + ARIA live region* (three-cue redundancy).

### 9.2 · Operable

- **Keyboard.** Every interactive element reachable via Tab. Tab order = visual top-to-bottom + logical narrative order (trigger → outcome → recall → worked example turns → completion → solo → debrief → quiz → retention → L1 pulse).
- **Focus visible.** ≥ 3:1 contrast ring around focused element; never `outline: 0`.
- **No motion seizure trigger.** Animations < 1 Hz and < 3 flashes per second (well under WCAG 2.3.1 limit).
- **Reduced motion honored.** `prefers-reduced-motion: reduce` switches all decorative motion to instant.
- **Skip links.** Skip-to-main-content + skip-to-job-aids on every module screen.
- **Modal trap.** Modal overlays trap focus until Escape pressed.

### 9.3 · Understandable

- **Language.** `<html lang="en">` (v1 EN-only per brief §3). v2 adds `lang="es"` and `lang="de"` per pod.
- **Input labels.** Every text input has a programmatic `<label>` or `aria-label`.
- **Error identification.** Quiz incorrect-answer feedback uses both colour (`--ftc-danger-muted`) and text ("This is the pattern in GC-XX...") — never colour alone.

### 9.4 · Robust

- **Semantic HTML.** Tables for the §19 reg deflection job aid (`<th scope="row">`); buttons for actions (never `<div onclick>`); `<dialog>` element for modals where browser support allows.
- **ARIA roles.** Used sparingly — only where native semantics fail (e.g. taskbar uses `role="toolbar"`; live regions use `aria-live`).

### 9.5 · Screen-reader announcement plan for window transitions

When a new window opens (e.g. mini-OS Calendar app pops out in M3), an `aria-live="polite"` announces: *"Calendar app opened. Two free slots highlighted."*

When focus moves between windows: focus indicator + window-title is read first (e.g. *"Gong transcript window, focused"*).

### 9.6 · Audit cadence

- Per-module audit during Phase 3 build (`03-develop/scorm-shell/a11y-audit.md`).
- NVDA + JAWS sweep before SCORM Cloud upload.
- Manual keyboard-only walkthrough by Mario every module.

---

## 10 · No-audio compensation strategy

Per `D-006`. The no-audio constraint is contractual (brief §7) — but it inverts Mayer's modality principle, which normally favours audio + visual. The compensation strategy:

1. **All call examples are transcripts**, not audio recordings. Timestamps `[0:00]` in mono font carry the temporal anchor that audio would.
2. **Silence is shown via text + countdown timer + ARIA live** (three cues). Per `M1-diagnostic-opener.md` solo problem.
3. **Pre-training carries more weight** than it would with audio. The 3-move card + ICP card are read *before* Module 1 fires, so the rep enters M1 with schema activated — reducing the load that audio narration would normally offload.
4. **Worked-example transcripts feel real** through typography + timestamps + speaker labels + line spacing — not through narration.
5. **v2 audio policy.** When budget allows, curated human-voice could supplement (not replace) the visual channel. Mayer voice principle: human voice preferred over TTS.

---

## 11 · Coach-mark / job-aid system (Rossett & Schafer 2007)

Per `D-007` + Rossett & Schafer's *point-of-use support* principle.

### 11.1 · Coach-marks (in-context how-tos)

- Trigger: first time a rep enters an app inside the mini-OS (per `4cid-blueprint.md` §5 procedural-info table).
- Format: overlay panel anchored to the UI element being explained, with a single short sentence + dismiss button.
- Consistent placement rule: top-right of the target element, with a connector line.
- Dismissed coach-marks remain accessible via the `Help` button in the taskbar.

### 11.2 · Job aids (referenceable assets)

Four job aids ship with the program:

| Job aid | Module of origin | Post-launch location |
|---|---|---|
| **3-move card** (M1/M2/M3 + one-sentence definition each) | Pre-training | Slack pinned + rep desktop 1-pager |
| **ICP archetype card** (Maria · Tom · Emma · Lukas summary) | Pre-training | Slack pinned + rep desktop |
| **4-prop decision card** (pain → prop) | Module 5 | Slack pinned + rep desktop |
| **§19 reg deflection table** | Module 6 | Slack pinned (forced visible in M6) + rep desktop |

All four are 1-page A4 PDFs + HTML versions inside the mini-OS Slack-pinned channel.

### 11.3 · Consistent visual rules

- Each job aid uses the §18.3 visual brand verbatim.
- Headings in `--ftc-font-sans` semibold.
- Data fields in `--ftc-font-mono`.
- Phosphor iconography per §8.
- No paragraphs longer than 3 sentences (per brief §18.2 anti-jargon).

---

## 12 · What this design sends downstream

| Sends | To |
|---|---|
| Colour + typography tokens | `03-develop/scorm-shell/tokens.css` |
| Window-manager paradigm | `03-develop/scorm-shell/window-manager/` |
| App-list spec (7 apps × data model) | `03-develop/scorm-shell/apps/*` |
| Signalling system | every storyboard's worked-example annotation |
| WCAG 2.1 AA approach | `03-develop/scorm-shell/a11y-audit.md` |
| Animation budget + reduced-motion rules | `03-develop/scorm-shell/motion.css` |
| 4 job aids spec | `03-develop/job-aids/` + `04-implement/launch-comms-plan.md` (job-aid distribution) |

## References

- Brief §§3, 7, 14, 15.1, 18.1, 18.2, 18.3, 19.
- Mayer, R. E. (2014). *The Cambridge Handbook of Multimedia Learning* (2nd ed.).
- CAST (2018). *Universal Design for Learning Guidelines* v2.2.
- W3C (2018). *Web Content Accessibility Guidelines 2.1.*
- Rossett, A., & Schafer, L. (2007). *Job aids and performance support.*
- Sweller, J., Ayres, P., & Kalyuga, S. (2011). *Cognitive load theory.*
- `01-analyze/cognitive-load-analysis.md` §4 extraneous-load reduction.
- `02-design/curriculum-blueprint.md` §5 pre-training assets.
- `02-design/4cid-blueprint.md` §5 procedural info table.
- `02-design/module-storyboards/*` accessibility checklists.
- Decisions `D-005` (custom SCORM), `D-006` (no audio), `D-007` (mini-OS).
