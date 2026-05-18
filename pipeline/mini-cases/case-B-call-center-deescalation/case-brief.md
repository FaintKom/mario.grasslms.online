# Case B · Call-Centre De-escalation · "First-30-Seconds"

> **One-page engagement brief.** Anonymised composite client. Built as portfolio bookend to the FinTechCard flagship case.
> **Also see:** [`storyboard.html`](storyboard.html) — visual middle-layer between this brief and the SCORM: branching tree (SVG) + 6 wireframes + script-overlay table.

---

## Context

**Client (anonymised):** Arc Telecom · pan-EU consumer ISP + mobile · 1.8M subscribers · ~800 tier-1 customer-service agents (UK / IE / NL / PL / RO)
**Trigger:** NPS dropped from 42 to 28 over two quarters following a back-end migration that produced a wave of intermittent outages. CSAT after escalated calls sits at **2.4 / 5**. Tier-2 escalation rate climbed from 9 % to 17 %. Average Handle Time on escalated calls is up 22 %. Repeat-call rate within 24 hours: **31 %**.
**Existing state:** 16-hour soft-skills onboarding (live, classroom), then floor-deployment. No structured de-escalation rehearsal - scripts exist on the agent intranet but are rarely opened during a hot call.

## Audience

Tier-1 customer-service agents, months 0 - 3 of tenure (cohort cadence: ~25 agents per week across hubs). Secondary audience: month-3-to-12 agents flagged for recovery on quality scorecards. Languages v1: EN; PL + NL in v2.

## Business problem

Operations leadership has direct evidence (Verint speech analytics) that **most escalations are decided in the first 30 seconds** of the call. Agents who acknowledge the customer's situation before troubleshooting de-escalate; agents who jump straight to "let's run through some steps" don't. Existing training does not rehearse the 30-second window; it covers the technical scripts.

## Goal (action-mapped)

When an angry customer is on the line, the agent **acknowledges the impact before troubleshooting** - and **chooses one open question to surface what the customer actually needs** before offering a fix.

## KPIs

| Level | Metric | Baseline | 90-day target | Source |
|---|---|---|---|---|
| L4 | CSAT after escalated calls | 2.4 / 5 | >= 3.8 / 5 | Post-call IVR survey |
| L4 | Repeat-call rate (same issue, <= 24 h) | 31 % | <= 18 % | Genesys CTI |
| L3 | Tier-2 escalation rate | 17 % | <= 11 % | QA dashboard |
| L3 | Verint "empathy phrase detected in first 30 s" tag | 28 % of calls | >= 70 % | Verint speech analytics |
| L2 | SCORM module score, first attempt | n/a | >= 70 % | `cmi.core.score.raw` |
| L1 | "I have a move loaded for the next angry caller" | n/a | >= 4.0 / 5 | Post-module micro-pulse |

## Keystone moment (what the SCORM teaches)

**The first 30 seconds of an escalated call, modelled as a branching dialogue.**

The learner enters a simulated call with **Lisa Greene**, a small-business owner whose internet has been down for 4 hours during her busiest sales day. The simulator presents the call as a turn-by-turn transcript. At **4 branching points**, the learner picks one of 3 reply options. Each option is scored against the **LAER** framework:

- **L** - Listen (acknowledge silence + paraphrase, don't interrupt)
- **A** - Acknowledge (validate the impact on *the customer's terms*, not the call-centre's)
- **E** - Explore (open question to surface the real need before offering a fix)
- **R** - Respond (concrete commitment with a timestamp, not "we'll get back to you")

Each branching point also moves an **escalation meter** (0 - 5) that visibly changes Lisa's next line. Pick the LAER-aligned reply: she calms slightly. Pick the defensive / scripted / argumentative reply: she escalates audibly in the transcript (caps, italics, longer outbursts).

The branching tree:

1. **Opener - Listen** - Lisa vents for 18 seconds. Does the agent interrupt, pacify with platitude, or paraphrase back?
2. **Impact - Acknowledge** - She names the business cost. Does the agent skip to troubleshooting, deflect to policy, or acknowledge the actual harm?
3. **Diagnostic - Explore** - Does the agent run the standard signal-check script, ask a closed yes/no, or ask one open question about what she needs in the next hour?
4. **Commitment - Respond** - Does the agent commit to a specific time + channel, escalate prematurely, or offer a vague "we'll be in touch"?

## Why this moment

Verint analytics show the call's eventual outcome is **statistically predicted by the first 30 seconds**. Past that window, both parties have anchored on a frame (collaborative vs. adversarial) that's hard to flip mid-call.

Action Mapping (Moore): the business pays for the **non-escalation** of an already-hot call, not for recognising LAER as a model. Recognition is week-1 content; **applied selection under realistic pressure** is what's missing.

Cognitive Load Theory + Mayer multimedia: no narration - Lisa's lines appear on screen with timing indicators ("18 s of venting"). Each turn is a worked example for the first move, partial completion for the next, cold practice for the last. The escalation meter is the **immediate behavioural feedback signal** the absent floor-coach would normally provide.

## Assessment + SCORM scoring

- 4 branching points x 25 points = 100 points max.
- Each turn: 20 points for the **LAER-aligned choice** + 5 points for **selecting the LAER letter** the choice exemplifies (tests vocabulary alongside selection).
- Passing threshold: **70** (the agent must get at least 3 of 4 turns right, plus name the framework on at least 2).
- The **final escalation-meter value** is reported alongside score but is not part of pass/fail (it's a coaching signal for the agent's manager).
- `cmi.core.lesson_status` -> `passed` if score >= 70 else `failed`.
- `cmi.suspend_data` stores per-turn choices, framework selections, and escalation-meter trajectory.

## Constraints honoured

- **<= 10 min per attempt.** Average completion: 7 - 9 minutes.
- **No audio.** Lisa's tone communicated via on-screen formatting (caps for raised voice, italics for sarcasm, *(silence)* / *(she sighs)* stage directions, length of outburst proportional to escalation).
- **WCAG 2.1 AA.** Keyboard nav, ARIA live region announces Lisa's lines and meter changes, no colour-only signalling.
- **SCORM 1.2.** Compatible with Genesys-side CSOD / Sana / SCORM Cloud.

## Out of scope

- Technical product training (signal-check scripts, router resets) - covered separately by Network Ops L&D.
- Tier-2 / Tier-3 escalation training - different audience, separate engagement.
- Workforce-management redesign (queue routing, breaks) - operational, not training.
- Localisation to PL / NL - v2 post-pilot.

---

*Brief v1.0 · 18 May 2026 · all client names and figures anonymised composite.*
