addLesson({
  level: "beginner1",
  lesson: "lesson14_part1",
  name: "Урок 14 Часть 1",
  structures: [
    { 
      structure: "He _____s ______", 
      pattern: ["he"], 
      translations: ["Он ______ ______."], 
      examples: [
        "He likes cookies. (Он любит печенье.)"
      ], 
      id: "he-verbs-object", 
      hasVerb: true,
      hasName: false
    },
    { 
      structure: "She ____s _____", 
      pattern: ["she"], 
      translations: ["Она ______ _____."], 
      examples: [
        "She swims fast. (Она плавает быстро.)"
      ], 
      id: "she-verbs-object", 
      hasVerb: true,
      hasName: false
    },
    { 
      structure: "It ____s _____", 
      pattern: ["it"], 
      translations: ["Это ______ _____."], 
      examples: [
        "It works well. (Это работает хорошо.)"
      ], 
      id: "it-verbs-object", 
      hasVerb: true,
      hasName: false
    }
  ],
  requiredCorrect: 10,
  validateStructure: function(text, structure) {
    console.log('Raw input:', text);
    // Удаляем пунктуацию и приводим к нижнему регистру
    const cleanedText = text.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase().trim();
    console.log('Cleaned text:', cleanedText);

    const words = cleanedText.split(/\s+/).filter(word => word.length > 0);
    console.log('Split words:', words);

    const pattern = structure.pattern;
    let wordIndex = 0;

    // Проверяем начальные слова структуры (например, "he", "she", "it")
    for (let part of pattern) {
      if (!words[wordIndex] || words[wordIndex] !== part) {
        console.log('Pattern mismatch:', words[wordIndex], '!==', part, 'at index', wordIndex);
        return false;
      }
      wordIndex++;
    }

    // Проверяем наличие слов после местоимения
    if (wordIndex >= words.length) {
      console.log('No words after pronoun');
      return false;
    }

    // Проверяем глагол (должен заканчиваться на -s или -es)
    const verb = words[wordIndex];
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

    // Проверяем, что после глагола есть ещё хотя бы одно слово
    if (wordIndex + 1 >= words.length) {
      console.log('No object/adverb after verb');
      return false;
    }

    // Проверяем контекст: отклоняем неподходящие дополнения
    const invalidWords = ['tomorrow', 'yesterday', 'will', 'would', 'am', 'is', 'are', 'was', 'were'];
    const remainingWords = words.slice(wordIndex + 1);
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