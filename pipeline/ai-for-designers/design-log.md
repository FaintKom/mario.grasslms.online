# Design log: working with an AI model

Decisions, sources and limits for the course in this folder. It is written for a reviewer who wants to know why the course is built the way it is.

## 1. What the course is

A self-paced course of three units and sixteen steps, about 35 minutes long, for instructional designers who already use a chatbot for drafts. It follows one job at an invented company, Harbour Home: a 45-minute session on refund requests for new support agents. The learner takes that job through a lesson plan, a slide deck and a SCORM practice exercise.

The course holds two films with voice-over, two simulations, five diagrams, two worked examples, two erroneous examples, ten scored questions and a one-page job aid. It runs as static HTML, CSS and JavaScript with no build step, and it reports to an LMS through SCORM 1.2.

## 2. Audience and outcomes

The learner is a working instructional designer. They know what a lesson plan is and have tried asking a model for one. The problem they bring is that the drafts look finished and are generic or wrong, and that checking them takes longer than writing from scratch.

| Outcome | Where it is taught | Where it is practised |
|---|---|---|
| Write a brief with five parts: learner, objective, limits, source, format | Unit 1, film and steps 3 and 4 | Unit 1 simulation, brief stage |
| Check a draft against four questions: objective, practice, facts, fit | Unit 1, step 5 | Unit 1 steps 5 and 6, unit 2 outline check, unit 3 test run |
| Write a fix request that names the place, the rule and what must stay | Unit 1, step 5 | All three simulations |
| Say which decisions stay with the designer and why a second designer reads the work | Unit 3, step 4 | Final questions 4 and 5 |

Each outcome names something the learner does on screen, so each has a task that shows whether they can do it.

## 3. One job across three units

The three units could have been three unrelated examples. I kept one case for two reasons.

The first is transfer. The brief, the check and the fix request are the same moves on three kinds of draft, and a learner sees that only when everything else stays still. This follows the whole-task idea in 4C/ID (van Merriënboer and Kirschner, 2018): the task stays whole and its form changes, from a plan to a deck to a built exercise.

The second is load. Dana's five policy notes are learned once in unit 1 and reused in every later task, so the learner's attention in units 2 and 3 goes to the new artefact (Sweller, Ayres and Kalyuga, 2011).

Dana's notes have five lines on purpose. It is small enough to hold in mind and has enough numbers in it (30 days, €150, 5 working days) for an invented fact to be checkable.

## 4. Sequence inside a unit

Unit 1 carries the full sequence, and the later units shorten it because the learner already knows the moves.

| Step | Format | Why it is there |
|---|---|---|
| Two drafts of the same lesson | Judgement task before any teaching | The learner already has prior knowledge, so a problem first gives them something to hang the theory on (Kapur, 2016). It also raises the question the film answers. |
| One request, two drafts | Film, 2 minutes | Shows a process over time: what was sent, what came back. Under six minutes (Guo, Kim and Rubin, 2014). |
| What a short request leaves open | Reading with a diagram | The diagram is explanatory, showing a cause and its effect for each gap (Clark and Lyons, 2011). |
| The five parts of a brief | Worked example, then a completion problem | A full example with the reasoning for each part, then one with a part missing (Renkl, 2014). |
| Checking the draft | Erroneous example | One defect per row, each under a different check, with the reason shown after the learner commits (McLaren, Adams and Mayer, 2015). It comes after the correct example, as Große and Renkl (2007) advise. |
| Dana's request | Simulation | The whole task with consequences: gaps in the brief become defects in the draft, and missed defects come back from the second designer. |
| Three questions | Retrieval, scored | New cases, so the learner cannot answer from memory of the screens. |

Unit 2 opens with a film because the three passes are again a process. Unit 3 puts the worked example before the test run because a learner cannot spot a broken exercise before seeing a working one.

## 5. Experience map

For each step I estimated the load and the feeling I expect, following the experience-map approach in Smyslova (2022). These are hypotheses to check against a pilot.

| Step | Load | Expected feeling | What I did about it |
|---|---|---|---|
| Two drafts | Low | Mild surprise at how bad Draft A is | Kept the task to one choice and one checklist |
| Film | Low | Recognition | One idea per scene, no on-screen text that repeats the voice |
| Brief and checks | Medium | Order, some relief | One part or one check on screen at a time |
| Unit 1 simulation | High | Effort, then either satisfaction or a sting when the plan comes back | Comments from the second designer are specific and the learner can run it again |
| Unit 2 | Medium | Confidence | Shorter steps, editing and sorting |
| Unit 3 spec and log | High for designers new to SCORM | Unease | Five calls only, a diagram the learner steps through, and a working example before the broken one |
| Test run | High | The satisfaction of catching something | Two of five tests pass, so the task is to tell them apart |
| What stays with you | Low | Closure | One diagram that puts all three units on a single grid |

