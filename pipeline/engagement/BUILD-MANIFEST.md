# Build manifest

> One-page artefact summary of what was delivered against `case-study-tz.md v1.0`. Generated 17 May 2026 against the post-Phase-6 build.

---

## Phase-by-phase counts

| Phase | Folder | Files | Lines | Headline artefact |
|---|---|---:|---:|---|
| 0 | `00-project-management/` | 4 | 638 | `decisions-log.md` (D-001 → D-009) |
| 1 | `01-analyze/` | 9 | 882 | `task-inventory.md` (4C/ID six task classes) |
| 2 | `02-design/` | 15 | 2 167 | `4cid-blueprint.md` + 6 module storyboards |
| 3 | `03-develop/` | 71 | 12 895 | `scorm-shell/index.html` + 6 SCORM modules |
| 4 | `04-implement/` | 5 | 590 | `cohort-1-launch-checklist.md` |
| 5 | `05-evaluate/` | 7 | 803 | `l3-call-rubric.md` + `l4-ramp-retention-tracking.md` |
| 6 | `06-iterate/` | 6 | ~1 050 | `case-study-summary.html` + `exec-deck.md` |
| — | Root | 4 | ~700 | `README.md` + `case-study-tz.md` + this file + `PROJECT-INDEX.md` |

**Project total:** 7 phases (6 ADDIE + Phase 0 PM) · **121 files** (post-build, includes the 3 portfolio-polish artefacts created in this batch) · **~19 800 lines**.

Pre-portfolio-polish snapshot (before this batch): 118 files · ~18 988 lines.

---

## Critic verdicts per phase

| Phase | Pass # | Date | Verdict | Notes |
|---|---|---|---|---|
| 1 · Analyse | 1 | 18 May 2026 | **PASS** | 3 quality-of-defence issues raised; none required rework. |
| 2 · Design | 1 | 18 May 2026 | **PASS** | Forward LO-ID reconciliation closed at Phase 5 source. |
| 3 · Develop | 1 | 17 May 2026 | **CONDITIONAL PASS → PASS** | 3 fixes (M2 manifest, event-log spec drift, SCORM Cloud preview log) all closed in one rework. |
| 4 · Implement | 1 | 18 May 2026 | **PASS (w/ rework) → PASS re-affirmed** | 3 fact/date hygiene fixes applied: GC-derived hangup citation, 17 Jun pre-read alignment, Day +60/+120 weekday correction. |
| 5 · Evaluate | 1 | 17 May 2026 | **PASS** | 3 non-blocking polish items applied in same pass (disclaimer bolded, v2 backlog row, LO-ID reconciliation note). |
| 6 · Iterate | 1 | 18 May 2026 | **PASS (w/ rework) → PASS re-affirmed** | Exec deck slide 4 cohort count, slide 5 honest read, slide 6 below-trigger framing rewritten; D-009 logged. |

**All six phases passed within max 1 critic pass + at most 1 single-revision rework.** Critic was a fresh subagent with no access to drafting context — saw only the brief, the artefacts, and the gate criteria.

Full audit trail: `00-project-management/critic-log.md`.

---

## Open conditional items

| Item | Owner | Gate | Trigger |
|---|---|---|---|
| Phase 3 Gate 1 · live SCORM Cloud preview runs for all 6 modules | LMS admin | Day −7 pre-launch | Sign-off required before LMS admin uploads to Sana production. Procedure documented in `03-develop/scorm-shell/README.md` §8. |
| Phase 1 follow-up · low-cadence manager interview (broker via A.S.) | A.S. + Mario | Sprint 2.1 (Phase 2) | Manager Persona 2 currently uses borrowed P.B. quote about F.O.; replace with direct interview when scheduled. |
| Phase 5 forward dependency · Sana xAPI LRS GA for +30 d retrieval | Sana product roadmap | v2 backlog | Currently deferred to v2 per `05-evaluate/l2-quiz-blueprint.md` §6. |

No other open items at hand-off. All other gate criteria fully met.

---

## Frameworks

- **Applied:** 20 (ADDIE · 4C/ID · Kirkpatrick · ABCD · Bloom revised · Action Mapping · Backwards Design · Cognitive Load Theory · Multimedia Learning · Worked-example fading · Spaced retrieval · LTEM · Dirksen · Merrill · Gagné · UDL + WCAG · Situated cognition · Self-determination · Threshold concepts · Job-aid theory).
- **Explicitly rejected:** 8 (Kemp · Dick & Carey · ASSURE · 70-20-10 · Bloom 1956 · SOLO · HPT/ISPI · Biggs constructive alignment).

Full citation pack with brief-evidence triggers and rejection reasoning: `00-project-management/frameworks-applied.md`.

---

## Decisions

**9 decisions logged**, each with: ID · date · framework lens · brief evidence · alternatives rejected · consequences. Append-only.

| ID | Decision | Lens |
|---|---|---|
| D-001 | ADDIE as spine (not SAM, not LLAMA) | Process-model selection |
| D-002 | 4C/ID as curriculum backbone (not topic-by-topic) | Instructional architecture |
| D-003 | Kirkpatrick L1 reframed via Thalheimer LTEM tier-3 | Evaluation instrument |
| D-004 | Manager rubric = 3 rows × 5 anchors, single A4 page | Criterion-referenced rubric design |
| D-005 | SCORM modules built custom (vanilla HTML/JS), not Articulate | Tool-vs-craft tradeoff |
| D-006 | No audio narration anywhere in v1 | Mayer + brief constraint |
| D-007 | Mini-OS shell as the consistent learner-facing UX | Situated cognition + 4C/ID variability |
| D-008 | L4 attribution bounded; cohort comparison, not RCT | Phillips L4-5 evaluation design |
| D-009 | O-A 5 % attrition + L4-A 5 d ramp-regression triggers are designer-set | Statistical-process-control tuning |

Source: `00-project-management/decisions-log.md`.

---

## What would I do differently next time

1. **Schedule the low-cadence manager interview before Phase 1 closes, not after.** Manager Persona 2 carried a borrowed quote through Phase 2 storyboarding; closing the data gap earlier would have removed a quality-of-defence concern from every subsequent critic pass.
2. **Build the mini-OS shell behind a feature-flag boot in Sprint 3.0, before any module is wired to it.** Two modules (M1 + M3) were partially rewritten when the shell's `bootApi` signature stabilised in Sprint 3.2; a thin boot stub one sprint earlier would have absorbed that churn.

---

*Manifest v1.0 · regenerate by globbing the repo + reading `critic-log.md` after any phase change.*
