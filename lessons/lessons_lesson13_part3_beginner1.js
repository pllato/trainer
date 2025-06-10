addLesson({
  level: "beginner1",
  lesson: "lesson13_part3",
  name: "Урок 13 Часть 3",
  structures: [
    { 
      structure: "Do you ___?", 
      pattern: ["do", "you"], 
      translations: ["Ты ______?"], 
      examples: [
        "Do you play football? (Ты играешь в футбол?)"
      ], 
      id: "do-you-verb", 
      hasVerb: true,
      hasName: false
    },
    { 
      structure: "Yes, I ____", 
      pattern: ["yes", "i"], 
      translations: ["Да, я ______."], 
      examples: [
        "Yes, I play. (Да, я играю.)"
      ], 
      id: "yes-i-verb", 
      hasVerb: true,
      hasName: false
    },
    { 
      structure: "No, I do not ______", 
      pattern: ["no", "i", "do", "not"], 
      translations: ["Нет, я не ______."], 
      examples: [
        "No, I do not play. (Нет, я не играю.)"
      ], 
      id: "no-i-do-not-verb", 
      hasVerb: true,
      hasName: false
    },
    { 
      structure: "Do we ____?", 
      pattern: ["do", "we"], 
      translations: ["Мы ______?"], 
      examples: [
        "Do we study English? (Мы изучаем английский?)"
      ], 
      id: "do-we-verb", 
      hasVerb: true,
      hasName: false
    },
    { 
      structure: "Yes, you ____.", 
      pattern: ["yes", "you"], 
      translations: ["Да, вы ______."], 
      examples: [
        "Yes, you study. (Да, вы изучаете.)"
      ], 
      id: "yes-you-verb", 
      hasVerb: true,
      hasName: false
    },
    { 
      structure: "No, you do not ____.", 
      pattern: ["no", "you", "do", "not"], 
      translations: ["Нет, вы не ______."], 
      examples: [
        "No, you do not study. (Нет, вы не изучаете.)"
      ], 
      id: "no-you-do-not-verb", 
      hasVerb: true,
      hasName: false
    },
    { 
      structure: "Do they _____?", 
      pattern: ["do", "they"], 
      translations: ["Они ______?"], 
      examples: [
        "Do they read books? (Они читают книги?)"
      ], 
      id: "do-they-verb", 
      hasVerb: true,
      hasName: false
    },
    { 
      structure: "Yes, they _____.", 
      pattern: ["yes", "they"], 
      translations: ["Да, они ______."], 
      examples: [
        "Yes, they read. (Да, они читают.)"
      ], 
      id: "yes-they-verb", 
      hasVerb: true,
      hasName: false
    },
    { 
      structure: "No, they do not ____.", 
      pattern: ["no", "they", "do", "not"], 
      translations: ["Нет, они не ______."], 
      examples: [
        "No, they do not read. (Нет, они не читают.)"
      ], 
      id: "no-they-do-not-verb", 
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

    // Проверяем начальные слова структуры (например, "do you", "yes i", "no i do not")
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