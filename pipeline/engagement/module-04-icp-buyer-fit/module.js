/**
 * Module 4 · M4 ICP Buyer Fit · runtime (in-app driven)
 * ---------------------------------------------------------------------------
 * Same architecture as M3 — bootModule + task-banner + welcome/summary cards.
 * Content: score a lead against 5 ICP criteria BEFORE you dial. Don't waste
 * 8 minutes on a non-ICP buyer.
 *
 * Outcomes: LO-M4.1 (5-criteria score) · LO-M4.2 (skip non-ICP)
 */

import { bootModule, eventBus } from "../scorm-shell/js/shell.js";
import { mountTaskBanner, markTaskBannerDone } from "../scorm-shell/js/task-banner.js";
import { normalizeQuiz } from "../scorm-shell/js/quiz-normalize.js";

function keepOnly(appIds) { if (!state.api?.os?.listWindows) return; const k = new Set(appIds); for (const w of state.api.os.listWindows()) if (!k.has(w.appId)) state.api.os.closeApp(w); }

const state = {
  api: null, step: 0, startedAt: 0,
  scoresLogged: false, completionAnswer: null,
  quizIndex: 0, quizScore: 0,
  transcripts: [], prospects: [], quizItems: [], timeline: [],
};

async function loadJson(p) { const r = await fetch(p); if (!r.ok) throw new Error(`${p}: ${r.status}`); return r.json(); }
async function loadAllData() {
  const [t, p, q] = await Promise.all([
    loadJson("./data/transcripts.json"),
    loadJson("./data/prospects.json"),
    loadJson("./data/quiz.json"),
  ]);
  state.transcripts = t; state.prospects = p; state.quizItems = normalizeQuiz(q);
}

async function start() {
  try { await loadAllData(); }
  catch (err) { console.error("[M4]", err); renderFatal(err.message); return; }
  bootModule({
    moduleId: "M4",
    title: "Module 4 · ICP Buyer Fit",
    appsToLaunch: [],
    onReady(api) {
      state.api = api; state.startedAt = Date.now();
      wireProgressTimer(); wireHelpButton(); wireNarrativeButtons();
      showWelcomeCard(() => runStep(0));
    },
  });
}
start();

const STEPS = [
  { title: "A rep spent 8 minutes on a buyer outside the ICP and closed nothing", handler: stepGainAttention },
  { title: "What you'll do: score each lead 1 to 5 on every ICP criterion", handler: stepStateOutcome },
  { title: "Pick the right lead before you use the three moves",     handler: stepRecallPrior },
  { title: "Watch M.G. score Maria 23/25 in 90 seconds",             handler: stepWorkedExample },
  { title: "Your turn: score Sven for ICP fit",                      handler: stepCompletionProblem },
  { title: "On your own: score a new lead, then dial or skip",       handler: stepSoloProblem },
  { title: "J.T.'s review of your scoring",                          handler: stepFeedback },
  { title: "Quick check: 4 questions",                               handler: stepQuiz },
  { title: "Takeaway and a 7-day refresher",                         handler: stepTakeaway },
];

function runStep(i) {
  state.step = i;
  document.getElementById("gagne-step").textContent = `${i + 1} of ${STEPS.length}`;
  document.getElementById("narrative-title").textContent = STEPS[i].title;
  updateProgressBar(i + 1);
  const body = document.getElementById("narrative-body"); body.innerHTML = "";
  document.getElementById("narrative-back").hidden = i === 0;
  const next = document.getElementById("narrative-next");
  next.textContent = i === STEPS.length - 1 ? "Finish module" : "Continue";
  next.disabled = false; next.setAttribute("aria-disabled", "false");
  STEPS[i].handler(body);
}

