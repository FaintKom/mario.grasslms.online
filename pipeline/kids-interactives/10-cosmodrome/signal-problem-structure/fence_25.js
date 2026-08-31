const checkPoints = {
  element1: { x: 50, y: 40, expectedColor: "#FF0000", tolerance: 40 },
  element2: { x: 280, y: 40, expectedColor: "#0000FF", tolerance: 40 },
  element3: { x: 165, y: 120, expectedColor: "#FFFF00", tolerance: 40 },
  element4: { x: 50, y: 200, expectedColor: "#FFA500", tolerance: 40 }
};

function checkImage(uploadedImage) {
  const results = [];
  
  for (const [element, config] of Object.entries(checkPoints)) {
    const pixelColor = getPixelColor(uploadedImage, config.x, config.y);
    const isCorrect = colorDistance(pixelColor, config.expectedColor) <= config.tolerance;
    results.push({ element, isCorrect });
  }
  
  const allCorrect = results.every(r => r.isCorrect);
  const wrongElements = results.filter(r => !r.isCorrect).map(r => r.element);
  
  if (allCorrect) {
    return { success: true };
  } else {
    return { 
      success: false, 
      message: `Проверь элементы: ${wrongElements.join(", ")}` 
    };
  }
}
