/* Scenes for the two films. Each scene pairs one voice-over line (audio/<id>.mp3)
   with a 1280x720 frame. `at` is the point of the line (0..1) where an element appears.
   On-screen text shows the request, the drafts and the brief; it does not repeat the voice. */
(function () {
  "use strict";
  var AID = window.AID;

  function fx(at, style, inner, cls, out) {
    return '<div class="fx ' + (cls || "") + '" data-at="' + at + '"' + (out != null ? ' data-out="' + out + '"' : "") + ' style="' + style + '">' + inner + "</div>";
  }
  function card(title, rows, at, style, step) {
    var body = rows.map(function (r, i) {
      return '<div class="fx ' + (r[2] || "") + '" data-at="' + (at + (step || 0) * (i + 1)).toFixed(3) + '" style="position:relative"><b>' + r[0] + "</b><span>" + r[1] + "</span></div>";
    }).join("");
    return fx(at, style, "<h5>" + title + '</h5><div class="f-rows">' + body + "</div>", "f-card");
  }
  function person(letter, name, color, at, style) {
    return fx(at, style, '<div class="f-person" style="--c:' + color + '"><i>' + letter + "</i>" + name + "</div>", "fx--pop");
  }
  function tag(at, left, top, text, ok) {
    return fx(at, "left:" + left + "px;top:" + top + "px", '<div class="f-tag' + (ok ? " f-tag--ok" : "") + '" style="position:static">' + text + "</div>");
  }

  var A_ROWS = [
    ["Goal", "Agents will understand the refund policy."],
    ["5 min", "Introduction: what a refund is"],
    ["15 min", "Presentation: the refund policy. Returns within 14 days."],
    ["15 min", "Presentation: approved and declined requests"],
    ["15 min", "Group discussion: difficult customers"],
    ["10 min", "Quiz: ten questions on the policy"]
  ];
  function draftA(at, style, marks, step) {
    return card("Lesson plan: refund policy training", A_ROWS.map(function (r, i) { return [r[0], r[1], marks && marks[i] ? marks[i] : ""]; }), at, style, step);
  }
  /* The first draft the brief returned: the quiz is the last activity and the total is wrong. */
  var B_ROWS = [
    ["Goal", "Given a ticket, the agent approves, escalates or declines."],
    ["5 min", "Three tickets on screen, agents vote on each"],
    ["10 min", "The four rules, one ticket per rule"],
    ["15 min", "Pairs decide six tickets and note the rule"],
    ["10 min", "Each agent writes the reply for one ticket"],
    ["10 min", "Quiz: eight questions on the wording of the policy"],
    ["Total", "45 minutes"]
  ];
  function draftB(at, style, marks, step) {
    return card("Lesson plan: deciding a refund request", B_ROWS.map(function (r, i) { return [r[0], r[1], marks && marks[i] ? marks[i] : ""]; }), at, style, step);
  }
  var CHIPS = [
    ["Learner", "New agents, first week, two days on the ticket system", "#12798f"],
    ["Objective", "Decide a refund request and tell the customer the next step", "#07683f"],
    ["Limits", "45 minutes, one room, no breakout software", "#c1401d"],
    ["Source", "The team lead's policy notes, and nothing else", "#0a4652"],
    ["Format", "A table with timings and the total under it", "#232b22"]
  ];
  function chips(n, fresh) {
    var s = fx(0, "left:100px;top:56px", '<div class="f-title" style="font-size:46px">The brief</div>');
    s += person("B", "", "#8fd770", 0, "left:100px;top:150px");
    for (var i = 0; i < n; i++) {
      s += fx(i === n - 1 && fresh ? 0.12 : 0, "left:250px;top:" + (150 + i * 92) + "px;width:930px",
        '<div class="f-chip" style="--c:' + CHIPS[i][2] + '"><b>' + CHIPS[i][0] + "</b><span>" + CHIPS[i][1] + "</span></div>", "fx--left");
    }
    return s;
  }
  var gate = '<div class="f-gate"><svg viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" fill="none" stroke="#0d150d" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
  var MODEL = '<h5 style="text-align:center">The model</h5><div style="font:850 120px/1.3 Archivo;text-align:center;color:#c1401d">?</div>';

  AID.films = {};

  AID.films.one = {
    audio: "audio/",
    title: "One request, two drafts",
    scenes: [
      { id: "f1_01", text: "You have just compared two plans for the same session on refund requests, and both came from the same model on the same day.",
        html: fx(0, "left:100px;top:70px;width:1000px", '<div class="f-title">One request,<br>two drafts</div>') +
          person("A", "Designer A", "#ffd84d", 0.12, "left:190px;top:330px") + person("B", "Designer B", "#8fd770", 0.2, "left:960px;top:330px") +
          fx(0.42, "left:400px;top:320px;width:480px", '<h5>The session they both planned</h5><div class="f-rows"><div><b>Topic</b><span>Refund requests</span></div><div><b>Time</b><span>45 minutes</span></div><div><b>For</b><span>Support agents, week one</span></div></div>', "f-card fx--pop") },
      { id: "f1_02", text: "The designer who received the first plan had typed one line that asked for a lesson plan about the company's refund policy.",
        html: person("A", "Designer A", "#ffd84d", 0, "left:100px;top:90px") +
          fx(0.05, "left:270px;top:230px;width:900px", '<div class="f-prompt"><small>Request to the model</small><span class="f-caret" data-type="Create a lesson plan about our refund policy." data-at="0.3" data-to="0.9"></span></div>') },
      { id: "f1_03", text: "A model that gets a request like this has to fill in everything else by itself, and it fills it in with what it has seen in most lesson plans.",
        html: fx(0, "left:490px;top:250px;width:300px", MODEL, "f-card fx--pop") +
          fx(0.08, "left:70px;top:150px;width:380px", '<div class="f-line">Who are the agents?</div>', "fx--left", 0.5) +
          fx(0.16, "left:830px;top:150px;width:380px", '<div class="f-line">What must they do?</div>', "fx--right", 0.6) +
          fx(0.24, "left:70px;top:500px;width:380px", '<div class="f-line">How long is the session?</div>', "fx--left", 0.7) +
          fx(0.32, "left:830px;top:500px;width:380px", '<div class="f-line">What does the policy say?</div>', "fx--right", 0.8) +
          fx(0.5, "left:70px;top:150px;width:380px", '<div class="f-line fill">Who are the agents? <span>everyone</span></div>') +
          fx(0.6, "left:830px;top:150px;width:380px", '<div class="f-line fill">What must they do? <span>understand</span></div>') +
          fx(0.7, "left:70px;top:500px;width:380px", '<div class="f-line fill">How long? <span>an hour</span></div>') +
          fx(0.8, "left:830px;top:500px;width:380px", '<div class="f-line fill">The policy? <span>14 days</span></div>') },
      { id: "f1_04", text: "That is why the goal says the agents will understand the policy, although nobody in the room can see whether a person understands.",
        html: draftA(0, "left:80px;top:120px;width:700px", { 0: "hl" }, 0) +
          tag(0.45, 820, 190, "Nothing here to observe") },
      { id: "f1_05", text: "For the same reason half of the time goes to presentation, and the session runs to an hour when the team lead has only forty-five minutes.",
        html: draftA(0, "left:80px;top:120px;width:700px", { 2: "hl", 3: "hl" }, 0) +
          tag(0.1, 820, 290, "30 of 60 minutes are slides") + tag(0.5, 820, 390, "60 minutes in a 45-minute slot") },
      { id: "f1_06", text: "The fourteen days for returning an item are also the figure the model has met most often, and this company allows thirty.",
        html: draftA(0, "left:80px;top:120px;width:700px", { 2: "hl" }, 0) +
          tag(0.1, 820, 290, "14 days in the plan") + tag(0.65, 820, 390, "30 days in the notes", true) },
      { id: "f1_07", text: "The other designer began with what the model could not know and wrote it down as a brief.",
        html: fx(0, "left:100px;top:56px", '<div class="f-title" style="font-size:46px">The brief</div>') + person("B", "Designer B", "#8fd770", 0, "left:100px;top:150px") +
          [0, 1, 2, 3, 4].map(function (i) { return fx(0.3 + i * 0.12, "left:250px;top:" + (150 + i * 92) + "px;width:930px", '<div class="f-chip" style="--c:' + CHIPS[i][2] + ';opacity:.45"><b>' + CHIPS[i][0] + "</b><span></span></div>", "fx--left"); }).join("") },
      { id: "f1_08", text: "The brief first describes the learners, who are agents in their first week and have worked in the ticket system for two days.", html: chips(1, true) },
      { id: "f1_09", text: "Then it says what an agent should be able to do when the session ends, which is to decide a refund request and tell the customer what happens next.", html: chips(2, true) },
      { id: "f1_10", text: "It also gives the conditions, which are forty-five minutes, one room and no software for group work.", html: chips(3, true) },
      { id: "f1_11", text: "The team lead's notes on the policy are pasted into the brief, and the model is told to use only them.", html: chips(4, true) },
      { id: "f1_12", text: "At the end the designer asks for a table with the minutes for each activity, because a colleague can review a table quickly.", html: chips(5, true) },
      { id: "f1_13", text: "The plan written from this brief starts with three tickets, and the agents spend most of the session deciding requests in pairs.",
        html: draftB(0, "left:80px;top:90px;width:740px", { 1: "ok", 3: "ok" }, 0.06) +
          tag(0.3, 860, 215, "Starts with tickets", true) + tag(0.6, 860, 325, "Agents decide, in pairs", true) },
      { id: "f1_14", text: "It still came back with a quiz on the wording of the policy and with timings that add up to fifty minutes, which is why the designer checked it before sending it to a colleague.",
        html: draftB(0, "left:80px;top:90px;width:740px", { 5: "hl", 6: "hl" }, 0) +
          tag(0.15, 860, 432, "A quiz practises remembering") + tag(0.4, 860, 490, "5 + 10 + 15 + 10 + 10 = 50") },
      { id: "f1_15", text: "The next step shows the four questions that this check consists of.",
        html: fx(0, "left:120px;top:250px;width:260px", '<div class="f-pass"><h6>Brief</h6><p>Five parts</p></div>', "fx--pop") +
          fx(0.15, "left:510px;top:250px;width:260px", '<div class="f-pass"><h6>Draft</h6><p>From the model</p></div>', "fx--pop") +
          fx(0.4, "left:900px;top:250px;width:260px", '<div class="f-pass" style="background:#ffd84d"><h6>Check</h6><p>Four questions</p></div>', "fx--pop") +
          fx(0.1, "left:392px;top:300px;width:106px;height:6px;background:#0d150d", "") + fx(0.35, "left:782px;top:300px;width:106px;height:6px;background:#0d150d", "") }
    ]
  };

  var OUT = [
    ["Three tickets: approve, escalate or decline?", "row 1"],
    ["A short history of Harbour Home", "no row"],
    ["The four rules", "row 2"],
    ["Pairs: six tickets", "row 3"],
    ["Write the reply", "row 4"],
    ["Three new tickets, on your own", "row 5"]
  ];
  function outline(cutAt) {
    return fx(0, "left:100px;top:50px", '<div class="f-title" style="font-size:46px">Pass 1: the outline</div>') +
      OUT.map(function (o, i) {
        var top = 150 + i * 72, cut = cutAt != null && i === 1;
        return fx(cutAt != null ? 0 : 0.2 + i * 0.1, "left:100px;top:" + top + "px;width:860px", '<div class="f-line">' + (i + 1) + ". " + o[0] + " <span>" + o[1] + "</span></div>", "fx--left") +
          (cut ? fx(cutAt, "left:100px;top:" + top + "px;width:860px", '<div class="f-line cut">' + (i + 1) + ". " + o[0] + " <span>no row, cut</span></div>") : "");
      }).join("");
  }
  var FIELDS = '{\n  <span class="k">"title"</span>: "The four rules",\n  <span class="k">"points"</span>: [\n    "30 days from delivery",\n    "Unused, in original packaging",\n    "Damaged: a photo is enough",\n    "Above €150: team lead decides"\n  ],\n  <span class="k">"note"</span>: "One ticket per rule."\n}';
  var SLIDE = '<h6>The four rules</h6><ul><li>30 days from delivery</li><li>Unused, in original packaging</li><li>Damaged: a photo is enough</li><li>Above €150: team lead decides</li></ul>';
  var MINI = '<div style="margin:14px;height:12px;width:60%;background:#ffd84d;border-radius:3px"></div><div style="margin:8px 14px;height:6px;background:#ffffff66;border-radius:3px"></div><div style="margin:8px 14px;height:6px;width:70%;background:#ffffff66;border-radius:3px"></div>';

  AID.films.two = {
    audio: "audio/",
    title: "A deck in three passes",
    scenes: [
      { id: "f2_01", text: "The plan for the refund session has passed review, and the next thing the trainer needs is a set of slides.",
        html: fx(0, "left:120px;top:190px;width:430px", '<h5>Lesson plan</h5><div class="f-rows"><div><b>5 min</b><span>Three tickets, vote</span></div><div><b>10 min</b><span>The four rules</span></div><div><b>15 min</b><span>Pairs decide six tickets</span></div><div><b>10 min</b><span>Write the reply</span></div><div><b>5 min</b><span>Three tickets alone</span></div></div>', "f-card") +
          fx(0.2, "left:470px;top:150px", gate, "fx--pop") +
          fx(0.5, "left:590px;top:320px;width:90px;height:6px;background:#0d150d", "") +
          fx(0.6, "left:720px;top:210px;width:440px;height:250px;border:4px dashed #0d150d;border-radius:10px;display:grid;place-items:center", '<div class="f-q" style="color:#0d150d">Slides</div>', "fx--pop") },
      { id: "f2_02", text: "A model will write all of them in one go if you ask, but then every slide has to be compared with the plan after its wording and layout are already done.",
        html: Array.apply(null, Array(20)).map(function (_, i) {
          return fx(0.2 + i * 0.016, "left:" + (110 + (i % 5) * 216) + "px;top:" + (104 + Math.floor(i / 5) * 128) + "px;width:196px;height:110px;background:#0a4652;border:3px solid #0d150d;border-radius:8px", MINI, "fx--pop");
        }).join("") },
      { id: "f2_03", text: "It is easier to build the deck in three passes and to look at the result of each pass before the next one starts.",
        html: fx(0, "left:100px;top:60px", '<div class="f-title" style="font-size:54px">Three passes</div>') +
          fx(0.15, "left:70px;top:260px;width:250px", '<div class="f-pass"><h6>1. Outline</h6><p>One line per slide</p></div>', "fx--pop") +
          fx(0.3, "left:460px;top:260px;width:250px", '<div class="f-pass"><h6>2. Content</h6><p>Plain fields</p></div>', "fx--pop") +
          fx(0.45, "left:850px;top:260px;width:250px", '<div class="f-pass"><h6>3. Slides</h6><p>Into the template</p></div>', "fx--pop") +
          fx(0.6, "left:358px;top:290px", gate, "fx--pop") + fx(0.7, "left:748px;top:290px", gate, "fx--pop") + fx(0.8, "left:1138px;top:290px", gate, "fx--pop") },
      { id: "f2_04", text: "The first pass gives a list of slides, where every line says which row of the plan the slide is for.", html: outline(null) },
      { id: "f2_05", text: "A list like this is quick to check, and in this one a slide about the history of the company belongs to no row of the plan and is removed before anyone writes it.",
        html: outline(0.6) + fx(0.1, "left:1040px;top:320px", gate, "fx--pop") },
      { id: "f2_06", text: "In the second pass the model fills in each slide as a title, up to four short points and a note for the trainer.",
        html: fx(0, "left:100px;top:50px", '<div class="f-title" style="font-size:46px">Pass 2: the content</div>') +
          fx(0.12, "left:100px;top:150px;width:640px", '<div class="f-code">' + FIELDS + "</div>") +
          tag(0.4, 800, 180, "title", true) + tag(0.55, 800, 270, "points", true) + tag(0.75, 800, 360, "note", true) },
      { id: "f2_07", text: "This is where you find a slide that carries nine points and a refund limit that differs from the plan, and both are corrected while the slide is still plain text.",
        html: fx(0, "left:80px;top:100px;width:460px", '<h6>The four rules</h6><ul style="font-size:17px"><li>30 days from delivery</li><li>Unused, in original packaging</li><li>Damaged: a photo is enough</li><li>Above €200: team lead decides</li><li>How to greet the customer</li><li>Tone of voice</li><li>Ticket macros</li><li>Reply times</li><li>Escalation contacts</li></ul>', "f-slide", 0.34) +
          fx(0.34, "left:80px;top:120px;width:400px", '<h6 style="font-size:28px">The four rules</h6><ul><li>30 days from delivery</li><li>Unused, in packaging</li><li>Damaged: a photo</li><li>Above €150: team lead</li></ul>', "f-slide fx--pop") +
          fx(0.42, "left:520px;top:120px;width:400px", '<h6 style="font-size:28px">Writing the reply</h6><ul style="font-size:19px"><li>Greeting and tone of voice</li><li>Ticket macros</li><li>Reply times</li><li>Escalation contacts</li></ul>', "f-slide fx--pop") +
          fx(0.16, "left:930px;top:150px;width:300px", '<div class="f-tag" style="position:static">Nine points on one slide</div>') +
          fx(0.7, "left:930px;top:260px;width:300px", '<div class="f-tag" style="position:static">€200 on the slide, €150 in the plan</div>') },
      { id: "f2_08", text: "In the third pass the text goes into the template, which already has the fonts, the colours and the layout the company uses.",
        html: fx(0, "left:100px;top:50px", '<div class="f-title" style="font-size:46px">Pass 3: the slides</div>') +
          fx(0, "left:80px;top:170px;width:500px", '<div class="f-code" style="font-size:16px">' + FIELDS + "</div>") +
          fx(0.25, "left:600px;top:330px;width:80px;height:6px;background:#0d150d", "") +
          fx(0.35, "left:700px;top:170px;width:500px", SLIDE, "f-slide fx--pop") },
      { id: "f2_09", text: "By that time you have read every slide twice in a simple form, and the colleague who reviews the deck gets slides that already match the plan.",
        html: fx(0, "left:150px;top:210px", gate, "fx--pop") + fx(0.1, "left:430px;top:210px", gate, "fx--pop") + fx(0.2, "left:710px;top:210px", gate, "fx--pop") +
          fx(0, "left:82px;top:300px;width:200px", '<div class="f-sub" style="text-align:center">Outline</div>') + fx(0.1, "left:362px;top:300px;width:200px", '<div class="f-sub" style="text-align:center">Content</div>') + fx(0.2, "left:642px;top:300px;width:200px", '<div class="f-sub" style="text-align:center">Slides</div>') +
          fx(0.45, "left:860px;top:300px;width:90px;height:6px;background:#0d150d", "") +
          person("T", "Second designer", "#d4f1c4", 0.55, "left:990px;top:190px") }
    ]
  };

  /* Clip lengths in seconds, filled from audio/manifest.json when the voice-over is rendered.
     They size the scene bar before the audio has loaded; the player still waits for each clip to end. */
  var DUR = {"f1_01": 6.77, "f1_02": 7.69, "f1_03": 8.25, "f1_04": 7.33, "f1_05": 8.39, "f1_06": 7.19, "f1_07": 4.7, "f1_08": 6.71, "f1_09": 8.22, "f1_10": 6.05, "f1_11": 5.7, "f1_12": 6.74, "f1_13": 7.25, "f1_14": 9.68, "f1_15": 3.64, "f2_01": 5.9, "f2_02": 9.01, "f2_03": 6.38, "f2_04": 5.63, "f2_05": 9.42, "f2_06": 6.57, "f2_07": 9.33, "f2_08": 7.13, "f2_09": 8.23};
  [AID.films.one, AID.films.two].forEach(function (f) {
    f.scenes.forEach(function (s) { if (DUR[s.id]) s.dur = DUR[s.id] + 0.25; });
  });
})();
