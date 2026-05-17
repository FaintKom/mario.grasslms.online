> Why this artefact: Operationalises brief §2's stakeholder table into a RACI + power/interest grid + communication cadence — so every Phase 1–6 artefact has a named approver, every sign-off cascades to the 25/50/25 payment trigger (§3), and the critic agent can audit who saw what when.

# Stakeholder map · RACI + power/interest + cadence

## 1 · Cast (anonymised, per brief §2)

| Initials | Role | Tenure | Decision power | Engagement role |
|---|---|---|---|---|
| **K.M.** | VP Sales Enablement | 11 months | Sponsor · economic buyer · final sign-off | Kickoff lead · weekly check-ins · phase-gate signer |
| **A.S.** | Head of SDR Org (UK + IE) | 3 yrs | Champion · SME gatekeeper | Provides 8 SDR + 2 manager SMEs · validates behavioural moves |
| **D.R.** | Head of People · L&D budget owner | n/a (existing role) | Contract co-signer · phased payment trigger | Signs contract + invoices |
| **J.V.** | RevOps Director | n/a | L4 measurement plan signer | Dashboard wiring · ramp-time data · day-120 retention rollup |
| **R.K.** | CMO | n/a | No engagement decision power | Lead-quality dependency (out of training scope; K.M. owns conversation) |
| **8 × SDR SMEs** | M.G., L.D., H.K., N.W., R.A., O.B., P.B., exit interviewee | varies | None | Interview source for M1/M2/M3 evidence |
| **2 × SDR Managers** | J.T. (UK Pod 1), M.K. (DE Pod 1) | varies | None on contract; high influence on adoption | Manager-side persona · L3 rubric calibration |
| **LMS admin** | Sana administrator | n/a | Phase 5 launch signer | SCORM upload + cohort enrolment |

## 2 · RACI · phase × stakeholder

Convention: **R** = Responsible (does the work), **A** = Accountable (signs off), **C** = Consulted (bidirectional), **I** = Informed (one-way notification).

| Phase / artefact | Mario (lead) | K.M. | A.S. | D.R. | J.V. | LMS admin | Managers J.T./M.K. | R.K. |
|---|---|---|---|---|---|---|---|---|
| Phase 1 · Analyse artefacts | R | A | C | I | C | I | C | I |
| Phase 1 gate (25 % payment) | R | A | I | A (invoice) | I | – | – | – |
| Phase 2 · ABCD outcomes + 4C/ID blueprint | R | A | C | I | C | I | C | I |
| Phase 2 · 6 storyboards | R | C | C | – | – | I | C | – |
| Phase 2 · L3 rubric (3-row) | R | A | C | – | – | – | **C primary** | – |
| Phase 3 · 6 SCORM modules + mini-OS | R | I | C | – | – | C | I | – |
| Phase 3 · WCAG 2.1 AA audit | R | I | – | A (legal) | – | C | – | – |
| Phase 4 · LMS deployment runbook | R | I | I | – | – | **R co** | I | – |
| Phase 4 gate (50 % payment) | R | A | I | A (invoice) | C | I | – | – |
| Phase 4 · Manager calibration sessions (W-2 + W-6) | R | I | A | – | – | – | **R as participants** | – |
| Phase 5 · L1 instrument | R | A | C | – | I | C | I | – |
| Phase 5 · L2 quiz + +7-day retention | R | I | – | – | – | **R co** (Sana scheduling) | – | – |
| Phase 5 · L3 rubric scoring live in Gong | C | A | **R co** | – | C | – | **R execution** | – |
| Phase 5 · L4 dashboard (3 lines: cohort ramp · baseline · lead-quality index) | C | A | I | – | **R primary** | – | – | I (lead-quality data feed) |
| Phase 6 · iteration playbook | R | A | C | I | C | I | C | – |
| Phase 6 gate (25 % payment) + hand-off | R | A | C | A (invoice) | C | A (LMS continuity) | C | – |

**Reading note.** K.M. is **A**ccountable on every phase gate and every L4 commitment. A.S. is **A**ccountable for SME access and for L3 rubric adoption — the two pieces K.M. delegated to her at kickoff (§8 SPOC).

## 3 · Power / interest grid

Mendelow (1991) frame. Plotted as ASCII; placement qualitative.

```
              ┌──────────────────────────────┬──────────────────────────────┐
              │                              │                              │
              │     KEEP SATISFIED           │     MANAGE CLOSELY           │
              │     (high power · low int.)  │     (high power · high int.) │
   high       │                              │                              │
   power      │       • D.R. (budget)        │       • K.M. (sponsor) ★     │
              │                              │       • A.S. (champion)      │
              │                              │       • J.V. (L4 data owner) │
              │                              │                              │
              ├──────────────────────────────┼──────────────────────────────┤
              │                              │                              │
              │     MONITOR                  │     KEEP INFORMED            │
              │     (low power · low int.)   │     (low power · high int.)  │
   low        │                              │                              │
   power      │       • R.K. (CMO) ◇         │       • J.T., M.K. (managers)│
              │       • LMS admin            │       • 8 × SDR SMEs         │
              │                              │       • Exit-interview rep   │
              │                              │                              │
              └──────────────────────────────┴──────────────────────────────┘
                       low interest                  high interest

   ★ = primary sponsor and economic buyer
   ◇ = R.K. (CMO) low-interest from this engagement's perspective is accurate per §8:
       "Not your problem, but I want you to know I know it's in the picture." K.M. owns the
       CMO conversation; we do not directly engage R.K.
```

