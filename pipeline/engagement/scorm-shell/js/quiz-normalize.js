/**
 * quiz-normalize.js — one quiz shape for every module.
 *
 * Each module's data/quiz.json was written in a different shape (options vs
 * choices, per-option `correct` vs `keyed` vs item-level `correct` letter vs
 * `correct_index`, `rationale` vs `feedback` vs `feedback_correct/incorrect`,
 * plain-string options). The quiz renderer reads one shape:
 *
 *   { stem, options: [{ label, text, correct, rationale }] }
 *
 * @param {any} raw  parsed quiz.json (an array, or an object with `items`)
 * @returns {Array<{stem:string, options:Array<{label:string,text:string,correct:boolean,rationale:string}>}>}
 */
export function normalizeQuiz(raw) {
  const items = Array.isArray(raw) ? raw : (raw?.items ?? []);
  const LETTERS = "ABCDEFGH";
  return items.map((q) => {
    const src = q.options ?? q.choices ?? [];
    const options = src.map((o, i) => {
      const letter = LETTERS[i];
      if (typeof o === "string") {
        const correct = i === q.correct_index;
        return { label: letter, text: o, correct, rationale: q.rationale ?? "" };
      }
      // A long `label` is the option text itself (module 6).
      const longLabel = typeof o.label === "string" && o.label.length > 2;
      const label = longLabel ? letter : (o.label ?? o.id ?? letter);
      const text = o.text ?? (longLabel ? o.label : "");
      let correct = o.correct ?? o.keyed;
      if (correct === undefined && typeof q.correct === "string") correct = (o.id ?? o.label ?? letter) === q.correct;
      if (correct === undefined && typeof q.correct_index === "number") correct = i === q.correct_index;
      correct = Boolean(correct);
      const rationale = o.rationale ?? o.feedback
        ?? (correct ? q.feedback_correct : q.feedback_incorrect)
        ?? q.feedback ?? q.rationale ?? "";
      return { label, text, correct, rationale };
    });
    return { ...q, options };
  });
}
