/**
 * registry.js · central app registry + inline icon set.
 *
 * Each app self-registers at import time via `registerApp(def)`. The shell
 * looks the app up by id (e.g. "gong") when `MiniOS.openApp("gong")` is called.
 *
 * @typedef {object} AppMountContext
 * @property {HTMLElement} container        the body element to render into
 * @property {EventTarget} eventBus         shared inter-app + telemetry bus
 * @property {(id:string, options?:object)=>any} openApp  to launch peer apps
 * @property {object} [options]             arbitrary launch options
 *
 * @typedef {object} AppDef
 * @property {string} id
 * @property {string} name                  human-readable title
 * @property {string} iconName              key into the icon() helper
 * @property {{w:number,h:number}} defaultSize
 * @property {(ctx: AppMountContext) => { update?:(opts:any)=>void, destroy?:()=>void }} mount
 * @property {(handle: any) => void} [unmount]
 */

/** @type {Map<string, AppDef>} */
export const appRegistry = new Map();

/**
 * @param {AppDef} def
 * @returns {void}
 */
export function registerApp(def) {
  if (!def || !def.id || typeof def.mount !== "function") {
    throw new Error("registerApp: def must include id + mount()");
  }
  if (appRegistry.has(def.id)) {
    console.warn(`[registry] overwriting app "${def.id}"`);
  }
  appRegistry.set(def.id, def);
}

/**
 * Minimal inline SVG icons (Phosphor-traced) — keeps bundle network-free.
 * Each icon is 18×18 and inherits currentColor.
 * @param {string} name
 * @param {string} [ariaLabel]  if omitted, icon is aria-hidden
 * @returns {string}  SVG markup
 */
export function icon(name, ariaLabel) {
  const a11y = ariaLabel
    ? `role="img" aria-label="${escapeAttr(ariaLabel)}"`
    : `aria-hidden="true" focusable="false"`;
  const path = ICON_PATHS[name] ?? ICON_PATHS["dot"];
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" ${a11y}>${path}</svg>`;
}

/** @param {string} s */
function escapeAttr(s) { return String(s).replace(/[<>&"]/g, c => ({ "<":"&lt;",">":"&gt;","&":"&amp;","\"":"&quot;" }[c])); }

const ICON_PATHS = Object.freeze({
  phone:           `<path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>`,
  calendar:        `<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>`,
  eye:             `<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>`,
  refresh:         `<path d="M3 12a9 9 0 0 1 15.5-6L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6L3 16M3 21v-5h5"/>`,
  check:           `<path d="M5 12l5 5L20 7"/>`,
  question:        `<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 4.5 2.6c-.9.5-1.5 1-1.5 2.4M12 17h.01"/>`,
  users:           `<path d="M16 21v-2a4 4 0 0 0-3-3.9M2 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="8" cy="7" r="4"/><circle cx="17" cy="7" r="3"/>`,
  building:        `<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-4h4v4"/>`,
  storefront:      `<path d="M3 9l1-4h16l1 4M3 9h18v11H3V9zm6 0v4a3 3 0 0 1-6 0V9m6 0v4a3 3 0 0 0 6 0V9m0 0v4a3 3 0 0 0 6 0V9"/>`,
  briefcase:       `<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>`,
  warning:         `<path d="M12 3L2 21h20L12 3zm0 6v6m0 3h.01"/>`,
  lightbulb:       `<path d="M9 21h6M10 17h4M8 13a6 6 0 1 1 8 0 4 4 0 0 0-1 3v1H9v-1a4 4 0 0 0-1-3z"/>`,
  shieldCheck:     `<path d="M12 3l8 3v6a9 9 0 0 1-8 9 9 9 0 0 1-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>`,
  x:               `<path d="M6 6l12 12M18 6L6 18"/>`,
  hash:            `<path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/>`,
  message:         `<path d="M21 11.5a8.4 8.4 0 0 1-1 4 8.5 8.5 0 0 1-7.6 4.5 8.4 8.4 0 0 1-4-1L3 21l2-5.4a8.4 8.4 0 0 1-1-4 8.5 8.5 0 0 1 4.5-7.6 8.4 8.4 0 0 1 4-1A8.5 8.5 0 0 1 21 11.5z"/>`,
  forkKnife:       `<path d="M7 2v8a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V2M9 12v10M17 2c-2 2-3 4-3 7s1 3 3 3v10"/>`,
  rocket:          `<path d="M5 19l2-2m2-6a9 9 0 0 1 9-9c0 6-3 9-9 9l-3-3a9 9 0 0 1 3-9m0 6l3 3m-9 9c-1-2-1-4 0-5"/>`,
  factory:         `<path d="M3 21V11l5 3V11l5 3V11l5 3v-3l3-2v12H3z"/>`,
  dot:             `<circle cx="12" cy="12" r="3"/>`,
  gongWave:        `<path d="M3 12a9 9 0 0 1 18 0M6 12a6 6 0 0 1 12 0M9 12a3 3 0 0 1 6 0M12 12v9"/>`,
  focus:           `<circle cx="12" cy="12" r="3"/><path d="M3 9V5a2 2 0 0 1 2-2h4M21 9V5a2 2 0 0 0-2-2h-4M3 15v4a2 2 0 0 0 2 2h4M21 15v4a2 2 0 0 1-2 2h-4"/>`,
});

export default appRegistry;
