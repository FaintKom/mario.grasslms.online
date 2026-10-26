/**
 * dates.js · every date in the SDR scenario is counted from today.
 *
 * Data files keep offsets, never calendar dates. A date field holds one of:
 *   {"daysAgo": n}                       n working days before today
 *   {"inDays": n}                        n working days after today
 *   {"weeksAgo": w, "weekday": "Mon"}    that weekday, w weeks before this week
 *   {"call": "GC-01"}                    the day that recorded call took place
 * and resolveDates() turns it into "2026-10-28".
 *
 * Text may carry tokens, which fill() replaces:
 *   {{day0}} {{day1}}       the two days a rep offers a buyer now ("Tuesday")
 *   {{dd0}} {{dd1}}         the same, short ("Tue"); {{day0:de}} in German
 *   {{week}}                "this week" or "next week", whichever holds those days
 *   {{today}}               today's weekday (Monday when today is a weekend day)
 *   {{month:key}}           month of a named event, "January"; {{mon:key}} "Jan";
 *                           {{monYear:key}} "Jan 2026"
 *   {{dm:n}}                "15 May", n working days from today (negative = past)
 *
 * The two offered days are the working days after today in this week, or Monday
 * and Tuesday of next week when fewer than two are left (Thursday to Sunday).
 */

const WEEKDAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAY_DE = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
const MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SHORT = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5 };

/** Named growth events, in months before today. One place, so every module tells the same story. */
export const EVENTS = {
  maria_store: 4,      // Maria's second store on Deansgate (Companies House filing)
  tom_series_b: 2,     // Northwind's Series B
  emma_accounts: 5,    // Brightline's annual accounts
  lukas_opening: 3,    // Tafelrunde's fourth restaurant, in Schwabing
  lukas_register: 4,   // its Handelsregister entry
  helio_series_c: 5,   // Helio Rivers' Series C (module 4)
  oakrow_accounts: 5,  // OakRow's micro-entity accounts (module 4)
};

/**
 * When each recorded call took place. Weekdays are chosen so that what people
 * say in the call stays true: M.G. calls Maria on a Monday and offers her
 * Tuesday or Wednesday of the same week.
 */
export const CALLS = {
  "GC-19": { weeksAgo: 5, weekday: "Thu" },
  "GC-11": { weeksAgo: 4, weekday: "Tue" },
  "GC-02": { weeksAgo: 4, weekday: "Wed" },
  "GC-01": { weeksAgo: 3, weekday: "Mon" },
  "Pre-dial score · Maria": { weeksAgo: 3, weekday: "Mon" },
  "GC-10": { weeksAgo: 3, weekday: "Wed" },
  "GC-09": { weeksAgo: 3, weekday: "Thu" },
  "Tom · PSD2 question": { weeksAgo: 3, weekday: "Wed" },
  "GC-06": { weeksAgo: 2, weekday: "Mon" },
  "Tom + S.K. · lost": { weeksAgo: 2, weekday: "Wed" },
  "Maria · signup question": { weeksAgo: 2, weekday: "Thu" },
  "Tom + S.K. · booked": { weeksAgo: 1, weekday: "Mon" },
  "GC-03": { weeksAgo: 6, weekday: "Mon" },
};

const isWeekend = d => d.getDay() === 0 || d.getDay() === 6;
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

/** Today at midnight, local time. */
export function today() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }

/** Monday of the week that contains `d`. */
export function weekStart(d = today()) { return addDays(d, -((d.getDay() + 6) % 7)); }

/** n working days from `from`; negative n goes back. Weekends are skipped. */
export function workdays(n, from = today()) {
  let d = new Date(from); const step = n < 0 ? -1 : 1;
  for (let k = Math.abs(n); k > 0;) { d = addDays(d, step); if (!isWeekend(d)) k--; }
  return d;
}

/** That weekday ("Mon" … "Fri") in the week `weeksAgo` weeks before this one. */
export function pastWeekday(weeksAgo, weekday) {
  return addDays(weekStart(), -7 * weeksAgo + (SHORT[weekday] ?? 1) - 1);
}

/** First day of the month in which a named event (or n months ago) happened. */
export function monthOf(keyOrN) {
  const n = typeof keyOrN === "number" ? keyOrN : (EVENTS[keyOrN] ?? 0);
  const d = today(); d.setDate(1); d.setMonth(d.getMonth() - n); return d;
}

