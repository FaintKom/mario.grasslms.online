> Why this artefact: Master-plan §4 gate criterion: "LMS admin can execute the deployment runbook without designer assistance." Brief §7 fixes Sana + SCORM 1.2 + SCORM Cloud preview as the toolchain; §16 names the auth path (Okta SSO). Without an executable runbook, the program ships late or with a designer permanently in the loop — both block the Phase 4 50 % payment trigger.

# LMS deployment runbook · Sana · cohort 1

**Named owner:** LMS admin (Sana administrator, as named in brief §2).
**Backup:** Designer (Mario) — on-call for cohort 1 and cohort 2 only. From cohort 3 onward the LMS admin owns it outright.
**Escalation path:** LMS admin → A.S. (Head of SDR Org) → K.M. (Sponsor).

---

## 1 · Prerequisites checklist

Complete all rows below before touching Sana. Tick the box, log the date + initials in the right column.

| # | Prerequisite | How to verify | Sign-off |
|---|---|---|---|
| 1 | Sana admin access for LMS admin | Log in to `sana.fintechcard.internal/admin`; "Admin" badge visible in profile menu | ☐ |
| 2 | Okta SSO group `sdr-cohort-2026-07-W27` created and populated from HRIS hire-cohort field | Okta admin console → Groups → group exists, member count = HRIS new-hire count | ☐ |
| 3 | SCORM Cloud preview account live, designer + LMS admin both have logins | Designer confirms preview upload still works (test: re-upload `module-01` to scratch workspace) | ☐ |
| 4 | All 6 SCORM 1.2 zip packages present in `03-develop/module-XX/dist/` with `imsmanifest.xml` valid | Run `scorm-validator` (Articulate's free tool) against each zip — must return 0 errors | ☐ |
| 5 | Mini-OS `scorm-shell/` static assets uploaded to Sana content CDN OR bundled inside each zip (D-005 design choice: bundled per-module to keep deployments self-contained) | Open each zip; `index.html` references shell assets via relative path | ☐ |
| 6 | Sana cohort group naming convention agreed: `cohort-2026-07-W27` for cohort 1, `cohort-2026-08-W31` for cohort 2, … `cohort-{YYYY}-{MM}-W{ISO week}` | A.S. + LMS admin sign off | ☐ |
| 7 | L1 micro-pulse instrument (3 items, LTEM tier 3 — D-003) provisioned in Sana as a 30-second end-of-module check | Item bank visible in Sana admin → Assessments → "L1-cohort-2026-07-W27" | ☐ |
| 8 | +7-day spaced-retrieval mini-quiz configured per module in Sana scheduler (Roediger/Karpicke; brief §5 L2 target) | Sana admin → Schedules → 6 entries, each "trigger = module completion + 168h" | ☐ |
| 9 | Gong `Call_Review__c` Salesforce object writable by manager-rubric flow | J.V. (RevOps) signs off; test write with dummy record | ☐ |
| 10 | `#sdr-cohort-2026-07-W27` Slack channel created, A.S. + 9 pod managers + designer + LMS admin invited | Channel exists; topic = "Cohort 1 live 1 July 2026 · runbook owner: LMS admin" | ☐ |

If any row is unchecked at Day -7, escalate to A.S. and pause the launch decision.

---

## 2 · Per-module upload procedure

Repeat steps 2.1 – 2.6 for each of `module-01` through `module-06`. Estimate: 15 min per module, 90 min total.

### 2.1 · Pull the build artefact

The designer publishes each module to:

```
03-develop/module-XX/dist/module-XX-v{N}.zip
```

where `{N}` is the semantic version (cohort 1 ships at `v1.0.0`). Filename example: `module-01-v1.0.0.zip`.

### 2.2 · Validate the SCORM manifest before upload

Run the SCORM 1.2 validator against the zip. Expected output:

- `imsmanifest.xml` parses without schema errors.
- Exactly one `<organization>` element with `<item>` children for each launchable resource.
- `adlcp:masteryscore` is **omitted** — completion is tracked via `cmi.core.lesson_status = "completed"`, scored items use `cmi.core.score.raw` against the in-module mastery threshold (≥80 %, brief §5 L2 target).
- All resource `href` values resolve to a file inside the zip.

If validation fails, send the validator log to the designer; do **not** upload a failing zip.

### 2.3 · Upload to SCORM Cloud preview first

Always preview before promoting to Sana. SCORM Cloud preview catches manifest-vs-Sana drift that the validator misses.

1. SCORM Cloud → "Library" → "Add Content" → upload zip.
2. Click "Launch" → confirm:
   - Mini-OS shell loads (window manager visible, taskbar at bottom).
   - All simulated apps openable (Outreach, Gong, Salesforce, LinkedIn / Companies House, Calendar, Phone-dialler, Slack).
   - Worked example → completion problem → solo problem sequence runs end-to-end (Renkl/Atkinson fading sequence per D-002).
   - `cmi.core.lesson_status` transitions to `completed` on the final screen.
   - `cmi.core.score.raw` populates with the in-module mastery score.
   - Time-to-complete in preview ≤10 min (brief §7 hard constraint; if over, halt and notify designer).
3. Check SCORM Cloud activity log for any runtime errors. Zero tolerance — fix before promoting.

### 2.4 · Upload to Sana

1. Sana admin → Content library → "New module" → upload zip.
2. Metadata fields:
   - **Title:** `SDR Onboarding · Module {N} · {move name}` (e.g. "Module 1 · Diagnostic Opener").
   - **Course:** `SDR Onboarding v1`.
   - **Language:** `en-GB` (EN-only at v1; ES + DE post-pilot per brief §3).
   - **Estimated time:** `10 min`.
   - **Tags:** `cohort-2026-07-W27`, `move-M1` / `move-M2` / `move-M3` (as applicable), `v1.0.0`.
3. Completion-tracking config:
   - **Pass condition:** `cmi.core.lesson_status = "completed"` AND `cmi.core.score.raw >= 80`.
   - **Re-attempt:** unlimited (first-attempt mastery is the L2 metric — Sana logs the first-attempt score in `attempt_1_score` field; subsequent attempts logged separately and reported but not used for the L2 number).
   - **Time-out:** 25 min idle → auto-suspend (resume state preserved).
4. Schedule the +7-day retrieval mini-quiz against this module (link to step 8 of §1).

### 2.5 · Smoke test the module on Sana (not SCORM Cloud)

Sana's runtime differs from SCORM Cloud in subtle ways (especially around `cmi.suspend_data` size). One designated SME runs the full module end-to-end on Sana before cohort launch.

**SME runner:** O.B. (UK Pod 1, Manchester · mid-band rep, 5 months tenure — interview §10.3). Reason: O.B. is close enough to a brand-new rep to surface confusion, but experienced enough to articulate what broke.

Smoke-test pass criteria (all six modules):

- [ ] Module loads under SSO without re-authentication.
- [ ] Mini-OS workspace renders correctly on a 1366×768 laptop (the floor-spec hardware for new hires).
- [ ] Keyboard-only navigation works (WCAG 2.1 AA — Tab order through all interactive elements, no keyboard traps).
- [ ] Module completes within 10 min by a representative learner.
- [ ] Score persists and surfaces in O.B.'s Sana transcript.
- [ ] +7-day mini-quiz appears in O.B.'s Sana queue 168 h later (verify via accelerated scheduler in admin).

Log smoke-test results in `00-project-management/critic-log.md` under "Phase 4 smoke-test".

### 2.6 · Promote and lock

Once smoke-test passes, set module status to `Published` and lock the version. Any future change requires a new version (`v1.0.1`, `v1.1.0`, etc.).

---

## 3 · Cohort enrollment via Sana API

### 3.1 · Source of truth for enrollment list

| Source | Field | Used for |
|---|---|---|
| HRIS (BambooHR-equivalent) | `hire_cohort = "2026-07-W27"` | Identify new hires in cohort 1 |
| HRIS | `pod` (e.g. `UK-Manchester`) | Set `Pod__c` in Salesforce for L3/L4 rollup |
| Okta | Group `sdr-cohort-2026-07-W27` | Identity bridge between HRIS and Sana |

### 3.2 · Enrollment API call

Sana exposes a REST endpoint for batch enrollment. Pseudocode for the LMS admin to adapt:

```http
POST /api/v1/cohorts/{cohort_id}/enrollments
Authorization: Bearer {sana_admin_token}
Content-Type: application/json

{
  "course_id": "sdr-onboarding-v1",
  "okta_group": "sdr-cohort-2026-07-W27",
  "auto_unlock_module_1_at": "2026-07-01T09:00:00Z",
  "module_unlock_schedule": [
    { "module_id": "module-01", "offset_days": 0 },
    { "module_id": "module-02", "offset_days": 7 },
    { "module_id": "module-03", "offset_days": 14 },
    { "module_id": "module-04", "offset_days": 21 },
    { "module_id": "module-05", "offset_days": 28 },
    { "module_id": "module-06", "offset_days": 35 }
  ]
}
```

**Expected response:** 201 with an array of `enrollment_id`s, count matching the Okta group size. If counts mismatch, the HRIS hire-cohort field is the source of truth — fix HRIS first, re-sync Okta, retry.

### 3.3 · Confirm enrollments visible to reps

Send a Sana test invitation to one designated rep (request A.S. nominates). Verify:

- Email arrives within 10 min.
- SSO login works without password prompt.
- Module 1 visible in their queue, locked until `auto_unlock_module_1_at`.
- Module 2 visible but greyed out with "unlocks 8 July".

---

## 4 · Smoke test checklist (consolidated)

Day -1 smoke test, run by O.B. as designated SME runner. All boxes must check before Day 0 launch:

- [ ] All 6 modules upload to Sana without manifest errors.
- [ ] All 6 modules pass SCORM Cloud preview end-to-end.
- [ ] All 6 modules pass Sana smoke test end-to-end.
- [ ] WCAG 2.1 AA keyboard-only navigation works on all 6 modules.
- [ ] +7-day mini-quiz scheduler verified for all 6 modules (accelerated test).
- [ ] Cohort enrollment list matches HRIS hire-cohort field exactly.
- [ ] One designated rep can launch Module 1 in their actual Sana account.
- [ ] L1 micro-pulse fires at end of Module 1 (≤30 s, LTEM tier 3 — D-003).
- [ ] Slack channel `#sdr-cohort-2026-07-W27` topic set and pinned message includes runbook link.

---

## 5 · Rollback procedure

Used when a module shows a post-launch regression (e.g. a bug surfaces after 3 reps complete it, or the L2 first-attempt mastery rate drops below 60 % in early data).

### 5.1 · Triage decision tree

| Symptom | First-cohort impact | Action |
|---|---|---|
| Module fails to load for any rep | Blocking | **Immediate rollback** — see §5.2 |
| Module loads but completion not tracking | Blocking (L2 data lost) | **Immediate rollback** — see §5.2 |
| L1 micro-pulse averages <3.0 / 5 across first 5 reps | Soft signal | Hold module open; Phase 6 iteration sprint reviews |
| L2 first-attempt mastery <60 % across first 5 reps | Hard signal — module is wrong, not the learners | Rollback to `v-1` after discussion with A.S. + designer |
| Accessibility regression flagged by a rep | Blocking | Immediate rollback if it blocks the rep; otherwise patch within 48 h |

### 5.2 · How to roll back

1. Sana admin → Content library → locate module → "Version history".
2. Mark current version as `Deprecated`.
3. If a prior `v-1` exists, set it to `Published` and re-attach to the cohort schedule.
4. **If no `v-1` exists (i.e. this is the first published version, which is true for all 6 modules at cohort 1 launch):** unschedule the module from the cohort, post in `#sdr-cohort-2026-07-W27` with the rollback note + ETA, and engage the designer for a hot-fix.
5. Log rollback in `00-project-management/critic-log.md` under "Phase 4 rollbacks". Required fields: timestamp, module, symptom, rollback action, ETA for re-publish.
6. Notify K.M. + A.S. in Slack DM with the same fields.

### 5.3 · Rollback never triggers a cohort pause

Cohort 1 keeps moving even if one module is rolled back. Reason: the modules are sequenced as 4C/ID task classes of increasing complexity but each is independently completable (D-002). Missing one module shifts the rep's whole-task practice but does not block subsequent modules. The Phase 6 iteration plan covers the catch-up loop for affected reps.

---

## 6 · Designer hand-off after cohort 2

From cohort 3 (target launch: late August 2026) onward, the LMS admin owns this runbook independently. Hand-off triggers:

- [ ] LMS admin has executed the runbook for cohorts 1 + 2 with the designer in observer-only mode.
- [ ] LMS admin has run one rollback drill (simulated; designer plants a broken module in SCORM Cloud).
- [ ] LMS admin has resolved one real issue in cohort 1 or 2 without designer intervention.
- [ ] Hand-off log signed in `06-iterate/handoff-pack.md` (Phase 6 artefact).

After hand-off, the designer is reachable via the engagement Slack channel for v2 content questions only, not for runbook execution.

---

### References

- Brief: §2 (LMS admin role), §3 (1 July hard date), §5 (L2 first-attempt mastery 80 %, +7-day retention 70 %), §7 (Sana, SCORM 1.2, WCAG 2.1 AA), §16 (Okta SSO, SCORM Cloud preview).
- Frameworks: SCORM 1.2 runtime spec (`cmi.core.*`) · WCAG 2.1 AA · Spaced retrieval (Roediger & Karpicke 2006) · Renkl/Atkinson fading sequence.
- Internal: `00-project-management/master-plan.md` §4 gate criteria · `00-project-management/decisions-log.md` D-002 (4C/ID independent task classes), D-003 (LTEM tier-3 L1), D-005 (custom SCORM not Articulate), D-007 (mini-OS shell) · `03-develop/scorm-shell/a11y-audit.md` · `05-evaluate/l1-pulse-survey.md`, `05-evaluate/l2-quiz-blueprint.md` (Phase 5 dependencies).
