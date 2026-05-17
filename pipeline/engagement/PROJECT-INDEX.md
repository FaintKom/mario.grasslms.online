# Project index · flat alphabetical map

> Every file in the repository. Sorted by phase folder, alphabetical within each section. One-line summary per file. Generated 17 May 2026 against the post-Phase-6 build.

**Totals:** 118 files · ~19 000 lines across the whole repo.

---

## Root

| File | Purpose |
|---|---|
| `BUILD-MANIFEST.md` | One-page artefact manifest: phase counts, line counts, critic verdicts, open items. |
| `case-study-tz.md` | Engagement brief (input) · client snapshot, named stakeholders, 10 SME interviews, 22 Gong findings, ICP buyers, product facts, dashboard schema, brand voice. |
| `PROJECT-INDEX.md` | This file. |
| `README.md` | Project master overview · who, what, when, frameworks, how to read. |

## 00-project-management/

| File | Purpose |
|---|---|
| `critic-log.md` | Append-only record of every critic-agent pass per phase with verdicts and fixes. |
| `decisions-log.md` | D-001 to D-009 · every non-trivial design decision with framework lens + brief evidence. |
| `frameworks-applied.md` | 20 frameworks applied + 8 explicitly rejected · full citation pack. |
| `master-plan.md` | Phase-gate timeline · sprint cadence · phase criteria · payment-trigger map. |

## 01-analyze/ · ADDIE Phase 1

| File | Purpose |
|---|---|
| `business-goal-analysis.md` | K.M. verbatim quotes, two KPIs, ramp-time + retention numbers, keystone-move identification. |
| `cognitive-load-analysis.md` | Sweller intrinsic + extraneous + germane breakdown per task class; element-interactivity per persona. |
| `gap-analysis.md` | Moore action-mapping training-fixable vs environment-fixable split; Dirksen 5-dim per gap. |
| `kirkpatrick-l4-l1-cascade.md` | Reverse-engineered cascade from K.M.'s public L4 commitments down to L1 instrument. |
| `learner-journey-map.md` | 0-60 day emotional/cognitive journey · stage quotes from §10 SME interviews. |
| `learner-personas.md` | 6 personas (3 top/mid/bottom SDRs + 2 managers + 1 LMS admin) with Gong call IDs. |
| `README.md` | Phase 1 intent, deliverables, gate criteria. |
| `stakeholder-map.md` | Mendelow power-interest grid · K.M., A.S., D.R., J.V., R.K., LMS admin. |
| `task-inventory.md` | 4C/ID six task classes of increasing complexity + D1-D6 part-task drills. |

## 02-design/ · ADDIE Phase 2

| File | Purpose |
|---|---|
| `4cid-blueprint.md` | Whole-task curriculum architecture · 4 components · variability axes · configural-mastery map. |
| `assessment-design.md` | L2 quiz, L3 rubric, L4 instrument design with criterion-referenced anchors. |
| `curriculum-blueprint.md` | Backwards Design stage 1/2/3 + Merrill + Gagne internal sequence per module. |
| `learning-outcomes-abcd-bloom.md` | T1-T7 terminal + enabling outcomes · ABCD-complete · Bloom Apply+. |
| `README.md` | Phase 2 intent, deliverables, gate criteria. |
| `rubric-design.md` | 3-row × 5-anchor manager call-review rubric · J.T. + M.K. co-designed. |
| `ux-design-system.md` | Brand palette (`#00b67a`), Mayer-principle-per-design-rule table, WCAG audit approach, no-audio compensation. |
| `module-storyboards/_template.md` | Canonical storyboard template (trigger → worked example → completion → solo → debrief → spaced-retrieval). |
| `module-storyboards/M1-diagnostic-opener.md` | Module 1 storyboard · M1 keystone · Maria archetype. |
| `module-storyboards/M2-objection-acknowledge.md` | Module 2 storyboard · M2 keystone · multiple buyer archetypes. |
| `module-storyboards/M3-calendar-close.md` | Module 3 storyboard · M3 keystone · habit-gate calendar-pre-dial. |
| `module-storyboards/M4-icp-buyer-fit.md` | Module 4 storyboard · 4 archetypes interleaved · configural M1+M2+M3. |
| `module-storyboards/M5-product-prop-mapping.md` | Module 5 storyboard · multi-stakeholder · 4 props × 4 archetypes. |
| `module-storyboards/M6-regulatory-deflection.md` | Module 6 storyboard · §19 deflection table + escalate decision. |
| `ui-prototypes/README.md` | Mini-OS visual prototype notes + window-manager interaction patterns. |

