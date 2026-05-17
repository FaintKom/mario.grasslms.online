> Why this artefact: Quantifies the intrinsic, extraneous, and germane load of a live cold call against each persona, using Sweller's element-interactivity lens (Sweller 1988; Sweller, Ayres & Kalyuga 2011). The brief's ≤ 10-min cohort-tolerance constraint (§7) is a hard germane-load budget; this file says what fits inside it and what has to be off-loaded to job aids, scaffolds, or part-task drills.

# Cognitive load analysis · per persona × per task class

## 1 · Framing — three loads, one budget

| Load type | Source | Lever |
|---|---|---|
| **Intrinsic load** | Inherent complexity of the task (number of interacting elements held in working memory) | Sequence simple→complex; isolate elements; pre-train sub-skills |
| **Extraneous load** | Poor presentation, split attention, redundancy, irrelevant detail | UI design, signalling, spatial contiguity (Mayer) |
| **Germane load** | Effort spent constructing schemas | What we *want* to maximise — within the budget |

Per Kalyuga's *expertise reversal effect* (Kalyuga 2007), what is germane for a novice (worked examples) becomes extraneous for an expert. We design the worked-example fading sequence accordingly per `D-002`.

The **budget for germane load per module is ≤ 10 minutes** (brief §7 cohort-tolerance constraint). Per 4C/ID per `task-inventory.md` §6, ≤ 5 min goes to part-task drill, ≤ 5 min to whole-task application.

## 2 · Element-interactivity of a live cold call

The live call has at least seven simultaneous elements the rep must hold or operate:

| # | Element | Where it lives | Who's looking at it |
|---|---|---|---|
| **E1** | Buyer auditory signal — tone, hesitation, push-back | Phone | Rep's ears |
| **E2** | Talk-track / move plan — M1 → M2 → M3 sequence | Memory (or cheat sheet) | Rep's working memory |
| **E3** | Screen scanning — LinkedIn / Companies House profile open | Browser tab 1 | Rep's eyes |
| **E4** | Calendar — open in second tab to read out two free slots | Browser tab 2 | Rep's eyes (alternating with E3) |
| **E5** | CRM logging — Salesforce next-step field, called-disposition tag | Browser tab 3 | Rep's hands (typing during call) |
| **E6** | Objection inventory — pre-loaded "if buyer says X, restate as Y" | Memory or printout | Rep's working memory |
| **E7** | Regulatory awareness — when to defer, when to use §19 table | Memory | Rep's working memory |

Three more elements appear in advanced classes:

| # | Element | Class trigger |
|---|---|---|
| E8 | ICP archetype match | Class 2+ |
| E9 | Competitive frame (additive-not-replacement) | Class 4 |
| E10 | Second-stakeholder voice | Class 5 |

**Element-interactivity score** (Sweller 2011 method — count of elements that must be held simultaneously to perform the act): for a Class 3 hostile cold call, the rep holds E1 + E2 + E3 + E4 + E6 + E8 simultaneously, with E5 + E7 in standby. That's **6–8 interacting elements at peak**.

For context: chunked working memory holds ~4 elements (Cowan 2001). The call is, intrinsically, *above* working-memory capacity unless **some elements are automated** (P1–P4 procedurals in `task-inventory.md`) or **off-loaded to job aids** (regulatory deflection table; objection inventory).

This is *exactly* the diagnosis behind H.K.'s quote: > "I know the three moves but I forget them under pressure. By call 3 of a tough day I'm just pitching." — §10.3 — element interactivity exceeds her current schema capacity, so under fatigue the elements collapse to "pitch."

## 3 · Intrinsic-load profile per persona

