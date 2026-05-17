# Event-log spec · mini-OS telemetry → SCORM `cmi.suspend_data`

> Canonical field list, types, firing conditions, and LO-mapping for every
> keystone-move telemetry event captured by `js/event-log.js`. Phase 5 analytics
> reads this; Phase 3 module authors emit against it.

## 1 · Persistence model

Every event is appended to an in-memory log inside `EventLog`. On every `record()`
call the most recent **32 events** + the **KPI summary** are flushed to
`cmi.suspend_data` (JSON-stringified). SCORM 1.2 caps `suspend_data` at 4096
chars — the KPI table is the assessment payload, so it's never truncated.

### 1.1 · Persisted blob shape

```jsonc
{
  "version": 1,
  "moduleId": "M1",
  "kpis": {
    "silence_duration_ms": 4200,
    "calendar_open_before_dial": true,
    "restate_word_overlap": 4,
    "salesforce_next_step_booked_set_at": "2026-05-17T13:08:42.000Z",
    "m1_diagnostic_specificity_score": 3,
    "objection_argued_count": 0,
    "reg_question_escalated": false,
    "time_in_module_ms": 412345,
    "worked_example_completed": true,
    "completion_problem_completed": true,
    "solo_problem_completed": true
  },
  "events": [
    {
      "event_name": "silence_observed",
      "module_id": "M1",
      "ts_iso": "2026-05-17T13:04:32.000Z",
      "ts_ms": 142500,
      "payload": { "duration_ms": 4200 }
    }
  ]
}
```

- `ts_iso` is ISO-8601 UTC (`new Date().toISOString()`).
- `ts_ms` is `performance.now()` relative to module start — useful for pacing.

## 2 · Event catalogue

| `event_name`                  | Trigger                                                              | Payload fields                                          | LO evidence       |
|-------------------------------|----------------------------------------------------------------------|---------------------------------------------------------|-------------------|
| `module_started`              | First call to `bootModule()`                                         | `{ title }`                                             | —                 |
| `module_completed`            | `api.complete()` called                                              | `{ score }`                                             | All LOs           |
| `silence_observed`            | Phone-dialler silence ≥ 4 s after a diagnostic                        | `{ duration_ms }`                                       | LO-M1.3           |
| `diagnostic_delivered`        | Rep submits their M1 diagnostic                                       | `{ specificity_score: 0-3, signal_id, word_count }`     | LO-M1.1 · LO-M1.2 |
| `hint_used`                   | Rep clicks the "show me the move" affordance                          | `{ where, hint_id }`                                    | —                 |
| `objection_restated`          | Rep submits a restate that contains ≥ 1 buyer noun                    | `{ word_overlap, family }`                              | LO-M2.1           |
| `objection_argued`            | Rep submits a rebuttal w/o restating first (anti-pattern)             | `{ rebuttal_tokens, family }`                           | LO-M2.1 (negative)|
| `followup_question_asked`     | Rep submits an open follow-up question                                | `{ is_open, family }`                                   | LO-M2.2           |
| `calendar_opened`             | Calendar app mounts                                                   | —                                                       | LO-M3.1           |
| `phone_dial_attempt`          | Rep clicks "Dial" in Outreach                                         | `{ lead_id, archetype, calendar_open_before_dial }`     | LO-M3.1           |
| `slots_stated`                | Rep selects a slot in Calendar                                        | `{ slot_id, slot_day, slot_time }`                      | LO-M3.2           |
| `invite_sent`                 | Rep clicks "Send invite"                                              | `{ invitee_email, slot_ids }`                           | LO-M3.2           |
| `next_step_booked_set`        | Salesforce "Confirm next step" clicked                                | `{ account }`                                           | LO-M3.2           |
| `archetype_picked`            | Rep picks an ICP archetype in M4                                      | `{ archetype, correct }`                                | LO-M4.1           |
| `prop_mapped`                 | Rep maps a pain to a prop in M5                                       | `{ pain_id, prop_id, correct }`                         | LO-M5.1           |
| `reg_question_classified`     | Rep classifies a buyer question as reg vs. distractor                 | `{ is_reg_actual, picked }`                             | LO-M6.1           |
| `reg_row_picked`              | Rep picks a row from the §19 table                                    | `{ row_id, correct }`                                   | LO-M6.1           |
| `reg_question_escalated`      | Rep escalates a reg question via Calendar invite                      | `{ invitee }`                                           | LO-M6.2           |
| `worked_example_completed`    | Rep finishes the worked-example Gagné step                            | —                                                       | pacing            |
| `completion_problem_completed`| Rep finishes the completion problem                                   | —                                                       | pacing            |
| `solo_problem_completed`      | Rep finishes the solo problem                                         | —                                                       | pacing            |
| `stakeholder_switch_handled`  | M5 solo problem completes a stakeholder-switch round (CFO joins and rep redoes M1) | `boolean` — `true` on success                          | LO-PP.3           |
| `m1_repeat_for_new_stakeholder` | M5 solo detects rep re-issued M1 for second-arriving stakeholder    | `{ stakeholder_id, m1_quality_score: 0-3 }`             | LO-PP.3           |

