/**
 * Module 5 · Product Prop Mapping (multi-stakeholder) · module.js
 *
 * Gagné timeline (10 min) for Class 5 (4cid-blueprint.md §3.1):
 *   0:00-0:30  Gain attention — Outreach ping "CFO joining at 5 min mark"
 *   0:30-1:00  State outcome — LO-PP.1 + LO-PP.3, with brief Evidence note
 *   1:00-1:30  Recall — 4-prop model + Tom ICP archetype
 *   1:30-3:00  Worked example — synthesized §10.2 L.D. Brex/FX pattern
 *              extended multi-stakeholder (founder + finance)
 *   3:00-5:30  Drill D5 — 6 pain → 4 props mapping (prop-pain-bank.json)
 *   5:30-8:30  Solo problem — Tom call with mid-call CFO join (Slack
 *              ping + 2nd participant chip); rep re-does M1 for the
 *              new stakeholder, picks props, sends multi-invitee invite
 *   8:30-9:00  Feedback — props chosen vs ideal per archetype
 *   9:00-9:30  Quiz — 3 LO-PP.x items
 *   9:30-10:00 Key-takeaway + +7d retention
 *
 * Evidence: per storyboard `> Evidence note:` — substrate is brief §12.2
 * (Tom + finance peer) + §12.3 (Emma + bookkeeper); §11 Gong has no
 * multi-stakeholder calls; Phase 5 cohort-1 weekly Gong sample validates
 * LO-PP.3 threshold.
 *
 * Imports shell; reads data/*.json; class 5 multi-stakeholder, derived
 * from §12/§13.
 */

import { bootModule } from "../scorm-shell/js/shell.js";

// =============================================================================
// 1 · Boot
// =============================================================================

const stage = document.getElementById("m5-stage");
const stakeholderAnnouncer = document.getElementById("m5-stakeholder-announcer");

const state = {
  startTs: performance.now(),
  drillScore: 0,
  drillAttempts: 0,
  drillCorrect: 0,
  soloPropsPicked: { primary: null, secondary: null },
  soloStakeholderSwitchHandled: false,
  soloM1RepeatedForSecond: false,
  soloInviteSent: false,
  soloInviteEmails: [],
  quizScore: 0,
  data: { transcripts: null, prospects: null, propPainBank: null, quiz: null },
};

const ASSETS = [
  ["transcripts",  "./data/transcripts.json"],
  ["prospects",    "./data/prospects.json"],
  ["propPainBank", "./data/prop-pain-bank.json"],
  ["quiz",         "./data/quiz.json"],
];

async function loadAssets() {
  for (const [key, url] of ASSETS) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      state.data[key] = await res.json();
    } catch (e) {
      console.error(`[m5] failed to load ${url}`, e);
      state.data[key] = null;
    }
  }
}

const api = bootModule({
  moduleId: "M5",
  title: "Module 5 · Product Prop Mapping",
  appsToLaunch: [
    { id: "outreach"      },
    { id: "phone-dialler" },
    { id: "slack"         },
  ],
  async onReady({ eventLog }) {
    await loadAssets();
    eventLog.record("worked_example_completed", { step: "boot" });
    renderTrigger();
  },
  onComplete() {
    stage.innerHTML = `
      <div class="m5-overlay" role="region" aria-label="Module complete">
        <p class="m5-eyebrow">10:00 / 10:00 · Module complete</p>
        <h1>Nice work.</h1>
        <p>Your event log is flushed to the LMS. A spaced-retrieval mini-quiz on these props lands in 7 days.</p>
      </div>`;
  },
});

const eventLog = api.eventLog;

// =============================================================================
// 2 · Helpers
// =============================================================================

function renderStage(html, after) {
  stage.innerHTML = html;
  requestAnimationFrame(() => {
    const focusable = stage.querySelector("button, [tabindex='0'], input, textarea");
    if (focusable instanceof HTMLElement) focusable.focus({ preventScroll: true });
    after?.();
  });
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[c]));
}

function updateProgress(mmss) {
  const el = document.getElementById("module-progress");
  if (el) el.textContent = `${mmss} / 10:00`;
}

