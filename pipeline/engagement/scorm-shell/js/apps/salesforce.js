/**
 * salesforce.js · simulated Salesforce CRM Opportunity record.
 *
 * Layout: breadcrumb + record header (opportunity name + stage picker +
 * Save) → Details / Activity / Files tabs → details panel (Amount, Close
 * Date, Owner, Next Step + 5 custom fields kept read-only) → activity
 * timeline with typed icons.
 *
 * Save fires telemetry `EVENT.NEXT_STEP_BOOKED_SET` and flips the
 * Next_Step_Booked__c flag visually (toast + chip).
 *
 * @see 02-design/ux-design-system.md §4.3
 */

import { registerApp, icon } from "./registry.js";
import { EVENT } from "../event-log.js";

const STAGES = ["Prospecting", "Discovery", "Demo", "Negotiation", "Closed Won", "Closed Lost"];

const TABS = [
  { id: "details",  label: "Details"  },
  { id: "activity", label: "Activity" },
  { id: "files",    label: "Files"    },
];

const DEFAULT_RECORD = {
  AccountName: "Two Pines Apparel",
  OpportunityName: "Two Pines Apparel · Card + Spend Mgmt",
  Stage: "Discovery",
  Amount: "€42,000 ARR",
  CloseDate: "2026-07-31",
  Owner: "You",
  NextStep: "Demo · receipt-capture + Xero sync",
  Industry: "Retail SMB",
  AnnualRevenue: "€1.8M",
  Ramp_Time__c: "—",
  Tenure_Cohort__c: "Q2-2026",
  Pod__c: "UK · Manchester",
  First_Paid_Quota_Date__c: "—",
  Next_Step_Booked__c: false,
  Call_Review__c: "",
};

const DEFAULT_TIMELINE = [
  { ts: "2026-04-30", type: "call",    text: "Outbound call · voicemail · left M3 close pattern" },
  { ts: "2026-05-02", type: "email",   text: "Follow-up email sent · open + 2 link clicks" },
  { ts: "2026-05-05", type: "meeting", text: "Demo scheduled · Tue 11:00 (during call · M3 close)" },
];

const TYPE_ICON = {
  call:    "📞",
  email:   "✉️",
  meeting: "📅",
  note:    "📝",
};

