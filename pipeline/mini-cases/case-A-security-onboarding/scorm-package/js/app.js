/*!
 * Phish-or-Pass - Day-1 Inbox Triage
 * SCORM 1.2 SCO entry script.
 * Author: Mario Becerra, May 2026.
 */
(function () {
  "use strict";

  var EMAILS = [
    {
      id: "e1",
      difficulty: "easy",
      fromName: "Dropbox Billing Team",
      fromAddr: "accounts-payable@dropbox-billing.net",
      toAddr: "you@northline.io",
      subject: "Invoice #DBX-44820 overdue - immediate action required",
      bodyText:
        "Hello,\n\n" +
        "Our records indicate Invoice #DBX-44820 for $4,820.00 is now 14 days overdue. " +
        "Service will be suspended on 19 May 2026 unless payment is received within 24 hours.\n\n" +
        "Pay now: https://dropbox-billing.net/pay/DBX-44820\n" +
        "Attachment: Invoice_DBX-44820.pdf\n\n" +
        "Dropbox Billing Team",
      correctVerdict: "report",
      correctReasonId: "domain_mismatch",
      reasonOptions: [
        { id: "domain_mismatch", label: "Sender domain looks like Dropbox but isn't (dropbox-billing.net, not dropbox.com)" },
        { id: "urgency", label: "Urgency pressure (24-hour deadline) without prior context" },
        { id: "url_mismatch", label: "Payment link hostname does not match a legitimate Dropbox domain" },
        { id: "looks_legit", label: "Looks legitimate - I'd just open the PDF" }
      ],
      signals: [
        "Sender domain: dropbox-billing.net is a lookalike. Real Dropbox billing comes from no-reply@dropbox.com.",
        "We have no Dropbox account on file at NorthLine - Finance uses Box.",
        "Aggressive 24-hour suspension language is a classic invoice-fraud lever."
      ],
      explanation:
        "This is a vendor-invoice scam (a common variant of business email compromise). " +
        "The single strongest signal is the lookalike sender domain. Report via the Phish-Report button in Outlook."
    },
    {
      id: "e2",
      difficulty: "hard",
      fromName: "Sarah Chen (CFO)",
      fromAddr: "cfo@northline-corp.co",
      toAddr: "you@northline.io",
      subject: "Quick wire transfer - need this done in the next hour",
      bodyText:
        "Hi,\n\n" +
        "I'm in board prep all afternoon and can't take calls. I need you to push a wire transfer through " +
        "for the new vendor contract we signed yesterday. GBP 18,400 to the account in the attached PDF. " +
        "I'll sign off retroactively when I'm out at 5pm.\n\n" +
        "Please don't loop in anyone else on this - keep it tight, we don't want the wider team second-guessing " +
        "before the announcement on Monday.\n\n" +
        "Thanks for moving fast.\n" +
        "Sarah",
      correctVerdict: "report",
      correctReasonId: "domain_mismatch",
      reasonOptions: [
        { id: "domain_mismatch", label: "Sender display name is real (Sarah Chen), but address is northline-corp.co, not northline.io" },
        { id: "urgency", label: "Urgency + 'don't loop in anyone else' is the textbook CEO-fraud pattern" },
        { id: "looks_legit", label: "It's the CFO - I should just do it" },
        { id: "off_hours", label: "Sent outside of business hours" }
      ],
      signals: [
        "Domain: northline-corp.co is NOT our company domain. We are northline.io.",
        "'Don't loop in anyone else' is the single most reliable CEO-fraud / wire-fraud tell.",
        "Sarah Chen would never bypass dual-approval finance policy. If it sounds like she would, it's not Sarah."
      ],
      explanation:
        "CEO-impersonation wire-fraud - the exact pattern that hit NorthLine in Q1 2026. " +
        "Both signals (domain + 'don't loop anyone else') would each on their own be enough to report. " +
        "The right answer is always: stop, walk over to Finance, verify by voice. Then report."
    },
    {
      id: "e3",
      difficulty: "medium-trick",
      fromName: "NorthLine IT Service Desk",
      fromAddr: "servicedesk@northline.io",
      toAddr: "you@northline.io",
      subject: "Action required: complete your annual MFA re-enrolment by Fri 22 May",
      bodyText:
        "Hi,\n\n" +
        "As part of our SOC 2 controls, every NorthLine employee re-enrols MFA annually. Your enrolment is " +
        "due by Friday 22 May. It takes about 90 seconds.\n\n" +
        "Start re-enrolment: https://sso.northline.io/mfa/reenroll?ticket=ITSD-2026-1188\n\n" +
        "Reference ticket: ITSD-2026-1188 (visible in your Jira Service queue).\n" +
        "Questions: reply to this email or @ #it-help in Slack.\n\n" +
        "NorthLine IT",
      correctVerdict: "open",
      correctReasonId: "legit_signal",
      reasonOptions: [
        { id: "legit_signal", label: "Sender domain matches, URL is on our SSO, ticket reference is verifiable in Jira" },
        { id: "urgency", label: "Friday deadline is suspicious - I'd report it" },
        { id: "domain_mismatch", label: "Looks like phishing - report it" },
        { id: "url_mismatch", label: "The link looks shady - delete it" }
      ],
      signals: [
        "Sender domain (northline.io) matches our company.",
        "URL hostname (sso.northline.io) is on our genuine SSO infrastructure.",
        "Ticket reference is queryable in Jira Service Management.",
        "Slack channel mentioned exists and IT monitors it."
      ],
      explanation:
        "This is the trap. Most awareness training over-tunes you to report everything. " +
        "Reporting legitimate IT emails floods the security queue and trains the SOC to ignore reports. " +
        "When domain + URL + verifiable reference all line up - act on it. " +
        "The skill is knowing when NOT to escalate."
    },
    {
      id: "e4",
      difficulty: "easy",
      fromName: "Microsoft 365 Security",
      fromAddr: "alerts@microsoft-secure-mail.com",
      toAddr: "you@northline.io",
      subject: "Unusual sign-in attempt blocked - verify your account",
      bodyText:
        "We detected an unusual sign-in attempt to your Microsoft 365 account:\n\n" +
        "Location: Lagos, Nigeria\n" +
        "Device: Unknown\n" +
        "Time: 14 minutes ago\n\n" +
        "If this wasn't you, your account may be compromised. Verify your identity now:\n\n" +
        "[Verify Account] -> https://bit.ly/o365-verify-2026\n\n" +
        "Failure to verify within 24 hours will result in account lockout.",
      correctVerdict: "report",
      correctReasonId: "url_mismatch",
      reasonOptions: [
        { id: "url_mismatch", label: "The link is a bit.ly shortener masking a non-Microsoft credential-harvest URL" },
        { id: "domain_mismatch", label: "Sender domain microsoft-secure-mail.com is not a real Microsoft domain" },
        { id: "urgency", label: "Geographic anomaly + 24h lockout = textbook credential-harvest urgency" },
        { id: "legit_signal", label: "This looks like a normal Microsoft alert - I'd click verify" }
      ],
      signals: [
        "Sender domain microsoft-secure-mail.com is not owned by Microsoft (real: microsoft.com, account.microsoft.com).",
        "Shortened URL (bit.ly) masking the real destination is phishing-defining behaviour.",
        "Real Microsoft sign-in alerts never demand action via shortened link - they direct to account.microsoft.com."
      ],
      explanation:
        "Credential-harvest pattern. Microsoft never uses link shorteners in security alerts. " +
        "If you ever feel uncertain about one of these, go directly to account.microsoft.com - never click the email link."
    }
  ];

  var PASS_THRESHOLD = 75;

  var state = {
    currentIdx: 0,
    chosenVerdict: null,
    chosenReasonId: null,
    submitted: false,
    results: []
  };

  var $root = document.getElementById("app-root");
  var $progressLabel = document.getElementById("progress-label");
  var $progressFill = document.getElementById("progress-fill");
  var $live = document.getElementById("aria-live");
  var $scormStatus = document.getElementById("scorm-status");
  var $progressBar = document.querySelector(".progress-bar");

  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (k === "class") e.className = attrs[k];
        else if (k === "html") e.innerHTML = attrs[k];
        else if (k.indexOf("on") === 0) e.addEventListener(k.slice(2), attrs[k]);
        else e.setAttribute(k, attrs[k]);
      }
    }
    if (children) {
      (Array.isArray(children) ? children : [children]).forEach(function (c) {
        if (c == null) return;
        if (typeof c === "string") e.appendChild(document.createTextNode(c));
        else e.appendChild(c);
      });
    }
    return e;
  }

  function announce(msg) {
    if (!$live) return;
    $live.textContent = "";
    setTimeout(function () { $live.textContent = msg; }, 50);
  }

  function updateProgress() {
    var done = state.results.length;
    $progressLabel.textContent = "Email " + Math.min(done + 1, EMAILS.length) + " of " + EMAILS.length;
    var pct = (done / EMAILS.length) * 100;
    $progressFill.style.width = pct + "%";
    $progressBar.setAttribute("aria-valuenow", String(done));
  }

  function renderIntro() {
    $root.innerHTML = "";
    var screen = el("section", { class: "screen", role: "region", "aria-labelledby": "intro-h" });
    screen.appendChild(el("h1", { id: "intro-h" }, "Phish-or-Pass - Day-1 Inbox Triage"));
    screen.appendChild(el("p", { class: "muted" },
      "Your first day at NorthLine. Your inbox has 4 messages. Triage each one. " +
      "Some are real, some are phish. Score 75 / 100 to pass."));

    var grid = el("div", { class: "intro-grid" });

    grid.appendChild(el("div", { class: "info-card" }, [
      el("h3", null, "What you'll do"),
      el("ul", null, [
        el("li", null, "Open each of 4 emails."),
        el("li", null, "Decide: Report (phish), Delete (junk, not phish), or Open (safe)."),
        el("li", null, "Pick the signal that drove your decision."),
        el("li", null, "Read the feedback and move on.")
      ])
    ]));

    grid.appendChild(el("div", { class: "info-card" }, [
      el("h3", null, "Scoring"),
      el("ul", null, [
        el("li", null, "Each email is worth 25 points - 20 for the verdict, 5 for the reason."),
        el("li", null, "Pass threshold: 75 / 100."),
        el("li", null, "Retakes allowed. Highest score is what counts."),
        el("li", null, "Time budget: 6 - 8 minutes.")
      ])
    ]));

    screen.appendChild(grid);

    screen.appendChild(el("div", { class: "btn-row" }, [
      el("button", { class: "btn btn-primary", onclick: function () { startTriage(); } }, "Start triage")
    ]));

    $root.appendChild(screen);
    $root.focus();
    announce("Course started. Press Start triage to open your inbox.");
  }

  function startTriage() {
    state.currentIdx = 0;
    state.results = [];
    SCORM.setStatus("incomplete");
    renderEmail();
  }

  function renderEmail() {
    state.chosenVerdict = null;
    state.chosenReasonId = null;
    state.submitted = false;
    updateProgress();

    var email = EMAILS[state.currentIdx];

    $root.innerHTML = "";
    var screen = el("section", { class: "screen" });
    var grid = el("div", { class: "inbox-grid" });

    var list = el("ul", { class: "inbox-list", role: "list", "aria-label": "Inbox" });
    EMAILS.forEach(function (m, idx) {
      var done = state.results.find(function (r) { return r.emailId === m.id; });
      var cls = "inbox-item";
      if (idx === state.currentIdx) cls += " active";
      if (done) cls += " done";
      var li = el("li", { class: cls, role: "listitem" }, [
        el("span", { class: "inbox-from" }, m.fromName),
        el("span", { class: "inbox-subject" }, m.subject)
      ]);
      list.appendChild(li);
    });
    grid.appendChild(list);

    var view = el("article", { class: "email-view", "aria-labelledby": "email-subj" });

    var header = el("div", { class: "email-header" }, [
      el("div", { class: "row" }, [
        el("span", { class: "lbl" }, "From:"),
        el("span", { class: "val" }, email.fromName + " <" + email.fromAddr + ">")
      ]),
      el("div", { class: "row" }, [
        el("span", { class: "lbl" }, "To:"),
        el("span", { class: "val" }, email.toAddr)
      ]),
      el("div", { class: "row" }, [
        el("span", { class: "lbl" }, "Subject:"),
        el("span", { class: "val", id: "email-subj" }, email.subject)
      ])
    ]);
    view.appendChild(header);

    var body = el("div", { class: "email-body" });
    body.textContent = email.bodyText;
    view.appendChild(body);

    var panel = el("div", { class: "decision-panel" });
    panel.appendChild(el("h3", null, "Your verdict"));

    var verdictRow = el("div", { class: "verdict-row", role: "radiogroup", "aria-label": "Verdict" });
    [
      { v: "report", label: "Report as phish" },
      { v: "delete", label: "Delete (junk)" },
      { v: "open", label: "Open / act on it" }
    ].forEach(function (opt) {
      var btn = el("button", {
        class: "verdict-btn",
        "data-v": opt.v,
        role: "radio",
        "aria-checked": "false",
        type: "button",
        onclick: function () { chooseVerdict(opt.v); }
      }, opt.label);
      verdictRow.appendChild(btn);
    });
    panel.appendChild(verdictRow);

    panel.appendChild(el("h3", { style: "margin-top:1rem" }, "What is the strongest signal?"));

    var reasonRow = el("div", { class: "reason-row", role: "radiogroup", "aria-label": "Reason" });
    email.reasonOptions.forEach(function (opt) {
      var input = el("input", { type: "radio", name: "reason", value: opt.id });
      var label = el("label", { "data-r": opt.id }, [ input, el("span", null, opt.label) ]);
      label.addEventListener("click", function () { chooseReason(opt.id); });
      reasonRow.appendChild(label);
    });
    panel.appendChild(reasonRow);

    var submit = el("button", {
      class: "btn btn-primary",
      id: "submit-btn",
      disabled: "disabled",
      onclick: function () { submitAnswer(); }
    }, "Submit verdict");
    panel.appendChild(el("div", { class: "btn-row" }, [ submit ]));

    panel.appendChild(el("div", { id: "feedback-slot" }));

    view.appendChild(panel);
    grid.appendChild(view);
    screen.appendChild(grid);
    $root.appendChild(screen);
    $root.focus();
    announce("Email " + (state.currentIdx + 1) + " of " + EMAILS.length + " loaded. From " + email.fromName + ". Subject: " + email.subject);
  }

  function chooseVerdict(v) {
    if (state.submitted) return;
    state.chosenVerdict = v;
    document.querySelectorAll(".verdict-btn").forEach(function (b) {
      var match = b.getAttribute("data-v") === v;
      b.classList.toggle("chosen", match);
      b.setAttribute("aria-checked", match ? "true" : "false");
    });
    refreshSubmit();
  }

  function chooseReason(rid) {
    if (state.submitted) return;
    state.chosenReasonId = rid;
    document.querySelectorAll(".reason-row label").forEach(function (lbl) {
      var match = lbl.getAttribute("data-r") === rid;
      lbl.classList.toggle("chosen", match);
      var input = lbl.querySelector("input");
      if (input) input.checked = match;
    });
    refreshSubmit();
  }

  function refreshSubmit() {
    var btn = document.getElementById("submit-btn");
    if (!btn) return;
    if (state.chosenVerdict && state.chosenReasonId) btn.removeAttribute("disabled");
    else btn.setAttribute("disabled", "disabled");
  }

  function submitAnswer() {
    if (state.submitted) return;
    if (!state.chosenVerdict || !state.chosenReasonId) return;
    state.submitted = true;

    var email = EMAILS[state.currentIdx];
    var verdictCorrect = state.chosenVerdict === email.correctVerdict;
    var reasonCorrect = state.chosenReasonId === email.correctReasonId;
    var points = (verdictCorrect ? 20 : 0) + (reasonCorrect ? 5 : 0);

    state.results.push({
      emailId: email.id,
      chosenVerdict: state.chosenVerdict,
      chosenReasonId: state.chosenReasonId,
      verdictCorrect: verdictCorrect,
      reasonCorrect: reasonCorrect,
      points: points
    });

    SCORM.setSuspendData({ results: state.results, idx: state.currentIdx });
    renderFeedback(email, state.results[state.results.length - 1]);
  }

  function renderFeedback(email, record) {
    var slot = document.getElementById("feedback-slot");
    var fb = el("div", { class: "feedback " + (record.verdictCorrect ? "correct" : "wrong"), role: "status" });

    var headline = record.verdictCorrect
      ? "Correct verdict (+" + record.points + " pts)"
      : "Wrong verdict (+" + record.points + " pts). Right call: " + verdictLabel(email.correctVerdict) + ".";
    fb.appendChild(el("h4", null, headline));

    if (!record.reasonCorrect) {
      var rightReason = email.reasonOptions.find(function (o) { return o.id === email.correctReasonId; });
      fb.appendChild(el("p", null, "Strongest signal you missed: " + (rightReason ? rightReason.label : email.correctReasonId)));
    }

    fb.appendChild(el("p", { class: "muted" }, email.explanation));

    var sig = el("ul", { class: "signal-list" });
    email.signals.forEach(function (s) { sig.appendChild(el("li", null, s)); });
    fb.appendChild(sig);

    var nextLabel = state.currentIdx + 1 < EMAILS.length ? "Next email" : "Finish & see score";
    fb.appendChild(el("div", { class: "btn-row" }, [
      el("button", { class: "btn btn-primary", onclick: function () { advance(); } }, nextLabel)
    ]));

    slot.innerHTML = "";
    slot.appendChild(fb);
    announce(headline);
  }

  function verdictLabel(v) {
    return v === "report" ? "Report as phish" : v === "delete" ? "Delete" : "Open / act on it";
  }

  function advance() {
    if (state.currentIdx + 1 < EMAILS.length) {
      state.currentIdx += 1;
      renderEmail();
    } else {
      renderResult();
    }
  }

  function renderResult() {
    var total = state.results.reduce(function (s, r) { return s + r.points; }, 0);
    var passed = total >= PASS_THRESHOLD;

    SCORM.setScore(total);
    SCORM.setStatus(passed ? "passed" : "failed");
    SCORM.setSuspendData({ results: state.results, final: total, passed: passed });

    updateProgress();
    $progressFill.style.width = "100%";
    $progressBar.setAttribute("aria-valuenow", String(EMAILS.length));
    $progressLabel.textContent = "Complete";

    $root.innerHTML = "";
    var screen = el("section", { class: "screen", "aria-labelledby": "result-h" });
    screen.appendChild(el("h1", { id: "result-h" }, passed ? "You passed." : "Below threshold - retake?"));
    screen.appendChild(el("p", { class: "muted" },
      passed
        ? "75 is a pass. The next 90 days are about reproducing this triage on real mail. Use the Phish-Report button in Outlook."
        : "Pass threshold is 75. Review the per-email breakdown below and retake when ready."));

    var top = el("div", { class: "result-grid" });

    top.appendChild(el("div", { class: "info-card" }, [
      el("h3", null, "Your score"),
      el("div", { class: "score-big " + (passed ? "pass" : "fail") }, String(total) + " / 100"),
      el("p", null, el("span", { class: "pill " + (passed ? "pass" : "fail") }, passed ? "PASS" : "FAIL"))
    ]));

    var breakdown = el("div", { class: "info-card" }, [ el("h3", null, "Per-email breakdown") ]);
    var blList = el("ul");
    state.results.forEach(function (r, i) {
      var em = EMAILS[i];
      var mark = r.verdictCorrect ? "OK" : "X";
      blList.appendChild(el("li", null, mark + "  Email " + (i + 1) + ": " + em.fromName + " - " + r.points + " / 25"));
    });
    breakdown.appendChild(blList);
    top.appendChild(breakdown);

    screen.appendChild(top);

    screen.appendChild(el("div", { class: "btn-row" }, [
      el("button", { class: "btn", onclick: function () { renderIntro(); } }, "Retake"),
      el("button", { class: "btn btn-primary", onclick: function () { SCORM.finish(); announce("Course closed. You may close this window."); } }, "Finish and exit")
    ]));

    $root.appendChild(screen);
    $root.focus();
    announce("Final score " + total + " out of 100. " + (passed ? "Passed." : "Below pass threshold."));
  }

  function boot() {
    var online = SCORM.init();
    if (online) {
      $scormStatus.textContent = "SCORM: connected";
      $scormStatus.classList.add("ok");
      var prior = SCORM.getSuspendData();
      if (prior && Array.isArray(prior.results) && prior.results.length > 0 && prior.results.length < EMAILS.length) {
        state.results = prior.results;
        state.currentIdx = prior.results.length;
      }
    } else {
      $scormStatus.textContent = "SCORM: standalone (no LMS)";
      $scormStatus.classList.add("offline");
    }
    renderIntro();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