// 4-prop reference (brief §13.1).
const PROPS = [
  { id: 1, name: "Real-time spend control",            fit: "Owners burned by expense fraud" },
  { id: 2, name: "Multi-user cards · per-card limits", fit: "Growing teams · scale-ups" },
  { id: 3, name: "Auto-FX at interbank",               fit: "Cross-border SMBs · SaaS scale-ups" },
  { id: 4, name: "Receipt capture + accounting sync",  fit: "Bookkeeping-painful ops" },
];

// Anti-jargon detector (brief §18.1).
const JARGON_TOKENS = [
  "spend-control platform",
  "expense management orchestration",
  "real-time visibility",
  "spend management",
  "expense orchestration",
  "synergistic",
  "leverage",
  "best-in-class",
];
function detectJargon(text) {
  if (!text) return [];
  const lower = text.toLowerCase();
  return JARGON_TOKENS.filter(t => lower.includes(t));
}

function propCardSidebar(activeId) {
  return `
    <aside class="m5-prop-card" aria-label="4 product props decision card">
      <h3>4-prop card</h3>
      <ol>
        ${PROPS.map(p => `
          <li data-active="${activeId === p.id}">
            <span class="m5-prop-name">${escapeHtml(p.name)}</span>
            <span class="m5-prop-fit">${escapeHtml(p.fit)}</span>
          </li>`).join("")}
      </ol>
    </aside>`;
}

function bindNext(key, handler) {
  stage.querySelectorAll(`[data-next="${key}"]`).forEach(btn => btn.addEventListener("click", handler));
}

// =============================================================================
// 3 · 0:00–0:30 · Gain attention (Outreach ping)
// =============================================================================

function renderTrigger() {
  updateProgress("0:00");
  renderStage(`
    <div class="m5-overlay" role="region" aria-labelledby="m5-trigger-h1">
      <p class="m5-eyebrow">0:00 · Outreach · queue ping</p>
      <h1 id="m5-trigger-h1">A second voice is about to join your call.</h1>
      <div class="m5-slack-ping" role="status">
        <div class="m5-slack-avatar">TM</div>
        <div>
          <span class="m5-slack-name">T.M. (Tom · founder)</span>
          <span class="m5-slack-time">just now · via Outreach note</span>
          <div class="m5-slack-channel">queue: tom-msb · scheduled 14:30</div>
          <p style="margin: 4px 0 0">"FYI my finance lead S.K. is jumping on at the 5-min mark — she runs FX."</p>
        </div>
      </div>
      <p>You opened this dial expecting Tom (Series-B founder, Brex-comparison buyer). Two minutes in, his finance lead joins with a different pain set. Two diagnostics now live on the same call.</p>
      <div class="m5-actions">
        <button class="m5-btn m5-btn--primary" data-next="outcome">Show me the outcome</button>
      </div>
    </div>`);
  bindNext("outcome", renderOutcome);
}

// =============================================================================
// 4 · 0:30–1:00 · State outcome + brief Evidence note
// =============================================================================

function renderOutcome() {
  updateProgress("0:30");
  renderStage(`
    <div class="m5-overlay" role="region" aria-labelledby="m5-out-h1">
      <p class="m5-eyebrow">0:30 · Outcome · LO-PP.1 + LO-PP.3</p>
      <h1 id="m5-out-h1">Map any stated pain to one of the 4 props — in the buyer's words. Hold two diagnostics when the second voice arrives.</h1>
      <p>Peer line — L.D. (Berlin, GC-06): <em>"I never argue against Brex. I ask what their FX exposure looks like. 90% of the time they don't know — and I have a wedge."</em></p>

      <aside class="m5-evidence-note" aria-label="Evidence note">
        <strong>Evidence note.</strong> This module's multi-stakeholder scenario is derived from brief §12.2 (Tom + finance peer) and §13 (4-prop model). No §11 Gong call shows a multi-stakeholder switch yet — cohort-1 Gong listening (weeks 5–8) will validate the LO-PP.3 threshold and is wired in <code>kirkpatrick-measurement-plan.md</code> Sprint 5.2.
      </aside>

      <div class="m5-actions">
        <button class="m5-btn" data-next="trigger">Back</button>
        <button class="m5-btn m5-btn--primary" data-next="recall">Got it · recall the model</button>
      </div>
    </div>`);
  bindNext("trigger", renderTrigger);
  bindNext("recall",  renderRecall);
}

// =============================================================================
// 5 · 1:00–1:30 · Recall · 4-prop model + Tom archetype
// =============================================================================