function showWelcomeCard(onStart) {
  const overlay = document.getElementById("narrative-overlay");
  if (overlay) overlay.style.visibility = "hidden";
  const card = document.createElement("div");
  card.className = "welcome-card";
  card.setAttribute("role", "dialog"); card.setAttribute("aria-modal", "true");
  card.innerHTML = `
    <div class="welcome-card__panel">
      <span class="welcome-card__logo" aria-hidden="true">FTC</span>
      <div class="welcome-card__kicker">Module 4 &middot; pick the right lead</div>
      <h2 class="welcome-card__title">ICP Buyer Fit</h2>
      <div class="welcome-card__meta">10 min &middot; 9 steps &middot; in-app practice</div>
      <p class="welcome-card__lede">
        Before you dial, score every cold lead from 1 to 5 on five criteria from
        the ideal customer profile (ICP). Below 18 out of 25 means skip. Your
        time is worth more than that call.
      </p>
      <button type="button" class="welcome-card__start" data-action="start">
        Start module &rarr;
      </button>
    </div>`;
  document.body.appendChild(card);
  const btn = card.querySelector("[data-action='start']");
  btn?.focus({ preventScroll: true });
  btn?.addEventListener("click", () => {
    card.classList.add("welcome-card--out");
    setTimeout(() => { card.remove(); if (overlay) overlay.style.visibility = ""; onStart?.(); }, 220);
  });
}

function updateProgressBar(c) {
  const bar = document.getElementById("step-progress");
  if (!bar) return;
  bar.setAttribute("aria-valuenow", String(c));
  bar.querySelectorAll(".step-progress__seg").forEach(s => {
    const n = Number(s.dataset.step);
    s.dataset.state = n < c ? "done" : n === c ? "current" : "pending";
  });
}

function wireNarrativeButtons() {
  document.getElementById("narrative-next").addEventListener("click", () => {
    if (state.step >= STEPS.length - 1) return finishModule();
    runStep(state.step + 1);
  });
  document.getElementById("narrative-back").addEventListener("click", () => { if (state.step > 0) runStep(state.step - 1); });
  document.getElementById("narrative-redo")?.addEventListener("click", () => runStep(state.step));
  document.getElementById("narrative-skip")?.addEventListener("click", () => {
    if (state.step >= STEPS.length - 1) return finishModule();
    runStep(state.step + 1);
  });
}
function wireHelpButton() {
  document.getElementById("help-button").addEventListener("click", () => {
    const h = state.step === 2 ? "pre-training" : "M4";
    state.api.os.openApp("slack", { highlightModule: h });
  });
}
function wireProgressTimer() {
  const el = document.getElementById("module-progress");
  const tick = () => {
    const ms = Date.now() - state.startedAt;
    el.textContent = `${Math.floor(ms / 60000)}:${Math.floor((ms % 60000) / 1000).toString().padStart(2, "0")} / 10:00`;
  };
  tick(); setInterval(tick, 1000);
}

// --- Steps 1-3 -------------------------------------------------------------

function stepGainAttention(body) {
  body.innerHTML = `
    <blockquote class="peer-quote">
      Spent 8 minutes on a 4-person craft shop with no procurement. Closed nothing.
      <cite>Exit interview with a rep who left at month 5</cite>
    </blockquote>
    <p style="font-size:13px;color:var(--ftc-ink-2);margin-top:10px">
      Bottom-quartile reps dial every name on the list, while top reps score each lead first.
    </p>`;
  state.api.os.openApp("outreach", { highlightLeadId: "M4-L-001" });
  setTimeout(() => decorateOutreachForStep1(), 140);
}
function decorateOutreachForStep1() {
  const ob = document.querySelector(".os-window.app--outreach .os-window-body");
  if (!ob) return;
  mountTaskBanner(ob, { id: "m4-s1-pick", label: "Click Maria. You'll see her scored against the ICP shortly.", hint: "Two Pines Apparel · 35 FTE retail", state: "active" });
  let tries = 0;
  const tick = () => {
    const row = [...ob.querySelectorAll(".lead-row")].find(r => /Maria/i.test(r.textContent || ""));
    if (!row) { if (++tries < 20) return setTimeout(tick, 100); return; }
    if (row.dataset.m4Done === "true") return;
    row.classList.add("is-warm-highlight"); row.dataset.m4Done = "true";
    row.addEventListener("click", e => {
      if (e.target.closest('[data-action="dial"]')) return;
      if (state.step !== 0) return;
      markTaskBannerDone("m4-s1-pick");
      state.api.eventLog?.record?.("step1_picked_lead");
      setTimeout(() => runStep(1), 450);
    });
  };
  tick();
}