| Persona | Pre-existing schemas | Element-interactivity tolerance | Implication |
|---|---|---|---|
| **M.G. (top-decile)** | All seven elements automated; 4 months of self-discovery built the schemas (§10.1) | High | She *can* run Class 5 multi-stakeholder. She does not need worked examples (would trigger expertise reversal); she needs the system to articulate *what she's already doing* so it can be taught. |
| **L.D. (top-decile · DE)** | Same as M.G., plus competitive-displacement schema (§10.2) | High | She is the Class 4 reference performer. Same expertise-reversal caveat. |
| **Mid-band (H.K. / N.W. / R.A. / O.B.)** | M1/M2/M3 schemas *partially* built; collapse under load (§10.3) | Medium — works on easy calls, fails on hard ones | Part-task drills (D1–D3) are the priority. Their schemas need to *automate* so working memory frees up for E1 + E2. |
| **P.B. (bottom-quartile)** | No move-level schemas; product schemas only (§10.4 "It loaded knowledge, not moves") | Low | Worked examples are non-negotiable. Without them she defaults to E2-only pitch-launch. |
| **Exit interviewee** | Same as P.B. at exit | Low | Same as P.B., plus motivation collapse (§10.5) — see `gap-analysis.md` motivation row |
| **High-cadence manager (J.T.)** | Has built her own rubric (§10.6) | High | She's the rubric author; she doesn't need the rubric explained, she needs calibration with peers. |
| **Low-cadence manager (composite)** | Variable; some have rubrics, some don't | Variable | Single-page rubric (`D-004`) keeps grader cognitive load low. |

### What "high intrinsic load" means for design

For P.B. and mid-band reps, **Class 3 (hostile cold call) is above their working-memory capacity** until M1/M2/M3 are automated. Sequencing implication: Class 1 and Class 2 must *automate the moves* before Class 3 introduces the objection-load element. This is what 4C/ID's task-class progression operationalises (per `task-inventory.md` §2).

## 4 · Extraneous load — what to eliminate

| Source of extraneous load | Where it shows up today | Phase-2 / 3 mitigation |
|---|---|---|
| **Tool training in isolation** (§14 audit) | Week 2 self-paced LMS tour | Tools learned *inside the mini-OS* during call practice (`D-007`) — eliminates "where was that button?" load mid-call |
| **Split-attention between transcript and audio** (Mayer split-attention) | Audio-narrated SCORM common pattern | No-audio constraint (`D-006`) already eliminates this — text + on-screen transcript, no parallel audio channel |
| **Cheat-sheet language mismatch** (R.A. §10.3 EN → ES translation in-head) | Today's EN-only cheat sheets used by ES pod | v2 ES + DE translation; v1 acknowledges this as an extraneous-load tax on ES pod |
| **Slide-deck format with no behavioural anchor** (K.M. §8 "Articulate slide-deck no one finishes") | Existing onboarding | Replaced by mini-OS-embedded worked examples + part-task drills |
| **Leaderboard surveillance** (§10.5 "Every Monday I was bottom 3") | Slack leaderboard | Per `frameworks-applied.md` §18: no leaderboard gamification in v1 — emotional load suppresses germane load |

## 5 · Germane load — what we want the rep building

Germane load = schema construction. For this program, the schemas are:

1. **M1 schema:** "When I encounter a buyer, I extract one signal, ask one diagnostic, and wait." (Class 1–6)
2. **M2 schema:** "When the buyer objects, I restate their words before I respond." (Class 3–5)
3. **M3 schema:** "Before I hang up, the calendar invite is sent." (Class 2–6)
4. **ICP-match schema:** "Given this signal-set, this is a Maria / Tom / Emma / Lukas call." (Class 2–6)
5. **Prop-to-pain schema:** "Given this stated pain, this is Prop 1/2/3/4." (Class 2–6)
6. **Regulatory deflection schema:** "Given this question, this is the §19 row response." (Class 6)

**The germane-load budget per module** (≤ 10 min) must produce *measurable construction of one of these schemas*, evidenced by the L2 first-attempt + +7-day retention scores (brief §5).

## 6 · Recommendations — what gets off-loaded, what gets scaffolded, what stays in-head

### Off-load to job aids (Rossett & Schafer 2007)

The cost of forgetting is high *during* the call; full memorisation is unrealistic. Off-load:

- **Regulatory deflection table (§19) → 1-page desktop job aid.** Five rows. Lives in mini-OS Slack channel pinned message + post-launch on rep's actual desktop.
- **Objection inventory (5 most common objections × restate-template) → 1-page job aid.** Stays open in browser tab during dial.
- **ICP archetype card (4 buyers × diagnostic templates) → 1-page job aid.** Replaces the in-head 4-month discovery M.G. described.

### Scaffold (worked example → completion → solo problem)