function renderRecall() {
  updateProgress("1:00");
  const tom = state.data.prospects?.profiles?.find(p => p.id === "TM-tom") ?? {};
  renderStage(`
    <div class="m5-overlay" role="region" aria-labelledby="m5-rec-h1">
      <p class="m5-eyebrow">1:00 · Recall · pre-training</p>
      <h1 id="m5-rec-h1">You already know the model. We're adding one move on top.</h1>
      <h2>4 props (brief §13.1)</h2>
      <ol style="padding-left: 20px;">
        ${PROPS.map(p => `<li><strong>${escapeHtml(p.name)}</strong> — ${escapeHtml(p.fit)}</li>`).join("")}
      </ol>
      <h2>Tom · Series-B founder (§12.2)</h2>
      <p>${escapeHtml(tom.summary ?? "Series-B SaaS · 22 FTE · €18K/mo card spend · top objection: \"We already use Brex\".")}</p>
      <p><strong>Best pitch prop:</strong> Prop 2 (multi-user cards) + Prop 3 (auto-FX).</p>
      <div class="m5-actions">
        <button class="m5-btn" data-next="outcome">Back</button>
        <button class="m5-btn m5-btn--primary" data-next="worked">Show me a worked example</button>
      </div>
    </div>`);
  bindNext("outcome", renderOutcome);
  bindNext("worked",  renderWorkedExample);
}

// =============================================================================
// 6 · 1:30–3:00 · Worked example (multi-voice)
// =============================================================================

function renderWorkedExample() {
  updateProgress("1:30");
  const t = state.data.transcripts?.worked ?? { turns: [] };
  const turnsHtml = (t.turns ?? []).map(renderTurn).join("");
  renderStage(`
    <div class="m5-overlay" role="region" aria-labelledby="m5-wk-h1">
      <p class="m5-eyebrow">1:30 · Worked example · multi-stakeholder</p>
      <h1 id="m5-wk-h1">Watch the rep hold both diagnostics.</h1>
      <p>Tom (founder) is on first. S.K. (finance) joins mid-call. Notice: M1 fires twice — once per stakeholder. M2 then Prop 3 (FX) then Prop 4 (receipts) layered per pain.</p>
      <div class="m5-worked">
        <div class="m5-transcript" tabindex="0" aria-label="Worked-example transcript">
          ${turnsHtml}
        </div>
        ${propCardSidebar(3)}
      </div>
      <div class="m5-actions">
        <button class="m5-btn" data-next="recall">Back</button>
        <button class="m5-btn m5-btn--primary" data-next="drill">Run the D5 drill</button>
      </div>
    </div>`);
  bindNext("recall", renderRecall);
  bindNext("drill",  renderDrill);
  eventLog.record("worked_example_completed", { id: t.id ?? null });
}

function renderTurn(turn) {
  if (turn.kind === "join") {
    return `
      <div class="m5-stakeholder-join" role="note" aria-label="Second stakeholder joined">
        <span>${escapeHtml(turn.label)}</span>
      </div>`;
  }
  const cls = turn.who === "rep" ? "m5-voice-rep"
            : turn.voice === "b" ? "m5-voice-b"
            : "m5-voice-a";
  const tags = (turn.tags ?? []).map(t => `<span class="m5-move-tag ${t.startsWith("Prop") ? "m5-move-tag--prop" : ""}">${escapeHtml(t)}</span>`).join(" ");
  return `
    <div class="m5-turn ${cls}">
      <span class="m5-ts">${escapeHtml(turn.ts ?? "")}</span>
      <span class="m5-speaker">${escapeHtml(turn.speaker)}</span>
      <span class="m5-line">${escapeHtml(turn.line)} ${tags}</span>
    </div>`;
}

// =============================================================================
// 7 · 3:00–5:30 · Drill D5 · prop-pain mapping
// =============================================================================

