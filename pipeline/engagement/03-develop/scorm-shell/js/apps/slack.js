/**
 * slack.js · simulated Slack.
 *
 * Single channel #sdr-pod-uk-manchester with pinned job-aid cards
 * (3-move card · 4-prop card · §19 reg deflection table per ux-design-system
 * §11.2) + cadence pings from the pod manager (J.T.) + peer banter.
 *
 * No leaderboard per D-007 (anti-public-shaming).
 *
 * @see 02-design/ux-design-system.md §4.7
 */

import { registerApp, icon } from "./registry.js";

const DEFAULT_CHANNEL = {
  channel_id: "sdr-pod-uk-manchester",
  pinned_messages: [
    { title: "3-move card",      content_md: "M1 diagnostic · M2 acknowledge · M3 calendar close", related_module: "pre-training" },
    { title: "ICP archetype card", content_md: "Maria (retail) · Tom (SaaS) · Emma (mfg) · Lukas (restaurant)", related_module: "pre-training" },
    { title: "4-prop decision card", content_md: "Pain → Prop quick reference", related_module: "M5" },
    { title: "§19 reg deflection table", content_md: "KYC · AML · SCA · PSD2 · GDPR — escalate row", related_module: "M6" },
  ],
  messages: [
    { author: "J.T. (pod lead)", initials: "JT", ts: "09:15", body: "Cadence check — log every dial in SF, no shortcuts." },
    { author: "Sam (peer)",       initials: "SM", ts: "09:42", body: "M.G. nailed an M3 on the Two Pines call this morning — anyone want a debrief at lunch?" },
    { author: "J.T. (pod lead)", initials: "JT", ts: "10:01", body: "Reminder: Maria archetype = retail SMB; opener is location-signal, not price." },
    { author: "M.G. (peer)",      initials: "MG", ts: "10:08", body: "Used the CH filing signal — they liked it. Will share the transcript in #gong-clips later." },
    { author: "Sam (peer)",       initials: "SM", ts: "10:15", body: "Anyone got a clean §19 deflection example for SCA? Manager flagged my last one." },
    { author: "J.T. (pod lead)", initials: "JT", ts: "10:17", body: "Pinned — §19 table top of channel. If it's not in the table → escalate. No improvising on compliance." },
  ],
};

registerApp({
  id: "slack",
  name: "Slack",
  iconName: "hash",
  defaultSize: { w: 560, h: 460 },
  mount(ctx) {
    const { container, options = {} } = ctx;
    const channel = { ...DEFAULT_CHANNEL, ...(options.channel ?? {}) };
    const highlightModule = options.highlightModule ?? null;

    container.classList.add("app--slack");
    container.innerHTML = render();

    function render() {
      const pinned = (channel.pinned_messages ?? []).map(p => {
        const force = highlightModule && p.related_module === highlightModule;
        return `
          <div class="pinned-card" data-module="${escapeAttr(p.related_module ?? "")}" ${force ? `data-forced="true"` : ""}>
            <div class="pin-label">Pinned${force ? " · forced visible" : ""}</div>
            <strong>${escapeHtml(p.title)}</strong><br>
            <span>${escapeHtml(p.content_md)}</span>
          </div>
        `;
      }).join("");
      const msgs = (channel.messages ?? []).map(m => `
        <div class="slack-msg">
          <div class="avatar" aria-hidden="true">${escapeHtml(m.initials)}</div>
          <div>
            <div class="meta">
              <span class="author">${escapeHtml(m.author)}</span>
              <span class="ts">${escapeHtml(m.ts)}</span>
            </div>
            <div class="body">${escapeHtml(m.body)}</div>
          </div>
        </div>
      `).join("");

      return `
        <div class="slack-layout">
          <aside class="slack-sidebar" aria-label="Channels">
            <h3>Channels</h3>
            <ul>
              <li aria-current="true">${icon("hash")} ${escapeHtml(channel.channel_id)}</li>
              <li>${icon("hash")} sdr-coaching</li>
              <li>${icon("hash")} gong-clips</li>
              <li>${icon("hash")} fintechcard-product</li>
            </ul>
          </aside>
          <section class="slack-feed" aria-label="#${escapeAttr(channel.channel_id)} feed">
            ${pinned}
            ${msgs}
          </section>
        </div>
      `;
    }

    return { destroy() {} };
  },
});

function escapeHtml(s) { return String(s ?? "").replace(/[<>&]/g, c => ({ "<":"&lt;",">":"&gt;","&":"&amp;" }[c])); }
function escapeAttr(s) { return escapeHtml(s).replace(/"/g, "&quot;"); }