function stepStateOutcome(body) {
  body.innerHTML = `
    <p style="font-size:14px;">In the next 10 minutes you'll score leads on 5 criteria:</p>
    <ol style="font-size:13.5px;margin:6px 0 10px 18px;">
      <li>Industry fit · 1-5</li>
      <li>FTE band · 1-5</li>
      <li>Monthly spend · 1-5</li>
      <li>Decision-maker access · 1-5</li>
      <li>Intent signal (recent) · 1-5</li>
    </ol>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Below 18/25 means skip. 18 to 21 means dial this week. 22 or more means dial today.
    </p>`;
  setTimeout(() => {
    const ob = document.querySelector(".os-window.app--outreach .os-window-body");
    if (!ob) return;
    mountTaskBanner(ob, { id: "m4-s2-confirm", label: "Confirm: you know the 5-criteria scoring rule", state: "active" });
    if (!ob.querySelector("[data-m4-s2-done]")) {
      const bar = document.createElement("div");
      bar.style.cssText = "margin-top:14px; padding:10px 14px; background:var(--ftc-green-tint); border:1px dashed var(--brand-green); border-radius:6px; display:flex; align-items:center; justify-content:space-between; gap:12px;";
      bar.innerHTML = `<span style="font-size:12.5px;color:var(--ftc-ink-2);">5 criteria · 1-5 each · cutoff 18/25.</span>
        <button type="button" data-m4-s2-done style="background:var(--brand-green); color:#fff; padding:8px 14px; border:0; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">✓ Got it</button>`;
      ob.appendChild(bar);
      bar.querySelector("[data-m4-s2-done]").addEventListener("click", () => {
        if (state.step !== 1) return;
        markTaskBannerDone("m4-s2-confirm");
        setTimeout(() => runStep(2), 450);
      });
    }
  }, 200);
}

function stepRecallPrior(body) {
  body.innerHTML = `
    <p style="font-size:14px;">Quick recall: the three moves only help once you've picked the right lead.</p>
    <ol style="font-size:13.5px;margin:6px 0 8px 18px;">
      <li><strong>M1 Diagnostic</strong>, M2 Acknowledge and M3 Close.</li>
      <li>None of them help if the lead was never going to buy.</li>
      <li>M4, this module, is the check you run before any of them.</li>
    </ol>
    <p style="font-size:13px;color:var(--ftc-ink-2)">Next: watch M.G. score Maria in Gong.</p>`;
  setTimeout(() => {
    const ob = document.querySelector(".os-window.app--outreach .os-window-body");
    if (ob) {
      mountTaskBanner(ob, { id: "m4-s3-open-gong", label: "Open Gong for the worked example", state: "active" });
      if (!ob.querySelector("[data-m4-s3-open]")) {
        const bar = document.createElement("div");
        bar.style.cssText = "margin-top:10px; padding:10px 14px; background:var(--ftc-green-tint); border:1px dashed var(--brand-green); border-radius:6px; display:flex; align-items:center; justify-content:space-between; gap:12px;";
        bar.innerHTML = `<span style="font-size:12.5px;color:var(--ftc-ink-2);">M.G. scoring Maria 23/25 live.</span>
          <button type="button" data-m4-s3-open style="background:var(--brand-green); color:#fff; padding:8px 14px; border:0; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">🎙 Open Gong</button>`;
        ob.appendChild(bar);
        bar.querySelector("[data-m4-s3-open]").addEventListener("click", () => {
          state.api.os.openApp("gong", { transcripts: gongCalls(), activeTranscriptId: gongCalls()[0]?.id });
        });
      }
    }
    const onAppOpened = (ev) => {
      if (ev.detail?.appId !== "gong" || state.step !== 2) return;
      state.api.eventBus.removeEventListener("app:opened", onAppOpened);
      markTaskBannerDone("m4-s3-open-gong");
      setTimeout(() => runStep(3), 500);
    };
    state.api.eventBus.addEventListener("app:opened", onAppOpened);
  }, 140);
}

// --- Step 4 -----------------------------------------------------------------

