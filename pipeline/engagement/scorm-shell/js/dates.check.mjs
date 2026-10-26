// node scorm-shell/js/dates.check.mjs : dates.js on every day of one week, with the clock moved.
import assert from "node:assert/strict";
const Real = Date;
for (let i = 0; i < 7; i++) {
  const now = new Real(2026, 9, 26 + i, 10).getTime();   // Mon 26 Oct … Sun 1 Nov 2026
  globalThis.Date = class extends Real { constructor(...a) { if (a.length) super(...a); else super(now); } static now() { return now; } };
  const D = await import(`./dates.js?${i}`);
  const t = D.today(), [a, b] = D.bookingDays();
  assert.ok(a > t && b > a, "offered days come after today");
  assert.ok([a, b].every(d => d.getDay() >= 1 && d.getDay() <= 5), "offered days are weekdays");
  assert.equal(D.weekStart(a).getTime(), D.weekStart(b).getTime(), "both offered days are in the week the Calendar shows");
  assert.equal(D.fill("{{week}}"), t.getDay() >= 1 && t.getDay() <= 3 ? "this week" : "next week");
  assert.equal(D.callDate("GC-01").getDay(), 1, "GC-01 stays on a Monday");
  assert.ok(D.callDate("GC-01") < t && D.toDate({ inDays: 30 }) > t && D.toDate({ daysAgo: 1 }) < t);
  assert.equal(D.resolveDates({ x: [{ daysAgo: 0 }] }).x[0], D.iso(t));
}
globalThis.Date = Real;
console.log("dates.js ok");
