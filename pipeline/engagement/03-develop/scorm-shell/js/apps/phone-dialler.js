/**
 * phone-dialler.js · simulated phone-dialler.
 *
 * Active-call panel with the M1/M2/M3 indicator chips (light up when the
 * move is detected) + a buyer-silence countdown after the rep asks a
 * diagnostic. Per ux-design-system §6.2 the silence signal is rendered as
 * text + visual countdown + aria-live (three cues, no audio).
 *
 * Listens for `phone:dial` (from outreach.js) — auto-starts a call.
 *
 * @see 02-design/ux-design-system.md §4.6 + §6.2
 */

import { registerApp, icon } from "./registry.js";
import { EVENT } from "../event-log.js";

const SILENCE_THRESHOLD_MS = 4000; // LO-M1.3 — 4-second pause counts as "buyer thinking"

registerApp({
  id: "phone-dialler",
  name: "Phone-dialler",
  iconName: "phone",
  defaultSize: { w: 420, h: 560 },
  mount(ctx) {
    const { container, eventBus, options = {} } = ctx;

    container.classList.add("app--phone-dialler");
    /** @type {{prospect:any, started_at:number, ended_at:number|null, events:any[]} | null} */
    let call = null;
    let activeMoves = { M1: false, M2: false, M3: false };
    let timerId = 0;
    let silenceStartedAt = 0;
    let silenceIntervalId = 0;

    container.innerHTML = renderShell();

    function renderShell() {
      return `
        <div class="dialler-state" data-region="state">
          <div class="buyer-name" data-region="buyer">Idle</div>
          <div class="call-meta" data-region="meta">Waiting for a dial…</div>
          <div class="call-timer" data-region="timer" aria-live="off">00:00</div>
          <div class="move-chips" role="status" aria-live="polite" aria-label="Move indicators">
            <span class="m-chip" data-move="M1" data-active="false">${icon("eye","M1 diagnostic move")}[M1]</span>
            <span class="m-chip" data-move="M2" data-active="false">${icon("refresh","M2 acknowledge move")}[M2]</span>
            <span class="m-chip" data-move="M3" data-active="false">${icon("calendar","M3 calendar close move")}[M3]</span>
          </div>
          <div class="silence-banner" data-region="silence" role="status" aria-live="polite" hidden>buyer is thinking · 0s</div>
          <div class="call-controls">
            <button type="button" class="dial-pad-btn" data-action="dial" aria-label="Dial">${icon("phone","Dial")}</button>
            <button type="button" class="hangup-btn" data-action="hangup" aria-label="Hang up" disabled>${icon("x","Hang up")}</button>
          </div>
          <div class="disposition" data-region="disposition" hidden>
            <label style="font-size:11px;color:rgba(255,255,255,0.7)">Post-call disposition
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
      `;
    }

    function startCall(prospect) {
      if (call) endCall("interrupted");
      call = {
        prospect: prospect ?? options.prospect ?? { name: "Prospect", company: "—" },
        started_at: Date.now(),
        ended_at: null,
        events: [],
      };
      activeMoves = { M1: false, M2: false, M3: false };
      updateChips();
      setText("buyer", `${call.prospect.name ?? "Prospect"}`);
      setText("meta", `${call.prospect.company ?? ""} · ${call.prospect.archetype ?? ""}`);
      timerId = window.setInterval(tickTimer, 1000);
      tickTimer();
      toggleControls(true);
      container.querySelector("[data-region='disposition']")?.setAttribute("hidden", "");
    }

    function endCall(reason) {
      if (!call) return;
      call.ended_at = Date.now();
      clearInterval(timerId);
      clearSilence();
      toggleControls(false);
      container.querySelector("[data-region='disposition']")?.removeAttribute("hidden");
      setText("meta", `Call ended · ${reason ?? "hangup"} · pick disposition →`);
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

    function toggleControls(callActive) {
      /** @type {HTMLButtonElement} */
      const dial = container.querySelector("[data-action='dial']");
      /** @type {HTMLButtonElement} */
      const hang = container.querySelector("[data-action='hangup']");
      if (dial) dial.disabled = callActive;
      if (hang) hang.disabled = !callActive;
    }

    function setText(region, text) {
      const el = container.querySelector(`[data-region='${region}']`);
      if (el) el.textContent = text;
    }
    function pad(n) { return String(n).padStart(2, "0"); }

    container.addEventListener("click", e => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest("[data-action='dial']")) startCall();
      else if (t.closest("[data-action='hangup']")) endCall("hangup");
    });

    const onDial = (/** @type {CustomEvent} */ ev) => startCall(ev.detail?.prospect);
    eventBus.addEventListener("phone:dial", onDial);

    const onMove = (ev) => activateMove(ev.detail?.move);
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
        eventBus.removeEventListener("phone:move", onMove);
        eventBus.removeEventListener("phone:silence", onSilence);
        clearInterval(timerId); clearSilence();
      },
    };
  },
});
