addLesson({
  level: "beginner1",
  lesson: "lesson17_part2",
  name: "Урок 17 Часть 2",
  structures: [
    { 
      structure: "Can I/you/he/she/it/we/they ______?", 
      pattern: ["can"], 
      translations: ["Могу ли я/ты/он/она/оно/мы/вы/они ______?"], 
      examples: [
        "Can she dance? (Она может танцевать?)"
      ], 
      id: "can-pronoun-verb", 
      hasVerb: true,
      hasName: false
    },
    { 
      structure: "Yes, I/you/he/she/it/we/they can ______", 
      pattern: ["yes"], 
      translations: ["Да, я/ты/он/она/оно/мы/вы/они могу ______."], 
      examples: [
        "Yes, I can swim. (Да, я могу плавать.)"
      ], 
      id: "yes-pronoun-can-verb", 
      hasVerb: true,
      hasName: false
    },
    { 
      structure: "No, I/you/he/she/it/we/they can not ______", 
      pattern: ["no"], 
      translations: ["Нет, я/ты/он/она/оно/мы/вы/они не могу ______."], 
      examples: [
        "No, they can't play. (Нет, они не могут играть.)"
      ], 
      id: "no-pronoun-can-not-verb", 
      hasVerb: true,
      hasName: false
    }
  ],
  requiredCorrect: 10,
  validateStructure: function(text, structure) {
    console.log('Raw input:', text);
    // Заменяем "can't" и "cannot" на "can not" для поддержки сокращений и полной формы
    let processedText = text
      .replace(/can't/g, 'can not')
      .replace(/cannot/g, 'can not');
    // Удаляем пунктуацию и приводим к нижнему регистру
    const cleanedText = processedText.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase().trim();
    console.log('Cleaned text:', cleanedText);

    const words = cleanedText.split(/\s+/).filter(word => word.length > 0);
    console.log('Split words:', words);

    let wordIndex = 0;

    // Список исключённых глаголов и модальных глаголов
    const excludedWords = [
      'will', 'should', 'can', 'could', 'would', 'must', 'may', 'might', 'shall', 'ought',
      'am', 'is', 'are', 'was', 'were', 'been', 'being', 'has', 'does',
      'going', 'doing', 'saying', 'running', 'swimming', // Примеры с -ing
      'likes', 'runs', 'swims', 'works', 'does', 'has', // Примеры с -s или -es
      'tomorrow', 'yesterday', 'today', 'now', 'later' // Временные наречия
    ];

    // Список всех местоимений
    const validPronouns = ['i', 'you', 'he', 'she', 'it', 'we', 'they'];

    // Проверяем в зависимости от структуры
    if (structure.id === "can-pronoun-verb") {
      // Структура "Can I/you/he/she/it/we/they ______?"
      // Проверяем "can"
      if (!words[wordIndex] || words[wordIndex] !== 'can') {
        console.log('Expected "can" at index', wordIndex, 'got', words[wordIndex]);
        return false;
      }
      wordIndex++;

      // Проверяем местоимение
      if (!words[wordIndex] || !validPronouns.includes(words[wordIndex])) {
        console.log('Expected pronoun at index', wordIndex, 'got', words[wordIndex]);
        return false;
      }
      wordIndex++;

      // Проверяем глагол
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
      if (excludedWords.includes(verb)) {
        console.log('Excluded verb:', verb);
        return false;
      }
      wordIndex++;
    } else if (structure.id === "yes-pronoun-can-verb") {
      // Структура "Yes, I/you/he/she/it/we/they can ______"
      // Проверяем "yes"
      if (!words[wordIndex] || words[wordIndex] !== 'yes') {
        console.log('Expected "yes" at index', wordIndex, 'got', words[wordIndex]);
        return false;
      }
      wordIndex++;

      // Проверяем местоимение
      if (!words[wordIndex] || !validPronouns.includes(words[wordIndex])) {
        console.log('Expected pronoun at index', wordIndex, 'got', words[wordIndex]);
        return false;
      }
      wordIndex++;

      // Проверяем "can"
      if (!words[wordIndex] || words[wordIndex] !== 'can') {
        console.log('Expected "can" at index', wordIndex, 'got', words[wordIndex]);
        return false;
      }
      wordIndex++;

      // Проверяем глагол
      if (!words[wordIndex]) {
        console.log('No verb after "can"');
        return false;
      }
      const verb = words[wordIndex];
      // Проверяем, что глагол в базовой форме
      if (verb.endsWith('s') || verb.endsWith('es') || verb.endsWith('ing')) {
        console.log('Invalid verb form (should be base form):', verb);
        return false;
      }
      if (excludedWords.includes(verb)) {
        console.log('Excluded verb:', verb);
        return false;
      }
      wordIndex++;
    } else if (structure.id === "no-pronoun-can-not-verb") {
      // Структура "No, I/you/he/she/it/we/they can not ______"
      // Проверяем "no"
      if (!words[wordIndex] || words[wordIndex] !== 'no') {
        console.log('Expected "no" at index', wordIndex, 'got', words[wordIndex]);
        return false;
      }
      wordIndex++;

      // Проверяем местоимение
      if (!words[wordIndex] || !validPronouns.includes(words[wordIndex])) {
        console.log('Expected pronoun at index', wordIndex, 'got', words[wordIndex]);
        return false;
      }
      wordIndex++;

      // Проверяем "can"
      if (!words[wordIndex] || words[wordIndex] !== 'can') {
        console.log('Expected "can" at index', wordIndex, 'got', words[wordIndex]);
        return false;
      }
      wordIndex++;

      // Проверяем "not"
      if (!words[wordIndex] || words[wordIndex] !== 'not') {
        console.log('Expected "not" at index', wordIndex, 'got', words[wordIndex]);
        return false;
      }
      wordIndex++;

      // Проверяем глагол
      if (!words[wordIndex]) {
        console.log('No verb after "not"');
        return false;
      }
      const verb = words[wordIndex];
      // Проверяем, что глагол в базовой форме
      if (verb.endsWith('s') || verb.endsWith('es') || verb.endsWith('ing')) {
        console.log('Invalid verb form (should be base form):', verb);
        return false;
      }
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
