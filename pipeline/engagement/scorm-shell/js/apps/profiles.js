/**
 * profiles.js · the course's single source for buyers and recorded calls.
 *
 *   scorm-shell/data/sample-profiles.json        the five buyers (Maria, Tom,
 *                                                Emma, Lukas, Sven)
 *   scorm-shell/data/sample-gong-transcripts.json the recorded calls every
 *                                                module shares (GC-01, GC-06…)
 *
 * Modules read buyers and shared calls from here instead of keeping their own
 * copies, so a company name or a Gong id means the same thing everywhere.
 * Apps that show one buyer (LinkedIn / CH, Salesforce) accept a lookup key:
 * a lead_id ("L-003"), a first name ("emma") or an id containing the first
 * name ("L-EMMA-001").
 */

let cache = null;
let callCache = null;

/** @returns {Promise<any[]>} */
export function loadProfiles() {
  if (!cache) {
    cache = fetch(new URL("../../data/sample-profiles.json", import.meta.url))
      .then(r => (r.ok ? r.json() : []))
      .catch(e => { console.warn("[profiles] could not load sample-profiles.json", e); return []; });
  }
  return cache;
}

/** @returns {Promise<any[]>} the shared Gong calls */
export function loadCalls() {
  if (!callCache) {
    callCache = fetch(new URL("../../data/sample-gong-transcripts.json", import.meta.url))
      .then(r => (r.ok ? r.json() : []))
      .catch(e => { console.warn("[profiles] could not load sample-gong-transcripts.json", e); return []; });
  }
  return callCache;
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

/** Shared calls by id, in the order asked for. Unknown ids are skipped. */
export function pickCalls(list, ids) {
  return ids.map(id => (list ?? []).find(c => c.id === id)).filter(Boolean);
}
