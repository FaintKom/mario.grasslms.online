/**
 * brand-icons.js · pixel-traced SVG logos for the 7 simulated apps.
 *
 * Each export returns the inner-SVG markup (paths, no <svg> wrapper) so the
 * caller can choose viewBox and sizing. The `BRAND_ICON_SVG(id, size)` helper
 * wraps with a properly-sized <svg> element.
 *
 * These are stylised renditions of each company's mark — used inside the
 * sim's desktop tiles, taskbar, and per-app window chrome.
 */

/** Outreach — red gradient "O" with cut-out arrow */
const OUTREACH = `
  <defs>
    <linearGradient id="bi-outreach-g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"  stop-color="#FF4757"/>
      <stop offset="100%" stop-color="#C41E3A"/>
    </linearGradient>
  </defs>
  <rect width="48" height="48" rx="11" fill="url(#bi-outreach-g)"/>
  <path d="M24 11.6a12.4 12.4 0 1 0 12.4 12.4 12.4 12.4 0 0 0-12.4-12.4Zm0 18.3a5.9 5.9 0 1 1 5.9-5.9 5.9 5.9 0 0 1-5.9 5.9Z" fill="#fff"/>
  <path d="m32.6 17.8 4-1.4-1.5 4.1Z" fill="#fff"/>
`;

/** Gong — purple gradient with white waveform */
const GONG = `
  <defs>
    <linearGradient id="bi-gong-g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"  stop-color="#8B5CF6"/>
      <stop offset="100%" stop-color="#5B21B6"/>
    </linearGradient>
  </defs>
  <rect width="48" height="48" rx="11" fill="url(#bi-gong-g)"/>
  <g fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round">
    <path d="M12 24h3"/>
    <path d="M18 19v10"/>
    <path d="M22 15.5v17"/>
    <path d="M26 20v8"/>
    <path d="M30 17v14"/>
    <path d="M34 21.5v5"/>
    <path d="M37 24h-1.5"/>
  </g>
`;

/** Salesforce — light blue cloud */
const SALESFORCE = `
  <rect width="48" height="48" rx="11" fill="#fff"/>
  <path d="M22.6 16.5a7.4 7.4 0 0 1 5.6-2.7 7.5 7.5 0 0 1 7 4.9 5.6 5.6 0 0 1 6.3 4.9 5.5 5.5 0 0 1-3.4 5.4 5.1 5.1 0 0 1-4.8 3.2 4.8 4.8 0 0 1-2.6-.8 5.7 5.7 0 0 1-9.9-.7 4.5 4.5 0 0 1-2.2.6 4.6 4.6 0 0 1-4.6-4.6 4.5 4.5 0 0 1 2.4-4 6.6 6.6 0 0 1 6.2-6.2Z" fill="#00A1E0"/>
`;

/** LinkedIn — blue with white "in" */
const LINKEDIN = `
  <rect width="48" height="48" rx="11" fill="#0A66C2"/>
  <rect x="11" y="20" width="6" height="17" fill="#fff"/>
  <circle cx="14" cy="14" r="3.2" fill="#fff"/>
  <path d="M21 20h5.8v2.4c.9-1.6 2.7-2.9 5.5-2.9 5.9 0 7 3.9 7 9V37H33.5v-7.4c0-1.8 0-4.1-2.5-4.1s-2.9 2-2.9 4V37H22Z" fill="#fff"/>
`;

/** Google Calendar — white square with date "31" + 4 corner colours */
const CALENDAR = `
  <rect width="48" height="48" rx="11" fill="#fff"/>
  <path d="M12 12h24v24H12z" fill="#fff"/>
  <path d="M36 12h-7v7h7z" fill="#1A73E8"/>
  <path d="M36 36V19h-7v17z" fill="#EA4335"/>
  <path d="M12 12v7h7v-7z" fill="#34A853"/>
  <path d="M12 19v17h7V19z" fill="#FBBC04"/>
  <path d="M19 12v7h10v-7z" fill="#1A73E8"/>
  <text x="24" y="32" font-family="Roboto, system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle" fill="#5F6368">31</text>
`;

/** Phone — gradient green with receiver */
const PHONE = `
  <defs>
    <linearGradient id="bi-phone-g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#00C389"/>
      <stop offset="100%" stop-color="#008B5E"/>
    </linearGradient>
  </defs>
  <rect width="48" height="48" rx="11" fill="url(#bi-phone-g)"/>
  <path d="M19.5 14.8c.5-.5 1.4-.5 1.9 0l3.6 3.6c.5.5.5 1.4 0 1.9l-2.4 2.4a.7.7 0 0 0-.2.6 13.2 13.2 0 0 0 8 8 .7.7 0 0 0 .6-.2l2.4-2.4c.5-.5 1.4-.5 1.9 0l3.6 3.6c.5.5.5 1.4 0 1.9l-2.2 2.2c-1.2 1.2-3 1.5-4.5 1A22.2 22.2 0 0 1 14 19.5c-.6-1.5-.2-3.3 1-4.5z" fill="#fff"/>
`;

/** Slack — four-colour pinwheel */
const SLACK = `
  <rect width="48" height="48" rx="11" fill="#fff"/>
  <path d="M19 27.4a2.7 2.7 0 1 1-2.7-2.7H19zm1.3 0a2.7 2.7 0 0 1 5.4 0v6.8a2.7 2.7 0 1 1-5.4 0z" fill="#E01E5A"/>
  <path d="M23 19a2.7 2.7 0 1 1 2.7-2.7V19zm0 1.3a2.7 2.7 0 0 1 0 5.4h-6.8a2.7 2.7 0 1 1 0-5.4z" fill="#36C5F0"/>
  <path d="M31.3 23a2.7 2.7 0 1 1 2.7 2.7h-2.7zm-1.3 0a2.7 2.7 0 0 1-5.4 0v-6.8a2.7 2.7 0 1 1 5.4 0z" fill="#2EB67D"/>
  <path d="M27.4 31.3a2.7 2.7 0 1 1-2.7 2.7v-2.7zm0-1.3a2.7 2.7 0 0 1 0-5.4h6.8a2.7 2.7 0 1 1 0 5.4z" fill="#ECB22E"/>
`;

const PATHS = Object.freeze({
  outreach:        OUTREACH,
  gong:            GONG,
  salesforce:      SALESFORCE,
  "linkedin-ch":   LINKEDIN,
  calendar:        CALENDAR,
  "phone-dialler": PHONE,
  slack:           SLACK,
});

/**
 * Return the wrapped SVG markup for a brand icon.
 * @param {string} id   one of: outreach | gong | salesforce | linkedin-ch | calendar | phone-dialler | slack
 * @param {number} [size=48]
 * @returns {string} SVG markup ready to inject as innerHTML
 */
export function brandIcon(id, size = 48) {
  const inner = PATHS[id];
  if (!inner) return "";
  return `<svg width="${size}" height="${size}" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${inner}</svg>`;
}

/**
 * Inject brand icons into every element matching [data-brand-icon] on the page.
 * Looks up the icon id from the attribute value.
 */
export function hydrateBrandIcons(root = document) {
  root.querySelectorAll("[data-brand-icon]").forEach(el => {
    const id = el.getAttribute("data-brand-icon");
    const size = parseInt(el.getAttribute("data-brand-icon-size") || "48", 10);
    el.innerHTML = brandIcon(id, size);
  });
}

/** Direct map for consumers that just want the inner SVG paths. */
export const BRAND_PATHS = PATHS;

export default { brandIcon, hydrateBrandIcons, BRAND_PATHS };
