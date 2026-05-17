/**
 * salesforce.js · simulated Salesforce CRM.
 *
 * Account / lead / contact tabs, activity timeline, and a "Log next step"
 * modal that fires `calendar:peek` (Calendar opens beside it).
 *
 * Custom fields per brief §15.1: Ramp_Time__c, Tenure_Cohort__c, Pod__c,
 * First_Paid_Quota_Date__c, Next_Step_Booked__c — shown read-only so the
 * rep sees the manager view.
 *
 * @see 02-design/ux-design-system.md §4.3
 */

import { registerApp, icon } from "./registry.js";
import { EVENT } from "../event-log.js";

const TABS = [
  { id: "account",  label: "Account"  },
  { id: "lead",     label: "Lead"     },
  { id: "contact",  label: "Contact"  },
  { id: "timeline", label: "Timeline" },
];

const DEFAULT_RECORD = {
  AccountName: "—",
  Industry: "—",
  AnnualRevenue: "—",
  Ramp_Time__c: "—",
  Tenure_Cohort__c: "—",
  Pod__c: "—",
  First_Paid_Quota_Date__c: "—",
  Next_Step_Booked__c: false,
  Call_Review__c: "",
};

registerApp({
  id: "salesforce",
  name: "Salesforce",
  iconName: "building",
  defaultSize: { w: 560, h: 460 },
  mount(ctx) {
    const { container, eventBus, openApp, options = {} } = ctx;
    let record = { ...DEFAULT_RECORD, ...(options.record ?? {}) };
    let activeTab = "account";

    container.classList.add("app--salesforce");
    container.innerHTML = renderShell();

    function renderShell() {
      return `
        <div class="sf-tabs" role="tablist">
          ${TABS.map(t => `
            <button type="button" role="tab" data-tab="${t.id}" aria-selected="${t.id===activeTab}">${t.label}</button>
          `).join("")}
        </div>
        <div data-region="body"></div>
      `;
    }

    function renderBody() {
      const el = container.querySelector("[data-region='body']");
      if (!el) return;
      if (activeTab === "account") el.innerHTML = renderAccount();
      else if (activeTab === "timeline") el.innerHTML = renderTimeline();
      else el.innerHTML = `<p class="empty">Switch to the Account tab to see records.</p>`;
    }

    function renderAccount() {
      return `
        <dl class="sf-record">
          ${fieldRow("Account name", record.AccountName)}
          ${fieldRow("Industry", record.Industry)}
          ${fieldRow("Annual revenue", record.AnnualRevenue)}
          ${fieldRow("Ramp_Time__c", record.Ramp_Time__c, true)}
          ${fieldRow("Tenure_Cohort__c", record.Tenure_Cohort__c, true)}
          ${fieldRow("Pod__c", record.Pod__c, true)}
          ${fieldRow("First_Paid_Quota_Date__c", record.First_Paid_Quota_Date__c, true)}
          ${fieldRow("Next_Step_Booked__c", String(record.Next_Step_Booked__c), true)}
        </dl>
        <button type="button" class="next-step-btn" data-action="open-next-step">
          ${icon("calendar", "Log next step")} Log next step
        </button>
      `;
    }

    function fieldRow(label, value, readonly) {
      return `
        <div class="sf-field" data-readonly="${readonly ? "true" : "false"}">
          <dt>${escapeHtml(label)}${readonly ? " <span aria-hidden='true'>·</span> <span class='tag'>read-only</span>" : ""}</dt>
          <dd>${escapeHtml(value ?? "—")}</dd>
        </div>
      `;
    }

    function renderTimeline() {
      const entries = (options.timeline ?? [
        { ts: "2026-04-30", type: "call",   text: "Outbound call · voicemail" },
        { ts: "2026-05-02", type: "email",  text: "Follow-up email sent" },
      ]).map(e => `
        <div class="sf-field" style="grid-template-columns:1fr">
          <dt>${escapeHtml(e.ts)} · ${escapeHtml(e.type)}</dt>
          <dd>${escapeHtml(e.text)}</dd>
        </div>
      `).join("");
      return `<dl class="sf-record">${entries}</dl>`;
    }

    function bindTabs() {
      container.querySelector(".sf-tabs")?.addEventListener("click", e => {
        const b = e.target instanceof Element ? e.target.closest("[data-tab]") : null;
        if (!b) return;
        activeTab = b.getAttribute("data-tab");
        container.querySelectorAll(".sf-tabs button").forEach(btn => {
          btn.setAttribute("aria-selected", btn.getAttribute("data-tab") === activeTab ? "true" : "false");
        });
        renderBody();
      });
    }

    function bindNextStep() {
      container.addEventListener("click", e => {
        if (e.target instanceof Element && e.target.closest("[data-action='open-next-step']")) {
          openNextStep();
        }
      });
    }

    function openNextStep() {
      // Spatial-contiguity (ux-design-system §3.1): Calendar appears beside SF.
      eventBus.dispatchEvent(new CustomEvent("calendar:peek", { detail: { source: "salesforce-next-step" } }));
      openApp?.("calendar");
      const modal = document.createElement("div");
      modal.className = "sf-modal";
      modal.innerHTML = `
        <div class="panel" role="dialog" aria-modal="true" aria-label="Log next step">
          <h3 style="margin-top:0">Log next step</h3>
          <p style="font-size:13px;color:var(--ftc-ink-2)">Pick a slot in Calendar then confirm — sets <code>Next_Step_Booked__c = true</code>.</p>
          <label style="display:block;margin-top:12px;font-size:12px">
            Notes <textarea data-field="notes" rows="3" style="width:100%;margin-top:4px;padding:6px;border:1px solid var(--ftc-border);border-radius:4px;font:inherit"></textarea>
          </label>
          <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px">
            <button type="button" data-action="cancel" style="background:transparent;border:1px solid var(--ftc-border);padding:6px 12px;border-radius:6px">Cancel</button>
            <button type="button" class="next-step-btn" data-action="confirm" style="margin:0">Confirm next step</button>
          </div>
        </div>
      `;
      container.appendChild(modal);
      modal.addEventListener("click", ev => {
        const t = ev.target;
        if (!(t instanceof Element)) return;
        if (t.closest("[data-action='cancel']")) { modal.remove(); return; }
        if (t.closest("[data-action='confirm']")) {
          record.Next_Step_Booked__c = true;
          eventBus.dispatchEvent(new CustomEvent("telemetry", {
            detail: { event_name: EVENT.NEXT_STEP_BOOKED_SET, account: record.AccountName },
          }));
          modal.remove();
          renderBody();
        }
      });
    }

    bindTabs();
    bindNextStep();
    renderBody();

    return {
      update(opts) {
        if (opts?.record) { record = { ...record, ...opts.record }; renderBody(); }
      },
      destroy() {},
    };
  },
});

function escapeHtml(s) { return String(s ?? "").replace(/[<>&]/g, c => ({ "<":"&lt;",">":"&gt;","&":"&amp;" }[c])); }
