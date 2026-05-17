> Why this artefact: Phase 2 entry point. Translates the Phase 1 analysis pack (`01-analyze/`) into a teachable, assessable architecture before any pixel is built in Phase 3. Cites `master-plan.md` §2 (gate criteria) + `frameworks-applied.md` (4C/ID, ABCD, Bloom revised, Backwards Design, Merrill, Gagné, Mayer, Cognitive Load, UDL/WCAG, job-aid theory).

# Phase 2 · Design

## 1 · Intent

Lock outcomes, curriculum, and module-by-module learning experience for the FinTechCard SMB SDR Onboarding program **before** a single SCORM module is built. Every downstream Phase 3 artefact (six modules + mini-OS shell) consumes the spec written here; every Phase 5 measurement instrument reconciles to the outcome IDs minted here.

The phase converts:

- Phase 1 task inventory (six 4C/ID task classes) → six fully-spec'd module storyboards.
- Phase 1 gap analysis (training-fixable vs environment-fixable) → ABCD-Bloom outcomes scoped to the training-fixable share.
- Phase 1 personas → variability-of-practice axes inside each storyboard.
- Phase 1 L4→L1 cascade → Stage-2 "acceptable evidence" column in the curriculum blueprint.
- Phase 5 placeholder outcome IDs (`LO-M1.1` etc.) → real ABCD-Bloom outcomes that reconcile the L2 quiz blueprint.

## 2 · Sprints (per `master-plan.md` §2)

- **Sprint 2.1 — Outcomes & curriculum.** `learning-outcomes-abcd-bloom.md`, `curriculum-blueprint.md` (Backwards Design 1-2-3), `4cid-blueprint.md`.
- **Sprint 2.2 — Module storyboards.** `module-storyboards/_template.md` + six module storyboards (M1, M2, M3, ICP fit, Product Prop, Reg Deflection). Each follows Merrill's First Principles inside a Gagné nine-event 10-min timeline; Modules 5 + 6 carry the §12 / §19 evidence-substrate note + Phase 5 cohort-1 validation hook (critic issue (c) addressed).
- **Sprint 2.3 — Assessment & UX system.** `assessment-design.md`, `rubric-design.md`, `ux-design-system.md`, `ui-prototypes/`.

## 3 · Gate criteria (mirrors `master-plan.md` §2)

- [ ] Every terminal outcome ABCD-complete (audience, behaviour, condition, degree).
- [ ] Every outcome tagged with a Bloom revised verb at Apply or above.
- [ ] Every outcome lineage maps to ≥1 of M1/M2/M3 keystone moves OR to the §19 deflection table.
- [ ] Each storyboard contains: trigger · worked example · completion problem · solo problem · debrief · spaced-retrieval hook.
- [ ] UX system documents WCAG 2.1 AA conformance approach + a Mayer-principle citation against every design rule.

## 4 · Sprint 2.1 critic-issue carry-forwards (from `critic-log.md` Phase 1 Pass 1)

- (a) **Low-cadence manager interview.** A.S. brokers a 15-min with F.O. or D.W. in W3 of Phase 2; findings update Manager Persona 2 + Module-6 rubric anchors. Tracked here as an open dependency, not a Phase 2 blocker.
- (b) **60/25/15 % gap split.** Phase 2 does not propagate the quantitative split; outcomes are written against gap *categories* (training, environment, communication), not the numeric proportions.
- (c) **Modules 5 + 6 evidence substrate.** Both storyboards carry an `> Evidence note:` blockquote citing §12 / §19 brief content + a Phase 5 cohort-1 Gong validation hook.

## 5 · Links

- Inputs: [`../case-study-tz.md`](../case-study-tz.md) · [`../01-analyze/`](../01-analyze/) · [`../00-project-management/master-plan.md`](../00-project-management/master-plan.md) · [`../00-project-management/decisions-log.md`](../00-project-management/decisions-log.md).
- Phase 3 consumes: `learning-outcomes-abcd-bloom.md`, `curriculum-blueprint.md`, `4cid-blueprint.md`, `module-storyboards/`, `ux-design-system.md`, `ui-prototypes/`.
- Phase 5 reconciles: `learning-outcomes-abcd-bloom.md` outcome IDs ↔ [`../05-evaluate/l2-quiz-blueprint.md`](../05-evaluate/l2-quiz-blueprint.md).

## References

- Brief §§5, 7, 9, 10, 11, 12, 13, 18, 19.
- `master-plan.md` §2 · `decisions-log.md` D-001 through D-008 · `frameworks-applied.md`.
- Wiggins & McTighe (2005); Van Merriënboer & Kirschner (2018); Mayer (2014); Sweller, Ayres & Kalyuga (2011); Merrill (2002); Gagné (1985); Anderson & Krathwohl (2001); Mager (1962/1997); CAST (2018); W3C WCAG 2.1.