The curve dips twice, at the two simulations where work can come back. I left both dips in, because a course where work never comes back gives the learner no reason to check.

## 6. Feedback

Feedback never says only that an answer is right or wrong, which is also part 3 of the spec the learner reads in unit 3. Each message states what is true about that option. In the simulations the first feedback is a consequence: the plan Tomás returns, the status line in the LMS log.

Questions are scored on the first answer. A wrong first answer still shows the reasoning for the right one.

## 7. The simulations are scripted

No simulation calls a model. Every draft, slide and build is written in advance and chosen by rule from what the learner did. In unit 1 four of the five brief parts decide rows of the draft (the objective decides two), the format part decides whether the plan comes back as a table or as running text, and the quiz row is defective whatever the brief says.

I chose this over a live model for three reasons. The same brief must return the same draft, or the feedback cannot name its defects. The course has to run from a static host and inside an LMS with no API key. A learner who gets a clean draft by luck would also learn that checking is optional. The same guidance for scenario courses is in Clark (2013): the environment responds to the learner's choices, and the response is planned in advance.

## 8. The films

Both films are built in code: each scene is a 1280 by 720 frame drawn in HTML and one voice-over line. A scene ends when its audio ends, so picture and voice cannot drift, and a missing clip falls back to captions with an estimated length.

I wrote the scripts for the ear, which is why they ask no questions and spell numbers as words. On-screen text shows the request, the draft and the brief, and it does not repeat the narration, following Mayer's redundancy principle. Captions are off by default and one button turns them on, and the full script sits under each film.

The voice is synthetic, rendered locally with an open text-to-speech model. Mayer's voice principle favours a human voice, so a recorded narration is the first thing I would change with a budget.

## 9. Assessment and SCORM

Ten questions are scored: three in unit 1, two in unit 2 and five at the end, two of which move the skill to a facilitator guide. The pass mark is 80 per cent on first answers. The simulations are not scored, because a learner who is experimenting with a weak brief should not lose marks for it.

Inside an LMS the course saves the current step and the answers in `cmi.suspend_data`, sends `cmi.core.score.raw` after every scored answer and sets `cmi.core.lesson_status` to passed or failed once every step is done and every scored question answered. Outside an LMS it keeps the same state in the browser.

## 10. Accessibility

- Every control is a native button, input or link, and the course can be completed from the keyboard.
- The outline marks the current step with `aria-current` and finished steps with text for screen readers.
- Feedback regions are live regions. Verdicts are carried by words as well as colour.
- Films have captions and a full script. Animations stop under `prefers-reduced-motion`.
- Text colours are near-black on paper or on tints of it.

A screen reader pass with NVDA is the next accessibility check to run.

## 11. Where this would sit in a rollout

A course like this is one part of getting a team to change how it works. When I introduced a slide generator to a design team, the order that worked was a workshop with a step-by-step guide, a week of practice on real lessons, and a review session after which we changed the template. I would run this course before the workshop, so that the workshop starts from the team's own briefs.

## 12. Limits

- The timing and the experience map are estimates until a pilot with learners has run.
- The SCORM calls follow the 1.2 run-time specification and were checked against a mock API in the browser. Loading the package into a production LMS is the next test.
- Harbour Home, its policy and its people are invented.

## 13. Sources

- Clark, R. C. and Lyons, C. (2011). *Graphics for Learning*, 2nd ed.
- Clark, R. C. (2013). *Scenario-Based e-Learning*.
- Große, C. S. and Renkl, A. (2007). Finding and fixing errors in worked examples. *Learning and Instruction*, 17.
- Guo, P. J., Kim, J. and Rubin, R. (2014). How video production affects student engagement. *L@S 2014*.
- Kapur, M. (2016). Examining productive failure, productive success, unproductive failure, and unproductive success in learning. *Educational Psychologist*, 51.
- Mayer, R. E. (2021). *Multimedia Learning*, 3rd ed.
- McLaren, B. M., Adams, D. M. and Mayer, R. E. (2015). Delayed learning effects with erroneous examples. *International Journal of Artificial Intelligence in Education*, 25.
- Renkl, A. (2014). Toward an instructionally oriented theory of example-based learning. *Cognitive Science*, 38.
- Smyslova, S. (2022). *Proektirovanie obrazovatelnogo opyta* (Designing Learning Experience). School of Education, Universal University.
- Sweller, J., Ayres, P. and Kalyuga, S. (2011). *Cognitive Load Theory*.
- van Merriënboer, J. J. G. and Kirschner, P. A. (2018). *Ten Steps to Complex Learning*, 3rd ed.
