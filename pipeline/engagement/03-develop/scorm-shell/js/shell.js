/**
 * shell.js · mini-OS window manager + app launcher + module boot.
 *
 * Public surface (module-consumer-facing):
 *   import { MiniOS, eventBus, scorm, coachMarks, bootModule } from ".../shell.js";
 *
 * Decisions backing this file:
 *   D-005 custom SCORM 1.2 (no third-party authoring tool)
 *   D-006 no audio   (signalling is visual + text + aria-live)
 *   D-007 mini-OS    (modules simulate workspace, not slideware)
 *
 * @see 02-design/ux-design-system.md §3 (window-manager) + §6 (signalling)
 */

import { ScormBridge } from "./scorm-bridge.js";
import { EventLog, EVENT } from "./event-log.js";
import { coachMarks } from "./coach-marks.js";
import { appRegistry, icon } from "./apps/registry.js";

// Eager-import every app so registerApp() side-effects populate the registry
// before any consumer calls MiniOS.openApp(). Browsers cache by URL, so
// re-imports inside individual modules are free.
import "./apps/outreach.js?v=20260519d";
import "./apps/gong.js?v=20260519d";
import "./apps/salesforce.js?v=20260519d";
import "./apps/linkedin-ch.js?v=20260519d";
import "./apps/calendar.js?v=20260519d";
import "./apps/phone-dialler.js?v=20260519d";
import "./apps/slack.js?v=20260519d";

/** Shared inter-app + telemetry event bus. */
export const eventBus = new EventTarget();

/** Shared SCORM bridge instance — one per page. */
export const scorm = new ScormBridge();

export { coachMarks };

const DEBUG = new URLSearchParams(globalThis.location?.search ?? "").has("debug");

/**
 * @typedef {object} WindowHandle
 * @property {string} appId
 * @property {HTMLElement} el           the .os-window node
 * @property {HTMLElement} body         the .os-window-body inner node
 * @property {{ update?:(opts:any)=>void, destroy?:()=>void } & Record<string,any>} api
 * @property {() => void} focus
 * @property {() => void} close
 */

/**
 * The window manager + app launcher.
 */
export class MiniOS {
  /**
   * @param {object} [opts]
   * @param {HTMLElement} [opts.desktop]    defaults to #desktop
   * @param {HTMLElement} [opts.taskbar]    defaults to #taskbar-list
   * @param {HTMLElement} [opts.announcer]  defaults to #focus-announcer
   * @param {EventTarget} [opts.eventBus]
   */
  constructor(opts = {}) {
    this.desktop = opts.desktop ?? document.getElementById("desktop");
    this.taskbarList = opts.taskbar ?? document.getElementById("taskbar-list");
    this.announcer = opts.announcer ?? document.getElementById("focus-announcer");
    this.bus = opts.eventBus ?? eventBus;
    /** @type {Map<string, WindowHandle>} */
    this.windows = new Map();
    /** @type {string|null} */
    this.focusedId = null;
    this._zSeed = 100;
    this._winSeed = 0;
    this._hideEmptyState();
    this._bindGlobalKeys();
  }

  /**
   * Launch an app. If already open, focuses the existing window.
   * @param {string} appId
   * @param {object} [options]   passed verbatim to the app's mount(ctx).options
   * @returns {WindowHandle|null}
   */
  openApp(appId, options = {}) {
    const def = appRegistry.get(appId);
    if (!def) {
      console.warn(`[mini-os] unknown app "${appId}"`);
      return null;
    }
    // Singleton per app id — focus existing if already up.
    const existing = [...this.windows.values()].find(w => w.appId === appId);
    if (existing) { existing.focus(); return existing; }

    const winId = `w-${++this._winSeed}`;
    const el = this._buildWindowDom(winId, def);
    this.desktop.appendChild(el);
    this._positionInitial(el);

    const body = /** @type {HTMLElement} */ (el.querySelector(".os-window-body"));
    body.classList.add(`app--${appId}`);

    /** @type {WindowHandle} */
    const handle = {
      appId,
      el,
      body,
      api: {},
      focus: () => this._focusWindow(winId),
      close: () => this.closeApp(handle),
    };

    const mountCtx = {
      container: body,
      eventBus: this.bus,
      openApp: (id, o) => this.openApp(id, o),
      options,
    };
    try {
      handle.api = def.mount(mountCtx) ?? {};
    } catch (e) {
      console.error(`[mini-os] mount() failed for "${appId}"`, e);
    }

    this.windows.set(winId, handle);
    this._addTaskbarEntry(winId, def);
    this._announce(`${def.name} app opened`);
    this._focusWindow(winId);
    this.bus.dispatchEvent(new CustomEvent("app:opened", { detail: { appId, winId } }));
    if (DEBUG) console.debug("[mini-os] opened", appId, winId);
    return handle;
  }

