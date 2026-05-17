> Why this artefact: Brief §20 risk row "Sponsor turnover (K.M. has been in role 11 months)" is the existential risk to the program; mitigation is "every phase summary documents decisions in writing; successor inherits signed paper trail". This pack is that paper trail — runnable cold by an in-house designer with no prior context, and surveying every dependency that needs an owner when designer engagement ends. Frameworks: ADDIE Phase 6 close-out + Action Mapping ownership clarity (Moore 2017) + Phillips Phase-7 sustainment.

---

# Hand-off pack · for K.M.'s in-house team (and successor)

This file is the single entry point for anyone inheriting the program. Read in order; every section ends with what to do next.

---

## 1 · What you inherit

| Artefact | File path | What it is |
|---|---|---|
| Engagement brief (source of truth) | `F:\LXD task\case-study-tz.md` | The original input pack. Treat as the master record for stakeholders, success measures, scope, constraints. |
| Master plan | `F:\LXD task\00-project-management\master-plan.md` | Phase-gate timeline + critic-agent gate criteria |
| Decisions log | `F:\LXD task\00-project-management\decisions-log.md` | Every non-trivial decision + framework + brief evidence. Append-only. |
| Frameworks pack | `F:\LXD task\00-project-management\frameworks-applied.md` | Full citation list for every ID framework used |
| Stakeholder + business + learner analyses | `F:\LXD task\01-analyze\` | Phase 1 artefacts (audit, personas, journeys, task inventory, gap analysis, L4→L1 cascade) |
| Curriculum architecture | `F:\LXD task\02-design\4cid-blueprint.md` · `learning-outcomes-abcd-bloom.md` · `curriculum-blueprint.md` | The 4C/ID task-class progression + ABCD outcomes |
| Module storyboards (6) | `F:\LXD task\02-design\module-storyboards\module-1.md` … `module-6.md` | One per module, Merrill + Gagné structured |
| Mini-OS shell + 6 SCORMs | `F:\LXD task\03-develop\scorm-shell\` + `F:\LXD task\03-develop\module-1\` … `module-6\` | The actual learner-facing build (see §2) |
| Manager rubric | `F:\LXD task\02-design\rubric-design.md` + `F:\LXD task\03-develop\rubric-tool\` | 3-row × 5-anchor call-review rubric (single A4) |
| Launch comms + LMS runbook | `F:\LXD task\04-implement\` | Phase 4: launch sequence, Sana deployment, manager calibration plans |
| Kirkpatrick measurement plan | `F:\LXD task\05-evaluate\kirkpatrick-measurement-plan.md` | L1–L4 wiring: instruments, sources, owners, cadence |
| Iteration playbook | `F:\LXD task\06-iterate\iteration-playbook.md` | IF-THEN rules for post-launch sprints |
| Content-refresh template | `F:\LXD task\06-iterate\content-refresh-sprint-template.md` | 4-week sprint template for between-cohort changes |
| Exec deck | `F:\LXD task\06-iterate\exec-deck.md` | 10-slide CRO review markdown |

**What you do not inherit:** any artefact that depends on the original designer's tooling licences (Articulate 360 personal seat, Gong viewer licence). Those revert to client ownership at engagement close — already in client tenant.

---

## 2 · How the mini-OS shell works

> Forward reference: the shell itself lives in `F:\LXD task\03-develop\scorm-shell\` (built in Phase 3 of the engagement).

The mini-OS is a custom HTML/JS/CSS workspace that simulates the SDR's actual desktop: Outreach, Gong, Salesforce, LinkedIn / Companies House, Calendar, Phone-dialler, Slack. All six modules run inside it. The decision to build custom (not Articulate) is **D-005** in the decisions log.

**Top-level shape:**

```
03-develop/scorm-shell/
├── index.html                  Shell entry point
├── scorm-api-wrapper.js        SCORM 1.2 LMS communication layer (cmi.core.score.raw, cmi.core.lesson_status)
├── window-manager.js           Draggable window logic, z-index, focus
├── taskbar.js                  Bottom dock, app launcher
├── apps/
│   ├── outreach/               Mock Outreach sequence + dial pad
│   ├── salesforce/             Mock SF record, next-step booking widget
│   ├── gong/                   Mock call transcript viewer with M1/M2/M3 tags
│   ├── linkedin/               Mock prospect profile + Companies House view
│   ├── calendar/               Mock calendar with slot-picker
│   ├── phone-dialer/           Audio-free dial-tone simulation
│   └── slack/                  Mock #sdr-onboarding-design channel
├── a11y-audit.md               WCAG 2.1 AA conformance evidence
└── README.md                   How to add a new app, how to package as SCORM
```

**Key contracts:**

- Each app is a self-contained folder with `app.html` + `app.css` + `app.js` + a `manifest.json` declaring its window size, icon, and required SCORM API hooks.
- The window manager loads apps on demand (not on page load) → modules stay under the 10-min cohort tolerance.
- The SCORM API wrapper is the **only** file allowed to touch `cmi.*` properties. Modules talk to a thin `progress.js` interface that proxies to the wrapper.

**Versioning:** the shell follows semver. Bumping a major version requires a sponsor sign-off (per `iteration-playbook.md` rule O-B convention).

---

## 3 · How to add a new module

The 4C/ID task-class progression supports up to ~12 modules before the architecture needs revisiting. Steps to add the 7th:

1. **Confirm the task class.** Re-read `02-design/4cid-blueprint.md`. The new module must be a *task class* of increasing complexity, not a topic-add (per D-002).
2. **Draft the ABCD outcome.** Add to `02-design/learning-outcomes-abcd-bloom.md`. Apply or Analyse level (no Remember/Understand-only).
3. **Use the storyboard template.** Copy `02-design/module-storyboards/_template.md`. Fill in: trigger scenario · worked example · completion problem · solo problem · debrief · spaced-retrieval hook. Confirm Merrill + Gagné spine intact.
4. **Build in the shell.** Add module folder under `03-develop/module-7/`. Reuse existing apps from `scorm-shell/apps/`. Build any new app per the shell's README contract.
5. **Update the assessment plan.** Add items to L2 quiz bank (`05-evaluate/l2-quiz-blueprint.md`); add an L1 pulse item if the module needs its own application-intent read.
6. **Phase-gate the module.** Run the 4-week content-refresh sprint as if it were a refresh (one designer + critic + sponsor sign-off). Do not skip the critic step.
7. **Log the decision.** Append D-009+ to `decisions-log.md` with the trigger, framework, evidence, alternatives rejected.

---

## 4 · SME continuity plan (quarterly)

ICP / competitive / regulatory content drifts. Refresh by interviewing 4 SMEs per quarter:

| Quarter | SME to interview | Why | Output |
|---|---|---|---|
| Q1 | M.G. (UK top-decile, Manchester) | Refresh M1 worked example with current LinkedIn / Companies House intelligence patterns | Updated GC-01 / GC-02 substitution in Module 1 |
| Q2 | L.D. (DE top-decile, Berlin) | Refresh M2 worked example on Brex / competitive displacement | Updated competitive scenario in Module 4 |
| Q3 | M.K. (DE Pod 1 manager) | Refresh rubric anchor descriptors against latest call patterns; revisit the bilingual cheat-sheet ask | Rubric anchors v.N+1; cheat-sheet status update |
| Q4 | A.S. (Head of SDR) + 1 ICP buyer (Maria archetype proxy) | Refresh ICP archetypes against real customer wins from prior 12 months | Updated `01-analyze/learner-personas.md` + ICP buyer specs |

**Cadence rule:** 30 min per SME interview, max. Output is appended to the relevant artefact + a Slack post in `#sdr-onboarding-design`. Decisions log entry only if the SME pull triggers a content-refresh sprint.

