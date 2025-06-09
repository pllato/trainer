addLesson({
  level: "beginner1",
  lesson: "lesson5",
  name: "Урок 5",
  structures: [
    { structure: "Are you a/an ______?", pattern: ["are", "you"], translation: "Ты ______?", id: "are-you-a-an", hasName: false },
    { structure: "Yes, I am a/an _______.", pattern: ["yes", "i", "am"], translation: "Да, я _______.", id: "yes-i-am-a-an", hasName: true },
    { structure: "No, I am not a/an ________.", pattern: ["no", "i", "am", "not"], translation: "Нет, я не _______.", id: "no-i-am-not-a-an", hasName: true }
  ],
  requiredCorrect: 6, // 6 correct examples per structure
  validateStructure: function(text, structure) {
    const words = text.split(' ').filter(word => word.length > 0);
    const pattern = structure.pattern;
    let wordIndex = 0;

    // Функция для обработки сокращений
    function normalizeWord(word) {
      word = word.toLowerCase();
      if (word === "i'm") return ["i", "am"];
      if (word === "you're") return ["you", "are"];
      return [word];
    }

    // Проверяем, правильно ли выбрано "a" или "an" в зависимости от следующего слова
    function isCorrectArticle(article, nextWord) {
      if (!nextWord) return false;
      const vowels = ['a', 'e', 'i', 'o', 'u'];
      const startsWithVowel = vowels.includes(nextWord[0].toLowerCase());
      return (article === "a" && !startsWithVowel) || (article === "an" && startsWithVowel);
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

    // Для всех структур проверяем наличие "a" или "an"
    if (!normalizedWords[wordIndex] || !["a", "an"].includes(normalizedWords[wordIndex])) return false;
    const article = normalizedWords[wordIndex];
    wordIndex++;

    // Для вопросов (hasName: false) после "a/an" должно быть ровно одно слово (профессия)
    if (!structure.hasName) {
      if (!normalizedWords[wordIndex]) return false; // Должно быть слово для профессии
      if (!isCorrectArticle(article, normalizedWords[wordIndex])) return false; // Проверяем корректность "a/an"
      wordIndex++;
      return wordIndex === normalizedWords.length; // Длина текста должна равняться длине шаблона + статья + профессия
    }

    // Для ответов (hasName: true) после "a/an" должно быть хотя бы одно слово
    if (!normalizedWords[wordIndex]) return false; // Должно быть хотя бы одно слово для профессии
    if (!isCorrectArticle(article, normalizedWords[wordIndex])) return false; // Проверяем корректность "a/an"
    return true; // Возвращаем true, если есть хотя бы одно слово после "a/an"
  }
});