Per Renkl & Atkinson 2003. Inside each module:

1. **Worked example** — annotated Gong-style transcript with M1/M2/M3 markers visible (≈ 3 min reading).
2. **Completion problem** — same call but with M1 question redacted; rep fills in (≈ 2 min).
3. **Solo problem** — new buyer profile, mini-OS live; rep makes the call (≈ 5 min).

Total ≤ 10 min per module. Fits the cohort-tolerance budget.

### Keep in-head (automated)

After spaced retrieval (brief §5 L2 target ≥ 70 % at +7 d):

- The M1/M2/M3 sequence itself (3-element list).
- The 5-second silence threshold (single affective tolerance).
- ICP-pain-to-prop pairings for the *most common* buyer (Maria) — extended to all four buyers by end of program.

## 7 · The ≤ 10-min budget per module — what it means

| Slice | Time | Activity |
|---|---|---|
| Activation (Merrill) | ~1 min | Trigger scenario — show the failure-mode call (Class-relevant) |
| Worked example | ~3 min | Annotated transcript of the same scenario done right |
| Completion problem | ~2 min | Fill in the missing move |
| Solo problem | ~3 min | Mini-OS live; new buyer, same task class |
| Reflection + spaced-retrieval hook | ~1 min | "What's the move you're most likely to forget?" (L1 tier-3 prompt) |

**Net: ≤ 10 min, germane-load-dense, extraneous-load-minimised.** Worked-example slice is the heaviest germane-load chunk; completion problem is the schema-test; solo problem is the schema-application.

For Modules 5 (Product Prop Mapping) and 6 (Regulatory Deflection), the worked example becomes a *job-aid-in-use* example — rep practises *referencing* the job aid mid-call, not memorising it.

## 8 · Element-interactivity reduction strategy per task class

| Class | Elements at peak | Reduction strategy |
|---|---|---|
| 1 Warm inbound | E1 + E2 + E5 (3) | Below threshold — no reduction needed |
| 2 Cold receptive | E1 + E2 + E3 + E4 + E5 (5) | Pre-train E3 (LinkedIn scan) as separate drill (D1) |
| 3 Cold hostile | E1 + E2 + E3 + E4 + E5 + E6 (6) | Add objection-inventory job aid; drill D2 |
| 4 Competitive displacement | E1–E6 + E9 (7) | Add competitive-frame card; drill D5 |
| 5 Multi-stakeholder | E1–E6 + E10 (7) | Pre-train both diagnostics; expertise prerequisite — gate behind passing Class 3 |
| 6 Regulatory deflection | E1–E6 + E7 (7) | Off-load to job aid (§19 table on desktop) — never in-head |

## 9 · What this analysis sends to Phase 2

| Sends | To |
|---|---|
| Three-job-aid spec (regulatory · objection · ICP card) | `02-design/job-aids/` |
| Worked-example → completion → solo slot structure for every module | `02-design/module-storyboards/` template |
| The "no leaderboard" constraint (extraneous emotional load) | `04-implement/launch-comms.md` |
| Class 5 multi-stakeholder requires Class 3 completion (prerequisite gate) | `02-design/curriculum-blueprint.md` sequencing |
| Per-persona load budget (M.G. needs less worked example; P.B. needs more) | Adaptive sequencing in Phase 6 iteration |

## References

- Brief §§5, 7, 8, 10.1, 10.3, 10.4, 10.5, 10.6, 12, 14, 18.2, 19.
- Sweller, J. (1988). "Cognitive load during problem solving." *Cognitive Science*, 12(2), 257–285.
- Sweller, J., Ayres, P., & Kalyuga, S. (2011). *Cognitive load theory.* Springer.
- Kalyuga, S. (2007). "Expertise reversal effect and its implications for learner-tailored instruction." *Educational Psychology Review*, 19(4), 509–539.
- Cowan, N. (2001). "The magical number 4 in short-term memory." *Behavioral and Brain Sciences*, 24(1), 87–114.
- Renkl, A., & Atkinson, R. K. (2003). *Educational Psychologist*, 38(1), 15–22.
- Rossett, A., & Schafer, L. (2007). *Job aids and performance support.*
- Decisions `D-002`, `D-004`, `D-006`, `D-007`.