## 03-develop/ · ADDIE Phase 3 · SCORM build (71 files)

### scorm-shell/ · shared mini-OS framework

| File | Purpose |
|---|---|
| `a11y-audit.md` | WCAG 2.1 AA audit · all criteria PASS · keyboard map, contrast log, reduced-motion. |
| `event-log-spec.md` | Event taxonomy catalogue used by all 6 modules · LO-ID index. |
| `index.html` | Mini-OS shell entry point (live preview · open standalone in a browser). |
| `README.md` | Shell architecture, packaging, SCORM Cloud preview procedure. |
| `data/sample-gong-transcripts.json` | Sample transcript dataset surfaced through the Gong simulated app. |
| `data/sample-profiles.json` | LinkedIn / Companies House profile dataset. |
| `js/coach-marks.js` | Contextual coach-mark overlay system (signalling, Mayer principle). |
| `js/event-log.js` | Local event-log persistence layer · feeds SCORM suspend_data. |
| `js/scorm-bridge.js` | SCORM 1.2 wrapper · cmi.core.lesson_status, score.raw, suspend_data. |
| `js/shell.js` | Window manager, taskbar, app launcher, `bootModule` API. |
| `js/apps/calendar.js` | Calendar app · 2-slot offer + invite-during-call habit gate. |
| `js/apps/gong.js` | Gong app · transcript viewer + tag highlights. |
| `js/apps/linkedin-ch.js` | LinkedIn / Companies House blended profile app. |
| `js/apps/outreach.js` | Outreach app · sequence + next-step booking. |
| `js/apps/phone-dialler.js` | Phone-dialler app · click-to-dial · no audio. |
| `js/apps/registry.js` | App registry + window-manager hooks. |
| `js/apps/salesforce.js` | Salesforce app · `Next_Step_Booked__c` + `Ramp_Time__c`. |
| `js/apps/slack.js` | Slack app · channels and threads · no leaderboard per D-007. |
| `styles/apps.css` | Per-app visual rules. |
| `styles/shell.css` | Shell layout, window chrome, brand tokens. |

### module-01-diagnostic-opener/ · M1

| File | Purpose |
|---|---|
| `design-log.md` | M1 build log, dry-run timing, decisions. |
| `imsmanifest.xml` | SCORM 1.2 manifest · resource enumeration. |
| `index.html` | SCORM entry point. |
| `module.js` | M1 module logic · diagnostic opener gate + 5-second silence. |
| `styles.css` | M1 visual rules. |
| `data/prospects.json` | Maria + sample prospects. |
| `data/quiz.json` | L2 quiz items mapped to LO-M1.1/2/3. |
| `data/transcripts.json` | Worked-example transcripts (GC-01, GC-02 derived). |

### module-02-objection-acknowledge/ · M2

| File | Purpose |
|---|---|
| `design-log.md` | M2 build log, post-cohort-3 refresh trigger. |
| `imsmanifest.xml` | SCORM 1.2 manifest · fully-enumerated shell resources (post critic-fix). |
| `index.html` | SCORM entry point. |
| `module.js` | M2 module logic · token-overlap acknowledgement gate. |
| `styles.css` | M2 visual rules. |
| `data/objection-bank.json` | Bank of buyer objections from §10 + §12. |
| `data/prospects.json` | Multi-archetype prospect set. |
| `data/quiz.json` | L2 quiz items mapped to LO-M2.1/2/3. |
| `data/transcripts.json` | Worked-example transcripts (Brex displacement + Visa deflection). |

### module-03-calendar-close/ · M3

| File | Purpose |
|---|---|
| `design-log.md` | M3 build log · habit-gate UX decisions. |
| `imsmanifest.xml` | SCORM 1.2 manifest. |
| `index.html` | SCORM entry point. |
| `module.js` | M3 module logic · calendar-open-before-dial habit gate + 2-slot invite. |
| `styles.css` | M3 visual rules. |
| `data/prospects.json` | Prospect set for solo practice. |
| `data/quiz.json` | L2 quiz items mapped to LO-M3.1/2. |
| `data/transcripts.json` | Worked-example transcripts (M.G. closing-move pattern). |

### module-04-icp-buyer-fit/ · M4 (configural)

