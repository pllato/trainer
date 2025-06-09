addLesson({
  level: "beginner1",
  lesson: "lesson18_part1",
  name: "Урок 18 Часть 1",
  structures: [
    { 
      structure: "I/You/He/She/We/They ____(s) me/you/him/her/us/them", 
      pattern: [], // Проверяем местоимения отдельно
      translations: ["Я/Ты/Он/Она/Мы/Они ______(ит) мне/тебе/ему/ей/нам/им."], 
      examples: [
        "She calls me. (Она зовёт меня.)"
      ], 
      id: "subject-verb-object", 
      hasVerb: true,
      hasName: false
    }
  ],
  requiredCorrect: 30,
  validateStructure: function(text, structure) {
    console.log('Raw input:', text);
    // Удаляем пунктуацию и приводим к нижнему регистру
    const cleanedText = text.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase().trim();
    console.log('Cleaned text:', cleanedText);

    const words = cleanedText.split(/\s+/).filter(word => word.length > 0);
    console.log('Split words:', words);

    let wordIndex = 0;

    // Список исключённых глаголов и модальных глаголов
    const excludedWords = [
      'will', 'should', 'can', 'could', 'would', 'must', 'may', 'might', 'shall', 'ought',
      'am', 'is', 'are', 'was', 'were', 'been', 'being', 'has', 'does',
      'going', 'doing', 'saying', 'running', 'swimming', // Примеры с -ing
      'tomorrow', 'yesterday', 'today', 'now', 'later' // Временные наречия
    ];

    // Список местоимений
    const subjectPronouns = ['i', 'you', 'he', 'she', 'we', 'they'];
    const objectPronouns = ['me', 'you', 'him', 'her', 'us', 'them'];

    // Проверяем в зависимости от структуры
    if (structure.id === "subject-verb-object") {
      // Структура "I/You/He/She/We/They ____(s) me/you/him/her/us/them"
      // Проверяем местоимение (подлежащее)
      if (!words[wordIndex] || !subjectPronouns.includes(words[wordIndex])) {
        console.log('Expected subject pronoun at index', wordIndex, 'got', words[wordIndex]);
        return false;
      }
      wordIndex++;

      // Проверяем глагол
      if (!words[wordIndex]) {
        console.log('No verb after pronoun');
        return false;
      }
      const verb = words[wordIndex];
      // Проверяем, что глагол в правильной форме (без -ing, для he/she допустим -s)
      if (verb.endsWith('ing')) {
        console.log('Invalid verb form (no -ing allowed):', verb);
        return false;
      }
      if (['he', 'she'].includes(words[0])) {
        // Для he/she глагол должен заканчиваться на -s или -es
        if (!verb.endsWith('s') && !verb.endsWith('es')) {
          console.log('Verb for he/she does not end with -s or -es:', verb);
          return false;
        }
      } else {
        // Для I/you/we/they глагол должен быть в базовой форме (без -s, -es)
        if (verb.endsWith('s') || verb.endsWith('es')) {
          console.log('Invalid verb form for I/you/we/they (should be base form):', verb);
          return false;
        }
      }
      if (excludedWords.includes(verb)) {
        console.log('Excluded verb:', verb);
        return false;
      }
      wordIndex++;

      // Проверяем объектное местоимение
      if (!words[wordIndex] || !objectPronouns.includes(words[wordIndex])) {
        console.log('Expected object pronoun at index', wordIndex, 'got', words[wordIndex]);
        return false;
      }
      wordIndex++;

      // Проверяем, что нет лишних слов
      if (wordIndex < words.length) {
        console.log('Extra words after object pronoun:', words.slice(wordIndex));
        return false;
      }
    }

    console.log('Validation passed for:', text);
    return true;
  }
});
