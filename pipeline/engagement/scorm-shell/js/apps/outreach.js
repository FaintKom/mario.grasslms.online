/**
 * outreach.js · simulated Outreach app.
 *
 * Dial-queue list + sequence-step view + filter by industry / FTE band.
 * Clicking "Dial" fires `phone:dial` event with the prospect payload + a
 * telemetry `phone_dial_attempt` event (so the M3 habit-gate can read
 * whether Calendar was already open).
 *
 * @see 02-design/ux-design-system.md §4.1
 */

import { registerApp, icon } from "./registry.js";
import { EVENT } from "../event-log.js";

const ARCHETYPES = {
  storefront: { label: "Retail SMB",        glyph: "storefront" },
  rocket:     { label: "Series-B SaaS",     glyph: "rocket"     },
  factory:    { label: "Manufacturing",     glyph: "factory"    },
  forkKnife:  { label: "Restaurant group",  glyph: "forkKnife"  },
};

const FTE_BANDS = [
  { id: "any",   label: "Any FTE",          test: () => true                  },
  { id: "lt50",  label: "< 50 FTE",         test: l => l.fte < 50             },
  { id: "50-99", label: "50-99 FTE",        test: l => l.fte >= 50 && l.fte < 100 },
  { id: "100+",  label: "100+ FTE",         test: l => l.fte >= 100           },
];

