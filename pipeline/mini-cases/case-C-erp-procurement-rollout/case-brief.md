# Case C · ERP Procurement Rollout · "Route-the-PO"

> **One-page engagement brief.** Anonymised composite client. Built as portfolio bookend to the FinTechCard flagship case.

---

## Context

**Client (anonymised):** MeritoTech Manufacturing · industrial-components SMB · 150 FTE · 3 production sites (DE / PL / CZ)
**Trigger:** ERP migration of the Procure-to-Pay (P2P) module from an Excel-and-email workflow to a SAP-S/4HANA-equivalent platform. Go-live: 6 weeks. Pre-migration audit found mean time-to-PO-approval at **6.2 days** (target post-migration: **1.5 days**) and a **first-time-routing-correct rate of 54 %**. The remaining 46 % go round the wrong approval chain and bounce back - some twice.
**Existing state:** No formal P2P training. Buyers learned the Excel template from each other; routing rules live in a 2018 SharePoint doc nobody reads. Three production sites, three slightly different practices.

## Audience

Two cohorts, deliberately interleaved on the same SCORM:
- **~25 buyers** (procurement specialists who raise the PO).
- **~40 approving managers** across three tiers (department head, finance director, CFO / CEO depending on amount + category).

Languages v1: EN. DE + PL in v2.

## Business problem

Vendors of ERP rollout training default to teaching the **UI** ("click here, then here"). That training has a half-life of about four months - the next UI release breaks it. What survives a UI release is **the routing rules**, which are policy, not interface. Mis-routing accounts for 100 % of the 6.2-day approval delay. Teach the rules and the UI follows.

## Goal (action-mapped)

When a buyer raises a PO, they pick the **correct approval route on the first try** - without consulting the SharePoint doc or asking Finance - for any combination of (amount x category x cost-centre x capex-flag).

## KPIs

| Level | Metric | Baseline | 90-day target | Source |
|---|---|---|---|---|
| L4 | Mean time-to-PO approval | 6.2 days | <= 1.5 days | ERP audit log |
| L4 | PO cycle-time variance (std dev) | 4.1 days | <= 1.0 day | ERP audit log |
| L3 | % POs with correct approval route, first attempt | 54 % | >= 92 % | ERP routing log |
| L3 | % POs returned for re-routing within 48 h | 23 % | <= 4 % | ERP rework counter |
| L2 | SCORM module score, first attempt | n/a | >= 80 % | `cmi.core.score.raw` |
| L1 | "I feel confident I won't have to ask Finance how to route" | n/a | >= 4.2 / 5 | Post-module micro-pulse |

## Keystone moment (what the SCORM teaches)

**Three POs of nested complexity - the learner picks the correct approval route for each.**

The simulator presents a PO-creation form with realistic fields:
- Vendor + line-item descriptions
- Amount (multi-currency, auto-converted to EUR)
- GL account + cost-centre
- Capex flag (Y / N)
- Category (Direct materials / Indirect / IT / Capex / Marketing)

After the learner reviews the PO, they are shown a **routing diagram** with 6 possible approval nodes:

1. **Cost-centre owner** (always required)
2. **Department head** (always required)
3. **Finance director** (required if amount >= EUR 10 000)
4. **CTO** (required if Category = IT or IT-Services)
5. **CFO** (required if amount >= EUR 50 000 OR if Capex = Y)
6. **CEO** (required if amount >= EUR 100 000 OR if cross-site)

The learner picks the routing **as a set** (one click per required node) and submits. If wrong, the system reveals the **rule that was violated** with the routing path the PO would have actually taken in the ERP - and how many days that misroute would have added.

Three POs of escalating complexity:

| # | PO scenario | Difficulty | Tests rule(s) |
|---|---|---|---|
| 1 | Office paper, EUR 480, Indirect, Cost-centre Berlin-Admin | Easy (worked example with reveal) | Baseline (just cost-centre + dept head) |
| 2 | New laptop fleet for engineering, EUR 38 400, IT category, capex flag Y | Medium | IT category triggers CTO; capex flag triggers CFO; amount alone would not trigger CFO |
| 3 | Plant-floor PLC upgrade, EUR 124 000, Direct materials, capex Y, served across Berlin + Krakow sites | Hard (cold practice) | Amount > 100K + capex + cross-site = all five tiers required, including CEO |

## Why this moment

Action Mapping (Moore): the business pays for the **non-misroute** of every PO going forward. The keystone observable behaviour is routing correctly on the first try. A 92 % first-attempt accuracy on first 90 days is the success criterion - the rest of the UI is learnable in passing.

Cognitive Load Theory (Sweller): the form has high intrinsic load (many fields). Extraneous load is stripped (no decorative chrome). Germane load is the **rule formation** - which field values trigger which approval node. Worked example for PO #1, partial completion for #2, cold practice for #3 is the textbook Renkl / Atkinson fading sequence.

Why teaching rules (not clicks) is the right move: the UI of an ERP changes on average **every 9 - 12 months**. Policy does not. A learner who internalises the rule survives the next release; a learner who memorised the buttons does not.

## Assessment + SCORM scoring

- 3 POs x variable points (PO #1: 20 pts, #2: 35 pts, #3: 45 pts; total = 100).
- Per PO: **full points** if every required node selected AND no extra nodes added; **half points** if all required nodes selected but extras added; **zero** if any required node missed.
- **Reasoning question** after each PO: "Which rule did you apply?" (multiple-choice, 5 pts of the PO's total).
- Passing threshold: **80** (textbook accuracy is a higher bar for procedural work than for soft skills - mis-routing costs money).
- `cmi.core.lesson_status` -> `passed` if score >= 80 else `failed`.
- `cmi.suspend_data` stores per-PO routing decisions + rule selection + delta-days impact if mis-routed.

## Constraints honoured

- **<= 10 min per attempt.** Average completion: 8 - 10 minutes.
- **No audio.**
- **WCAG 2.1 AA.** Form fields properly labelled, routing diagram is keyboard-traversable, ARIA live region announces approval-route changes and feedback.
- **SCORM 1.2.** Compatible with Sana / SuccessFactors / SCORM Cloud / Moodle.

## Out of scope

- ERP technical configuration (master data, workflow customisation) - owned by ERP-implementation team.
- Vendor-management training (negotiation, supplier-onboarding) - separate curriculum.
- AP / invoice-matching training - month-2 of the post-go-live curriculum.
- Localisation to DE / PL - v2 post-pilot.

---

*Brief v1.0 · 18 May 2026 · all client names and figures anonymised composite.*
