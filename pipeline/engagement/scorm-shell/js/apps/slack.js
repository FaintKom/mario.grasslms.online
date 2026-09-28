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
    { title: "3-move card",      content_md: "M1 diagnostic · M2 acknowledge · M3 calendar close", related_module: ["pre-training", "M1", "M2", "M3"] },
    { title: "ICP archetype card", content_md: "Maria (retail) · Tom (SaaS) · Emma (mfg) · Lukas (restaurant)", related_module: "M4" },
    { title: "4-prop decision card", content_md: "Which prop answers which pain", related_module: "M5" },
    { title: "Regulation job aid", content_md: "KYC · AML · SCA · PSD2 · GDPR, and when to escalate", related_module: "M6" },
  ],
  messages: [
    { author: "J.T. (pod lead)", initials: "JT", ts: "09:15", body: "Cadence check — log every dial in SF, no shortcuts." },
    { author: "Sam (peer)",       initials: "SM", ts: "09:42", body: "M.G. nailed an M3 on the Two Pines call this morning — anyone want a debrief at lunch?" },
    { author: "J.T. (pod lead)", initials: "JT", ts: "10:01", body: "Reminder: Maria archetype = retail SMB; opener is location-signal, not price." },
    { author: "M.G. (peer)",      initials: "MG", ts: "10:08", body: "Used the CH filing signal — they liked it. Will share the transcript in #gong-clips later." },
    { author: "Sam (peer)",       initials: "SM", ts: "10:15", body: "Anyone got a clean example of answering an SCA question from the job aid? Manager flagged my last one." },
    { author: "J.T. (pod lead)", initials: "JT", ts: "10:17", body: "Pinned the job aid at the top of the channel. If it's not in the job aid, escalate. No improvising on compliance." },
  ],
};

registerApp({
  id: "slack",
  name: "Slack",
  iconName: "hash",
  defaultSize: { w: 720, h: 560 },
  mount(ctx) {
    const { container, options = {} } = ctx;
    let channel = { ...DEFAULT_CHANNEL, ...(options.channel ?? {}) };
    let highlightModule = options.highlightModule ?? null;

    container.classList.add("app--slack");
    container.innerHTML = render();

    /** A card can serve several modules: related_module is a string or an array. */
    function matches(p, mod) {
      if (!mod) return false;
      const rel = Array.isArray(p.related_module) ? p.related_module : [p.related_module];
      return rel.includes(mod);
    }

    function render() {
      const pinned = (channel.pinned_messages ?? []).map((p, i) => {
        const force = matches(p, highlightModule);
        const rel = Array.isArray(p.related_module) ? p.related_module.join(" ") : (p.related_module ?? "");
        return `
          <div class="pinned-card" data-pin="${i}" data-module="${escapeAttr(rel)}" ${force ? `data-forced="true"` : ""}>
            <div class="pin-label">Pinned${force ? " · for this step" : ""}</div>
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
          <aside class="slack-sidebar" aria-label="Workspace">
            <div class="slack-sidebar__head">
              <div class="slack-sidebar__workspace">FinTechCard</div>
              <div class="slack-sidebar__status">M. Becerra</div>
            </div>
            <div class="slack-sidebar__section">
              <h3>Channels</h3>
              <ul>
                <li aria-current="true"><svg viewBox="0 0 24 24"><path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/></svg> ${escapeHtml(channel.channel_id)}</li>
                <li><svg viewBox="0 0 24 24"><path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/></svg> sdr-coaching</li>
                <li><svg viewBox="0 0 24 24"><path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/></svg> gong-clips</li>
                <li><svg viewBox="0 0 24 24"><path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/></svg> fintechcard-product</li>
                <li><svg viewBox="0 0 24 24"><path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/></svg> announcements</li>
              </ul>
            </div>
            <div class="slack-sidebar__section">
              <h3>Direct messages</h3>
              <ul>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>
                  J.T. (pod lead)
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>
                  Sam (peer)
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>
                  M.G. (peer)
                </li>
              </ul>
            </div>
          </aside>
          <section class="slack-main" aria-label="#${escapeAttr(channel.channel_id)} feed">
            <header class="slack-channel-head">
              <span class="slack-channel-head__title">${escapeHtml(channel.channel_id)}</span>
              <span class="slack-channel-head__meta">
                <span class="slack-channel-head__avatars">
                  <span></span><span></span><span></span><span></span>
                </span>
                <span class="slack-channel-head__count">8</span>
              </span>
            </header>
            <div class="slack-feed">
              ${pinned}
              ${msgs}
            </div>
          </section>
        </div>
      `;
    }

    /** Mark the pinned card(s) for a module without redrawing the feed. */
    function highlight(mod) {
      highlightModule = mod ?? null;
      container.querySelectorAll(".pinned-card[data-pin]").forEach(el => {
        const p = channel.pinned_messages?.[Number(el.getAttribute("data-pin"))];
        const force = Boolean(p && matches(p, highlightModule));
        if (force) el.setAttribute("data-forced", "true"); else el.removeAttribute("data-forced");
        const label = el.querySelector(".pin-label");
        if (label) label.textContent = force ? "Pinned · for this step" : "Pinned";
      });
      container.querySelector(".pinned-card[data-forced]")?.scrollIntoView?.({ block: "nearest" });
    }

    return {
      update(opts = {}) {
        if (opts.channel) {
          channel = { ...DEFAULT_CHANNEL, ...opts.channel };
          highlightModule = opts.highlightModule ?? null;
          container.innerHTML = render();
        } else if ("highlightModule" in opts) {
          highlight(opts.highlightModule);
        }
      },
      destroy() {},
    };
  },
});

function escapeHtml(s) { return String(s ?? "").replace(/[<>&]/g, c => ({ "<":"&lt;",">":"&gt;","&":"&amp;" }[c])); }
function escapeAttr(s) { return escapeHtml(s).replace(/"/g, "&quot;"); }
