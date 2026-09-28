function checkComplexBoard(uploadedImage) {
  // 1. Проверить 6 элементов по цветам
  const colorChecks = checkColorPoints(uploadedImage, checkPoints6);
  
  // 2. Проверить центральную область — не белая
  const centerArea = { x1: 150, y1: 100, x2: 250, y2: 200 };
  const centerPixels = getPixelsInArea(uploadedImage, centerArea);
  
  // Проверяем что хотя бы 10% пикселей не белые
  const nonWhitePixels = centerPixels.filter(p => 
    p.r < 250 || p.g < 250 || p.b < 250
  );
  const isDrawn = nonWhitePixels.length > (centerPixels.length * 0.1);
  
  if (colorChecks.allCorrect && isDrawn) {
    return { success: true };
  } else if (!colorChecks.allCorrect) {
    return { 
      success: false, 
      message: `Проверь элементы: ${colorChecks.wrongElements.join(", ")}` 
    };
  } else {
    return { 
      success: false, 
      message: "Ты забыл дорисовать элемент в центре платы!" 
    };
  }
}
