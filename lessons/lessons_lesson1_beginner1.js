addLesson({
  level: "beginner1",
  lesson: "lesson1",
  name: "Урок 1",
  structures: [
    { structure: "I am [name].", pattern: ["i", "am", "name"], translation: "Я [имя].", id: "s1", hasName: true },
    { structure: "You are [name].", pattern: ["you", "are", "name"], translation: "Ты [имя].", id: "s2", hasName: true },
    { structure: "What is your name?", pattern: ["what", "is", "your", "name"], translation: "Как тебя зовут?", id: "s3", hasName: false },
    { structure: "My name is [name].", pattern: ["my", "name", "is", "name"], translation: "Моё имя [имя].", id: "s4", hasName: true },
    { structure: "This is [name].", pattern: ["this", "is", "name"], translation: "Это [имя].", id: "s5", hasName: true }
  ],
  requiredCorrect: 2, // 2 correct examples per structure
  validateStructure: function(text, structure) {
    console.log('Raw input:', text);
    // Заменяем "i'm" на "i am" и нормализуем пробелы
    let processedText = text.replace(/i'm/gi, 'i am').replace(/\s+/g, ' ');
    // Удаляем пунктуацию и приводим к нижнему регистру
    const cleanedText = processedText.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase().trim();
    console.log('Cleaned text:', cleanedText);

    const words = cleanedText.split(' ').filter(word => word.length > 0);
    console.log('Split words:', words);

    if (words.length === 0) {
      console.log('Пустая строка');
      return false;
    }

    const pattern = structure.pattern;
    let wordIndex = 0;

    for (let part of pattern) {
      if (part === 'name') {
        if (!words[wordIndex]) {
          console.log('Ожидалось имя на позиции', wordIndex, ', но слово отсутствует');
          return false; // Должно быть слово для имени
        }
        wordIndex++;
      } else {
        if (!words[wordIndex] || words[wordIndex] !== part) {
          console.log('Ожидалось слово "', part, '" на позиции', wordIndex, ', получено', words[wordIndex] || 'ничего');
          return false;
        }
        wordIndex++;
      }
    }

    // Проверяем, что нет лишних слов
    if (wordIndex !== words.length) {
      console.log('Лишние слова:', words.slice(wordIndex));
      return false;
    }

    console.log('Валидация пройдена для:', text);
    return true;
  }
});
