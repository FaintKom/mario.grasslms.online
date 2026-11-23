/* Unit 2 interactives: the three-pass diagram, the slide field editor with its
   capacity limits, and the outline-against-plan check. */
(function () {
  "use strict";
  var AID = window.AID;

  var GATE = '<svg viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="15" fill="#ffd84d" stroke="#0d150d" stroke-width="2.5"/><path d="M10 17.5l5 5 9-10" fill="none" stroke="#0d150d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var PASSES = [
    { h: "1. Outline", p: "One line per slide, each tied to a row of the plan.", check: "Check: each slide points to a row, and no row is left without a slide.",
      view: "<h4>What pass 1 looks like after your check</h4><pre>1. Three tickets: approve, escalate or decline?   plan row 1\n2. The four rules                                 plan row 2\n3. Rule 1 on a ticket: the 30-day window          plan row 2\n4. Pairs: six tickets                             plan row 3\n5. Write the reply: decision and next step        plan row 4\n6. Three new tickets, on your own                 plan row 5</pre>" },
    { h: "2. Content", p: "Each slide written as plain fields: a title, up to four points, a trainer's note.", check: "Check: each slide fits the limits, each fact matches the plan.",
      view: '<h4>What comes back from pass 2, for slide 2</h4><pre>{\n  "title": "The four rules",\n  "points": [\n    "30 days from delivery",\n    "Unused, in original packaging",\n    "Damaged on arrival: a photo is enough",\n    "Above €150: the team lead decides"\n  ],\n  "note": "Show one ticket per rule. Ask which rule applies before you reveal it."\n}</pre>' },
    { h: "3. Slides", p: "The fields poured into the template, which already holds fonts, colours and layout.", check: "Check: nothing overflows, then a colleague reads it.",
      view: '<h4>What comes out of pass 3, for slide 2</h4><div class="slide" style="max-width:560px"><h4>The four rules</h4><ul><li>30 days from delivery</li><li>Unused, in original packaging</li><li>Damaged on arrival: a photo is enough</li><li>Above €150: the team lead decides</li></ul><div class="slide__foot"><span>Harbour Home, support onboarding</span><span>2</span></div></div>' }
  ];

  AID.passes = function (host) {
    var wrap = AID.h('<div><div class="passes"></div><div class="pass-view" aria-live="polite"></div></div>');
    var row = AID.$(".passes", wrap), view = AID.$(".pass-view", wrap);
    PASSES.forEach(function (p, i) {
      var b = AID.h('<button type="button" class="pass" aria-pressed="false"><h4>' + p.h + "</h4><p>" + p.p + "</p><small>" + p.check + "</small></button>");
      b.addEventListener("click", function () {
        AID.$$(".pass", row).forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        view.innerHTML = p.view;
      });
      row.appendChild(b);
      if (i < 2) row.appendChild(AID.h('<div class="passes__gate">' + GATE + "</div>"));
    });
    host.appendChild(wrap);
    AID.$(".pass", row).click();
  };

  /* ---- slide field editor ---- */
  var START = {
    title: "The four rules of our refund policy and how to apply each of them on a ticket",
    points: [
      "Refunds are accepted within 30 days of delivery",
      "The item must be unused and in its original packaging when the customer sends it back to us",
      "Damaged on arrival: a photo is enough",
      "Above €150: the team lead decides",
      "Always greet the customer by name",
      "Use the refund macro in the ticket system",
      "Money returns within 5 working days"
    ].join("\n"),
    note: "One ticket per rule."
  };
  var MODEL = {
    title: "The four rules",
    points: ["30 days from delivery", "Unused, in original packaging", "Damaged on arrival: a photo is enough", "Above €150: the team lead decides"].join("\n"),
    note: "One ticket per rule. Greeting, the refund macro and the 5 working days belong to the slide on writing the reply."
  };

  AID.slideEditor = function (host, done) {
    var saved = AID.state.data.sed || START;
    var el = AID.h('<div class="sed"><form class="sed__form" onsubmit="return false">' +
      '<label for="sed-t">Title</label><input id="sed-t" type="text" autocomplete="off">' +
      '<label for="sed-p">Points, one per line</label><textarea id="sed-p" spellcheck="false"></textarea>' +
      '<label for="sed-n">Trainer\'s note</label><textarea id="sed-n" style="min-height:70px" spellcheck="false"></textarea>' +
      '<div class="row" style="margin-bottom:0"><button type="button" class="btn btn--line btn--sm" id="sed-show">Show one way to do it</button><button type="button" class="btn btn--line btn--sm" id="sed-reset">Start over</button></div></form>' +
      '<div><div class="slide"><h4></h4><ul></ul><div class="slide__foot"><span>Harbour Home, support onboarding</span><span>2</span></div></div>' +
      '<ul class="limits" aria-live="polite"><li data-k="title"><i></i><span></span></li><li data-k="count"><i></i><span></span></li><li data-k="words"><i></i><span></span></li></ul>' +
      '<pre class="json" aria-label="The same slide as data"></pre></div></div>');
    host.appendChild(el);
    var t = AID.$("#sed-t", el), p = AID.$("#sed-p", el), n = AID.$("#sed-n", el), slide = AID.$(".slide", el);
    function set(v) { t.value = v.title; p.value = v.points; n.value = v.note; paint(); }
    function paint() {
      var pts = p.value.split("\n").map(function (x) { return x.trim(); }).filter(Boolean);
      AID.$("h4", slide).textContent = t.value;
      AID.$("ul", slide).innerHTML = pts.map(function (x) { return "<li>" + AID.esc(x) + "</li>"; }).join("");
      var long = pts.filter(function (x) { return x.split(/\s+/).length > 12; }).length;
      var ok = { title: t.value.length > 0 && t.value.length <= 60, count: pts.length > 0 && pts.length <= 4, words: long === 0 };
      var text = {
        title: "Title: " + t.value.length + " of 60 characters",
        count: "Points: " + pts.length + " of 4",
        words: long ? long + (long === 1 ? " point is" : " points are") + " longer than 12 words" : "Every point is 12 words or fewer"
      };
      Object.keys(ok).forEach(function (k) {
        var li = AID.$('.limits [data-k="' + k + '"]', el);
        li.classList.toggle("is-ok", ok[k]);
        AID.$("span", li).textContent = text[k];
      });
      var fits = ok.title && ok.count && ok.words;
      slide.classList.toggle("is-over", !fits);
      AID.$(".json", el).textContent = JSON.stringify({ title: t.value, points: pts, note: n.value }, null, 2);
      AID.state.data.sed = { title: t.value, points: p.value, note: n.value };
      if (fits) done();
    }
    [t, p, n].forEach(function (x) { x.addEventListener("input", paint); });
    AID.$("#sed-show", el).addEventListener("click", function () { set(MODEL); AID.save(); });
    AID.$("#sed-reset", el).addEventListener("click", function () { set(START); AID.save(); });
    set(saved);
    return function () { AID.save(); };
  };

  /* ---- outline against plan ---- */
  var PLAN = [
    ["1", "5 min", "Three tickets on screen, agents vote on each"],
    ["2", "10 min", "The four rules, one ticket per rule"],
    ["3", "15 min", "Pairs decide six tickets and note the rule"],
    ["4", "10 min", "Each agent writes the reply for one ticket"],
    ["5", "5 min", "Three new tickets decided alone"]
  ];
  var SLIDES = [
    { h: "Three tickets: approve, escalate or decline?", pts: ["Vote on each ticket", "No discussion yet"], key: "keep",
      fb: "It belongs to row 1 and holds one instruction, so it stays." },
    { h: "A short history of Harbour Home", pts: ["Founded as a family shop", "Our values", "Our first warehouse"], key: "cut",
      fb: "No row of the plan asks for company history. The model added a slide that decks usually have." },
    { h: "The four rules", pts: ["30 days from delivery", "Unused, in original packaging", "Damaged: a photo is enough", "Above €150: team lead", "How to greet the customer", "Tone of voice", "Ticket macros", "Reply times", "Escalation contacts"], key: "split",
      fb: "Nine points on one slide. The first four are row 2, and the other five belong with writing the reply in row 4." },
    { h: "Pairs: six tickets", pts: ["Decide each ticket together", "Note the rule you used", "Refunds above €200 go to the team lead"], key: "fact",
      fb: "The plan and Dana's notes say €150. A changed figure on a slide is what agents will remember." },
    { h: "Write the reply", pts: ["State the decision", "Give the next step", "Compare two replies"], key: "keep",
      fb: "It belongs to row 4 and fits the template." },
    { h: "Ten tips for great customer service", pts: ["Smile when you type", "Be positive", "And eight more"], key: "cut",
      fb: "Nothing in the plan teaches general tips, and the session has no minutes for them." }
  ];
  var VERDICT = { keep: "Keep", cut: "Cut", split: "Split", fact: "Fix a fact" };

  AID.deckCheck = function (host, done) {
    var saved = AID.state.data.dc || {};
    var el = AID.h('<div><div class="dc"><div class="dc__plan"><div class="doc"><div class="doc__bar"><i></i>The approved plan</div><div class="doc__body" style="padding:8px 12px"><table class="plan plan--3"><thead><tr><th>Row</th><th>Time</th><th>Activity</th></tr></thead><tbody>' +
      PLAN.map(function (r) { return "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td><td>" + r[2] + "</td></tr>"; }).join("") +
      '</tbody></table></div></div></div><div><div class="thumbs"></div><div class="row"><button type="button" class="btn btn--ink" id="dc-check" disabled>Check my verdicts</button></div></div></div><div class="dc__after"></div></div>');
    host.appendChild(el);
    var thumbs = AID.$(".thumbs", el), check = AID.$("#dc-check", el), after = AID.$(".dc__after", el), v = {};
    SLIDES.forEach(function (s, i) {
      var card = AID.h('<div class="thumb"><div class="thumb__s"><div class="thumb__n">Slide ' + (i + 1) + "</div><h4>" + s.h + "</h4><ul>" + s.pts.map(function (x) { return "<li>" + x + "</li>"; }).join("") + '</ul></div><div class="thumb__v" role="group" aria-label="Verdict for slide ' + (i + 1) + '">' +
        Object.keys(VERDICT).map(function (k) { return '<button type="button" data-v="' + k + '" aria-pressed="false">' + VERDICT[k] + "</button>"; }).join("") + "</div></div>");
      AID.$$("button", card).forEach(function (b) {
        b.addEventListener("click", function () {
          if (check.hidden) return;
          v[i] = b.getAttribute("data-v");
          AID.$$("button", card).forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
          check.disabled = Object.keys(v).length < SLIDES.length;
        });
      });
      thumbs.appendChild(card);
    });
    function reveal(fresh) {
      var right = 0;
      SLIDES.forEach(function (s, i) {
        var card = thumbs.children[i], ok = v[i] === s.key;
        if (ok) right++;
        card.classList.add(ok ? "is-right" : "is-wrong");
        AID.$$("button", card).forEach(function (x) { x.setAttribute("aria-pressed", x.getAttribute("data-v") === v[i]); x.disabled = true; });
        card.appendChild(AID.h('<p class="thumb__fb">' + (ok ? "" : "You chose " + VERDICT[v[i]] + ". ") + "<strong>" + (ok ? "" : "The outline needs: ") + VERDICT[s.key] + ".</strong> " + s.fb + "</p>"));
      });
      check.hidden = true;
      if (fresh) { AID.state.data.dc = { v: v }; AID.save(); }
      after.appendChild(AID.h('<div class="note note--calm"><p><strong>' + right + " of " + SLIDES.length + " verdicts match.</strong> You checked every slide against the plan. The check also runs the other way, from the plan to the slides.</p></div>"));
      AID.questions(after, [{ id: "u2-missing", graded: false, stem: "One row of the plan has no slide in this outline. Which one?",
        options: [
          { t: "Row 2, the four rules", ok: false, fb: "Slide 3 covers row 2, even though it needs splitting." },
          { t: "Row 4, writing the reply", ok: false, fb: "Slide 5 covers row 4." },
          { t: "Row 5, three new tickets decided alone", ok: true, fb: "The outline ends on general tips and never reaches the last activity. A missing slide is harder to see than a wrong one, which is why the check runs in both directions." }
        ] }], done);
    }
    check.addEventListener("click", function () { reveal(true); });
    if (saved.v) { v = saved.v; reveal(false); }
  };
})();
