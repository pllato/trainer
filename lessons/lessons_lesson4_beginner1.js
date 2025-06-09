addLesson({
  level: "beginner1",
  lesson: "lesson4",
  name: "Урок 4",
  requiredCorrect: 4, // 4 correct examples per structure
  structures: [
    {
      id: "where-are-you-from",
      structure: "Where are you from?",
      pattern: ["where", "are", "you", "from"],
      hasName: false,
      examples: ["Where are you from?", "Where are you from today?"]
    },
    {
      id: "i-am-from",
      structure: "I am from _______.",
      pattern: ["i", "am", "from"],
      hasName: true,
      examples: ["I am from Russia.", "I am from the USA."]
    },
    {
      id: "where-is-he-from",
      structure: "Where is he from?",
      pattern: ["where", "is", "he", "from"],
      hasName: false,
      examples: ["Where is he from?", "Where is he from now?"]
    },
    {
      id: "he-is-from",
      structure: "He is from ________.",
      pattern: ["he", "is", "from"],
      hasName: true,
      examples: ["He is from Canada.", "He is from Japan."]
    },
    {
      id: "where-is-she-from",
      structure: "Where is she from?",
      pattern: ["where", "is", "she", "from"],
      hasName: false,
      examples: ["Where is she from?", "Where is she from today?"]
    },
    {
      id: "she-is-from",
      structure: "She is from _______.",
      pattern: ["she", "is", "from"],
      hasName: true,
      examples: ["She is from France.", "She is from Italy."]
    }
  ],
  validateStructure: function(text, structure, spokenHistory) {
    console.log('Validating:', text, 'against', structure.structure);
    const words = text.toLowerCase().replace(/[.,!?]/g, '').split(' ').filter(word => word.length > 0);
    const pattern = structure.pattern;
    let wordIndex = 0;

    // Функция для обработки сокращений
    function normalizeWord(word) {
      if (word === "i'm") return ["i", "am"];
      if (word === "he's") return ["he", "is"];
      if (word === "she's") return ["she", "is"];
      return [word];
    }

    let normalizedWords = [];
    for (let word of words) {
      normalizedWords.push(...normalizeWord(word));
    }

    // Проверяем соответствие шаблону
    if (normalizedWords.length < pattern.length) return false;
    for (let i = 0; i < pattern.length; i++) {
      if (normalizedWords[i] !== pattern[i]) return false;
      wordIndex++;
    }

    // Для вопросов (hasName: false) текст должен точно совпадать с шаблоном
    if (!structure.hasName) {
      return wordIndex === normalizedWords.length; // Точное совпадение длины
    }

    // Для ответов (hasName: true) после шаблона должно быть хотя бы одно слово
    if (structure.hasName && spokenHistory && spokenHistory.includes(text.toLowerCase())) {
      return false; // Пропускаем дубликаты
    }
    return wordIndex < normalizedWords.length; // Проверяем, что есть имя после шаблона
  }
});
