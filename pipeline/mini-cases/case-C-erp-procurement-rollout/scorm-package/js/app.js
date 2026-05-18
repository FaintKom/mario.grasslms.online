/*!
 * Route-the-PO - ERP Procurement Go-Live
 * SCORM 1.2 SCO entry script.
 * Author: Mario Becerra, May 2026.
 */
(function () {
  "use strict";

  var NODES = [
    { id: "cc",     name: "Cost-centre owner",  ruleText: "Always required" },
    { id: "dept",   name: "Department head",    ruleText: "Always required" },
    { id: "fin",    name: "Finance director",   ruleText: "Required if amount >= EUR 10,000" },
    { id: "cto",    name: "CTO",                ruleText: "Required if Category = IT" },
    { id: "cfo",    name: "CFO",                ruleText: "Required if amount >= EUR 50,000 OR Capex = Y" },
    { id: "ceo",    name: "CEO",                ruleText: "Required if amount >= EUR 100,000 OR cross-site" }
  ];

  var POS = [
    {
      id: "po1",
      label: "PO #1 - Office paper",
      points: 20,
      difficulty: "Easy (worked example)",
      vendor: "Schreibwaren Berlin GmbH",
      lineItems: "20 x A4 paper (5,000 sheets), 10 x toner cartridges",
      amountEur: 480,
      glAccount: "6450 - Office consumables",
      costCentre: "Berlin-Admin",
      category: "Indirect",
      capex: false,
      crossSite: false,
      requiredNodeIds: ["cc", "dept"],
      correctRuleId: "baseline",
      ruleOptions: [
        { id: "baseline", label: "Below EUR 10k threshold, no special category - only the baseline two nodes apply" },
        { id: "indirect_finance", label: "Indirect category always needs Finance director" },
        { id: "any_amount_cfo", label: "Any PO needs CFO approval as a safety check" },
        { id: "office_dept_only", label: "Office consumables only need department head approval" }
      ],
      deltaDaysIfWrong: 1.2,
      explanation: "Most POs in MeritoTech sit below EUR 10k and have no IT / capex / cross-site flag. They only need the baseline two nodes. Adding extras here is the #1 cause of approval delay - each extra node adds about 1.2 days in queue time.",
      signals: [
        "Amount EUR 480 is well below the EUR 10k Finance threshold.",
        "Category 'Indirect' has no special routing rule attached.",
        "Single site (Berlin-Admin), capex flag is N - no escalation triggered."
      ]
    },
    {
      id: "po2",
      label: "PO #2 - Engineering laptop fleet",
      points: 35,
      difficulty: "Medium (partial fade)",
      vendor: "Lenovo Business Direct",
      lineItems: "12 x ThinkPad P-series, 12 x docking stations, 3 yr warranty",
      amountEur: 38400,
      glAccount: "0210 - IT hardware (capex)",
      costCentre: "Engineering-Krakow",
      category: "IT",
      capex: true,
      crossSite: false,
      requiredNodeIds: ["cc", "dept", "fin", "cto", "cfo"],
      correctRuleId: "it_capex_under50k",
      ruleOptions: [
        { id: "amount_only", label: "EUR 38k - just Finance director on top of the baseline" },
        { id: "it_capex_under50k", label: "EUR 38k triggers Finance; Category IT triggers CTO; Capex Y triggers CFO (even though amount alone would not)" },
        { id: "needs_ceo", label: "Capex always escalates to CEO" },
        { id: "it_only_cto", label: "IT category only needs CTO; capex flag does not change routing under EUR 50k" }
      ],
      deltaDaysIfWrong: 3.4,
      explanation: "The trap here is the Capex flag. CFO is normally triggered above EUR 50k, but the rule explicitly says 'amount >= EUR 50,000 OR Capex = Y'. So this EUR 38k PO with capex=Y needs the CFO even though it is under the amount threshold. Miss CFO and the PO bounces back from Finance, costing ~3.4 days.",
      signals: [
        "Amount EUR 38,400 >= EUR 10k -> Finance director required.",
        "Category 'IT' -> CTO required.",
        "Capex flag = Y -> CFO required (the OR condition, not the amount condition).",
        "Single site -> CEO NOT required."
      ]
    },
    {
      id: "po3",
      label: "PO #3 - Plant-floor PLC upgrade",
      points: 45,
      difficulty: "Hard (cold practice)",
      vendor: "Siemens Industrial Automation",
      lineItems: "8 x SIMATIC S7-1500 PLCs + integration services for Berlin and Krakow production lines",
      amountEur: 124000,
      glAccount: "0240 - Plant equipment (capex)",
      costCentre: "Production-EU",
      category: "Direct materials",
      capex: true,
      crossSite: true,
      requiredNodeIds: ["cc", "dept", "fin", "cfo", "ceo"],
      correctRuleId: "max_route",
      ruleOptions: [
        { id: "max_route", label: "Amount > EUR 100k AND capex Y AND cross-site -> baseline + Finance + CFO + CEO. Not IT category, so no CTO." },
        { id: "include_cto", label: "All five nodes including CTO - any large capex involves CTO" },
        { id: "needs_ceo_only", label: "Above EUR 100k just needs CEO on top of baseline" },
        { id: "skip_cfo", label: "Once CEO is required, CFO is implicit" }
      ],
      deltaDaysIfWrong: 5.1,
      explanation: "Three triggers stack: EUR 124k > 100k -> CEO; capex=Y -> CFO; >= EUR 10k -> Finance director. Category is 'Direct materials', NOT 'IT' - so CTO is NOT required. Cross-site is already covered by the CEO requirement, no additional node. Stacking rules correctly is the keystone for procurement specialists handling capex.",
      signals: [
        "Amount EUR 124,000 >= EUR 100k -> CEO required.",
        "Amount >= EUR 10k -> Finance director required.",
        "Capex Y AND amount >= EUR 50k -> CFO required.",
        "Category = Direct materials (NOT IT) -> CTO NOT required.",
        "Cross-site = Y -> already covered by CEO rule, no extra node."
      ]
    }
  ];

  var PASS_THRESHOLD = 80;

  var state = {
    poIdx: 0,
    selectedNodes: {},
    chosenRule: null,
    submitted: false,
    results: []
  };

  var $root = document.getElementById("app-root");
  var $live = document.getElementById("aria-live");
  var $progressLabel = document.getElementById("progress-label");
  var $progressFill = document.getElementById("progress-fill");
  var $progressBar = document.querySelector(".progress-bar");
  var $scormStatus = document.getElementById("scorm-status");

  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "class") e.className = attrs[k];
      else if (k === "html") e.innerHTML = attrs[k];
      else if (k.indexOf("on") === 0) e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
    if (children) (Array.isArray(children) ? children : [children]).forEach(function (c) {
      if (c == null) return;
      if (typeof c === "string") e.appendChild(document.createTextNode(c));
      else e.appendChild(c);
    });
    return e;
  }

  function announce(msg) {
    if (!$live) return;
    $live.textContent = "";
    setTimeout(function () { $live.textContent = msg; }, 50);
  }

  function updateProgress() {
    var done = state.results.length;
    $progressLabel.textContent = "PO " + Math.min(done + 1, POS.length) + " of " + POS.length;
    var pct = (done / POS.length) * 100;
    $progressFill.style.width = pct + "%";
    $progressBar.setAttribute("aria-valuenow", String(done));
  }

  function fmtEur(n) {
    return "EUR " + n.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function renderIntro() {
    $root.innerHTML = "";
    var screen = el("section", { class: "screen" });
    screen.appendChild(el("h1", null, "Route-the-PO - ERP Procurement Go-Live"));
    screen.appendChild(el("p", { class: "muted" },
      "You're routing 3 Purchase Orders through the new ERP. For each one, pick the right approval chain - then name the rule. " +
      "Pass threshold: 80 / 100. Time budget: 8 - 10 minutes."));

    var grid = el("div", { class: "intro-grid" });
    grid.appendChild(el("div", { class: "info-card" }, [
      el("h3", null, "The 6 approval nodes"),
      el("ul", null, NODES.map(function (n) {
        return el("li", null, n.name + " - " + n.ruleText);
      }))
    ]));
    grid.appendChild(el("div", { class: "info-card" }, [
      el("h3", null, "Scoring"),
      el("ul", null, [
        el("li", null, "PO #1 = 20 pts, #2 = 35 pts, #3 = 45 pts -> total 100"),
        el("li", null, "Full points if all required nodes selected and no extras"),
        el("li", null, "Half points if all required selected but extras added"),
        el("li", null, "Zero if any required node missed"),
        el("li", null, "5 of each PO's points are for naming the rule applied"),
        el("li", null, "Pass: 80 / 100")
      ])
    ]));
    screen.appendChild(grid);

    screen.appendChild(el("div", { class: "btn-row" }, [
      el("button", { class: "btn btn-primary", onclick: function () { start(); } }, "Start routing")
    ]));

    $root.appendChild(screen);
    $root.focus();
    announce("Course started. Press Start routing when ready.");
  }

  function start() {
    state.poIdx = 0;
    state.results = [];
    SCORM.setStatus("incomplete");
    renderPO();
  }

  function renderPO() {
    state.selectedNodes = {};
    state.chosenRule = null;
    state.submitted = false;
    updateProgress();

    var po = POS[state.poIdx];

    $root.innerHTML = "";
    var screen = el("section", { class: "screen" });
    screen.appendChild(el("h2", null, po.label + " - " + po.difficulty));

    var layout = el("div", { class: "po-layout" });

    var form = el("div", { class: "po-form", role: "region", "aria-label": "Purchase Order details" });
    form.appendChild(el("h3", null, "Purchase order"));
    form.appendChild(fieldRow("Vendor", po.vendor));
    form.appendChild(fieldRow("Line items", po.lineItems));
    var amountVal = el("span", { class: "field-val big" }, fmtEur(po.amountEur));
    if (po.capex) amountVal.appendChild(el("span", { class: "flag" }, "CAPEX"));
    form.appendChild(fieldRowEl("Amount (EUR)", amountVal));
    form.appendChild(fieldRow("GL account", po.glAccount));
    form.appendChild(fieldRow("Cost-centre", po.costCentre));
    form.appendChild(fieldRow("Category", po.category));
    form.appendChild(fieldRow("Capex flag", po.capex ? "Y" : "N"));
    form.appendChild(fieldRow("Cross-site?", po.crossSite ? "Y (Berlin + Krakow)" : "N"));
    layout.appendChild(form);

    var routing = el("div", { class: "routing", role: "region", "aria-label": "Approval routing" });
    routing.appendChild(el("h3", null, "Pick the approval route"));
    routing.appendChild(el("p", { class: "helper" }, "Click each approver this PO needs. Apply the rules - do not over-route, do not under-route."));

    var nodes = el("div", { class: "nodes", role: "group", "aria-label": "Approval nodes" });
    NODES.forEach(function (n) {
      var btn = el("button", {
        class: "node-btn",
        type: "button",
        "data-id": n.id,
        "aria-pressed": "false",
        onclick: function () { toggleNode(n.id); }
      }, [
        el("span", { class: "node-check" }),
        el("span", null, [
          el("span", { class: "node-name" }, n.name),
          el("span", { class: "node-rule" }, n.ruleText)
        ])
      ]);
      nodes.appendChild(btn);
    });
    routing.appendChild(nodes);

    routing.appendChild(el("h3", { style: "margin-top:1rem" }, "Which rule are you applying?"));
    var rules = el("div", { class: "rule-row", role: "radiogroup", "aria-label": "Rule applied" });
    po.ruleOptions.forEach(function (opt) {
      var input = el("input", { type: "radio", name: "rule", value: opt.id });
      var label = el("label", { "data-r": opt.id }, [ input, el("span", null, opt.label) ]);
      label.addEventListener("click", function () { chooseRule(opt.id); });
      rules.appendChild(label);
    });
    routing.appendChild(rules);

    var submit = el("button", {
      class: "btn btn-primary",
      id: "submit-btn",
      disabled: "disabled",
      onclick: function () { submitPO(); }
    }, "Submit routing");
    routing.appendChild(el("div", { class: "btn-row" }, [ submit ]));

    routing.appendChild(el("div", { id: "feedback-slot" }));

    layout.appendChild(routing);
    screen.appendChild(layout);

    $root.appendChild(screen);
    $root.focus();
    announce(po.label + ". " + po.difficulty + ". Amount " + fmtEur(po.amountEur) + ". Category " + po.category + ". Capex " + (po.capex ? "yes" : "no") + ".");
  }

  function fieldRow(lbl, val) {
    return el("div", { class: "field-row" }, [
      el("span", { class: "field-lbl" }, lbl),
      el("span", { class: "field-val" }, val)
    ]);
  }
  function fieldRowEl(lbl, valEl) {
    return el("div", { class: "field-row" }, [
      el("span", { class: "field-lbl" }, lbl),
      valEl
    ]);
  }

  function toggleNode(id) {
    if (state.submitted) return;
    if (state.selectedNodes[id]) delete state.selectedNodes[id];
    else state.selectedNodes[id] = true;
    document.querySelectorAll(".node-btn").forEach(function (b) {
      var match = !!state.selectedNodes[b.getAttribute("data-id")];
      b.classList.toggle("chosen", match);
      b.setAttribute("aria-pressed", match ? "true" : "false");
    });
    refreshSubmit();
  }

  function chooseRule(rid) {
    if (state.submitted) return;
    state.chosenRule = rid;
    document.querySelectorAll(".rule-row label").forEach(function (lbl) {
      var match = lbl.getAttribute("data-r") === rid;
      lbl.classList.toggle("chosen", match);
      var inp = lbl.querySelector("input");
      if (inp) inp.checked = match;
    });
    refreshSubmit();
  }

  function refreshSubmit() {
    var btn = document.getElementById("submit-btn");
    if (!btn) return;
    var hasNodes = Object.keys(state.selectedNodes).length > 0;
    if (hasNodes && state.chosenRule) btn.removeAttribute("disabled");
    else btn.setAttribute("disabled", "disabled");
  }

  function submitPO() {
    if (state.submitted) return;
    state.submitted = true;

    var po = POS[state.poIdx];
    var picked = Object.keys(state.selectedNodes);
    var required = po.requiredNodeIds;

    var missingRequired = required.filter(function (r) { return picked.indexOf(r) < 0; });
    var extras = picked.filter(function (p) { return required.indexOf(p) < 0; });

    var routingPoints;
    var verdict;
    var nodePoints = po.points - 5;
    if (missingRequired.length > 0) {
      routingPoints = 0;
      verdict = "wrong";
    } else if (extras.length > 0) {
      routingPoints = Math.round(nodePoints / 2);
      verdict = "partial";
    } else {
      routingPoints = nodePoints;
      verdict = "correct";
    }

    var ruleCorrect = state.chosenRule === po.correctRuleId;
    var rulePoints = ruleCorrect ? 5 : 0;
    var total = routingPoints + rulePoints;

    state.results.push({
      poId: po.id,
      picked: picked,
      required: required,
      missing: missingRequired,
      extras: extras,
      verdict: verdict,
      rulePicked: state.chosenRule,
      ruleCorrect: ruleCorrect,
      points: total,
      maxPoints: po.points,
      deltaDaysIfWrong: po.deltaDaysIfWrong
    });

    SCORM.setSuspendData({ results: state.results, idx: state.poIdx });

    document.querySelectorAll(".node-btn").forEach(function (b) {
      var id = b.getAttribute("data-id");
      var isReq = required.indexOf(id) >= 0;
      var isPicked = picked.indexOf(id) >= 0;
      if (isReq && isPicked) b.classList.add("req-ok");
      else if (isReq && !isPicked) b.classList.add("req-missed");
      else if (!isReq && isPicked) b.classList.add("extra");
      b.setAttribute("disabled", "disabled");
    });
    var sb = document.getElementById("submit-btn");
    if (sb) sb.setAttribute("disabled", "disabled");

    renderFeedback(po, verdict, missingRequired, extras, ruleCorrect, total);
  }

  function renderFeedback(po, verdict, missing, extras, ruleCorrect, points) {
    var slot = document.getElementById("feedback-slot");
    var cls = verdict === "correct" ? "correct" : verdict === "partial" ? "partial" : "wrong";
    var fb = el("div", { class: "feedback " + cls, role: "status" });

    var head;
    if (verdict === "correct") head = "Routed correctly (+" + points + " pts).";
    else if (verdict === "partial") head = "Required nodes covered, but extras added (+" + points + " pts).";
    else head = "Required node missed (+" + points + " pts).";

    var headEl = el("h4", null, head);
    if (verdict !== "correct") {
      headEl.appendChild(el("span", { class: "delta" }, "+ " + po.deltaDaysIfWrong + " days delay in production"));
    }
    fb.appendChild(headEl);

    if (missing.length > 0) {
      var missingNames = missing.map(function (id) { return NODES.find(function (n) { return n.id === id; }).name; });
      fb.appendChild(el("p", null, "Missed required node(s): " + missingNames.join(", ") + "."));
    }
    if (extras.length > 0) {
      var extraNames = extras.map(function (id) { return NODES.find(function (n) { return n.id === id; }).name; });
      fb.appendChild(el("p", null, "Extra node(s) added (not required): " + extraNames.join(", ") + ". Each adds queue time."));
    }
    if (!ruleCorrect) {
      var rightRule = po.ruleOptions.find(function (r) { return r.id === po.correctRuleId; });
      fb.appendChild(el("p", null, "Rule: the correct rule was: " + (rightRule ? rightRule.label : po.correctRuleId)));
    }

    fb.appendChild(el("p", { class: "muted" }, po.explanation));

    var sig = el("ul", { class: "signals" });
    po.signals.forEach(function (s) { sig.appendChild(el("li", null, s)); });
    fb.appendChild(sig);

    var nextLabel = state.poIdx + 1 < POS.length ? "Next PO" : "Finish & see score";
    fb.appendChild(el("div", { class: "btn-row" }, [
      el("button", { class: "btn btn-primary", onclick: function () { advance(); } }, nextLabel)
    ]));

    slot.innerHTML = "";
    slot.appendChild(fb);
    announce(head);
  }

  function advance() {
    if (state.poIdx + 1 < POS.length) {
      state.poIdx += 1;
      renderPO();
    } else {
      renderResult();
    }
  }

  function renderResult() {
    var total = state.results.reduce(function (s, r) { return s + r.points; }, 0);
    var passed = total >= PASS_THRESHOLD;
    var totalDelta = state.results.reduce(function (s, r) {
      return r.verdict === "correct" ? s : s + r.deltaDaysIfWrong;
    }, 0);

    SCORM.setScore(total);
    SCORM.setStatus(passed ? "passed" : "failed");
    SCORM.setSuspendData({ results: state.results, final: total, passed: passed });

    updateProgress();
    $progressFill.style.width = "100%";
    $progressBar.setAttribute("aria-valuenow", String(POS.length));
    $progressLabel.textContent = "Complete";

    $root.innerHTML = "";
    var screen = el("section", { class: "screen" });
    screen.appendChild(el("h1", null, passed ? "Passed - you're cleared for the ERP go-live." : "Below threshold - retake?"));
    screen.appendChild(el("p", { class: "muted" },
      passed
        ? "80 is a pass. From go-live day, MeritoTech expects 92 percent of POs routed correctly on the first try. You are now part of that 92 percent."
        : "Pass threshold is 80. Procurement is one of the few L&D domains where 'mostly right' costs real money - review the per-PO breakdown and retake."));

    var top = el("div", { class: "result-grid" });

    top.appendChild(el("div", { class: "info-card" }, [
      el("h3", null, "Your score"),
      el("div", { class: "score-big " + (passed ? "pass" : "fail") }, String(total) + " / 100"),
      el("p", null, el("span", { class: "pill " + (passed ? "pass" : "fail") }, passed ? "PASS" : "FAIL")),
      el("p", { class: "muted" }, totalDelta > 0
        ? "If these had been real POs: ~" + totalDelta.toFixed(1) + " days added to production cycle time."
        : "If these had been real POs: zero added cycle time. This is what we are aiming for at go-live.")
    ]));

    var bd = el("div", { class: "info-card" }, [ el("h3", null, "Per-PO breakdown") ]);
    var bdList = el("ul");
    state.results.forEach(function (r, i) {
      var po = POS[i];
      var mark = r.verdict === "correct" ? "OK" : r.verdict === "partial" ? "~" : "X";
      bdList.appendChild(el("li", null, mark + "  " + po.label + " - " + r.points + " / " + po.maxPoints));
    });
    bd.appendChild(bdList);
    top.appendChild(bd);

    screen.appendChild(top);

    screen.appendChild(el("div", { class: "btn-row" }, [
      el("button", { class: "btn", onclick: function () { renderIntro(); } }, "Retake"),
      el("button", { class: "btn btn-primary", onclick: function () { SCORM.finish(); announce("Course closed."); } }, "Finish and exit")
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
      if (prior && Array.isArray(prior.results) && prior.results.length > 0 && prior.results.length < POS.length) {
        state.results = prior.results;
        state.poIdx = prior.results.length;
      }
    } else {
      $scormStatus.textContent = "SCORM: standalone (no LMS)";
      $scormStatus.classList.add("offline");
    }
    renderIntro();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
