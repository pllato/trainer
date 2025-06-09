addLesson({
  level: "beginner1",
  lesson: "lesson17_part1",
  name: "Урок 17 Часть 1",
  structures: [
    { 
      structure: "I/you can _______", 
      pattern: [], // Проверяем местоимения отдельно
      translations: ["Я/ты умею _______."], 
      examples: [
        "I can swim. (Я умею плавать.)"
      ], 
      id: "i-you-can-verb", 
      hasVerb: true,
      hasName: false
    },
    { 
      structure: "He/She/It/we/you/they can _______", 
      pattern: [], // Проверяем местоимения отдельно
      translations: ["Он/Она/Оно/мы/вы/они умеет _______."], 
      examples: [
        "She can dance. (Она умеет танцевать.)"
      ], 
      id: "he-she-it-we-you-they-can-verb", 
      hasVerb: true,
      hasName: false
    },
    { 
      structure: "We/They can _______", 
      pattern: [], // Проверяем местоимения отдельно
      translations: ["Мы/они умеют _______."], 
      examples: [
        "They can play. (Они умеют играть.)"
      ], 
      id: "we-they-can-verb", 
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

    let wordIndex = 0;

    // Проверяем местоимение в зависимости от структуры
    if (!words[wordIndex]) {
      console.log('No pronoun at index', wordIndex);
      return false;
    }

    const pronoun = words[wordIndex];
    if (structure.id === "i-you-can-verb") {
      // "I/you can _______"
      if (!['i', 'you'].includes(pronoun)) {
        console.log('Expected "I" or "you" at index', wordIndex, 'got', pronoun);
        return false;
      }
    } else if (structure.id === "he-she-it-we-you-they-can-verb") {
      // "He/She/It/we/you/they can _______"
      if (!['he', 'she', 'it', 'we', 'you', 'they'].includes(pronoun)) {
        console.log('Expected "he", "she", "it", "we", "you", or "they" at index', wordIndex, 'got', pronoun);
        return false;
      }
    } else if (structure.id === "we-they-can-verb") {
      // "We/They can _______"
      if (!['we', 'they'].includes(pronoun)) {
        console.log('Expected "we" or "they" at index', wordIndex, 'got', pronoun);
        return false;
      }
    }
    wordIndex++;

    // Проверяем "can"
    if (!words[wordIndex] || words[wordIndex] !== 'can') {
      console.log('Expected "can" at index', wordIndex, 'got', words[wordIndex]);
      return false;
    }
    wordIndex++;

    // Проверяем наличие глагола после "can"
    if (!words[wordIndex]) {
      console.log('No verb after "can"');
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
      'am', 'is', 'are', 'was', 'were', 'been', 'being', 'has', 'does',
      'going', 'doing', 'saying', 'running', 'swimming', // Примеры с -ing
      'likes', 'runs', 'swims', 'works', 'does', 'has', // Примеры с -s или -es
      'tomorrow', 'yesterday', 'today', 'now', 'later' // Временные наречия
    ];
    if (excludedWords.includes(verb)) {
      console.log('Excluded verb:', verb);
      return false;
    }
    wordIndex++;

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