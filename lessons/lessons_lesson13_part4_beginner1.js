addLesson({
  level: "beginner1",
  lesson: "lesson13_part4",
  name: "Урок 13 Часть 4",
  structures: [
    { 
      structure: "Where do you ____", 
      pattern: ["where", "do", "you"], 
      translations: ["Где ты ______?"], 
      examples: [
        "Where do you live? (Где ты живёшь?)"
      ], 
      id: "where-do-you-verb", 
      hasVerb: true,
      hasName: false
    },
    { 
      structure: "What do you ____", 
      pattern: ["what", "do", "you"], 
      translations: ["Что ты ______?"], 
      examples: [
        "What do you like? (Что тебе нравится?)"
      ], 
      id: "what-do-you-verb", 
      hasVerb: true,
      hasName: false
    },
    { 
      structure: "When do you _____", 
      pattern: ["when", "do", "you"], 
      translations: ["Когда ты ______?"], 
      examples: [
        "When do you study? (Когда ты учишься?)"
      ], 
      id: "when-do-you-verb", 
      hasVerb: true,
      hasName: false
    },
    { 
      structure: "I ____ ______", 
      pattern: ["i"], 
      translations: ["Я ______ ______."], 
      examples: [
        "I live here. (Я живу здесь.)"
      ], 
      id: "i-verb-object", 
      hasVerb: true,
      hasName: false
    }
  ],
  requiredCorrect: 10,
  validateStructure: function(text, structure) {
    console.log('Raw input:', text);
    // Заменяем "don't" на "do not" для поддержки сокращений
    let processedText = text.replace(/don't/g, 'do not');
    // Удаляем пунктуацию и приводим к нижнему регистру
    const cleanedText = processedText.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase().trim();
    console.log('Cleaned text:', cleanedText);

    const words = cleanedText.split(/\s+/).filter(word => word.length > 0);
    console.log('Split words:', words);

    const pattern = structure.pattern;
    let wordIndex = 0;

    // Проверяем начальные слова структуры (например, "where do you", "i")
    for (let part of pattern) {
      if (!words[wordIndex] || words[wordIndex] !== part) {
        console.log('Pattern mismatch:', words[wordIndex], '!==', part, 'at index', wordIndex);
        return false;
      }
      wordIndex++;
    }

    // Проверяем наличие слов после начального шаблона
    if (wordIndex >= words.length) {
      console.log('No words after pattern');
      return false;
    }

    // Проверяем первое слово после шаблона (должно быть глаголом)
    const verb = words[wordIndex];
    // Исключаем неподходящие формы
    if (verb.endsWith('ed') || verb.endsWith('ing') || verb.endsWith('s') || verb.endsWith('es')) {
      console.log('Invalid verb form:', verb);
      return false;
    }

    // Список исключённых глаголов и модальных глаголов
    const excludedWords = [
      'will', 'should', 'can', 'could', 'would', 'must', 'may', 'might', 'shall', 'ought',
      'am', 'is', 'are', 'was', 'were', 'been', 'being'
    ];
    if (excludedWords.includes(verb)) {
      console.log('Excluded verb:', verb);
      return false;
    }

    // Для структуры "I ____ ______" проверяем, что после глагола есть ещё хотя бы одно слово
    if (structure.id === "i-verb-object") {
      if (wordIndex + 1 >= words.length) {
        console.log('No object after verb for "I ____ ______"');
        return false;
      }
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