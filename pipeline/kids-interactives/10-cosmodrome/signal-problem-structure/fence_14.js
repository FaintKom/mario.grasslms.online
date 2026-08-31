// 1. Проверить 6 элементов по цветам
const colorChecks = checkAllElements(uploadedFile);

// 2. Проверить центральную область — не белая
const centerArea = { x1: 150, y1: 100, x2: 250, y2: 200 };
const centerPixels = getPixelsInArea(uploadedFile, centerArea);
const isNotWhite = centerPixels.some(pixel => {
  return pixel.r < 250 || pixel.g < 250 || pixel.b < 250;
});

if (colorChecks.allCorrect && isNotWhite) {
  return "success";
} else if (!isNotWhite) {
  return "Ты забыл дорисовать элемент в центре платы!";
}
