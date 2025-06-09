addLesson({
  level: "beginner1",
  lesson: "lesson7",
  name: "Урок 7",
  requiredCorrect: 6, // 6 correct examples per structure
  structures: [
    {
      id: "is-he",
      structure: "Is he _____?",
      pattern: ["is", "he"],
      hasName: false,
      examples: ["Is he nice?", "Is he tall?"]
    },
    {
      id: "is-she",
      structure: "Is she _____?",
      pattern: ["is", "she"],
      hasName: false,
      examples: ["Is she kind?", "Is she happy?"]
    },
    {
      id: "is-it",
      structure: "Is it _____?",
      pattern: ["is", "it"],
      hasName: false,
      examples: ["Is it nice?", "Is it cold?"]
    },
    {
      id: "yes-he-is",
      structure: "Yes, he is _____.",
      pattern: ["yes", "he", "is"],
      hasName: true,
      examples: ["Yes, he is nice.", "Yes, he is tall."]
    },
    {
      id: "yes-she-is",
      structure: "Yes, she is _____.",
      pattern: ["yes", "she", "is"],
      hasName: true,
      examples: ["Yes, she is kind.", "Yes, she is happy."]
    },
    {
      id: "yes-it-is",
      structure: "Yes, it is _____.",
      pattern: ["yes", "it", "is"],
      hasName: true,
      examples: ["Yes, it is nice.", "Yes, it is cold."]
    },
    {
      id: "no-he-is-not",
      structure: "No, he is not _____.",
      pattern: ["no", "he", "is", "not"],
      hasName: true,
      examples: ["No, he is not nice.", "No, he is not tall."]
    },
    {
      id: "no-she-is-not",
      structure: "No, she is not _____.",
      pattern: ["no", "she", "is", "not"],
      hasName: true,
      examples: ["No, she is not kind.", "No, she is not happy."]
    },
    {
      id: "no-it-is-not",
      structure: "No, it is not _____.",
      pattern: ["no", "it", "is", "not"],
      hasName: true,
      examples: ["No, it is not nice.", "No, it is not cold."]
    }
  ],
  validateStructure: function(text, structure, spokenHistory) {
    console.log('Validating:', text, 'against', structure.structure);
    const words = text.toLowerCase().replace(/[.,!?]/g, '').split(' ').filter(word => word.length > 0);
    const pattern = structure.pattern;
    let wordIndex = 0;

    // Функция для обработки сокращений
    function normalizeWord(word) {
      if (word === "he's") return ["he", "is"];
      if (word === "she's") return ["she", "is"];
      if (word === "it's") return ["it", "is"];
      if (word === "isn't") return ["is", "not"];
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

    // Для вопросов (hasName: false) после шаблона должно быть хотя бы одно слово
    if (!structure.hasName) {
      return wordIndex < normalizedWords.length; // Должно быть хотя бы одно слово после шаблона
    }

    // Для ответов (hasName: true) после шаблона должно быть хотя бы одно слово
    if (structure.hasName && spokenHistory && spokenHistory.includes(text.toLowerCase())) {
      return false; // Пропускаем дубликаты
    }
    return wordIndex < normalizedWords.length; // Проверяем, что есть хотя бы одно слово после шаблона
  }
});
