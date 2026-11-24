/* Course content: the cover and the seventeen steps. All learner-facing copy lives here. */
(function () {
  "use strict";
  var AID = window.AID, h = AID.h;

  AID.units = [
    { id: "u1", title: "the lesson plan" },
    { id: "u2", title: "the slide deck" },
    { id: "u3", title: "the SCORM exercise" }
  ];

  /* Append every top-level node of `html` to `host`; return the first one. */
  function add(html, host) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    var first = t.content.firstElementChild;
    host.appendChild(t.content);
    return first;
  }
  function notes() {
    return '<details class="notes"><summary>Dana\'s notes on the refund policy</summary><ol>' + AID.POLICY.map(function (p) { return "<li>" + p + "</li>"; }).join("") + "</ol></details>";
  }
  function plan(title, goal, rows, total, bar) {
    return '<div class="doc"><div class="doc__bar"><i></i>' + bar + '</div><div class="doc__body"><h4>' + title + '</h4><p class="doc__obj"><strong>Goal.</strong> ' + goal + '</p><table class="plan"><tbody>' +
      rows.map(function (r) { return "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td></tr>"; }).join("") + "</tbody>" + (total ? "<tfoot><tr><td>Total</td><td>" + total + "</td></tr></tfoot>" : "") + "</table></div></div>";
  }
  var DRAFT_A = [["5 min", "Introduction: what a refund is and why shops offer one."], ["15 min", "Presentation: the refund policy step by step. Customers can return items within 14 days of purchase."], ["15 min", "Presentation: examples of approved and declined requests, with the reason for each."], ["15 min", "Group discussion: difficult customers and how to keep the conversation calm."], ["10 min", "Quiz: ten questions on the policy."]];
  var DRAFT_B = [["5 min", "Three tickets on screen. Agents vote on each before any teaching."], ["10 min", "The four rules, one ticket per rule: 30 days from delivery, unused in original packaging, a photo for damaged items, above €150 to the team lead."], ["15 min", "Pairs decide six tickets and note the rule they used."], ["10 min", "Each agent writes the reply for one ticket, and the group compares two replies."], ["5 min", "Three new tickets decided alone, answers checked together."]];

  /* ================= cover ================= */
  var ART = {
    u1: '<svg viewBox="0 0 250 130" aria-hidden="true"><rect x="20" y="10" width="210" height="110" rx="6" fill="#fff" stroke="#0d150d" stroke-width="3"/><rect x="20" y="10" width="210" height="24" rx="6" fill="#0d150d"/><g stroke="#c4cdbe" stroke-width="2"><path d="M30 56h190M30 78h190M30 100h190"/></g><g fill="#0d150d"><rect x="32" y="42" width="30" height="8" rx="2"/><rect x="32" y="64" width="30" height="8" rx="2"/><rect x="32" y="86" width="30" height="8" rx="2"/><rect x="32" y="107" width="30" height="7" rx="2"/></g><g fill="#12798f"><rect x="74" y="42" width="120" height="8" rx="2"/><rect x="74" y="64" width="96" height="8" rx="2"/><rect x="74" y="107" width="70" height="7" rx="2"/></g><rect x="70" y="82" width="150" height="16" rx="3" fill="#fbe9e2" stroke="#c1401d" stroke-width="2"/><rect x="76" y="86" width="104" height="8" rx="2" fill="#c1401d"/></svg>',
    u2: '<svg viewBox="0 0 250 130" aria-hidden="true"><rect x="52" y="24" width="170" height="96" rx="6" fill="#0a4652" stroke="#0d150d" stroke-width="3" opacity=".35"/><rect x="38" y="16" width="170" height="96" rx="6" fill="#0a4652" stroke="#0d150d" stroke-width="3" opacity=".65"/><rect x="24" y="8" width="170" height="96" rx="6" fill="#0a4652" stroke="#0d150d" stroke-width="3"/><rect x="38" y="22" width="92" height="12" rx="3" fill="#ffd84d"/><g fill="#fff"><rect x="38" y="46" width="130" height="7" rx="2"/><rect x="38" y="60" width="110" height="7" rx="2"/><rect x="38" y="74" width="122" height="7" rx="2"/><rect x="38" y="88" width="84" height="7" rx="2"/></g></svg>',
    u3: '<svg viewBox="0 0 250 130" aria-hidden="true"><rect x="14" y="10" width="222" height="68" rx="6" fill="#fff" stroke="#0d150d" stroke-width="3"/><rect x="26" y="22" width="110" height="9" rx="2" fill="#0d150d"/><rect x="26" y="38" width="150" height="7" rx="2" fill="#c4cdbe"/><rect x="26" y="56" width="52" height="14" rx="7" fill="#17915e"/><rect x="86" y="56" width="52" height="14" rx="7" fill="#ffd84d" stroke="#0d150d" stroke-width="2"/><rect x="146" y="56" width="52" height="14" rx="7" fill="#fff" stroke="#0d150d" stroke-width="2"/><rect x="14" y="84" width="222" height="38" rx="6" fill="#0d150d"/><g fill="#8fd770"><rect x="26" y="93" width="120" height="5" rx="2"/><rect x="26" y="103" width="160" height="5" rx="2"/></g><rect x="26" y="113" width="96" height="5" rx="2" fill="#ffd84d"/></svg>'
  };
  AID.cover = function (host) {
    var first = { u1: "u1-two-drafts", u2: "u2-passes", u3: "u3-spec" };
    var text = {
      u1: "You compare two drafts of the same lesson and watch a two-minute film on why they differ. Then you learn the five parts of a brief and the four checks, take Dana's request from brief to review, and write a brief of your own for a second job.",
      u2: "The approved plan becomes slides in three passes. You check an outline against the plan, slide by slide, and then edit one slide as data until it fits the template.",
      u3: "You read a spec for a practice exercise and play the exercise it produced with the LMS log open. Then you test the model's first build and send back what failed."
    };
    add('<div class="cover"><div><h1 id="step-h" tabindex="-1">Working with an AI model on lesson plans, slide decks and SCORM exercises</h1>' +
      '<p class="lead">This is a short course for instructional designers who already ask a chatbot for drafts and are not happy with what comes back. It follows one job from the first request to a tested SCORM package, and at each stage you write the brief, check the draft and decide what goes to review.</p>' +
      '<p class="read">The job comes from Harbour Home, an online shop for home goods, where the support team lead has asked for a 45-minute session on refund requests for her new agents. The company and the people in it are invented for this course.</p></div>' +
      '<div class="cover__card"><h2>By the end you can</h2><ul><li>write a brief that gives a model the five things it cannot guess about your lesson</li><li>check a draft plan, a slide outline and a built exercise against written criteria before a colleague sees them</li><li>tell the model what to fix, row by row, and say which parts of the job stay with you</li></ul>' +
      '<p style="margin:0;font-size:15.5px">The three units take about 40 minutes together. They hold two short films with voice-over, two simulations, five diagrams and a one-page job aid, and your progress is saved in this browser.</p></div></div>', host);
    var grid = add('<div class="units"></div>', host);
    AID.units.forEach(function (u, i) {
      var band = ["#12798f", "#07683f", "#c1401d"][i], bg = ["#e2f2f5", "#ecf9e7", "#fbe9e2"][i];
      grid.appendChild(h('<a class="unit" href="#' + first[u.id] + '"><div class="unit__band" style="background:' + band + '"></div><div class="unit__art" style="background:' + bg + '">' + ART[u.id] + '</div><div class="unit__body"><h3>Unit ' + (i + 1) + ": " + u.title + "</h3><p>" + text[u.id] + "</p></div></a>"));
    });
  };

  /* ================= Unit 1 ================= */
  var S = AID.steps;

  S.push({ id: "u1-two-drafts", unit: "u1", nav: "Two drafts of one lesson", title: "Two drafts of the same lesson", wide: true, auto: false,
    render: function (host, ctx) {
      var data = AID.state.data;
      add('<p class="lead">Dana Okafor leads the support team at Harbour Home. She needs a 45-minute session that teaches new agents to handle refund requests, and she has sent her notes on the policy. Two designers asked the same AI model for a plan, and you will compare what came back.</p>', host);
      add(notes(), host);
      var ask = add('<div class="sed__form own"><label for="u1-req">Before you read the two drafts, type the request you would send the model for this session.</label><textarea id="u1-req" rows="4" spellcheck="false"></textarea><div class="row" style="margin-bottom:0"><button type="button" class="btn btn--ink" disabled>Show the two drafts</button><button type="button" class="btn btn--line">Skip this and show the drafts</button></div></div>', host);
      var rest = add("<div hidden></div>", host);
      var reqBox = AID.$("textarea", ask), reqBtns = AID.$$("button", ask);
      function words(t) { return t.trim() ? t.trim().split(/\s+/).length : 0; }
      function openDrafts(text, fresh) {
        if (fresh) { data.u1req = text; AID.save(); }
        ask.innerHTML = text ? '<p style="margin:0"><strong>Your request.</strong> ' + AID.esc(text) + '</p><p class="aside" style="margin:8px 0 0">It comes back after the simulation, next to the brief you write there.</p>' : "";
        ask.hidden = !text;
        rest.hidden = false;
      }
      reqBox.addEventListener("input", function () { reqBtns[0].disabled = words(reqBox.value) < 4; });
      reqBtns[0].addEventListener("click", function () { openDrafts(reqBox.value.trim(), true); });
      reqBtns[1].addEventListener("click", function () { openDrafts("", true); });
      add('<p class="read">Read both drafts and decide which one you would pass to a colleague for review.</p>', rest);
      add('<div class="pair">' + plan("Refund policy training", "Agents will understand the refund policy.", DRAFT_A, null, "Draft A") + plan("Deciding a refund request", "Given a ticket, the agent approves, escalates or declines the refund and tells the customer the next step.", DRAFT_B, "45 minutes", "Draft B") + "</div>", rest);
      var q1 = add("<div></div>", rest), q2 = add("<div hidden></div>", rest);
      if (data.u1req != null) openDrafts(data.u1req, false);
      AID.questions(q1, [{ id: "u1-pick", graded: false, fixed: true, stem: "Which draft would you pass on for review?", options: [
        { t: "Draft A", ok: false, fb: "A reviewer would send Draft A straight back, and the next question asks what they would write in the margin." },
        { t: "Draft B", ok: true, fb: "Draft B is the one worth a colleague's time. Before moving on, look at what is wrong with Draft A." }
      ] }], function () { q2.hidden = false; });
      add('<h3>What would a reviewer send back in Draft A?</h3><p class="aside">Select every problem you can see, then check.</p>', q2);
      var items = [
        ["The goal names something nobody can observe.", true, "You cannot watch an agent understand, which leaves nothing to practise or to test."],
        ["The agents never practise deciding a request.", true, "They listen for thirty minutes, talk about difficult customers and then recall wording in a quiz."],
        ["The plan runs to 60 minutes and the slot is 45.", true, "The five rows add up to an hour."],
        ["The 14 days are not in Dana's notes.", true, "Her notes say 30 days from delivery."],
        ["The quiz has too few questions.", false, "The quiz tests recall of wording, and adding questions would not change that."]
      ];
      var saved = AID.state.data.u1ticks;
      var box = add('<div class="ticks"></div>', q2);
      items.forEach(function (it, i) { box.appendChild(h('<label class="tick"><input type="checkbox" value="' + i + '"><span>' + it[0] + "</span></label>")); });
      var bar = add('<div class="row"><button type="button" class="btn btn--ink">Check</button></div>', q2);
      function reveal(vals, fresh) {
        AID.$$(".tick", box).forEach(function (l, i) {
          var on = vals.indexOf(i) >= 0, it = items[i];
          AID.$("input", l).checked = on; AID.$("input", l).disabled = true;
          l.classList.add(on === it[1] ? "is-right" : "is-wrong");
          var word = it[1] ? (on ? "Found." : "Missed.") : (on ? "Not a problem." : "Rightly left out.");
          AID.$("span", l).insertAdjacentHTML("beforeend", "<small><strong>" + word + "</strong> " + it[2] + "</small>");
        });
        bar.remove();
        add('<div class="note"><p>Draft A has the first four problems, and each one traces back to the request, which was one line long. The model filled every gap in it with the most common answer it knew.</p><p>Draft B is what the second designer sent to review. It started from a longer request and went back to the model once, and the film on the next step shows that request.</p></div>', q2);
        if (fresh) { AID.state.data.u1ticks = vals; AID.save(); }
        ctx.done();
      }
      AID.$("button", bar).addEventListener("click", function () {
        reveal(AID.$$("input:checked", box).map(function (x) { return +x.value; }), true);
      });
      if (saved) { q2.hidden = false; reveal(saved, false); }
    } });

  S.push({ id: "u1-film", unit: "u1", nav: "Film: one request, two drafts (2 min)", title: "Film: one request, two drafts", wide: true, auto: false,
    render: function (host, ctx) {
      add('<p class="lead">The film shows what the model received from each designer and what it did with the parts that were missing.</p>', host);
      var stop = AID.film(host, AID.films.one, ctx.done);
      var script = add('<details class="script"><summary>Read the script</summary><ol>' + AID.films.one.scenes.map(function (s) { return "<li>" + s.text + "</li>"; }).join("") + "</ol></details>", host);
      script.addEventListener("toggle", function () { if (script.open) ctx.done(); });
      return stop;
    } });

  S.push({ id: "u1-gaps", unit: "u1", nav: "What a short request leaves open", title: "What the model does with a short request",
    render: function (host) {
      add('<div class="read"><p class="lead">A language model writes the most likely continuation of whatever it is given. When the request is "create a lesson plan about our refund policy", the most likely continuation is a plan that would suit any company, any learner and any length of session, because nothing in the request says otherwise.</p>' +
        "<p>It helps to list what the model cannot know. It has never met your learners and has no idea what they did yesterday. Nothing in the request tells it whether the session should end with agents who can recite the policy or agents who can decide a ticket, and the room, the clock and the software are equally unknown to it. Some chat tools ask a question or two before they write and others start at once, so a brief should not depend on being asked.</p>" +
        "<p>Your policy document is not in its memory either, and the model borrows a typical one, which is how 14 days appeared in Draft A. It will also choose its own layout unless you ask for the one your reviewer expects.</p></div>", host);
      var GAPS = [
        ["Learner", "everyone", "The request never said who the agents are, and the plan opens by explaining what a refund is to people who were hired to handle them."],
        ["Objective", "understand", "With no word on what agents do at the end, the goal became the verb most lesson plans use."],
        ["Limits", "an hour", "The slot, the room and the tools were missing, and the model planned a typical hour."],
        ["Source", "14 days", "The policy was not attached, and these figures come from the policies the model has read most often."],
        ["Format", "its own", "The layout was left to the model, which chose its own."]
      ];
      var fig = add('<figure class="fig"><div class="fig__art"><div class="gaps"><div class="gaps__box"><h4>The request</h4><span class="mono">Create a lesson plan about our refund policy.</span></div><div class="gaps__arrow"></div><div class="gaps__list"></div><div class="gaps__arrow"></div><div class="gaps__box"><h4>The draft</h4><span id="gap-out">Select a gap to see what it did to Draft A.</span></div></div></div>' +
        "<figcaption>A one-line request leaves five gaps open, and the model fills each one with the commonest answer it has seen.</figcaption></figure>", host);
      var list = AID.$(".gaps__list", fig), out = AID.$("#gap-out", fig);
      GAPS.forEach(function (g) {
        var b = h('<button type="button" class="gap" aria-pressed="false"><b>' + g[0] + "</b><span>filled with <em>" + g[1] + "</em></span></button>");
        b.addEventListener("click", function () {
          AID.$$(".gap", list).forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
          out.textContent = g[2];
        });
        list.appendChild(b);
      });
      add('<div class="read"><p>The draft arrives fluent and complete, which makes the borrowed parts hard to spot.</p><h2>The same sentence with the gap closed</h2></div>', host);
      add('<div class="compare"><div class="is-weak"><h4>No source in the request</h4><blockquote>Customers can return items within 14 days of purchase.</blockquote><p>The figure reads well and belongs to some other shop.</p></div><div class="is-strong"><h4>Dana\'s notes pasted in, with "use nothing else"</h4><blockquote>Customers can return items within 30 days of delivery (note 1).</blockquote><p>The figure can be traced to a line you can point at.</p></div></div>', host);
      var q = add("<div></div>", host);
      AID.questions(q, [{ id: "u1-gapq", graded: false, stem: "Another draft says agents can approve refunds of up to €500. Dana's notes say refunds above €150 go to the team lead. Which gap produced the €500?", options: [
        { t: "Limits", ok: false, fb: "Limits describe the session, which means its minutes, its room and its tools, while the €500 is a fact about the policy." },
        { t: "Source", ok: true, fb: "The model had no policy to read and supplied a figure that sounds like one. Pasting the notes into the brief and telling the model to use nothing else closes this gap." },
        { t: "Learner", ok: false, fb: "Knowing who the agents are changes where the lesson starts and leaves the policy as it is." }
      ] }]);
    } });

  S.push({ id: "u1-brief", unit: "u1", nav: "The five parts of a brief", title: "The five parts of a brief", wide: true,
    render: function (host) {
      add('<p class="lead">A brief closes the five gaps in the order a colleague would ask about them. Below is the brief behind Draft B. Select a part to see what it does and what happens to the draft when it is missing.</p>', host);
      var P = [
        ["learner", "Learner", "The learners are twelve support agents in their first week at Harbour Home. They have used the ticket system for two days and will handle their first refund next week.",
          "This part says whose lesson it is and what they can already do.", "The draft starts from zero and spends ten minutes on why customer service matters."],
        ["objective", "Objective", "By the end of the session each agent can take a refund ticket, decide whether to approve, escalate or decline it, and write the customer the decision and the next step.",
          "It names what the agents do at the end in words you could watch happen.", "The model falls back on \"understand\", and a lesson built on \"understand\" is mostly presentation."],
        ["limits", "Limits", "The session is 45 minutes in one room with a projector. There is no breakout software and no pre-work.",
          "The clock, the room and the tools go here.", "The model plans the session it finds most typical, which is often an hour with a tool you do not have."],
        ["source", "Source", "Use only the policy notes pasted below. If the notes do not cover something, write \"not in the notes\" and do not fill it in.",
          "Here you hand over the facts and forbid guessing.", "Every number in the draft is borrowed from somewhere else, and nothing marks which ones."],
        ["format", "Format", "Give me a table with one row per activity: minutes and what the agents do. Add the total time under the table.",
          "It asks for the layout your reviewer reads fastest, with the total where a wrong sum is easy to see.", "The plan arrives as paragraphs, and the check takes you longer."]
      ];
      var wrap = add('<div class="anatomy"><div class="doc"><div class="doc__bar"><i></i>Brief for the refund session<span>sent with Dana\'s notes</span></div><div class="brief"></div></div><div class="anatomy__panel" aria-live="polite"><h3>Select a part of the brief</h3><p>Each part answers a question the model would otherwise answer for you.</p></div></div>', host);
      var brief = AID.$(".brief", wrap), panel = AID.$(".anatomy__panel", wrap);
      P.forEach(function (p) {
        var b = h('<button type="button" class="part part--' + p[0] + '" aria-pressed="false"><b>' + p[1] + "</b>" + p[2] + "</button>");
        b.addEventListener("click", function () {
          AID.$$(".part", brief).forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
          panel.innerHTML = "<h3>" + p[1] + "</h3><p>" + p[3] + '</p><p class="without"><strong>Without it.</strong> ' + p[4] + "</p>";
        });
        brief.appendChild(b);
      });
      add('<div class="read"><h2>Two requests to add at the end</h2><p>The first is "Before you write, list what you still need to know from me." Some chat tools ask questions without being told to and others start writing at once, and this line makes either kind show you the gaps it would otherwise fill by itself.</p>' +
        '<p>The second is "Put the number of the note next to every figure and rule." The draft then carries its own references, as in "within 30 days of delivery (note 1)", and you can check a fact by reading one line of the notes.</p>' +
        "<p>Dana's notes are an internal document. Before you paste a document like that into a chatbot, check that your company allows that tool to receive it, and use the tool your company has approved if there is one.</p></div>", host);
      add('<h2>Your turn: a brief with one part missing</h2><p class="read">A colleague is preparing a 30-minute session for warehouse shift leads on the new damaged-goods form, and this is the brief so far.</p>' +
        '<div class="doc" style="max-width:66ch"><div class="doc__bar"><i></i>Brief for the damaged-goods session</div><div class="doc__body">The learners are eight shift leads who have filled in the old paper form for years. By the end each of them can log a damaged item on the new form and attach the photo. Use only the form guide pasted below. Give me a table with minutes, activity and the form field it practises.</div></div>', host);
      var q = add('<div style="max-width:66ch"></div>', host);
      AID.questions(q, [
        { id: "u1-missing", graded: false, stem: "Which part is missing?", options: [
          { t: "Learner", ok: false, fb: "The first sentence covers the learner, eight shift leads who know the old form well." },
          { t: "Limits", ok: true, fb: "Nothing gives the minutes, the place or the equipment, and the model will plan for a training room with a projector." },
          { t: "Source", ok: false, fb: "The brief tells the model to use only the form guide." }
        ] },
        { id: "u1-add", graded: false, stem: "Which sentence would you add?", options: [
          { t: "Make the session practical and keep everyone involved.", ok: false, fb: "This asks for a quality and gives the model nothing to plan around. A limit is something you could measure or see, such as minutes, a room or a device." },
          { t: "The session is 30 minutes on the warehouse floor, with one tablet per pair and no projector.", ok: true, fb: "With the minutes, the place and the tablets stated, the model can no longer plan slides for a room that has no projector." },
          { t: "The session should be as short as possible.", ok: false, fb: "\"As short as possible\" leaves the model to choose the length, and the brief should state the 30 minutes." }
        ] }
      ]);
    } });

  S.push({ id: "u1-check", unit: "u1", nav: "Checking the draft", title: "Checking the draft before a colleague sees it", auto: false,
    render: function (host, ctx) {
      add('<div class="read"><p class="lead">Even a full brief leaves defects in the draft, because the model still prefers the common activity to the right one. The check takes about five minutes if you ask the same four questions every time.</p></div>', host);
      add('<ol class="checks"><li><b>Objective</b>Could you watch a learner do it? "Decide a ticket" passes and "understand the policy" fails.</li><li><b>Practice</b>Does each activity make learners do what the objective names? A quiz on wording practises remembering, and this objective asks for deciding.</li><li><b>Facts</b>Can you point to the line in the source for every number and rule? Anything you cannot trace gets flagged, and the tracing is quick when the brief asked for the note number next to each figure.</li><li><b>Fit</b>Do the minutes add up to the slot, and does the plan use only the room and tools you have?</li></ol>', host);
      add('<h2>Three defects in the first draft</h2><p class="read">This is the first draft that brief returned, before the fixes that turned it into Draft B. Select each row you would send back, then check. Dana\'s notes are under the plan.</p>', host);
      var doc = add('<div class="doc"><div class="doc__bar"><i></i>Session plan, draft 1</div><div class="doc__body" style="padding:0"><p class="doc__goal"><strong>Goal.</strong> Given a refund ticket, the agent approves, escalates or declines it and tells the customer the next step.</p></div></div>', host);
      var fl = AID.flagList(AID.$(".doc__body", doc), [
        { id: "r1", html: "<b>1 · 5 min</b>Three tickets on screen. Agents vote approve, escalate or decline.", bad: false, fine: "Agents decide from the first minute, which is what the goal asks for." },
        { id: "r2", html: "<b>2 · 10 min</b>The trainer shows the four rules, one ticket per rule. Refund window: 30 days from delivery.", bad: false, fine: "The 30 days are the first line of Dana's notes." },
        { id: "r3", html: "<b>3 · 15 min</b>Pairs decide six tickets and note the rule they used. Agents may approve refunds up to €250.", bad: true, why: "Facts. Dana's notes send refunds above €150 to the team lead, and €250 appears nowhere in them." },
        { id: "r4", html: "<b>4 · 10 min</b>Each agent writes the reply for one ticket, and the group compares two replies.", bad: false, fine: "Writing the reply is the second half of the goal." },
        { id: "r5", html: "<b>5 · 10 min</b>Quiz: agents answer eight questions on the wording of the policy.", bad: true, why: "Practice. Recalling wording is a different skill from deciding a ticket, and ten minutes of the session go to it." },
        { id: "r6", html: "<b>Total</b>45 minutes", bad: true, why: "Fit. The rows add up to 50 minutes. The model repeated the total from the brief and did not add up its own rows." }
      ]);
      add(notes(), host);
      var bar = add('<div class="row"><button type="button" class="btn btn--ink">Check my flags</button></div>', host);
      var after = add("<div></div>", host);
      function reveal() {
        var res = fl.check();
        bar.remove();
        after.appendChild(h('<div class="note ' + (res.miss.length ? "note--calm" : "note--ok") + '"><p><strong>You found ' + res.hit.length + " of 3.</strong> " + (res.miss.length ? "The rows you missed are marked, each with the check that catches it." : "Each defect falls under a different check, which is the reason to ask all four questions every time.") + "</p></div>"));
        after.appendChild(h('<div class="read"><h2>The fix request</h2><p>Each row you flag goes back to the model in a fix request that names the row and the rule. Compare two requests for the same draft.</p></div>'));
        after.appendChild(h('<div class="compare"><div class="is-weak"><h4>A request the model has to interpret</h4><blockquote>Make it more practical.</blockquote><p>The model rewrites the whole plan, and you have to check all of it again.</p></div><div class="is-strong"><h4>A request that names the row</h4><blockquote>Row 5: replace the quiz with three tickets that agents decide alone, 5 minutes. Row 3: the limit is €150, as in the notes. Change nothing else.</blockquote><p>The model changes two rows, the total comes to 45, and only those rows need a second look.</p></div></div>'));
        after.appendChild(h('<figure class="fig fig--green"><div class="fig__art"><div class="loop"><div class="loop__s loop__s--you"><b>Brief</b>Five parts and the source</div><div class="loop__s"><b>Draft</b>The model writes it</div><div class="loop__s loop__s--you"><b>Check</b>Four questions</div><div class="loop__s loop__s--you"><b>Fix request</b>Row, rule, what stays<small>Then back to the model, until your check finds nothing.</small></div><div class="loop__s loop__s--peer"><b>Second designer</b>Returns it or passes it<small>A returned plan comes back to you with comments.</small></div><div class="loop__s"><b>Testing</b>With real learners</div><div class="loop__back">back to the model until your check finds nothing</div><div class="loop__back2">back to you with comments</div></div><p class="legend"><span><i style="background:#fff3c2"></i>your steps</span><span><i style="background:#fff"></i>the model, then the learners</span><span><i style="background:#d4f1c4"></i>a colleague</span></p></div><figcaption>What passes your check goes to a second designer, who either returns it with comments or sends it on to testing.</figcaption></figure>'));
        after.appendChild(h('<div class="read"><p>That second read stays in the process however good the model gets, because the person who wrote the brief shares its blind spots.</p></div>'));
        AID.state.data.u1check = fl.flagged(); AID.save();
        ctx.done();
      }
      AID.$("button", bar).addEventListener("click", reveal);
      if (AID.state.data.u1check) {
        AID.state.data.u1check.forEach(function (id) { fl.el.querySelector('.flag[data-id="' + id + '"] .flag__btn').click(); });
        reveal();
      }
    } });

  S.push({ id: "u1-sim", unit: "u1", nav: "Simulation: Dana's request", title: "Simulation: Dana's request", wide: true, auto: false,
    render: function (host, ctx) {
      add('<p class="lead">Dana\'s message is waiting. Write the brief, check what comes back, send a fix request and pass the plan to Tomás, the second designer on your team. The model in this simulation is scripted, and the same brief always returns the same draft. A real model answers the same brief a little differently each time, which is why every draft gets the check, the one after a fix request included.</p>', host);
      AID.workbench(host, ctx.done);
    } });

  S.push({ id: "u1-own", unit: "u1", nav: "Your own brief for a new request", title: "Write a brief for a new request", wide: true, auto: false,
    render: function (host, ctx) {
      var data = AID.state.data, own = data.own || (data.own = { text: "" });
      var SHEET = [
        "Scan the return label, and stop if the scanner shows no open return.",
        "Open the parcel and compare the item with the photo on the scanner.",
        "Mark the item as resell, repair or dispose. An item with a broken seal is never marked resell.",
        "Put the item in the bin of that colour and scan the bin."
      ];
      var MODEL = [
        ["learner", "Learner", "The learners are six dock workers at the Harbour Home warehouse. They use the handheld scanner every day and have never checked a returned parcel.",
          "The plan explains what a scanner is to people who use one all day."],
        ["objective", "Objective", "By the end each of them can take a returned parcel through the four steps of the dock check and mark it as resell, repair or dispose.",
          "The session turns into a talk about the new check, and nobody handles a parcel."],
        ["limits", "Limits", "The session is 20 minutes at the dock at the start of the shift, with one scanner per person and no screen.",
          "The model plans slides for a training room, and this session happens at the dock with no screen."],
        ["source", "Source", "Use only the sheet pasted below, and write \"not on the sheet\" where it is silent. Before you write the plan, list anything you still need to know from me.",
          "The steps come from what warehouses usually do, and Karim's four steps may not be among them."],
        ["format", "Format", "Give me a table with minutes, what the workers do and the step of the sheet it practises, with the step number next to every rule.",
          "The plan arrives as paragraphs, and matching it to the sheet takes you longer."]
      ];
      add('<p class="lead">In the simulation you chose each part of the brief from ready sentences. This request comes from another part of Harbour Home, and you write the whole brief yourself before you compare it with one that has all five parts.</p>', host);
      add('<div class="doc" style="max-width:70ch"><div class="doc__bar"><i></i>Message from Karim Haddou, warehouse manager</div><div class="doc__body"><p>From next month every returned parcel is checked at the dock before it goes back on a shelf. Six of my dock workers need to learn the check. I can give you 20 minutes at the start of the Monday shift, at the dock itself, where each of them has a handheld scanner and there is no screen. The four steps are on the sheet below.</p><ol style="margin:0">' +
        SHEET.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ol></div></div>", host);
      var form = add('<div class="sed__form own"><label for="own-brief">Your brief to the model</label><textarea id="own-brief" rows="9" spellcheck="false"></textarea><div class="row" style="margin-bottom:0"><button type="button" class="btn btn--ink" disabled>Compare with a model brief</button><span class="aside"></span></div></div>', host);
      var after = add("<div></div>", host);
      var box = AID.$("textarea", form), go = AID.$("button", form), count = AID.$(".aside", form);
      function words(t) { return t.trim() ? t.trim().split(/\s+/).length : 0; }
      function tally() {
        var n = words(box.value);
        count.textContent = n + (n === 1 ? " word" : " words") + (n < 30 ? ", and the comparison opens at 30" : "");
        go.disabled = n < 30;
      }
      box.value = own.text || "";
      box.addEventListener("input", function () { own.text = box.value; tally(); });
      tally();

      function compare(fresh) {
        if (fresh) { own.compared = 1; AID.save(); }
        box.readOnly = true;
        go.hidden = true;
        count.textContent = words(box.value) + " words";
        after.innerHTML = "";
        add('<div class="read"><h2>A brief with all five parts</h2><p>Read the model brief against your own text and tick each part you can point to in what you wrote.</p></div>', after);
        add('<div class="doc" style="max-width:70ch"><div class="doc__bar"><i></i>A model brief for Karim\'s request<span>sent with his sheet</span></div><div class="brief">' +
          MODEL.map(function (p) { return '<div class="part part--' + p[0] + ' part--still"><b>' + p[1] + "</b>" + p[2] + "</div>"; }).join("") + "</div></div>", after);
        var ticks = add('<div class="ticks" style="max-width:70ch"></div>', after);
        MODEL.forEach(function (p, i) { ticks.appendChild(h('<label class="tick"><input type="checkbox" value="' + i + '"><span>My brief has the ' + p[1].toLowerCase() + " part.</span></label>")); });
        var bar = add('<div class="row"><button type="button" class="btn btn--ink">Check my brief</button></div>', after);
        var end = add("<div></div>", after);
        function reveal(vals, fresh2) {
          AID.$$(".tick", ticks).forEach(function (l, i) {
            var on = vals.indexOf(i) >= 0;
            AID.$("input", l).checked = on; AID.$("input", l).disabled = true;
            if (!on) AID.$("span", l).insertAdjacentHTML("beforeend", "<small><strong>Without it.</strong> " + MODEL[i][3] + "</small>");
          });
          bar.hidden = true;
          if (fresh2) { own.ticks = vals; AID.save(); }
          var n = vals.length;
          add('<div class="note ' + (n === 5 ? "note--ok" : "note--calm") + '"><p><strong>' + (n === 5 ? "You can point to all five parts in your brief." : "You ticked " + n + " of 5 parts, and the line under each of the others says what a model does with that gap.") + "</strong> The model brief also asks the model to list what it still needs before it writes and to put the step number next to every rule, which are the two requests you met with the five parts.</p></div>", end);
          if (data.u1req) add('<details class="notes" style="max-width:70ch"><summary>The request you typed before the first step</summary><p style="margin:10px 16px 14px">' + AID.esc(data.u1req) + "</p></details>", end);
          var tools = add('<div class="row"><button type="button" class="btn btn--line">Copy my brief with the sheet</button><button type="button" class="btn btn--line">Clear my brief and write it again</button></div>', end);
          add('<p class="aside" style="max-width:70ch">Karim\'s request and his sheet are invented for this course, so the brief can go into any chatbot you use. Before you paste a real internal document into a chatbot, check that your company allows that tool to receive it.</p>', end);
          var b = AID.$$("button", tools);
          b[0].addEventListener("click", function () {
            var text = box.value.trim() + "\n\nThe sheet:\n" + SHEET.map(function (x, i) { return (i + 1) + ". " + x; }).join("\n");
            var done = function () { b[0].textContent = "Copied"; };
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { b[0].textContent = "Copying is blocked in this browser"; });
            else b[0].textContent = "Copying is blocked in this browser";
          });
          b[1].addEventListener("click", function () {
            data.own = own = { text: "" }; AID.save();
            box.value = ""; box.readOnly = false; go.hidden = false; after.innerHTML = ""; tally(); box.focus();
          });
        }
        AID.$("button", bar).addEventListener("click", function () {
          reveal(AID.$$("input:checked", ticks).map(function (x) { return +x.value; }), true);
        });
        if (own.ticks) reveal(own.ticks, false);
        ctx.done();
      }
      go.addEventListener("click", function () { compare(true); });
      if (own.compared) compare(false);
      return function () { AID.save(); };
    } });

  S.push({ id: "u1-quiz", unit: "u1", nav: "Three scored questions", title: "Three scored questions on briefs and checks", auto: false,
    render: function (host, ctx) {
      add('<p class="lead">Each question is scored on your first answer and counts towards the result at the end of the course.</p>', host);
      AID.questions(host, [
        { id: "u1q1", stem: "A brief describes the learners only as \"new team members\". They are experienced agents who have moved over from the phone team. What is the draft most likely to get wrong?", options: [
          { t: "It opens with basics of customer service that these agents already know", ok: true, fb: "A model writes for the widest audience the words allow, and \"new team members\" covers a first-day intern as well as an agent with five years on the phones." },
          { t: "It plans an hour of activities for a slot that is only thirty minutes long", ok: false, fb: "A session that overruns comes from the limits part of the brief. The learner line decides where the session starts, and with this one it starts too early for these agents." },
          { t: "It quotes refund figures that come from the policies of other shops", ok: false, fb: "Borrowed figures come from a missing source. A vague learner line leaves the facts alone and changes the level the session is pitched at." }
        ] },
        { id: "u1q2", stem: "A draft says damaged items must be reported within 7 days. Dana's notes give no deadline for damaged items. What do you do?", options: [
          { t: "Keep it, because seven days is a common deadline for damage claims", ok: false, fb: "A figure that sounds reasonable is how borrowed facts get through, and this one has no source because the notes give no deadline for damaged items." },
          { t: "Flag it and ask Dana, because the notes give no deadline for damage", ok: true, fb: "The notes are silent on this, which leaves the 7 days without a source. A fact you cannot trace goes to the person who owns the policy." },
          { t: "Change it to 30 days, because rule 1 gives that window for returns", ok: false, fb: "Rule 1 is about returns in general, and applying it to damaged items would put your guess in place of the model's." }
        ] },
        { id: "u1q3", stem: "A draft for a session on password resets has a 15-minute lecture in row 2, and the brief asked for practice on real tickets. Which fix request leaves you the least to check again?", options: [
          { t: "\"Rows 2 to 4 feel too passive, so please make them more practical and keep the rest of the plan as it is.\"", ok: false, fb: "It names rows and leaves the change to the model, which may rewrite all three, and then three rows come back for a full check." },
          { t: "\"Row 2: replace the lecture with four reset tickets that pairs solve, 15 minutes. Change nothing else.\"", ok: true, fb: "It names the row, the change and what stays, and only row 2 needs a second look." },
          { t: "\"Rewrite the plan around practice on real tickets, and keep the same time, format and number of rows.\"", ok: false, fb: "This asks for a new plan inside the old limits, and every row of a new plan goes through the four checks again." }
        ] }
      ], ctx.done);
    } });

  /* ================= Unit 2 ================= */
  S.push({ id: "u2-passes", unit: "u2", nav: "Film: a deck in three passes (1 min)", title: "A deck is built in three passes", wide: true, auto: false,
    render: function (host, ctx) {
      add('<div class="read"><p class="lead">The plan Tomás passed is now the source for the slides. Asking a model for "slides for this lesson" in one go produces a deck that looks done and drifts from the plan in ways that are slow to find, because content, wording and layout were all decided at once.</p></div>', host);
      var stop = AID.film(host, AID.films.two, ctx.done);
      var script = add('<details class="script"><summary>Read the script</summary><ol>' + AID.films.two.scenes.map(function (s) { return "<li>" + s.text + "</li>"; }).join("") + "</ol></details>", host);
      script.addEventListener("toggle", function () { if (script.open) ctx.done(); });
      add('<div class="read"><h2>What each pass returns</h2><p>Splitting the job puts a check after each pass, while a mistake is still cheap to fix. Select a pass to see what the model returns from it for the refund session.</p></div>', host);
      var fig = add('<figure class="fig fig--sun"><div class="fig__art"></div><figcaption>A slide cut at the outline costs one line, while the same slide cut after the third pass has already been written, laid out and read.</figcaption></figure>', host);
      AID.passes(AID.$(".fig__art", fig));
      add('<div class="read"><p>In the third pass the model makes no design decisions, since the template already holds them, and decks for different lessons come out looking like one course.</p></div>', host);
      return stop;
    } });

  S.push({ id: "u2-outline", unit: "u2", nav: "The outline against the plan", title: "Check the outline against the plan", wide: true, auto: false,
    render: function (host, ctx) {
      add('<div class="read"><p class="lead">This time the model has returned a rougher six-slide outline for the refund session. Give each slide a verdict: keep it, cut it because no row of the plan asks for it, split it because it holds too much, or fix a fact that differs from the plan.</p></div>', host);
      AID.deckCheck(host, ctx.done);
    } });

  S.push({ id: "u2-fields", unit: "u2", nav: "A slide written as fields", title: "A slide written as fields", wide: true, auto: false,
    render: function (host, ctx) {
      add('<div class="read"><p class="lead">A slide in this template holds a title of up to 60 characters and four points of up to twelve words each. Those limits are part of the brief for the second pass, and the model still breaks them, most often on the slide that covers the densest row of the plan.</p><p>This slide came back from the second pass with a long title and seven points. Edit the fields until all four checks turn green, and move whatever does not fit to the trainer\'s note or to another slide. The four rules have to stay on this slide, because row 2 of the plan is built on them.</p></div>', host);
      return AID.slideEditor(host, ctx.done);
    } });

  S.push({ id: "u2-quiz", unit: "u2", nav: "Two scored questions", title: "Two scored questions on building a deck", auto: false,
    render: function (host, ctx) {
      add('<p class="lead">Both questions are scored on your first answer.</p>', host);
      AID.questions(host, [
        { id: "u2q1", stem: "In the third pass, what decides the fonts, colours and layout of a slide?", options: [
          { t: "The model, which picks a layout to suit the content of each slide", ok: false, fb: "A model that designs each slide gives you twenty slightly different layouts to check, and in this process it supplies only the fields." },
          { t: "The template, which holds those decisions before any slide is filled", ok: true, fb: "With layout fixed in the template every deck comes out consistent, and the check in the third pass shrinks to overflow and typos." },
          { t: "The reviewer, who adjusts the layout once the whole deck is built", ok: false, fb: "A reviewer who has to fix layout has little attention left for content, which is why the template settles layout before anyone reviews." }
        ] },
        { id: "u2q2", stem: "The outline has a slide that matches no row of the plan, and it is a good slide. What do you do?", options: [
          { t: "Keep it in the deck, because a good slide makes the session better", ok: false, fb: "The plan was reviewed and this slide was not, and keeping it puts unreviewed content in front of learners." },
          { t: "Move it to the end as an optional extra that the trainer can skip", ok: false, fb: "An extra slide still takes minutes the plan has already spent, and nobody has reviewed it." },
          { t: "Cut it, or add it to the plan first and have that change reviewed", ok: true, fb: "If the content matters it enters through the plan, where Tomás and Dana will see it." }
        ] }
      ], ctx.done);
    } });

  /* ================= Unit 3 ================= */
  S.push({ id: "u3-spec", unit: "u3", nav: "A spec for an exercise", title: "A spec for an interactive exercise",
    render: function (host) {
      add('<div class="read"><p class="lead">The last row of the plan has agents decide tickets alone. Harbour Home wants that practice available after the session too, as a SCORM package in the LMS, so that an agent can repeat it and the team lead can see who passed.</p>' +
        "<p>A model can write the code for an exercise like this in a few minutes. What it needs from you is a spec, and this one has six parts. The last two have no counterpart in a brief, because they say what the LMS must be told and how you will test the result.</p></div>", host);
      add('<ol class="spec"><li><b>The decision</b>What the learner decides on each screen and what is in front of them. In the refund practice that is a ticket, the policy card and three buttons.</li><li><b>The cases</b>Each ticket with its correct answer and the rule behind it, copied from the source. The model does not invent tickets.</li><li><b>The feedback</b>After each choice the learner sees the rule that applies and what happens next. A bare "Correct" or "Incorrect" does not count.</li><li><b>The states</b>The start, each ticket, the result screen, and what a second attempt does.</li><li class="is-new"><b>The report, new in a spec</b>What goes to the LMS and when. For this exercise that is a score out of four, sent on the result screen, with "passed" at three or more.</li><li class="is-new"><b>The tests, new in a spec</b>The checks you will run yourself before anyone else opens the package.</li></ol>', host);
      add('<div class="read"><h2>What the exercise tells the LMS</h2><p>In SCORM 1.2 the exercise talks to the LMS in a few short calls, in which it says it has started, sends a score and a status, asks the LMS to save them and says it has finished. When a package "does not report", one of these six lines is usually missing or wrong, and you can read them in the debug log of your LMS without reading any code.</p></div>', host);
      var CALLS = [
        ['LMSInitialize("")', "The exercise opens the session when the first ticket loads."],
        ['LMSSetValue("cmi.core.score.raw", 3)', "On the result screen it sends the number of tickets decided as the policy says."],
        ['LMSSetValue("cmi.core.score.max", 4)', "It also sends the highest score an agent can get."],
        ['LMSSetValue("cmi.core.lesson_status", "passed")', "The status is \"passed\" at three or more and \"failed\" below."],
        ['LMSCommit("")', "It asks the LMS to save what was sent."],
        ['LMSFinish("")', "It closes the session, and the team lead sees the result."]
      ];
      var fig = add('<figure class="fig"><div class="fig__art"><div class="seq"><div class="seq__actor">Exercise</div><div class="seq__calls"></div><div class="seq__actor seq__actor--lms">LMS</div></div><div class="row" style="margin-bottom:0"><button type="button" class="btn btn--ink btn--sm" id="seq-next">Send the first call</button><button type="button" class="btn btn--line btn--sm" id="seq-reset" hidden>Start over</button></div></div><figcaption>The six calls this exercise makes in one attempt, in order.</figcaption></figure>', host);
      var calls = AID.$(".seq__calls", fig), nextB = AID.$("#seq-next", fig), resetB = AID.$("#seq-reset", fig), n = 0;
      CALLS.forEach(function (c) { calls.appendChild(h('<div class="call"><code>' + AID.esc(c[0]) + "</code><span>" + c[1] + "</span></div>")); });
      nextB.addEventListener("click", function () {
        if (n < CALLS.length) { calls.children[n].classList.add("is-on"); n++; }
        nextB.textContent = n < CALLS.length ? "Send the next call" : "All six sent";
        nextB.disabled = n >= CALLS.length; resetB.hidden = n === 0;
      });
      resetB.addEventListener("click", function () {
        n = 0; AID.$$(".call", calls).forEach(function (c) { c.classList.remove("is-on"); });
        nextB.disabled = false; nextB.textContent = "Send the first call"; resetB.hidden = true;
      });
    } });

  S.push({ id: "u3-example", unit: "u3", nav: "The spec and its exercise", title: "Worked example: the spec and the exercise it produced", wide: true,
    render: function (host) {
      add('<p class="lead">The exercise comes first and the spec it was built from follows it. The exercise runs against a test LMS whose log is printed under it. Play the four tickets and watch the log, where every line was asked for in part 5 of the spec.</p>', host);
      var grid = add('<div class="tp"><div class="tp__build"></div><div class="doc"><div class="doc__bar"><i></i>Spec: refund practice</div><div class="doc__body" style="font-size:14.5px"></div></div></div>', host);
      AID.$(".doc__body", grid).innerHTML =
        "<p><strong>1. Decision.</strong> One ticket per screen with the policy card beside it. Three buttons: Approve, Escalate to team lead, Decline.</p>" +
        "<p><strong>2. Cases.</strong> Four tickets from Dana's notes: €40 lamp at 12 days (approve), rug at 41 days (decline), €180 sofa covers (escalate), cracked mirror with a photo (approve).</p>" +
        "<p><strong>3. Feedback.</strong> After each choice show the correct decision and the rule it rests on. Never show only \"Correct\" or \"Incorrect\".</p>" +
        "<p><strong>4. States.</strong> Tickets in a fixed order, then a result screen with the count. The session closes on that screen, so a second attempt is a new launch from the LMS.</p>" +
        "<p><strong>5. Report.</strong> SCORM 1.2. Initialize on load. On the result screen send score.raw and score.max, set lesson_status to passed at 3 or more and failed below, then commit and finish.</p>" +
        "<p style=\"margin:0\"><strong>6. Tests.</strong> Answers match the notes. Feedback names the rule. Score and status reach the LMS. The session opens and closes. Every button works from the keyboard. A second launch opens a new session.</p>";
      AID.refundDesk(AID.$(".tp__build", grid), "final");
      add('<div class="read"><p>Very little of the spec is about code. Five of its six parts describe what a learner or a team lead will see, and those are the parts a designer is best placed to write.</p></div>', host);
    } });

  S.push({ id: "u3-test", unit: "u3", nav: "Simulation: test the first build", title: "Simulation: test the model's first build", wide: true, auto: false,
    render: function (host, ctx) {
      add('<p class="lead">This is what the model returned the first time, before the version you have just played, and it looks the same. Play it as an agent would and give at least one wrong answer, answer one ticket from the keyboard with Tab and Enter and launch it a second time, then read the log and mark each of the six tests as passed or failed.</p>', host);
      AID.testRun(host, ctx.done);
    } });

  S.push({ id: "u3-yours", unit: "u3", nav: "What stays with you", title: "What stays with you", wide: true,
    render: function (host) {
      add('<div class="read"><p class="lead">Across the three units the model wrote most of the words and all of the code, which is the part of the job it does well. It produced a first draft in the format you asked for, changed the rows you named and rebuilt the exercise from a short fix request.</p>' +
        "<p>The decisions stayed with you, since you chose what the agents must be able to do, traced every figure to Dana's notes, ran the tests and decided when the work was ready for Tomás. They stay with the designer for a practical reason, which is that nobody can ask the model afterwards why the limit said €250.</p>" +
        "<p>A brief that worked is worth keeping. Save it as a template or as the standing instruction of a project in your chat tool, and for the next lesson change the learner, the objective, the limits and the source.</p></div>", host);
      var cols = ["Brief", "Draft", "Check", "Fix", "Review"];
      var lanes = [
        ["Model", "on-model", ["", "Writes the plan, the slide fields, the code", "", "Changes what the request names", ""]],
        ["You", "on-you", ["Set the objective and supply the source", "", "Ask the four questions, run the tests", "Name the row, the rule and what stays", "Decide it is ready to send"]],
        ["Second designer", "on-peer", ["", "", "", "", "Returns it with comments or passes it to testing"]]
      ];
      var html = '<div class="lanes"><div class="hd"></div>' + cols.map(function (c) { return '<div class="hd">' + c + "</div>"; }).join("");
      lanes.forEach(function (l) { html += '<div class="who">' + l[0] + "</div>" + l[2].map(function (c, i) { return "<div" + (c ? ' class="' + l[1] + '" data-h="' + cols[i] + '"' : "") + ">" + c + "</div>"; }).join(""); });
      add('<figure class="fig fig--green"><div class="fig__art">' + html + "</div></div><figcaption>The same five stages ran for the plan, the deck and the exercise, and the model holds one of them and part of another.</figcaption></figure>", host);
      add('<div class="read"><p>The <a href="job-aid.html">one-page job aid</a> puts the brief parts, the checks and the fix-request pattern for all three kinds of draft on a single sheet you can print.</p></div>', host);
    } });

  S.push({ id: "u3-final", unit: "u3", nav: "Five final questions", title: "Five final questions", auto: false,
    render: function (host, ctx) {
      add('<p class="lead">These five questions use the second job in the course. Karim Haddou needs a 20-minute session on the dock check for returned parcels, and once the plan is approved he also wants a one-page guide for the shift lead and a practice exercise in the LMS.</p>', host);
      var q = add("<div></div>", host), res = add("<div></div>", host);
      AID.questions(q, [
        { id: "f1", stem: "The plan for Karim's dock session is approved, and the shift lead needs a one-page guide for running it. What do you give the model as its source?", options: [
          { t: "Your brief for the plan, since it already describes the whole session", ok: false, fb: "The brief describes the session you asked for, while the approved plan is the session that was reviewed, and the two differ in every row a fix request changed." },
          { t: "The approved plan and Karim's sheet with the four steps of the check", ok: true, fb: "The approved plan is the reviewed version and the sheet holds the facts, and the model works only from what is in front of it." },
          { t: "The first draft of the plan, which has the most detail on each activity", ok: false, fb: "The first draft is the version before your fix requests, and a guide built on it would inherit every defect you sent back." }
        ] },
        { id: "f2", stem: "The guide comes back with a safety briefing on lifting that is in neither the plan nor the sheet. Which check catches it?", options: [
          { t: "Every part of the guide points to a row of the approved plan", ok: true, fb: "It is the check you ran on the slide outline, where each item points to a row and no row is left without an item." },
          { t: "The minutes in the guide add up to the twenty-minute slot", ok: false, fb: "The minutes can add up while the content still drifts, and an extra briefing is found by comparing each part of the guide with the rows of the plan." },
          { t: "Each instruction describes something you could watch a worker do", ok: false, fb: "This check belongs to the objective, which came from the plan and has not changed. The guide now contains something the plan does not." }
        ] },
        { id: "f3", stem: "A practice exercise built for the dock check shows \"passed\" in the LMS for a worker who got one parcel of four right. Where do you look first?", options: [
          { t: "The feedback texts, in case one of them calls a wrong answer right", ok: false, fb: "Feedback texts change what the worker learns from each parcel, while the status in the LMS comes from one line of the log." },
          { t: "The lines of the log that send the score and set the status", ok: true, fb: "If the log sets \"passed\" or \"completed\" whatever the score, the build ignored the report part of the spec." },
          { t: "The four cases in the spec, in case one of them has the wrong key", ok: false, fb: "A wrong key moves the score by one parcel, and one parcel of four would still fail. The status comes from the line of the log that sets it." }
        ] },
        { id: "f4", stem: "Which of these stays with you on the dock-check job?", options: [
          { t: "Writing a fifth practice parcel in the style of the four you approved", ok: false, fb: "A fifth parcel in the style of four you approved is good work for the model, as long as you check it against Karim's sheet." },
          { t: "Turning the approved plan into a table the shift lead can print", ok: false, fb: "Layout is the format part of the brief, and the model does it well when asked." },
          { t: "Deciding what a dock worker must be able to do when the session ends", ok: true, fb: "The objective comes from the job and from Karim, and every later check depends on it." }
        ] },
        { id: "f5", stem: "Your own check finds nothing wrong with the dock plan. Does it still go to a second designer?", options: [
          { t: "Yes, because your check rests on the same assumptions as your brief", ok: true, fb: "If your brief forgot parcels with a broken seal, your check will not look for them either, while a second reader starts from the sheet." },
          { t: "No, because a plan that passes all four questions has been checked", ok: false, fb: "The four questions are asked by the person who wrote the brief, and whatever you left out of the brief you will not look for in the plan." },
          { t: "Only if the plan differs a lot from the first draft the model wrote", ok: false, fb: "The second read is there for the designer's blind spots, and those stay the same however much the model changed between drafts." }
        ] }
      ], function () {
        var sc = AID.score();
        ctx.done();
        var open = AID.steps.filter(function (s) { return !AID.state.done[s.id]; });
        res.innerHTML = "";
        res.appendChild(h('<div class="result"><b class="big">' + sc.got + " of " + sc.total + "</b><p><strong>" + (sc.answered < sc.total ? "You have answered " + sc.answered + " of the " + sc.total + " scored questions so far." : sc.pct >= AID.passMark ? "That passes, since the mark is " + AID.passMark + " per cent on first answers." : "The pass mark is " + AID.passMark + " per cent on first answers, and this attempt falls short of it.") + "</strong></p>" +
          "<p>" + (open.length ? "You still have " + open.length + (open.length === 1 ? " step" : " steps") + " open in the outline, starting with \"" + open[0].nav + "\"." : "Every step of the course is done.") + " Inside an LMS the course reports this score and a status of passed or failed through SCORM 1.2.</p>" +
          '<p><a href="job-aid.html">Open the job aid</a>, read the <a href="design-log.html">design log</a> for how the course was built, or go <a href="../../">back to the portfolio</a>.</p></div>'));
        var reset = h('<div class="row"><button type="button" class="btn btn--line">Clear my progress and start again</button></div>');
        AID.$("button", reset).addEventListener("click", function () { AID.resetAll(); });
        res.appendChild(reset);
      });
    } });

  AID.gradedIds = ["u1q1", "u1q2", "u1q3", "u2q1", "u2q2", "f1", "f2", "f3", "f4", "f5"];
})();
