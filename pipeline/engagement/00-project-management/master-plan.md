# Master plan · Phase-gate timeline

> Phases align to the 25 / 50 / 25 payment schedule in the brief §3. Phase-gate criteria are public; the critic agent enforces them before sign-off.

---

## 0 · Cadence at a glance

| Phase | Weeks (calendar) | Sprint count (1-week sprints) | Payment trigger | Output | Critic gate |
|---|---|---|---|---|---|
| 1 · Analyse | W1–W3 | 3 | **25 %** at gate | Audit report, personas, journeys, task inventory, gap analysis, L4→L1 cascade | Critic checks: every deliverable backed by brief evidence + framework citation; no fabricated data |
| 2 · Design | W4–W6 | 3 | — | ABCD outcomes, 4C/ID blueprint, curriculum, 6 storyboards, assessment design, rubric, UX system | Critic checks: every outcome maps to an L2/L3/L4 measure; storyboards usable by another designer cold |
| 3 · Develop | W7–W12 | 6 | — | Mini-OS shell + 6 SCORM 1.2 modules + manager rubric tool + facilitator guide | Critic checks: every module runs in SCORM Cloud; WCAG 2.1 AA passes; ≤10 min cohort tolerance |
| 4 · Implement | W13–W15 | 3 | **50 %** at gate | Launch comms, LMS deployment runbook, cohort-1 checklist, manager calibration plan | Critic checks: runbook executable by LMS admin without designer present; comms plan dated |
| 5 · Evaluate | W14–W26 (overlaps 4) | rolling | — | L1 pulse, L2 quiz, L3 rubric scoring, L4 dashboard, monthly evaluation report | Critic checks: every Kirkpatrick level has a named data source + owner + cadence |
| 6 · Iterate | W17–W26 (overlaps 5) | rolling, 4-week cycles | **25 %** at gate | Phase-7 iteration plan, content-refresh sprints, exit pack for in-house ownership | Critic checks: hand-off doc covers SME continuity, dashboard maintenance, v2 ES/DE plan |

---

## 1 · Phase 1 · Analyse · W1–W3

### Intent
Convert the brief's named stakeholders, interview transcripts, and Gong findings into structured analysis artefacts that drive every downstream design decision.

### Sprint breakdown
- **Sprint 1.1** — Stakeholder & business analysis. Output: stakeholder-map.md (RACI), business-goal-analysis.md.
- **Sprint 1.2** — Learner analysis. Output: learner-personas.md (4 SDR + 2 manager), learner-journey-map.md.
- **Sprint 1.3** — Task & gap analysis. Output: task-inventory.md (4C/ID component skills), cognitive-load-analysis.md, gap-analysis.md (Cathy Moore action mapping + Dirksen behaviour-gap), kirkpatrick-l4-l1-cascade.md.

### Gate criteria
- [ ] Every persona contains 1 verbatim quote + tenure + Gong call ID(s) referenced.
- [ ] Task inventory follows 4C/ID four components (learning tasks · supportive info · procedural info · part-task practice).
- [ ] Gap analysis explicitly separates training-fixable from environment-fixable.
- [ ] L4→L1 cascade is reverse-engineered from K.M.'s public commitments, not invented.

### Critic agent prompt template
> "Read `case-study-tz.md` and the artefacts in `01-analyze/`. For each claim in those artefacts, can you cite the specific section/quote in the brief that supports it? Flag any claim that lacks evidence or that contradicts the brief. Score PASS / FAIL with reasoning."

---

## 2 · Phase 2 · Design · W4–W6

### Intent
Translate Phase 1 analysis into a teachable, assessable architecture. Lock the 4C/ID blueprint, learning outcomes, and module storyboards before any pixel is moved.

### Sprint breakdown
- **Sprint 2.1** — Outcomes & curriculum. Output: learning-outcomes-abcd-bloom.md, curriculum-blueprint.md (Backwards Design Stages 1–3), 4cid-blueprint.md.
- **Sprint 2.2** — Module storyboards. Output: 6 storyboard files in `02-design/module-storyboards/`, each following Merrill's First Principles + Gagné's Nine Events.
- **Sprint 2.3** — Assessment & UX system. Output: assessment-design.md (L1/L2/L3/L4 instruments), rubric-design.md (3-row manager call-review), ux-design-system.md (mini-OS visual lang), ui-prototypes/.

### Gate criteria
- [ ] Every terminal outcome written ABCD-complete (audience, behaviour, condition, degree).
- [ ] Every outcome tagged with a Bloom revised verb at Apply or above (no Remember/Understand-only outcomes).
- [ ] Every outcome lineage maps to ≥1 of M1/M2/M3 keystone moves OR to the regulatory deflection table.
- [ ] Storyboard contains: trigger scenario · worked example · completion problem · solo problem · debrief · spaced-retrieval hook.
- [ ] UX system documents WCAG 2.1 AA conformance approach + Mayer-principle citations for each design choice.

