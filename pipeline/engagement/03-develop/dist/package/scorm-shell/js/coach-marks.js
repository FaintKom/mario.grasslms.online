/**
 * coach-marks.js · in-context job-aid overlay.
 *
 * Per 02-design/ux-design-system §11 + Rossett & Schafer 2007 (point-of-use
 * support) + Mayer spatial-contiguity (Mayer 2014 ch. 8) — coach-marks anchor
 * to the UI element they describe, not a separate overlay area.
 *
 * Each coach-mark has a stable `id`; dismissals persist in localStorage so
 * a learner doesn't re-see the same explanation on every module re-entry.
 *
 * Consumers:
 *  - js/shell.js (re-exports as `coachMarks`)
 *  - js/apps/*.js (call coachMarks.show({...}) on first mount)
 */

const STORAGE_PREFIX = "ftc-coachmark-";

/**
 * @typedef {object} CoachMarkConfig
 * @property {string} id                stable id for dismiss persistence
 * @property {Element|string} anchor    DOM element or CSS selector to anchor to
 * @property {string} text              one-sentence explanation (≤ 90 chars ideal)
 * @property {"top"|"bottom"|"left"|"right"} [placement="bottom"]
 * @property {boolean} [persistDismiss=true]
 * @property {() => void} [onDismiss]
 */

export class CoachMarks {
  constructor() {
    /** @type {Map<string, HTMLElement>} */
    this._active = new Map();
    /** @type {HTMLElement|null} */
    this._root = null;
    this._initRoot();
    this._onKeydown = this._onKeydown.bind(this);
    this._onResize = this._onResize.bind(this);
    globalThis.addEventListener?.("keydown", this._onKeydown);
    globalThis.addEventListener?.("resize", this._onResize);
    globalThis.addEventListener?.("scroll", this._onResize, true);
  }

  /** @private */
  _initRoot() {
    if (typeof document === "undefined") return;
    this._root = /** @type {HTMLElement} */ (document.getElementById("coachmark-root"));
    if (!this._root) {
      this._root = document.createElement("div");
      this._root.id = "coachmark-root";
      this._root.setAttribute("aria-hidden", "true");
      document.body.appendChild(this._root);
    }
  }

  /**
   * Show a coach-mark. No-op if previously dismissed (unless persistDismiss=false).
   * @param {CoachMarkConfig} cfg
   * @returns {HTMLElement|null}  the rendered overlay, or null if suppressed
   */
  show(cfg) {
    if (!this._root) return null;
    if (cfg.persistDismiss !== false && this._isDismissed(cfg.id)) return null;
    if (this._active.has(cfg.id)) return this._active.get(cfg.id) ?? null;

    const anchor = typeof cfg.anchor === "string"
      ? document.querySelector(cfg.anchor)
      : cfg.anchor;
    if (!anchor) return null;

    const el = document.createElement("div");
    el.className = "coachmark";
    el.setAttribute("role", "tooltip");
    el.setAttribute("data-coachmark-id", cfg.id);
    el.setAttribute("aria-live", "polite");
    el.tabIndex = -1;

    const text = document.createElement("div");
    text.textContent = cfg.text;
    el.appendChild(text);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "coachmark-dismiss";
    btn.textContent = "Got it";
    btn.addEventListener("click", () => this.dismiss(cfg.id, cfg));
    el.appendChild(btn);

    this._root.appendChild(el);
    el.dataset.placement = cfg.placement ?? "bottom";
    /** @type {any} */ (el)._anchor = anchor;
    /** @type {any} */ (el)._cfg = cfg;

    this._position(el, anchor, cfg.placement ?? "bottom");
    this._active.set(cfg.id, el);
    // Focus for screen-reader announcement; restore on dismiss.
    /** @type {any} */ (el)._restoreFocus = document.activeElement;
    el.focus({ preventScroll: true });
    return el;
  }

  /**
   * Dismiss a coach-mark by id.
   * @param {string} id
   * @param {Partial<CoachMarkConfig>} [cfg]
   */
  dismiss(id, cfg) {
    const el = this._active.get(id);
    if (!el) return;
    const persist = (cfg?.persistDismiss ?? /** @type {any} */(el)._cfg?.persistDismiss) !== false;
    if (persist) this._markDismissed(id);
    const restore = /** @type {any} */ (el)._restoreFocus;
    el.remove();
    this._active.delete(id);
    if (restore && typeof restore.focus === "function") {
      try { restore.focus(); } catch (_) { /* node may be detached */ }
    }
    cfg?.onDismiss?.();
  }

  /** Dismiss every visible coach-mark. */
  dismissAll() {
    for (const id of [...this._active.keys()]) this.dismiss(id);
  }

  /**
   * Reset persisted dismissal — useful for QA/preview.
   * @param {string} [id]  reset one; omit to reset all
   */
  resetDismiss(id) {
    if (!globalThis.localStorage) return;
    if (id) {
      localStorage.removeItem(STORAGE_PREFIX + id);
    } else {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k && k.startsWith(STORAGE_PREFIX)) localStorage.removeItem(k);
      }
    }
  }

  /** @private */
  _isDismissed(id) {
    try { return globalThis.localStorage?.getItem(STORAGE_PREFIX + id) === "1"; }
    catch (_) { return false; }
  }
  /** @private */
  _markDismissed(id) {
    try { globalThis.localStorage?.setItem(STORAGE_PREFIX + id, "1"); }
    catch (_) { /* private-mode browser */ }
  }

  /** @private */
  _position(el, anchor, placement) {
    const r = anchor.getBoundingClientRect();
    const pad = 8;
    let top = 0, left = 0;
    const elBox = el.getBoundingClientRect();
    switch (placement) {
      case "top":    top = r.top - elBox.height - pad; left = r.left; break;
      case "left":   top = r.top; left = r.left - elBox.width - pad; break;
      case "right":  top = r.top; left = r.right + pad; break;
      case "bottom":
      default:       top = r.bottom + pad; left = r.left; break;
    }
    // keep on-screen
    const vw = globalThis.innerWidth ?? 1024;
    const vh = globalThis.innerHeight ?? 768;
    left = Math.max(8, Math.min(left, vw - elBox.width - 8));
    top  = Math.max(8, Math.min(top,  vh - elBox.height - 8));
    el.style.top  = `${top}px`;
    el.style.left = `${left}px`;
  }

  /** @private */
  _onKeydown(e) {
    if (e.key === "Escape" && this._active.size > 0) {
      const lastId = [...this._active.keys()].pop();
      if (lastId) this.dismiss(lastId);
    }
  }

  /** @private */
  _onResize() {
    for (const [, el] of this._active) {
      const anchor = /** @type {any} */ (el)._anchor;
      if (anchor) this._position(el, anchor, el.dataset.placement ?? "bottom");
    }
  }
}

export const coachMarks = new CoachMarks();
export default coachMarks;
