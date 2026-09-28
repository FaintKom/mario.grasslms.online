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
    let transcripts = Array.isArray(options.transcripts) ? options.transcripts.map(normalizeTranscript) : null;
    let activeId = options.activeTranscriptId ?? null;
    if (transcripts && !transcripts.some(t => t.id === activeId)) activeId = transcripts[0]?.id ?? null;

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
                  <h3>Move scores (manager view · read-only)</h3>
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
          ${escapeHtml([t.rep, t.who].filter(Boolean).join(" · "))}<br>
          <span class="outcome">${escapeHtml(humanize(t.outcome))}</span>
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
      if (typeof ln.silence === "number") {
        return `
        <div class="turn turn--silence" aria-label="${ln.silence} seconds of silence">
          <span class="ts"></span>
          <span class="speaker"></span>
          <span class="text">(${ln.silence} seconds of silence)</span>
        </div>
      `;
      }
      const tag = ln.m_move_tag ?? null;
      const moveMeta = tag && MOVE_META[tag];
      const fail = tag === "FAIL";
      const ts = ln.timestamp_ms === null ? "" : formatTs(ln.timestamp_ms);
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
        transcripts = (await res.json()).map(normalizeTranscript);
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
        transcripts = Array.isArray(list) ? list.map(normalizeTranscript) : [];
        activeId = transcripts[0]?.id ?? null;
        renderCallList(); renderTranscript();
      },
      /** Called when a module re-opens Gong with new options. */
      update(opts = {}) {
        if (Array.isArray(opts.transcripts)) transcripts = opts.transcripts.map(normalizeTranscript);
        if (opts.activeTranscriptId) activeId = opts.activeTranscriptId;
        if (transcripts && !transcripts.some(t => t.id === activeId)) activeId = transcripts[0]?.id ?? null;
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

const ARCHETYPE_LABEL = { storefront: "Retail SMB", rocket: "Series-B SaaS", factory: "Manufacturing", forkKnife: "Restaurant group" };
const BUYER_NAME = { maria: "Maria", tom: "Tom", emma: "Emma", lukas: "Lukas" };

/**
 * Accept the transcript shapes the modules ship: {lines, timestamp_ms, m_move_tag}
 * (shell), {lines, ts:"mm:ss", {silence:n}} (M2) and {turns, rep_initials, m_move} (M3).
 */
function normalizeTranscript(t) {
  const raw = t.lines ?? t.turns ?? [];
  const prospect = t.prospect_name ?? t.prospect_first_name ?? null;
  const archetype = t.prospect_archetype ?? t.archetype ?? "";
  const rep = t.rep ?? t.rep_initials ?? "";
  const buyer = prospect && prospect !== "buyer" ? prospect : (BUYER_NAME[archetype] ?? null);
  return {
    ...t,
    id: t.id ?? t.gc_id ?? t.clip_id ?? "",
    rep,
    who: buyer ?? ARCHETYPE_LABEL[archetype] ?? archetype,
    outcome: t.outcome ?? "",
    lines: raw.map(ln => {
      if (typeof ln.silence === "number") return { silence: ln.silence };
      let tag = ln.m_move_tag ?? ln.m_move ?? null;
      if (typeof tag === "string") {
        if (/-anti$/i.test(tag)) tag = "FAIL";
        else tag = tag.replace(/-preview$/i, "");
      }
      let speaker = ln.speaker ?? "";
      if (speaker === "Rep" && rep) speaker = rep;
      if (speaker === "Buyer" && buyer) speaker = buyer;
      return {
        ...ln,
        speaker,
        timestamp_ms: typeof ln.timestamp_ms === "number" ? ln.timestamp_ms : parseTs(ln.ts),
        m_move_tag: tag,
      };
    }),
  };
}
function parseTs(ts) {
  const m = /^(\d+):(\d{2})$/.exec(String(ts ?? "").trim());
  return m ? (Number(m[1]) * 60 + Number(m[2])) * 1000 : null;
}
function humanize(s) {
  const t = String(s ?? "").replace(/_/g, " ").trim();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : "";
}
function formatTs(ms) {
  if (typeof ms !== "number") return "—";
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = (totalSec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
function escapeHtml(s) { return String(s ?? "").replace(/[<>&]/g, c => ({ "<":"&lt;",">":"&gt;","&":"&amp;" }[c])); }
function escapeAttr(s) { return escapeHtml(s).replace(/"/g, "&quot;"); }
