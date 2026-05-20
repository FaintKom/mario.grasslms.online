/**
 * phone-dialler.js · simulated phone-dialler with state machine.
 *
 * States: idle → ringing → on-call → ended
 *
 * Preserved API:
 *   - registerApp({ id:"phone-dialler", ... })
 *   - eventBus 'phone:dial'    → startCall(prospect)
 *   - eventBus 'phone:move'    → activateMove(move)
 *   - eventBus 'phone:silence' → start/clear silence banner
 *   - returns: { startCall, endCall, activateMove, startSilence, clearSilence }
 *
 * New: 'phone:answer' event listener + state-machine phase exposed via the
 * `.dialler[data-phase]` attribute so CSS can switch visuals.
 *
 * @see 02-design/ux-design-system.md §4.6 + §6.2
 */

import { registerApp, icon } from "./registry.js";
import { EVENT } from "../event-log.js";

const SILENCE_THRESHOLD_MS = 4000;
const RING_TO_ANSWER_MS    = 1600;

registerApp({
  id: "phone-dialler",
  name: "Phone-dialler",
  iconName: "phone",
  defaultSize: { w: 420, h: 560 },
  mount(ctx) {
    const { container, eventBus, options = {} } = ctx;

    container.classList.add("app--phone-dialler");

    /** @type {"idle"|"ringing"|"on-call"|"ended"} */
    let phase = "idle";
    /** @type {{prospect:any, started_at:number, ended_at:number|null} | null} */
    let call = null;
    let activeMoves = { M1: false, M2: false, M3: false };
    let toggles = { mute: false, hold: false };
    let timerId        = 0;
    let ringTimeoutId  = 0;
    let silenceStartedAt = 0;
    let silenceIntervalId = 0;

    container.innerHTML = renderShell();
    setPhase("idle");

    function renderShell() {
      return `
        <div class="brand-app">
          <header class="pd-topbar">
            <span class="pd-topbar__logo" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" fill="currentColor"/></svg>
            </span>
            <span class="pd-topbar__name">Phone</span>
            <span class="pd-topbar__status">Online</span>
          </header>
          <div class="dialler" data-phase="idle">
          <div class="dialler-screen">
            <div class="dialler-avatar" data-region="avatar">
              <span class="dialler-avatar__initials" data-region="initials">··</span>
              <span class="dialler-ring dialler-ring--1" aria-hidden="true"></span>
              <span class="dialler-ring dialler-ring--2" aria-hidden="true"></span>
              <span class="dialler-ring dialler-ring--3" aria-hidden="true"></span>
            </div>
            <div class="dialler-name" data-region="buyer">Idle</div>
            <div class="dialler-meta" data-region="meta">Waiting for a dial…</div>
            <div class="dialler-timer" data-region="timer" aria-live="off">00:00</div>
            <div class="dialler-waveform" aria-hidden="true">
              <span></span><span></span><span></span><span></span>
              <span></span><span></span><span></span><span></span>
              <span></span><span></span><span></span><span></span>
            </div>
            <div class="silence-banner" data-region="silence" role="status" aria-live="polite" hidden>buyer is thinking · 0s</div>
            <div class="move-chips" role="status" aria-live="polite" aria-label="Move indicators">
              <span class="m-chip" data-move="M1" data-active="false">[M1]</span>
              <span class="m-chip" data-move="M2" data-active="false">[M2]</span>
              <span class="m-chip" data-move="M3" data-active="false">[M3]</span>
            </div>
          </div>
          <div class="dialler-controls" data-region="controls">
            <button type="button" class="dialler-ctrl dialler-ctrl--dial"   data-action="dial"     aria-label="Dial">📞 Dial</button>
            <button type="button" class="dialler-ctrl dialler-ctrl--toggle" data-action="mute"     aria-pressed="false" aria-label="Mute" hidden>🔇 Mute</button>
            <button type="button" class="dialler-ctrl dialler-ctrl--toggle" data-action="hold"     aria-pressed="false" aria-label="Hold" hidden>⏸ Hold</button>
            <button type="button" class="dialler-ctrl dialler-ctrl--toggle" data-action="transfer" aria-label="Transfer" hidden>↗ Transfer</button>
            <button type="button" class="dialler-ctrl dialler-ctrl--hangup" data-action="hangup"   aria-label="Hang up" hidden>📵 Hang up</button>
          </div>
          <div class="disposition" data-region="disposition" hidden>
            <label>Post-call disposition
              <select data-field="disposition">
                <option value="">—</option>
                <option value="connected">Connected · demo booked</option>
                <option value="connected_no_meeting">Connected · no meeting</option>
                <option value="voicemail">Voicemail</option>
                <option value="no_answer">No answer</option>
                <option value="bad_number">Bad number</option>
              </select>
            </label>
          </div>
        </div>
        </div>
      `;
    }

    function setPhase(p) {
      phase = p;
      container.querySelector(".dialler")?.setAttribute("data-phase", p);
      const ctrls = {
        dial:     container.querySelector('[data-action="dial"]'),
        mute:     container.querySelector('[data-action="mute"]'),
        hold:     container.querySelector('[data-action="hold"]'),
        transfer: container.querySelector('[data-action="transfer"]'),
        hangup:   container.querySelector('[data-action="hangup"]'),
      };
      const show = (el, on) => { if (el) el.hidden = !on; };
      const disp = container.querySelector('[data-region="disposition"]');
      if (p === "idle") {
        show(ctrls.dial, true);
        show(ctrls.mute, false); show(ctrls.hold, false); show(ctrls.transfer, false); show(ctrls.hangup, false);
        show(disp, false);
      } else if (p === "ringing") {
        show(ctrls.dial, false);
        show(ctrls.hangup, true);
        show(ctrls.mute, false); show(ctrls.hold, false); show(ctrls.transfer, false);
        show(disp, false);
      } else if (p === "on-call") {
        show(ctrls.dial, false);
        show(ctrls.mute, true); show(ctrls.hold, true); show(ctrls.transfer, true);
        show(ctrls.hangup, true);
        show(disp, false);
      } else if (p === "ended") {
        show(ctrls.dial, true);
        show(ctrls.mute, false); show(ctrls.hold, false); show(ctrls.transfer, false); show(ctrls.hangup, false);
        show(disp, true);
      }
    }

    function initialsOf(name = "") {
      const parts = String(name).trim().split(/\s+/).slice(0, 2);
      return parts.map(p => p[0]?.toUpperCase() ?? "").join("") || "··";
    }

    function startCall(prospect) {
      if (call) endCall("interrupted");
      const p = prospect ?? options.prospect ?? { name: "Prospect", company: "—" };
      call = { prospect: p, started_at: Date.now(), ended_at: null };
      activeMoves = { M1: false, M2: false, M3: false };
      toggles = { mute: false, hold: false };
      updateChips();
      setText("initials", initialsOf(p.name));
      setText("buyer", p.name ?? "Prospect");
      setText("meta",  `${p.company ?? ""}${p.archetype ? " · " + p.archetype : ""} · ringing…`);
      setPhase("ringing");
      container.querySelectorAll('[aria-pressed]').forEach(el => el.setAttribute("aria-pressed", "false"));
      clearTimeout(ringTimeoutId);
      ringTimeoutId = window.setTimeout(answerCall, RING_TO_ANSWER_MS);
    }

    function answerCall() {
      if (!call || phase !== "ringing") return;
      call.started_at = Date.now();
      setText("meta", `${call.prospect.company ?? ""}${call.prospect.archetype ? " · " + call.prospect.archetype : ""}`);
      setPhase("on-call");
      timerId = window.setInterval(tickTimer, 1000);
      tickTimer();
    }

    function endCall(reason) {
      if (!call) return;
      call.ended_at = Date.now();
      clearTimeout(ringTimeoutId);
      clearInterval(timerId);
      clearSilence();
      const r = reason ?? "hangup";
      setText("meta", `Call ended · ${r} · pick disposition →`);
      setPhase("ended");
      call = null;
    }

    function tickTimer() {
      if (!call) { setText("timer", "00:00"); return; }
      const sec = Math.floor((Date.now() - call.started_at) / 1000);
      setText("timer", `${pad(Math.floor(sec/60))}:${pad(sec%60)}`);
    }

    function startSilence() {
      clearSilence();
      silenceStartedAt = Date.now();
      const banner = container.querySelector("[data-region='silence']");
      banner?.removeAttribute("hidden");
      silenceIntervalId = window.setInterval(() => {
        const elapsed = Date.now() - silenceStartedAt;
        if (banner) banner.textContent = `buyer is thinking · ${Math.floor(elapsed/1000)}s`;
        if (elapsed >= SILENCE_THRESHOLD_MS) {
          eventBus.dispatchEvent(new CustomEvent("telemetry", {
            detail: { event_name: EVENT.SILENCE_OBSERVED, duration_ms: elapsed },
          }));
        }
      }, 250);
    }
    function clearSilence() {
      clearInterval(silenceIntervalId);
      silenceIntervalId = 0;
      const banner = container.querySelector("[data-region='silence']");
      banner?.setAttribute("hidden", "");
    }

    function activateMove(move) {
      if (!["M1","M2","M3"].includes(move)) return;
      activeMoves[move] = true;
      updateChips();
    }
    function updateChips() {
      container.querySelectorAll(".move-chips .m-chip").forEach(el => {
        const m = el.getAttribute("data-move");
        el.setAttribute("data-active", activeMoves[m] ? "true" : "false");
      });
    }

    function toggleControl(name) {
      if (!(name in toggles)) return;
      toggles[name] = !toggles[name];
      const btn = container.querySelector(`[data-action="${name}"]`);
      btn?.setAttribute("aria-pressed", String(toggles[name]));
    }

    function setText(region, text) {
      const el = container.querySelector(`[data-region='${region}']`);
      if (el) el.textContent = text;
    }
    function pad(n) { return String(n).padStart(2, "0"); }

    container.addEventListener("click", e => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest('[data-action="dial"]'))         startCall();
      else if (t.closest('[data-action="hangup"]'))  endCall("hangup");
      else if (t.closest('[data-action="mute"]'))    toggleControl("mute");
      else if (t.closest('[data-action="hold"]'))    toggleControl("hold");
      // transfer is a no-op stub for v1
    });

    const onDial   = (/** @type {CustomEvent} */ ev) => startCall(ev.detail?.prospect);
    eventBus.addEventListener("phone:dial", onDial);
    const onAnswer = () => answerCall();
    eventBus.addEventListener("phone:answer", onAnswer);
    const onMove   = (ev) => activateMove(ev.detail?.move);
    eventBus.addEventListener("phone:move", onMove);
    const onSilence = (ev) => {
      if (ev.detail?.start) startSilence();
      else clearSilence();
    };
    eventBus.addEventListener("phone:silence", onSilence);

    return {
      startCall, endCall, activateMove, startSilence, clearSilence,
      destroy() {
        eventBus.removeEventListener("phone:dial", onDial);
        eventBus.removeEventListener("phone:answer", onAnswer);
        eventBus.removeEventListener("phone:move", onMove);
        eventBus.removeEventListener("phone:silence", onSilence);
        clearInterval(timerId); clearTimeout(ringTimeoutId); clearSilence();
      },
    };
  },
});
