/**
 * task-banner.js · shared in-app task instruction surface
 * ---------------------------------------------------------------------------
 * Mounts a small banner at the top of an `.os-window-body` showing the current
 * sub-task the rep must perform inside that app. Resolves when the rep does
 * the action — host calls `markTaskBannerDone(id)`.
 *
 * Used by modules to make apps the driver of progression, not a side-panel.
 *
 * @example
 *   mountTaskBanner(outreachBody, {
 *     id: "m3-step1-pick-maria",
 *     label: "Click warm lead Maria — she opened your email twice in 15 min",
 *     hint: "Open her detail row to see the signal",
 *     state: "active",
 *   });
 *
 *   // later, when the rep clicks Maria:
 *   markTaskBannerDone("m3-step1-pick-maria");
 */

const BANNER_CLASS = "task-banner";
const REGISTRY     = new Map(); // id -> HTMLElement

/**
 * @param {HTMLElement} hostBody  target .os-window-body element
 * @param {{id:string, label:string, hint?:string, state?:"active"|"pending"}} cfg
 * @returns {HTMLElement}
 */
export function mountTaskBanner(hostBody, cfg) {
  if (!hostBody) throw new Error("mountTaskBanner: hostBody required");
  if (!cfg?.id || !cfg?.label) throw new Error("mountTaskBanner: id + label required");

  REGISTRY.get(cfg.id)?.remove();

  const el = document.createElement("aside");
  el.className   = `${BANNER_CLASS} ${BANNER_CLASS}--${cfg.state ?? "active"}`;
  el.dataset.taskId = cfg.id;
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");
  el.innerHTML = `
    <span class="${BANNER_CLASS}__dot" aria-hidden="true"></span>
    <span class="${BANNER_CLASS}__body">
      <span class="${BANNER_CLASS}__label">${cfg.label}</span>
      ${cfg.hint ? `<span class="${BANNER_CLASS}__hint">${cfg.hint}</span>` : ""}
    </span>
    <span class="${BANNER_CLASS}__check" aria-hidden="true">✓</span>
  `;

  hostBody.prepend(el);
  REGISTRY.set(cfg.id, el);
  return el;
}

export function markTaskBannerDone(id) {
  const el = REGISTRY.get(id);
  if (!el) return false;
  el.classList.remove(`${BANNER_CLASS}--active`, `${BANNER_CLASS}--pending`);
  el.classList.add(`${BANNER_CLASS}--done`);
  return true;
}

export function unmountTaskBanner(id) {
  const el = REGISTRY.get(id);
  if (!el) return false;
  el.remove();
  REGISTRY.delete(id);
  return true;
}

export function updateTaskBanner(id, patch) {
  const el = REGISTRY.get(id);
  if (!el) return false;
  if (patch.label) el.querySelector(`.${BANNER_CLASS}__label`).textContent = patch.label;
  if (patch.hint) {
    let hintEl = el.querySelector(`.${BANNER_CLASS}__hint`);
    if (!hintEl) {
      hintEl = document.createElement("span");
      hintEl.className = `${BANNER_CLASS}__hint`;
      el.querySelector(`.${BANNER_CLASS}__body`).appendChild(hintEl);
    }
    hintEl.textContent = patch.hint;
  }
  return true;
}

export default { mountTaskBanner, markTaskBannerDone, unmountTaskBanner, updateTaskBanner };
