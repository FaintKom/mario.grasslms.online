# Case A · Security Awareness Onboarding · "Phish-or-Pass"

> **One-page engagement brief.** Anonymised composite client. Built as portfolio bookend to the FinTechCard flagship case.

---

## Context

**Client (anonymised):** NorthLine SaaS · Series-A B2B analytics platform · 280 FTE · UK + remote-EU
**Trigger:** Two successful spear-phishing incidents in Q1 2026 (one CFO impersonation, one vendor-invoice swap; combined loss €71K + 4 days incident-response time). Cyber-insurance renewal in Q3 contingent on a documented awareness programme covering 100 % of new hires.
**Existing state:** Generic 25-min "Cybersecurity 101" video on Talent LMS, completion-only, no behavioural assessment. Phishing-simulation click-rate (last KnowBe4 campaign): **18 %**.

## Audience

New hires across all functions (Eng, GTM, Ops, Finance). Week-1, day-1 of onboarding. Cohort size: 8–15 per intake, monthly. No prior security training assumed. English-only v1.

## Business problem

The 25-min video produces 100 % completion and 0 % behaviour change. The two incidents both involved *recently-hired* employees (months 2 and 4 of tenure). The CISO needs a programme whose **completion certificate predicts non-clicking** in the next simulated campaign.

## Goal (action-mapped)

When a new hire receives a suspicious email in their first 90 days, they **report it** (or delete it) instead of opening attachments or clicking links — **without consulting IT first** on obvious cases.

## KPIs

| Level | Metric | Baseline | 90-day target | Source |
|---|---|---|---|---|
| L4 | Successful phishing incidents involving new hires | 2 / quarter | ≤ 1 / year | Security incident log |
| L3 | KnowBe4 simulated-phish click-rate among ≤90-day employees | 18 % | ≤ 5 % | KnowBe4 dashboard |
| L3 | Phish-report-button usage on real suspicious emails | n/a (baseline pending) | ≥ 60 % of suspicious emails reported within 1 h | M365 Defender report-message telemetry |
| L2 | SCORM module score, first attempt | n/a | ≥ 75 % (3/4 emails correctly triaged) | `cmi.core.score.raw` |
| L1 | "I feel confident I can spot a phish at work" | n/a | ≥ 4.0 / 5 | Post-module micro-pulse (Thalheimer-style) |

## Keystone moment (what the SCORM teaches)

**Triaging an inbox under realistic conditions.** The learner sees a simulated 4-message inbox. Each message is presented with full header detail, sender domain, subject, preview, and links. The learner must triage each one as **Report**, **Open**, or **Delete**, and is scored on accuracy + reasoning.

The four messages are deliberately calibrated:

| # | Type | Difficulty | The signal that matters |
|---|---|---|---|
| 1 | **Vendor invoice scam** | Easy | Sender domain `accounts-payable@dropbox-billing.net` (lookalike, not the real Dropbox) |
| 2 | **CFO impersonation / wire fraud** | Hard | Sender display name matches CFO, but address is `cfo@northline-corp.co` (real domain is `northline.io`) + unusual urgency |
| 3 | **IT password-reset legit** | Medium-trick | Looks suspicious (urgency + link) but sender domain, URL, and ticket reference are real — this is the *false positive trap* |
| 4 | **Generic credential-harvest** | Easy | URL hover reveals `bit.ly/x...` masking `o365-secure-login.ru` |

The trick-positive in #3 is the most important pedagogical move: **most awareness training over-tunes learners to report everything**, which floods the IT helpdesk and trains them to ignore the report queue. Teaching when *not* to escalate is the part that gets skipped.

## Why this moment

Action Mapping (Moore): the business pays for the *non-click* on real phishing, not for the *recognition* of a phishing example in a slide deck. A click is a single, observable, reversible-or-not action — so the training must rehearse *the action under realistic stimulus*, not the recognition of features described in prose.

Cognitive Load Theory (Sweller): the inbox UI carries intrinsic load (it looks like a real email client). Extraneous load is stripped — no decorative imagery, no narration. Germane load is the rule-formation: *which signals predict which verdict*. Worked example for message #1 (with reveal), partial fade for #2–3, cold practice for #4.

## Assessment + SCORM scoring

- 4 emails × 25 points = 100 points max.
- Each email: 20 points for correct triage verdict + 5 points for selecting the right *reason* (sender domain / URL mismatch / urgency pattern / legit signal).
- Passing threshold: **75** (3 of 4 correct, plus reasoning on at least 2).
- `cmi.core.lesson_status` → `passed` if score ≥ 75, else `failed`.
- `cmi.suspend_data` stores per-email verdicts for retake analytics.
- Retake allowed; only highest score is recorded.

## Constraints honoured

- **≤10 minutes per attempt.** Average learner completes in 6–8 minutes.
- **No audio.** All instruction via on-screen text + signalling (highlighted phish indicators on reveal).
- **WCAG 2.1 AA.** Full keyboard navigation, ARIA live region for feedback, no colour-only signals (every verdict carries an icon + label).
- **SCORM 1.2.** Pinpoint Sana / Talent LMS / SCORM Cloud / Moodle compatibility.

## Out of scope

- Technical mitigations (DMARC, SPF, MFA enforcement) — owned by Security Engineering.
- Vendor-specific KnowBe4 configuration — Security Awareness Lead owns campaign cadence.
- ES / DE localisation — v2 (post-pilot).
- Manager / executive-tier targeted phishing simulation — separate engagement.

---

*Brief v1.0 · 18 May 2026 · all client names and figures anonymised composite.*
