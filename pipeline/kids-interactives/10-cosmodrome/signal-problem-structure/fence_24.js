function checkSelectedFile(round, selectedFile, currentPath) {
  const correctAnswers = {
    1: { path: "/Spaceport/Communication", file: "antenna.jpg" },
    2: { path: "/Spaceport/Engines", file: "fuel.pdf" },
    3: { path: "/Spaceport/Navigation/secret", file: "coordinates.txt" }
  };
  
  const correct = correctAnswers[round];
  
  if (currentPath === correct.path && selectedFile === correct.file) {
    return { success: true, message: "Правильно! Файл найден." };
  } else {
    return { success: false, message: "Это не тот файл. Попробуй ещё раз!" };
  }
}
