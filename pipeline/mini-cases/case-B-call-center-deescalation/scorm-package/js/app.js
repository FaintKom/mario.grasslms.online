/*!
 * First-30-Seconds - Call-Centre De-escalation
 * SCORM 1.2 SCO entry script.
 * Author: Mario Becerra, May 2026.
 */
(function () {
  "use strict";

  var CALL_META = {
    customer: "Lisa Greene",
    business: "Greene & Co. florist - 2 shops, Manchester",
    ticket: "AT-2026-44012",
    outageDuration: "4 h 12 min"
  };

  var OPENING = [
    { who: "stage", line: "Call connects. You see her account on screen: 3rd outage in 6 weeks. She has been on hold 11 minutes." },
    { who: "agent", line: "Thank you for calling Arc Telecom, you're through to the support team. How can I help today?" },
    { who: "customer", heat: 4,
      line: "Oh, finally. FINALLY a human. I have been on hold for eleven minutes. Eleven. My broadband has been DOWN for four hours, " +
        "I am running a flower shop, today is Mother's Day weekend, my online orders just stop existing because your service is " +
        "off again - this is the THIRD TIME in six weeks. Are you going to tell me to restart the router again? Because if you " +
        "are I will lose my mind." }
  ];

  var TURNS = [
    {
      id: "t1",
      stepName: "Opener - Listen",
      prompt: "Lisa has just finished an 18-second outburst. She breathes. The right move is the L in LAER. What do you say?",
      correctLaer: "L",
      options: [
        {
          id: "t1a",
          laer: "L", isCorrect: true, escalationDelta: -1,
          quote: "I hear you. Four hours offline on your busiest weekend, third outage in six weeks. Before anything else - I want to make sure I have that picture right. Have I got it?",
          hint: "Paraphrase her own words + check you heard her",
          customerNextLine: { heat: 3, line: "You have it. That is exactly the picture." },
          signals: [
            "You paraphrased her own words back - the strongest single move in the first 30 seconds.",
            "You named the impact (busiest weekend) and the pattern (third in six weeks) without minimising.",
            "You asked permission to continue. She is collaborating with you now, not fighting you."
          ],
          explanation: "L for Listen. The paraphrase signals you heard her; the check-back signals she controls the pace. Both lower the threat frame."
        },
        {
          id: "t1b",
          laer: "A", isCorrect: false, escalationDelta: +1,
          quote: "I'm really sorry about that, ma'am. Let's not worry about the past calls - let's just focus on getting you back online right now.",
          hint: "Apologise + redirect to the present",
          customerNextLine: { heat: 5, line: "DON'T tell me not to worry about it. The past calls ARE the problem. That is the WHOLE problem." },
          signals: [
            "'Let's not worry about the past calls' is the trip-wire phrase. You just told her her experience does not matter.",
            "Generic apology without acknowledging the specific impact she just named.",
            "She is now MORE escalated than at the start of the call."
          ],
          explanation: "This is the most common wrong move from new agents - sounds polite, actually dismissive. Listening is not apologising. Listening is showing you heard the content."
        },
        {
          id: "t1c",
          laer: "E", isCorrect: false, escalationDelta: +2,
          quote: "Okay, I can see your account. Let's just check - is the modem light green or red right now?",
          hint: "Jump straight into the diagnostic checklist",
          customerNextLine: { heat: 5, line: "I DO NOT CARE about the light. The LIGHT is not the problem. The problem is your COMPANY. Are you even LISTENING?" },
          signals: [
            "She literally predicted this move in her outburst: 'if you tell me to restart the router I will lose my mind.'",
            "Skipping straight to troubleshooting before acknowledging is the #1 cause of tier-2 escalations.",
            "Agents do this because the diagnostic script is what they were trained on. The script is correct - but not yet."
          ],
          explanation: "L comes before E for a reason. You cannot diagnose someone who feels unheard."
        }
      ]
    },
    {
      id: "t2",
      stepName: "Impact - Acknowledge",
      prompt: "Lisa has just confirmed your paraphrase. Now is the A in LAER: acknowledge the impact in her terms. What do you say?",
      correctLaer: "A",
      options: [
        {
          id: "t2a",
          laer: "L", isCorrect: false, escalationDelta: +1,
          quote: "Right, so just to repeat back again, you said four hours and three outages in six weeks - is that correct?",
          hint: "Paraphrase again to be sure",
          customerNextLine: { heat: 4, line: "Yes, I just said that. Are you going to actually do something or just keep repeating my own words at me?" },
          signals: [
            "Once paraphrase has landed, repeating it stalls the call.",
            "Listen lands once. After that it starts to feel like a stalling technique."
          ],
          explanation: "Right framework letter, wrong moment. L is done. She is waiting for A."
        },
        {
          id: "t2b",
          laer: "A", isCorrect: true, escalationDelta: -1,
          quote: "That is a real business hit on a weekend that you can't make up. I get why you're furious - I would be too. And three outages in six weeks is not acceptable from us. Let me see what is actually going on.",
          hint: "Name the harm + take responsibility, in her terms",
          customerNextLine: { heat: 2, line: "Okay. Thank you. Honestly, just hearing that helps." },
          signals: [
            "You named the harm as she would name it - 'a weekend that you cannot make up' - not 'service interruption.'",
            "You took responsibility for the company without grovelling.",
            "You bridged to the next step ('let me see what is actually going on') without jumping into the script."
          ],
          explanation: "A for Acknowledge. The phrase 'I get why you're furious - I would be too' is the empathy phrase Verint is looking for in the first 30 seconds."
        },
        {
          id: "t2c",
          laer: "A", isCorrect: false, escalationDelta: +1,
          quote: "I do apologise for the inconvenience. Our policy in these cases is to log the issue and pass it to engineering within 24 hours.",
          hint: "Apologise + cite policy",
          customerNextLine: { heat: 4, line: "TWENTY-FOUR hours? I have orders going out TODAY. Don't quote me POLICY." },
          signals: [
            "Right letter, wrong execution. Policy-citation in an emotional moment reads as deflection.",
            "'Inconvenience' is the call-centre word for what she would call 'losing my Mother's-Day revenue.'",
            "Generic empathy phrases without specifics signal a script, not a person."
          ],
          explanation: "Acknowledge in HER terms, not in policy terms. Specifics beat generics every time."
        }
      ]
    },
    {
      id: "t3",
      stepName: "Diagnostic - Explore",
      prompt: "Lisa just thanked you. The frame has flipped to collaborative. Now is the E in LAER: explore what she actually needs. What do you say?",
      correctLaer: "E",
      options: [
        {
          id: "t3a",
          laer: "E", isCorrect: false, escalationDelta: +1,
          quote: "Right - and is the modem currently showing a green light or a red light?",
          hint: "Standard signal-check script",
          customerNextLine: { heat: 3, line: "Red. Look - can we please skip the light bit? We did this last time." },
          signals: [
            "The diagnostic script is correct - but starts with the wrong question.",
            "Closed yes/no questions do not surface what she NEEDS in the next hour.",
            "She has been through this checklist three times in six weeks - she knows it better than you."
          ],
          explanation: "Closed diagnostic questions are correct LATER. Explore = one open question about what she needs FIRST."
        },
        {
          id: "t3b",
          laer: "E", isCorrect: true, escalationDelta: -1,
          quote: "Before I check the line - what would actually help you in the next hour? Is it getting back online today, getting a guarantee about tomorrow, or knowing what to tell your customers right now?",
          hint: "One open question about her actual need in the next hour",
          customerNextLine: { heat: 1, line: "Honestly? It is the customers. I need to know what to put on Instagram in the next twenty minutes so they don't go to someone else." },
          signals: [
            "One open question. Three concrete options that match HER timeline (next hour, tomorrow, right now).",
            "She just told you the real need - it was not the connection, it was the customer-comms.",
            "If you had run the modem-light script, you would never have surfaced this."
          ],
          explanation: "E for Explore. The hard part is asking BEFORE you start fixing. Most agents skip it because the fix script is what they were trained on."
        },
        {
          id: "t3c",
          laer: "R", isCorrect: false, escalationDelta: +2,
          quote: "Don't worry, I'll get you a credit on your next bill - that should sort things.",
          hint: "Offer a credit",
          customerNextLine: { heat: 4, line: "I don't WANT a credit. I want my INTERNET. A credit doesn't help my Mother's Day orders go out, does it?" },
          signals: [
            "Jumping to R (Respond) without exploring what she needs.",
            "A credit is what call-centres offer when they don't know what else to do. It rarely solves the actual problem.",
            "Worse - it implies the only thing she can be 'compensated' with is money. She has not asked for money."
          ],
          explanation: "Skipping E is the second-most-common path to a repeat call within 24 hours. You do not know yet what 'help' means to her."
        }
      ]
    },
    {
      id: "t4",
      stepName: "Commitment - Respond",
      prompt: "Lisa has named her real need (customer comms in next 20 min). Now is the R in LAER: respond with something specific. What do you say?",
      correctLaer: "R",
      options: [
        {
          id: "t4a",
          laer: "R", isCorrect: true, escalationDelta: -1,
          quote: "Okay. Two things, right now. One - I'm going to text you a holding-message template you can paste into Instagram in two minutes. Two - I'm going to call you back personally on this number at 4:30 pm today with an actual ETA from engineering. If I'm wrong about either, you have my employee ID. Does that work?",
          hint: "Two specific commitments, timestamped, with accountability",
          customerNextLine: { heat: 0, line: "Yes. That works. Thank you. Genuinely." },
          signals: [
            "Two concrete actions, one immediate (template now), one tied to a specific time (4:30 pm).",
            "You gave her your employee ID - accountability without being asked. This single move is what flips repeat-calls from 31 percent to 18 percent.",
            "You finished with a check-back ('Does that work?'). She is in control of the close."
          ],
          explanation: "R for Respond. Specifics. Time. Accountability. The opposite of 'we will be in touch.'"
        },
        {
          id: "t4b",
          laer: "R", isCorrect: false, escalationDelta: +1,
          quote: "I'm going to escalate this straight to our tier-2 engineering team. They'll be in touch as soon as possible.",
          hint: "Escalate immediately",
          customerNextLine: { heat: 3, line: "'In touch as soon as possible' is what the LAST agent said. When? Like, hour? Today?" },
          signals: [
            "Premature escalation - she has not asked for tier-2. You skipped her stated need.",
            "'As soon as possible' is the most-distrusted phrase in customer service. It has no meaning.",
            "Escalating without resolving the immediate need is the #1 driver of tier-2 escalation rate."
          ],
          explanation: "Escalating is sometimes right - but only after the immediate, concrete commitment is honoured first."
        },
        {
          id: "t4c",
          laer: "R", isCorrect: false, escalationDelta: +2,
          quote: "What I can do is offer you a discounted upgrade to our premium business package, which has SLA guarantees.",
          hint: "Upsell during the de-escalation",
          customerNextLine: { heat: 5, line: "Are you - are you trying to SELL me something right now? On THIS call? Get me your manager." },
          signals: [
            "Upselling during a de-escalation call is the cardinal sin.",
            "It signals you have not heard her and you are running a different agenda.",
            "This move triggers an instant tier-2 escalation in every QA framework."
          ],
          explanation: "Never. Ever. Sell. During. A. De-escalation. The fact that this option exists in the agent toolkit is a comp-plan problem, not a training problem - but the agent still has to know not to take it."
        }
      ]
    }
  ];

  var PASS_THRESHOLD = 70;

  var state = {
    turnIdx: 0,
    chosenChoice: null,
    chosenLaer: null,
    submitted: false,
    escalation: 3,
    results: []
  };

  var $root = document.getElementById("app-root");
  var $live = document.getElementById("aria-live");
  var $meterNum = document.getElementById("meter-num");
  var $meterEl = document.getElementById("meter");
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

  function setMeter(v) {
    state.escalation = Math.max(0, Math.min(5, v));
    var pips = $meterEl.querySelectorAll(".meter-pip");
    pips.forEach(function (p, i) {
      p.className = "meter-pip";
      if (i < state.escalation) p.classList.add("lit-" + state.escalation);
    });
    $meterNum.textContent = state.escalation + " / 5";
    $meterEl.setAttribute("aria-valuenow", String(state.escalation));
  }

  function renderIntro() {
    $root.innerHTML = "";
    var screen = el("section", { class: "screen" });
    screen.appendChild(el("h1", null, "First-30-Seconds - Call-Centre De-escalation"));
    screen.appendChild(el("p", { class: "muted" },
      "You're a tier-1 agent at Arc Telecom. Lisa Greene runs a florist. Her broadband has been down 4 hours on Mother's Day weekend. " +
      "She has been on hold 11 minutes and she is hot. The next 30 seconds decide the call."));

    var grid = el("div", { class: "intro-grid" });
    grid.appendChild(el("div", { class: "info-card" }, [
      el("h3", null, "The LAER framework"),
      el("ul", null, [
        el("li", null, "L - Listen: paraphrase before responding"),
        el("li", null, "A - Acknowledge: name the impact in her terms"),
        el("li", null, "E - Explore: one open question about what she needs"),
        el("li", null, "R - Respond: specific commitment with a timestamp")
      ])
    ]));
    grid.appendChild(el("div", { class: "info-card" }, [
      el("h3", null, "Scoring"),
      el("ul", null, [
        el("li", null, "4 turns x 25 pts = 100 pts max"),
        el("li", null, "20 pts for the LAER-aligned reply, 5 for naming the LAER letter"),
        el("li", null, "Pass threshold: 70 / 100"),
        el("li", null, "Watch the caller-mood meter at the top right - it moves with each choice")
      ])
    ]));
    screen.appendChild(grid);

    screen.appendChild(el("div", { class: "btn-row" }, [
      el("button", { class: "btn btn-primary", onclick: function () { startCall(); } }, "Take the call")
    ]));

    $root.appendChild(screen);
    $root.focus();
    setMeter(0);
    announce("Course started. Press Take the call when ready.");
  }

  function startCall() {
    state.turnIdx = 0;
    state.results = [];
    state.escalation = 3;
    SCORM.setStatus("incomplete");
    renderCall();
  }

  function renderCall() {
    state.chosenChoice = null;
    state.chosenLaer = null;
    state.submitted = false;

    var turn = TURNS[state.turnIdx];

    $root.innerHTML = "";
    var screen = el("section", { class: "screen" });

    screen.appendChild(el("div", { class: "call-meta" }, [
      el("span", null, "Ticket " + CALL_META.ticket + "  |  " + CALL_META.customer + "  |  " + CALL_META.business),
      el("span", null, "Outage " + CALL_META.outageDuration + "  |  Step " + (state.turnIdx + 1) + " of " + TURNS.length)
    ]));

    var trans = el("div", { class: "transcript", role: "log", "aria-live": "polite", "aria-label": "Call transcript" });
    OPENING.forEach(function (t) { trans.appendChild(renderTurn(t)); });

    for (var i = 0; i < state.results.length; i++) {
      var prev = TURNS[i];
      var rec = state.results[i];
      var chosen = prev.options.find(function (o) { return o.id === rec.choiceId; });
      trans.appendChild(renderTurn({ who: "agent", line: chosen.quote }));
      trans.appendChild(renderTurn({ who: "customer", heat: chosen.customerNextLine.heat, line: chosen.customerNextLine.line }));
    }

    screen.appendChild(trans);

    screen.appendChild(el("div", { class: "choice-prompt" }, [
      el("strong", null, "Step " + (state.turnIdx + 1) + ": " + turn.stepName + ". "),
      el("span", null, turn.prompt)
    ]));

    var choices = el("div", { class: "choices", role: "radiogroup", "aria-label": "Agent reply options" });
    turn.options.forEach(function (opt) {
      var btn = el("button", {
        class: "choice-btn",
        "data-id": opt.id,
        type: "button",
        role: "radio",
        "aria-checked": "false",
        onclick: function () { chooseChoice(opt.id); }
      }, [
        el("span", { class: "quote" }, '"' + opt.quote + '"'),
        el("span", { class: "hint" }, opt.hint)
      ]);
      choices.appendChild(btn);
    });
    screen.appendChild(choices);

    screen.appendChild(el("h3", { style: "margin-top:1rem" }, "Which LAER letter is this?"));
    var laerRow = el("div", { class: "laer-row", role: "radiogroup", "aria-label": "LAER letter" });
    [
      { l: "L", n: "Listen" }, { l: "A", n: "Acknowledge" }, { l: "E", n: "Explore" }, { l: "R", n: "Respond" }
    ].forEach(function (li) {
      var btn = el("button", {
        class: "laer-btn",
        "data-laer": li.l,
        type: "button",
        role: "radio",
        "aria-checked": "false",
        onclick: function () { chooseLaer(li.l); }
      }, [
        document.createTextNode(li.l),
        el("small", null, li.n)
      ]);
      laerRow.appendChild(btn);
    });
    screen.appendChild(laerRow);

    var submit = el("button", {
      class: "btn btn-primary",
      id: "submit-btn",
      disabled: "disabled",
      onclick: function () { submitTurn(); }
    }, "Lock in reply");
    screen.appendChild(el("div", { class: "btn-row" }, [ submit ]));

    screen.appendChild(el("div", { id: "feedback-slot" }));

    $root.appendChild(screen);
    $root.focus();
    setMeter(state.escalation);
    announce("Step " + (state.turnIdx + 1) + " of " + TURNS.length + ". " + turn.stepName + ". " + turn.prompt);
  }

  function renderTurn(t) {
    var div = el("div", { class: "turn " + (t.who || "stage") });
    div.appendChild(el("span", { class: "who" }, t.who === "customer" ? "Lisa" : t.who === "agent" ? "You" : "-"));
    var line = el("div", { class: "line" + (t.heat ? " heat-" + t.heat : "") });
    line.textContent = t.line;
    div.appendChild(line);
    return div;
  }

  function chooseChoice(id) {
    if (state.submitted) return;
    state.chosenChoice = id;
    document.querySelectorAll(".choice-btn").forEach(function (b) {
      var match = b.getAttribute("data-id") === id;
      b.classList.toggle("chosen", match);
      b.setAttribute("aria-checked", match ? "true" : "false");
    });
    refreshSubmit();
  }

  function chooseLaer(l) {
    if (state.submitted) return;
    state.chosenLaer = l;
    document.querySelectorAll(".laer-btn").forEach(function (b) {
      var match = b.getAttribute("data-laer") === l;
      b.classList.toggle("chosen", match);
      b.setAttribute("aria-checked", match ? "true" : "false");
    });
    refreshSubmit();
  }

  function refreshSubmit() {
    var btn = document.getElementById("submit-btn");
    if (!btn) return;
    if (state.chosenChoice && state.chosenLaer) btn.removeAttribute("disabled");
    else btn.setAttribute("disabled", "disabled");
  }

  function submitTurn() {
    if (state.submitted) return;
    if (!state.chosenChoice || !state.chosenLaer) return;
    state.submitted = true;

    var turn = TURNS[state.turnIdx];
    var chosen = turn.options.find(function (o) { return o.id === state.chosenChoice; });
    var choiceCorrect = chosen.isCorrect === true;
    var laerCorrect = state.chosenLaer === turn.correctLaer;
    var points = (choiceCorrect ? 20 : 0) + (laerCorrect ? 5 : 0);

    setMeter(state.escalation + chosen.escalationDelta);

    state.results.push({
      turnId: turn.id,
      choiceId: chosen.id,
      laer: state.chosenLaer,
      correctChoice: choiceCorrect,
      correctLaer: laerCorrect,
      points: points,
      escalationAfter: state.escalation
    });

    SCORM.setSuspendData({ results: state.results, idx: state.turnIdx, escalation: state.escalation });

    document.querySelectorAll(".choice-btn, .laer-btn").forEach(function (b) { b.setAttribute("disabled", "disabled"); });
    document.getElementById("submit-btn").setAttribute("disabled", "disabled");

    renderFeedback(turn, chosen, choiceCorrect, laerCorrect, points);
  }

  function renderFeedback(turn, chosen, choiceCorrect, laerCorrect, points) {
    var slot = document.getElementById("feedback-slot");
    var fb = el("div", { class: "feedback " + (choiceCorrect ? "correct" : "wrong"), role: "status" });

    var headline = choiceCorrect
      ? "Good move (+" + points + " pts). Mood meter: " + state.escalation + " / 5."
      : "Wrong move (+" + points + " pts). Mood meter: " + state.escalation + " / 5.";
    fb.appendChild(el("h4", null, headline));

    if (!choiceCorrect) {
      var right = turn.options.find(function (o) { return o.isCorrect; });
      fb.appendChild(el("p", null, 'What worked: "' + right.quote + '"'));
    }
    if (!laerCorrect) {
      fb.appendChild(el("p", null, "LAER letter: this turn was " + turn.correctLaer + ". You picked " + state.chosenLaer + "."));
    }

    var sig = el("ul", { class: "signals" });
    chosen.signals.forEach(function (s) { sig.appendChild(el("li", null, s)); });
    fb.appendChild(sig);

    fb.appendChild(el("p", { class: "muted" }, chosen.explanation));

    var nextLabel = state.turnIdx + 1 < TURNS.length ? "Next turn" : "End call & see score";
    fb.appendChild(el("div", { class: "btn-row" }, [
      el("button", { class: "btn btn-primary", onclick: function () { advance(); } }, nextLabel)
    ]));

    slot.innerHTML = "";
    slot.appendChild(fb);
    announce(headline);
  }

  function advance() {
    if (state.turnIdx + 1 < TURNS.length) {
      state.turnIdx += 1;
      renderCall();
    } else {
      renderResult();
    }
  }

  function renderResult() {
    var total = state.results.reduce(function (s, r) { return s + r.points; }, 0);
    var passed = total >= PASS_THRESHOLD;

    SCORM.setScore(total);
    SCORM.setStatus(passed ? "passed" : "failed");
    SCORM.setSuspendData({ results: state.results, final: total, passed: passed, finalEscalation: state.escalation });

    $root.innerHTML = "";
    var screen = el("section", { class: "screen" });
    screen.appendChild(el("h1", null, passed ? "You held the call." : "Below threshold - retake?"));
    screen.appendChild(el("p", { class: "muted" },
      passed
        ? "70 is a pass. The next 90 days are about reproducing this sequence on real calls. Watch your QA scorecards."
        : "Pass threshold is 70. Review the per-turn breakdown below and retake when ready."));

    var top = el("div", { class: "result-grid" });

    top.appendChild(el("div", { class: "info-card" }, [
      el("h3", null, "Your score"),
      el("div", { class: "score-big " + (passed ? "pass" : "fail") }, String(total) + " / 100"),
      el("p", null, el("span", { class: "pill " + (passed ? "pass" : "fail") }, passed ? "PASS" : "FAIL")),
      el("p", { class: "muted" }, "Final caller mood: " + state.escalation + " / 5 (0 = calm, 5 = hostile)")
    ]));

    var bd = el("div", { class: "info-card" }, [ el("h3", null, "Per-turn breakdown") ]);
    var bdList = el("ul");
    state.results.forEach(function (r, i) {
      var turn = TURNS[i];
      var mark = r.correctChoice ? "OK" : "X";
      bdList.appendChild(el("li", null, mark + "  " + turn.stepName + " - " + r.points + " / 25 (mood: " + r.escalationAfter + ")"));
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
      if (prior && Array.isArray(prior.results) && prior.results.length > 0 && prior.results.length < TURNS.length) {
        state.results = prior.results;
        state.turnIdx = prior.results.length;
        state.escalation = prior.escalation != null ? prior.escalation : 3;
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