function renderDrill() {
  updateProgress("3:00");
  const bank = state.data.propPainBank?.pains ?? [];
  const set = bank.slice(0, 6);
  state.drillAttempts = 0;
  state.drillCorrect = 0;

  const pains = set.map(p => `
    <div class="m5-pain"
         draggable="true"
         tabindex="0"
         role="button"
         aria-label="Pain: ${escapeHtml(p.statement)}. Press 1, 2, 3, or 4 to map to a prop."
         data-pain-id="${escapeHtml(p.id)}"
         data-correct-prop="${p.correct_prop}">
      <div>
        <div class="m5-pain-archetype">${escapeHtml(p.archetype_label)}</div>
        <div>${escapeHtml(p.statement)}</div>
      </div>
    </div>`).join("");

  const slots = PROPS.map(p => `
    <div class="m5-prop-slot"
         data-prop-id="${p.id}"
         role="region"
         aria-label="Prop ${p.id}: ${escapeHtml(p.name)} drop zone">
      <h4>Prop ${p.id} · ${escapeHtml(p.name)} <span>${escapeHtml(p.fit)}</span></h4>
      <div class="m5-slot-items"></div>
    </div>`).join("");

  renderStage(`
    <div class="m5-overlay" role="region" aria-labelledby="m5-d5-h1">
      <p class="m5-eyebrow">3:00 · D5 · prop-to-pain drill</p>
      <h1 id="m5-d5-h1">Map each pain to its prop.</h1>
      <p>Drag a pain to the prop that best lands it (or focus the pain and press <kbd>1</kbd>–<kbd>4</kbd>). 6 pains drawn from §12 archetypes.</p>
      <div class="m5-drill-grid">
        <div class="m5-drill-col">
          <h3>Pains</h3>
          ${pains}
        </div>
        <div class="m5-drill-col">
          <h3>Props</h3>
          ${slots}
        </div>
      </div>
      <div class="m5-drill-meta">
        <span>Mapped <span id="m5-drill-count">0</span> / ${set.length}</span>
        <span class="m5-score-pill" id="m5-drill-score">accuracy: —</span>
      </div>
      <div class="m5-actions">
        <button class="m5-btn" data-next="worked">Back</button>
        <button class="m5-btn m5-btn--primary" data-next="solo" id="m5-drill-next" disabled>Continue to solo call</button>
      </div>
    </div>`);

  bindNext("worked", renderWorkedExample);
  bindNext("solo",   renderSolo);
  wireDrill(set.length);
}

function wireDrill(total) {
  const pains = stage.querySelectorAll(".m5-pain");
  const slots = stage.querySelectorAll(".m5-prop-slot");
  const count = stage.querySelector("#m5-drill-count");
  const score = stage.querySelector("#m5-drill-score");
  const nextBtn = stage.querySelector("#m5-drill-next");

  function commit(painEl, propId) {
    const correct = parseInt(painEl.dataset.correctProp, 10) === parseInt(propId, 10);
    painEl.dataset.state = correct ? "correct" : "incorrect";
    painEl.setAttribute("aria-grabbed", "false");
    painEl.draggable = false;
    state.drillAttempts++;
    if (correct) state.drillCorrect++;
    const slot = stage.querySelector(`.m5-prop-slot[data-prop-id="${propId}"] .m5-slot-items`);
    if (slot) {
      const chip = document.createElement("div");
      chip.className = "m5-slot-item";
      const arch = painEl.querySelector(".m5-pain-archetype")?.textContent?.trim() ?? "";
      chip.textContent = `${arch} — ${correct ? "✓" : "✗"}`;
      slot.appendChild(chip);
    }
    eventLog.record("prop_mapped", {
      pain_id: painEl.dataset.painId,
      prop_id: parseInt(propId, 10),
      correct,
    });
    if (count) count.textContent = String(state.drillAttempts);
    const accuracy = Math.round(100 * state.drillCorrect / state.drillAttempts);
    if (score) score.textContent = `accuracy: ${accuracy}%`;
    state.drillScore = accuracy;
    if (state.drillAttempts >= total) {
      if (nextBtn) nextBtn.disabled = false;
      eventLog.record("solo_problem_completed", { phase: "drill", m5_prop_pain_match_accuracy: accuracy });
    }
  }

  pains.forEach(p => {
    p.addEventListener("dragstart", (e) => {
      p.setAttribute("aria-grabbed", "true");
      e.dataTransfer?.setData("text/plain", p.dataset.painId);
    });
    p.addEventListener("dragend", () => p.setAttribute("aria-grabbed", "false"));
    p.addEventListener("keydown", (e) => {
      const k = e.key;
      if (["1","2","3","4"].includes(k)) {
        e.preventDefault();
        if (p.draggable === false) return;
        commit(p, k);
      }
    });
  });

  slots.forEach(slot => {
    slot.addEventListener("dragover", (e) => { e.preventDefault(); slot.dataset.dropping = "true"; });
    slot.addEventListener("dragleave", () => slot.dataset.dropping = "false");
    slot.addEventListener("drop", (e) => {
      e.preventDefault();
      slot.dataset.dropping = "false";
      const painId = e.dataTransfer?.getData("text/plain");
      const painEl = stage.querySelector(`.m5-pain[data-pain-id="${painId}"]`);
      if (!painEl || painEl.draggable === false) return;
      commit(painEl, slot.dataset.propId);
    });
  });
}

