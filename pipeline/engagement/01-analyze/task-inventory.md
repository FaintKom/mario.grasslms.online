> Why this artefact: 4C/ID (Van Merriënboer 1997/2018) decomposition of the whole task — "conduct a 60-second-opener-to-calendar-close cold call against an ICP buyer" — into its four components (learning tasks · supportive information · procedural information · part-task practice). Provides the curriculum-architecture spine that `02-design/4cid-blueprint.md` consumes. Replaces the brief's current §14 product-then-tools sequence, which the §14 audit verdict already discredits.

# Task inventory · 4C/ID decomposition

## 1 · Whole task definition

> **Conduct a 60-second-opener-to-calendar-close cold call against an ICP buyer.**

Operationally: from the moment the rep clicks "dial" in Outreach to the moment a calendar invite for a next-step meeting is sent and accepted, against a buyer matching one of the four ICP archetypes in brief §12.

The whole task is **configural** (per brief §9 A.S.: *"Top reps sound nothing alike. They don't follow a script. But those three moves are always there."*). This is the canonical 4C/ID trigger condition: a complex skill made of interdependent sub-skills that lose meaning when isolated. Decision lens: `D-002`.

### Why this is the whole task, not some subset

- **Not "cold call opening"** — the M1 opener creates the pitch, and the pitch matters only if M3 calendar-close lands. Truncating before the close re-creates the §14 audit failure mode (tools and parts taught in isolation).
- **Not "the full sales cycle"** — the brief is explicit (§6 in-scope): 0–60 day ramp arc, call-motion craft. The discovery-to-demo-booked window is the contractual unit.
- **Not "any buyer"** — the ICP archetypes (§12) bound the variability of practice.

## 2 · Task classes — six classes of increasing complexity

4C/ID asks for task classes ordered from simplest-meaningful-whole-task to most complex, with variability inside each class. Each class is its own module in Phase 3.

| # | Task class | Defining variability | What makes it harder than the previous | Buyer archetype (§12) | Calls in §11 that map |
|---|---|---|---|---|---|
| **1** | Warm inbound — buyer has expressed interest | Buyer is *already aware*; M1 diagnostic confirms fit rather than creates it | Lowest cognitive load; rep can practise the structure of M1/M2/M3 without the rejection-rate pressure | Mixed | (Synthetic — brief samples are mostly cold) |
| **2** | Cold outbound to receptive buyer (no pre-loaded objection) | Buyer is *cold but curious*; objection is absent or mild | Adds the diagnostic *creation* step; rep must pick the right diagnostic from LinkedIn / Companies House | Maria (retail SMB) — §12.1 | GC-01, GC-02, GC-15, GC-16, GC-18 |
| **3** | Cold outbound to hostile buyer (pre-loaded objection) | Buyer pushes back in first 30 s ("we already have a Visa", "we already use Brex", "fees are lower elsewhere") | M2 acknowledge becomes the hinge; argumentation reflex must be overridden under live rejection load | Maria + Tom — §12.1 + §12.2 | GC-09 (failed M2), GC-17, GC-19, GC-20 |
| **4** | Competitive displacement (Brex specifically) | Buyer has *named* a competitor; rep cannot argue against it (per L.D. §10.2) | Adds the additive-not-replacement frame; FX-exposure wedge; requires the 4-prop model under live pressure | Tom (Series-B founder) — §12.2 | GC-06 (L.D. successful) |
| **5** | Multi-stakeholder call (founder + finance / owner + accountant) | Two voices on the call with different objection profiles | Rep must hold two simultaneous diagnostics; calendar-close requires both stakeholders' availability | Emma (manufacturing, accountant-co-decision) — §12.3 | (Synthetic — not in brief's 22 calls) |
| **6** | Regulatory-question deflection mid-call | Buyer asks a KYC/AML/SCA/PSD2/GDPR question; rep must defer-to-proof, not invent | Adds the deflection table (§19); requires *not* selling against regulation, *for* it | Lukas (German hospitality, low-trust on fintechs) — §12.4 | (Synthetic — derived from §19) |

### Why six classes and in this order

