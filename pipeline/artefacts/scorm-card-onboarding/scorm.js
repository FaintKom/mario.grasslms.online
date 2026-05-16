/* ============================================================
 * SCORM 1.2 wrapper — minimal but production-grade
 * Falls back to standalone mode (localStorage) if no LMS API.
 * Author: Mario Becerra
 * ============================================================ */

(function (root) {
  'use strict';

  var SCORM = {
    api: null,
    mode: 'standalone',
    initialized: false,
    debug: false,
    storageKey: 'scorm_fallback_v1',
    interactionIndex: 0,    // monotonic counter for cmi.interactions.{N}

    findAPI: function (win) {
      var depth = 0;
      while (win && !win.API && win.parent && win.parent !== win && depth < 12) {
        win = win.parent;
        depth++;
      }
      if (win && win.API) return win.API;
      if (window.opener && window.opener.API) return window.opener.API;
      return null;
    },

    log: function () {
      if (!this.debug) return;
      console.log.apply(console, ['[SCORM]'].concat([].slice.call(arguments)));
    },

    init: function (opts) {
      opts = opts || {};
      this.debug = !!opts.debug;

      this.api = this.findAPI(window);
      if (this.api && typeof this.api.LMSInitialize === 'function') {
        var ok = this.api.LMSInitialize('') === 'true';
        if (ok) {
          this.mode = 'scorm12';
          this.initialized = true;
          this.interactionIndex = 0;
          this.log('Initialized in SCORM 1.2 mode');
          this.api.LMSSetValue('cmi.core.lesson_status', 'incomplete');
          this.commit();
          return true;
        }
      }
      this.mode = 'standalone';
      this.initialized = true;
      this.interactionIndex = 0;
      this.log('No LMS API — standalone fallback mode');
      return true;
    },

    finish: function () {
      if (!this.initialized) return false;
      if (this.mode === 'scorm12' && this.api) {
        this.commit();
        var ok = this.api.LMSFinish('') === 'true';
        this.initialized = false;
        return ok;
      }
      this.initialized = false;
      return true;
    },

    commit: function () {
      if (this.mode === 'scorm12' && this.api && typeof this.api.LMSCommit === 'function') {
        return this.api.LMSCommit('') === 'true';
      }
      return true;
    },

    set: function (key, value) {
      if (!this.initialized) return false;
      if (this.mode === 'scorm12' && this.api) {
        var r = this.api.LMSSetValue(key, String(value));
        this.log('set', key, '=', value, '->', r);
        return r === 'true';
      }
      try {
        var raw = root.localStorage.getItem(this.storageKey);
        var bag = raw ? JSON.parse(raw) : {};
        bag[key] = value;
        root.localStorage.setItem(this.storageKey, JSON.stringify(bag));
      } catch (e) { /* localStorage might be disabled */ }
      return true;
    },

    get: function (key) {
      if (!this.initialized) return '';
      if (this.mode === 'scorm12' && this.api) {
        return this.api.LMSGetValue(key) || '';
      }
      try {
        var raw = root.localStorage.getItem(this.storageKey);
        var bag = raw ? JSON.parse(raw) : {};
        return bag[key] || '';
      } catch (e) { return ''; }
    },

    getStudentName: function () {
      return this.get('cmi.core.student_name') || 'Learner';
    },

    setStatus: function (status) {
      this.set('cmi.core.lesson_status', status);
      this.commit();
    },

    setScore: function (score, min, max) {
      this.set('cmi.core.score.raw', score);
      this.set('cmi.core.score.min', min == null ? 0 : min);
      this.set('cmi.core.score.max', max == null ? 100 : max);
      this.commit();
    },

    setProgress: function (suspendData) {
      var s = typeof suspendData === 'string' ? suspendData : JSON.stringify(suspendData);
      if (s.length > 4000) s = s.slice(0, 4000);
      this.set('cmi.suspend_data', s);
    },

    getProgress: function () {
      var s = this.get('cmi.suspend_data');
      if (!s) return null;
      try { return JSON.parse(s); } catch (e) { return s; }
    },

    recordInteraction: function (id, type, response, result, weighting) {
      // Monotonic indexing — caller no longer passes index.
      // Ensures cmi.interactions.{N} writes are always contiguous from 0,
      // regardless of which screen the learner reaches first.
      var p = 'cmi.interactions.' + this.interactionIndex + '.';
      this.set(p + 'id', id);
      this.set(p + 'type', type);
      this.set(p + 'student_response', response);
      this.set(p + 'result', result);
      if (weighting != null) this.set(p + 'weighting', weighting);
      this.set(p + 'time', this.scormTime());
      this.interactionIndex++;
    },

    scormTime: function () {
      var d = new Date();
      function pad(n) { return n < 10 ? '0' + n : '' + n; }
      return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
    }
  };

  root.addEventListener('beforeunload', function () {
    if (SCORM.initialized) SCORM.finish();
  });

  root.SCORM = SCORM;
})(window);
