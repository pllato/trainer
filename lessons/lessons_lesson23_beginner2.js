addLesson({
  level: "beginner2",
  lesson: "lesson23",
  name: "Урок 23: Когда ты родился?",
  structures: [
    { 
      structure: "When were you born?", 
      pattern: ["when", "were", "you", "born"], 
      translations: ["Когда ты родился?", "Когда ты была рождена?"], 
      examples: ["When were you born? (Когда ты родился?)"], 
      id: "when-were-you-born", 
      hasVerb: false,
      hasName: false
    },
    { 
      structure: "I was born on the _________.", 
      pattern: ["i", "was", "born", "on", "the"], 
      translations: ["Я родился ___ _______.", "Я была рождена ___ _______."], 
      examples: [
        "I was born on the 1st of January, 1990. (Я родился первого января 1990 года.)",
        "I was born on the 15th of May, 2000. (Я родился пятнадцатого мая 2000 года.)"
      ], 
      id: "i-was-born-on-the-date", 
      hasVerb: false,
      hasName: false // Отключена проверка уникальности
    }
  ],
  requiredCorrect: 6,
  validateStructure: function(text, structure) {
    console.log('Raw input:', text);
    // Удаляем пунктуацию (кроме запятых для дат), приводим к нижнему регистру
    let processedText = text.replace(/[^a-zA-Z0-9\s,]/g, '').toLowerCase().trim();
    console.log('Processed text:', processedText);

    const words = processedText.split(/\s+/).filter(word => word.length > 0);
    console.log('Split words:', words);

    const pattern = structure.pattern;
    let wordIndex = 0;

    // Проверяем начальные слова структуры
    for (let part of pattern) {
      if (!words[wordIndex] || words[wordIndex] !== part) {
        console.log('Pattern mismatch:', words[wordIndex], '!==', part, 'at index', wordIndex);
        return false;
      }
      wordIndex++;
    }

    // Валидация для вопроса "When were you born?"
    if (structure.id === "when-were-you-born") {
      // Текст должен точно совпадать с шаблоном
      if (wordIndex !== words.length) {
        console.log('Extra words in question:', words.slice(wordIndex));
        return false;
      }
      console.log('Validation passed for:', text);
      return true;
    }

    // Валидация для ответа "I was born on the _________."
    if (structure.id === "i-was-born-on-the-date") {
      // Проверяем, что после "on the" есть хотя бы слова для даты
      if (wordIndex >= words.length) {
        console.log('No date provided after "on the"');
        return false;
      }

      // Проверяем формат даты
      // Ожидаем: число (1st, 2nd, 3rd, 4th, etc.), "of" (опционально), месяц, год (опционально)
      let datePart = words.slice(wordIndex).join(' ');

      // Список месяцев
      const validMonths = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
      ];

      // Проверяем число (1st, 2nd, 3rd, 4th, ..., 31st)
      const dayRegex = /^(1st|2nd|3rd|[4-9]th|1[0-9]th|2[0-9]th|3[0-1]st|3[0-1]th)$/;
      if (!words[wordIndex] || !dayRegex.test(words[wordIndex])) {
        console.log('Invalid day format:', words[wordIndex]);
        return false;
      }
      wordIndex++;

      // Проверяем наличие "of" (опционально)
      let hasOf = false;
      if (words[wordIndex] === 'of') {
        hasOf = true;
        wordIndex++;
      }

      // Проверяем месяц
      if (!words[wordIndex] || !validMonths.includes(words[wordIndex])) {
        console.log('Invalid month:', words[wordIndex]);
        return false;
      }
      wordIndex++;

      // Проверяем год (опционально, 1900–2025)
      if (wordIndex < words.length) {
        const year = parseInt(words[wordIndex], 10);
        if (isNaN(year) || year < 1900 || year > 2025) {
          console.log('Invalid year:', words[wordIndex]);
          return false;
        }
        wordIndex++;
      }

      // Проверяем, что нет лишних слов
      if (wordIndex < words.length) {
        console.log('Extra words after date:', words.slice(wordIndex));
        return false;
      }

      console.log('Validation passed for:', text);
      return true;
    }

    return false;
  }
});
