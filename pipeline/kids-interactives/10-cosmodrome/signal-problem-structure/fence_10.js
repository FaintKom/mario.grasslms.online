// Извлечь текст из .docx
const text = extractTextFromDocx(uploadedFile);

// Проверить наличие правильных слов
const requiredWords = ["ракета", "роботов", "Топливо", "Навигация", "Землёй"];
const foundWords = requiredWords.filter(word => text.includes(word));

if (foundWords.length === 5) {
  return "success";
} else {
  const missing = requiredWords.filter(word => !text.includes(word));
  return `Ещё есть ошибки. Проверь слова рядом с: ${missing.join(", ")}`;
}
