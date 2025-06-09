addLesson({
  level: "beginner2",
  lesson: "lesson21",
  name: "Урок 21",
  structures: [
    { 
      structure: "I/she/he/it was ________.", 
      pattern: ["i", "she", "he", "it", "was"], 
      translations: ["Я/она/он/оно был(а) ______."], 
      examples: ["I was fine. (Я был(а) хорошо.)", "She was at home. (Она была дома.)"], 
      id: "s1", 
      hasName: false 
    },
    { 
      structure: "We/you/they were ______.", 
      pattern: ["we", "you", "they", "were"], 
      translations: ["Мы/вы/они были ______."], 
      examples: ["They were at home. (Они были дома.)", "You were fine. (Вы были хорошо.)"], 
      id: "s2", 
      hasName: false 
    }
  ],
  requiredCorrect: 10, // 10 correct examples per structure
  validateStructure: function(text, structure) {
    console.log('Raw input:', text);
    // Заменяем "she's/he's/it's" на "she was/he was/it was" и нормализуем пробелы
    let processedText = text
      .replace(/she's/gi, 'she was')
      .replace(/he's/gi, 'he was')
      .replace(/it's/gi, 'it was')
      .replace(/\s+/g, ' ');
    // Удаляем пунктуацию и приводим к нижнему регистру
    const cleanedText = processedText.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase().trim();
    console.log('Cleaned text:', cleanedText);

    const words = cleanedText.split(' ').filter(word => word.length > 0);
    console.log('Split words:', words);

    if (words.length < 2) {
      console.log('Слишком короткая фраза');
      return false;
    }

    let wordIndex = 0;

    // Проверяем первое слово (субъект)
    const validSubjects = structure.pattern.slice(0, -1); // Все слова кроме последнего (was/were)
    if (!words[wordIndex] || !validSubjects.includes(words[wordIndex])) {
      console.log('Ожидалось одно из слов:', validSubjects, 'на позиции', wordIndex, ', получено', words[wordIndex]);
      return false;
    }
    wordIndex++;

    // Проверяем второе слово (was или were)
    const expectedVerb = structure.pattern[structure.pattern.length - 1]; // Последний элемент паттерна
    if (wordIndex >= words.length || words[wordIndex] !== expectedVerb) {
      console.log('Ожидалось "', expectedVerb, '" на позиции', wordIndex, ', получено', words[wordIndex]);
      return false;
    }
    wordIndex++;

    // Всё остальное после "was" или "were" принимаем как валидную часть
    if (wordIndex >= words.length) {
      console.log('Нет слов после "', expectedVerb, '"');
      return false;
    }

    console.log('Валидация пройдена для:', text);
    return true;
  }
});
