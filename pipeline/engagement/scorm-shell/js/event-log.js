/**
 * event-log.js · keystone-move telemetry pipeline.
 *
 * Captures the events listed in 02-design/module-storyboards/* and persists
 * them to cmi.suspend_data via the ScormBridge.
 *
 * Consumers:
 *  - js/shell.js (instantiates one EventLog per module run inside bootModule)
 *  - js/apps/*.js (emit via eventBus.dispatchEvent(new CustomEvent('telemetry', { detail })))
 *  - any module code can call eventLog.record(name, payload) directly
 *
 * Side-effects:
 *  - Subscribes to `eventBus`'s 'telemetry' event.
 *  - Persists to cmi.suspend_data on every record() + at scorm.commit() cadence.
 *
 * @see ./event-log-spec.md  (canonical field list + LO mapping)
 */

/**
 * Stable keystone-move event names. Strings, not enums, so old suspend_data
 * resumes still parse if names are ever added to.
 * @readonly
 */
export const EVENT = Object.freeze({
  // M1 — diagnostic opener
  SILENCE_OBSERVED:              "silence_observed",
  DIAGNOSTIC_DELIVERED:          "diagnostic_delivered",
  HINT_USED:                     "hint_used",
  // M2 — objection acknowledge
  OBJECTION_RESTATED:            "objection_restated",
  OBJECTION_ARGUED:              "objection_argued",          // anti-pattern
  FOLLOWUP_QUESTION_ASKED:       "followup_question_asked",
  // M3 — calendar close
  CALENDAR_OPENED:               "calendar_opened",
  PHONE_DIAL_ATTEMPT:            "phone_dial_attempt",        // payload.calendar_open_before_dial
  SLOTS_STATED:                  "slots_stated",
  INVITE_SENT:                   "invite_sent",
  NEXT_STEP_BOOKED_SET:          "next_step_booked_set",
  // M4 — ICP fit
  ARCHETYPE_PICKED:              "archetype_picked",
  // M5 — prop mapping
  PROP_MAPPED:                   "prop_mapped",
  // M6 — regulatory deflection
  REG_QUESTION_CLASSIFIED:       "reg_question_classified",
  REG_ROW_PICKED:                "reg_row_picked",
  REG_QUESTION_ESCALATED:        "reg_question_escalated",
  // Pacing / completeness
  WORKED_EXAMPLE_COMPLETED:      "worked_example_completed",
  COMPLETION_PROBLEM_COMPLETED:  "completion_problem_completed",
  SOLO_PROBLEM_COMPLETED:        "solo_problem_completed",
  MODULE_STARTED:                "module_started",
  MODULE_COMPLETED:              "module_completed",
});

/**
 * @typedef {object} LoggedEvent
 * @property {string} event_name
 * @property {string} module_id
 * @property {string} ts_iso     ISO-8601 UTC
 * @property {number} ts_ms      performance.now() — relative to module start
 * @property {Record<string, unknown>} payload
 */

export class EventLog {
  /**
   * @param {object} opts
   * @param {string} opts.moduleId   e.g. "M1"
   * @param {EventTarget} opts.eventBus
   * @param {import('./scorm-bridge.js').ScormBridge} opts.scorm
   */
  constructor({ moduleId, eventBus, scorm }) {
    /** @type {string} */
    this.moduleId = moduleId;
    /** @type {EventTarget} */
    this.eventBus = eventBus;
    /** @type {import('./scorm-bridge.js').ScormBridge} */
    this.scorm = scorm;
    /** @type {LoggedEvent[]} */
    this.events = [];
    /** @type {Record<string, unknown>} */
    this.kpis = {
      silence_duration_ms: null,
      calendar_open_before_dial: null,
      restate_word_overlap: null,
      salesforce_next_step_booked_set_at: null,
      m1_diagnostic_specificity_score: null,
      objection_argued_count: 0,
      reg_question_escalated: null,
      time_in_module_ms: 0,
      worked_example_completed: false,
      completion_problem_completed: false,
      solo_problem_completed: false,
    };
    /** @type {number} */
    this._startedAt = performance.now();

    // Restore any prior suspend_data so module resumes don't lose KPIs.
    const prior = this.scorm.getSuspendData?.();
    if (prior && prior.moduleId === moduleId) {
      this.events = Array.isArray(prior.events) ? prior.events.map(expandEvent).filter(Boolean) : [];
      this.kpis = { ...this.kpis, ...(prior.kpis ?? {}) };
    }

    // Subscribe to the bus so apps don't need a reference to this instance.
    this._onTelemetry = (/** @type {CustomEvent} */ ev) => {
      const detail = ev.detail ?? {};
      const { event_name, ...payload } = detail;
      if (!event_name) return;
      this.record(event_name, payload);
    };
    this.eventBus.addEventListener("telemetry", this._onTelemetry);
  }

