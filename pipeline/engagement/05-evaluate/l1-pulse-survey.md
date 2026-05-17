# L1 pulse survey · post-module micro-instrument

> Why this artefact: D-003 commits L1 to LTEM tier-3 (Thalheimer 2018, frameworks-applied #12), not satisfaction. Brief §5 already worded the L1 target as application-intent ("I could use this on a call today ≥ 4.0/5"). The sponsor (K.M., §8) is verbatim against smile-sheets. This instrument is what fires inside Sana at the end of every module.

The whole instrument is ≤ 30 seconds. Three items. No more.

---

## 1 · The instrument · copy-paste-ready

> **Module pulse · 30 seconds**
>
> Three questions. Honest answers help us cut what isn't working before the next cohort.
>
> **Q1.** I could use this on a call today.
> ☐ 1 — Strongly disagree
> ☐ 2 — Disagree
> ☐ 3 — Neutral
> ☐ 4 — Agree
> ☐ 5 — Strongly agree
>
> **Q2.** Name the move you are most likely to forget when the call is live.
> [ ____________________________________________________ ]
>
> **Q3.** What one thing would you remove from this module?
> [ ____________________________________________________ ]
>
> *Thanks. Replies feed the next cohort directly. — M.B.*

---

## 2 · What this instrument deliberately does **not** ask

Avoided per D-003 and §18.2 brand voice (internal):

- "How satisfied were you with this module?" — vanity metric, no decision value.
- "Would you recommend this to a colleague?" — NPS-style; not actionable for content iteration.
- "Was the trainer effective?" — there is no trainer; this is asynchronous SCORM.
- "Did you find the module engaging?" — engagement is not transfer; the brief warns against it (§8 K.M.).
- 5+ Likert items — burden inflation, fatigue noise.

What gets asked is exactly the three things a Phase 6 sprint needs to act:

1. *Will the learner use this on a live call?* (decision-relevance signal · LTEM tier 3)
2. *What did the module fail to embed?* (content-gap signal · drives spaced retrieval design)
3. *What is friction the learner would cut?* (extraneous-load signal · drives module-trim sprints)

---

## 3 · Targets (per brief §5 + master plan §1)

| Metric | 6-mo target | 12-mo target | Failure threshold |
|---|---|---|---|
| Q1 mean (per module) | ≥ 4.0 / 5 | ≥ 4.2 / 5 | < 3.5 triggers Phase 6 sprint 6.1.A |
| Q1 mean (all modules pooled) | ≥ 4.0 / 5 | ≥ 4.2 / 5 | < 3.8 triggers full curriculum review |
| Q1 response rate | ≥ 85 % of completers | ≥ 90 % | < 70 % suggests the instrument is mistrusted |
| Q2 + Q3 open-response rate | ≥ 60 % | ≥ 70 % | < 40 % → revisit prompt wording |

---

## 4 · Weekly open-response coding rubric

Q2 + Q3 are coded weekly by M.B. (and post-engagement by A.S.). Four theme buckets, each tagged with module ID + response date:

| Code | Definition | Example response (synthetic) | Action |
|---|---|---|---|
| **`forgotten-move`** | Learner names a specific behaviour they expect to drop under pressure. M1/M2/M3 or a decision-card lookup. | "Acknowledging the objection — I argue when stressed." | Spaced-retrieval item targeting that move; consider job-aid (framework #20). |
| **`friction-point`** | Something inside the module made the learner work harder than the content warranted. UX, navigation, length, redundancy. | "The transcript was too long before the question." | Phase 6 worked-example trim. Extraneous-load issue (frameworks-applied #8). |
| **`request`** | Learner asks for content / format that's missing. | "I want an audio version for the train." | Logged in v2 backlog (audio is post-pilot per §7). |
| **`praise`** | Genuine positive signal worth preserving when iterating. | "The Companies House lookup felt exactly like real work." | Tagged as a "do not break this in v2" item. Surface to brand-voice doc. |

**Coding cadence.** Every Friday M.B. exports the Sana free-text dump → tags each row → updates `06-iterate/themes-log.md`. After hand-off, A.S. owns the same weekly job.

**Theme escalation rule.** When a theme code is cited by ≥ 30 % of respondents in a single cohort, OR by ≥ 3 cohorts running, it auto-flags into the next Phase 6 sprint backlog.

---

## 5 · How findings feed Phase 6 iteration sprints

The L1 instrument is the fastest signal in the dashboard. L2 and L3 take days to weeks; L1 lands within hours of module completion. So L1 feeds the *first-response* iteration:

| L1 signal | Phase-6 sprint (in `06-iterate/`) | Lead time |
|---|---|---|
| Q1 mean < 3.5 on Module N | Sprint 6.1.A · worked-example pass on Module N | Next 4-week sprint window |
| Theme `forgotten-move` ≥ 30 % cites the same move | Spaced-retrieval item added for that move in next +7-day mini-quiz | Same cohort, +7 d |
| Theme `friction-point` cites same UX issue ≥ 3 times | Sprint 6.1.D · UX-trim pass | Next 4-week sprint window |
| Theme `praise` clusters around a specific feature | Preserve-list update for v2 ES/DE port | Logged immediately |
| Response rate falls < 70 % | Sprint 6.1.E · instrument review (is the prompt mistrusted? Is timing wrong?) | Within 2 weeks |

The decision-rule format here mirrors §6 of `kirkpatrick-measurement-plan.md`. Every theme has a destination.

---

## 6 · Anti-failure guards

To prevent the smile-sheet drift D-003 explicitly avoids:

1. **No item is reworded to fish for higher scores.** If Q1 trends down, the read is "content needs work", not "rewrite the question".
2. **Open responses are reported to the sponsor verbatim** in the monthly dashboard review (anonymised). Aggregated themes accompany, not replace, the raw text.
3. **Manager pressure to "improve scores" is explicitly out of bounds.** A.S. + K.M. signed this off at kickoff (per §8). Score movement comes from content, not coaching learners on how to fill in surveys.

---

## 7 · Sana implementation notes

- **Trigger.** Fires on SCORM `cmi.core.lesson_status = completed` event for any of the 6 modules. Configured by LMS admin (Sana cohort settings).
- **Skip-allowed.** Yes. The instrument is voluntary. Completion rate is a separate metric (target ≥ 85 %).
- **Anonymisation.** Sana stores `user_id`; the M.B. coding view shows only `cohort_id + module_id + free_text`. Identifiable mapping only used in escalation cases (e.g. someone reports a safety/wellbeing issue in Q2/Q3).
- **xAPI emission.** Each response also emits an xAPI statement to Sana's partial LRS for future analytics work (per §16 tooling).

---

## References

- `case-study-tz.md` §5, §7, §8, §18.2
- `00-project-management/decisions-log.md` D-003
- `00-project-management/frameworks-applied.md` #12 (LTEM, Thalheimer 2018), #20 (job-aid, Rossett & Schafer)
- `05-evaluate/kirkpatrick-measurement-plan.md` §1
- Thalheimer, W. (2018). *The Learning-Transfer Evaluation Model.* Work-Learning Research.
