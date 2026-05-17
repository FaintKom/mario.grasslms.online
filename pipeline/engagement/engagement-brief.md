# Engagement brief — FinTechCard · SMB sales-rep onboarding

> The brief treated as real for the duration of this engagement. Every artefact downstream of this document references the same client, sponsor, dates, budget, scope, and success measures. No artefact deviates from this brief without an explicit change-request entry in the iteration log.

---

## 1 · Client snapshot

| Field | Value |
|---|---|
| **Client** | FinTechCard Ltd. (anonymised; Series-B B2B card issuer, UK + EU markets) |
| **Industry** | Fintech · corporate cards + expense management for SMB segment |
| **Size** | ~280 FTE total; **120-rep sales org** across UK, IE, NL, DE, ES, IT |
| **Stage** | Series-B (€48m raised), 18 months post-Series-A, ARR ~€22m, target ARR €40m by EOY |
| **Product** | Corporate card + spend-control platform: real-time limits, multi-user cards, auto-FX, receipt capture, QuickBooks / Xero sync |
| **ICP** | SMB owners, 5–100 FTE, recurring spend ≥€10K / month, EU-incorporated |

## 2 · Sponsor + named stakeholders

| Name (anonymised) | Role | Decision power |
|---|---|---|
| **K.M.** | VP Sales Enablement | Engagement sponsor · economic buyer · final sign-off on curriculum |
| **A.S.** | Head of SDR Org (UK + IE) | Primary champion · provides the 8 SMEs |
| **D.R.** | Head of People · L&D budget owner | Co-signer on engagement contract |
| **J.V.** | RevOps Director | Owns the dashboard data; sign-off on L4 measurement plan |
| **8 SDRs** | Performance band: 2× top-decile, 4× mid, 2× bottom-quartile | SME interviews + shadowing |
| **2 SDR Managers** | UK + DE pods | Manager-side persona research + L3 rubric calibration |

## 3 · Engagement contract

| Field | Value |
|---|---|
| **Engagement** | Full instructional-design cycle: Discover → Iterate, 6 months end-to-end |
| **Start** | March 2026 |
| **First cohort live** | July 2026 (16 weeks from kickoff) |
| **Budget** | €58 000 (fixed-fee; phased payments at gates 1, 4, 6) |
| **Cohort cadence post-launch** | Every 4 weeks · ~10–15 reps per cohort |
| **My role** | Lead Learning Experience Designer · solo + 2 client-side SMEs + 1 client-side LMS admin |
| **Procurement contact** | client procurement team via D.R.'s office |

## 4 · Business problem (in K.M.'s words, kickoff call)

> "Ramp time for new SDRs is sitting at ~95 days to first paid quota attainment. Top decile hits it in ~52. Bottom quartile churns out before day 120 without ever paying for themselves. We need to compress mean ramp by 25 % and stop the bottom-quartile churn — losing two reps before they pay back costs us ~€90K each in unrecovered onboarding."

## 5 · Success measures (top-line, agreed at kickoff)

| Level | Measure | Target | Baseline | Source |
|---|---|---|---|---|
| **L4 — Results** | Mean ramp time to first paid quota | ≤ 71 days (−25 % from 95) | 95 days | Salesforce ramp-time field |
| **L4 — Results** | Bottom-quartile churn before day 120 | ≤ 8 % | ~17 % (last 4 cohorts) | HRIS exit data + Salesforce |
| **L3 — Behaviour** | Talk-track adherence on recorded calls, weeks 4–8 | ≥ 80 % | ~52 % (mentor-scored sample) | Gong + manager rubric |
| **L3 — Behaviour** | Objection-handling rubric score, week 4 | ≥ 3.5 / 5 | ~2.4 / 5 | Manager rubric |
| **L2 — Learning** | SCORM module quiz mastery, first attempt | ≥ 80 % | n/a | SCORM `cmi.core.score.raw` |
| **L1 — Reaction** | Thalheimer 3-Q micro-pulse, post-module | "I could use this today" ≥ 4.0 / 5 | n/a | Embedded post-module pulse |

