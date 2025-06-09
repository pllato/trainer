addLesson({
  level: "beginner1",
  lesson: "lesson14_part3",
  name: "Урок 14 Часть 3",
  structures: [
    { 
      structure: "What/Where/What time/When does he/she/it _______?", 
      pattern: [], // Проверяем вопросительные слова отдельно
      translations: ["Что/Где/Во сколько/Когда он/она/оно _______?"], 
      examples: [
        "Where does he live? (Где он живёт?)"
      ], 
      id: "wh-does-he-she-it-verb", 
      hasVerb: true,
      hasName: false
    },
    { 
      structure: "He/She/It ______s ________.", 
      pattern: [], // Проверяем местоимения отдельно
      translations: ["Он/Она/Оно _______ _______."], 
      examples: [
        "She works here. (Она работает здесь.)"
      ], 
      id: "he-she-it-verbs-object", 
      hasVerb: true,
      hasName: false
    }
  ],
  requiredCorrect: 20,
  validateStructure: function(text, structure) {
    console.log('Raw input:', text);
    // Заменяем "doesn't" на "does not" для единообразия (хотя здесь не используется)
    let processedText = text.replace(/doesn't/g, 'does not');
    // Удаляем пунктуацию и приводим к нижнему регистру
    const cleanedText = processedText.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase().trim();
    console.log('Cleaned text:', cleanedText);

    const words = cleanedText.split(/\s+/).filter(word => word.length > 0);
    console.log('Split words:', words);

    let wordIndex = 0;

    // Список исключённых глаголов и модальных глаголов
    const excludedWords = [
      'will', 'should', 'can', 'could', 'would', 'must', 'may', 'might', 'shall', 'ought',
      'am', 'is', 'are', 'was', 'were', 'been', 'being', 'has', 'does'
    ];

    // Проверяем в зависимости от структуры
    if (structure.id === "wh-does-he-she-it-verb") {
      // Структура "What/Where/What time/When does he/she/it _______?"
      // Проверяем вопросительное слово
      if (!words[wordIndex]) {
        console.log('No question word at index', wordIndex);
        return false;
      }
      const questionWord = words[wordIndex];
      if (questionWord === "what" && words[wordIndex + 1] === "time") {
        wordIndex += 2; // Пропускаем "what time"
      } else if (["what", "where", "when"].includes(questionWord)) {
        wordIndex++;
      } else {
        console.log('Invalid question word:', questionWord);
        return false;
      }

      // Проверяем "does"
      if (!words[wordIndex] || words[wordIndex] !== 'does') {
        console.log('Expected "does" at index', wordIndex, 'got', words[wordIndex]);
        return false;
      }
      wordIndex++;

      // Проверяем местоимение (he/she/it)
      if (!words[wordIndex] || !['he', 'she', 'it'].includes(words[wordIndex])) {
        console.log('Expected "he", "she", or "it" at index', wordIndex, 'got', words[wordIndex]);
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
    } else if (structure.id === "he-she-it-verbs-object") {
      // Структура "He/She/It ______s ________."
      // Проверяем местоимение (he/she/it)
      if (!words[wordIndex] || !['he', 'she', 'it'].includes(words[wordIndex])) {
        console.log('Expected "he", "she", or "it" at index', wordIndex, 'got', words[wordIndex]);
        return false;
      }
      wordIndex++;

      // Проверяем глагол
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
      const verbBase = verb.slice(0, verb.endsWith('es') ? -2 : -1); // Убираем -s или -es для проверки базовой формы
      if (excludedWords.includes(verb) || excludedWords.includes(verbBase)) {
        console.log('Excluded verb:', verb);
        return false;
      }
      wordIndex++;

      // Проверяем наличие дополнения после глагола
      if (wordIndex >= words.length) {
        console.log('No object/adverb after verb');
        return false;
      }
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
