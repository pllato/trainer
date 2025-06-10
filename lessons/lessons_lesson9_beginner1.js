addLesson({
  level: "beginner1",
  lesson: "lesson9",
  name: "Урок 9",
  structures: [
    { structure: "How old are you?", pattern: ["how", "old", "are", "you"], translations: ["Сколько тебе лет?", "Какой у тебя возраст?"], id: "how-old-are-you", hasName: false },
    { structure: "I am ______ years old.", pattern: ["i", "am"], translations: ["Мне ______ лет.", "Мой возраст ______ лет."], id: "i-am-years-old", hasName: true },
    { structure: "How old is he?", pattern: ["how", "old", "is", "he"], translations: ["Сколько ему лет?", "Какой у него возраст?"], id: "how-old-is-he", hasName: false },
    { structure: "He is _______ years old.", pattern: ["he", "is"], translations: ["Ему _______ лет.", "Его возраст _______ лет."], id: "he-is-years-old", hasName: true },
    { structure: "How old is she?", pattern: ["how", "old", "is", "she"], translations: ["Сколько ей лет?", "Какой у неё возраст?"], id: "how-old-is-she", hasName: false },
    { structure: "She is _______ years old.", pattern: ["she", "is"], translations: ["Ей _______ лет.", "Её возраст _______ лет."], id: "she-is-years-old", hasName: true }
  ],
  requiredCorrect: 10, // 10 correct examples per structure
  validateStructure: function(text, structure) {
    const words = text.split(' ').filter(word => word.length > 0);
    const pattern = structure.pattern;
    let wordIndex = 0;

    // Функция для обработки сокращений
    function normalizeWord(word) {
      word = word.toLowerCase();
      if (word === "i'm") return ["i", "am"];
      if (word === "he's") return ["he", "is"];
      if (word === "she's") return ["she", "is"];
      return [word];
    }

    let normalizedWords = [];
    for (let word of words) {
      normalizedWords.push(...normalizeWord(word));
    }

    // Проверяем, что начало текста соответствует шаблону
    for (let part of pattern) {
      if (!normalizedWords[wordIndex] || normalizedWords[wordIndex] !== part) return false;
      wordIndex++;
    }

    // Для вопросов (hasName: false) текст должен точно совпадать с шаблоном
    if (!structure.hasName) {
      return wordIndex === normalizedWords.length; // Длина текста должна равняться длине шаблона
    }

    // Для ответов (hasName: true) после шаблона должен быть возраст и "years old"
    if (wordIndex >= normalizedWords.length) return false; // Должно быть хотя бы одно слово после шаблона (возраст)
    const lastTwoWords = normalizedWords.slice(-2).join(' ');
    if (lastTwoWords !== "years old") return false; // Фраза должна заканчиваться на "years old"
    return wordIndex < normalizedWords.length - 2; // Должно быть хотя бы одно слово (возраст) перед "years old"
  }
});