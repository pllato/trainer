addLesson({
  level: "beginner1",
  lesson: "lesson7",
  name: "Урок 7",
  structures: [
    { structure: "Is he _____?", pattern: ["is", "he"], translations: ["Он _____?", "Ему _____?"], id: "is-he", hasName: false },
    { structure: "Is she _____?", pattern: ["is", "she"], translations: ["Она _____?", "Ей _____?"], id: "is-she", hasName: false },
    { structure: "Is it _____?", pattern: ["is", "it"], translations: ["Это _____?", "Ему/ей _____?"], id: "is-it", hasName: false },
    { structure: "Yes, he is _____.", pattern: ["yes", "he", "is"], translations: ["Да, он _____.", "Да, ему _____."], id: "yes-he-is", hasName: true },
    { structure: "Yes, she is _____.", pattern: ["yes", "she", "is"], translations: ["Да, она _____.", "Да, ей _____."], id: "yes-she-is", hasName: true },
    { structure: "Yes, it is _____.", pattern: ["yes", "it", "is"], translations: ["Да, это _____.", "Да, ему/ей _____."], id: "yes-it-is", hasName: true },
    { structure: "No, he is not _____.", pattern: ["no", "he", "is", "not"], translations: ["Нет, он не _____.", "Нет, ему не _____."], id: "no-he-is-not", hasName: true },
    { structure: "No, she is not _____.", pattern: ["no", "she", "is", "not"], translations: ["Нет, она не _____.", "Нет, ей не _____."], id: "no-she-is-not", hasName: true },
    { structure: "No, it is not _____.", pattern: ["no", "it", "is", "not"], translations: ["Нет, это не _____.", "Нет, ему/ей не _____."], id: "no-it-is-not", hasName: true }
  ],
  requiredCorrect: 6, // 6 correct examples per structure
  validateStructure: function(text, structure) {
    const words = text.split(' ').filter(word => word.length > 0);
    const pattern = structure.pattern;
    let wordIndex = 0;

    // Функция для обработки сокращений
    function normalizeWord(word) {
      word = word.toLowerCase();
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

    // Проверяем, что начало текста соответствует шаблону
    for (let part of pattern) {
      if (!normalizedWords[wordIndex] || normalizedWords[wordIndex] !== part) return false;
      wordIndex++;
    }

    // Для вопросов (hasName: false) после шаблона должно быть хотя бы одно слово
    if (!structure.hasName) {
      return wordIndex < normalizedWords.length; // Должно быть хотя бы одно слово после шаблона
    }

    // Для ответов (hasName: true) после шаблона должно быть хотя бы одно слово
    return wordIndex < normalizedWords.length; // Проверяем, что есть хотя бы одно слово после шаблона
  }
});