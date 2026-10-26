/**
 * calendar.js · simulated calendar.
 *
 * Mon-Fri × 09:00-18:00 (30-min bands) week-view grid. Click empty slots to
 * select (up to 2 for the M3 two-slot close pattern). Busy slots show their
 * block title (Stand-up, Sync, Lunch, etc.). Suggested slots get a green
 * left-stripe + preview label. Send-invite fires the EVENT.INVITE_SENT
 * telemetry event so M3 module logic can react.
 *
 * Fires `calendar:opened` when mounted (M3 habit-gate consumes this).
 *
 * @see 02-design/ux-design-system.md §4.5
 */

import { registerApp, icon } from "./registry.js";
import { EVENT } from "../event-log.js";
import { bookingWeek, slot as bookingSlot, spokenSlot, today, dm } from "../dates.js";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

function generateBands() {
  const bands = [];
  for (let h = 9; h < 18; h++) {
    bands.push(`${String(h).padStart(2, "0")}:00`);
    bands.push(`${String(h).padStart(2, "0")}:30`);
  }
  return bands;
}
const BANDS = generateBands();

// The week shown is the one with the next two working days (dates.js), so the
// suggested slots are never in the past and never on a weekend.
const DEFAULT_SUGGESTED = [bookingSlot(0, "11:00"), bookingSlot(1, "14:00")];

/** Dates of Mon…Fri in the week the Calendar shows. */
function weekDates() {
  const mon = bookingWeek();
  return DAYS.map((_, i) => { const d = new Date(mon); d.setDate(mon.getDate() + i); return d; });
}

/**
 * @param {string[]} suggested  slots like "Tue 11:00"
 * @param {string} who          buyer name for the "Suggest · …" label
 */
function defaultSlots(suggested = DEFAULT_SUGGESTED, who = "Maria") {
  const slots = [];
  DAYS.forEach((day) => {
    BANDS.forEach((time) => {
      slots.push({
        slot_id: `${day}-${time}`,
        day, time,
        duration_min: 30,
        status: "free",
        label: "",
        invitee_emails: [],
      });
    });
  });
  const block = (day, time, label) => {
    const s = slots.find(x => x.day === day && x.time === time);
    if (s) { s.status = "busy"; s.label = label; }
  };
  DAYS.forEach(d => block(d, "09:00", "Stand-up · pod"));
  DAYS.forEach(d => { block(d, "12:30", "Lunch"); block(d, "13:00", "Lunch"); });
  // Fixed meetings stay clear of the times the modules offer (10:00, 10:30, 11:00, 11:30, 14:00).
  block("Wed", "15:00", "1:1 · J.T.");
  block("Wed", "15:30", "1:1 · J.T.");
  block("Fri", "16:00", "Pipeline review");
  block("Fri", "16:30", "Pipeline review");
  block("Mon", "15:00", "Customer demo");
  block("Mon", "15:30", "Customer demo");
  block("Thu", "16:00", "Discovery call");
  // Days of this week that are already over can't be booked.
  const t = today();
  weekDates().forEach((d, i) => {
    if (d < t) slots.filter(x => x.day === DAYS[i]).forEach(x => { x.status = "past"; x.label = ""; });
  });

  const suggest = (day, time, label) => {
    const s = slots.find(x => x.day === day && x.time === time);
    if (s) { s.status = "suggested"; s.label = label; }
  };
  suggested.forEach(s => {
    const [day, time] = String(s).split(" ");
    suggest(day, time, `Suggest · ${who}`);
  });

  return slots;
}

