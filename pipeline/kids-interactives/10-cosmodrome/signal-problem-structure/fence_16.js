const text = editor.getText().toLowerCase();

const requiredWords = [
  "file", "folder", "program", "document", 
  "website", "information", "browser"
];

const wrongWords = [
  "flie", "floder", "progam", "documnet",
  "websight", "informaton", "browzer"
];

// Все правильные слова есть
const hasAllCorrect = requiredWords.every(word => text.includes(word));

// Ни одного неправильного слова нет
const hasNoWrong = wrongWords.every(word => !text.includes(word));

if (hasAllCorrect && hasNoWrong) {
  return "success";
} else {
  // Показать какие слова ещё неправильные
  const remaining = wrongWords.filter(word => text.includes(word));
  return `Ещё есть ошибки. Проверь: ${remaining.join(", ")}`;
}