/** The working days a rep can offer a buyer now; the first two are the ones the course uses. */
export function bookingDays() {
  const t = today(), ws = weekStart(t);
  const left = [0, 1, 2, 3, 4].map(i => addDays(ws, i)).filter(d => d > t);
  if (left.length >= 2) return left;
  return [0, 1, 2, 3, 4].map(i => addDays(ws, 7 + i));
}

/** Monday of the week the Calendar shows. */
export function bookingWeek() { return weekStart(bookingDays()[0]); }

/** "Tue 14:00": a Calendar slot on booking day i. */
export function slot(i, time) { return `${dd(bookingDays()[i])} ${time}`; }

/** "Tue 14:00" → "Tue 27 Oct 14:00", the date in the week the Calendar shows. */
export function slotWithDate(s) {
  const [d, t] = String(s ?? "").split(" ");
  if (!SHORT[d]) return String(s ?? "");
  return `${short(addDays(bookingWeek(), SHORT[d] - 1))} ${t}`;
}

/** "Tue 14:00" → "Tuesday at 14:00". */
export function spokenSlot(s) {
  const [d, t] = String(s ?? "").split(" ");
  return SHORT[d] ? `${WEEKDAY[SHORT[d]]} at ${t}` : String(s ?? "");
}

export const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const dd = d => WEEKDAY[d.getDay()].slice(0, 3);
export const dayName = d => WEEKDAY[d.getDay()];
/** "15 May" */
export const dm = d => `${d.getDate()} ${MONTH[d.getMonth()].slice(0, 3)}`;
/** "Wed 28 Oct" */
export const short = d => `${dd(d)} ${dm(d)}`;
export const monthName = d => MONTH[d.getMonth()];

/** Today, or next Monday when today is a weekend day: the day the learner is "at work". */
export function workToday() { const t = today(); return isWeekend(t) ? workdays(1, t) : t; }

/** "this week" when the offered days are in the current week, otherwise "next week". */
export function bookingWeekWord() { return bookingWeek() > weekStart() ? "next week" : "this week"; }

/** A date object from the data files ({daysAgo}, {inDays}, {weeksAgo, weekday}, {call}) as a Date. */
export function toDate(v) {
  if (!v || typeof v !== "object") return null;
  if (typeof v.daysAgo === "number") return workdays(-v.daysAgo);
  if (typeof v.inDays === "number") return workdays(v.inDays);
  if (typeof v.weeksAgo === "number") return pastWeekday(v.weeksAgo, v.weekday);
  if (typeof v.call === "string" && CALLS[v.call]) return pastWeekday(CALLS[v.call].weeksAgo, CALLS[v.call].weekday);
  return null;
}

/** The day a recorded call took place, or null for a call with no date. */
export function callDate(id) { return toDate({ call: id }); }

/** Replace the {{…}} tokens in one string. */
export function fill(str) {
  return String(str).replace(/\{\{(\w+)(?::(-?[\w]+))?\}\}/g, (all, name, arg) => {
    const days = bookingDays();
    switch (name) {
      case "day0": case "day1": {
        const d = days[name === "day0" ? 0 : 1];
        return arg === "de" ? WEEKDAY_DE[d.getDay()] : dayName(d);
      }
      case "dd0": return dd(days[0]);
      case "dd1": return dd(days[1]);
      case "week": return bookingWeekWord();
      case "today": return dayName(workToday());
      case "month": return monthName(monthOf(arg));
      case "mon": return monthName(monthOf(arg)).slice(0, 3);
      case "monYear": { const d = monthOf(arg); return `${monthName(d).slice(0, 3)} ${d.getFullYear()}`; }
      case "dm": return dm(workdays(Number(arg) || 0));
      default: return all;
    }
  });
}

/** Deep copy of loaded data with date objects turned into "YYYY-MM-DD" and tokens filled in. */
export function resolveDates(v) {
  if (typeof v === "string") return v.includes("{{") ? fill(v) : v;
  if (Array.isArray(v)) return v.map(resolveDates);
  if (v && typeof v === "object") {
    const d = toDate(v);
    if (d) return iso(d);
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, resolveDates(x)]));
  }
  return v;
}