registerApp({
  id: "calendar",
  name: "Calendar",
  iconName: "calendar",
  defaultSize: { w: 700, h: 540 },
  mount(ctx) {
    const { container, eventBus, options = {} } = ctx;
    /** @type {any[]} */
    // Modules pass the buyer's name and the two slots to suggest for this call.
    let suggestFor = options.suggestFor ?? "Maria";
    let suggestedIds = new Set((options.suggestedSlots ?? DEFAULT_SUGGESTED).map(s => String(s).replace(" ", "-")));
    let slots = Array.isArray(options.slots) ? options.slots.slice() : defaultSlots(options.suggestedSlots ?? DEFAULT_SUGGESTED, suggestFor);
    let inviteeEmail = options.invitee_email ?? "";
    const dates = weekDates();
    const todayIdx = dates.findIndex(d => d.getTime() === today().getTime());

    container.classList.add("app--calendar");
    container.innerHTML = renderShell();
    render();

    eventBus.dispatchEvent(new CustomEvent("calendar:opened", { detail: { ts: Date.now() } }));
    eventBus.dispatchEvent(new CustomEvent("telemetry", { detail: { event_name: EVENT.CALENDAR_OPENED } }));

    function weekRange() { return `${dm(dates[0])} – ${dm(dates[4])}`; }

    function renderShell() {
      return `
        <div class="brand-app">
          <header class="gc-topnav" role="banner">
            <button type="button" class="gc-topnav__hamburger" aria-label="Main menu">
              <svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
            </button>
            <span class="gc-topnav__brand">
              <svg class="gc-topnav__brand-icon" viewBox="0 0 48 48"><rect width="48" height="48" rx="6" fill="#fff"/><path d="M36 12h-7v7h7z" fill="#1A73E8"/><path d="M36 36V19h-7v17z" fill="#EA4335"/><path d="M12 12v7h7v-7z" fill="#34A853"/><path d="M12 19v17h7V19z" fill="#FBBC04"/><path d="M19 12v7h10v-7z" fill="#1A73E8"/><text x="24" y="32" font-family="Roboto, system-ui" font-size="11" font-weight="700" text-anchor="middle" fill="#5F6368">31</text></svg>
              Calendar
            </span>
            <button type="button" class="gc-topnav__today" data-action="today">Today</button>
            <button type="button" class="gc-topnav__navbtn" aria-label="Previous week">
              <svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <button type="button" class="gc-topnav__navbtn" aria-label="Next week">
              <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <span class="gc-topnav__date">${weekRange()}</span>
            <span class="gc-topnav__spacer"></span>
            <button type="button" class="gc-topnav__view">Week</button>
            <span class="gc-topnav__avatar" aria-hidden="true">MB</span>
          </header>
          <div class="gc-grid-wrap">
            <div class="cal-grid" data-region="grid"></div>
          </div>
          <div class="gc-foot-wrap">
            <p data-region="readout" class="cal-readout"></p>
            <div class="cal-foot">
              <label class="cal-invitee">
                <span>Invitee</span>
                <input type="email" data-field="invitee" value="${escapeAttr(inviteeEmail)}"
                       placeholder="buyer@example.com" aria-label="Invitee email">
              </label>
              <button type="button" class="invite-btn" data-action="send-invite" disabled>
                <svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>
                Send invite
              </button>
            </div>
          </div>
        </div>
      `;
    }

    function render() {
      const grid = container.querySelector("[data-region='grid']");
      if (!grid) return;
      const cells = [];
      cells.push(`<div class="cal-head cal-head--corner"></div>`);
      DAYS.forEach((d, i) => {
        const cls = i === todayIdx ? "cal-head cal-head--today" : "cal-head";
        cells.push(`<div class="${cls}"><span>${d}</span><span class="cal-head__n">${dates[i].getDate()}</span></div>`);
      });
      BANDS.forEach(b => {
        cells.push(`<div class="cal-time">${b}</div>`);
        DAYS.forEach(d => {
          const s = slots.find(x => x.day === d && x.time === b);
          const status = s?.status ?? "free";
          const label  = s?.label || "";
          const labelHtml = label
            ? `<span class="cal-slot__label">${escapeHtml(label)}</span>`
            : "";
          cells.push(`
            <button type="button" class="cal-slot"
              data-status="${status}"
              data-slot="${escapeAttr(s?.slot_id ?? "")}"
              aria-label="${escapeAttr(`${d} ${b} ${status}${label ? ' · ' + label : ''}`)}">
              ${labelHtml}
            </button>
          `);
        });
      });
      grid.innerHTML = cells.join("");

      const readout  = container.querySelector("[data-region='readout']");
      const selected = slots.filter(s => s.status === "selected");
      if (readout) {
        if (selected.length === 0) {
          readout.textContent = `Read the two suggested times out loud, for example "${suggestedSummary()}".`;
          readout.classList.remove("is-success");
        } else {
          readout.textContent = selected.length === 1
            ? `You picked ${selected[0].day} ${selected[0].time}. Pick one more time.`
            : `You picked ${selected.map(s => `${s.day} ${s.time}`).join(" and ")}.`;
          readout.classList.remove("is-success");
        }
      }
      const btn = container.querySelector("[data-action='send-invite']");
      if (btn) /** @type {HTMLButtonElement} */ (btn).disabled =
        !(selected.length === 2 && inviteeEmail.includes("@"));
    }

    function suggestedSummary() {
      const sug = slots.filter(s => s.status === "suggested");
      return sug.length >= 2
        ? sug.slice(0, 2).map(s => spokenSlot(`${s.day} ${s.time}`)).join(" or ")
        : DEFAULT_SUGGESTED.map(spokenSlot).join(" or ");
    }

    function bind() {
      container.addEventListener("click", e => {
        const cell = e.target instanceof Element ? e.target.closest("[data-slot]") : null;
        if (cell) {
          const id = cell.getAttribute("data-slot");
          const s = slots.find(x => x.slot_id === id);
          if (!s || s.status === "busy" || s.status === "past") return;
          const currentlySelected = slots.filter(x => x.status === "selected").length;
          if (s.status === "selected") {
            const wasSug = suggestedIds.has(s.slot_id);
            s.status = wasSug ? "suggested" : "free";
            s.label  = wasSug ? `Suggest · ${suggestFor}` : "";
          } else {
            if (currentlySelected >= 2) return;
            s.status = "selected";
            s.label  = s.label || "Selected slot";
          }
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
      selected.forEach(s => { s.label = `📨 Sent · ${(inviteeEmail.split("@")[0] || "buyer")}`; });
      render();
      // Apply success text AFTER render so it isn't overwritten by render's readout logic.
      const readout = container.querySelector("[data-region='readout']");
      if (readout) {
        readout.classList.add("is-success");
        readout.textContent = `✓ Invite sent to ${inviteeEmail} for ${selected.map(s => `${s.day} ${s.time}`).join(" or ")}.`;
      }
    }

    bind();

    const onPeek = () => render();
    eventBus.addEventListener("calendar:peek", onPeek);

    return {
      /** Re-opening for another buyer: new suggested slots and invitee, nothing selected. */
      update(opts = {}) {
        if (opts.suggestFor || opts.suggestedSlots) {
          suggestFor = opts.suggestFor ?? suggestFor;
          const sug = opts.suggestedSlots ?? DEFAULT_SUGGESTED;
          suggestedIds = new Set(sug.map(x => String(x).replace(" ", "-")));
          slots = defaultSlots(sug, suggestFor);
        }
        if (typeof opts.invitee_email === "string") {
          inviteeEmail = opts.invitee_email;
          const input = container.querySelector("[data-field='invitee']");
          if (input) input.value = inviteeEmail;
        }
        render();
      },
      destroy() { eventBus.removeEventListener("calendar:peek", onPeek); },
    };
  },
});

function escapeAttr(s) { return String(s ?? "").replace(/[<>&"]/g, c => ({ "<":"&lt;",">":"&gt;","&":"&amp;","\"":"&quot;" }[c])); }
function escapeHtml(s) { return String(s ?? "").replace(/[<>&]/g, c => ({ "<":"&lt;",">":"&gt;","&":"&amp;" }[c])); }
