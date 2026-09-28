const correctAnswers = {
  "Engines": ["engine.png", "fuel.pdf"],
  "Navigation": ["map.docx", "compass.xlsx"],
  "Communication": ["antenna.jpg", "radio.mp3"]
};

function checkTask(userAnswers) {
  for (const folder in correctAnswers) {
    const expected = correctAnswers[folder].sort();
    const actual = (userAnswers[folder] || []).sort();
    if (JSON.stringify(expected) !== JSON.stringify(actual)) {
      return { 
        success: false, 
        message: `Проверь папку ${folder}` 
      };
    }
  }
  return { success: true };
}