**Notes on placement.**

- **K.M.** is the only stakeholder simultaneously **high-power and high-interest** — she has publicly committed the L4 number to the CRO (§4). Every weekly check-in is with her.
- **J.V.** is placed *high-power · high-interest* because the L4 dashboard cannot ship without her — she owns Salesforce + Outreach + Gong + the comp-plan redesign roadmap. Per `D-008` she is the named owner of the L4 line.
- **LMS admin** moves from *Monitor* in Phase 1 → *Manage Closely* during Phase 4 Sprint 4.2. The grid reflects the average position across the 6-month engagement.
- **J.T. and M.K.** are *low-power · high-interest*: zero decision power on contract, but their adoption of the rubric is the difference between "L3 telemetry exists" and "L3 telemetry is real". §10.7 M.K. quote: "Wenn ihr eine bessere baut, ich übernehme sie."

## 4 · Communication cadence

| Stakeholder | Cadence | Format | Trigger | Owner |
|---|---|---|---|---|
| K.M. | **Weekly · 30 min** | Friday check-in (per §8 "Me for sign-offs") | Standing | Mario |
| K.M. | **Phase-gate sign-off** | Written summary + decisions-log delta + critic-agent PASS note | At gates 1 / 4 / 6 | Mario |
| A.S. | **Weekly · 30 min** | Tuesday SME-coordination call | Standing | Mario |
| A.S. | **Ad-hoc** | Slack `#sdr-onboarding-design` (per §16) | Behaviour-validation questions | Mario |
| D.R. | **Per phase-gate** | Invoice email + signed phase summary | At gates 1 / 4 / 6 | Mario |
| J.V. | **Bi-weekly · 30 min** | Dashboard-wiring sync | Starting W12 (Phase 5 prep) | Mario |
| J.V. | **Phase 5 gate** | L4 dashboard sign-off — three lines per `D-008` | W20 | Mario |
| LMS admin | **Weekly W10 onwards** | SCORM packaging + Sana enrolment sync | Starting W10 | Mario |
| Managers J.T. + M.K. | **One 60-min interview each, Phase 1** | SME interview | W2 | Mario |
| Managers J.T. + M.K. | **Pre-read review of rubric, Phase 2** | Async PDF + 30-min review call | W6 | Mario |
| Managers (all 9 pods) | **Week-2 + Week-6 calibration sessions** | 60-min facilitated sessions, post-cohort-1 launch | W17 + W21 | Mario + A.S. |
| 8 × SDR SMEs | **1 × 30-min interview each, Phase 1** | SME interview | W1–W2 | Mario via A.S. |
| R.K. (CMO) | **No direct contact from training side** | K.M. owns conversation (§8) | n/a | K.M. |

## 5 · Communication risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| K.M. turnover (only 11 months in role) — successor inherits commitment | Low | High | Every phase-gate decision in writing in `decisions-log.md`; successor inherits signed paper trail (per `D-001` consequences + brief §20 risk row 5) |
| A.S. over-allocated to SME wrangling — interview slippage | Medium | Medium | All 10 SME interviews booked end of W1; reschedule slack baked into W2 |
| J.V. dashboard slips past W20 — Phase 5 misses gate | Medium | High | Bi-weekly sync from W12; J.V. signs off L4 measurement plan in Phase 2 (lock the spec early) |
| Manager calibration sessions fail to land in low-cadence pods (UK Pod 4 Belfast, IT Pod Milan) | High (per §9 cadence table) | Medium | A.S. attends both calibrations; rubric translated to ES for cohort 2 (per §10.7) |
| LMS admin discovers SCORM 1.2 incompatibility late | Low | High | SCORM Cloud preview tested each module at end of Phase 3 sprint (per `master-plan.md` §3 gate) |

## 6 · Sign-off chain at each phase gate

```
   Mario drafts artefact set
        │
        ▼
   Critic agent runs against brief + artefact set
        │ PASS
        ▼
   Mario writes phase-summary doc + decisions-log delta
        │
        ▼
   K.M. signs phase gate ──────►  D.R. triggers invoice (25 / 50 / 25)
        │
        ▼
   Next phase opens
```

Per §3 the schedule is: Phase 1 gate = 25 % · Phase 4 gate = 50 % · Phase 6 gate = 25 %.

## References

- Brief §§2, 3, 6, 8, 9, 10.6, 10.7, 16, 20.
- Mendelow, A. L. (1991). "Stakeholder mapping: The power-interest grid." Proceedings of the 2nd International Conference on Information Systems.
- Decisions `D-001`, `D-004`, `D-008`.
