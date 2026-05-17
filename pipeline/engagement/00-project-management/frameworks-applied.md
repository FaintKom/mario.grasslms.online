# LXD frameworks applied · full citation pack

> Each entry: framework · canonical citation · what it asks you to do · where in this build it shows up · the brief evidence that triggered the choice · what it would have looked like if rejected.

---

## 1 · ADDIE (process spine)

- **Citation.** Branson, R. K. (1975). *Interservice Procedures for Instructional Systems Development.* Florida State Univ. · Molenda, M. (2003). "In search of the elusive ADDIE model." *Performance Improvement*, 42(5), 34–36.
- **What it asks.** Sequence design as Analyse → Design → Develop → Implement → Evaluate, with explicit hand-offs.
- **Used in.** Top-level folder structure `01-analyze/` through `06-iterate/`. Phase-gate criteria in `master-plan.md`.
- **Trigger evidence.** Brief §3 "Full instructional-design cycle · Discover → Iterate". Payment schedule keyed to phase gates.
- **Rejected alternatives.** SAM (too iterative for sponsor's procurement model); LLAMA (too lightweight).

## 2 · 4C/ID — Four-Component Instructional Design

- **Citation.** Van Merriënboer, J. J. G. (1997). *Training complex cognitive skills.* Educational Technology · Van Merriënboer, J. J. G., & Kirschner, P. A. (2018). *Ten steps to complex learning* (3rd ed.). Routledge.
- **What it asks.** Decompose complex skill into (1) **learning tasks** (whole, simplified-to-complex), (2) **supportive information** (mental models, strategies), (3) **procedural information** (just-in-time how-tos), (4) **part-task practice** (drill on automatable sub-skills). Sequence by *task class* of increasing complexity.
- **Used in.** `02-design/4cid-blueprint.md` (curriculum architecture). Every module storyboard in `02-design/module-storyboards/` follows the four components.
- **Trigger evidence.** Brief §9 (A.S.): "Top reps sound nothing alike … but those three moves are always there" → configural mastery. §14 audit verdict: current onboarding teaches product + tools (parts) but not the integrated keystone moves.
- **Rejected alternatives.** Topic-by-topic / Gagné-only architecture.

## 3 · Kirkpatrick four levels (+ Phillips L5 hooked but not committed)

- **Citation.** Kirkpatrick, D. L., & Kirkpatrick, J. D. (2016). *Kirkpatrick's Four Levels of Training Evaluation.* ATD. · Phillips, J. J. (2003). *Return on investment in training and performance improvement programs* (2nd ed.). Routledge.
- **What it asks.** Plan measurement at four levels: L1 reaction · L2 learning · L3 behaviour · L4 results. Phillips adds L5 ROI.
- **Used in.** `05-evaluate/kirkpatrick-measurement-plan.md`, `01-analyze/kirkpatrick-l4-l1-cascade.md` (reverse-engineered from sponsor's commitments).
- **Trigger evidence.** Brief §5 success-measures table is already Kirkpatrick-shaped; sponsor's CRO commitment is L4-anchored.
- **Notes.** L5 (ROI) is not committed in v1 — sponsor did not ask, and the cost-of-rep-churn data (€90K) is in the brief but not validated externally. We *surface* the ROI math in §appendix only.

## 4 · ABCD outcomes

- **Citation.** Mager, R. F. (1962/1997). *Preparing instructional objectives* (3rd ed.). · Heinich, R., Molenda, M., Russell, J. D., & Smaldino, S. E. (2002). *Instructional media and technologies for learning.*
- **What it asks.** Every learning outcome must state **A**udience, **B**ehaviour, **C**ondition, **D**egree (criterion).
- **Used in.** `02-design/learning-outcomes-abcd-bloom.md` — every terminal + enabling outcome ABCD-complete.
- **Trigger evidence.** Brief §5 success measures already provide the Degree column for L2/L3/L4 (e.g. ≥80 % adherence). Mager's discipline forces alignment.
- **Notes.** Pairing ABCD with Bloom verbs forces both behavioural precision *and* cognitive-level discipline.

## 5 · Bloom revised taxonomy

- **Citation.** Anderson, L. W., & Krathwohl, D. R. (Eds.). (2001). *A taxonomy for learning, teaching, and assessing: A revision of Bloom's taxonomy of educational objectives.* Longman.
- **What it asks.** Classify cognitive tasks across Remember / Understand / Apply / Analyse / Evaluate / Create, and the knowledge dimension (Factual / Conceptual / Procedural / Metacognitive).
- **Used in.** Outcome verbs in `02-design/learning-outcomes-abcd-bloom.md`. Most outcomes sit at Apply or Analyse (the action zone for call performance). No outcome lands at Remember-only.
- **Trigger evidence.** Brief §10.1 (M.G.) "Stop trying to sound smart" → behaviour change, not recall. §10.4 (P.B.) "It loaded knowledge" not moves → the existing program was Remember/Understand-heavy.
- **Rejected alternatives.** Webb's DOK — considered but Bloom revised is more widely understood by stakeholders here.

## 6 · Action Mapping (Cathy Moore)

- **Citation.** Moore, C. (2017). *Map it: The hands-on guide to strategic training design.* Montesa Press.
- **What it asks.** Start at the business goal → list observable behaviours that drive it → for each behaviour, ask whether training is the right intervention or whether the environment needs to change → only then design practice activities.
- **Used in.** `01-analyze/gap-analysis.md` (training-fixable vs environment-fixable split).
- **Trigger evidence.** Brief §8 (K.M.) explicitly asks for surfacing of comp-plan and lead-quality issues *separate* from training. §17 comp-plan SPIF distortion is an environment fix RevOps owns.
- **Why both Moore AND 4C/ID.** Action Mapping does gap-finding excellently but does not prescribe how to sequence the eventual training; 4C/ID does. They're complementary.

## 7 · Backwards Design (Wiggins & McTighe)

- **Citation.** Wiggins, G., & McTighe, J. (2005). *Understanding by Design* (2nd ed.). ASCD.
- **What it asks.** Design in three stages: (1) identify desired results, (2) determine acceptable evidence of learning, (3) plan learning experiences. Never plan activities before evidence.
- **Used in.** `02-design/curriculum-blueprint.md` — explicit Stage 1 / 2 / 3 columns. Stage 2 column lines up 1:1 with L2/L3 instruments in `05-evaluate/`.
- **Trigger evidence.** Pairs cleanly with the brief's L1–L4 measurement requirement; without Backwards Design, outcomes and assessments drift apart.

## 8 · Cognitive Load Theory

- **Citation.** Sweller, J. (1988). "Cognitive load during problem solving: Effects on learning." *Cognitive Science*, 12(2), 257–285. · Sweller, J., Ayres, P., & Kalyuga, S. (2011). *Cognitive load theory.* Springer.
- **What it asks.** Manage intrinsic load (inherent task complexity), minimise extraneous load (poor presentation), build germane load (schema construction).
- **Used in.** `01-analyze/cognitive-load-analysis.md` (intrinsic-load profile per persona). Worked-example placement in every storyboard. UX system §extraneous-load reduction.
- **Trigger evidence.** Brief §7 cohort-tolerance ≤10 min — a hard germane-load budget. §10.3 (H.K.) "I forget them under pressure" — element-interactivity is high (M1 + M2 + M3 simultaneously on a call).

## 9 · Multimedia Learning Principles (Mayer)

- **Citation.** Mayer, R. E. (2014). *The Cambridge Handbook of Multimedia Learning* (2nd ed.). Cambridge UP.
- **What it asks.** Apply 12 principles — coherence, signalling, redundancy, spatial-contiguity, temporal-contiguity, segmenting, pre-training, modality, multimedia, personalisation, voice, image.
- **Used in.** `02-design/ux-design-system.md` cites each principle against the design rule it justifies (e.g. *signalling principle* → keystone-move highlights inside transcripts).
- **Trigger evidence.** No-audio constraint (brief §7) inverts the modality principle and forces leaning hard on signalling + segmenting.

## 10 · Worked-example → completion → problem-solving fading

- **Citation.** Renkl, A., & Atkinson, R. K. (2003). "Structuring the transition from example study to problem solving in cognitive skill acquisition: A cognitive load perspective." *Educational Psychologist*, 38(1), 15–22.
- **What it asks.** Begin practice with fully-worked examples, then fade to completion problems (parts left blank), then to solo problem-solving.
- **Used in.** Practice sequence inside every SCORM module: 1 worked example transcript → 1 completion problem (insert the missing M1 question) → 1 solo problem (live mini-OS call with the new buyer profile).
- **Trigger evidence.** Brief §20 risk: "Top-decile articulation gap (M.G. + L.D. can't teach by demonstration)" → the *system* must do the fading, not a human mentor.

## 11 · Spaced retrieval practice

- **Citation.** Roediger, H. L., & Karpicke, J. D. (2006). "The power of testing memory: Basic research and implications for educational practice." *Perspectives on Psychological Science*, 1(3), 181–210.
- **What it asks.** Schedule retrieval-mode practice at expanding intervals.
- **Used in.** `05-evaluate/l2-quiz-blueprint.md` — module quiz at completion + mini-quiz at +7 days (Sana-scheduled).
- **Trigger evidence.** Brief §5 explicit L2 target: "Spaced retrieval at +7 d ≥ 70 %".

## 12 · LTEM (Thalheimer 8-tier evaluation)

- **Citation.** Thalheimer, W. (2018). *The Learning-Transfer Evaluation Model.* Work-Learning Research.
- **What it asks.** Replace Kirkpatrick L1 satisfaction with tiered measurement of (1) attendance, (2) activity, (3) learner perceptions about *decision-relevance*, (4) knowledge, (5) decision-making competence, (6) task competence, (7) transfer, (8) effects of transfer.
- **Used in.** `05-evaluate/l1-pulse-survey.md` — built at LTEM tier 3 not tier "smile-sheet".
- **Trigger evidence.** Brief §8 (K.M.): "Another Articulate slide-deck no one finishes" — sponsor primed against smile-sheets.

## 13 · Dirksen's behaviour-gap model

- **Citation.** Dirksen, J. (2015). *Design for how people learn* (2nd ed.). New Riders.
- **What it asks.** Diagnose performance gaps across five dimensions: knowledge · skill · motivation · environment · communication.
- **Used in.** `01-analyze/gap-analysis.md` table; each gap is tagged with one of the five.
- **Trigger evidence.** Mid-rep H.K. (§10.3) "I know the three moves but I forget them under pressure" → *skill + environment* gap, not knowledge.

## 14 · Merrill's First Principles of Instruction

- **Citation.** Merrill, M. D. (2002). "First principles of instruction." *ETR&D*, 50(3), 43–59.
- **What it asks.** Every effective lesson activates prior knowledge → demonstrates the skill → invites application → integrates into life context. Anchored in real-world problems.
- **Used in.** Canonical module-internal sequence for all six SCORMs; documented in `02-design/curriculum-blueprint.md`.
- **Trigger evidence.** §10.1 (M.G.) "Show the move, then name the move (worked example first, framework after)" — brief's brand-voice rule lines up with Merrill demonstration → application.

## 15 · Gagné's Nine Events

- **Citation.** Gagné, R. M. (1985). *The conditions of learning* (4th ed.). Holt, Rinehart & Winston.
- **What it asks.** Each lesson runs: gain attention → state outcome → recall prior → present stimulus → guide → elicit performance → feedback → assess → enhance retention/transfer.
- **Used in.** Lesson-opener checklist inside each storyboard.
- **Trigger evidence.** Tactical micro-structure for a 10-minute module; without it, modules tend to skip the retention step (which is exactly the failure mode the existing onboarding has).

## 16 · Universal Design for Learning + WCAG 2.1 AA

- **Citation.** CAST (2018). *Universal Design for Learning Guidelines version 2.2.* · W3C (2018). *Web Content Accessibility Guidelines 2.1.*
- **What it asks.** Provide multiple means of engagement, representation, action/expression. WCAG: perceivable, operable, understandable, robust.
- **Used in.** `03-develop/scorm-shell/a11y-audit.md` + per-module audit notes.
- **Trigger evidence.** Brief §7 hard constraint "WCAG 2.1 AA".

## 17 · Situated cognition (supporting context for mini-OS)

- **Citation.** Lave, J., & Wenger, E. (1991). *Situated learning: Legitimate peripheral participation.* Cambridge UP.
- **What it asks.** Knowledge is partly bound to its context of use; train where the work happens.
- **Used in.** Mini-OS shell decision (D-007 in `decisions-log.md`).
- **Trigger evidence.** §14 audit verdict — tools-in-isolation failure mode.

## 18 · Self-determination theory (motivation layer · light touch)

- **Citation.** Ryan, R. M., & Deci, E. L. (2000). "Self-determination theory and the facilitation of intrinsic motivation, social development, and well-being." *American Psychologist*, 55(1), 68–78.
- **What it asks.** Support autonomy, competence, relatedness to sustain intrinsic motivation.
- **Used in.** Cohort kickoff comms + manager 1:1 rubric framing (rubric framed as *self-coaching tool*, not surveillance).
- **Trigger evidence.** Exit interview (§10.5): "Every Monday I was bottom 3 and everyone could see it" — competence/relatedness damage. We deliberately do not gamify leaderboards in v1.

## 19 · Threshold concepts (Meyer & Land · light touch)

- **Citation.** Meyer, J. H. F., & Land, R. (2005). "Threshold concepts and troublesome knowledge (2): Epistemological considerations and a conceptual framework for teaching and learning." *Higher Education*, 49(3), 373–388.
- **What it asks.** Identify ideas that, once crossed, transform learner perspective; concentrate teaching effort there.
- **Used in.** The threshold concept for SDR ramp = "the diagnostic question creates the pitch — you do not pre-decide what to pitch". Surfaced in Module 1.
- **Trigger evidence.** §10.1 (M.G.) "Ask one good question and then shut up for 5 seconds. Five seconds feels like an hour but it's where the deal happens" — that 5-second silence is the threshold.

## 20 · Job-aid theory (Rossett & Schafer)

- **Citation.** Rossett, A., & Schafer, L. (2007). *Job aids and performance support.* Pfeiffer.
- **What it asks.** When the cost of forgetting is high and the skill is reference-able, build a job-aid instead of (or alongside) training.
- **Used in.** Module 6 (regulatory deflection) produces a 1-page job aid (the §19 table from the brief, productionised); Module 4 produces an ICP buyer-fit decision card.
- **Trigger evidence.** §10.4 (P.B.) "I want to know the move before I'm on the call" — point-of-use support beats classroom recall.

---

## Frameworks considered and explicitly rejected

- **Kemp's model** — too generic, no advantage over ADDIE.
- **Dick & Carey** — task-analysis is too linear for configural call-skill mastery.
- **ASSURE** — classroom-centric; doesn't fit blended LMS + manager-1:1 architecture.
- **70-20-10** — a heuristic, not a design framework. The brief already implies it (manager 1:1s + LMS + on-job calls).
- **Bloom's *original* taxonomy (1956)** — superseded by revised 2001 version.
- **SOLO taxonomy** — useful for higher-ed; less so for behaviour-anchored sales training.
- **HPT (Human Performance Technology, ISPI)** — the action-mapping layer already covers HPT-style root-cause separation.
- **Constructive alignment (Biggs)** — folded into Backwards Design + ABCD; redundant to call out separately.

---

*Citations pack v1.0 · updated whenever a new framework is invoked during the build.*
