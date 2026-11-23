/* Unit 1 simulation. The learner assembles a brief, a scripted "model" returns a
   draft whose defects depend on what the brief left out, the learner flags the
   defects, sends a fix request and passes the plan to a second designer.
   Nothing here calls a real model: every reply is written in advance. */
(function () {
  "use strict";
  var AID = window.AID;
  var SLOT = 45;

  var PARTS = [
    { id: "learner", name: "Learner", c: "#12798f",
      strong: "The learners are twelve support agents in their first week. They have used the ticket system for two days and will handle their first refund next week.",
      vague: "The learners are new employees at our company." },
    { id: "objective", name: "Objective", c: "#07683f",
      strong: "By the end each agent can take a refund ticket, decide to approve, escalate or decline it, and write the customer the decision and the next step.",
      vague: "Agents will understand the refund policy and feel confident using it." },
    { id: "limits", name: "Limits", c: "#c1401d",
      strong: "The session is 45 minutes in one room with a projector. There is no breakout software and no pre-work.",
      vague: "Keep it short and interactive." },
    { id: "source", name: "Source", c: "#0a4652",
      strong: "Use only Dana's notes, pasted below. Where the notes are silent, write 'not in the notes'.",
      vague: "Follow standard refund practice for online shops." },
    { id: "format", name: "Format", c: "#232b22",
      strong: "Give me a table with one row per activity: minutes and what the agents do. Put the total time under the table.",
      vague: "Write it up clearly." }
  ];

  function sumOf(rows) {
    return rows.reduce(function (a, r) { return a + (r.min || 0); }, 0);
  }

  /* The total row is judged against the rows above it and against Dana's slot. */
  function totalRow(rows, stated, from) {
    var sum = sumOf(rows), bad = stated !== sum || sum !== SLOT;
    return {
      id: "total", t: "Total", min: 0, stated: stated, html: stated + " minutes", bad: bad, from: from,
      why: stated !== sum
        ? "The rows add up to " + sum + " minutes. The model repeated the total from the brief and did not add up its own rows."
        : "Dana has a 45-minute slot. The brief never said so, and the plan runs to " + sum + " minutes.",
      rev: stated !== sum ? "The total says " + stated + " and the rows come to " + sum + "." : "The plan runs to " + sum + " minutes, and Dana's slot is 45.",
      fine: "The rows add up to 45, which is the slot Dana has."
    };
  }

  /* Build the first draft from the brief. pick[id] is "strong" | "vague" | "none". */
  function draft(pick) {
    var s = function (id) { return pick[id] === "strong"; };
    var v = function (id, vague, none) { return pick[id] === "vague" ? vague : none; };
    var rows = [];
    rows.push(s("objective")
      ? { id: "obj", t: "Goal", html: "Given a refund ticket, the agent approves, escalates or declines it and tells the customer the next step.", bad: false,
          fine: "You could watch an agent do this, which is what the first check asks." }
      : { id: "obj", t: "Goal", html: "Agents will understand the refund policy.", bad: true, from: "objective",
          why: v("objective", "The brief itself said \"understand\", and the model kept the word. Nobody can watch an agent understand.",
            "The brief did not say what agents do at the end, and the model fell back on the commonest verb in lesson plans."),
          rev: "The goal says \"understand\". What would I watch an agent do?" });
    rows.push(s("learner")
      ? { id: "open", t: "5 min", min: 5, html: "Three tickets on screen. Agents vote approve, escalate or decline on each before any teaching.", bad: false,
          fine: "Opening with tickets suits agents who already know the ticket system." }
      : { id: "open", t: "10 min", min: 10, html: "Welcome, introductions and a short talk on why customer service matters.", bad: true, from: "learner",
          why: v("learner", "\"New employees\" could be anyone, and the model wrote for anyone. These agents are in their first week of a support job and do not need persuading that service matters.",
            "The brief did not say who the learners are, and the model wrote an opening for people who have never worked in support."),
          rev: "Ten minutes on why service matters, for people who already work in support." });
    rows.push(s("source")
      ? { id: "rules", t: "10 min", min: 10, html: "The four rules, one ticket per rule: 30 days from delivery, unused in original packaging, a photo for damaged items, above €150 to the team lead.", bad: false,
          fine: "All four figures are in Dana's notes." }
      : { id: "rules", t: "10 min", min: 10, html: "The refund rules: 14 days from purchase, receipt required, agents approve refunds up to €500.", bad: true, from: "source",
          why: v("source", "\"Standard refund practice\" is not Dana's policy. Her notes say 30 days from delivery and €150, and none of these figures is in them.",
            "None of these figures is in Dana's notes, which say 30 days from delivery and €150. The brief gave the model no source, and it borrowed a typical policy."),
          rev: "Dana's notes say 30 days and €150. The plan says 14 days and €500." });
    rows.push(s("objective")
      ? { id: "prac", t: "15 min", min: 15, html: "Pairs decide six tickets and note the rule they used for each.", bad: false,
          fine: "Deciding tickets is what the objective names." }
      : { id: "prac", t: "15 min", min: 15, html: "A presentation of the refund process step by step, with examples.", bad: true, from: "objective",
          why: "Agents listen for fifteen minutes and decide nothing. A goal built on \"understand\" gives the model no reason to plan practice.",
          rev: "Fifteen minutes of presentation and nobody decides a ticket." });
    rows.push(s("limits")
      ? { id: "reply", t: "10 min", min: 10, html: "Each agent writes the reply for one ticket, and the group compares two replies.", bad: false,
          fine: "It practises the second half of the objective and needs only the room you have." }
      : { id: "reply", t: "20 min", min: 20, html: "Breakout rooms in the video tool, where groups draft replies and present them.", bad: true, from: "limits",
          why: v("limits", "\"Short and interactive\" gives no minutes and no room, and the model planned for a setup you do not have.",
            "The session is in one room and there is no breakout software. The brief gave no limits, and the model planned for a setup you do not have."),
          rev: "We have one room and no breakout tool." });
    rows.push({ id: "quiz", t: "10 min", min: 10, html: "A quiz of eight questions on the wording of the policy.", bad: true, from: "model",
      why: "A quiz on wording practises remembering, and the job is deciding. The model reaches for a quiz even after a full brief, which is why this check exists.",
      rev: "The quiz checks wording. When do they decide a ticket on their own?" });
    rows.push(totalRow(rows, s("limits") ? SLOT : sumOf(rows), s("limits") ? "model" : "limits"));
    return rows;
  }

  var FIXED = {
    obj: { html: "Given a refund ticket, the agent approves, escalates or declines it and tells the customer the next step." },
    open: { t: "5 min", min: 5, html: "Three tickets on screen. Agents vote approve, escalate or decline on each before any teaching." },
    rules: { t: "10 min", min: 10, html: "The four rules, one ticket per rule: 30 days from delivery, unused in original packaging, a photo for damaged items, above €150 to the team lead." },
    prac: { t: "15 min", min: 15, html: "Pairs decide six tickets and note the rule they used for each." },
    reply: { t: "10 min", min: 10, html: "Each agent writes the reply for one ticket, and the group compares two replies." },
    quiz: { t: "5 min", min: 5, html: "Three new tickets decided alone, answers checked together." }
  };
  function fix(row) {
    var f = FIXED[row.id];
    return { id: row.id, t: f.t || row.t, min: f.min != null ? f.min : row.min, html: f.html, bad: false };
  }
  var FIXLINE = {
    obj: "Goal: agents decide a ticket and tell the customer the next step.",
    open: "Opening: start with three tickets the agents vote on, 5 minutes.",
    rules: "Rules: use the four in Dana's notes (30 days, packaging, photo, €150).",
    prac: "Practice: pairs decide six tickets, 15 minutes.",
    quiz: "Quiz row: replace with three tickets decided alone, 5 minutes.",
    reply: "Replies: one room, each agent writes one reply, 10 minutes.",
    total: "Total: add up the rows again."
  };

  /* What Tomás receives after the fix request. */
  function afterFix(rows, found, kind) {
    var body = rows.filter(function (r) { return r.id !== "total"; });
    var old = rows[rows.length - 1], out;
    if (kind === "specific") {
      out = body.map(function (r) { return r.bad && found.indexOf(r.id) >= 0 ? fix(r) : r; });
      out.push(totalRow(out, found.indexOf("total") >= 0 ? sumOf(out) : old.stated, old.from));
      return out;
    }
    /* A vague request or a restart: the model rewrites freely, keeps some defects and adds a figure. */
    var kept = 0;
    out = body.map(function (r) {
      if (!r.bad) return r;
      if (kept < 2) { kept++; return r; }
      return fix(r);
    });
    out = out.map(function (r) {
      if (r.id !== "rules") return r;
      return { id: "rules", t: r.t, min: r.min, html: r.html + " Refunds reach the customer within 3 working days.", bad: true,
        rev: r.bad ? r.rev + " It also promises the money in 3 working days, and the notes say 5." : "The plan promises the money in 3 working days, and Dana's notes say 5." };
    });
    out.push(totalRow(out, sumOf(out), old.from));
    return out;
  }

  AID.workbench = function (host, done) {
    var st = AID.state.data.wb || (AID.state.data.wb = { phase: "brief", pick: {} });
    var wb = AID.h('<div class="wb"><aside class="wb__chat"><h2>Messages</h2><div class="wb__msgs" aria-live="polite"></div></aside>' +
      '<section class="wb__main"><p class="wb__where" aria-live="polite"><b></b><span></span><i></i><i></i><i></i><i></i></p>' +
      '<div class="wb__pane"></div></section></div>');
    host.appendChild(wb);
    var msgs = AID.$(".wb__msgs", wb), pane = AID.$(".wb__pane", wb), where = AID.$(".wb__where", wb);
    var rows = [], found = [], flags = null;
    var STAGES = { brief: "Write the brief", review: "Check the draft", fix: "Send a fix request", send: "Review by a second designer" };

    function say(who, html, cls) {
      var m = AID.h('<div class="msg ' + (cls || "") + '"><b>' + who + "</b>" + html + "</div>");
      msgs.appendChild(m);
      if (msgs.children.length > 1) msgs.scrollTop = msgs.scrollHeight;
    }
    function stage(p) {
      var order = ["brief", "review", "fix", "send"], j = order.indexOf(p);
      AID.$("b", where).textContent = "Step " + (j + 1) + " of 4";
      AID.$("span", where).textContent = STAGES[p];
      AID.$$("i", where).forEach(function (d, i) { d.className = i < j ? "is-past" : i === j ? "is-here" : ""; });
    }
    function keep() { AID.save(); }

    say("Dana Okafor, support team lead", "Hi! Twelve new agents start on Tuesday and I have a 45-minute slot with them on Thursday for refunds. One room, a projector, nothing fancy. Could you draft the session plan? My notes on the policy are below.<ol>" +
      AID.POLICY.map(function (p) { return "<li>" + p + "</li>"; }).join("") + "</ol>");

    /* ---- step 1: the brief ---- */
    function brief() {
      stage("brief");
      pane.innerHTML = '<h3>Write the brief</h3><p class="read">For each part choose the sentence you would send, or leave the part out. The model gets what you choose here and nothing more, and it sees Dana\'s notes only if you tell it to use them.</p>';
      var form = document.createElement("form");
      PARTS.forEach(function (p) {
        var order = p.id === "objective" || p.id === "source" ? ["vague", "strong", "none"] : ["strong", "vague", "none"];
        form.appendChild(AID.h('<fieldset class="slot" style="--c:' + p.c + '"><legend>' + p.name + "</legend>" +
          order.map(function (k) {
            return '<label class="' + (k === "none" ? "skip-it" : "") + '"><input type="radio" name="' + p.id + '" value="' + k + '"' + (st.pick[p.id] === k ? " checked" : "") + "><span>" + (k === "none" ? "Leave this part out" : p[k]) + "</span></label>";
          }).join("") + "</fieldset>"));
      });
      var send = AID.h('<div class="row"><button type="submit" class="btn btn--ink">Send the brief to the model</button><span class="aside">Choose something for all five parts first.</span></div>');
      form.appendChild(send);
      function ready() { AID.$("button", send).disabled = PARTS.some(function (p) { return !st.pick[p.id]; }); }
      form.addEventListener("change", function () {
        PARTS.forEach(function (p) { var c = form.querySelector('input[name="' + p.id + '"]:checked'); if (c) st.pick[p.id] = c.value; });
        ready(); keep();
      });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        st.phase = "review"; keep();
        sendBrief(true);
      });
      ready();
      pane.appendChild(form);
    }

    function briefText() {
      var lines = PARTS.filter(function (p) { return st.pick[p.id] !== "none"; }).map(function (p) { return p[st.pick[p.id]]; });
      return "Draft a session plan on handling refund requests.\n" + lines.join("\n") + (st.pick.source === "strong" ? "\n\n[Dana's notes, 5 lines]" : "");
    }

    function sendBrief(animate) {
      say("You, to the model", "<span class=\"mono\">" + AID.esc(briefText()).replace(/\n/g, "<br>") + "</span>", "msg--me");
      rows = draft(st.pick);
      if (!animate) { say("Model", "Here is the session plan.", "msg--model"); review(); return; }
      stage("review");
      pane.innerHTML = '<h3>The model is writing</h3><p class="typing" aria-label="The model is writing"><i></i><i></i><i></i></p>';
      setTimeout(function () { say("Model", "Here is the session plan.", "msg--model"); review(); }, 1300);
    }

    function lower(s) { return s.charAt(0).toLowerCase() + s.slice(1); }
    function asProse(r, i) {
      if (r.id === "obj") return "The goal of the session is this. " + r.html;
      if (r.id === "total") return "In total the session takes " + r.html + ".";
      return (i === 1 ? "First, for " : "Then, for ") + r.t.replace(" min", " minutes") + ", " + lower(r.html);
    }

    /* ---- step 2: check the draft ---- */
    function review() {
      stage("review");
      var prose = st.pick.format !== "strong";
      pane.innerHTML = "<h3>Check the draft</h3><p class=\"read\">Ask the four questions from the last step and select every row you would send back. " +
        (prose ? "The brief asked for no format, and the plan arrived as running text in which each sentence is one row." : "The plan came as the table you asked for.") + '</p><div class="doc"><div class="doc__bar"><i></i>Session plan, draft 1<span>from the model</span></div><div class="doc__body" style="padding:0"></div></div>';
      flags = AID.flagList(AID.$(".doc__body", pane), rows.map(function (r, i) {
        return { id: r.id, html: prose ? asProse(r, i) : "<b>" + r.t + "</b>" + r.html, bad: r.bad, why: r.why, fine: r.fine };
      }), { prose: prose });
      var bar = AID.h('<div class="row"><button type="button" class="btn btn--ink">Check my flags</button></div>');
      pane.appendChild(bar);
      AID.$("button", bar).addEventListener("click", function () {
        var res = flags.check();
        found = res.hit;
        st.found = found; st.phase = "fix"; keep();
        afterCheck(res);
      });
      if (st.phase !== "review" && st.found) {
        st.found.forEach(function (id) { var b = flags.el.querySelector('.flag[data-id="' + id + '"] .flag__btn'); if (b) b.click(); });
        var res = flags.check(); found = res.hit; afterCheck(res);
      }
    }

    function plural(n, word) { return n + " " + word + (n === 1 ? "" : "s"); }

    function afterCheck(res) {
      AID.$(".row", pane).remove();
      var bad = rows.filter(function (r) { return r.bad; });
      var fromModel = bad.filter(function (r) { return r.from === "model"; }).length, fromBrief = bad.length - fromModel;
      pane.appendChild(AID.h('<div class="tally"><div><b>' + res.hit.length + " of " + bad.length + "</b><span>defects you found</span></div><div><b>" + fromBrief + "</b><span>came from gaps in your brief</span></div><div><b>" + fromModel + "</b><span>the model added on its own</span></div></div>"));
      pane.appendChild(AID.h('<p class="read">' + (fromBrief === 0
        ? "Your brief closed every gap, and the draft still had " + plural(fromModel, "defect") + " that the model added on its own."
        : "The gaps in your brief came back as " + plural(fromBrief, "defect") + " you then had to find, and the model added " + fromModel + " more on its own.") +
        (st.pick.format !== "strong" ? " The plan also came back as running text, because the brief asked for no format." : "") +
        (res.extra.length ? " You flagged " + plural(res.extra.length, "row") + " that " + (res.extra.length === 1 ? "was" : "were") + " sound." : "") + "</p>"));
      var go = AID.h('<div class="row"><button type="button" class="btn btn--ink">Write the fix request</button></div>');
      pane.appendChild(go);
      AID.$("button", go).addEventListener("click", fixStep);
      if (st.phase === "send" || st.phase === "end") fixStep();
    }

    /* ---- step 3: the fix request ---- */
    function fixStep() {
      stage("fix");
      var specific = found.length
        ? found.map(function (id) { return FIXLINE[id]; }).join(" ") + " Use only Dana's notes. Change nothing else."
        : "Check every figure against Dana's notes and keep the session at 45 minutes. Change nothing else.";
      var box = AID.h('<div><h3>Send the draft back to the model</h3><p class="read">The second message is built from the rows you flagged.</p><div class="fixq"></div></div>');
      pane.innerHTML = ""; pane.appendChild(box);
      var opts = [
        { t: "This isn't quite right. Please improve the plan and make it more engaging.", ok: false, kind: "vague", reply: "I have rewritten the plan.",
          fb: "The model rewrote the whole plan. Some defects are gone, the activities have changed and a new figure has appeared, and everything has to be checked again from the top." },
        { t: specific, ok: true, kind: "specific", reply: "Here is the revised plan.",
          fb: found.length ? "The model changed the rows you named and left the others alone, and only those rows need a second look."
            : "The model checked the figures and the total. Whatever else was wrong is still in the plan." },
        { t: "Start again and write a better lesson plan about refunds.", ok: false, kind: "restart", reply: "Here is a new plan.",
          fb: "A fresh start with a shorter request brings back the gaps your brief had closed, and you get a new draft with new defects." }
      ];
      var replay = st.phase === "send" || st.phase === "end";
      AID.questions(AID.$(".fixq", box), [{ id: "wb-fix", graded: false, stem: "Which message do you send?", options: opts }], function () {
        var o = opts[AID.state.data["q:wb-fix"]];
        st.fixKind = o.kind;
        st.phase = st.phase === "end" ? "end" : "send"; keep();
        say("You, to the model", "<span class=\"mono\">" + AID.esc(o.t) + "</span>", "msg--me");
        say("Model", o.reply, "msg--model");
        var go = AID.h('<div class="row"><button type="button" class="btn btn--ink">Send the plan to Tomás for review</button></div>');
        box.appendChild(go);
        AID.$("button", go).addEventListener("click", function () { st.phase = "end"; keep(); send(true); });
        if (replay && st.phase === "end") send(false);
      });
    }

    /* ---- step 4: second designer ---- */
    function send(fresh) {
      stage("send");
      var finalRows = afterFix(rows, found, st.fixKind);
      var left = finalRows.filter(function (r) { return r.bad; });
      var clean = left.length === 0;
      say("You, to Tomás", "Session plan for Dana's refund slot, ready for your review.", "msg--me");
      say("Tomás Ribeiro, instructional designer", clean
        ? "I read it against Dana's notes. The figures match, the rows add up to 45 and the agents decide tickets for most of it. Passing it to Dana for a test run."
        : "Sending this back before it reaches Dana.<ol>" + left.slice(0, 4).map(function (r) { return "<li>" + r.rev + "</li>"; }).join("") + "</ol>", "msg--peer");
      pane.innerHTML = "<h3>" + (clean ? "Tomás passed the plan to testing" : "Tomás returned the plan with comments") + "</h3>" +
        '<p class="read">' + (clean
          ? "You found every defect and named each one in the fix request, and a second reader could confirm the plan in a few minutes."
          : st.fixKind === "specific"
            ? "The fix request repaired what you flagged. What you did not flag was still in the plan when Tomás opened it, and his comments are in the messages."
            : "The plan Tomás received kept some of the defects and added a figure of its own. His comments are in the messages.") + "</p>" +
        '<div class="doc"><div class="doc__bar"><i></i>Session plan, as sent to Tomás</div><div class="doc__body"><table class="plan"><tbody>' +
        finalRows.map(function (r) { return "<tr><td>" + r.t + "</td><td>" + r.html + "</td></tr>"; }).join("") + "</tbody></table></div></div>";
      var again = AID.h('<div class="row"><button type="button" class="btn btn--line">Run the simulation again with a different brief</button></div>');
      pane.appendChild(again);
      AID.$("button", again).addEventListener("click", function () {
        AID.state.data.wb = st = { phase: "brief", pick: {} };
        delete AID.state.data["q:wb-fix"];
        keep();
        while (msgs.children.length > 1) msgs.removeChild(msgs.lastChild);
        brief();
      });
      if (fresh) pane.scrollIntoView({ block: "nearest" });
      done();
    }

    if (st.phase === "brief") brief();
    else sendBrief(false);
  };
})();