registerApp({
  id: "salesforce",
  name: "Salesforce",
  iconName: "building",
  defaultSize: { w: 720, h: 560 },
  mount(ctx) {
    const { container, eventBus, openApp, options = {} } = ctx;
    let record = { ...DEFAULT_RECORD, ...(options.record ?? {}) };
    let timeline = Array.isArray(options.timeline) ? options.timeline.slice() : DEFAULT_TIMELINE.slice();
    let activeTab = "details";

    container.classList.add("app--salesforce");
    container.innerHTML = renderShell();
    bind();
    renderBody();

    function renderShell() {
      return `
        <div class="brand-app">
          <header class="sf-globalnav">
            <button type="button" class="sf-globalnav__launcher" aria-label="App Launcher">
              <span></span><span></span><span></span>
              <span></span><span></span><span></span>
              <span></span><span></span><span></span>
            </button>
            <span class="sf-globalnav__app">Sales</span>
            <div class="sf-globalnav__search">Search Salesforce</div>
            <div class="sf-globalnav__icons">
              <button type="button" class="sf-globalnav__icon" aria-label="Favorites">
                <svg viewBox="0 0 24 24"><path d="m12 3 2.5 6 6.5.5-5 4.5L17.5 21 12 17l-5.5 4 1.5-7-5-4.5L9.5 9z"/></svg>
              </button>
              <button type="button" class="sf-globalnav__icon" aria-label="Setup">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 0 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h0a1.6 1.6 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8h0a1.6 1.6 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>
              </button>
              <button type="button" class="sf-globalnav__icon" aria-label="Help">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 4.5 2.6c-.9.5-1.5 1-1.5 2.4M12 17h.01"/></svg>
              </button>
              <button type="button" class="sf-globalnav__icon" aria-label="Notifications">
                <svg viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>
              </button>
            </div>
            <span class="sf-globalnav__avatar" aria-hidden="true">MB</span>
          </header>
          <nav class="sf-tabbar" aria-label="Salesforce object tabs">
            <span class="sf-tabbar__home">
              <svg viewBox="0 0 24 24"><path d="M12 3 3 11h2v9h5v-6h4v6h5v-9h2z"/></svg>
            </span>
            <div class="sf-tabbar__items">
              <button type="button" class="sf-tabbar__item">Home</button>
              <button type="button" class="sf-tabbar__item" aria-current="page">Opportunities</button>
              <button type="button" class="sf-tabbar__item">Leads</button>
              <button type="button" class="sf-tabbar__item">Accounts</button>
              <button type="button" class="sf-tabbar__item sf-tabbar__item--record">
                ${escapeHtml(record.OpportunityName)}
                <span class="sf-tabbar__close" aria-hidden="true">×</span>
              </button>
            </div>
          </nav>
          <div class="sf-record">
            <div class="sf-breadcrumb" aria-label="Breadcrumb">
              <span>Sales</span><span class="sf-bc-sep">›</span>
              <span>Opportunities</span><span class="sf-bc-sep">›</span>
              <span class="sf-bc-current">${escapeHtml(record.OpportunityName)}</span>
            </div>
            <header class="sf-record-head">
              <span class="sf-record-head__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M3 7l9-4 9 4-9 4z"/><path d="M3 12l9 4 9-4M3 17l9 4 9-4"/></svg>
              </span>
              <div class="sf-record-head__main">
                <div class="sf-record-head__kicker">Opportunity</div>
                <h2 class="sf-record-head__title">${escapeHtml(record.OpportunityName)}</h2>
                <div class="sf-record-head__meta">
                  ${escapeHtml(record.AccountName)} &middot; Close ${escapeHtml(record.CloseDate)} &middot; ${escapeHtml(record.Amount)}
                </div>
              </div>
              <div class="sf-record-head__actions">
                <label class="sf-stage-picker">
                  <span class="sf-stage-label">Stage</span>
                  <select data-field="stage">
                    ${STAGES.map(s => `<option value="${escapeAttr(s)}" ${s===record.Stage?'selected':''}>${escapeHtml(s)}</option>`).join("")}
                  </select>
                </label>
                <button type="button" class="sf-save-btn" data-action="save">Save</button>
              </div>
            </header>
            <div class="sf-tabs" role="tablist">
              ${TABS.map(t => `
                <button type="button" role="tab" data-tab="${t.id}" aria-selected="${t.id===activeTab}">${t.label}</button>
              `).join("")}
            </div>
            <div data-region="body" class="sf-body"></div>
            <div data-region="toast" class="sf-toast" hidden></div>
          </div>
        </div>
      `;
    }

    function renderBody() {
      const el = container.querySelector("[data-region='body']");
      if (!el) return;
      if (activeTab === "details")       el.innerHTML = renderDetails();
      else if (activeTab === "activity") el.innerHTML = renderActivity();
      else el.innerHTML = `<p class="sf-empty">No files attached.</p>`;
    }

    function renderDetails() {
      const flag = record.Next_Step_Booked__c
        ? `<span class="sf-flag sf-flag--on">TRUE</span>`
        : `<span class="sf-flag sf-flag--off">FALSE</span>`;
      return `
        <div class="sf-details">
          <section class="sf-details__col">
            <h3 class="sf-details__heading">Key fields</h3>
            <dl class="sf-fields">
              ${field("Amount", record.Amount)}
              ${field("Close Date", record.CloseDate)}
              ${field("Owner", record.Owner)}
              ${field("Next Step", `<input type="text" data-field="next-step" value="${escapeAttr(record.NextStep)}" />`, { html: true })}
            </dl>
          </section>
          <section class="sf-details__col">
            <h3 class="sf-details__heading">Account · custom fields</h3>
            <dl class="sf-fields">
              ${field("Industry", record.Industry, { readonly: true })}
              ${field("Annual revenue", record.AnnualRevenue, { readonly: true })}
              ${field("Ramp_Time__c", record.Ramp_Time__c, { readonly: true })}
              ${field("Tenure_Cohort__c", record.Tenure_Cohort__c, { readonly: true })}
              ${field("Pod__c", record.Pod__c, { readonly: true })}
              ${field("Next_Step_Booked__c", flag, { readonly: true, html: true })}
            </dl>
          </section>
        </div>
      `;
    }

    function field(label, value, opts = {}) {
      const valHtml = opts.html ? value : escapeHtml(String(value ?? "—"));
      return `
        <div class="sf-field" data-readonly="${opts.readonly ? "true" : "false"}">
          <dt>${escapeHtml(label)}${opts.readonly ? ` <span class="sf-tag">read-only</span>` : ""}</dt>
          <dd>${valHtml}</dd>
        </div>
      `;
    }

    function renderActivity() {
      const entries = timeline.map(e => `
        <li class="sf-activity__row" data-type="${escapeAttr(e.type)}">
          <span class="sf-activity__icon" aria-hidden="true">${TYPE_ICON[e.type] || "📄"}</span>
          <div class="sf-activity__main">
            <div class="sf-activity__ts">${escapeHtml(e.ts)} &middot; ${escapeHtml(e.type)}</div>
            <div class="sf-activity__text">${escapeHtml(e.text)}</div>
          </div>
        </li>
      `).join("");
      return `<ul class="sf-activity">${entries}</ul>`;
    }

    function bind() {
      container.addEventListener("click", e => {
        const t = e.target;
        if (!(t instanceof Element)) return;
        const tabBtn = t.closest("[data-tab]");
        if (tabBtn) {
          activeTab = tabBtn.getAttribute("data-tab");
          container.querySelectorAll(".sf-tabs button").forEach(btn => {
            btn.setAttribute("aria-selected", btn.getAttribute("data-tab") === activeTab ? "true" : "false");
          });
          renderBody();
          return;
        }
        if (t.closest('[data-action="save"]')) saveRecord();
      });
      container.addEventListener("change", e => {
        if (e.target instanceof HTMLSelectElement && e.target.dataset.field === "stage") {
          record.Stage = e.target.value;
        }
      });
      container.addEventListener("input", e => {
        if (e.target instanceof HTMLInputElement && e.target.dataset.field === "next-step") {
          record.NextStep = e.target.value;
        }
      });
    }

    function saveRecord() {
      record.Next_Step_Booked__c = true;
      const today = new Date().toISOString().slice(0, 10);
      timeline = [
        { ts: today, type: "meeting", text: `Next step booked · ${record.NextStep}` },
        ...timeline,
      ];
      eventBus.dispatchEvent(new CustomEvent("telemetry", {
        detail: { event_name: EVENT.NEXT_STEP_BOOKED_SET, account: record.AccountName, stage: record.Stage },
      }));
      const toast = container.querySelector("[data-region='toast']");
      if (toast) {
        toast.hidden = false;
        toast.textContent = `✓ Saved · Next_Step_Booked__c flipped to TRUE`;
        setTimeout(() => { if (toast) toast.hidden = true; }, 2400);
      }
      renderBody();
    }

    return {
      update(opts) {
        if (opts?.record)   { record = { ...record, ...opts.record }; renderBody(); }
        if (opts?.timeline) { timeline = opts.timeline.slice(); renderBody(); }
      },
      destroy() {},
    };
  },
});

function escapeHtml(s) { return String(s ?? "").replace(/[<>&]/g, c => ({ "<":"&lt;",">":"&gt;","&":"&amp;" }[c])); }
function escapeAttr(s) { return escapeHtml(s).replace(/"/g, "&quot;"); }