function stepWorkedExample(body) {
  body.innerHTML = `
    <p style="font-size:14px;">Watch <strong>M.G.</strong> score Maria 23/25 in 90 seconds.</p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">Click any M chip in the transcript, or Watched it below.</p>`;
  setTimeout(() => {
    const gb = document.querySelector(".os-window.app--gong .os-window-body");
    if (!gb) return;
    mountTaskBanner(gb, { id: "m4-s4-watch", label: "Watch M.G.'s scoring pass", state: "active" });
    if (!gb.querySelector("[data-m4-s4-done]")) {
      const bar = document.createElement("div");
      bar.style.cssText = "margin-top:14px; padding:10px 14px; background:var(--ftc-green-tint); border:1px dashed var(--brand-green); border-radius:6px; display:flex; align-items:center; justify-content:space-between; gap:12px;";
      bar.innerHTML = `<span style="font-size:12.5px;color:var(--ftc-ink-2);">M.G.'s scores: 5, 5, 4, 5 and 4, so 23/25. He dials.</span>
        <button type="button" data-m4-s4-done style="background:var(--brand-green); color:#fff; padding:8px 14px; border:0; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">✓ Watched it</button>`;
      gb.appendChild(bar);
      const complete = () => {
        if (state.step !== 3) return;
        markTaskBannerDone("m4-s4-watch");
        state.timeline.push({ label: "Watched M.G. score Maria", detail: "23/25 · dial today", ts: timestamp() });
        setTimeout(() => runStep(4), 450);
      };
      bar.querySelector("[data-m4-s4-done]").addEventListener("click", complete);
      gb.addEventListener("click", e => { if (e.target.closest?.('.m-chip')) complete(); });
    }
  }, 200);
}

// --- Step 5 -----------------------------------------------------------------

function stepCompletionProblem(body) {
  keepOnly(["outreach"]);
  body.innerHTML = `
    <p style="font-size:14px;">
      <strong>Sven</strong> · DE industrial wholesale · 64 FTE · €27K/mo spend.
      Family-owned, ops head decision-maker. Last signal: filed annual accounts.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">Pick his ICP score and verdict in the panel under the highlighted row.</p>`;
  const options = [
    { label: "A", result: "anti", text: "Skip, too small.", rationale: "Wrong. With 64 FTE and €27K a month of spend, Sven is clearly inside the ICP." },
    { label: "B", result: "correct", text: "Dial this week · score 21/25.", rationale: "Yes. Industry 5, FTE 5, spend 5, decision-maker 4, intent 2: 21 in total. That is between 18 and 21, so he goes on this week's dial list." },
    { label: "C", result: "partial", text: "Add to nurture · score 17/25.", rationale: "Close to the cutoff, but the real score is 21." },
    { label: "D", result: "anti", text: "Escalate to AE · enterprise tier.", rationale: "64 FTE is a mid-sized SMB, not enterprise. Handing it to an AE wastes the lead." },
  ];
  setTimeout(() => mountSvenDrawer(options), 160);
}

function mountSvenDrawer(options) {
  const ob = document.querySelector(".os-window.app--outreach .os-window-body");
  if (!ob) return;
  mountTaskBanner(ob, { id: "m4-s5-pick", label: "Score Sven and pick the verdict", state: "active" });
  const row = [...ob.querySelectorAll(".lead-row")].find(r => /\bSven\b/.test(r.textContent || "")) || ob.querySelector(".lead-row");
  if (!row) return;
  row.classList.add("is-warm-highlight");
  ob.querySelector("[data-m4-s5-drawer]")?.remove();
  const drawer = document.createElement("div");
  drawer.setAttribute("data-m4-s5-drawer", "");
  drawer.className = "tom-drawer";
  drawer.innerHTML = `
    <header class="tom-drawer__head">
      <strong>Sven · pre-dial scoring</strong>
      <span class="tom-drawer__cue">Pick the verdict</span>
    </header>
    <p class="tom-drawer__stem">64 FTE · €27K/mo · ops head decides · Handelsregister filing this week</p>
    <div class="tom-drawer__opts" role="radiogroup">
      ${options.map((o, i) => `<button type="button" class="tom-drawer__opt" role="radio" aria-checked="false" data-result="${o.result}" data-idx="${i}"><span class="tom-drawer__label">${o.label}</span><span class="tom-drawer__text">${o.text}</span></button>`).join("")}
    </div>
    <div class="tom-drawer__fb" id="m4-s5-fb" hidden></div>`;
  row.insertAdjacentElement("afterend", drawer);
  const fb = drawer.querySelector("#m4-s5-fb");
  drawer.querySelectorAll(".tom-drawer__opt").forEach(btn => {
    btn.addEventListener("click", () => {
      const opt = options[Number(btn.dataset.idx)];
      drawer.querySelectorAll(".tom-drawer__opt").forEach(b => { b.classList.remove("is-correct", "is-incorrect"); b.setAttribute("aria-checked", "false"); });
      btn.setAttribute("aria-checked", "true");
      btn.classList.add(opt.result === "correct" ? "is-correct" : "is-incorrect");
      if (opt.result !== "correct") drawer.querySelector('.tom-drawer__opt[data-result="correct"]')?.classList.add("is-reveal");
      fb.hidden = false; fb.textContent = opt.rationale;
      if (opt.result === "correct") {
        markTaskBannerDone("m4-s5-pick");
        state.timeline.push({ label: "Scored Sven correctly", detail: "21/25 · dial this week", ts: timestamp() });
        setTimeout(() => runStep(5), 700);
      }
    });
  });
}