  /**
   * Close an open window.
   * @param {WindowHandle|string} handleOrId
   */
  closeApp(handleOrId) {
    const winId = typeof handleOrId === "string" ? handleOrId : this._findWinId(handleOrId);
    if (!winId) return;
    const handle = this.windows.get(winId);
    if (!handle) return;
    try { handle.api.destroy?.(); } catch (e) { console.warn("[mini-os] destroy()", e); }
    handle.el.remove();
    this.windows.delete(winId);
    this._removeTaskbarEntry(winId);
    if (this.focusedId === winId) this.focusedId = null;
    const next = [...this.windows.keys()].pop();
    if (next) this._focusWindow(next);
    this._announce(`${handle.appId} app closed`);
    this.bus.dispatchEvent(new CustomEvent("app:closed", { detail: { appId: handle.appId, winId } }));
  }

  /** @returns {WindowHandle[]} */
  listWindows() { return [...this.windows.values()]; }

  /** Cycle focus between windows (F6). */
  cycleFocus(direction = 1) {
    const ids = [...this.windows.keys()];
    if (ids.length === 0) return;
    const i = ids.indexOf(this.focusedId ?? ids[0]);
    const next = ids[(i + direction + ids.length) % ids.length];
    this._focusWindow(next);
  }

  // --- private --------------------------------------------------------------

  _findWinId(handle) {
    for (const [id, h] of this.windows) if (h === handle) return id;
    return null;
  }

  _focusWindow(winId) {
    const handle = this.windows.get(winId);
    if (!handle) return;
    this.focusedId = winId;
    for (const [id, h] of this.windows) {
      h.el.setAttribute("data-focused", id === winId ? "true" : "false");
    }
    handle.el.style.zIndex = String(++this._zSeed + 100);
    const focusable = handle.body.querySelector("button, [tabindex], a, input, select, textarea");
    if (focusable instanceof HTMLElement) focusable.focus({ preventScroll: true });
    this._announce(`${handle.appId} window focused`);
    this._updateTaskbarPressed(winId);
  }

  _buildWindowDom(winId, def) {
    const el = document.createElement("section");
    el.className = `os-window app--${def.id}`;
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", def.name);
    el.dataset.winId = winId;
    el.dataset.appId = def.id;
    const w = def.defaultSize?.w ?? 480;
    const h = def.defaultSize?.h ?? 360;
    el.style.width  = `${w}px`;
    el.style.height = `${h}px`;
    el.innerHTML = `
      <header class="os-window-titlebar" data-region="titlebar">
        <div class="os-window-title">
          <span class="app-glyph" aria-hidden="true">${def.id.slice(0,1).toUpperCase()}</span>
          ${icon(def.iconName)} ${def.name}
        </div>
        <div class="os-window-controls">
          <button type="button" data-action="maximize" aria-label="Maximize ${def.name}" title="Maximize / restore">▢</button>
          <button type="button" data-action="close" aria-label="Close ${def.name}">${icon("x")}</button>
        </div>
      </header>
      <div class="os-window-body"></div>
      <div class="os-window-resize" data-action="resize" aria-hidden="true"></div>
    `;
    el.addEventListener("mousedown", () => this._focusWindow(winId), true);
    el.querySelector("[data-action='close']")?.addEventListener("click", () => this.closeApp(winId));
    el.querySelector("[data-action='maximize']")?.addEventListener("click", () => this._toggleMaximize(winId));
    this._makeDraggable(el);
    this._makeResizable(el);
    return el;
  }

