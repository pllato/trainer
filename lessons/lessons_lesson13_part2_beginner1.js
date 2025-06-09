addLesson({
  level: "beginner1",
  lesson: "lesson13_part2",
  name: "Урок 13 Часть 2",
  structures: [
    { 
      structure: "I do not ____.", 
      pattern: ["i", "do", "not"], 
      translations: ["Я не ______."], 
      examples: [
        "I do not like tennis. (Я не люблю теннис.)"
      ], 
      id: "i-do-not-verb", 
      hasVerb: true,
      hasName: false // Добавляем флаг
    },
    { 
      structure: "You do not ____.", 
      pattern: ["you", "do", "not"], 
      translations: ["Ты не ______."], 
      examples: [
        "You do not speak French. (Ты не говоришь по-французски.)"
      ], 
      id: "you-do-not-verb", 
      hasVerb: true,
      hasName: false // Добавляем флаг
    },
    { 
      structure: "We do not ____.", 
      pattern: ["we", "do", "not"], 
      translations: ["Мы не ______."], 
      examples: [
        "We do not play basketball. (Мы не играем в баскетбол.)"
      ], 
      id: "we-do-not-verb", 
      hasVerb: true,
      hasName: false // Добавляем флаг
    },
    { 
      structure: "They do not ____.", 
      pattern: ["they", "do", "not"], 
      translations: ["Они не ______."], 
      examples: [
        "They do not read books. (Они не читают книги.)"
      ], 
      id: "they-do-not-verb", 
      hasVerb: true,
      hasName: false // Добавляем флаг
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

    // Проверяем местоимение и "do not"
    for (let part of pattern) {
      if (!words[wordIndex] || words[wordIndex] !== part) {
        console.log('Pattern mismatch:', words[wordIndex], '!==', part, 'at index', wordIndex);
        return false;
      }
      wordIndex++;
    }

    // Проверяем наличие слов после "do not"
    if (wordIndex >= words.length) {
      console.log('No words after "do not"');
      return false;
    }

    // Проверяем первое слово после "do not" (должно быть глаголом)
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