// --- Step 6 solo scorer -----------------------------------------------------

function stepSoloProblem(body) {
  const lead = state.prospects[2] ?? state.prospects[0];
  body.innerHTML = `
    <p style="font-size:14px;"><strong>On your own.</strong> Score ${lead.name} (${lead.industry}) from 1 to 5 on each of the 5 criteria.</p>`;
  setTimeout(() => mountScorer(lead), 200);
}

function mountScorer(lead) {
  const ob = document.querySelector(".os-window.app--outreach .os-window-body");
  if (!ob) return;
  mountTaskBanner(ob, { id: "m4-s6-solo", label: `Score ${lead.name} on 5 criteria, then commit to dial or skip`, state: "active" });
  if (ob.querySelector("[data-m4-s6-stage]")) return;
  const criteria = [
    { k: "industry", label: "Industry fit" },
    { k: "fte", label: "FTE band" },
    { k: "spend", label: "Monthly spend" },
    { k: "dm", label: "Decision-maker access" },
    { k: "intent", label: "Intent signal (recent)" },
  ];
  const wrap = document.createElement("div");
  wrap.setAttribute("data-m4-s6-stage", "");
  wrap.style.cssText = "margin-top:14px; padding:14px; background:#fff; border:1px solid var(--ftc-border); border-radius:8px;";
  wrap.innerHTML = `
    <div style="font-family:var(--ftc-font-mono); font-size:11px; color:var(--ftc-ink-2); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px;">
      ${escapeHtml(lead.name)} · ${escapeHtml(lead.industry)} · ${lead.fte} FTE · ${lead.currency === "GBP" ? "£" : "€"}${lead.monthly_spend?.toLocaleString?.() ?? "?"}/mo
    </div>
    ${criteria.map(c => `
      <div style="display:grid; grid-template-columns:160px 1fr 30px; gap:10px; align-items:center; margin:6px 0;">
        <label for="m4-${c.k}" style="font-size:13px; color:var(--ftc-ink);">${c.label}</label>
        <input type="range" id="m4-${c.k}" data-k="${c.k}" min="1" max="5" value="3" step="1" style="width:100%;">
        <output for="m4-${c.k}" id="m4-${c.k}-v" style="font-family:var(--ftc-font-mono); font-size:13px; font-weight:700; text-align:right; color:var(--brand-green-deep);">3</output>
      </div>`).join("")}
    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px; padding-top:12px; border-top:1px solid var(--ftc-border);">
      <span data-m4-total style="font-family:var(--ftc-font-mono); font-size:14px; color:var(--ftc-ink);">Total: 15 / 25 · skip · nurture instead</span>
      <button type="button" data-m4-decide style="background:var(--brand-green); color:#fff; padding:8px 14px; border:0; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">Commit verdict</button>
    </div>`;
  ob.appendChild(wrap);

  const update = () => {
    let total = 0;
    criteria.forEach(c => {
      const v = Number(wrap.querySelector(`#m4-${c.k}`).value);
      wrap.querySelector(`#m4-${c.k}-v`).textContent = String(v);
      total += v;
    });
    const verdict = total >= 22 ? "dial today" : total >= 18 ? "dial this week" : "skip · nurture instead";
    wrap.querySelector("[data-m4-total]").textContent = `Total: ${total} / 25 · ${verdict}`;
  };
  wrap.querySelectorAll("input[type='range']").forEach(i => i.addEventListener("input", update));

  wrap.querySelector("[data-m4-decide]").addEventListener("click", () => {
    if (state.step !== 5) return;
    let total = 0;
    criteria.forEach(c => total += Number(wrap.querySelector(`#m4-${c.k}`).value));
    state.scoresLogged = true;
    state.timeline.push({ label: `Scored ${lead.name}`, detail: `Total ${total}/25 · ${total >= 22 ? "dial today" : total >= 18 ? "dial this week" : "skip"}`, ts: timestamp() });
    markTaskBannerDone("m4-s6-solo");
    setTimeout(() => runStep(6), 600);
  });
}

