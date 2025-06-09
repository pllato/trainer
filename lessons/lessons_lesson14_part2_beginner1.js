addLesson({
  level: "beginner1",
  lesson: "lesson14_part2",
  name: "Урок 14 Часть 2",
  structures: [
    { 
      structure: "Does he/she/it ____?", 
      pattern: ["does"], 
      translations: ["______ ли он/она/оно?"], 
      examples: [
        "Does she play? (Она играет?)"
      ], 
      id: "does-he-she-it-verb", 
      hasVerb: true,
      hasName: false
    },
    { 
      structure: "Yes, he/she/it _____s.", 
      pattern: ["yes"], 
      translations: ["Да, он/она/оно ______."], 
      examples: [
        "Yes, he runs. (Да, он бегает.)"
      ], 
      id: "yes-he-she-it-verbs", 
      hasVerb: true,
      hasName: false
    },
    { 
      structure: "No, he/she/it doesn't ______.", 
      pattern: ["no"], 
      translations: ["Нет, он/она/оно не ______."], 
      examples: [
        "No, it doesn't work. (Нет, это не работает.)"
      ], 
      id: "no-he-she-it-does-not-verb", 
      hasVerb: true,
      hasName: false
    }
  ],
  requiredCorrect: 20,
  validateStructure: function(text, structure) {
    console.log('Raw input:', text);
    // Заменяем "doesn't" на "does not" для поддержки сокращений
    let processedText = text.replace(/doesn't/g, 'does not');
    // Удаляем пунктуацию и приводим к нижнему регистру
    const cleanedText = processedText.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase().trim();
    console.log('Cleaned text:', cleanedText);

    const words = cleanedText.split(/\s+/).filter(word => word.length > 0);
    console.log('Split words:', words);

    const pattern = structure.pattern;
    let wordIndex = 0;

    // Проверяем начальные слова структуры (например, "does", "yes", "no")
    for (let part of pattern) {
      if (!words[wordIndex] || words[wordIndex] !== part) {
        console.log('Pattern mismatch:', words[wordIndex], '!==', part, 'at index', wordIndex);
        return false;
      }
      wordIndex++;
    }

    // Проверяем местоимение (he/she/it) для всех структур
    if (!words[wordIndex] || !['he', 'she', 'it'].includes(words[wordIndex])) {
      console.log('Expected "he", "she", or "it" at index', wordIndex, 'got', words[wordIndex]);
      return false;
    }
    const pronoun = words[wordIndex];
    wordIndex++;

    // Дополнительная проверка в зависимости от структуры
    if (structure.id === "does-he-she-it-verb") {
      // Структура "Does he/she/it ____?"
      if (!words[wordIndex]) {
        console.log('No verb after pronoun');
        return false;
      }
      const verb = words[wordIndex];
      // Проверяем, что глагол в базовой форме (без -s, -es, -ing и т.д.)
      if (verb.endsWith('s') || verb.endsWith('es') || verb.endsWith('ing')) {
        console.log('Invalid verb form (should be base form):', verb);
        return false;
      }
      // Список исключённых глаголов и модальных глаголов
      const excludedWords = [
        'will', 'should', 'can', 'could', 'would', 'must', 'may', 'might', 'shall', 'ought',
        'am', 'is', 'are', 'was', 'were', 'been', 'being', 'has', 'does'
      ];
      if (excludedWords.includes(verb)) {
        console.log('Excluded verb:', verb);
        return false;
      }
      wordIndex++;
    } else if (structure.id === "yes-he-she-it-verbs") {
      // Структура "Yes, he/she/it _____s."
      if (!words[wordIndex]) {
        console.log('No verb after pronoun');
        return false;
      }
      const verb = words[wordIndex];
      // Проверяем, что глагол заканчивается на -s или -es
      if (!verb.endsWith('s') && !verb.endsWith('es')) {
        console.log('Verb does not end with -s or -es:', verb);
        return false;
      }
      // Список исключённых глаголов и модальных глаголов
      const excludedWords = [
        'will', 'should', 'can', 'could', 'would', 'must', 'may', 'might', 'shall', 'ought',
        'am', 'is', 'are', 'was', 'were', 'been', 'being', 'has', 'does'
      ];
      const verbBase = verb.slice(0, verb.endsWith('es') ? -2 : -1); // Убираем -s или -es для проверки базовой формы
      if (excludedWords.includes(verb) || excludedWords.includes(verbBase)) {
        console.log('Excluded verb:', verb);
        return false;
      }
      wordIndex++;
    } else if (structure.id === "no-he-she-it-does-not-verb") {
      // Структура "No, he/she/it doesn't ______."
      if (!words[wordIndex] || words[wordIndex] !== 'does') {
        console.log('Expected "does" at index', wordIndex, 'got', words[wordIndex]);
        return false;
      }
      wordIndex++;
      if (!words[wordIndex] || words[wordIndex] !== 'not') {
        console.log('Expected "not" at index', wordIndex, 'got', words[wordIndex]);
        return false;
      }
      wordIndex++;
      if (!words[wordIndex]) {
        console.log('No verb after "does not"');
        return false;
      }
      const verb = words[wordIndex];
      // Проверяем, что глагол в базовой форме (без -s, -es, -ing и т.д.)
      if (verb.endsWith('s') || verb.endsWith('es') || verb.endsWith('ing')) {
        console.log('Invalid verb form (should be base form):', verb);
        return false;
      }
      // Список исключённых глаголов и модальных глаголов
      const excludedWords = [
        'will', 'should', 'can', 'could', 'would', 'must', 'may', 'might', 'shall', 'ought',
        'am', 'is', 'are', 'was', 'were', 'been', 'being', 'has', 'does'
      ];
      if (excludedWords.includes(verb)) {
        console.log('Excluded verb:', verb);
        return false;
      }
      wordIndex++;
    }

    // Проверяем контекст: отклоняем неподходящие дополнения
    const invalidWords = ['tomorrow', 'yesterday', 'will', 'would', 'am', 'is', 'are', 'was', 'were'];
    const remainingWords = words.slice(wordIndex);
    for (const word of remainingWords) {
      if (invalidWords.includes(word)) {
        console.log('Invalid context word:', word);
        return false;
      }
    }

    console.log('Validation passed for:', text);
    return true;
  }
});