---

## 3 · Phase 3 · Develop · W7–W12

### Intent
Build the six SCORM modules and the shared mini-OS shell that simulates the rep's actual workspace.

### Sprint breakdown
- **Sprint 3.1** — Mini-OS shell + SCORM API wrapper. Apps: window manager, taskbar, app launcher.
- **Sprint 3.2** — Simulated apps v1: Outreach, Salesforce, Phone-dialler.
- **Sprint 3.3** — Simulated apps v2: Gong, LinkedIn / Companies House, Calendar, Slack.
- **Sprint 3.4** — Module 1 (Diagnostic Opener / M1) + Module 2 (Objection Acknowledge / M2).
- **Sprint 3.5** — Module 3 (Calendar Close / M3) + Module 4 (ICP Buyer Fit).
- **Sprint 3.6** — Module 5 (Product Prop Mapping) + Module 6 (Regulatory Deflection) + manager rubric tool + facilitator guide.

### Gate criteria
- [ ] All 6 SCORMs load + report completion + score to SCORM Cloud preview.
- [ ] Each module finishable in ≤10 min by a representative learner (timed dry run).
- [ ] Each module's mini-OS workspace reflects the *actual* keystone-move work-context (e.g. Module 1 = LinkedIn lookup → Outreach call → Salesforce next-step).
- [ ] WCAG 2.1 AA spot-check passes (keyboard nav, contrast ≥4.5:1, alt text, focus visible).
- [ ] No PII; ICP personas anonymised per brief §7.

---

## 4 · Phase 4 · Implement · W13–W15

### Intent
Hand the program to the LMS admin and the manager population without designer dependency.

### Sprint breakdown
- **Sprint 4.1** — Launch comms (sponsor email, manager pre-read, cohort-1 welcome).
- **Sprint 4.2** — LMS deployment runbook (Sana SCORM 1.2 upload, cohort enrollment, single sign-on through Okta).
- **Sprint 4.3** — Manager calibration session plans (week-2 + week-6, 60 min each).

### Gate criteria
- [ ] LMS admin can execute the deployment runbook without designer assistance.
- [ ] Manager calibration plan tested by walking through it with K.M. or A.S. proxy.
- [ ] Launch comms dated and tied to the 1 July cohort-1 live date.

---

## 5 · Phase 5 · Evaluate · W14–W26 (rolling)

### Intent
Wire Kirkpatrick L1–L4 to the existing tool stack (Salesforce + Gong + HRIS + Sana). No new tooling per brief §7.

### Sprint breakdown
- **Sprint 5.1** — L1 + L2 instruments live before cohort 1 (week 14).
- **Sprint 5.2** — L3 rubric scoring goes live in Gong + Salesforce `Call_Review__c` (week 16).
- **Sprint 5.3** — L4 dashboard wired by J.V. (RevOps) signed off by week 20.
- **Sprint 5.4** — Monthly evaluation report cadence starts week 22.

### Gate criteria
- [ ] L1 instrument deliberately *not* a smile-sheet (Thalheimer LTEM tier-3 minimum).
- [ ] L2 first-attempt + +7-day retention quizzes scheduled in Sana.
- [ ] L3 rubric live in Gong scorecards; first calibration session run by week 16.
- [ ] L4 dashboard updates nightly; named owner = J.V.

---

## 6 · Phase 6 · Iterate · W17–W26 (rolling, 4-week cycles)

### Intent
Stand up the post-launch iteration loop so the program improves between cohort waves and survives K.M.'s eventual successor.

### Sprint breakdown
- **Sprint 6.1** — Content-refresh sprint plan (4-week cycles slotted between cohort starts).
- **Sprint 6.2** — Phase-7 iteration playbook (what to change at each L1/L2/L3/L4 signal).
- **Sprint 6.3** — Hand-off pack: SME continuity, dashboard maintenance, v2 (ES + DE) plan.

### Gate criteria
- [ ] Iteration playbook is decision-rule based (e.g. "if L3 M1 adherence < 70 % in cohort N, run Sprint 6.1.A").
- [ ] Hand-off pack runnable by an in-house designer with no prior context.
- [ ] v2 ES + DE plan documents translation pipeline + bilingual cheat-sheet (per M.K. ask, SME §10.7).

---

## 7 · Risk register (live)

Tracked separately in `00-project-management/risks.md` (created Phase 1 Sprint 1.1). Source: brief §20. Updated at each phase gate.

---

*Master plan v1.0 · supersedes the rough ordering in §3 of the brief.*
