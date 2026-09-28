const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, ExternalHyperlink,
  HeadingLevel, BorderStyle, WidthType, ShadingType, VerticalAlign,
  PageBreak
} = require("docx");

// Colors
const ACCENT = "1a5276";
const HEADER_BG = "d6e4f0";
const ROW_ALT = "f4f8fb";
const LINK_COLOR = "1155cc";
const WARNING_BG = "fff8e1";
const MUTED = "555555";
const BORDER_COLOR = "b0b0b0";

const border = { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

// Page: A4
const PAGE_W = 11906;
const MARGIN = 1134; // ~2cm
const CONTENT_W = PAGE_W - MARGIN * 2; // 9638

// Column widths for 3-col table
const COL_TIME = 1100;
const COL_STAGE = 2200;
const COL_REC = CONTENT_W - COL_TIME - COL_STAGE; // ~6338

function bold(text, opts = {}) {
  return new TextRun({ text, bold: true, font: "Arial", size: 21, ...opts });
}

function normal(text, opts = {}) {
  return new TextRun({ text, font: "Arial", size: 21, ...opts });
}

function italic(text, opts = {}) {
  return new TextRun({ text, italics: true, font: "Arial", size: 21, ...opts });
}

function link(text, url) {
  return new ExternalHyperlink({
    children: [new TextRun({ text, font: "Arial", size: 21, color: LINK_COLOR, underline: { type: "single" } })],
    link: url
  });
}

function numberedParagraph(ref, level, children, spacingAfter = 40) {
  return new Paragraph({
    numbering: { reference: ref, level },
    spacing: { after: spacingAfter },
    children
  });
}

function bulletParagraph(ref, level, children, spacingAfter = 40) {
  return new Paragraph({
    numbering: { reference: ref, level },
    spacing: { after: spacingAfter },
    children
  });
}

function sectionHeading(text) {
  return new Paragraph({
    spacing: { before: 240, after: 120 },
    children: [bold(text, { size: 22, color: ACCENT })]
  });
}

function warningParagraph(children) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    shading: { fill: WARNING_BG, type: ShadingType.CLEAR },
    border: { left: { style: BorderStyle.SINGLE, size: 6, color: "f9a825", space: 4 } },
    indent: { left: 100 },
    children
  });
}

// Header cell
function headerCell(text, width) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: HEADER_BG, type: ShadingType.CLEAR },
    margins: cellMargins,
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ children: [bold(text, { size: 22 })] })]
  });
}

// Build table rows for each stage
function stageRow(time, icon, stage, contentParagraphs, isAlt = false) {
  const bgFill = isAlt ? ROW_ALT : "FFFFFF";
  return new TableRow({
    children: [
      new TableCell({
        borders,
        width: { size: COL_TIME, type: WidthType.DXA },
        shading: { fill: bgFill, type: ShadingType.CLEAR },
        margins: cellMargins,
        verticalAlign: VerticalAlign.TOP,
        children: [
          new Paragraph({ alignment: AlignmentType.CENTER, children: [normal(icon, { size: 28 })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40 }, children: [bold(time, { size: 20 })] })
        ]
      }),
      new TableCell({
        borders,
        width: { size: COL_STAGE, type: WidthType.DXA },
        shading: { fill: bgFill, type: ShadingType.CLEAR },
        margins: cellMargins,
        verticalAlign: VerticalAlign.TOP,
        children: [new Paragraph({ children: [bold(stage, { size: 20 })] })]
      }),
      new TableCell({
        borders,
        width: { size: COL_REC, type: WidthType.DXA },
        shading: { fill: bgFill, type: ShadingType.CLEAR },
        margins: cellMargins,
        verticalAlign: VerticalAlign.TOP,
        children: contentParagraphs
      })
    ]
  });
}

// ───── Content for each stage ─────

const stage1 = [
  numberedParagraph("numbers", 0, [normal("Поприветствуйте учеников.")]),
  numberedParagraph("numbers", 0, [normal("Кратко повторите материал прошлых уроков.")])
];

const stage2 = [
  numberedParagraph("nums2", 0, [normal("Проведите этап в зоне без компьютеров.")]),
  numberedParagraph("nums2", 0, [normal("Обсудите с детьми, как интересно представить подсказки и задание на поиск предметов в квесте.")]),
  numberedParagraph("nums2", 0, [normal("Расскажите, что с помощью диалогов можно: сделать сюжет игры более интересным, получить подсказки или новый предмет, определить характер персонажа, организовать работу магазина.")]),
  numberedParagraph("nums2", 0, [normal("Предложите ребятам создать диалоговое дерево на платформе.")]),
  numberedParagraph("nums2", 0, [normal("Определите задачи урока.")])
];

