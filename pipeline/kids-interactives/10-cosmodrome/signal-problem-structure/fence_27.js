const correctPairs = {
  "brush": "draws_lines",
  "fill": "fills_area",
  "pencil": "draws_thin",
  "eraser": "erases",
  "selection": "selects"
};

function checkMatching(userPairs) {
  for (const [tool, func] of Object.entries(correctPairs)) {
    if (userPairs[tool] !== func) {
      return { success: false, message: "Некоторые пары неправильные. Попробуй ещё!" };
    }
  }
  return { success: true };
}