// --- Steps 7-9 -------------------------------------------------------------

function stepFeedback(body) {
  keepOnly(["slack"]);
  body.innerHTML = `<p style="font-size:14px;"><strong>J.T.</strong> sent you a DM reviewing your scores.</p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">Read it, then click Mark thread read.</p>`;
  const dm = [
    { author: "J.T. (pod lead)", initials: "JT", ts: "12:48", body: "Scoring discipline 👇" },
    ...state.timeline.map(e => ({ author: "J.T. (pod lead)", initials: "JT", ts: e.ts, body: `✅ ${e.label}: ${e.detail}` })),
    { author: "J.T. (pod lead)", initials: "JT", ts: "12:52", body: "If your gut says to dial a lead below 18, wait. Spend that hour on a lead you can close in 5 minutes." },
    { author: "M.G. (peer)", initials: "MG", ts: "12:54", body: "I score before I even open Gong. The non-ICP leads stop feeling tempting after 2 weeks." },
  ];
  state.api.os.openApp("slack", { channel: { channel_id: "dm-jt-podlead", pinned_messages: [{ title: "3-move card", content_md: "M1 diagnostic · M2 acknowledge · M3 calendar close", related_module: "M4" }], messages: dm } });
  setTimeout(() => mountReadCTA("m4-s7"), 200);
}

function mountReadCTA(prefix) {
  const sb = document.querySelector(".os-window.app--slack .os-window-body");
  if (!sb) return;
  mountTaskBanner(sb, { id: `${prefix}-read`, label: "Read J.T.'s DM", state: "active" });
  if (sb.querySelector(`[data-${prefix}-done]`)) return;
  const bar = document.createElement("div");
  bar.style.cssText = "margin:14px 0 0; padding:10px 14px; background:var(--ftc-green-tint); border:1px dashed var(--brand-green); border-radius:6px; display:flex; align-items:center; justify-content:space-between; gap:12px;";
  bar.innerHTML = `<span style="font-size:12.5px;color:var(--ftc-ink-2);">J.T. will see when you've read it.</span>
    <button type="button" data-${prefix}-done style="background:var(--brand-green); color:#fff; padding:8px 14px; border:0; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">✓ Mark thread read</button>`;
  sb.appendChild(bar);
  bar.querySelector(`[data-${prefix}-done]`).addEventListener("click", () => {
    markTaskBannerDone(`${prefix}-read`);
    setTimeout(() => runStep(state.step + 1), 500);
  });
}

function stepQuiz(body) {
  state.quizIndex = 0; state.quizScore = 0;
  body.innerHTML = `<p style="font-size:14px;"><strong>Quick check</strong>: 4 questions from J.T. in Slack.</p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">Three of four right is a pass.</p>`;
  setTimeout(() => mountQuizInSlack("m4"), 200);
}

function mountQuizInSlack(prefix) {
  const sb = document.querySelector(".os-window.app--slack .os-window-body");
  if (!sb) { state.api.os.openApp("slack"); return setTimeout(() => mountQuizInSlack(prefix), 250); }
  mountTaskBanner(sb, { id: `${prefix}-quiz`, label: "Answer the 4 quiz questions", state: "active" });
  sb.querySelector(`[data-${prefix}-quiz-thread]`)?.remove();
  const thread = document.createElement("div");
  thread.setAttribute(`data-${prefix}-quiz-thread`, "");
  thread.style.cssText = "margin:14px 0 0; padding:14px 16px; background:#fff8e0; border-left:3px solid var(--sun-500,#f5b800); border-radius:6px; font-family:var(--ftc-font-sans);";
  thread.innerHTML = `<div style="font-family:var(--ftc-font-mono);font-size:11px;color:var(--ftc-ink-2);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">J.T. · quick check</div><div data-quiz-host></div>`;
  const messages = sb.querySelector(".slack-msgs, .slack-messages, .slack-main") || sb;
  messages.appendChild(thread);
  renderQuizItemInSlack(thread.querySelector("[data-quiz-host]"), prefix);
}