  /**
   * Record a telemetry event. Updates `kpis` for known names + appends to log.
   * @param {string} eventName  one of EVENT.* (or a custom string)
   * @param {Record<string, unknown>} [payload]
   * @returns {LoggedEvent}
   */
  record(eventName, payload = {}) {
    const ev = {
      event_name: eventName,
      module_id: this.moduleId,
      ts_iso: new Date().toISOString(),
      ts_ms: Math.round(performance.now() - this._startedAt),
      payload,
    };
    this.events.push(ev);
    this._updateKpis(ev);
    this.kpis.time_in_module_ms = ev.ts_ms;
    this._persist();
    return ev;
  }

  /**
   * Promote payload fields into the KPI summary table where appropriate.
   * @param {LoggedEvent} ev
   * @private
   */
  _updateKpis(ev) {
    const p = ev.payload ?? {};
    switch (ev.event_name) {
      case EVENT.SILENCE_OBSERVED:
        if (typeof p.duration_ms === "number") this.kpis.silence_duration_ms = p.duration_ms;
        break;
      case EVENT.PHONE_DIAL_ATTEMPT:
        if (typeof p.calendar_open_before_dial === "boolean") {
          this.kpis.calendar_open_before_dial = p.calendar_open_before_dial;
        }
        break;
      case EVENT.OBJECTION_RESTATED:
        if (typeof p.word_overlap === "number") this.kpis.restate_word_overlap = p.word_overlap;
        break;
      case EVENT.OBJECTION_ARGUED:
        this.kpis.objection_argued_count = (this.kpis.objection_argued_count ?? 0) + 1;
        break;
      case EVENT.NEXT_STEP_BOOKED_SET:
        this.kpis.salesforce_next_step_booked_set_at = ev.ts_iso;
        break;
      case EVENT.DIAGNOSTIC_DELIVERED:
        if (typeof p.specificity_score === "number") {
          this.kpis.m1_diagnostic_specificity_score = p.specificity_score;
        }
        break;
      case EVENT.REG_QUESTION_ESCALATED:
        this.kpis.reg_question_escalated = true;
        break;
      case EVENT.WORKED_EXAMPLE_COMPLETED:
        this.kpis.worked_example_completed = true;
        break;
      case EVENT.COMPLETION_PROBLEM_COMPLETED:
        this.kpis.completion_problem_completed = true;
        break;
      case EVENT.SOLO_PROBLEM_COMPLETED:
        this.kpis.solo_problem_completed = true;
        break;
      default: /* no KPI mapping */
    }
  }

  /**
   * Flush the KPI summary + a compact tail of the log to cmi.suspend_data.
   * SCORM 1.2 caps suspend_data at 4096 chars, so each event is stored as
   * [name, ts_ms, {up to 4 short fields}] and the oldest events are dropped
   * until the blob fits under SUSPEND_BUDGET. The KPI table always stays
   * (it's the assessment payload); the full log lives in memory (snapshot()).
   * @private
   */
  _persist() {
    const kpis = Object.fromEntries(Object.entries(this.kpis).filter(([, v]) => v !== null && v !== false && v !== 0));
    let tail = this.events.slice(-MAX_PERSISTED_EVENTS).map(compactEvent);
    let json = "";
    for (;;) {
      json = JSON.stringify({ version: 2, moduleId: this.moduleId, kpis, events: tail });
      if (json.length <= SUSPEND_BUDGET || tail.length === 0) break;
      tail = tail.slice(1);
    }
    this.scorm.setSuspendData?.(JSON.parse(json));
  }

  /**
   * Compute a snapshot for analytics export. Not persisted itself.
   * @returns {{ moduleId: string, kpis: Record<string, unknown>, events: LoggedEvent[] }}
   */
  snapshot() {
    return {
      moduleId: this.moduleId,
      kpis: { ...this.kpis },
      events: [...this.events],
    };
  }

  /**
   * Detach the bus listener. Called by bootModule on completion.
   */
  destroy() {
    this.eventBus.removeEventListener("telemetry", this._onTelemetry);
  }
}

/** suspend_data budget: SCORM 1.2 allows 4096 chars; keep headroom for the LMS. */
const SUSPEND_BUDGET = 3600;
const MAX_PERSISTED_EVENTS = 24;

/** [name, ts_ms, {≤4 primitive fields, strings ≤ 40 chars}] */
function compactEvent(ev) {
  const small = {};
  for (const [k, v] of Object.entries(ev.payload ?? {})) {
    if (Object.keys(small).length >= 4) break;
    if (typeof v === "number" || typeof v === "boolean") small[k] = v;
    else if (typeof v === "string") small[k] = v.slice(0, 40);
  }
  return Object.keys(small).length ? [ev.event_name, ev.ts_ms, small] : [ev.event_name, ev.ts_ms];
}

/** Accepts the compact form (v2) and the old object form (v1). */
function expandEvent(e) {
  if (Array.isArray(e)) return { event_name: e[0], module_id: null, ts_iso: null, ts_ms: e[1] ?? 0, payload: e[2] ?? {} };
  return e && typeof e === "object" ? e : null;
}

export default EventLog;
