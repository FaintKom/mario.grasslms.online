/* Unit 3. "Refund desk" is the SCORM exercise the learner specifies and tests.
   It talks to a mock LMS whose log is printed under it. `build: "first"` is the
   model's first build with three planted defects; `build: "final"` follows the spec. */
(function () {
  "use strict";
  var AID = window.AID;

  var POLICY = [
    "Refunds are accepted within 30 days of delivery.",
    "The item must be unused and in its original packaging.",
    "For items damaged on arrival a photo is enough, and the item is not sent back.",
    "Refunds above €150 go to the team lead.",
    "Money returns to the original payment method within 5 working days."
  ];
  AID.POLICY = POLICY;

  var TICKETS = [
    { id: 1, who: "Elif Demir", item: "Table lamp", price: 40, days: 12, state: "Unused, in its box", note: "Changed her mind about the colour.", key: "approve",
      why: "Rules 1 and 2 are met and €40 is under the limit, so the agent approves it and the money goes back within 5 working days." },
    { id: 2, who: "Jonas Weber", item: "Wool rug", price: 120, days: 41, state: "Unused, in its packaging", note: "Was away and opened the parcel late.", key: "decline",
      why: "Delivery was 41 days ago and rule 1 allows 30, so the agent declines and says which rule applies." },
    { id: 3, who: "Marta Nowak", item: "Sofa cover set", price: 180, days: 6, state: "Unused, in its packaging", note: "Ordered the wrong size.", key: "escalate",
      why: "The request meets rules 1 and 2, but €180 is above the €150 in rule 4, so the team lead decides." },
    { id: 4, who: "Samir Haddad", item: "Wall mirror", price: 95, days: 1, state: "Arrived cracked, photo attached", note: "Asks whether he has to send it back.", key: "approve",
      why: "Rule 3 covers damage on arrival: the photo is enough, the mirror stays with the customer and €95 is under the limit." }
  ];
  var LABEL = { approve: "Approve", escalate: "Escalate to team lead", decline: "Decline" };

  /* build: "final" | "first" ; onEvent(type, payload) lets the host react */
  AID.refundDesk = function (host, build, onEvent) {
    var first = build === "first";
    var el = AID.h('<div class="rd">' +
      '<div class="rd__bar">Refund desk, practice<span class="rd__count"></span></div>' +
      '<div class="rd__body"><div class="rd__ticket" aria-live="polite"></div>' +
      '<div class="rd__policy"><h4>Policy card</h4><ol>' + POLICY.map(function (p) { return "<li>" + p + "</li>"; }).join("") + "</ol></div></div>" +
      '<div class="rd__acts"></div><div class="rd__fb" hidden></div>' +
      '<div class="log" tabindex="0" aria-label="LMS log"><h4>LMS log</h4></div></div>');
    host.appendChild(el);
    var tEl = AID.$(".rd__ticket", el), acts = AID.$(".rd__acts", el), fb = AID.$(".rd__fb", el), log = AID.$(".log", el), count = AID.$(".rd__count", el);
    var at = 0, score = 0, calls = [];

    function lms(call, value) {
      calls.push({ call: call, value: value });
      var line = document.createElement("div");
      line.textContent = call;
      log.appendChild(line);
      log.scrollTop = log.scrollHeight;
      if (onEvent) onEvent("call", calls);
    }

    function ticket() {
      var t = TICKETS[at];
      count.textContent = "Ticket " + (at + 1) + " of " + TICKETS.length;
      tEl.innerHTML = "<h4>" + t.who + " asks for a refund</h4><p>" + t.note + "</p><dl>" +
        "<dt>Item</dt><dd>" + t.item + "</dd><dt>Price</dt><dd>€" + t.price + "</dd>" +
        "<dt>Delivered</dt><dd>" + t.days + (t.days === 1 ? " day" : " days") + " ago</dd><dt>Condition</dt><dd>" + t.state + "</dd></dl>";
      fb.hidden = true;
      acts.innerHTML = "";
      ["approve", "escalate", "decline"].forEach(function (k) {
        var b = AID.h('<button type="button" class="btn btn--line btn--sm">' + LABEL[k] + "</button>");
        b.addEventListener("click", function () { answer(k); });
        acts.appendChild(b);
      });
    }

    function answer(k) {
      var t = TICKETS[at];
      /* planted defect 1: the first build marks ticket 3 as "approve" */
      var key = first && t.id === 3 ? "approve" : t.key;
      var ok = k === key;
      if (ok) score++;
      AID.$$("button", acts).forEach(function (b) { b.disabled = true; });
      fb.hidden = false;
      fb.className = "rd__fb " + (ok ? "is-ok" : "is-no");
      /* planted defect 2: the first build gives a verdict without the rule */
      var text = first ? (ok ? "Correct." : "Incorrect. Try the next one.") : "<strong>" + LABEL[t.key] + ".</strong> " + t.why;
      fb.innerHTML = "<p>" + text + "</p>";
      var next = AID.h('<button type="button" class="btn btn--ink btn--sm">' + (at + 1 < TICKETS.length ? "Next ticket" : "See the result") + "</button>");
      next.addEventListener("click", function () { at++; at < TICKETS.length ? ticket() : result(); });
      fb.appendChild(next);
      next.focus();
      if (onEvent) onEvent("answer", { ticket: t.id, choice: k, shownAs: ok });
    }

    function result() {
      count.textContent = "Result";
      tEl.innerHTML = "<h4>" + score + " of " + TICKETS.length + " tickets decided as the policy says</h4><p>" +
        (first ? "Well done, you have finished the practice." : score >= 3 ? "That passes, since the mark is three or more." : "The pass mark is three, and this attempt falls short of it. You can launch the exercise again.") + "</p>";
      acts.innerHTML = "";
      fb.hidden = true;
      /* planted defect 3: the first build sends no score and always reports "completed" */
      if (first) {
        lms('LMSSetValue("cmi.core.lesson_status", "completed")');
      } else {
        lms('LMSSetValue("cmi.core.score.raw", ' + score + ")");
        lms('LMSSetValue("cmi.core.score.max", ' + TICKETS.length + ")");
        lms('LMSSetValue("cmi.core.lesson_status", "' + (score >= 3 ? "passed" : "failed") + '")');
      }
      lms('LMSCommit("")');
      lms('LMSFinish("")');
      /* LMSFinish has closed the session, and SCORM 1.2 allows no call after it.
         A second attempt is therefore a new launch from the LMS, with a new log. */
      var again = AID.h('<button type="button" class="btn btn--line btn--sm">Launch it again</button>');
      again.addEventListener("click", start);
      acts.appendChild(again);
      if (onEvent) onEvent("result", { score: score, calls: calls });
    }

    function start() {
      at = 0; score = 0; calls = [];
      log.innerHTML = "<h4>LMS log</h4>";
      lms('LMSInitialize("")');
      ticket();
    }
    start();
    return { restart: start };
  };

  /* The test run: the first build beside the five tests from the spec. */
  var TESTS = [
    { id: "t1", text: "Each ticket's correct answer matches Dana's notes.", key: "fail",
      why: "Ticket 3 is a €180 refund. Rule 4 sends it to the team lead, and this build accepts Approve and marks Escalate as wrong." },
    { id: "t2", text: "After every choice the feedback names the rule that applies.", key: "fail",
      why: "The build answers with 'Correct.' or 'Incorrect. Try the next one.' and never mentions a rule, which part 3 of the spec forbids." },
    { id: "t3", text: "On the result screen a score out of four goes to the LMS, with 'passed' at three or more and 'failed' below.", key: "fail",
      why: "The log has no score line, and the status is 'completed' whatever you scored, so the team lead could not tell who passed." },
    { id: "t4", text: "The package opens the session when it starts, then saves and closes it at the end.", key: "pass",
      why: "LMSInitialize is the first line of the log, and LMSCommit and LMSFinish are the last two." },
    { id: "t5", text: "Every button can be reached and pressed from the keyboard.", key: "pass",
      why: "Tab reaches the three decisions and the Next button, and Enter presses them." }
  ];
  var FIXES = [
    { t: "It has some bugs. Please fix them and make sure everything works properly.", ok: false,
      fb: "The model cannot see your test report, so it has to guess which bugs you mean. It will change something, and you will have to run all five tests again without knowing what it touched." },
    { t: "Ticket 3: the correct answer is Escalate, rule 4, because €180 is above €150. Feedback after every choice must name the rule, as in part 3 of the spec. On the result screen send cmi.core.score.raw, and set lesson_status to passed at 3 or more and failed below. Change nothing else.", ok: true,
      fb: "Each line names the place, the expected behaviour and the part of the spec it comes from. The last sentence tells the model that the two tests that passed must still pass." },
    { t: "Start again from the spec and build a better version.", ok: false,
      fb: "A rebuild throws away the two things that already worked, and nothing in this request tells the model what went wrong the first time." }
  ];

  /* What each test shows on the second build, where all five pass. */
  var SECOND = {
    t1: "Ticket 3 now takes Escalate as the correct answer, and the other three tickets are marked as they were.",
    t2: "After every choice this build shows the decision and the rule it rests on.",
    t3: "The log now has the two score lines, and the status is 'passed' at three or four and 'failed' below.",
    t4: "LMSInitialize is still the first line of the log, and LMSCommit and LMSFinish are still the last two.",
    t5: "Tab still reaches the three decisions and the Next button, and Enter presses them."
  };

  /* One test report: five tests with Pass and Fail, checked together.
     opt = { title, key(t), why(t), saved, store(verdicts), after(right) } */
  function report(host, opt) {
    var el = AID.h('<div class="tests"><h3>' + opt.title + '</h3><div class="tests__list"></div>' +
      '<div class="tests__foot"><button type="button" class="btn btn--ink btn--sm" disabled>Check my test report</button></div></div>');
    host.appendChild(el);
    var verdicts = {}, list = AID.$(".tests__list", el), check = AID.$(".tests__foot button", el);

    TESTS.forEach(function (t, i) {
      var row = AID.h('<div class="test" data-id="' + t.id + '"><p>' + (i + 1) + ". " + t.text + '</p><div class="test__v" role="group" aria-label="Verdict for test ' + (i + 1) + '">' +
        '<button type="button" data-v="pass" aria-pressed="false">Pass</button><button type="button" data-v="fail" aria-pressed="false">Fail</button></div></div>');
      AID.$$("button", row).forEach(function (b) {
        b.addEventListener("click", function () {
          if (row.classList.contains("is-right") || row.classList.contains("is-wrong")) return;
          verdicts[t.id] = b.getAttribute("data-v");
          AID.$$("button", row).forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
          check.disabled = Object.keys(verdicts).length < TESTS.length;
        });
      });
      list.appendChild(row);
    });

    function reveal(fresh) {
      var right = 0;
      TESTS.forEach(function (t) {
        var row = AID.$('.test[data-id="' + t.id + '"]', list), key = opt.key(t), ok = verdicts[t.id] === key;
        if (ok) right++;
        row.classList.add(ok ? "is-right" : "is-wrong");
        AID.$$("button", row).forEach(function (x) { x.setAttribute("aria-pressed", x.getAttribute("data-v") === verdicts[t.id]); x.disabled = true; });
        row.appendChild(AID.h('<p class="test__fb"><strong>' + (key === "fail" ? "This test fails. " : "This test passes. ") + "</strong>" + opt.why(t) + "</p>"));
      });
      check.hidden = true;
      if (fresh) { opt.store(verdicts); AID.save(); }
      opt.after(right);
    }
    check.addEventListener("click", function () { reveal(true); });
    if (opt.saved) { verdicts = opt.saved; reveal(false); }
  }

  AID.testRun = function (host, done) {
    var data = AID.state.data;
    var wrap = AID.h('<div><div class="tp"><div class="tp__build"></div></div><div class="tp__after"></div></div>');
    host.appendChild(wrap);
    var after = AID.$(".tp__after", wrap);
    AID.refundDesk(AID.$(".tp__build", wrap), "first");

    report(AID.$(".tp", wrap), {
      title: "Tests from part 6 of the spec",
      key: function (t) { return t.key; },
      why: function (t) { return t.why; },
      saved: data.testRun && data.testRun.verdicts,
      store: function (v) { data.testRun = { verdicts: v }; },
      after: function (right) {
        after.appendChild(AID.h('<div class="note ' + (right === TESTS.length ? "note--ok" : "note--calm") + '"><p><strong>' + right + " of " + TESTS.length + " verdicts match.</strong> " +
          (right === TESTS.length ? "Your report separates the three defects from the two things that work, which is what the fix request needs." : "The evidence for each test is next to it. Two of the five tests pass, and a report that fails everything hides that from the model.") + "</p></div>"));
        var q = document.createElement("div");
        after.appendChild(q);
        AID.questions(q, [{ id: "u3-fix", stem: "Three tests failed. Which message do you send back to the model?", graded: false,
          options: FIXES.map(function (f) { return { t: f.t, ok: f.ok, fb: f.fb }; }) }], second);
      }
    });

    /* The second build gets the same five tests, because a fix can break what worked. */
    function second() {
      var sent = FIXES[data["q:u3-fix"]].ok;
      var fin = AID.h('<div><h2>The second build</h2><p class="read">' + (sent ? "The model changed the three things the request named." : "Suppose you had sent the second message. The model changed the three things it names.") +
        ' Run the same five tests on that build before it goes to Tomás, since a fix can break something that worked in the first build.</p><div class="tp"><div class="tp__final"></div></div><div class="tp__end"></div></div>');
      after.appendChild(fin);
      AID.refundDesk(AID.$(".tp__final", fin), "final");
      report(AID.$(".tp", fin), {
        title: "The same tests on the second build",
        key: function () { return "pass"; },
        why: function (t) { return SECOND[t.id]; },
        saved: data.testRun2 && data.testRun2.verdicts,
        store: function (v) { data.testRun2 = { verdicts: v }; },
        after: function (right) {
          AID.$(".tp__end", fin).appendChild(AID.h('<div class="note ' + (right === TESTS.length ? "note--ok" : "note--calm") + '"><p><strong>' + right + " of " + TESTS.length + " verdicts match.</strong> " +
            (right === TESTS.length ? "All five tests pass on the second build, which means the fix repaired the three defects and left the two working parts as they were, and the exercise can go to Tomás."
              : "All five tests pass on this build, and the evidence for each one is next to it.") + "</p></div>"));
          done();
        }
      });
    }
  };
})();
