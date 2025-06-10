addLesson({
  level: "beginner1",
  lesson: "lesson8",
  name: "Урок 8",
  structures: [
    { structure: "What is your name?", pattern: ["what", "is", "your", "name"], translations: ["Как тебя зовут?", "Какое у тебя имя?"], id: "what-is-your-name", hasName: false },
    { structure: "My name is _________.", pattern: ["my", "name", "is"], translations: ["Меня зовут _________.", "Моё имя _________."], examples: ["My name is Anna. (Меня зовут Анна.)", "My name is John. (Моё имя Джон.)"], id: "my-name-is", hasName: true },
    { structure: "What is your phone number?", pattern: ["what", "is", "your", "phone", "number"], translations: ["Какой у тебя номер телефона?", "Какой у тебя телефон?"], id: "what-is-your-phone-number", hasName: false },
    { structure: "My phone number is _________.", pattern: ["my", "phone", "number", "is"], translations: ["Мой номер телефона _________.", "Мой телефон _________."], examples: ["My phone number is 123-456-7890. (Мой номер телефона 123-456-7890.)", "My phone number is 987-654-3210. (Мой телефон 987-654-3210.)"], id: "my-phone-number-is", hasName: true },
    { structure: "What is your address?", pattern: ["what", "is", "your", "address"], translations: ["Какой у тебя адрес?", "Где ты живёшь?"], id: "what-is-your-address", hasName: false },
    { structure: "My address is _________.", pattern: ["my", "address", "is"], translations: ["Мой адрес _________.", "Я живу по адресу _________."], examples: ["My address is 123 Main Street. (Мой адрес 123 Main Street.)", "My address is 456 Oak Avenue. (Я живу по адресу 456 Oak Avenue.)"], id: "my-address-is", hasName: true },
    { structure: "What is your age?", pattern: ["what", "is", "your", "age"], translations: ["Сколько тебе лет?", "Какой у тебя возраст?"], id: "what-is-your-age", hasName: false },
    { structure: "My age is _________.", pattern: ["my", "age", "is"], translations: ["Мне _________ лет.", "Мой возраст _________."], examples: ["My age is 25. (Мне 25 лет.)", "My age is 30. (Мой возраст 30.)"], id: "my-age-is", hasName: true },
    { structure: "What is your ____?", pattern: ["what", "is", "your"], translations: ["Что такое твой ____?", "Какой у тебя ____?"], examples: ["What is your hobby? (Какое у тебя хобби?)", "What is your favorite color? (Какой у тебя любимый цвет?)"], id: "what-is-your-open", hasName: false },
    { structure: "My ____ is ____.", pattern: ["my"], translations: ["Мой ____ — это ____.", "Мой ____ ____."], examples: ["My hobby is reading. (Моё хобби — чтение.)", "My favorite color is blue. (Мой любимый цвет — синий.)"], id: "my-open-is", hasName: true }
  ],
  requiredCorrect: 6, // 6 correct examples per structure
  validateStructure: function(text, structure) {
    const words = text.split(' ').filter(word => word.length > 0);
    const pattern = structure.pattern;
    let wordIndex = 0;

    // Переменная для хранения темы открытого вопроса
    if (!window.lastAskedTopic) window.lastAskedTopic = null;

    // Функция для обработки сокращений
    function normalizeWord(word) {
      word = word.toLowerCase();
      if (word === "what's") return ["what", "is"];
      return [word];
    }

    let normalizedWords = [];
    for (let word of words) {
      normalizedWords.push(...normalizeWord(word));
    }

    // Проверяем, что начало текста соответствует шаблону
    for (let part of pattern) {
      if (!normalizedWords[wordIndex] || normalizedWords[wordIndex] !== part) return false;
      wordIndex++;
    }

    // Для вопросов (hasName: false)
    if (!structure.hasName) {
      if (structure.id === "what-is-your-open") {
        // Для открытого вопроса "What is your ____?" должно быть хотя бы одно слово после "your"
        if (wordIndex >= normalizedWords.length) return false;
        // Сохраняем тему вопроса (все слова после "your")
        window.lastAskedTopic = normalizedWords.slice(wordIndex).join(' ');
        return true;
      } else {
        // Для остальных вопросов текст должен точно совпадать с шаблоном
        return wordIndex === normalizedWords.length;
      }
    }

    // Для ответов (hasName: true)
    if (structure.id === "my-open-is") {
      // Для открытого ответа "My ____ is ____." проверяем соответствие темы
      if (!window.lastAskedTopic) return false; // Если не было вопроса, ответ недействителен
      if (wordIndex >= normalizedWords.length) return false; // Должно быть слово после "my"

      // Извлекаем тему из ответа (слова между "my" и "is")
      const topicEndIndex = normalizedWords.indexOf("is", wordIndex);
      if (topicEndIndex === -1 || topicEndIndex === wordIndex) return false; // Должно быть "is" и хотя бы одно слово между "my" и "is"
      const answerTopic = normalizedWords.slice(wordIndex, topicEndIndex).join(' ');

      // Проверяем, что тема совпадает с последним заданным вопросом
      if (answerTopic !== window.lastAskedTopic) return false;

      // Проверяем, что есть хотя бы одно слово после "is"
      return topicEndIndex + 1 < normalizedWords.length;
    } else {
      // Для остальных ответов (например, "My name is") должно быть хотя бы одно слово после шаблона
      return wordIndex < normalizedWords.length;
    }
  }
});
