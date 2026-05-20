/**
 * gong.js · simulated Gong app.
 *
 * Call-list + transcript viewer with M1/M2/M3 signalling overlay
 * (ux-design-system §6 — three-cue redundancy: chip + icon + label).
 *
 * Module-authors supply transcripts at runtime via the returned
 * `loadTranscripts(arr)` / `loadTranscript(id)` handle methods.
 *
 * @see 02-design/ux-design-system.md §4.2
 */

import { registerApp, icon } from "./registry.js";

const MOVE_META = {
  M1: { label: "Diagnostic",   iconName: "eye"     },
  M2: { label: "Acknowledge",  iconName: "refresh" },
  M3: { label: "Close",        iconName: "calendar"},
};

registerApp({
  id: "gong",
  name: "Gong",
  iconName: "gongWave",
  defaultSize: { w: 820, h: 580 },
  mount(ctx) {
    const { container, options = {} } = ctx;
    /** @type {any[]|null} */
    let transcripts = Array.isArray(options.transcripts) ? options.transcripts.slice() : null;
    let activeId = options.activeTranscriptId ?? null;

    container.classList.add("app--gong");
    container.innerHTML = renderShell();

    const callListEl = () => container.querySelector("[data-region='call-list']");
    const transcriptEl = () => container.querySelector("[data-region='transcript']");

    function renderShell() {
      return `
        <div class="brand-app">
          <nav class="gg-rail" aria-label="Gong product navigation">
            <span class="gg-rail__logo" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M3 12h2"/><path d="M7 8v8"/><path d="M11 5v14"/><path d="M15 9v6"/><path d="M19 11v2"/></svg>
            </span>
            <button type="button" class="gg-rail__item" aria-pressed="true" title="Calls" aria-label="Calls">
              <svg viewBox="0 0 24 24"><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>
            </button>
            <button type="button" class="gg-rail__item" title="Deals" aria-label="Deals">
              <svg viewBox="0 0 24 24"><path d="M3 7h18M5 7v13h14V7M9 11h6"/></svg>
            </button>
            <button type="button" class="gg-rail__item" title="Coaching" aria-label="Coaching">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>
            </button>
            <button type="button" class="gg-rail__item" title="Insights" aria-label="Insights">
              <svg viewBox="0 0 24 24"><path d="M3 21h18M5 18V9m4 9V6m4 12v-3m4 3v-8"/></svg>
            </button>
            <span class="gg-rail__spacer"></span>
          </nav>
          <section class="gg-workspace">
            <header class="gg-topbar">
              <span class="gg-topbar__title">Conversations</span>
              <span class="gg-topbar__search">Search calls, accounts, keywords</span>
              <span class="gg-topbar__spacer"></span>
              <span class="gg-topbar__avatar" aria-hidden="true">MB</span>
            </header>
            <div class="gong-layout">
              <ul class="call-list" role="listbox" aria-label="Calls" data-region="call-list"></ul>
              <div>
                <div class="transcript" role="region" aria-label="Transcript" data-region="transcript"></div>
                <div class="rubric-panel" data-region="rubric" hidden>
                  <h3>L3 rubric (manager view · read-only)</h3>
                  <div class="rubric-body"></div>
                </div>
              </div>
            </div>
          </section>
        </div>
      `;
    }

    function renderCallList() {
      const el = callListEl();
      if (!el) return;
      if (!transcripts || transcripts.length === 0) {
        el.innerHTML = `<li class="empty">No calls loaded.</li>`;
        return;
      }
      el.innerHTML = transcripts.map(t => `
        <li role="option" tabindex="0" data-call-id="${escapeAttr(t.id)}" aria-current="${t.id === activeId ? "true" : "false"}">
          <strong>${escapeHtml(t.id)}</strong><br>
          ${escapeHtml(t.rep)} · ${escapeHtml(t.prospect_archetype)}<br>
          <span class="outcome">${escapeHtml(t.outcome)}</span>
        </li>
      `).join("");
    }

    function renderTranscript() {
      const el = transcriptEl();
      if (!el) return;
      const t = transcripts?.find(x => x.id === activeId);
      if (!t) {
        el.innerHTML = `<p class="empty">Pick a call on the left.</p>`;
        return;
      }
      el.innerHTML = (t.lines ?? []).map(renderLine).join("");
      renderRubric(t);
    }

    /** @param {{timestamp_ms:number,speaker:string,text:string,m_move_tag?:string|null,m_move_quality?:number}} ln */
    function renderLine(ln) {
      const tag = ln.m_move_tag ?? null;
      const moveMeta = tag && MOVE_META[tag];
      const fail = tag === "FAIL";
      const ts = formatTs(ln.timestamp_ms);
      const chip = moveMeta
        ? `<span class="m-chip" data-move="${tag}">${icon(moveMeta.iconName, moveMeta.label + " move")}[${tag}]</span>`
        : fail ? `<span class="m-chip" data-move="FAIL">${icon("warning","Failure pattern")}[FAIL]</span>` : "";
      const dataAttrs = tag
        ? (fail ? `data-fail="true"` : `data-m="${tag}"`)
        : "";
      return `
        <div class="turn" ${dataAttrs}>
          <span class="ts">${ts}</span>
          <span class="speaker">${escapeHtml(ln.speaker)}</span>
          <span class="text">${chip} ${escapeHtml(ln.text)}</span>
        </div>
      `;
    }

    function renderRubric(t) {
      const panel = container.querySelector("[data-region='rubric']");
      if (!panel) return;
      const tagged = (t.lines ?? []).filter(l => l.m_move_tag && l.m_move_tag !== "FAIL");
      if (tagged.length === 0) { panel.setAttribute("hidden",""); return; }
      panel.removeAttribute("hidden");
      const rows = tagged.map(l => `
        <div class="rubric-row">
          <span class="m-chip" data-move="${l.m_move_tag}">[${l.m_move_tag}]</span>
          <span>${formatTs(l.timestamp_ms)}</span>
          <span class="rubric-q">quality: <strong>${l.m_move_quality ?? "—"}</strong>/5</span>
        </div>
      `).join("");
      panel.querySelector(".rubric-body").innerHTML = rows;
    }

    function bindCallSelection() {
      callListEl()?.addEventListener("click", e => {
        const li = e.target instanceof Element ? e.target.closest("[data-call-id]") : null;
        if (!li) return;
        activeId = li.getAttribute("data-call-id");
        renderCallList();
        renderTranscript();
      });
      callListEl()?.addEventListener("keydown", e => {
        if (e.key !== "Enter" && e.key !== " ") return;
        const li = e.target instanceof Element ? e.target.closest("[data-call-id]") : null;
        if (!li) return;
        e.preventDefault();
        activeId = li.getAttribute("data-call-id");
        renderCallList();
        renderTranscript();
      });
    }

    async function ensureTranscripts() {
      if (transcripts) return;
      try {
        const res = await fetch(new URL("../../data/sample-gong-transcripts.json", import.meta.url));
        transcripts = await res.json();
        if (!activeId && transcripts.length) activeId = transcripts[0].id;
      } catch (e) {
        console.warn("[gong] could not load sample transcripts", e);
        transcripts = [];
      }
    }

    bindCallSelection();
    (async () => { await ensureTranscripts(); renderCallList(); renderTranscript(); })();

    return {
      /** Replace the full transcript set. */
      loadTranscripts(list) {
        transcripts = Array.isArray(list) ? list.slice() : [];
        activeId = transcripts[0]?.id ?? null;
        renderCallList(); renderTranscript();
      },
      /** Make a specific transcript the active one. */
      loadTranscript(id) {
        activeId = id;
        renderCallList(); renderTranscript();
      },
      destroy() {},
    };
  },
});

function formatTs(ms) {
  if (typeof ms !== "number") return "—";
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = (totalSec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
function escapeHtml(s) { return String(s ?? "").replace(/[<>&]/g, c => ({ "<":"&lt;",">":"&gt;","&":"&amp;" }[c])); }
function escapeAttr(s) { return escapeHtml(s).replace(/"/g, "&quot;"); }
