function checkFormatting(editorHTML) {
  const checks = {
    hasBoldTitle: /<(strong|b)>.*COMPUTER RULES.*<\/(strong|b)>/i.test(editorHTML),
    hasBulletList: editorHTML.includes("<ul>") && editorHTML.includes("<li>"),
    hasItalicImportant: /<(em|i)>.*Important.*<\/(em|i)>/i.test(editorHTML)
  };
  
  const allCorrect = checks.hasBoldTitle && checks.hasBulletList && checks.hasItalicImportant;
  
  if (allCorrect) {
    return { success: true };
  } else {
    const hints = [];
    if (!checks.hasBoldTitle) hints.push("Сделай заголовок жирным (выдели и нажми B)");
    if (!checks.hasBulletList) hints.push("Оформи три строки как список (кнопка •)");
    if (!checks.hasItalicImportant) hints.push("Сделай слово Important курсивом (выдели и нажми I)");
    return { success: false, message: hints.join(". ") };
  }
}
