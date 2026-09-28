const pptx = parsePptx(uploadedFile);
const slides = pptx.slides;

// ═══════════════════════════════════════════
// ЗАДАНИЕ 1: Проверка порядка слайдов
// ═══════════════════════════════════════════
const expectedOrder = [
  "Mission to Mars",  // или проверяем по картинке/ID
  "Our Team",
  "Preparation", 
  "Countdown",
  "Launch!"
];

const checkOrder = () => {
  // Проверяем заголовки или уникальные идентификаторы слайдов
  const titles = slides.map(s => s.title || s.getShapeByType("title")?.text);
  
  // Проверяем что "Mission to Mars" первый, "Launch!" последний
  const isFirstCorrect = titles[0]?.includes("Mission");
  const isLastCorrect = titles[4]?.includes("Launch");
  
  return isFirstCorrect && isLastCorrect;
};

// ═══════════════════════════════════════════
// ЗАДАНИЕ 2: Проверка заголовков
// ═══════════════════════════════════════════
const checkTitles = () => {
  const requiredTitles = ["Our Team", "Preparation", "Countdown"];
  const allTitles = slides.map(s => s.title?.toLowerCase() || "");
  
  return requiredTitles.every(title => 
    allTitles.some(t => t.includes(title.toLowerCase()))
  );
};

// ═══════════════════════════════════════════
// ЗАДАНИЕ 3: Проверка исправления ошибок
// ═══════════════════════════════════════════
const checkDesignFixes = () => {
  // Это сложнее проверить автоматически
  // Варианты:
  
  // A) Проверить что файл изменён (размер/хеш отличается от шаблона)
  const isModified = uploadedFile.hash !== templateFile.hash;
  
  // B) Проверить конкретные свойства (если возможно)
  // - Позиция картинки изменилась
  // - Цвет текста изменился
  // - Размер текста изменился
  
  return isModified;
};

// ═══════════════════════════════════════════
// ИТОГОВАЯ ПРОВЕРКА
// ═══════════════════════════════════════════
const results = {
  task1_order: checkOrder(),
  task2_titles: checkTitles(),
  task3_design: checkDesignFixes()
};

if (results.task1_order && results.task2_titles && results.task3_design) {
  return "success";
} else {
  const errors = [];
  if (!results.task1_order) errors.push("Порядок слайдов неправильный");
  if (!results.task2_titles) errors.push("Не все заголовки добавлены");
  if (!results.task3_design) errors.push("Ошибки дизайна не исправлены");
  return errors.join(". ");
}