const stage3 = [
  numberedParagraph("nums3", 0, [normal("Организуйте фронтальную работу за компьютерами.")]),
  numberedParagraph("nums3", 0, [normal("Предложите ребятам добавить персонажа с помощью Toolbox. Прикрепите к голове персонажа объект "), bold("Dialog"), normal(".")]),
  numberedParagraph("nums3", 0, [normal("Добавьте начальную фразу \u00ABПривет, игрок!\u00BB с помощью свойства InitialPrompt, конечную фразу \u00ABПока\u00BB (свойство GoodbyeDiaLog).")]),
  numberedParagraph("nums3", 0, [normal("Обратите внимание ребят на свойство Tone, с помощью которого можно задать отношение персонажа к игроку.")]),
  numberedParagraph("nums3", 0, [normal("Объект "), bold("Dialog"), normal(" отображает начальную фразу. Чтобы добавить выбор ответов, необходимо добавить "), bold("DialogChoice"), normal(". Предложите добавить несколько объектов DialogChoice для создания диалога с вариантами ответов.")]),
  numberedParagraph("nums3", 0, [normal("Организуйте выполнение задания "), link("Добавление диалогов", "https://lms.algorithmics.asia/task-preview/107018?track=1&lesson=45710&position=1"), normal(" на платформе.")]),
  warningParagraph([bold("\u26A0\uFE0F Важно! ", { size: 20 }), normal("После обновлений в феврале 2021 года окна с диалогами не всегда отображаются в Roblox Studio при запуске игры через инструмент Play. Если диалоги не отображаются, необходимо запустить игру через локальный сервер \u2014 инструмент ", { size: 20 }), bold("Start", { size: 20 }), normal(". Созданные диалоги полноценно функционируют, если игру опубликовать на Roblox.com и запустить через Roblox Player.", { size: 20 })])
];

const stage4 = [
  numberedParagraph("nums4", 0, [normal("Организуйте выполнение заданий на платформе.")])
];

const stage5 = [
  numberedParagraph("nums5", 0, [normal("Помогите ученикам восстановить концентрацию.")]),
  numberedParagraph("nums5", 0, [normal("Отвлеките учеников от компьютеров. Цель перерыва \u2014 переключить внимание и размяться.")]),
  numberedParagraph("nums5", 0, [normal("Организуйте одну из "), link("предложенных активностей", "https://docs.google.com/document/d/1KhGx4nh5-LtX5FFH99dKRokJEoSYfJT0yEACsaDmpio/edit?usp=sharing"), normal(".")])
];

const stage6 = [
  numberedParagraph("nums6", 0, [normal("Следуйте слайдам презентации. Объясните, как можно работать с нейросетями.")]),
  numberedParagraph("nums6", 0, [normal("Особое внимание уделите правилам создания промптов.")]),
  numberedParagraph("nums6", 0, [normal("Объясните ученикам, что ChatGPT \u2014 это инструмент, который может ошибаться, и его ответы не всегда являются абсолютно точными. Важно сохранять критическое мышление и проверять полученную информацию.")]),
  numberedParagraph("nums6", 0, [normal("Напомните, что вводить в систему личные данные, пароли или конфиденциальную информацию строго запрещено.")]),
  numberedParagraph("nums6", 0, [normal("Откройте "), link("ChatGPT", "https://chatgpt.com/"), normal(". Продемонстрируйте разницу ответов при правильном и неправильном запросах.")]),
  numberedParagraph("nums6", 0, [normal("Расскажите, что чем больше пользуешься нейросетями, тем точнее становятся результаты. Объясните, зачем использовать нейросети.")])
];

const stage7 = [
  numberedParagraph("nums7", 0, [normal("Организуйте работу на платформе.")]),
  numberedParagraph("nums7", 0, [normal("Дети должны составить диалоги для своих персонажей и реализовать их в своём проекте.")])
];

const stage8 = [
  numberedParagraph("nums8", 0, [normal("Обсудите с учениками, получилось ли у них выполнить задания.")]),
  numberedParagraph("nums8", 0, [normal("Позвольте детям поделиться впечатлениями.")]),
  numberedParagraph("nums8", 0, [normal("Подведите итоги: обсудите, что было пройдено на уроке.")]),
  new Paragraph({
    spacing: { before: 80 },
    children: [italic("\u00ABНаше занятие подходит к концу. Давайте подведём итоги нашей работы. Спасибо за ваши ответы! Мне очень приятно, что вам сегодня было интересно.\u00BB", { color: MUTED, size: 20 })]
  })
];

// Build the numbering configs - each stage gets its own so numbering restarts
function makeNumbering() {
  const refs = ["numbers", "nums2", "nums3", "nums4", "nums5", "nums6", "nums7", "nums8", "bullets", "prepBullets", "prepBullets2"];
  const config = refs.map(ref => {
    if (ref === "bullets" || ref === "prepBullets" || ref === "prepBullets2") {
      return {
        reference: ref,
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      };
    }
    return {
      reference: ref,
      levels: [{
        level: 0,
        format: LevelFormat.DECIMAL,
        text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 460, hanging: 360 } } }
      }]
    };
  });
  return { config };
}

