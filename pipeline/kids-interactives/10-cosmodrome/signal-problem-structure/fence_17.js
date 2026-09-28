const html = editor.getHTML();

const checks = {
  // Заголовок жирный
  hasBoldTitle: html.includes("<strong>COMPUTER RULES</strong>") || 
                html.includes("<b>COMPUTER RULES</b>"),
  
  // Есть маркированный список
  hasBulletList: html.includes("<ul>") && html.includes("<li>"),
  
  // Important курсивом
  hasItalicImportant: html.includes("<em>Important</em>") || 
                       html.includes("<i>Important</i>")
};

if (checks.hasBoldTitle && checks.hasBulletList && checks.hasItalicImportant) {
  return "success";
} else {
  const hints = [];
  if (!checks.hasBoldTitle) hints.push("Сделай заголовок жирным");
  if (!checks.hasBulletList) hints.push("Добавь маркированный список");
  if (!checks.hasItalicImportant) hints.push("Сделай 'Important' курсивом");
  return hints.join(". ");
}