**Compliance carve-out:** regulatory content (KYC, AML, SCA, PSD2, GDPR — brief §19) is **not** refreshed via this SME process. It is refreshed when the compliance team updates the Cornerstone modules — coordinate with their owner. Per brief §6, scope discipline.

---

## 5 · Dashboard maintenance

| Data source | Field(s) | Owner | Cadence | Drift check |
|---|---|---|---|---|
| Salesforce | `Ramp_Time__c`, `Tenure_Cohort__c`, `Pod__c`, `First_Paid_Quota_Date__c`, `Next_Step_Booked__c` | J.V. (RevOps Director) | Nightly automated | Quarterly: confirm `Ramp_Time__c` calculation logic matches the original definition (days from hire date to first paid quota). |
| HRIS (BambooHR-equivalent) | `Day_120_Retained` | D.R. (Head of People) | Nightly automated | Quarterly: confirm `Day_120_Retained` is computed from hire date + 120 calendar days (not working days). |
| Gong | `tag:diagnostic-opener`, `tag:objection-acknowledged`, `tag:calendar-booked` + custom rubric scorecards | A.S. (Head of SDR) | Real-time tag, weekly rubric | **Drift-recalibration cadence: every 6 months.** Gong's NLP tag definitions drift as Gong updates its models. Pull a 50-call sample, hand-score against the rubric, compare to Gong's auto-tags. If accuracy < 85 %, request a tag-definition recalibration with Gong support. |
| Sana LMS | `cmi.core.score.raw`, +7 d quiz scores, L1 pulse responses | LMS admin | Per cohort | Per cohort: confirm SCORM packages report correctly to Sana's reporting API. |
| Outreach | `Sequence_Completion_Rate` | J.V. (RevOps Director) | Weekly | Used as SPIF-distortion proxy per brief §15.4 — surface to K.M. monthly. |

**Single point of failure to watch:** J.V. owns three of the five sources. If J.V. moves on, the dashboard health depends on her successor inheriting the field definitions in `05-evaluate/dashboard-schema.md`. Add to the standing risk register.

---

## 6 · v2 plan · ES + DE rollout

Two distinct asks shape v2:

**Ask 1 — ES rubric translation (brief §9 A.S., I.C. ES Pod waiting).**

