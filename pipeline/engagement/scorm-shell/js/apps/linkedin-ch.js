/**
 * linkedin-ch.js · combined LinkedIn + Companies House lookup.
 *
 * Search by company name → split panel:
 *  - LinkedIn snapshot (headcount, recent posts, new locations)
 *  - Companies House filing (registered office, recent filings)
 *
 * The M.G. opener pattern in §10.1 ("I noticed you opened a second
 * location in the last 6 months") is sourced from one of the signals
 * surfaced here.
 *
 * @see 02-design/ux-design-system.md §4.4
 */

import { registerApp, icon } from "./registry.js";

registerApp({
  id: "linkedin-ch",
  name: "LinkedIn / Companies House",
  iconName: "users",
  defaultSize: { w: 760, h: 560 },
  mount(ctx) {
    const { container, options = {} } = ctx;
    /** @type {any[]} */
    let profiles = Array.isArray(options.profiles) ? options.profiles.slice() : [];
    let activeId = options.activeProfileId ?? null;

    container.classList.add("app--linkedin-ch");
    container.innerHTML = renderShell();

    function renderShell() {
      return `
        <div class="brand-app">
          <header class="li-topnav" role="banner">
            <span class="li-topnav__logo" aria-hidden="true"></span>
            <span class="li-topnav__search">Search</span>
            <div class="li-topnav__items">
              <button type="button" class="li-topnav__item">
                <svg viewBox="0 0 24 24"><path d="M11.6 3.2 3 11.6V21h6v-6h6v6h6v-9.4z"/></svg>
                Home
              </button>
              <button type="button" class="li-topnav__item">
                <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-3-3.9M2 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="8" cy="7" r="4"/><circle cx="17" cy="7" r="3"/></svg>
                Network
              </button>
              <button type="button" class="li-topnav__item">
                <svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="14" rx="1"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>
                Jobs
              </button>
              <button type="button" class="li-topnav__item" aria-current="page">
                <svg viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-1 4 8.5 8.5 0 0 1-7.6 4.5 8.4 8.4 0 0 1-4-1L3 21l2-5.4a8.4 8.4 0 0 1-1-4 8.5 8.5 0 0 1 4.5-7.6 8.4 8.4 0 0 1 4-1A8.5 8.5 0 0 1 21 11.5z"/></svg>
                Messaging
              </button>
              <button type="button" class="li-topnav__item">
                <svg viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>
                Notifications
              </button>
            </div>
          </header>
          <div class="li-workspace">
            <form class="lch-search" role="search" data-region="search">
              <label class="sr-only" for="lch-q">Search company</label>
              <input id="lch-q" type="search" placeholder="Search by company name (e.g. Two Pines Apparel)…" autocomplete="off">
              <button type="submit">
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
                Search
              </button>
            </form>
            <div data-region="result"></div>
          </div>
        </div>
      `;
    }

    function renderResult() {
      const el = container.querySelector("[data-region='result']");
      if (!el) return;
      const p = profiles.find(x => x.lead_id === activeId);
      if (!p) {
        el.innerHTML = `<p class="empty">Search to load a profile — or use the Outreach queue to populate one.</p>`;
        return;
      }
      const liSignals = (p.signals ?? []).filter(s => s.source === "linkedin");
      const chSignals = (p.signals ?? []).filter(s => s.source === "companieshouse");
      el.innerHTML = `
        <div class="lch-result">
          <section class="lch-panel linkedin" aria-label="LinkedIn snapshot">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/><path d="M10 9h4v2c.7-1.2 2-2 4-2 4 0 5 2.5 5 6v6h-4v-5c0-1.5 0-3.5-2-3.5s-2.5 1.5-2.5 3.5V21H10z"/></svg>
              ${escapeHtml(p.company)} — LinkedIn
            </h3>
            <div class="meta">${escapeHtml(p.industry)} · ${p.fte} FTE · ${escapeHtml(p.stage ?? "—")}</div>
            ${liSignals.map(renderSignal).join("") || "<p class='empty'>No recent posts.</p>"}
          </section>
          <section class="lch-panel ch" aria-label="Companies House filings">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l8 3v6a9 9 0 0 1-8 9 9 9 0 0 1-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>
              ${escapeHtml(p.company)} — Companies House
            </h3>
            <div class="meta">Reg. office: ${escapeHtml(p.registered_office ?? "—")}</div>
            ${chSignals.map(renderSignal).join("") || "<p class='empty'>No recent filings.</p>"}
          </section>
        </div>
        <div class="lch-summary">
          Pain: <strong>${escapeHtml(p.top_pain ?? "—")}</strong> · Top objection: <strong>${escapeHtml(p.top_objection ?? "—")}</strong>
        </div>
      `;
    }

    function renderSignal(s) {
      return `
        <span class="signal">
          <span class="src">${escapeHtml(s.source)}</span><br>
          ${escapeHtml(s.content)}
        </span>
      `;
    }

    function bindSearch() {
      const form = container.querySelector("[data-region='search']");
      form?.addEventListener("submit", e => {
        e.preventDefault();
        const q = (/** @type {HTMLInputElement} */ (container.querySelector("#lch-q")).value).trim().toLowerCase();
        if (!q) return;
        const match = profiles.find(p =>
          (p.company ?? "").toLowerCase().includes(q) ||
          (p.name ?? "").toLowerCase().includes(q)
        );
        activeId = match?.lead_id ?? activeId;
        renderResult();
      });
    }

    async function ensureProfiles() {
      if (profiles.length) return;
      try {
        const res = await fetch(new URL("../../data/sample-profiles.json", import.meta.url));
        profiles = await res.json();
        if (!activeId && profiles.length) activeId = profiles[0].lead_id;
      } catch (e) {
        console.warn("[linkedin-ch] could not load sample-profiles", e);
      }
    }

    bindSearch();
    (async () => { await ensureProfiles(); renderResult(); })();

    return {
      loadProfile(id) { activeId = id; renderResult(); },
      destroy() {},
    };
  },
});

function escapeHtml(s) { return String(s ?? "").replace(/[<>&]/g, c => ({ "<":"&lt;",">":"&gt;","&":"&amp;" }[c])); }