const doc = new Document({
  numbering: makeNumbering(),
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: 21 }
      }
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: ACCENT },
        paragraph: { spacing: { before: 120, after: 200 }, outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: ACCENT, space: 4 } }
        }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: ACCENT },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 }
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN }
      }
    },
    children: [
      // ─── Title ───
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "Добавление чат-ботов в игру", font: "Arial" })]
      }),

      // ─── Links ───
      sectionHeading("\uD83D\uDCBE ССЫЛКИ И РЕКВИЗИТ:"),
      bulletParagraph("bullets", 0, [link("Презентация", "https://docs.google.com/presentation/d/1CPfLtAFpfmiEJwj1k25xfwECxTFpTu08dI3JqZtc-Nk/edit?usp=sharing")]),
      bulletParagraph("bullets", 0, [link("Эталонное решение", "https://drive.google.com/file/d/1C9qgfnHtbRz9GOAGlwPPAI-HRS-tjaeZ/view?usp=sharing")]),
      bulletParagraph("bullets", 0, [link("Эталонное решение бонусных задач", "https://drive.google.com/file/d/1CueAU04PcMvw7V1fcTwglwsHVcP90iPk/view?usp=sharing")]),

      // ─── Goal ───
      sectionHeading("\uD83C\uDFAF Цели занятия:"),
      new Paragraph({
        spacing: { after: 120 },
        children: [normal("Познакомиться с принципами создания диалогов в игровом мире и создать собственный.")]
      }),

      // ─── Story ───
      sectionHeading("\uD83D\uDE80 СЮЖЕТНАЯ ЛИНИЯ:"),
      new Paragraph({
        spacing: { after: 120 },
        children: [normal("Команда разработчиков хочет добавить больше действующих персонажей в свои игры. Они обсуждают, кто такие NPC и как они действуют. Сити добавляет, что NPC одни из важнейших составляющих при разработке игр. Они передают историю игры, населяют и наполняют её мир.")]
      }),

      // ─── Prep day before ───
      sectionHeading("\u23E9 ЗА ДЕНЬ ДО УРОКА:"),
      bulletParagraph("prepBullets", 0, [normal("посмотрите предложенные программы и попробуйте создать самостоятельно аналогичные;")]),
      bulletParagraph("prepBullets", 0, [normal("изучите рекомендации и презентацию;")]),
      bulletParagraph("prepBullets", 0, [normal("выполните задания, указанные в презентации;")]),
      bulletParagraph("prepBullets", 0, [normal("продумайте проведение разминки: разберите предложенную или выберите из "), link("списка", "https://docs.google.com/document/d/1DmVXQCCUGVDQoNFjX2j6FXygs3wQ9ZwZ4Dx1cevii4c/edit?usp=sharing"), normal(".")]),

      // ─── Prep 30 min ───
      sectionHeading("\uD83D\uDD16 ЗА 30 МИНУТ ДО УРОКА:"),
      bulletParagraph("prepBullets2", 0, [normal("откройте презентацию, задание на платформе;")]),
      bulletParagraph("prepBullets2", 0, [normal("откройте Roblox Studio на каждом компьютере, убедитесь, что он запускается и обновлён;")]),
      bulletParagraph("prepBullets2", 0, [normal("проверьте работоспособность ноутбуков и проектора, запустите платформу "), link("learn.algoritmics.asia", "http://learn.algorithmics.asia/"), normal(" на компьютерах учеников;")]),
      bulletParagraph("prepBullets2", 0, [normal("подготовьте пространство для комфортной работы вне компьютеров;")]),
      bulletParagraph("prepBullets2", 0, [normal("подготовьте доску или ватман для совместного планирования;")]),
      bulletParagraph("prepBullets2", 0, [normal("запустите сайт "), link("ChatGPT", "https://chatgpt.com/"), normal(". Проверьте, какие ответы он выдаёт на ваши запросы.")]),

      // ─── Table heading ───
      new Paragraph({ spacing: { before: 300, after: 160 }, children: [bold("РЕКОМЕНДУЕМАЯ СТРУКТУРА УРОКА", { size: 24, color: ACCENT })] }),

      // ─── Main table ───
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA },
        columnWidths: [COL_TIME, COL_STAGE, COL_REC],
        rows: [
          // Header
          new TableRow({
            tableHeader: true,
            children: [
              headerCell("Время", COL_TIME),
              headerCell("Этап", COL_STAGE),
              headerCell("Рекомендации по проведению этапа", COL_REC)
            ]
          }),
          stageRow("5 мин", "\uD83D\uDDE3\uFE0F", "Повторение", stage1, false),
          stageRow("5 мин", "\uD83D\uDDE3\uFE0F", "Обсуждение: \u00ABСоздание диалогов\u00BB", stage2, true),
          stageRow("22 мин", "\uD83D\uDCBB", "Новая тема: \u00ABДобавление диалогов\u00BB", stage3, false),
          stageRow("8 мин", "\uD83D\uDCBB", "Задание на платформе", stage4, true),
          stageRow("10 мин", "\u2615", "Перерыв", stage5, false),
          stageRow("15 мин", "\uD83D\uDCBB", "Создание диалогов с нейросетями", stage6, true),
          stageRow("22 мин", "\uD83D\uDCBB", "Задание на платформе: \u00ABNPC общается с игроком\u00BB", stage7, false),
          stageRow("3 мин", "\uD83D\uDDE3\uFE0F", "Завершение урока", stage8, true)
        ]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/claude/m3u2_updated.docx", buffer);
  console.log("Document created successfully!");
});
