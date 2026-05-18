# Portfolio Mini-Cases · 3 SCORM Builds

Three short L&D engagements built as **portfolio bookends** to the FinTechCard flagship case. Each one targets a different L&D vertical, a different audience, a different keystone moment — and ships as a working **SCORM 1.2 package** ready for upload to any compliant LMS (tested on SCORM Cloud).

The flagship case (`../`) shows depth: one engagement, six ADDIE phases, sixteen frameworks, six SCORMs. These three cases show **range**: how the same instructional-design discipline scales down to a tight, single-keystone deliverable.

---

## The three cases

| # | Vertical | Title | Keystone moment | Extras |
|---|---|---|---|---|
| **A** | Compliance / Security awareness onboarding | [Phish-or-Pass · day-1 inbox triage](case-A-security-onboarding/) | Recognising 3 phishing patterns under time pressure inside a simulated inbox | — |
| **B** | Customer-facing soft skills | [First-30-Seconds · call-centre de-escalation](case-B-call-center-deescalation/) | Choosing the LAER-aligned reply at 4 branching points of an angry-customer call | [Visual storyboard](case-B-call-center-deescalation/storyboard.html) (SVG node-diagram + 6 wireframes + script-overlay) |
| **C** | New-tool rollout / process change | [Route-the-PO · ERP procurement go-live](case-C-erp-procurement-rollout/) | Picking the correct approval routing for 3 purchase orders against business rules | — |

Each case ships with:

```
case-X-…/
├── case-brief.md           One-page brief: context · audience · KPIs · keystone · scoring
└── scorm-package/          Working SCORM 1.2 package (open index.html locally OR upload .zip to LMS)
    ├── imsmanifest.xml     SCORM 1.2 schema-conformant manifest
    ├── index.html          The course entry point
    ├── js/
    │   ├── scorm-api.js    SCORM 1.2 RTE wrapper (LMSInitialize / LMSSetValue / LMSCommit / LMSFinish)
    │   └── app.js          Course logic + scoring
    └── css/styles.css      WCAG 2.1 AA-aware styling
```

The `.zip` next to each `scorm-package/` is the LMS-uploadable artefact.

---

## Why these three

These three verticals account for the vast majority of corporate L&D demand in mid-market and enterprise (Brandon Hall 2024 · LinkedIn Workplace Learning 2025):

1. **Compliance / security awareness** — every company over ~100 FTE runs it; phishing is the #1 incident vector.
2. **Customer-service soft skills** — front-line revenue impact; CSAT and AHT live on the same dashboard.
3. **New-tool / process rollout** — every ERP / CRM / AI rollout fails the same way: people learn the UI but not the rules.

Each case attacks the **failure mode** of typical training in that vertical — not the topic itself.

| Case | Typical training fails because… | This build's counter-move |
|---|---|---|
| A | "Watch this 20-min video, click Next." Knowledge ≠ behaviour. | Realistic inbox simulator; user must *act*, not *recognise*. |
| B | Scripts memorised then forgotten under pressure. | Branching where every wrong choice escalates the customer audibly in the transcript. |
| C | UI-tour training; UI changes 4 months later, behaviour resets. | Teach the *routing rules* (always true) using the UI as a vehicle. |

---

## Frameworks applied (compact)

Every case uses the same compact subset of the flagship's 16:

- **Action Mapping** (Cathy Moore) — keystone = the one observable behaviour the business pays for
- **ABCD outcomes + Bloom Apply-level** — outcomes are observable, not "understand"
- **Cognitive Load Theory + Mayer multimedia** — ≤10-min budget, signalling over narration (no audio)
- **Worked-example → completion → problem-solving fading** — each case starts with a modelled example, ends with cold practice
- **Kirkpatrick L1–L3** — L2 = SCORM score on first attempt, L3 = on-the-job indicator listed in the brief
- **WCAG 2.1 AA** — keyboard-navigable, ARIA live regions for feedback, no audio dependence

---

## How to test locally

Each `scorm-package/index.html` runs standalone in a browser — the SCORM wrapper degrades gracefully when no LMS API is present (logs to console, scores still compute, completion is in-memory only).

To test the full SCORM cycle:
1. Zip the contents of `scorm-package/` (not the folder itself — the manifest at the zip root).
2. Upload to [SCORM Cloud](https://cloud.scorm.com) — free dispatch account works.
3. Launch; complete; check the runtime report — `cmi.core.lesson_status` should flip to `passed` or `failed`, `cmi.core.score.raw` should match the in-course total.

The pre-built `.zip` artefacts are committed next to each `scorm-package/` for convenience.

---

*Built May 2026 by Mario Becerra as portfolio bookends to the FinTechCard SDR Onboarding case study.*
