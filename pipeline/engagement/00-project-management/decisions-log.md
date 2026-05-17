# Decisions log

> Every non-trivial design decision goes here. Format: `ID · date · decision · framework lens · brief evidence · alternatives rejected · consequences`. Append-only. Sorted oldest-first.

The point of this log is auditability: a reviewer who disagrees with a choice should be able to trace exactly which evidence and which framework drove it.

---

## D-001 · 2026-05-18 · ADDIE as the spine, not SAM or LLAMA

**Decision.** Use ADDIE phase structure for the project, with internal sprints inside each phase. Reject SAM and LLAMA.

**Framework lens.** Process-model selection.

**Brief evidence.**
- §3 Engagement contract: "Full instructional-design cycle · Discover → Iterate · 6 months end-to-end" — phased language, sponsor expects phase-gates.
- §3 Payment schedule: 25 / 50 / 25 at Phase 1 / 4 / 6 gates → sponsor's procurement contract is ADDIE-shaped.
- §8 K.M.: "I've committed −25 % ramp compression to the CRO. That's the public number." → high-accountability sponsor wants documented phase sign-offs, not iterative SAM-style continuous prototyping.

**Alternatives considered.**
- *SAM (Allen 2012)* — rejected: would suit a smaller-scope engagement; phase-gate payments don't match SAM's iterative paradigm.
- *LLAMA (Torrance)* — rejected: too lightweight for a measurement-heavy, sponsor-public-commitment engagement.
- *Action Mapping alone (Moore)* — kept as a *layer inside* ADDIE Phase 1, not a replacement.

**Consequences.**
- Sprint cadence runs inside phases (3 weeks/phase typical) → keeps the *spirit* of agile inside an ADDIE shell.
- Critic gate at each phase, not at each sprint.

---

## D-002 · 2026-05-18 · 4C/ID as the curriculum backbone, not topic-by-topic

**Decision.** Build the curriculum as a 4C/ID whole-task progression (Van Merriënboer 1997 / 2018), not as a topic-list module-by-module breakdown.

**Framework lens.** Whole-task vs part-task instructional architecture.

**Brief evidence.**
- §9 A.S.: "Top reps sound nothing alike. They don't follow a script. But those three moves are always there." → mastery is configural (M1 + M2 + M3 working together on a live call), not additive.
- §10.1 M.G.: "What I needed was the framing of when to use which prop against which objection. Took me 4 months to figure that out on my own." → the gap is in *combining* component skills, not in any one of them.
- §14 Audit verdict: "It does **not** teach the three keystone behavioural moves (M1/M2/M3) explicitly." → current onboarding is part-task only.

**Alternatives considered.**
- *Topic-by-topic (one module per product prop)* — rejected: replicates the existing failed onboarding.
- *Pure action mapping (Moore)* — kept as gap-analysis lens, but Action Mapping does not prescribe the whole-task progression; 4C/ID does.

**Consequences.**
- Each of the 6 modules is a *task class* of progressively harder whole calls, not a "topic".
- Worked-example → completion → solo problem fading sequence is mandatory in every module.

---

## D-003 · 2026-05-18 · Kirkpatrick L1 reframed via Thalheimer LTEM

**Decision.** L1 is *not* a satisfaction smile-sheet. It is a tier-3 (Thalheimer LTEM) "decision-relevant feedback" instrument with one quantitative item ("I could use this on a call today, 1–5") and two open items ("the move I'm most likely to forget" + "what I'd remove").

**Framework lens.** Evaluation-instrument selection.

**Brief evidence.**
- §5 Success measures: L1 target = "I could use this on a call today ≥ 4.0/5" — already worded as application-intent, not satisfaction.
- §8 K.M.: "Another Articulate slide-deck no one finishes" — sponsor's stated failure mode is generic happy-sheet training.
- §18.2 Brand voice (internal): "Honest about hard parts" — instrument should ask for honest negative feedback, not validation.

**Alternatives considered.**
- *Standard 5-item Likert satisfaction survey* — rejected: invites the failure mode sponsor cited.
- *Net Promoter Score* — rejected: not decision-relevant, doesn't drive iteration.

**Consequences.**
- L1 instrument is two open-ended questions + one Likert item, total ≤30 seconds to complete.
- Open responses are coded weekly and feed Phase 6 iteration sprints.