// =============================================================================
// 8 · 5:30–8:30 · Solo problem (Tom + mid-call CFO join)
// =============================================================================

function renderSolo() {
  updateProgress("5:30");
  const prof = state.data.prospects?.profiles ?? [];
  const tom = prof.find(p => p.id === "TM-tom") ?? { id: "TM-tom", short_name: "Tom (founder)" };
  const sarah = prof.find(p => p.id === "SK-sarah") ?? { id: "SK-sarah", short_name: "S.K. (finance)" };

  renderStage(`
    <div class="m5-overlay" role="region" aria-labelledby="m5-solo-h1">
      <p class="m5-eyebrow">5:30 · Solo call · live</p>
      <h1 id="m5-solo-h1">Dial Tom.</h1>

      <section class="m5-dialler-card" aria-label="Phone-dialler">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong>Live call · 00:00</strong>
          <span class="m5-dialler-status" id="m5-call-status">Dialling Tom…</span>
        </div>
        <div class="m5-callers" id="m5-callers">
          <span class="m5-participant-chip" data-primary="true">
            <span class="m5-chip-dot"></span>${escapeHtml(tom.short_name)}
          </span>
        </div>
      </section>

      <div class="m5-solo-grid">
        <div class="m5-solo-prompt">
          <strong>Stakeholder 1 · Tom (founder)</strong>
          <p style="font-size:12px; color:var(--ftc-ink-2);">Pain: FX on international SaaS · per-employee card issuance speed.</p>

          <label for="m5-m1-tom">Your M1 diagnostic for Tom</label>
          <textarea id="m5-m1-tom" placeholder="e.g. I saw you closed Series-B last quarter — who handles per-employee card issuance for new hires?"></textarea>

          <label for="m5-prop-tom">Best prop for Tom</label>
          <div class="m5-solo-prop-pick" id="m5-prop-tom" role="group" aria-label="Choose a prop for Tom">
            ${PROPS.map(p => `<button type="button" data-prop="${p.id}" aria-pressed="false">P${p.id} · ${escapeHtml(p.name)}</button>`).join("")}
          </div>
          <p id="m5-jargon-tom" aria-live="polite"></p>
        </div>

        <div class="m5-solo-prompt" id="m5-stake2" hidden>
          <strong>Stakeholder 2 · S.K. (finance lead)</strong>
          <p style="font-size:12px; color:var(--ftc-ink-2);">Pain: FX spread on supplier payments · reconciling to NetSuite.</p>

          <label for="m5-m1-sarah">Your M1 diagnostic for S.K.</label>
          <textarea id="m5-m1-sarah" placeholder="e.g. What does your FX exposure on EUR-USD supplier invoices look like month-to-month?"></textarea>

          <label for="m5-prop-sarah">Best prop for S.K.</label>
          <div class="m5-solo-prop-pick" id="m5-prop-sarah" role="group" aria-label="Choose a prop for S.K.">
            ${PROPS.map(p => `<button type="button" data-prop="${p.id}" aria-pressed="false">P${p.id} · ${escapeHtml(p.name)}</button>`).join("")}
          </div>
          <p id="m5-jargon-sarah" aria-live="polite"></p>
        </div>
      </div>

      <div class="m5-invite-row">
        <div>
          Calendar invite — multi-invitee
          <div class="m5-invite-emails" id="m5-invite-emails">no recipients yet</div>
        </div>
        <button class="m5-btn m5-btn--primary" id="m5-send-invite" disabled>Send invite</button>
      </div>

      <div class="m5-actions">
        <button class="m5-btn" data-next="drill">Back</button>
        <button class="m5-btn m5-btn--primary" id="m5-solo-finish" disabled>Finish call · see feedback</button>
      </div>
    </div>`);

  bindNext("drill", renderDrill);
  wireSolo(tom, sarah);
}

