/**
 * calendar.js · simulated calendar.
 *
 * Week-view grid (Mon-Fri × 6 half-hour bands) with two highlighted
 * "suggested" slots per the M.G. close-pattern in §10.1.
 *
 * Fires `calendar:opened` when mounted (M3 habit-gate consumes this).
 *
 * @see 02-design/ux-design-system.md §4.5
 */

import { registerApp, icon } from "./registry.js";
import { EVENT } from "../event-log.js";

const DAYS  = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const BANDS = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00"];

/** Default synthetic week — two slots flagged as "suggested" for the rep to read aloud. */
function defaultSlots() {
  const slots = [];
  DAYS.forEach((day) => {
    BANDS.forEach((time) => {
      slots.push({ slot_id: `${day}-${time}`, day, time, duration_min: 20, status: "free", invitee_emails: [] });
    });
  });
  setStatus(slots, "Mon", "09:00", "busy");
  setStatus(slots, "Mon", "09:30", "busy");
  setStatus(slots, "Tue", "10:00", "suggested");
  setStatus(slots, "Wed", "10:30", "suggested");
  setStatus(slots, "Thu", "14:00", "busy");
  return slots;
}
function setStatus(slots, day, time, status) {
  const s = slots.find(x => x.day === day && x.time === time);
  if (s) s.status = status;
}

registerApp({
  id: "calendar",
  name: "Calendar",
  iconName: "calendar",
  defaultSize: { w: 700, h: 540 },
  mount(ctx) {
    const { container, eventBus, options = {} } = ctx;
    /** @type {any[]} */
    let slots = Array.isArray(options.slots) ? options.slots.slice() : defaultSlots();
    let inviteeEmail = options.invitee_email ?? "";

    container.classList.add("app--calendar");
    container.innerHTML = renderShell();
    render();

    eventBus.dispatchEvent(new CustomEvent("calendar:opened", { detail: { ts: Date.now() } }));
    eventBus.dispatchEvent(new CustomEvent("telemetry", { detail: { event_name: EVENT.CALENDAR_OPENED } }));

    function renderShell() {
      return `
        <div class="cal-head-row" style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
          <strong style="font-size:14px">This week</strong>
          <span class="tag">Suggested slots highlighted</span>
        </div>
        <div class="cal-grid" data-region="grid"></div>
        <div style="display:flex;gap:8px;align-items:center;margin-top:12px">
          <label style="font-size:12px">
            Invitee email
            <input type="email" data-field="invitee" value="${escapeAttr(inviteeEmail)}" placeholder="buyer@example.com"
              style="margin-left:6px;padding:4px 6px;border:1px solid var(--ftc-border);border-radius:4px;font:inherit;width:200px">
          </label>
          <button type="button" class="invite-btn" data-action="send-invite" disabled>
            ${icon("check","Send invite")} Send invite
          </button>
        </div>
        <p data-region="readout" style="margin-top:8px;font-size:12px;color:var(--ftc-ink-2)"></p>
      `;
    }

    function render() {
      const grid = container.querySelector("[data-region='grid']");
      if (!grid) return;
      const cells = [];
      cells.push(`<div class="cal-head"></div>`);
      DAYS.forEach(d => cells.push(`<div class="cal-head">${d}</div>`));
      BANDS.forEach(b => {
        cells.push(`<div class="cal-head">${b}</div>`);
        DAYS.forEach(d => {
          const s = slots.find(x => x.day === d && x.time === b);
          const status = s?.status ?? "free";
          cells.push(`
            <div class="cal-slot" role="button" tabindex="0"
              data-status="${status}"
              data-slot="${escapeAttr(s?.slot_id ?? "")}"
              aria-label="${escapeAttr(`${d} ${b} ${status}`)}">
              ${status === "busy" ? "busy" : ""}
            </div>
          `);
        });
      });
      grid.innerHTML = cells.join("");

      const readout = container.querySelector("[data-region='readout']");
      const selected = slots.filter(s => s.status === "selected");
      if (readout) {
        readout.textContent = selected.length
          ? `Selected: ${selected.map(s => `${s.day} ${s.time}`).join(" + ")}`
          : `Tip: read two slots aloud — e.g. "${suggestedSummary()}"`;
      }
      const btn = container.querySelector("[data-action='send-invite']");
      if (btn) /** @type {HTMLButtonElement} */ (btn).disabled = !(selected.length >= 1 && inviteeEmail.includes("@"));
    }

    function suggestedSummary() {
      const sug = slots.filter(s => s.status === "suggested");
      return sug.map(s => `${s.day} at ${s.time}`).join(" or ");
    }

    function bind() {
      container.addEventListener("click", e => {
        const cell = e.target instanceof Element ? e.target.closest("[data-slot]") : null;
        if (cell) {
          const id = cell.getAttribute("data-slot");
          const s = slots.find(x => x.slot_id === id);
          if (!s || s.status === "busy") return;
          if (s.status === "selected") s.status = s.slot_id.match(/^(Tue-10:00|Wed-10:30)$/) ? "suggested" : "free";
          else s.status = "selected";
          eventBus.dispatchEvent(new CustomEvent("telemetry", {
            detail: { event_name: EVENT.SLOTS_STATED, slot_id: s.slot_id, slot_day: s.day, slot_time: s.time },
          }));
          render();
        }
        if (e.target instanceof Element && e.target.closest("[data-action='send-invite']")) {
          sendInvite();
        }
      });
      container.addEventListener("input", e => {
        if (e.target instanceof HTMLInputElement && e.target.dataset.field === "invitee") {
          inviteeEmail = e.target.value;
          render();
        }
      });
      container.addEventListener("keydown", e => {
        const cell = e.target instanceof Element ? e.target.closest("[data-slot]") : null;
        if (cell && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          /** @type {HTMLElement} */ (cell).click();
        }
      });
    }

    function sendInvite() {
      const selected = slots.filter(s => s.status === "selected");
      eventBus.dispatchEvent(new CustomEvent("telemetry", {
        detail: {
          event_name: EVENT.INVITE_SENT,
          invitee_email: inviteeEmail,
          slot_ids: selected.map(s => s.slot_id),
        },
      }));
      const readout = container.querySelector("[data-region='readout']");
      if (readout) {
        readout.style.color = "var(--brand-green-deep)";
        readout.textContent = `✓ Invite sent to ${inviteeEmail} for ${selected.map(s => `${s.day} ${s.time}`).join(", ")}`;
      }
    }

    bind();

    const onPeek = () => render();
    eventBus.addEventListener("calendar:peek", onPeek);

    return {
      destroy() { eventBus.removeEventListener("calendar:peek", onPeek); },
    };
  },
});

function escapeAttr(s) { return String(s ?? "").replace(/[<>&"]/g, c => ({ "<":"&lt;",">":"&gt;","&":"&amp;","\"":"&quot;" }[c])); }
