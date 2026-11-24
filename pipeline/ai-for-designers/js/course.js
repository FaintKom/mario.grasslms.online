/* Course player: outline, routing, saved progress, SCORM 1.2 reporting and
   the small interactive components the steps share. No build step. */
(function () {
  "use strict";

  var AID = (window.AID = { steps: [], units: [] });
  var KEY = "aid-course-v1";
  var PASS_MARK = 80;

  /* ---------- SCORM 1.2 bridge (silent when there is no LMS) ---------- */
  var scorm = {
    api: null,
    find: function () {
      var w = window, hops = 0;
      try {
        while (w && hops < 12) {
          if (w.API) return w.API;
          if (w.parent && w.parent !== w) w = w.parent;
          else if (w.opener) w = w.opener;
          else break;
          hops++;
        }
      } catch (e) { /* cross-origin parent: no LMS we can talk to */ }
      return null;
    },
    init: function () {
      this.api = this.find();
      if (!this.api) return;
      this.api.LMSInitialize("");
      var status = this.api.LMSGetValue("cmi.core.lesson_status");
      if (status === "not attempted" || status === "") this.set("cmi.core.lesson_status", "incomplete");
    },
    get: function (k) { return this.api ? this.api.LMSGetValue(k) : ""; },
    set: function (k, v) { if (this.api) this.api.LMSSetValue(k, String(v)); },
    commit: function () { if (this.api) this.api.LMSCommit(""); },
    finish: function () { if (this.api) { this.api.LMSCommit(""); this.api.LMSFinish(""); this.api = null; } }
  };
  AID.scorm = scorm;

  /* ---------- state ---------- */
  var state = { at: "cover", seen: {}, done: {}, marks: {}, data: {} };

  function load() {
    var raw = "";
    if (scorm.api) raw = scorm.get("cmi.suspend_data");
    if (!raw) { try { raw = localStorage.getItem(KEY) || ""; } catch (e) { raw = ""; } }
    if (!raw) return;
    try {
      var s = JSON.parse(raw);
      ["at", "seen", "done", "marks", "data"].forEach(function (k) { if (s[k] != null) state[k] = s[k]; });
    } catch (e) { /* unreadable save: start fresh */ }
  }
  function save() {
    var raw = JSON.stringify(state);
    try { localStorage.setItem(KEY, raw); } catch (e) { /* private mode */ }
    if (scorm.api) {
      scorm.set("cmi.core.lesson_location", state.at);
      /* SCORM 1.2 guarantees 4096 characters; past that, keep progress and scores and drop the detail */
      scorm.set("cmi.suspend_data", raw.length < 4000 ? raw : JSON.stringify({ at: state.at, seen: state.seen, done: state.done, marks: state.marks }));
      report();
      scorm.commit();
    }
  }
  AID.state = state;
  AID.save = save;

  /* Questions are graded on the first answer. `marks` holds 1 or 0 per question id. */
  AID.mark = function (qid, ok) {
    if (state.marks[qid] == null) { state.marks[qid] = ok ? 1 : 0; save(); }
  };
  AID.score = function () {
    var total = AID.gradedIds.length, got = 0, answered = 0;
    AID.gradedIds.forEach(function (id) {
      if (state.marks[id] != null) { answered++; got += state.marks[id]; }
    });
    return { got: got, total: total, answered: answered, pct: total ? Math.round((got / total) * 100) : 0 };
  };
  AID.gradedIds = [];
  AID.passMark = PASS_MARK;

  function report() {
    var sc = AID.score();
    var allDone = AID.steps.every(function (s) { return state.done[s.id]; });
    scorm.set("cmi.core.score.min", 0);
    scorm.set("cmi.core.score.max", 100);
    scorm.set("cmi.core.score.raw", sc.pct);
    if (allDone && sc.answered === sc.total) {
      scorm.set("cmi.core.lesson_status", sc.pct >= PASS_MARK ? "passed" : "failed");
    } else {
      scorm.set("cmi.core.lesson_status", "incomplete");
    }
  }

  /* ---------- helpers ---------- */
  function h(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  AID.h = h;
  AID.esc = esc;
  AID.$ = function (sel, root) { return (root || document).querySelector(sel); };
  AID.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  AID.complete = function (id) {
    if (!state.done[id]) { state.done[id] = 1; save(); paintOutline(); paintMeter(); }
  };

  /* ---------- shared component: questions with feedback ---------- */
  /* q = { id, stem, options: [{ t, ok, fb }], graded } */
  AID.questions = function (host, list, onAllAnswered) {
    var left = list.length;
    list.forEach(function (q, qi) {
      var saved = state.data["q:" + q.id];
      /* Options are shown in an order drawn once for each learner and kept with the progress,
         so the place of the right answer says nothing. A saved answer keeps its index from the source. */
      var order = state.data["o:" + q.id];
      if (!order || order.length !== q.options.length) {
        order = q.options.map(function (_, i) { return i; });
        if (!q.fixed) {
          for (var i = order.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1)), tmp = order[i];
            order[i] = order[j]; order[j] = tmp;
          }
        }
        state.data["o:" + q.id] = order;
      }
      var keyAt = order.indexOf(q.options.findIndex(function (x) { return x.ok; }));
      var box = h('<section class="q" aria-labelledby="q-' + q.id + '">' +
        '<h3 class="q__stem" id="q-' + q.id + '">' + (list.length > 1 ? '<span class="q__n">' + (qi + 1) + '</span>' : "") + q.stem + "</h3>" +
        '<div class="q__opts" role="group" aria-labelledby="q-' + q.id + '"></div>' +
        '<div class="q__fb" aria-live="polite"></div></section>');
      var opts = AID.$(".q__opts", box), fb = AID.$(".q__fb", box);
      order.forEach(function (oi, pos) {
        var b = h('<button type="button" class="opt" data-i="' + oi + '"><span class="opt__key">' + "ABCDE".charAt(pos) + "</span><span>" + q.options[oi].t + "</span></button>");
        b.addEventListener("click", function () { choose(oi, true); });
        opts.appendChild(b);
      });
      function choose(oi, fresh) {
        var o = q.options[oi];
        AID.$$(".opt", opts).forEach(function (b) {
          var i = +b.getAttribute("data-i");
          b.disabled = true;
          b.classList.toggle("is-picked", i === oi);
          if (q.options[i].ok) b.classList.add("is-key");
        });
        fb.className = "q__fb is-shown " + (o.ok ? "is-ok" : "is-no");
        fb.innerHTML = '<p class="q__verdict">' + (o.ok ? "This is the one." : "Look at " + "ABCDE".charAt(keyAt) + ".") + "</p><p>" + o.fb + "</p>";
        if (fresh) {
          state.data["q:" + q.id] = oi;
          if (q.graded !== false) AID.mark(q.id, o.ok);
          save();
        }
        left--;
        if (left === 0 && onAllAnswered) onAllAnswered();
      }
      host.appendChild(box);
      if (saved != null) choose(saved, false);
    });
  };

  /* ---------- shared component: rows you flag ---------- */
  /* rows = [{ id, html, bad, why }] ; returns { check(), flagged() } */
  AID.flagList = function (host, rows, opts) {
    opts = opts || {};
    var list = h('<ol class="flags' + (opts.prose ? " flags--prose" : "") + '"></ol>');
    rows.forEach(function (r) {
      var li = h('<li class="flag" data-id="' + r.id + '">' +
        '<button type="button" class="flag__btn" aria-pressed="false">' +
        '<span class="flag__mark" aria-hidden="true"></span><span class="flag__body">' + r.html + "</span>" +
        '<span class="flag__state">Flag</span></button><p class="flag__why" hidden></p></li>');
      var b = AID.$(".flag__btn", li);
      b.addEventListener("click", function () {
        if (list.classList.contains("is-checked")) return;
        var on = b.getAttribute("aria-pressed") !== "true";
        b.setAttribute("aria-pressed", on);
        AID.$(".flag__state", li).textContent = on ? "Flagged" : "Flag";
      });
      list.appendChild(li);
    });
    host.appendChild(list);
    return {
      el: list,
      flagged: function () {
        return AID.$$(".flag", list).filter(function (li) {
          return AID.$(".flag__btn", li).getAttribute("aria-pressed") === "true";
        }).map(function (li) { return li.getAttribute("data-id"); });
      },
      check: function () {
        var res = { hit: [], miss: [], extra: [] };
        list.classList.add("is-checked");
        rows.forEach(function (r) {
          var li = AID.$('.flag[data-id="' + r.id + '"]', list);
          var on = AID.$(".flag__btn", li).getAttribute("aria-pressed") === "true";
          var kind = r.bad ? (on ? "hit" : "miss") : (on ? "extra" : "fine");
          li.classList.add("is-" + kind);
          if (kind !== "fine") {
            res[kind].push(r.id);
            var p = AID.$(".flag__why", li);
            p.hidden = false;
            p.innerHTML = (kind === "miss" ? "<strong>Missed.</strong> " : kind === "extra" ? "<strong>This row is sound.</strong> " : "") + (kind === "extra" ? (r.fine || "") : r.why);
            AID.$(".flag__state", li).textContent = kind === "hit" ? "Found" : kind === "miss" ? "Missed" : "Not a defect";
          }
        });
        return res;
      },
      reset: function () {
        list.classList.remove("is-checked");
        AID.$$(".flag", list).forEach(function (li) {
          li.className = "flag";
          AID.$(".flag__btn", li).setAttribute("aria-pressed", "false");
          AID.$(".flag__state", li).textContent = "Flag";
          AID.$(".flag__why", li).hidden = true;
        });
      }
    };
  };

  /* ---------- outline, meter, routing ---------- */
  function paintOutline() {
    var nav = document.getElementById("outline");
    var html = '<a class="outline__cover' + (state.at === "cover" ? " is-here" : "") + '" href="#cover">Start page</a>';
    AID.units.forEach(function (u, ui) {
      html += '<section class="outline__unit"><h2>Unit ' + (ui + 1) + ": " + u.title + "</h2><ol>";
      AID.steps.filter(function (s) { return s.unit === u.id; }).forEach(function (s) {
        html += '<li><a href="#' + s.id + '" class="' + (state.at === s.id ? "is-here " : "") + (state.done[s.id] ? "is-done" : "") + '"' +
          (state.at === s.id ? ' aria-current="step"' : "") + '><span class="outline__tick" aria-hidden="true"></span>' +
          '<span class="outline__t">' + s.nav + "</span>" +
          (state.done[s.id] ? '<span class="sr">, done</span>' : "") + "</a></li>";
      });
      html += "</ol></section>";
    });
    html += '<p class="outline__aid"><a href="job-aid.html">Job aid, one page</a><br><a href="design-log.html">Design log</a></p>';
    nav.innerHTML = html;
  }
  function paintMeter() {
    var n = AID.steps.length, d = AID.steps.filter(function (s) { return state.done[s.id]; }).length;
    var pct = Math.round((d / n) * 100);
    document.getElementById("meter-fill").style.width = pct + "%";
    document.getElementById("meter").setAttribute("aria-valuenow", pct);
    document.getElementById("meter-text").textContent = d + " of " + n + " steps";
  }

  var order = [];
  var cleanup = null;
  function go(id, focus) {
    if (order.indexOf(id) < 0) id = "cover";
    if (cleanup) { try { cleanup(); } catch (e) { /* ignore */ } cleanup = null; }
    state.at = id;
    state.seen[id] = 1;
    var host = document.getElementById("step");
    host.innerHTML = "";
    host.className = "step";
    var i = order.indexOf(id);
    if (id === "cover") {
      host.classList.add("step--cover");
      cleanup = AID.cover(host) || null;
    } else {
      var s = AID.steps[i - 1];
      var u = AID.units.filter(function (x) { return x.id === s.unit; })[0];
      if (s.wide) host.classList.add("step--wide");
      host.appendChild(h('<h1 class="step__h" id="step-h" tabindex="-1">' + s.title + "</h1>"));
      cleanup = s.render(host, {
        done: function () { AID.complete(s.id); },
        id: s.id
      }) || null;
      if (s.auto !== false) AID.complete(s.id);
    }
    document.getElementById("prev").hidden = i === 0;
    var next = document.getElementById("next");
    next.hidden = i === order.length - 1;
    next.textContent = i === 0 ? "Start with the lesson plan" : "Next";
    document.getElementById("where").textContent = i === 0 ? "" : "Step " + i + " of " + (order.length - 1);
    document.body.classList.remove("outline-open");
    document.getElementById("menu-btn").setAttribute("aria-expanded", "false");
    save();
    paintOutline();
    paintMeter();
    window.scrollTo({ top: 0, behavior: "instant" });
    document.querySelector(".stage").scrollTop = 0;
    if (focus) { var f = document.getElementById("step-h") || document.getElementById("main"); f.focus({ preventScroll: true }); }
    if (location.hash !== "#" + id) history.replaceState(null, "", "#" + id);
  }
  AID.go = go;

  AID.start = function () {
    order = ["cover"].concat(AID.steps.map(function (s) { return s.id; }));
    scorm.init();
    load();
    var want = (location.hash || "").slice(1) || state.at || "cover";
    document.getElementById("prev").addEventListener("click", function () { go(order[Math.max(0, order.indexOf(state.at) - 1)], true); });
    document.getElementById("next").addEventListener("click", function () { go(order[Math.min(order.length - 1, order.indexOf(state.at) + 1)], true); });
    document.getElementById("menu-btn").addEventListener("click", function () {
      var open = document.body.classList.toggle("outline-open");
      this.setAttribute("aria-expanded", open);
    });
    function closeOutline() {
      document.body.classList.remove("outline-open");
      document.getElementById("menu-btn").setAttribute("aria-expanded", "false");
    }
    var scrim = h('<div class="scrim"></div>');
    document.body.appendChild(scrim);
    scrim.addEventListener("click", closeOutline);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeOutline(); });
    window.addEventListener("hashchange", function () {
      var id = location.hash.slice(1);
      if (id && id !== state.at) go(id, true);
    });
    window.addEventListener("pagehide", function () { save(); scorm.finish(); });
    go(want, false);
  };

  AID.resetAll = function () {
    state.at = "cover"; state.seen = {}; state.done = {}; state.marks = {}; state.data = {};
    save();
    go("cover", true);
  };
})();