## 3 · KPI summary

The KPI table mirrors the build-brief field list verbatim. Every KPI is one of:
`number | boolean | string | null`. The summary is always preserved across
truncation cycles.

| KPI                                       | Type      | Updated by                                       |
|-------------------------------------------|-----------|--------------------------------------------------|
| `silence_duration_ms`                     | number    | `silence_observed`                               |
| `calendar_open_before_dial`               | boolean   | `phone_dial_attempt`                             |
| `restate_word_overlap`                    | number    | `objection_restated`                             |
| `salesforce_next_step_booked_set_at`      | ISO-8601  | `next_step_booked_set`                           |
| `m1_diagnostic_specificity_score`         | 0-3       | `diagnostic_delivered`                           |
| `objection_argued_count`                  | number    | incremented on every `objection_argued`          |
| `reg_question_escalated`                  | boolean   | `reg_question_escalated`                         |
| `time_in_module_ms`                       | number    | every `record()`                                 |
| `worked_example_completed`                | boolean   | `worked_example_completed`                       |
| `completion_problem_completed`            | boolean   | `completion_problem_completed`                   |
| `solo_problem_completed`                  | boolean   | `solo_problem_completed`                         |

## 4 · How to emit

Two equivalent paths:

### 4.1 · Via the event bus (preferred from inside an app)

```js
eventBus.dispatchEvent(new CustomEvent("telemetry", {
  detail: { event_name: "silence_observed", duration_ms: 4200 },
}));
```

The `EventLog` instance subscribes to `eventBus` and auto-records.

### 4.2 · Direct call (from module code)

```js
const { eventLog } = bootModule({ moduleId: "M1", ... });
eventLog.record("diagnostic_delivered", { specificity_score: 3, word_count: 28 });
```

## 5 · LO → event-name index

| LO       | Primary event(s)                                                  |
|----------|-------------------------------------------------------------------|
| LO-M1.1  | `diagnostic_delivered`                                            |
| LO-M1.2  | `diagnostic_delivered` (specificity_score ≥ 2)                    |
| LO-M1.3  | `silence_observed`                                                |
| LO-M2.1  | `objection_restated` (positive) / `objection_argued` (negative)   |
| LO-M2.2  | `followup_question_asked`                                         |
| LO-M3.1  | `calendar_opened` + `phone_dial_attempt.calendar_open_before_dial`|
| LO-M3.2  | `slots_stated`, `invite_sent`, `next_step_booked_set`             |
| LO-M4.1  | `archetype_picked`                                                |
| LO-M5.1  | `prop_mapped`                                                     |
| LO-M6.1  | `reg_question_classified`, `reg_row_picked`                       |
| LO-M6.2  | `reg_question_escalated`                                          |
| LO-PP.3  | `stakeholder_switch_handled`, `m1_repeat_for_new_stakeholder`, `m1_diagnostic_specificity_score` (re-fired per stakeholder) |

## 6 · Versioning

The persisted blob carries `version: 1`. Bump on **breaking** changes only
(field rename, type change). Additive changes (new event_name) are
forward-compatible — old resumes parse, new fields default to `null`.

## 7 · Downstream consumers

- Phase 4 — `05-evaluate/learning-evaluation-plan.md` runs L2 against the KPI table.
- Phase 5 — `06-iterate/cohort-analytics-spec.md` exports suspend_data → BigQuery.
- Manager review — `cmi.suspend_data` is read back by the Gong app's L3 rubric panel.

---

*Additive update 2026-05-18 per Phase 3 critic Pass 1; no version bump required (no breaking changes to existing event names or schemas). Added: `stakeholder_switch_handled` and `m1_repeat_for_new_stakeholder` (both LO-PP.3, emitted by M5 `module.js`).*
