addLesson({
  level: "beginner1",
  lesson: "lesson18_part2",
  name: "Урок 18 Часть 2",
  structures: [
    { 
      structure: "This is my/your/his/her/its/our/their ______", 
      pattern: ["this", "is"], 
      translations: ["Это моя/твоя/его/её/его/наша/их ______."], 
      examples: [
        "This is his car. (Это его машина.)"
      ], 
      id: "this-is-possessive-noun", 
      hasVerb: false,
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

    // Список исключённых слов
    const excludedWords = [
      'will', 'should', 'can', 'could', 'would', 'must', 'may', 'might', 'shall', 'ought',
      'am', 'is', 'are', 'was', 'were', 'been', 'being', 'has', 'does',
      'going', 'doing', 'saying', 'running', 'swimming', // Примеры с -ing
      'likes', 'runs', 'swims', 'works', 'does', 'has', // Примеры с -s или -es
      'tomorrow', 'yesterday', 'today', 'now', 'later' // Временные наречия
    ];

    // Список притяжательных местоимений
    const possessivePronouns = ['my', 'your', 'his', 'her', 'its', 'our', 'their'];

    // Проверяем в зависимости от структуры
    if (structure.id === "this-is-possessive-noun") {
      // Структура "This is my/your/his/her/its/our/their ______"
      // Проверяем "this is"
      if (!words[wordIndex] || words[wordIndex] !== 'this') {
        console.log('Expected "this" at index', wordIndex, 'got', words[wordIndex]);
        return false;
      }
      wordIndex++;
      if (!words[wordIndex] || words[wordIndex] !== 'is') {
        console.log('Expected "is" at index', wordIndex, 'got', words[wordIndex]);
        return false;
      }
      wordIndex++;

      // Проверяем притяжательное местоимение
      if (!words[wordIndex] || !possessivePronouns.includes(words[wordIndex])) {
        console.log('Expected possessive pronoun at index', wordIndex, 'got', words[wordIndex]);
        return false;
      }
      wordIndex++;

      // Проверяем существительное
      if (!words[wordIndex]) {
        console.log('No noun after possessive pronoun');
        return false;
      }
      const noun = words[wordIndex];
      if (excludedWords.includes(noun)) {
        console.log('Excluded noun:', noun);
        return false;
      }
      wordIndex++;

      // Проверяем, что нет лишних слов
      if (wordIndex < words.length) {
        console.log('Extra words after noun:', words.slice(wordIndex));
        return false;
      }
    }

    console.log('Validation passed for:', text);
    return true;
  }
});