- The brief's §11 Gong distribution clusters around classes 2–4 (cold outbound · objection · displacement). Class 1 (warm inbound) is a *scaffolding class* — easier than the real work but uses the same M1/M2/M3 structure. Class 5 (multi-stakeholder) and Class 6 (regulatory deflection) appear in the brief as buyer-archetype features (Emma needs the accountant; Lukas needs the regulator page) but are not directly evidenced in §11. They are inferred from §12 + §19 and flagged for SME validation.
- Per 4C/ID variability principle: each class contains 2–3 *variants* (e.g. UK-style vs DE-style diagnostic within Class 2 — per L.D. §10.2).

## 3 · Component skills

For each task class, the component skills the rep must coordinate. Classified as **cognitive** (selection / decision / framing) vs **psychomotor + procedural** (tool execution).

| # | Component skill | Cognitive vs Procedural | Appears in classes |
|---|---|---|---|
| C1 | Read a LinkedIn / Companies House profile and extract one *diagnostic-worthy* signal in < 90 s | Cognitive | 2, 3, 4, 5, 6 |
| C2 | Match the buyer to an ICP archetype (Maria · Tom · Emma · Lukas) | Cognitive | All |
| C3 | Pick a diagnostic question that is *quant-anchored* (DE pattern, L.D.) vs *behavioural-anchored* (UK pattern, M.G.) | Cognitive | 2, 3, 4 |
| C4 | Ask the diagnostic and *wait ≥ 3 s* (threshold concept: tolerate the 5-second silence) | Cognitive + Affective | All |
| C5 | Restate an objection in the buyer's *own words* before responding | Cognitive | 3, 4, 5 |
| C6 | Map a stated pain to one of the 4 product props (§13.1) | Cognitive | All |
| C7 | Frame a competitor (Brex) as additive-not-replacement | Cognitive | 4 |
| C8 | Deflect a regulatory question without inventing — use the §19 table | Cognitive | 6 |
| C9 | Hold two simultaneous diagnostics for multi-stakeholder calls | Cognitive (high element-interactivity) | 5 |
| P1 | Operate Outreach dial sequence (queue · dial · log) | Procedural | All |
| P2 | Operate Salesforce next-step logging (`Next_Step_Booked__c` to TRUE) | Procedural | All |
| P3 | Operate calendar in *second tab*: identify two free 20-min slots, voice them, send invite during call | Procedural | All |
| P4 | Apply Gong post-call tag review on own calls (self-coaching loop) | Procedural | All (post-call) |

## 4 · Supportive information — mental models / strategies

Supportive info = the *frameworks* the rep applies to novel buyers. Delivered before / alongside learning tasks; not memorised — referenced.

| Model | Purpose | Source in brief | Delivered in |
|---|---|---|---|
| **The 3-move model (M1/M2/M3)** | The configural pattern that distinguishes top decile from bottom quartile across every Gong call. Per A.S. §9 + §11 aggregate. | §9 + §11 | Module 1 (M1) · Module 2 (M2) · Module 3 (M3) introductions; integrated in Module 4+ |
| **The ICP archetype model** | Four buyers (Maria · Tom · Emma · Lukas) with named pains, objections, and opener templates. | §12.1–§12.4 | Pre-training reference card in Module 1; full coverage in Module 4 |
| **The 4-prop model** | Real-time spend control · multi-user cards · auto-FX · receipt-capture-and-sync. Mapped to which buyer fits which prop. | §13.1 | Module 5; referenced in every prior module's pitch decisions |
| **The regulatory deflection table** | KYC · AML · SCA · PSD2 · GDPR — what each means + the rep's response. Per §19. | §19 | Module 6; job-aid version (Rossett & Schafer 2007) lives on the rep's desktop post-launch |
| **Brand voice rules** | Transparent · anti-jargon · specific-over-generic · concedes weakness | §18.1 | Embedded in worked-example transcripts across all modules |

### Strategy: which prop against which objection

Per M.G. §10.1: *"What I needed was the framing of when to use which prop against which objection."* This pairing is currently absent from §14 training. It becomes an explicit decision-table in Module 5 (Product Prop Mapping) — see `02-design/module-storyboards/module-5.md` *(to be authored)*.

## 5 · Procedural information — just-in-time how-tos

Procedural info = the *how* of the tooling, delivered in the workflow, not in a separate module (§14 audit verdict: "Tools learned in isolation, not in workflow"). All procedural info lives inside the mini-OS (`D-007`) as pop-up coach-marks or context-sensitive sidebars.