- I.C. (Barcelona ES Pod manager) has been running call reviews in Spanish on an untranslated rubric since cohort 1. This is the highest-priority v2 item.
- Translation pipeline: native ES speaker (sourced from the Barcelona office, ideally a senior SDR) translates anchor descriptors → I.C. validates → back-translation review by a third-party native EN speaker for semantic equivalence → A.S. signs off.
- Timeline: 3 weeks from kick-off to deployed rubric in I.C.'s Gong scorecard.

**Ask 2 — Bilingual cheat sheet (brief §10.7 M.K.).**

- M.K. (DE Pod 1 manager) flagged the language-switching scenario mid-call as a blocker for DE reps. A bilingual EN/DE cheat sheet for each keystone move + each common objection.
- Format: 1-page job aid (per `frameworks-applied.md` #20, Rossett & Schafer). DE text in left column, EN equivalent in right column. Phosphor iconography.
- Timeline: 2 weeks to draft + validate with M.K. and one mid-DE-rep (N.W. or equivalent).

**Module translation (six modules, EN → ES + DE):**

| Step | Owner | Time |
|---|---|---|
| Storyboard text export from `02-design/module-storyboards/` | In-house designer | 1 day |
| Translation by native speakers (one per language) | External or internal native-speaker resource | 2 weeks |
| In-context review (translator reads the rendered SCORM) | Translator + in-house designer | 3 days |
| Sponsor sign-off (K.M. or successor) | K.M. | 1 day |
| SCORM repackage per language (locale flag in `imsmanifest.xml`) | In-house designer | 2 days |
| Sana enrollment routing by pod language | LMS admin | 1 day |

**Total v2 timeline:** 6 weeks per language from sign-off. Budget for v2: out of scope of original €58 K engagement; new budget cycle required.

**Brand voice carve-out:** the internal brand voice (peer-to-peer, anti-jargon, show-then-name per brief §18.2) is preserved in translation. Do not let the translator drift into L&D-speak; the back-translation review is the check.

---

## 7 · Known limitations · what we deliberately scoped out · the v3 ask

### Limitations we knew about going in

- **No audio narration in v1** (brief §7, D-006). All instruction is text + transcript-based. Accessibility-wise we comply with WCAG 2.1 AA without audio, but v2 or v3 should revisit if budget allows for human-voice production.
- **L4 attribution is associative, not causal** (D-008). The 25 % ramp compression target shares causality with lead quality (R.K. / CMO) and comp plan (J.V. / RevOps). The dashboard surfaces all three lines; the CRO conversation per brief §8 is honest about this.
- **EN-only v1.** ES + DE deferred to v2 (brief §3, §9). I.C. ES Pod manager has been waiting for the rubric translation since cohort 1.
- **No mid-market / enterprise SDR.** Brief §6 out-of-scope item; separate engagement in Q4 2026.

### v3 ask (push for next budget cycle)

1. **Audio narration layer** — adds a Mayer-modality channel and unlocks reps who learn aurally. Budget estimate: €15K for human voice across 6 modules (English) + €10K per additional language.
2. **xAPI-full LRS integration** — Sana supports xAPI statements but not full LRS query (brief §16). Hooking into an external LRS (e.g. Veracity, Watershed) would enable behaviour-pattern analytics that the current L3 layer can only approximate.
3. **Manager-coaching module** — explicitly out of scope in v1 (brief §6) because the brief said "don't try to retrain managers" (K.M. §8). After 12 months of rubric data, the case for a structured manager-coaching layer will likely be made by the variance data itself. Push for it in v3.
4. **Comp-plan feedback loop integration** — comp-plan redesign is RevOps-owned (J.V., brief §17), but the training program could surface specific SPIF-chasing patterns from Outreach sequence data → feed J.V.'s redesign. Coordinate at v3 scoping.
5. **Mid-market SDR program** — separate engagement in brief §6, but the mini-OS shell + 4C/ID architecture are reusable. The biggest reuse leverage in the budget.

---

## 8 · The one-page survival map

If the in-house designer reads only this section, they have what they need to keep the program running for 6 months:

1. **Read** `iteration-playbook.md`. Memorise the IF-THEN rules.
2. **Check the dashboard weekly.** L1 + L2 per module · L3 pod adherence + rubric variance · L4 trailing-4 ramp + retention.
3. **When a rule fires:** open `content-refresh-sprint-template.md` and run the 4-week sequence. Log decisions in `decisions-log.md`.
4. **Every quarter:** run the SME interview cadence (§4 above).
5. **Every 6 months:** Gong tag drift recalibration (§5 above).
6. **If K.M. leaves:** stop. Walk the successor through this file. Resume only after they co-sign the next decisions-log entry.

---

## References

- Brief §6 (scope) · §16 (tooling) · §18 (brand voice) · §19 (regulatory) · §20 (risks) · §21 (done-state) · §9, §10.7 (v2 asks).
- `frameworks-applied.md` #1, #2, #6, #20 (ADDIE, 4C/ID, Action Mapping, job-aid theory).
- `decisions-log.md` D-002 (4C/ID), D-005 (custom SCORM), D-006 (no audio), D-007 (mini-OS), D-008 (L4 attribution).
- `master-plan.md` §6 (Phase-6 gate — runnable by in-house designer with no prior context).
- `iteration-playbook.md` rules O-A, O-B (operational triggers).