## 6 · Scope · what we are solving in this engagement

- The **0–60 day** ramp arc for newly hired SDRs joining the SMB segment.
- The **call-motion craft** — discovery, positioning, objection handling, call close.
- A **manager-side reinforcement layer** — 1:1 rubric, call-review cadence, week-2 + week-6 calibration sessions.
- **Measurement plumbing** — Kirkpatrick L1–L4 instruments wired to existing Salesforce / Gong / HRIS data.

## 7 · Out of scope (explicitly carved out at kickoff)

- **Regulatory compliance training** (KYC, AML, SCA, PSD2, GDPR) — handled by existing compliance team via separate Cornerstone modules.
- **Manager hiring + onboarding** — separate engagement; we touch managers only as reinforcement layer.
- **Mid-market + Enterprise segment** — Mid-Market SDR motion is different (longer sales cycle, multi-stakeholder); separate engagement Q4 2026.
- **CRM / tooling change** — Salesforce + Outreach + Gong + Slack are fixed; we work inside the existing stack.
- **Compensation plan redesign** — RevOps owns; we surface incentive-related root-cause findings to RevOps but do not design comp.
- **Marketing-source lead-quality issues** — flagged in Phase 1 as a likely contributor to bottom-quartile churn but explicitly outside engagement scope. Documented for the sponsor.

## 8 · Constraints

- **No audio narration in v1.** No in-house studio; v1 ships text + screencasts only.
- **No new authoring-tool purchase.** Client already owns Articulate 360 (Rise + Storyline) and SCORM Cloud. We use that stack OR ship a custom SCORM SCO where the interaction outpaces Storyline's built-in capability.
- **LMS = Sana.** Existing instance; SCORM 1.2 compatibility required, xAPI nice-to-have.
- **Languages.** EN primary; ES + DE secondary (cohort-by-cohort decision in Phase 3 sequencing).
- **Cohort tolerance for ramp content** ≤ 10 min per module. No 45-min "training day" formats.

## 9 · Risks identified at kickoff

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Marketing lead-quality is the actual ramp-time bottleneck | Medium | High | Surface in Mager analysis (Phase 1); document; cap training-side responsibility |
| Manager 1:1 cadence is uneven across pods | High | Medium | Build manager-reinforcement layer + week-2 calibration session into the program |
| Top-decile reps cannot articulate what they do differently | High | Medium | Use call-recording analysis (Gong) as evidence alongside SME interviews |
| Cohort cadence (every 4 weeks) leaves no slack for v2 iteration mid-rollout | Medium | Medium | Phase 7 schedules quarterly content-refresh sprints between cohort waves |
| Sponsor turnover mid-engagement (K.M. has been in role 11 months) | Low | High | Document scope + success measures + sign-off in writing at every phase gate |

## 10 · Document control

| Phase | Sign-off document | Sign-off party | Status |
|---|---|---|---|
| 1 Discover | `phase-1-discover/phase-1-summary.md` | K.M. + A.S. | Pending |
| 2 Define | `phase-2-define/phase-2-summary.md` | K.M. | Pending |
| 3 Design | `phase-3-design/phase-3-summary.md` | K.M. + A.S. + J.V. (for L4 wiring) | Pending |
| 4 Develop | `phase-4-develop/phase-4-summary.md` | K.M. + 2 SDR Managers (pilot review) | Pending |
| 5 Deliver | `phase-5-deliver/phase-5-summary.md` | K.M. + LMS admin | Pending |
| 6 Measure | `phase-6-measure/phase-6-summary.md` | K.M. + J.V. | Pending |
| 7 Iterate | `phase-7-iterate/phase-7-summary.md` | K.M. + A.S. | Pending |

---

*Engagement brief v1.0 · agreed at kickoff call, week 1 · revised once (week 3, post-Discover) — see `iteration-log.md` for change history.*
