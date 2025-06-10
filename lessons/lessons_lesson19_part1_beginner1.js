addLesson({
  level: "beginner1",
  lesson: "lesson19_part1",
  name: "Урок 19 Часть 1",
  structures: [
    { 
      structure: "There is a/an _____ on/in/at ______", 
      pattern: ["there", "is"], 
      translations: ["Есть ______ на/в/у ______."], 
      examples: [
        "There is an apple in the bag. (В сумке есть яблоко.)",
        "There is a car in the house. (В доме есть машина.)",
        "There is a dog. (Есть собака.)"
      ], 
      id: "there-is-a-noun-prep-place", 
      hasVerb: false,
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

    // Проверяем "there is"
    if (!words[wordIndex] || words[wordIndex] !== 'there') {
      console.log('Ожидалось "there" на позиции', wordIndex, ', получено', words[wordIndex]);
      return false;
    }
    wordIndex++;
    if (!words[wordIndex] || words[wordIndex] !== 'is') {
      console.log('Ожидалось "is" на позиции', wordIndex, ', получено', words[wordIndex]);
      return false;
    }
    wordIndex++;

    // Проверяем наличие артикля "a" или "an"
    if (!words[wordIndex] || (words[wordIndex] !== 'a' && words[wordIndex] !== 'an')) {
      console.log('Нет артикля "a" или "an" на позиции', wordIndex);
      return false;
    }
    const article = words[wordIndex];
    wordIndex++;

    // Проверяем существительное после артикля
    if (!words[wordIndex]) {
      console.log('Нет существительного после артикля');
      return false;
    }
    const noun = words[wordIndex];

    // Список запрещённых слов
    const excludedWords = [
      // Модальные глаголы и вспомогательные
      'will', 'should', 'can', 'could', 'would', 'must', 'may', 'might', 'shall', 'ought',
      'am', 'is', 'are', 'was', 'were', 'been', 'being', 'has', 'have', 'had', 'does', 'do', 'did',
      // Наречия времени
      'tomorrow', 'yesterday', 'today', 'now', 'later', 'soon', 'always', 'never', 'often',
      // Глаголы с окончаниями
      'going', 'doing', 'saying', 'running', 'swimming', 'singing', 'writing', 'reading',
      'likes', 'runs', 'swims', 'works', 'calls', 'plays', 'watches', 'studies',
      'worked', 'called', 'played', 'watched', 'studied',
      // Другие неподходящие слова
      'to', 'for', 'with', 'by', 'from', 'at', 'in', 'on'
    ];

    // Проверяем, что существительное не в списке запрещённых слов
    if (excludedWords.includes(noun)) {
      console.log('Запрещённое слово:', noun);
      return false;
    }

    // Проверяем, что существительное не заканчивается на -ing, -s, -es, -ed
    if (noun.endsWith('ing') || noun.endsWith('s') || noun.endsWith('es') || noun.endsWith('ed')) {
      console.log('Недопустимая форма существительного:', noun);
      return false;
    }

    wordIndex++;

    // Проверяем правильность артикля ("a" или "an")
    const startsWithVowelSound = /^[aeiou]/i.test(noun);
    if (startsWithVowelSound && article !== 'an') {
      console.log('Неправильный артикль: ожидалось "an" для', noun);
      return false;
    }
    if (!startsWithVowelSound && article !== 'a') {
      console.log('Неправильный артикль: ожидалось "a" для', noun);
      return false;
    }

    // Если нет больше слов, принимаем как корректное (короткая форма)
    if (wordIndex >= words.length) {
      console.log('Валидация пройдена для:', text, '(короткая форма)');
      return true;
    }

    // Проверяем предлог (on/in/at)
    if (!['on', 'in', 'at'].includes(words[wordIndex])) {
      console.log('Ожидался предлог "on", "in" или "at" на позиции', wordIndex, ', получено', words[wordIndex]);
      return false;
    }
    wordIndex++;

    // Проверяем существительное (место) после предлога
    if (!words[wordIndex]) {
      console.log('Нет существительного места после предлога');
      return false;
    }
    let place = words[wordIndex];
    // Проверяем наличие артикля "the"
    if (place === 'the') {
      wordIndex++;
      if (!words[wordIndex]) {
        console.log('Нет существительного места после "the"');
        return false;
      }
      place = words[wordIndex];
    }

    // Проверяем составные места (например, "parking lot")
    if (place === 'parking' && words[wordIndex + 1] === 'lot') {
      place = 'parking lot';
      wordIndex++;
    }

    // Список допустимых мест
    const validPlaces = [
      'table', 'desk', 'chair', 'bag', 'box', 'room', 'kitchen', 'bedroom', 'bathroom',
      'car', 'park', 'school', 'office', 'shop', 'street', 'garden', 'floor', 'shelf', 'window',
      'here', 'parking lot', 'house', 'classroom', 'pocket', 'back'
    ];
    if (!validPlaces.includes(place)) {
      console.log('Недопустимое место:', place);
      return false;
    }
    wordIndex++;

    // Проверяем, что после места нет лишних слов
    if (wordIndex < words.length) {
      console.log('Лишние слова после места:', words.slice(wordIndex));
      return false;
    }

    console.log('Валидация пройдена для:', text);
    return true;
  }
});