| Procedure | When delivered | Where |
|---|---|---|
| Outreach dial sequence (queue · dial · log call outcome) | First time rep enters mini-OS Outreach app, Module 1 | Mini-OS coach-mark |
| Salesforce next-step logging (`Next_Step_Booked__c`) | After first calendar-close attempt, Module 3 | Mini-OS coach-mark + Module 3 worked example |
| Gong post-call self-tag review (own M1/M2/M3 tags) | Module 1 closing screen onwards | Mini-OS Gong app |
| LinkedIn / Companies House signal-extraction (90-sec scan) | Pre-call workflow, Module 1 + 2 | Mini-OS LinkedIn app + downloadable 1-pager |
| Calendar-in-second-tab habit setup | Module 3 pre-task | Mini-OS Calendar app |

## 6 · Part-task practice candidates

Part-task practice = drill on automatable sub-skills until they're *fast enough to free working memory* for the configural call. Sweller's automation prerequisite (CLT — `cognitive-load-analysis.md`).

| Drill | What the rep does | Time per rep | Module / placement |
|---|---|---|---|
| **D1 · Diagnostic-question reframing** | Given a LinkedIn snippet, write the diagnostic question in ≤ 15 words. 10 iterations per session. | 5 min | Module 1 part-task block |
| **D2 · Objection-acknowledgement one-question reframe** | Given 10 objection phrasings, restate each in the buyer's own words in one sentence. | 5 min | Module 2 part-task block |
| **D3 · Calendar-time stating without read-out** | Speak two calendar slots aloud in a *single* sentence ("Tuesday at 10 a.m. or Wednesday at 2 p.m.?"). Drill against transcript practice. | 3 min | Module 3 part-task block |
| **D4 · ICP archetype identification** | Given a buyer signal (industry · FTE · spend), pick Maria / Tom / Emma / Lukas in < 5 s. 20 cards. | 4 min | Module 4 part-task block |
| **D5 · Prop-to-objection mapping** | Given an objection card (e.g. "we already use Brex"), pick the prop and the framing. 15 cards. | 5 min | Module 5 part-task block |
| **D6 · Regulatory deflection one-liner** | Given a buyer's regulatory question (KYC · AML · SCA · PSD2 · GDPR), state the rep's response from §19 verbatim in one sentence. | 4 min | Module 6 part-task block |

**Total drill budget per module: ≤ 5 min**, within the ≤ 10-min cohort tolerance (brief §7). The remaining ≤ 5 min goes to the whole-task application (worked example → completion → solo problem in mini-OS).

## 7 · Sequencing rule — variability of practice

Per Van Merriënboer (2018) ch. 5: within a task class, practice items are sequenced *high-variability* (different ICPs, different objections, different industries) to drive schema generalisation. We will not sequence "all Maria calls, then all Tom calls" — we'll interleave so the rep cannot pattern-match on superficial cues.

## 8 · Out-of-scope tasks (explicitly)

Per brief §6 and `D-001`:

- **Discovery-call structure beyond 20 min.** Out of scope; that's AE work, not SDR.
- **Demo execution.** Handled by AE org separately.
- **Compliance-side regulatory training.** Cornerstone team owns. We cover only the rep-side deflection (Module 6).
- **CRM hygiene beyond `Next_Step_Booked__c`.** Salesforce admin owns the broader CRM data quality conversation.

## 9 · What this inventory sends to Phase 2

| Sends | To |
|---|---|
| Six task classes → six modules | `02-design/curriculum-blueprint.md` |
| Component skills C1–C9 + P1–P4 → enabling outcomes (ABCD) | `02-design/learning-outcomes-abcd-bloom.md` |
| Supportive info models → reference cards in mini-OS + Module 4/5/6 content | `02-design/module-storyboards/` |
| Procedural info → mini-OS coach-marks (`D-007`) | `03-develop/scorm-shell/` |
| Six part-task drills (D1–D6) → drill scripts in each module | `02-design/module-storyboards/module-*.md` |

## References

- Brief §§6, 9, 10.1, 10.2, 11, 12, 13.1, 14, 18.1, 19.
- Van Merriënboer, J. J. G. (1997). *Training complex cognitive skills.* Educational Technology.
- Van Merriënboer, J. J. G., & Kirschner, P. A. (2018). *Ten steps to complex learning* (3rd ed.). Routledge.
- Rossett, A., & Schafer, L. (2007). *Job aids and performance support.* Pfeiffer.
- Decisions `D-002`, `D-006`, `D-007`.
