const pptx = parsePptx(uploadedFile);

// Проверяем что заголовки не пустые и содержат ключевые слова
const slides = pptx.slides;
const checks = [
  slides[0].title.length > 0,  // Есть заголовок
  slides[1].title.length > 0,
  slides[2].title.length > 0,
  slides[3].title.length > 0
];

// Опционально: проверка ключевых слов
const keywords = [
  ["команда", "экипаж", "роботы"],
  ["ракета", "корабль"],
  ["цель", "марс", "планета"],
  ["встречи", "пока", "прощай"]
];
