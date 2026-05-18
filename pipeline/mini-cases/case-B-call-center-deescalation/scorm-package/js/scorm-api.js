/*!
 * Minimal SCORM 1.2 RTE wrapper.
 * Locates the LMS API object by walking the window hierarchy.
 * Degrades gracefully when launched outside an LMS (logs to console).
 * Exposed as window.SCORM.
 */
(function (global) {
  "use strict";

  var api = null;
  var initialized = false;
  var finished = false;

  function findAPI(win) {
    var hops = 0;
    while (win && !win.API && win.parent && win.parent !== win && hops < 7) {
      hops += 1;
      win = win.parent;
    }
    return win && win.API ? win.API : null;
  }

  function locate() {
    var found = findAPI(global);
    if (!found && global.opener) found = findAPI(global.opener);
    return found;
  }

  function log(label, args) {
    try { console.info("[SCORM 1.2] " + label, args || ""); } catch (_) { /* noop */ }
  }

  function init() {
    api = locate();
    if (!api) {
      log("API not found - running standalone (no persistence).");
      return false;
    }
    var ok = api.LMSInitialize("") === "true";
    initialized = ok;
    log("LMSInitialize", ok);
    if (ok) {
      api.LMSSetValue("cmi.core.score.min", "0");
      api.LMSSetValue("cmi.core.score.max", "100");
    }
    return ok;
  }

  function get(key) {
    if (!initialized || !api) return "";
    var v = api.LMSGetValue(key);
    return v == null ? "" : v;
  }

  function set(key, value) {
    if (!initialized || !api) return false;
    var ok = api.LMSSetValue(key, String(value)) === "true";
    if (!ok) log("LMSSetValue failed", { key: key, value: value });
    return ok;
  }

  function commit() {
    if (!initialized || !api) return false;
    var ok = api.LMSCommit("") === "true";
    log("LMSCommit", ok);
    return ok;
  }

  function finish() {
    if (!initialized || !api || finished) return false;
    commit();
    var ok = api.LMSFinish("") === "true";
    finished = ok;
    log("LMSFinish", ok);
    return ok;
  }

  function setScore(raw) {
    set("cmi.core.score.raw", Math.round(raw));
    set("cmi.core.score.min", "0");
    set("cmi.core.score.max", "100");
    commit();
  }

  function setStatus(status) {
    set("cmi.core.lesson_status", status);
    commit();
  }

  function setSuspendData(obj) {
    var s;
    try { s = JSON.stringify(obj); } catch (_) { s = ""; }
    if (s.length > 4000) s = s.slice(0, 4000);
    set("cmi.suspend_data", s);
    commit();
  }

  function getSuspendData() {
    var s = get("cmi.suspend_data");
    if (!s) return null;
    try { return JSON.parse(s); } catch (_) { return null; }
  }

  function isOnline() { return initialized && !!api; }

  global.addEventListener("beforeunload", function () { finish(); });

  global.SCORM = {
    init: init,
    isOnline: isOnline,
    get: get,
    set: set,
    commit: commit,
    finish: finish,
    setScore: setScore,
    setStatus: setStatus,
    setSuspendData: setSuspendData,
    getSuspendData: getSuspendData
  };
})(window);