---

## D-004 · 2026-05-18 · Manager rubric is 3 rows × 5 anchors, single sheet

**Decision.** The manager call-review rubric has exactly 3 rows (M1 opener · M2 acknowledge · M3 close), each scored 1–5 with 3 anchored descriptors per row. Total: one A4 page.

**Framework lens.** Criterion-referenced rubric design (Wiggins) + cognitive-load minimisation for the *grader*.

**Brief evidence.**
- §8 K.M.: "Not a 12-page document — a single sheet with 3 rows (one per move) and 1–5 scoring with anchored descriptors." → sponsor verbatim.
- §10.6 J.T.: "I made my own. Three rows — opener / objection / close — each scored 1–5 with 3 example anchors per row." → highest-performing pod manager already converged on this design.
- §10.7 M.K.: "Wenn ihr eine bessere baut, ich übernehme sie." → second-highest-performing manager will adopt if better.
- §10.8: This is the single most-requested artefact from the manager side.

**Alternatives considered.**
- *Behaviourally-anchored 8-row rubric* — rejected: violates K.M. constraint; raises grader cognitive load above the calibration session can support.

**Consequences.**
- Inter-rater reliability is achievable in a single week-6 calibration session.
- Rubric becomes the L3 measurement instrument and the Phase 2 sprint-2.3 lead artefact.

---

## D-005 · 2026-05-18 · SCORM modules built custom (vanilla HTML/JS), not Articulate

**Decision.** Build each SCORM module as custom HTML/JS/CSS packaged with `imsmanifest.xml` (SCORM 1.2). Articulate Rise/Storyline available but rejected for this engagement.

**Framework lens.** Tool-vs-craft tradeoff in interactive media.

**Brief evidence.**
- §7 Constraints: "Use that OR custom SCORM if interaction outpaces Storyline." — brief allows it.
- §8 K.M.: "Last vendor spent the kickoff call pitching me Articulate add-ons. They built a 90-minute slide deck no one finished." — sponsor primed against Articulate-as-a-crutch.
- §14 Audit verdict: existing self-paced LMS modules in Articulate failed because they were "Tools learned in isolation, not in workflow" — Articulate's slide model encourages this.
- Mini-OS workspace simulation (per user requirement) is impossible inside Storyline's slide paradigm without contorted JS injection.

**Alternatives considered.**
- *Articulate Rise* — rejected: cannot host a window-managed mini-OS.
- *Storyline + custom JS* — rejected: cost of fighting Storyline > cost of building straight.

**Consequences.**
- Reusable `scorm-shell/` framework built once in Sprint 3.1; modules consume it.
- Higher up-front engineering cost, lower marginal cost per module.
- Eventual hand-off must include the shell as part of the SME continuity pack.

---

## D-006 · 2026-05-18 · No audio narration anywhere in v1

**Decision.** Zero audio narration. All instruction delivered via text, code-anchored timestamps in mock Gong transcripts, and on-screen captions inside the mini-OS.

**Framework lens.** Mayer multimedia principles + brief constraint.

**Brief evidence.**
- §7 Constraints: "No audio narration in v1. No in-house studio." → contractual.
- §10.4 P.B. (bottom-quartile): "I want to know the move before I'm on the call — not have to invent it while a CFO is breathing down the line." → preferred modality is *advance text* over real-time audio.
- Mayer's modality principle would normally favour audio + visual; but the constraint inverts this and forces leaning on signalling, spatial-contiguity, and pre-training to compensate.

**Alternatives considered.**
- *Auto-TTS narration* — rejected: out-of-budget for licensing + maintenance; voice quality variance fails the brand-voice "peer-to-peer" requirement.

**Consequences.**
- All call examples appear as transcripts with timing annotations.
- Every interactive scenario must work fully keyboard-driven (WCAG + no-audio).
- v2 considers human-voice or curated audio if budget allows.

---

## D-007 · 2026-05-18 · Mini-OS shell as the consistent learner-facing UX

**Decision.** Build a custom mini-OS (window manager, taskbar, app launcher) that simulates the rep's real workstation: Outreach, Gong, Salesforce, LinkedIn / Companies House, Calendar, Phone-dialler, Slack. All six modules run inside it.

**Framework lens.** Authentic-context learning (situated cognition · Lave & Wenger) + 4C/ID variability of practice.