| File | Purpose |
|---|---|
| `design-log.md` | M4 build log · 4-archetype interleaving. |
| `imsmanifest.xml` | SCORM 1.2 manifest. |
| `index.html` | SCORM entry point · inline boot. |
| `module.js` | M4 module logic · ICP recognition + configural M1+M2+M3 across Maria/Tom/Emma/Lukas. |
| `styles.css` | M4 visual rules. |
| `data/prospects.json` | Full 4-archetype dataset (largest). |
| `data/quiz.json` | L2 quiz items mapped to LO-ICP.1-4. |
| `data/transcripts.json` | Archetype-specific worked examples. |

### module-05-product-prop-mapping/ · M5

| File | Purpose |
|---|---|
| `design-log.md` | M5 build log · multi-stakeholder mid-call event. |
| `imsmanifest.xml` | SCORM 1.2 manifest. |
| `index.html` | SCORM entry point. |
| `module.js` | M5 module logic · prop-pain matching + stakeholder-switch event. |
| `styles.css` | M5 visual rules. |
| `data/prop-pain-bank.json` | 4 product props × pain-mapping bank. |
| `data/prospects.json` | Multi-stakeholder prospect set. |
| `data/quiz.json` | L2 quiz items mapped to LO-PP.1-4. |
| `data/transcripts.json` | Emma + Anya worked example (multi-voice). |

### module-06-regulatory-deflection/ · M6

| File | Purpose |
|---|---|
| `design-log.md` | M6 build log · always-visible job-aid panel. |
| `imsmanifest.xml` | SCORM 1.2 manifest. |
| `index.html` | SCORM entry point. |
| `module.js` | M6 module logic · §19 deflection + Slack→Compliance escalate scaffold. |
| `styles.css` | M6 visual rules. |
| `data/prospects.json` | Lukas + reg-anxious buyer set. |
| `data/quiz.json` | L2 quiz items mapped to LO-REG.1/2. |
| `data/reg-job-aid.json` | §19 deflection table productionised as a 1-page job aid. |
| `data/transcripts.json` | Worked-example transcripts (KYC/AML/GDPR deferral). |

## 04-implement/ · ADDIE Phase 4

| File | Purpose |
|---|---|
| `cohort-1-launch-checklist.md` | Day-by-day launch checklist · Day -16 through Day +120. |
| `launch-comms-plan.md` | Sponsor email + manager pre-read + rep welcome DM · dated + voice-checked. |
| `lms-deployment-runbook.md` | LMS admin runbook · SCORM Cloud preview → Sana upload → smoke test → rollback. |
| `manager-calibration-session-plan.md` | Week-2 + week-6 calibration sessions · minute-level run-of-show. |
| `README.md` | Phase 4 intent, deliverables, gate criteria. |

## 05-evaluate/ · ADDIE Phase 5

| File | Purpose |
|---|---|
| `dashboard-spec.md` | KPI dashboard wireframe spec · 3-line ramp + lead-quality + manager-adoption. |
| `kirkpatrick-measurement-plan.md` | L1-L4 plumbing · field map · owner per level · cohort cadence. |
| `l1-pulse-survey.md` | LTEM tier-3 micro-pulse · 1 Likert + 2 open · ≤30s. |
| `l2-quiz-blueprint.md` | SCORM quiz architecture · first-attempt + day-7 retrieval · Sana scheduling. |
| `l3-call-rubric.md` | Gong-tagged rubric scorecard · M1/M2/M3 × 1-5 · `Call_Review__c` schema. |
| `l4-ramp-retention-tracking.md` | Salesforce `Ramp_Time__c` + HRIS day-120 rollup · 3-line attribution per D-008. |
| `README.md` | Phase 5 intent, deliverables, gate criteria. |

## 06-iterate/ · ADDIE Phase 6

| File | Purpose |
|---|---|
| `case-study-summary.html` | Portfolio-public-facing single-page case study (this build's hero artefact). |
| `content-refresh-sprint-template.md` | 4-week refresh sprint template between cohorts · SCORM versioning · A/B without breaking L4 baseline. |
| `exec-deck.md` | 10-slide K.M. → CRO 6-month review deck. |
| `handoff-pack.md` | In-house designer inheritance pack · SME cadence · v2 ES + DE plan · v3 ask. |
| `iteration-playbook.md` | 10 decision rules · IF [L1-L4 signal] THEN [4-week sprint] · named owner · falsifiable done. |
| `README.md` | Phase 6 intent, deliverables, gate criteria. |

---

*Index v1.0 · regenerate by globbing `F:\LXD task\**\*` after any structural change.*