  /**
   * Place a new window next to existing ones, not cascading on top.
   *
   * Strategy:
   *   1. If existing windows in the top row, try placing right-of with PAD.
   *      If width doesn't fit, SHRINK the new window's width to fit the
   *      remaining horizontal space (preserve aspect, clamp to 280 min).
   *   2. Else try placing below the first row.
   *   3. Else top-left with small cascade.
   */
  _positionInitial(el) {
    const PAD = 16;
    const MIN_W = 280;
    const MIN_H = 220;
    let w = parseInt(el.style.width)  || 480;
    let h = parseInt(el.style.height) || 360;
    const ratio = w / h;
    const desktop = document.getElementById("desktop");
    const dRect = desktop?.getBoundingClientRect();
    const maxW = (dRect?.width  ?? 1200);
    const maxH = (dRect?.height ?? 700);
    const existing = [...this.windows.values()]
      .filter(h => h.el !== el)
      .map(h => h.el.getBoundingClientRect());
    const dOff = dRect ? { x: dRect.left, y: dRect.top } : { x: 0, y: 0 };

    let placed = false;
    if (existing.length > 0) {
      const topRow = existing.filter(r => (r.top - dOff.y) < PAD + 50);
      if (topRow.length) {
        const rightmost = Math.max(...topRow.map(r => (r.right - dOff.x)));
        const spaceRight = maxW - rightmost - PAD * 2;
        if (spaceRight >= MIN_W) {
          // If full width doesn't fit, shrink to spaceRight (preserve aspect).
          if (w > spaceRight) {
            w = spaceRight;
            h = Math.max(MIN_H, Math.round(w / ratio));
            el.style.width  = `${w}px`;
            el.style.height = `${h}px`;
          }
          el.style.left = `${rightmost + PAD}px`;
          el.style.top  = `${PAD}px`;
          placed = true;
        }
      }
      if (!placed) {
        const rowH = Math.max(...existing.map(r => r.bottom - dOff.y));
        const spaceBelow = maxH - rowH - PAD * 2;
        if (spaceBelow >= MIN_H) {
          if (h > spaceBelow) {
            h = spaceBelow;
            w = Math.max(MIN_W, Math.round(h * ratio));
            el.style.width  = `${w}px`;
            el.style.height = `${h}px`;
          }
          el.style.left = `${PAD}px`;
          el.style.top  = `${rowH + PAD}px`;
          placed = true;
        }
      }
    }
    if (!placed) {
      const idx = this.windows.size;
      el.style.left = `${PAD + (idx % 4) * 20}px`;
      el.style.top  = `${PAD + (idx % 4) * 20}px`;
    }
  }

  /**
   * Toggle window to fill the desktop area, or restore prior bounds.
   * Stores prior bounds on the element so restore is exact.
   */
  _toggleMaximize(winId) {
    const handle = this.windows.get(winId);
    if (!handle?.el) return;
    const el = handle.el;
    if (el.dataset.maximized === "true") {
      const prior = JSON.parse(el.dataset.priorBounds || "{}");
      el.style.left   = prior.left   ?? "16px";
      el.style.top    = prior.top    ?? "16px";
      el.style.width  = prior.width  ?? "480px";
      el.style.height = prior.height ?? "360px";
      el.dataset.maximized = "false";
    } else {
      el.dataset.priorBounds = JSON.stringify({
        left: el.style.left, top: el.style.top,
        width: el.style.width, height: el.style.height,
      });
      const desktop = document.getElementById("desktop");
      const rect = desktop?.getBoundingClientRect();
      const pad = 8;
      el.style.left = `${pad}px`;
      el.style.top  = `${pad}px`;
      el.style.width  = `${(rect?.width  ?? 1200) - pad * 2}px`;
      el.style.height = `${(rect?.height ?? 700)  - pad * 2}px`;
      el.dataset.maximized = "true";
    }
    this._focusWindow(winId);
  }

