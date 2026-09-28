async function checkPresentation(uploadedFile) {
  const pptx = await parsePptx(uploadedFile);
  const slides = pptx.slides;
  
  const results = {
    task1_order: false,
    task2_titles: false,
    task3_design: false
  };
  
  // ═══════════════════════════════════════════
  // ЗАДАНИЕ 1: Проверка порядка слайдов
  // ═══════════════════════════════════════════
  const slideIdentifiers = slides.map(s => getSlideIdentifier(s));
  
  // Проверяем первый и последний слайд
  const firstSlideCorrect = slideIdentifiers[0].includes("Mission") || 
                            slideIdentifiers[0].includes("title");
  const lastSlideCorrect = slideIdentifiers[4].includes("Launch") || 
                           slideIdentifiers[4].includes("rocket");
  
  results.task1_order = firstSlideCorrect && lastSlideCorrect;
  
  // ═══════════════════════════════════════════
  // ЗАДАНИЕ 2: Проверка заголовков
  // ═══════════════════════════════════════════
  const titles = slides.map(s => (s.title || "").toLowerCase());
  
  const hasOurTeam = titles.some(t => t.includes("team") || t.includes("команда"));
  const hasPreparation = titles.some(t => t.includes("preparation") || t.includes("подготовка"));
  const hasCountdown = titles.some(t => t.includes("countdown") || t.includes("отсчёт"));
  
  results.task2_titles = hasOurTeam && hasPreparation && hasCountdown;
  
  // ═══════════════════════════════════════════
  // ЗАДАНИЕ 3: Проверка что файл изменён
  // ═══════════════════════════════════════════
  // Простая проверка — файл отличается от шаблона
  results.task3_design = uploadedFile.size !== templateFile.size;
  
  // ═══════════════════════════════════════════
  // ИТОГОВЫЙ РЕЗУЛЬТАТ
  // ═══════════════════════════════════════════
  if (results.task1_order && results.task2_titles && results.task3_design) {
    return { success: true };
  } else {
    const errors = [];
    if (!results.task1_order) errors.push("Порядок слайдов неправильный");
    if (!results.task2_titles) errors.push("Добавь заголовки на слайды 2, 3 и 4");
    if (!results.task3_design) errors.push("Исправь ошибки дизайна на слайдах");
    return { success: false, message: errors.join(". ") };
  }
}
