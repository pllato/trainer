addLesson({
  level: "beginner1",
  lesson: "lesson13",
  name: "Урок 13 Часть 1",
  structures: [
    { 
      structure: "I ____.", 
      pattern: ["i"], 
      translations: ["Я ______."], 
      examples: [
        "I like to walk. (Я люблю гулять.)",
        "I work. (Я работаю.)",
        "I drink. (Я пью.)"
      ], 
      id: "i-verb", 
      hasVerb: true 
    },
    { 
      structure: "You ____.", 
      pattern: ["you"], 
      translations: ["Ты ______."], 
      examples: [
        "You drink too much. (Ты пьёшь слишком много.)",
        "You study. (Ты учишься.)",
        "You work. (Ты работаешь.)"
      ], 
      id: "you-verb", 
      hasVerb: true 
    },
    { 
      structure: "We ____.", 
      pattern: ["we"], 
      translations: ["Мы ______."], 
      examples: [
        "We play football. (Мы играем в футбол.)",
        "We live here. (Мы живём здесь.)",
        "We drink. (Мы пьём.)"
      ], 
      id: "we-verb", 
      hasVerb: true 
    },
    { 
      structure: "They ____.", 
      pattern: ["they"], 
      translations: ["Они ______."], 
      examples: [
        "They watch TV. (Они смотрят телевизор.)",
        "They run fast. (Они бегают быстро.)",
        "They do not drink. (Они не пьют.)"
      ], 
      id: "they-verb", 
      hasVerb: true 
    }
  ],
  requiredCorrect: 10,
  validateStructure: function(text, structure) {
    console.log('Raw input:', text);
    const cleanedText = text.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase().trim();
    console.log('Cleaned text:', cleanedText);

    const words = cleanedText.split(/\s+/).filter(word => word.length > 0);
    console.log('Split words:', words);

    const pattern = structure.pattern;
    let wordIndex = 0;

    // Проверяем местоимение
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

    // Проверяем первое слово после местоимения
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
