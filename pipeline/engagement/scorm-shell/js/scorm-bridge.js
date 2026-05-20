/**
 * scorm-bridge.js · SCORM 1.2 API wrapper.
 *
 * Spec: ADL SCORM 1.2 Run-Time Environment.
 * Locates window.parent(.parent…).API; falls back to an in-memory mock for
 * local-preview and SCORM Cloud "no LMS" workflows.
 *
 * Consumers:
 *  - js/shell.js          (re-exports as `scorm`)
 *  - js/event-log.js      (writes telemetry into cmi.suspend_data)
 *  - module entry points  (via shell.js → bootModule(config))
 *
 * Side-effects:
 *  - Calls API.LMSInitialize on construction (LMS mode) or constructs a mock.
 *  - Auto-commits every 30s and on pagehide.
 *  - Logs every call to console.debug iff URL contains ?debug=1.
 */

/** @typedef {"passed"|"completed"|"failed"|"incomplete"|"browsed"|"not attempted"} ScormStatus */

const DEBUG = new URLSearchParams(globalThis.location?.search ?? "").has("debug");
const AUTO_COMMIT_MS = 30_000;

/** @returns {void} */
function dbg(...args) {
  if (DEBUG) console.debug("[scorm]", ...args);
}

/**
 * In-memory SCORM 1.2 mock — used when no parent API is found.
 * Implements the eight required methods so the rest of the bridge is uniform.
 */
class MockScormApi {
  constructor() {
    /** @type {Record<string,string>} */
    this.cmi = {
      "cmi.core.lesson_status": "not attempted",
      "cmi.core.lesson_location": "",
      "cmi.core.score.raw": "",
      "cmi.core.score.min": "0",
      "cmi.core.score.max": "100",
      "cmi.core.student_id": "preview-learner",
      "cmi.core.student_name": "Preview, Learner",
      "cmi.suspend_data": "",
    };
    this._initialized = false;
    this._error = "0";
  }
  LMSInitialize(/* "" */) { this._initialized = true; return "true"; }
  LMSFinish(/* "" */)     { this._initialized = false; return "true"; }
  LMSGetValue(key)        { return this.cmi[key] ?? ""; }
  LMSSetValue(key, val)   { this.cmi[key] = String(val); return "true"; }
  LMSCommit(/* "" */)     { return "true"; }
  LMSGetLastError()       { return this._error; }
  LMSGetErrorString()     { return ""; }
  LMSGetDiagnostic()      { return ""; }
}

/**
 * Walks up the window-parent chain to find an LMS-provided API object
 * (SCORM 1.2 spec — searches parent then opener, up to 10 levels).
 * @returns {object|null}
 */
function findApi() {
  /** @param {any} win */
  function search(win, depth) {
    if (!win || depth > 10) return null;
    if (win.API) return win.API;
    if (win.parent && win.parent !== win) return search(win.parent, depth + 1);
    return null;
  }
  try {
    const fromParent = search(globalThis.window?.parent, 0);
    if (fromParent) return fromParent;
    const fromOpener = search(globalThis.window?.opener, 0);
    if (fromOpener) return fromOpener;
  } catch (_) { /* cross-origin parent — fall through to mock */ }
  return null;
}

export class ScormBridge {
  constructor() {
    const api = findApi();
    /** @type {boolean} */
    this.isLmsHosted = Boolean(api);
    /** @type {object} */
    this.api = api ?? new MockScormApi();
    /** @type {boolean} */
    this._initialized = false;
    /** @type {ReturnType<typeof setInterval>|null} */
    this._commitTimer = null;
    dbg("ScormBridge constructed", { isLmsHosted: this.isLmsHosted });
  }

  /**
   * Initialize the LMS session. Safe to call once per module load.
   * @returns {boolean}
   */
  initialize() {
    if (this._initialized) return true;
    const ok = this.api.LMSInitialize("") === "true";
    this._initialized = ok;
    dbg("initialize", ok);
    if (ok) {
      if (this.getValue("cmi.core.lesson_status") === "not attempted") {
        this.setValue("cmi.core.lesson_status", "incomplete");
      }
      this._startAutoCommit();
      globalThis.addEventListener?.("pagehide", () => this.terminate(), { once: true });
    }
    return ok;
  }

  /**
   * Persist + close the LMS session. Idempotent.
   * @returns {boolean}
   */
  terminate() {
    if (!this._initialized) return true;
    this.commit();
    const ok = this.api.LMSFinish("") === "true";
    this._initialized = false;
    if (this._commitTimer) clearInterval(this._commitTimer);
    this._commitTimer = null;
    dbg("terminate", ok);
    return ok;
  }

  /**
   * Read a cmi.* key.
   * @param {string} key
   * @returns {string}
   */
  getValue(key) {
    const v = this.api.LMSGetValue(key);
    dbg("getValue", key, "→", v);
    return v;
  }

  /**
   * Write a cmi.* key. Coerces value to string per SCORM 1.2.
   * @param {string} key
   * @param {string|number|boolean} value
   * @returns {boolean}
   */
  setValue(key, value) {
    const ok = this.api.LMSSetValue(key, String(value)) === "true";
    dbg("setValue", key, value, "→", ok);
    return ok;
  }

  /**
   * Persist all pending writes to the LMS.
   * @returns {boolean}
   */
  commit() {
    const ok = this.api.LMSCommit("") === "true";
    dbg("commit", ok);
    return ok;
  }

  /**
   * Convenience: write score with raw/min/max in one call.
   * @param {number} raw
   * @param {number} [min=0]
   * @param {number} [max=100]
   */
  setScore(raw, min = 0, max = 100) {
    this.setValue("cmi.core.score.raw", raw);
    this.setValue("cmi.core.score.min", min);
    this.setValue("cmi.core.score.max", max);
  }

  /**
   * @param {ScormStatus} status
   */
  setStatus(status) {
    this.setValue("cmi.core.lesson_status", status);
  }

  /**
   * Persist an arbitrary object to cmi.suspend_data (JSON-stringified).
   * SCORM 1.2 caps suspend_data at 4096 chars — truncation warning logged.
   * @param {object} obj
   * @returns {boolean}
   */
  setSuspendData(obj) {
    const json = JSON.stringify(obj);
    if (json.length > 4096) {
      console.warn("[scorm] suspend_data exceeds 4096 chars — LMS may truncate", json.length);
    }
    return this.setValue("cmi.suspend_data", json);
  }

  /**
   * @returns {object|null}
   */
  getSuspendData() {
    const raw = this.getValue("cmi.suspend_data");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.warn("[scorm] suspend_data corrupt — returning null", e);
      return null;
    }
  }

  /** @private */
  _startAutoCommit() {
    if (this._commitTimer) return;
    this._commitTimer = setInterval(() => this.commit(), AUTO_COMMIT_MS);
  }
}

export default ScormBridge;