function wireSolo(tom, sarah) {
  eventLog.record("phone_dial_attempt", {
    lead_id: tom.id ?? "TM-tom",
    archetype: "founder",
    calendar_open_before_dial: false,
  });

  // Mid-call CFO join — compressed timing for cohort budget (design-log §3).
  const SECOND_JOIN_DELAY_MS = 8000;
  const joinTimer = setTimeout(() => triggerSecondStakeholder(sarah), SECOND_JOIN_DELAY_MS);

  bindPropPick("m5-prop-tom",   "primary",   "m5-m1-tom",   "m5-jargon-tom");
  bindPropPick("m5-prop-sarah", "secondary", "m5-m1-sarah", "m5-jargon-sarah");

  const sendBtn = document.getElementById("m5-send-invite");
  sendBtn?.addEventListener("click", () => {
    state.soloInviteEmails = ["tom@startup.example", "sarah@startup.example"];
    state.soloInviteSent = true;
    document.getElementById("m5-invite-emails").textContent = state.soloInviteEmails.join(", ");
    sendBtn.disabled = true;
    sendBtn.textContent = "Invite sent ✓";
    eventLog.record("invite_sent", { invitee_email: state.soloInviteEmails, slot_ids: ["TUE-11", "THU-14"] });
    eventLog.record("next_step_booked_set", { account: tom.id ?? "TM-tom" });
    document.getElementById("m5-solo-finish").disabled = false;
  });

  document.getElementById("m5-solo-finish")?.addEventListener("click", () => {
    clearTimeout(joinTimer);
    eventLog.record("solo_problem_completed", {
      phase: "solo",
      stakeholder_switch_handled: state.soloStakeholderSwitchHandled,
      m1_repeat_for_new_stakeholder: state.soloM1RepeatedForSecond,
      props: state.soloPropsPicked,
      invite_sent: state.soloInviteSent,
    });
    renderFeedback();
  });
}

function triggerSecondStakeholder(sarah) {
  updateProgress("7:00");

  // 1) Slack channel ping (synthetic CFO-joins-via-Slack message).
  const overlay = stage.querySelector(".m5-overlay");
  if (overlay) {
    const ping = document.createElement("div");
    ping.className = "m5-slack-ping";
    ping.setAttribute("role", "status");
    ping.innerHTML = `
      <div class="m5-slack-avatar">SK</div>
      <div>
        <span class="m5-slack-name">S.K. (finance lead)</span>
        <span class="m5-slack-time">just now · #sdr-pod-uk-manchester</span>
        <div class="m5-slack-channel">@here joining Tom's call — want me on?</div>
        <p style="margin: 4px 0 0">"Hopping on in 30s — I run our FX exposure tracking."</p>
      </div>`;
    overlay.insertBefore(ping, overlay.querySelector(".m5-solo-grid"));
  }

  // 2) Phone-dialler 2nd-participant chip.
  const callers = document.getElementById("m5-callers");
  if (callers) {
    const chip = document.createElement("span");
    chip.className = "m5-participant-chip";
    chip.dataset.secondary = "true";
    chip.innerHTML = `<span class="m5-chip-dot"></span>${escapeHtml(sarah.short_name ?? "S.K. (finance)")}`;
    callers.appendChild(chip);
  }
  const status = document.getElementById("m5-call-status");
  if (status) status.textContent = "2 participants · S.K. joined";

  // 3) Reveal stakeholder-2 panel.
  const panel = document.getElementById("m5-stake2");
  if (panel) panel.hidden = false;

  // 4) ARIA assertive announcement (multi-stakeholder arrival).
  if (stakeholderAnnouncer) {
    stakeholderAnnouncer.textContent = "Second stakeholder joined the call. New diagnostic required.";
  }

  // 5) Event-log per build spec.
  eventLog.record("stakeholder_switch_handled", { stakeholder_2: sarah.id ?? "SK-sarah" });
  state.soloStakeholderSwitchHandled = true;
}