function renderQuizItemInSlack(host, prefix) {
  const item = state.quizItems[state.quizIndex];
  host.innerHTML = `
    <div style="font-size:12px;color:var(--ftc-ink-2);margin-bottom:6px;">Question ${state.quizIndex + 1} of ${state.quizItems.length}</div>
    <p style="font-size:14px;margin:0 0 10px;color:var(--ftc-ink);">${item.stem}</p>
    <div role="radiogroup" style="display:grid;gap:6px;">
      ${item.options.map((o, i) => `<button type="button" class="tom-drawer__opt" role="radio" aria-checked="false" data-idx="${i}"><span class="tom-drawer__label">${o.label}</span><span class="tom-drawer__text">${o.text}</span></button>`).join("")}
    </div>
    <div class="tom-drawer__fb" id="${prefix}-quiz-fb" hidden></div>
    <div style="margin-top:10px;text-align:right;"><button type="button" id="${prefix}-quiz-next" disabled style="background:var(--brand-green);color:#fff;padding:6px 14px;border:0;border-radius:4px;font-size:12px;font-weight:600;cursor:pointer;opacity:0.5;">${state.quizIndex === state.quizItems.length - 1 ? "Finish quiz" : "Next question"}</button></div>`;
  const fb = host.querySelector(`#${prefix}-quiz-fb`);
  const next = host.querySelector(`#${prefix}-quiz-next`);
  host.querySelectorAll(".tom-drawer__opt").forEach(btn => {
    btn.addEventListener("click", () => {
      const opt = item.options[Number(btn.dataset.idx)];
      host.querySelectorAll(".tom-drawer__opt").forEach(b => { b.classList.remove("is-correct", "is-incorrect"); b.setAttribute("aria-checked", "false"); b.disabled = true; b.style.cursor = "default"; });
      btn.setAttribute("aria-checked", "true");
      btn.classList.add(opt.correct ? "is-correct" : "is-incorrect");
      if (!opt.correct) host.querySelectorAll(".tom-drawer__opt").forEach((b, j) => { if (item.options[j]?.correct) b.classList.add("is-reveal"); });
      fb.hidden = false; fb.textContent = opt.rationale;
      if (opt.correct) state.quizScore += 1;
      next.disabled = false; next.style.opacity = "1";
    });
  });
  next.addEventListener("click", () => {
    if (state.quizIndex < state.quizItems.length - 1) { state.quizIndex += 1; renderQuizItemInSlack(host, prefix); }
    else { markTaskBannerDone(`${prefix}-quiz`); setTimeout(() => runStep(state.step + 1), 500); }
  });
}

function stepTakeaway(body) {
  const pct = Math.round((state.quizScore / state.quizItems.length) * 100);
  body.innerHTML = `<p style="font-size:14px;"><strong>Last step.</strong> M.G. pinned the takeaway in Slack.</p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">Quiz: <strong>${state.quizScore}/${state.quizItems.length}</strong> (${pct}%). Schedule the 7-day refresher in Slack to finish the module.</p>`;
  setTimeout(() => {
    const sb = document.querySelector(".os-window.app--slack .os-window-body");
    if (!sb) { state.api.os.openApp("slack"); return setTimeout(() => stepTakeaway(body), 250); }
    sb.querySelector("[data-m4-quiz-thread]")?.remove();
    mountTaskBanner(sb, { id: "m4-s9-pin", label: "Read M.G.'s takeaway, then schedule the refresher", state: "active" });
    if (sb.querySelector("[data-m4-pinned]")) return;
    const pin = document.createElement("div");
    pin.setAttribute("data-m4-pinned", "");
    pin.style.cssText = "margin:14px 0 0; padding:16px 18px; background:linear-gradient(180deg, var(--ftc-green-tint,#ecf9e7) 0%, #ffffff 100%); border:1px solid var(--brand-green); border-left:4px solid var(--brand-green); border-radius:8px; font-family:var(--ftc-font-sans); box-shadow:0 6px 16px -8px rgba(10,26,16,0.12);";
    pin.innerHTML = `
      <div style="font-family:var(--ftc-font-mono);font-size:10px;color:var(--brand-green);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">📌 Pinned by M.G.</div>
      <p style="font-size:15px;font-style:italic;line-height:1.55;color:var(--ftc-ink);margin:0 0 10px;">"Score every lead from 1 to 5 on industry, FTE, spend, access to the decision-maker and intent. The cutoff is 18. Below that, your time is worth more than the dial."</p>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:14px;padding-top:12px;border-top:1px solid var(--ftc-border);">
        <span style="font-size:12.5px;color:var(--ftc-ink-2);">📅 In 7 days you'll get three short questions on scoring leads.</span>
        <button type="button" data-m4-fin style="background:var(--brand-green);color:#fff;padding:9px 16px;border:0;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;">Schedule refresher →</button>
      </div>`;
    (sb.querySelector(".slack-msgs, .slack-messages, .slack-main") || sb).appendChild(pin);
    pin.querySelector("[data-m4-fin]").addEventListener("click", () => { markTaskBannerDone("m4-s9-pin"); finishModule(); });
  }, 200);
}

