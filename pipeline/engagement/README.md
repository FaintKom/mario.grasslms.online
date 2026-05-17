# FinTechCard · SMB SDR Onboarding · Case Study Build

**Client (anonymised):** FinTechCard Ltd. · Series-B EU corporate-card fintech
**Engagement:** Full instructional-design cycle · Discover → Iterate · 6 months
**Lead designer (role):** Mario Becerra · solo + 2 client SMEs + 1 LMS admin
**Budget:** €58 000 fixed-fee · phased 25/50/25
**Window:** 16 weeks from kickoff (March 2026) to first cohort live (1 July 2026)
**Headline target:** −25 % ramp compression (95 d → 71 d) + day-120 retention 83 % → 92 %

---

## 1 · What this repository is

A from-scratch, end-to-end case-study build that takes the engagement brief in [`case-study-tz.md`](case-study-tz.md) and turns it into a portfolio-ready instructional-design deliverable:

- **Six ADDIE-aligned phase folders** (Analyse → Design → Develop → Implement → Evaluate → Iterate).
- **Six fully interactive SCORM 1.2 modules** with a custom mini-OS workspace shell (simulates Outreach, Gong, Salesforce, LinkedIn / Companies House, Calendar, Phone-dialler, Slack) — see [`03-develop/`](03-develop/).
- **A manager-side reinforcement layer** (3-row call-review rubric + week-2 / week-6 calibration session plans).
- **Kirkpatrick L1–L4 measurement plumbing** wired to Salesforce + Gong + HRIS (no new tooling).
- **A decisions log** that documents *every* design choice — what was decided, which framework drove it, what evidence in the brief supported it.

The case study is built in public — every artefact carries a Why-this-decision header so a reviewer can audit the reasoning.

---

## 2 · LXD frameworks applied