function bindPropPick(groupId, slotKey, textareaId, jargonElId) {
  const group = document.getElementById(groupId);
  if (!group) return;
  group.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      group.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      const propId = parseInt(btn.dataset.prop, 10);
      state.soloPropsPicked[slotKey] = propId;
      if (slotKey === "secondary") {
        const txt = document.getElementById(textareaId)?.value?.trim() ?? "";
        if (txt.length > 0) {
          state.soloM1RepeatedForSecond = true;
          eventLog.record("m1_repeat_for_new_stakeholder", { word_count: txt.split(/\s+/).length });
        }
      }
      const sendBtn = document.getElementById("m5-send-invite");
      if (sendBtn && state.soloPropsPicked.primary && state.soloPropsPicked.secondary) {
        sendBtn.disabled = false;
      }
      const txtEl = document.getElementById(textareaId);
      const flag  = document.getElementById(jargonElId);
      const tokens = detectJargon(txtEl?.value ?? "");
      if (flag) flag.innerHTML = tokens.length
        ? `<span class="m5-jargon-flag">jargon detected: ${escapeHtml(tokens.join(", "))}</span>`
        : "";
    });
  });
  const txt = document.getElementById(textareaId);
  txt?.addEventListener("input", () => {
    const tokens = detectJargon(txt.value);
    const flag = document.getElementById(jargonElId);
    if (flag) flag.innerHTML = tokens.length
      ? `<span class="m5-jargon-flag">jargon detected: ${escapeHtml(tokens.join(", "))}</span>`
      : "";
  });
}

// =============================================================================
// 9 · 8:30–9:00 · Feedback
// =============================================================================

function renderFeedback() {
  updateProgress("8:30");
  const ideal = { primary: { id: 2, name: "Multi-user cards · per-card limits" },
                  secondary: { id: 3, name: "Auto-FX at interbank" } };
  const picked = state.soloPropsPicked;
  const row = (label, idealProp, pickedId) => {
    const propName = PROPS.find(p => p.id === pickedId)?.name ?? "—";
    const ok = pickedId === idealProp.id;
    return `
      <tr>
        <th scope="row">${escapeHtml(label)}</th>
        <td>P${idealProp.id} · ${escapeHtml(idealProp.name)}</td>
        <td class="${ok ? "m5-good" : "m5-bad"}">${pickedId ? `P${pickedId} · ${escapeHtml(propName)}` : "not picked"}</td>
      </tr>`;
  };
  const switchRow = `
    <tr>
      <th scope="row">Stakeholder switch handled</th>
      <td>Yes (second M1 fired)</td>
      <td class="${state.soloM1RepeatedForSecond ? "m5-good" : "m5-bad"}">${state.soloM1RepeatedForSecond ? "Yes" : "No · you didn't repeat M1"}</td>
    </tr>`;
  const inviteRow = `
    <tr>
      <th scope="row">Multi-invitee calendar invite</th>
      <td>Both stakeholders on invite</td>
      <td class="${state.soloInviteSent ? "m5-good" : "m5-bad"}">${state.soloInviteSent ? state.soloInviteEmails.join(", ") : "no invite sent"}</td>
    </tr>`;

  renderStage(`
    <div class="m5-overlay" role="region" aria-labelledby="m5-fb-h1">
      <p class="m5-eyebrow">8:30 · Feedback · self-score</p>
      <h1 id="m5-fb-h1">Your props vs the ideal per archetype.</h1>
      <table class="m5-feedback-table">
        <thead><tr><th>Move</th><th>Ideal</th><th>You picked</th></tr></thead>
        <tbody>
          ${row("Tom (founder) prop", ideal.primary, picked.primary)}
          ${row("S.K. (finance) prop", ideal.secondary, picked.secondary)}
          ${switchRow}
          ${inviteRow}
        </tbody>
      </table>
      <p style="font-size:12px; color: var(--ftc-ink-2);">D5 drill accuracy: <strong>${state.drillScore}%</strong> · KPI <code>m5_prop_pain_match_accuracy</code>.</p>
      <div class="m5-actions">
        <button class="m5-btn m5-btn--primary" data-next="quiz">3-item quiz</button>
      </div>
    </div>`);
  bindNext("quiz", renderQuiz);
}

// =============================================================================
// 10 · 9:00–9:30 · Quiz (3 LO-PP.x items)
// =============================================================================