**Brief evidence.**
- §14 Audit verdict (failure mode for Week 2): "Tools learned in isolation, not in workflow." → directly addressed by simulating the workflow.
- §10.4 P.B.: "I just don't have anything better loaded." → reps need to rehearse the move *in the place* they will perform it.
- §16 Tooling configuration: lists the exact tools (Salesforce + Outreach + Gong + Slack + Sana) → simulation has an authoritative shopping list.
- Brand voice §18.2: "Show the move, then name the move (worked example first, framework after)." → mini-OS is the canvas on which the worked example happens.

**Alternatives considered.**
- *Slide-deck walkthrough of each tool* — rejected: replicates the audit's failure mode.
- *Video screen-recordings of senior reps* — rejected: top-rep articulation gap (risk §20) means recorded reps can't make the moves explicit.

**Consequences.**
- Up-front investment in shell pays off across all six modules and any v2 modules.
- Hand-off pack must include shell code + a "how to add a new app" guide.

---

## D-008 · 2026-05-18 · L4 attribution explicitly bounded; ramp-quality control via cohort comparison, not RCT

**Decision.** L4 attribution is documented as *associative, not causal*. Cohort comparison (post-program cohorts vs pre-program ramp baseline cohort) is the chosen quasi-experimental design. RCT rejected.

**Framework lens.** Phillips Levels 4–5 ROI methodology + practical evaluation design.

**Brief evidence.**
- §8 K.M.: "If we miss it, I need to know whether the cause was training or lead quality or comp, because the conversation with the CRO is honest either way." → sponsor wants attribution honesty, not inflated claims.
- §8 K.M.: "The 25 % ramp compression target assumes I get the lead-quality conversation moving on my end." → confounds are pre-acknowledged by sponsor.
- §17 Comp plan: known SPIF distortion → another confound.
- §20 Risks: marketing lead-quality decline is risk row 1.

**Alternatives considered.**
- *Randomised control trial (split cohort)* — rejected: sales-org headcount + cohort cadence too small to power; ethically dubious to withhold training from new hires.
- *Difference-in-differences with synthetic control* — rejected: insufficient pre-period data granularity.

**Consequences.**
- L4 dashboard surfaces *three* lines: program cohort ramp, baseline ramp, marketing-lead-quality index (from RevOps). Movement is interpreted jointly.
- Phase-7 iteration playbook includes a "no-attribution-confidence" branch when confounds shift.

---

## D-009 · 2026-05-18 · Operational trigger thresholds documented as designer-set, not brief-derived

**Decision.** The 5 % SDR cohort attrition threshold (`iteration-playbook.md` O-A) and the 5-day ramp-regression-vs-prior-cohort threshold are designer-set defaults, not derived from the brief. They are flagged here so future iteration playbook reviewers can rerun the threshold tuning once 4+ cohorts of L4 data exist.

**Framework lens.** Statistical-process-control style trigger tuning — initial defaults set by domain judgement; future re-tuning is data-driven.

**Brief evidence.** None directly. The brief §5 success-measures table sets *outcome* targets (ramp ≤ 71 d, retention ≥ 92 %) but not *trigger* thresholds for intermediate iteration. Brief §21 done-state similarly sets endpoint, not intermediate alarm thresholds.

**Alternatives considered.**
- *Brief-derived thresholds.* Rejected: brief does not provide them; inventing brief-citations would be a measurement-integrity failure.
- *Wider thresholds (e.g. 10 % attrition / 10 d regression).* Rejected: would let cohort-1 problems propagate to cohort-2 before action; too late for a 4-cohort program window.
- *Tighter thresholds (e.g. 3 % / 3 d).* Rejected: noise floor on 10–15 rep cohorts makes 3 % a one-rep difference, which is signal-poor.

**Consequences.**
- After cohort 4 (≥40 SDRs L4 data), re-tune thresholds against observed cohort-to-cohort variance.
- `06-iterate/iteration-playbook.md` Sprint 7.1 candidate includes "re-tune O-A and L4-A thresholds against observed cohort variance" once n ≥ 40.
- Documented honestly so a successor designer does not mistake these for sponsor-set targets.

---

*Decisions log v1.0 · seeded at Phase 0 · grows through every subsequent phase.*