function finishModule() {
  const pct = Math.round((state.quizScore / state.quizItems.length) * 100);
  state.api.complete(pct);
  document.getElementById("narrative-next").hidden = true;
  document.getElementById("narrative-back").hidden = true;
  showSummaryCard(pct);
}

function showSummaryCard(pct) {
  keepOnly([]);
  const overlay = document.getElementById("narrative-overlay");
  if (overlay) overlay.style.visibility = "hidden";
  const ms = Date.now() - state.startedAt;
  const mm = Math.floor(ms / 60000);
  const ss = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0");
  const card = document.createElement("div");
  card.className = "summary-card";
  card.innerHTML = `
    <div class="summary-card__panel">
      <div class="summary-card__check">✓</div>
      <div class="summary-card__kicker">Module complete</div>
      <h2 class="summary-card__title">ICP Buyer Fit · ${pct >= 67 ? "passed" : "completed"}</h2>
      <div class="summary-card__stats">
        <div class="summary-card__stat"><span class="summary-card__stat-k">Quiz</span><span class="summary-card__stat-v">${state.quizScore}/${state.quizItems.length}</span><span class="summary-card__stat-sub">${pct}% · ${pct >= 67 ? "pass" : "below the 67% pass mark"}</span></div>
        <div class="summary-card__stat"><span class="summary-card__stat-k">Time</span><span class="summary-card__stat-v">${mm}:${ss}</span><span class="summary-card__stat-sub">target 10:00</span></div>
        <div class="summary-card__stat"><span class="summary-card__stat-k">Steps</span><span class="summary-card__stat-v">${STEPS.length}/${STEPS.length}</span><span class="summary-card__stat-sub">100%</span></div>
      </div>
      <details class="summary-card__recap"><summary>9-step recap</summary><ol class="summary-card__list">${STEPS.map((s, i) => `<li><span class="summary-card__list-n">${i + 1}</span><span class="summary-card__list-label">${s.title}</span></li>`).join("")}</ol></details>
      <div class="summary-card__actions">
        <a class="summary-card__btn summary-card__btn--ghost" href="../">← Back to engagement</a>
        <button type="button" class="summary-card__btn summary-card__btn--primary" data-action="restart">Restart module</button>
      </div>
    </div>`;
  document.body.appendChild(card);
  card.querySelector("[data-action='restart']")?.addEventListener("click", () => location.reload());
}

/** Calls in Gong format (id, rep, lines). The archetype clips in the same file are reference data. */
function gongCalls() {
  return state.transcripts.filter(t => Array.isArray(t.lines));
}

function timestamp() {
  const ms = Date.now() - state.startedAt;
  return `${Math.floor(ms / 60000)}:${Math.floor((ms % 60000) / 1000).toString().padStart(2, "0")}`;
}
function renderFatal(msg) {
  const b = document.getElementById("narrative-body");
  if (b) b.innerHTML = `<p style="color:var(--coral-700);">Could not load module data: ${escapeHtml(msg)}</p>`;
}
function escapeHtml(s) { return String(s ?? "").replace(/[<>&]/g, c => ({ "<":"&lt;",">":"&gt;","&":"&amp;" }[c])); }