registerApp({
  id: "outreach",
  name: "Outreach",
  iconName: "briefcase",
  defaultSize: { w: 720, h: 560 },
  mount(ctx) {
    const { container, eventBus, openApp, options = {} } = ctx;
    let leads = Array.isArray(options.leads) ? options.leads.slice() : null;
    let activeIndustry = "any";
    let activeFte = "any";

    container.classList.add("app--outreach");
    container.innerHTML = renderShell();

    /** @returns {HTMLElement} */
    const queueEl = () => /** @type {HTMLElement} */ (container.querySelector("[data-region='queue']"));

    function bindFilters() {
      const industrySel = /** @type {HTMLSelectElement} */ (container.querySelector("[data-filter='industry']"));
      const fteSel = /** @type {HTMLSelectElement} */ (container.querySelector("[data-filter='fte']"));
      industrySel?.addEventListener("change", () => { activeIndustry = industrySel.value; render(); });
      fteSel?.addEventListener("change", () => { activeFte = fteSel.value; render(); });
    }

    function bindRows() {
      queueEl().addEventListener("click", e => {
        const btn = /** @type {HTMLElement} */ (e.target instanceof Element ? e.target.closest("[data-action='dial']") : null);
        if (!btn) return;
        const id = btn.getAttribute("data-lead-id");
        const prospect = leads?.find(l => l.lead_id === id);
        if (!prospect) return;
        dial(prospect);
      });
    }

    function dial(prospect) {
      const calendarOpen = Boolean(document.querySelector(".os-window.app--calendar"));
      eventBus.dispatchEvent(new CustomEvent("phone:dial", { detail: { prospect } }));
      eventBus.dispatchEvent(new CustomEvent("telemetry", {
        detail: {
          event_name: EVENT.PHONE_DIAL_ATTEMPT,
          lead_id: prospect.lead_id,
          archetype: prospect.archetype,
          calendar_open_before_dial: calendarOpen,
        },
      }));
      openApp?.("phone-dialler", { prospect });
    }

    function render() {
      const list = (leads ?? []).filter(l => {
        if (activeIndustry !== "any" && l.archetype !== activeIndustry) return false;
        const band = FTE_BANDS.find(b => b.id === activeFte);
        return band ? band.test(l) : true;
      });
      queueEl().innerHTML = list.length === 0
        ? `<p class="empty">No leads match those filters.</p>`
        : list.map(renderRow).join("");
      const cnt = container.querySelector("[data-region='count']");
      if (cnt) cnt.textContent = String(list.length);
    }

    function renderRow(l) {
      const a = ARCHETYPES[l.archetype] ?? { label: l.archetype, glyph: "building" };
      return `
        <div class="lead-row" role="listitem">
          <div>
            <div>
              ${icon(a.glyph, a.label)}
              <span class="name">${escapeHtml(l.name)}</span>
              <span class="sequence-step">step ${l.sequence_step}/7</span>
            </div>
            <div class="meta">${escapeHtml(l.company)} · ${a.label} · ${l.fte} FTE · last touch ${escapeHtml(l.last_touch_at?.slice(0,10) ?? "—")}</div>
          </div>
          <button type="button" class="dial-btn" data-action="dial" data-lead-id="${escapeAttr(l.lead_id)}" aria-label="Dial ${escapeAttr(l.name)}">
            Dial
          </button>
        </div>`;
    }

    function renderShell() {
      const industryOpts = ['<option value="any">All industries</option>']
        .concat(Object.entries(ARCHETYPES).map(([k, v]) => `<option value="${k}">${v.label}</option>`)).join("");
      const fteOpts = FTE_BANDS.map(b => `<option value="${b.id}">${b.label}</option>`).join("");
      return `
        <div class="brand-app">
          <nav class="oa-rail" aria-label="Outreach product navigation">
            <span class="oa-rail__logo" aria-hidden="true"></span>
            <button type="button" class="oa-rail__item" aria-pressed="true" title="Home" aria-label="Home">
              <svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8M5 9v11h5v-7h4v7h5V9"/></svg>
            </button>
            <button type="button" class="oa-rail__item" title="Prospects" aria-label="Prospects">
              <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-3-3.9M2 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="8" cy="7" r="4"/><circle cx="17" cy="7" r="3"/></svg>
            </button>
            <button type="button" class="oa-rail__item" title="Sequences" aria-label="Sequences">
              <svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18M6 4v4M14 10v4M9 16v4"/></svg>
            </button>
            <button type="button" class="oa-rail__item" title="Calls" aria-label="Calls">
              <svg viewBox="0 0 24 24"><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>
            </button>
            <button type="button" class="oa-rail__item" title="Reports" aria-label="Reports">
              <svg viewBox="0 0 24 24"><path d="M3 21h18M5 18V9m4 9V6m4 12v-3m4 3v-8"/></svg>
            </button>
            <span class="oa-rail__spacer"></span>
            <span class="oa-rail__avatar" aria-hidden="true">MB</span>
          </nav>
          <section class="oa-workspace">
            <header class="oa-header">
              <h1>Dial queue</h1>
              <span class="oa-header__count" data-region="count">·</span>
              <span class="oa-header__spacer"></span>
              <button type="button" class="oa-header__btn--ghost oa-header__btn">Bulk actions</button>
              <button type="button" class="oa-header__btn">+ New sequence</button>
            </header>
            <div class="oa-filters">
              <div class="dial-queue__filters" role="group" aria-label="Filter leads">
                <label class="sr-only" for="oa-ind">Industry</label>
                <select id="oa-ind" data-filter="industry">${industryOpts}</select>
                <label class="sr-only" for="oa-fte">Headcount</label>
                <select id="oa-fte" data-filter="fte">${fteOpts}</select>
              </div>
              <span class="oa-filter-chip oa-filter-chip--active">Today · Active</span>
              <span class="oa-filter-chip">Stalled</span>
              <span class="oa-filter-chip">Replied</span>
            </div>
            <div class="oa-queue">
              <div class="dial-queue" role="list" data-region="queue"></div>
            </div>
          </section>
        </div>
      `;
    }

    async function ensureLeads() {
      if (leads) return;
      try {
        const res = await fetch(new URL("../../data/sample-profiles.json", import.meta.url));
        leads = await res.json();
      } catch (e) {
        console.warn("[outreach] could not load sample-profiles.json — empty queue", e);
        leads = [];
      }
    }

    bindFilters();
    bindRows();
    (async () => { await ensureLeads(); render(); })();

    return {
      update(opts) {
        if (opts?.leads) { leads = opts.leads; render(); }
      },
      destroy() { /* no listeners outside container */ },
    };
  },
});

function escapeHtml(s) { return String(s ?? "").replace(/[<>&]/g, c => ({ "<":"&lt;",">":"&gt;","&":"&amp;" }[c])); }
function escapeAttr(s) { return escapeHtml(s).replace(/"/g, "&quot;"); }
