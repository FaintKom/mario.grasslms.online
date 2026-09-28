/**
 * profiles.js · shared access to scorm-shell/data/sample-profiles.json.
 *
 * Apps that show one buyer (LinkedIn / CH, Salesforce) accept a lookup key
 * from the module: a lead_id ("L-003"), a first name ("emma") or a module's
 * own id that contains the first name ("L-EMMA-001").
 */

let cache = null;

/** @returns {Promise<any[]>} */
export function loadProfiles() {
  if (!cache) {
    cache = fetch(new URL("../../data/sample-profiles.json", import.meta.url))
      .then(r => (r.ok ? r.json() : []))
      .catch(e => { console.warn("[profiles] could not load sample-profiles.json", e); return []; });
  }
  return cache;
}

/**
 * @param {any[]} list
 * @param {string|null|undefined} key
 */
export function findProfile(list, key) {
  if (!key || !Array.isArray(list)) return null;
  const k = String(key).toLowerCase();
  return list.find(p => String(p.lead_id ?? "").toLowerCase() === k)
      ?? list.find(p => {
           const first = String(p.name ?? "").toLowerCase().split(/[\s.]+/)[0];
           return first.length >= 3 && k.split(/[^a-z]+/).includes(first);
         })
      ?? null;
}