  _makeDraggable(el) {
    const handle = el.querySelector("[data-region='titlebar']");
    if (!handle) return;
    let startX = 0, startY = 0, origLeft = 0, origTop = 0, dragging = false;
    const onDown = (e) => {
      if (e.target instanceof Element && e.target.closest("[data-action='close']")) return;
      dragging = true;
      startX = e.clientX; startY = e.clientY;
      origLeft = parseInt(el.style.left || "0", 10);
      origTop  = parseInt(el.style.top  || "0", 10);
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp, { once: true });
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!dragging) return;
      el.style.left = `${origLeft + (e.clientX - startX)}px`;
      el.style.top  = `${origTop  + (e.clientY - startY)}px`;
    };
    const onUp = () => { dragging = false; document.removeEventListener("mousemove", onMove); };
    handle.addEventListener("mousedown", onDown);
  }

  _makeResizable(el) {
    const grip = el.querySelector("[data-action='resize']");
    if (!grip) return;
    let startX = 0, startY = 0, origW = 0, origH = 0, resizing = false;
    const minW = 360, minH = 220;
    const onDown = (e) => {
      resizing = true;
      startX = e.clientX; startY = e.clientY;
      const rect = el.getBoundingClientRect();
      origW = rect.width; origH = rect.height;
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp, { once: true });
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!resizing) return;
      el.style.width  = `${Math.max(minW, origW + (e.clientX - startX))}px`;
      el.style.height = `${Math.max(minH, origH + (e.clientY - startY))}px`;
    };
    const onUp = () => { resizing = false; document.removeEventListener("mousemove", onMove); };
    grip.addEventListener("mousedown", onDown);
  }

  _addTaskbarEntry(winId, def) {
    if (!this.taskbarList) return;
    const li = document.createElement("li");
    li.innerHTML = `
      <button type="button" class="taskbar-item" data-win-id="${winId}" aria-pressed="false">
        <span class="dot"></span>${icon(def.iconName)} ${def.name}
      </button>
    `;
    li.querySelector("button")?.addEventListener("click", () => this._focusWindow(winId));
    this.taskbarList.appendChild(li);
  }
  _removeTaskbarEntry(winId) {
    this.taskbarList?.querySelector(`[data-win-id='${winId}']`)?.closest("li")?.remove();
  }
  _updateTaskbarPressed(winId) {
    this.taskbarList?.querySelectorAll(".taskbar-item").forEach(btn => {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-win-id") === winId ? "true" : "false");
    });
  }

  _hideEmptyState() {
    const empty = document.getElementById("desktop-empty-state");
    if (empty && this.windows.size > 0) empty.hidden = true;
  }

  _announce(msg) {
    if (this.announcer) this.announcer.textContent = msg;
  }

  _bindGlobalKeys() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "F6") {
        e.preventDefault();
        this.cycleFocus(e.shiftKey ? -1 : 1);
        return;
      }
      if (e.ctrlKey && e.key === "Tab") {
        e.preventDefault();
        this.cycleFocus(e.shiftKey ? -1 : 1);
        return;
      }
      if (e.key === "Escape" && this.focusedId) {
        const handle = this.windows.get(this.focusedId);
        if (handle?.el.dataset.dismissible === "true") this.closeApp(this.focusedId);
      }
    });
  }
}

// =============================================================================
// bootModule() — module entry-point
// =============================================================================

/**
 * @typedef {object} BootConfig
 * @property {string} moduleId
 * @property {string} [title]
 * @property {Array<{id:string, options?:object}>} [appsToLaunch]
 * @property {(api:BootApi)=>void} [onReady]
 * @property {(api:BootApi)=>void} [onComplete]
 */

/**
 * @typedef {object} BootApi
 * @property {MiniOS} os
 * @property {ScormBridge} scorm
 * @property {EventLog} eventLog
 * @property {EventTarget} eventBus
 * @property {typeof coachMarks} coachMarks
 * @property {(score?:number) => void} complete
 * @property {(score:number, max?:number) => void} fail
 */

/**
 * Top-level entry called from a module's index.html.
 *
 * @param {BootConfig} config
 * @returns {BootApi}
 */
export function bootModule(config) {
  if (!config?.moduleId) throw new Error("bootModule: moduleId required");
  scorm.initialize();
  const os = new MiniOS();
  const eventLog = new EventLog({ moduleId: config.moduleId, eventBus, scorm });

  if (config.title) {
    const titleEl = document.getElementById("module-title");
    if (titleEl) titleEl.textContent = config.title;
  }

  eventLog.record(EVENT.MODULE_STARTED, { title: config.title ?? null });

  for (const a of (config.appsToLaunch ?? [])) os.openApp(a.id, a.options ?? {});

  /** @type {BootApi} */
  const api = {
    os, scorm, eventLog, eventBus, coachMarks,
    complete(score) {
      eventLog.record(EVENT.MODULE_COMPLETED, { score: score ?? null });
      scorm.setStatus("completed");
      if (typeof score === "number") scorm.setScore(score);
      scorm.commit();
      config.onComplete?.(api);
    },
    fail(score, max) {
      scorm.setStatus("failed");
      scorm.setScore(score, 0, max ?? 100);
      scorm.commit();
    },
  };

  config.onReady?.(api);

  globalThis.addEventListener?.("pagehide", () => {
    eventLog.destroy();
    scorm.terminate();
  }, { once: true });

  return api;
}

// =============================================================================
// Preview-page wiring (only fires on index.html — no-op inside real modules
// because they replace #desktop-empty-state markup).
// =============================================================================

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const isPreview = document.getElementById("desktop-empty-state");
    if (!isPreview) return;
    scorm.initialize();
    const os = new MiniOS();
    new EventLog({ moduleId: "preview", eventBus, scorm });
    document.querySelectorAll("[data-launch]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-launch");
        if (id) {
          os.openApp(id);
          const empty = document.getElementById("desktop-empty-state");
          if (empty) empty.hidden = true;
        }
      });
    });
    if (DEBUG) console.debug("[mini-os] preview ready · apps:", [...appRegistry.keys()]);
  });
}

export default { MiniOS, eventBus, scorm, coachMarks, bootModule };
