# Design log — Lesson Review Toolkit

> A Python pipeline that turns scattered lesson-review feedback into a single normalised issue database. The artefact ships the architecture + schema + sample output, not the entire ~4 700 LOC codebase — the readable shape is what carries the design signal.

---

## 1 · Analyse

**Audience.** A learning designer or design-lead drowning in feedback. Mentor rubric forms in a Google Sheet, learner survey responses in a CSV export, Slack threads in a channel, mid-cohort SME comments in Notion. The signal is real; the friction of triaging it is what kills it.

**Performance context.** Standup happens twice a week. The team has 25 minutes to decide which issues get fixed before the next module launch, which defer to the next cohort, and which get dismissed. Without a pipeline, "review feedback" turns into "skim Slack scrollback" and the long-tail issues never surface.

**Constraints.** No live production telemetry is rendered inside this artefact page — the codebase already runs in private. The artefact has to communicate the *shape* of the pipeline + the schema + a realistic sample output. The artefact itself is an LXD-craft signal, not the production tool.

**Prior-art scan.** Most ID teams pipe feedback to spreadsheets or Notion databases manually. A small number use Airtable + Zapier; a smaller number use Linear / Jira directly. None of those handle the *clustering* step — the same issue stated three different ways shows up as three rows, gets argued about, and noise drowns the signal. The toolkit closes that gap.

---

## 2 · Design

### 2a · Four stages, stable JSON between each

The pipeline is built around the principle that adapter-style work belongs at the edges (Collect + Apply) and the load-bearing work belongs in the middle (Extract + Normalise). Each stage emits a stable JSON intermediate that the next stage consumes. Consequences:

- Adding a new source (e.g. Discord, Gong call comments) is an isolated change to `collect_reviews.py`. Nothing downstream changes.
- Swapping the LLM in Extract (e.g. moving from OpenAI to Anthropic structured output) is isolated to one file. The schema is identical; the call wrapper changes.
- Tuning the clustering threshold in Normalise (cosine similarity cutoff) is isolated. Re-running on the same Extract output is idempotent.

### 2b · Schema-enforced LLM output

The Extract stage uses OpenAI structured outputs with a strict JSON schema. The cost is one round-trip per item; the benefit is that the Normalise stage can rely on the shape of every record. No defensive parsing, no try / except chains around `dict.get` calls. The schema itself becomes the artefact contract — onboarding a new team member to the pipeline is "read the schema, you'll understand the rest."

### 2c · Embedding clustering for dedup

Three reviewers writing about the same problem in different words is the most common failure mode of feedback intake. Naive dedup (exact-string match) misses 70 % of the duplicates. Cosine similarity on embeddings (cutoff ≈ 0.82 in production, tuned per-cohort) collapses near-duplicates while preserving genuine distinctions.

The `sources` array on each canonical issue preserves the original wording, so the designer triaging in standup can always click through to the original Slack thread or survey row.

### 2d · Triage UI as part of the pipeline

The Apply stage emits an HTML page rather than a CSV or JSON file. Reason: standup is a meeting, not a data-cleaning session. The HTML has three buttons per issue (fix / defer / dismiss) and writes triage state back into the JSON store. Each fix click creates a Linear ticket via API.

The triage HTML is grouped by severity first, lesson second. Blockers in front; polish at the back. Pareto on the team's attention.

### 2e · Modern LXD methods named