| # | Framework | Where it shows up | Why this one |
|---|---|---|---|
| 1 | **ADDIE** (Branson 1975 / Molenda 2003) | Top-level phase structure | Sponsor's procurement template; phase-gates align to the 25/50/25 payment schedule |
| 2 | **4C/ID** (Van Merriënboer 1997 / 2018) | Whole-task curriculum in [`02-design/4cid-blueprint.md`](02-design/4cid-blueprint.md) | Three keystone moves (M1/M2/M3) are interdependent skills, not isolated knowledge → 4C/ID's whole-task + part-task split is the right backbone |
| 3 | **Kirkpatrick / Phillips L1–L4** | Measurement plan in [`05-evaluate/`](05-evaluate/) | Sponsor publicly committed to L4 numbers; cascade has to be auditable from L4 back to L1 |
| 4 | **ABCD learning outcomes** (Mager / Heinich) | All terminal + enabling outcomes in [`02-design/learning-outcomes-abcd-bloom.md`](02-design/learning-outcomes-abcd-bloom.md) | Forces Audience-Behaviour-Condition-Degree precision; degree column is what makes outcomes assessable |
| 5 | **Bloom's revised taxonomy** (Anderson & Krathwohl 2001) | Verb selection + cognitive-level laddering | Used to keep outcomes off the "Understand" plateau and on "Apply / Analyse" — the band where call performance actually changes |
| 6 | **Action Mapping** (Cathy Moore 2017) | Gap analysis in [`01-analyze/gap-analysis.md`](01-analyze/gap-analysis.md) | Separates *training problems* from *environment problems* (comp plan, lead quality, manager cadence) — the brief explicitly asks for this surfacing |
| 7 | **Backwards Design** (Wiggins & McTighe 2005) | Stage-1/2/3 mapping inside [`02-design/curriculum-blueprint.md`](02-design/curriculum-blueprint.md) | Pairs cleanly with ABCD — the Stage-2 "evidence of learning" column maps 1:1 to L2/L3 assessment items |
| 8 | **Cognitive Load Theory** (Sweller 1988 / 2011) | Worked-example sequencing in every SCORM in [`03-develop/`](03-develop/) | Cohort-tolerance constraint (≤10 min per module) is a hard germane-load budget; intrinsic and extraneous loads have to be managed deliberately |
| 9 | **Multimedia learning principles** (Mayer 2014) | UX/UI rules in [`02-design/ux-design-system.md`](02-design/ux-design-system.md) | No-audio constraint forces leaning hard on signalling, segmenting, and pre-training principles to compensate |
| 10 | **Worked-example → completion → problem-solving fading** (Renkl / Atkinson) | Practice sequence inside each module | Top-rep articulation gap (M.G. and L.D. can't teach by demonstration) means the system must do the fading, not a human mentor |
| 11 | **Spaced retrieval practice** (Roediger / Karpicke) | Day +7 mini-quiz · scheduled by Sana LMS | Sponsor's L2 metric explicitly wants +7-day retention, not first-attempt mastery |
| 12 | **LTEM** (Thalheimer 2018, 8-tier evaluation) | Used to *frame* L1 — we deliberately do **not** measure "satisfaction"; we measure tier-3 "decision-relevant feedback" instead | Sponsor verbatim: "another Articulate slide-deck no one finishes" — smile-sheet L1 is the failure mode we are avoiding |
| 13 | **Dirksen's behaviour-gap model** (2015) | Gap analysis structure: knowledge / skill / motivation / environment / communication | Mid-rep H.K. quote — "I know the three moves but I forget them under pressure" — is a *skill + environment* gap, not a knowledge gap |
| 14 | **Merrill's First Principles of Instruction** (2002) | Module template: activation → demonstration → application → integration | Used as the canonical sequence inside each of the six modules so they feel familiar across the cohort |
| 15 | **Gagné's Nine Events** (1965 / 1985) | Lesson-opener checklist | Tactical inside-the-module micro-structure: gain attention → state outcome → recall prior → present stimulus → guide → elicit → feedback → assess → enhance retention |
| 16 | **Universal Design for Learning** (CAST 2018) + **WCAG 2.1 AA** | Mini-OS accessibility audit in [`03-develop/scorm-shell/a11y-audit.md`](03-develop/scorm-shell/a11y-audit.md) | Contractual constraint in §7 of the brief |

The complete rationale, with citations and the specific brief evidence that triggered each choice, lives in [`00-project-management/frameworks-applied.md`](00-project-management/frameworks-applied.md).

---

## 3 · How to read this repository

```
F:\LXD task\
├── case-study-tz.md                       Engagement brief (input)
├── README.md                              This file
├── 00-project-management/
│   ├── master-plan.md                     Sprint cadence + phase-gates
│   ├── decisions-log.md                   Every decision + framework + evidence
│   ├── frameworks-applied.md              Full citation pack
│   └── critic-log.md                      Self-critique passes per phase
├── 01-analyze/                            ADDIE Phase 1 deliverables
├── 02-design/                             ADDIE Phase 2 deliverables
├── 03-develop/                            ADDIE Phase 3 — six SCORMs + shell
├── 04-implement/                          ADDIE Phase 4 — launch runbook
├── 05-evaluate/                           ADDIE Phase 5 — measurement
└── 06-iterate/                            ADDIE Phase 6 — post-launch iteration
```

Every folder has its own `README.md` summarising the phase's intent, gate criteria, evidence trail, and links to the next phase.

---

## 4 · Working method

The build runs as **agile sprints inside ADDIE phases**, not waterfall:

1. **Plan the phase** → write down what good looks like + the gate criteria.
2. **Draft the artefacts** → following the frameworks above.
3. **Self-critique pass** → independent critic agent reviews against the gate criteria. Up to 3 critic passes; iterate until the critic returns `PASS`.
4. **Phase-gate sign-off** → critic's PASS note + decisions-log entry.
5. **Open the next phase.**

The critic operates as a separate subagent with no access to the drafting context — it sees only the artefacts and the brief, and judges whether the deliverables stand on their own.

---

## 5 · Where to start

- **Reviewers / sponsors:** open [`00-project-management/master-plan.md`](00-project-management/master-plan.md) for the phase-gate timeline, then [`01-analyze/README.md`](01-analyze/README.md).
- **Hiring portfolio reviewers (start here):**
    1. [`06-iterate/case-study-summary.html`](06-iterate/case-study-summary.html) — one-page portfolio narrative (open standalone in a browser).
    2. [`06-iterate/exec-deck.md`](06-iterate/exec-deck.md) — the 10-slide CRO review deck (K.M. → CRO).
    3. [`03-develop/scorm-shell/index.html`](03-develop/scorm-shell/index.html) — live mini-OS desktop preview.
    4. [`03-develop/module-03-calendar-close/index.html`](03-develop/module-03-calendar-close/index.html) — recommended module to try; the habit-gate UX (calendar-open-before-dial) reads most clearly here.
- **Anyone debugging a decision:** start at [`00-project-management/decisions-log.md`](00-project-management/decisions-log.md) and trace from there.

---

*Repository built from scratch May–June 2026 against `case-study-tz.md v1.0` (Mario Becerra, 17 May 2026).*