function renderQuiz() {
  updateProgress("9:00");
  const items = state.data.quiz?.items ?? [];
  const fields = items.map((q, i) => `
    <fieldset>
      <legend>${i + 1}. ${escapeHtml(q.stem)}</legend>
      <p class="m5-eyebrow">${escapeHtml(q.lo)}</p>
      ${q.options.map((opt, oi) => `
        <label>
          <input type="radio" name="q${i}" value="${oi}">
          <span>${escapeHtml(opt)}</span>
        </label>`).join("")}
    </fieldset>`).join("");

  renderStage(`
    <div class="m5-overlay m5-quiz" role="region" aria-labelledby="m5-q-h1">
      <p class="m5-eyebrow">9:00 · Quiz · 3 items · LO-PP.x</p>
      <h1 id="m5-q-h1">Three items. Then we wrap.</h1>
      <form id="m5-quiz-form">
        ${fields}
        <div class="m5-actions">
          <button class="m5-btn m5-btn--primary" type="submit">Submit answers</button>
        </div>
      </form>
    </div>`);

  document.getElementById("m5-quiz-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    let correct = 0;
    items.forEach((q, i) => {
      const v = document.querySelector(`input[name="q${i}"]:checked`);
      if (v && parseInt(v.value, 10) === q.correct_index) correct++;
    });
    state.quizScore = Math.round(100 * correct / Math.max(1, items.length));
    eventLog.record("solo_problem_completed", { phase: "quiz", quiz_score: state.quizScore });
    renderTakeaway();
  });
}

// =============================================================================
// 11 · 9:30–10:00 · Key-takeaway + +7d retention
// =============================================================================

function renderTakeaway() {
  updateProgress("9:30");
  const soloPts =
    (state.soloStakeholderSwitchHandled ? 25 : 0) +
    (state.soloM1RepeatedForSecond     ? 25 : 0) +
    (state.soloInviteSent              ? 25 : 0) +
    (state.soloPropsPicked.primary   === 2 ? 12.5 : 0) +
    (state.soloPropsPicked.secondary === 3 ? 12.5 : 0);
  const finalScore = Math.round(state.drillScore * 0.4 + soloPts * 0.3 + state.quizScore * 0.3);

  renderStage(`
    <div class="m5-overlay" role="region" aria-labelledby="m5-tk-h1">
      <p class="m5-eyebrow">9:30 · Key-takeaway · +7d retention</p>
      <h1 id="m5-tk-h1">One pain → one prop. In their words.</h1>
      <div class="m5-takeaway">
        <blockquote>"One pain → one prop. Frame it in the buyer's words — not yours. When the second voice joins, ask them a second diagnostic before pitching either of them."</blockquote>
        <cite>— composite of M.G. §10.1 + brand voice §18.1</cite>
      </div>
      <p style="margin-top:14px;">Your composite score: <strong>${finalScore}%</strong>. A spaced-retrieval mini-quiz on LO-PP.1 + LO-PP.3 lands in 7 days (auto-scheduled in Sana).</p>

      <h2>L1 pulse · 1 question</h2>
      <p>Could you use this on a call today? (1 = no · 5 = absolutely)</p>
      <div class="m5-pulse" role="radiogroup" aria-label="L1 pulse">
        <button type="button" data-pulse="1" aria-label="1 of 5">1</button>
        <button type="button" data-pulse="2" aria-label="2 of 5">2</button>
        <button type="button" data-pulse="3" aria-label="3 of 5">3</button>
        <button type="button" data-pulse="4" aria-label="4 of 5">4</button>
        <button type="button" data-pulse="5" aria-label="5 of 5">5</button>
      </div>
      <div class="m5-actions">
        <button class="m5-btn m5-btn--primary" id="m5-finish" disabled>Finish module</button>
      </div>
    </div>`);

  stage.querySelectorAll(".m5-pulse button").forEach(btn => {
    btn.addEventListener("click", () => {
      stage.querySelectorAll(".m5-pulse button").forEach(b => b.style.background = "");
      btn.style.background = "var(--ftc-green-tint, #e6f7f0)";
      eventLog.record("worked_example_completed", { phase: "l1_pulse", score: parseInt(btn.dataset.pulse, 10) });
      document.getElementById("m5-finish").disabled = false;
    });
  });

  document.getElementById("m5-finish")?.addEventListener("click", () => {
    updateProgress("10:00");
    api.complete(finalScore);
  });
}