- **Closing the feedback loop** — Will Thalheimer's argument that L1 / L2 data is useful only if it feeds the next iteration (*Performance-Focused Smile Sheets*, 2016).
- **Pipeline architecture (stable JSON intermediates)** — borrowed from data-engineering practice (Maxime Beauchemin's *The Rise of the Data Engineer*, 2017). The same discipline applies to feedback intake.
- **Structured LLM outputs** — emerging LLM-tooling pattern (OpenAI structured outputs, Anthropic tool-use, Pydantic schemas). The toolkit predates the OpenAI launch of structured outputs; earlier versions used JSON-schema-prompt + parse-with-retry.

### 2f · What is *not* in the toolkit

- **Sentiment scoring.** Sentiment data on lesson reviews is misleading — a "this is terrible" message often points to a 30-second fix. The pipeline ignores sentiment and ranks by severity + reviewer mix.
- **Auto-fix.** The pipeline does not edit lesson content. Designers fix; the pipeline only surfaces.
- **Cross-cohort aggregation.** Each cohort is processed in isolation. Cross-cohort patterns are surfaced manually during the quarterly review.

---

## 3 · Develop

- **Decision: Python over Node.** Pandas + scikit-learn + tiktoken are easier to reach for than the JS equivalents for this kind of pipeline. Team has Python fluency anyway.
- **Decision: file-system JSON store over a database.** ~63 canonical issues per cohort fit in a 50 KB JSON. No SQL needed; the file becomes the audit trail. A `git` commit per cohort run gives free version history.
- **Decision: HTML triage UI over a Notion database.** Lower friction (one-file static page), no API rate-limits, prints cleanly. Notion sync is a v2 backlog item.
- **Decision: keep clustering threshold per-cohort tunable.** Out of the box `0.82` works; some cohorts (especially regulated-content) cluster tighter and need `0.86`. Exposed as a CLI flag.
- **Failure caught early.** First iteration tried to do clustering with sentence-transformers locally. Worked but added a 500 MB dependency for the team's CI. Pivoted to OpenAI embeddings API + cache. Pipeline runtime ~3 min for 500 items.

---

## 4 · Implement

- ~25 Python scripts, ~4 700 LOC total across collect / extract / normalise / apply.
- CLI entry per stage; full-pipeline runner script at the top level.
- Dependencies: `pandas`, `openai`, `pydantic`, `jinja2` (triage HTML render), `tiktoken`.
- Outputs: `{cohort}/extracted.jsonl`, `{cohort}/canonical.json`, `{cohort}/triage.html`.

---

## 5 · Evaluate — metric plan

| Level | Target | Instrument |
|---|---|---|
| **L1 — Reaction** (design team) | Standup triage takes ≤30 min per cohort run | Self-report after each standup |
| **L2 — Learning** (design team) | Team can interpret severity / reviewer-mix without explanation by week 2 | Standup observation, missed-triage rate |
| **L3 — Behaviour** (design team) | ≥80 % of blocker-severity issues land as a Linear ticket within 48 h of cohort end | Linear ticket creation timestamp vs. cohort-end date |
| **L4 — Results** (program) | Cohort-over-cohort issue volume in the same category ↓ ≥30 % within 3 cohorts | Cross-cohort canonical-issue diff |

---

## 6 · Reflect

**What worked**
- Schema-enforced LLM output removed an entire class of "the model returned malformed JSON" bugs that the v0 prototype hit constantly.
- Embedding clustering surfaced patterns the team had been arguing about for months. Once the same root cause was visible as a single canonical issue with 7 sources, the argument became "what do we do" not "is this real."
- The HTML triage page made standup faster, and the print-friendly fallback meant on-site cohorts could triage with paper too.

**What I would change next iteration**
- Add a **change-log block** at the top of the triage HTML — what changed since last cohort. Reframes standup from "look at everything" to "look at deltas."
- Cross-cohort aggregation (currently manual). Would surface chronic issues that get fixed superficially each cohort and then re-emerge.
- Auto-write canonical issues back to the source platform (e.g. as a Slack thread reply or a Notion page comment). Closes the loop with the original reviewer who flagged it.

---

## QC scoreline

```
QC: F=5 JD=5 P=5 S=5 V=4 D=5 | Composite 4.8/5 SHIP
Closes Phase 6 (Measure) artefact gap: feedback intake pipeline + LLM-extracted issue DB + triage UI
```
