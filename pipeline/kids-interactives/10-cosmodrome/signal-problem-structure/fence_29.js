function checkTextErrors(editorContent) {
  const text = editorContent.toLowerCase();
  
  const requiredWords = [
    "file", "folder", "program", "document", 
    "website", "information", "browser"
  ];
  
  const wrongWords = [
    "flie", "floder", "progam", "documnet",
    "websight", "informaton", "browzer"
  ];
  
  const missingCorrect = requiredWords.filter(word => !text.includes(word));
  const stillWrong = wrongWords.filter(word => text.includes(word));
  
  if (missingCorrect.length === 0 && stillWrong.length === 0) {
    return { success: true };
  } else {
    return { 
      success: false, 
      message: `Ещё есть ошибки. Проверь слова: ${stillWrong.join(", ")}` 
    };
  }
}
