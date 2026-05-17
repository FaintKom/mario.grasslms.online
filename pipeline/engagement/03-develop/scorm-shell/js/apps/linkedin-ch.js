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
  defaultSize: { w: 620, h: 440 },
  mount(ctx) {
    const { container, options = {} } = ctx;
    /** @type {any[]} */
    let profiles = Array.isArray(options.profiles) ? options.profiles.slice() : [];
    let activeId = options.activeProfileId ?? null;

    container.classList.add("app--linkedin-ch");
    container.innerHTML = renderShell();

    function renderShell() {
      return `
        <form class="lch-search" role="search" data-region="search">
          <label class="sr-only" for="lch-q">Search company</label>
          <input id="lch-q" type="search" placeholder="Search company name…" autocomplete="off">
          <button type="submit">${icon("focus","Search")} Search</button>
        </form>
        <div data-region="result"></div>
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
            <h3>${icon("users","LinkedIn")} ${escapeHtml(p.company)} — LinkedIn</h3>
            <div class="meta">${escapeHtml(p.industry)} · ${p.fte} FTE · ${escapeHtml(p.stage ?? "—")}</div>
            ${liSignals.map(renderSignal).join("") || "<p class='empty'>No recent posts.</p>"}
          </section>
          <section class="lch-panel ch" aria-label="Companies House filings">
            <h3>${icon("shieldCheck","Companies House")} ${escapeHtml(p.company)} — Companies House</h3>
            <div class="meta">Reg. office: ${escapeHtml(p.registered_office ?? "—")}</div>
            ${chSignals.map(renderSignal).join("") || "<p class='empty'>No recent filings.</p>"}
          </section>
        </div>
        <p style="margin-top:12px;font-size:12px;color:var(--ftc-ink-2)">
          Pain: <strong>${escapeHtml(p.top_pain ?? "—")}</strong> · Top objection: <strong>${escapeHtml(p.top_objection ?? "—")}</strong>
        </p>
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
