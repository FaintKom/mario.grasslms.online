/* Film player. A film is a list of scenes; each scene is one voice-over line
   (one mp3) and a 1280x720 frame whose elements appear at set points of that
   line. A scene ends when its audio ends, so picture and voice cannot drift.
   If a clip is missing the scene runs on an estimated length with captions on. */
(function () {
  "use strict";
  var AID = window.AID;

  function estimate(text) { return Math.max(2.4, text.split(/\s+/).length / 2.55 + 0.5); }
  function fmt(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }

  AID.film = function (host, film, onEnd) {
    var scenes = film.scenes.map(function (s, i) {
      return { i: i, text: s.text, html: s.html, src: film.audio + s.id + ".mp3", dur: s.dur || estimate(s.text), real: false };
    });
    var el = AID.h(
      '<div class="film">' +
      '<div class="film__stage"><div class="film__canvas" aria-hidden="true"></div>' +
      '<p class="film__cap" hidden></p>' +
      '<button class="film__big" type="button" aria-label="Play the film"><span><svg viewBox="0 0 24 24"><path d="M5 3l15 9-15 9z" fill="#0d150d"/></svg></span></button></div>' +
      '<div class="film__bar"><button type="button" class="film__play">Play</button>' +
      '<div class="film__segs" role="group" aria-label="Scenes"></div>' +
      '<span class="film__time">0:00 / 0:00</span>' +
      '<button type="button" class="film__cc" aria-pressed="false">Captions</button>' +
      '<button type="button" class="film__fs">Full screen</button></div></div>');
    host.appendChild(el);
    var note = AID.h('<p class="film__note" hidden>The voice-over for this film has not loaded, and the film is playing with captions.</p>');
    host.appendChild(note);

    var stage = AID.$(".film__stage", el), canvas = AID.$(".film__canvas", el), cap = AID.$(".film__cap", el);
    var big = AID.$(".film__big", el), playBtn = AID.$(".film__play", el), cc = AID.$(".film__cc", el);
    var segs = AID.$(".film__segs", el), time = AID.$(".film__time", el);
    var cur = -1, playing = false, audio = null, t0 = 0, held = 0, raf = 0, silent = false, capsOn = false, ended = false;

    scenes.forEach(function (s) {
      var b = AID.h('<button type="button" class="film__seg" aria-label="Scene ' + (s.i + 1) + '"><i></i></button>');
      b.style.flexGrow = s.dur;
      b.addEventListener("click", function () { show(s.i, true); });
      segs.appendChild(b);
      s.seg = b;
    });

    function fit() { canvas.style.transform = "scale(" + stage.clientWidth / 1280 + ")"; }
    var ro = new ResizeObserver(fit); ro.observe(stage); fit();

    function total() { return scenes.reduce(function (a, s) { return a + s.dur; }, 0); }
    function before(i) { var a = 0; for (var k = 0; k < i; k++) a += scenes[k].dur; return a; }

    function setCaps(on) { capsOn = on; cc.setAttribute("aria-pressed", on); cap.hidden = !on; }
    cc.addEventListener("click", function () { setCaps(!capsOn); });
    var fs = AID.$(".film__fs", el);
    if (!el.requestFullscreen) fs.hidden = true;
    fs.addEventListener("click", function () {
      if (document.fullscreenElement) { document.exitFullscreen(); return; }
      el.requestFullscreen().then(function () {
        if (screen.orientation && screen.orientation.lock) screen.orientation.lock("landscape").catch(function () {});
      }).catch(function () {});
    });
    document.addEventListener("fullscreenchange", function () { fs.textContent = document.fullscreenElement === el ? "Exit full screen" : "Full screen"; });

    function paint(frac) {
      var s = scenes[cur];
      AID.$$(".fx", canvas).forEach(function (n) {
        var at = parseFloat(n.getAttribute("data-at") || "0"), out = parseFloat(n.getAttribute("data-out") || "9");
        n.classList.toggle("on", frac >= at && frac < out);
      });
      AID.$$("[data-type]", canvas).forEach(function (n) {
        var full = n.getAttribute("data-type"), a = parseFloat(n.getAttribute("data-at") || "0"), b = parseFloat(n.getAttribute("data-to") || "1");
        var k = Math.max(0, Math.min(1, (frac - a) / (b - a)));
        n.textContent = full.slice(0, Math.round(full.length * k));
      });
      AID.$("i", s.seg).style.width = Math.min(100, frac * 100) + "%";
      time.textContent = fmt(before(cur) + Math.min(1, frac) * s.dur) + " / " + fmt(total());
    }

    function now() {
      if (audio && !silent) return audio.currentTime;
      return held + (playing ? (performance.now() - t0) / 1000 : 0);
    }
    function tick() {
      if (cur < 0) return;
      var s = scenes[cur], t = now(), frac = t / s.dur;
      paint(frac);
      var done = silent || !audio ? t >= s.dur + 0.3 : audio.ended;
      if (done && playing) {
        if (cur + 1 < scenes.length) { show(cur + 1, true); return; }
        finish(); return;
      }
      if (playing) raf = requestAnimationFrame(tick);
    }

    function show(i, autoplay) {
      cancelAnimationFrame(raf);
      if (audio) { audio.pause(); audio.onended = null; audio.onerror = null; audio = null; }
      cur = i; held = 0; ended = false;
      var s = scenes[i];
      canvas.innerHTML = s.html;
      cap.textContent = s.text;
      scenes.forEach(function (x) { x.seg.classList.toggle("is-past", x.i < i); AID.$("i", x.seg).style.width = x.i < i ? "100%" : "0"; });
      silent = false;
      audio = new Audio(s.src);
      audio.preload = "auto";
      audio.onloadedmetadata = function () { if (isFinite(audio.duration) && audio.duration > 0.3) { s.dur = audio.duration + 0.25; s.real = true; s.seg.style.flexGrow = s.dur; } };
      audio.onerror = function () { goSilent(); };
      if (scenes[i + 1]) { var ahead = new Audio(scenes[i + 1].src); ahead.preload = "auto"; }
      paint(0);
      /* let the browser apply the "off" state before the first reveal */
      if (autoplay) requestAnimationFrame(function () { paint(0.0001); play(); });
    }
    function goSilent() {
      if (silent) return;
      silent = true; note.hidden = false; setCaps(true);
      if (playing) { t0 = performance.now(); raf = requestAnimationFrame(tick); }
    }
    function play() {
      if (cur < 0) { show(0, true); return; }
      if (ended) { show(0, true); return; }
      playing = true; big.hidden = true; playBtn.textContent = "Pause";
      t0 = performance.now();
      if (audio && !silent) {
        var p = audio.play();
        if (p && p.catch) p.catch(function () { goSilent(); });
      }
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    }
    function pause() {
      if (!playing) return;
      held = now(); playing = false; playBtn.textContent = "Play";
      if (audio) audio.pause();
      cancelAnimationFrame(raf);
    }
    function finish() {
      playing = false; ended = true; playBtn.textContent = "Play again";
      paint(1);
      if (onEnd) onEnd();
    }
    big.addEventListener("click", play);
    playBtn.addEventListener("click", function () { playing ? pause() : play(); });
    stage.addEventListener("click", function (e) { if (e.target.closest(".film__big")) return; playing ? pause() : (cur >= 0 && play()); });

    show(0, false);
    paint(1); /* poster: the finished first frame */

    return function destroy() { cancelAnimationFrame(raf); ro.disconnect(); if (audio) { audio.pause(); audio = null; } playing = false; };
  };
})();
