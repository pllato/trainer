addLesson({
  level: "beginner1",
  lesson: "lesson11",
  name: "Урок 11",
  structures: [
    { 
      structure: "I have ____.", 
      pattern: ["i", "have"], 
      translations: ["У меня есть ______."], 
      examples: [
        "I have a dog. (У меня есть собака.)"
      ], 
      id: "i-have", 
      hasName: true 
    },
    { 
      structure: "You have ____.", 
      pattern: ["you", "have"], 
      translations: ["У тебя есть ______."], 
      examples: [
        "You have a book. (У тебя есть книга.)"
      ], 
      id: "you-have", 
      hasName: true 
    },
    { 
      structure: "She has ____.", 
      pattern: ["she", "has"], 
      translations: ["У неё есть ______."], 
      examples: [
        "She has a car. (У неё есть машина.)"
      ], 
      id: "she-has", 
      hasName: true 
    },
    { 
      structure: "He has ____.", 
      pattern: ["he", "has"], 
      translations: ["У него есть ______."], 
      examples: [
        "He has a phone. (У него есть телефон.)"
      ], 
      id: "he-has", 
      hasName: true 
    },
    { 
      structure: "It has ____.", 
      pattern: ["it", "has"], 
      translations: ["У него/неё есть ______."], 
      examples: [
        "It has a tail. (У него/неё есть хвост.)"
      ], 
      id: "it-has", 
      hasName: true 
    },
    { 
      structure: "We have ____.", 
      pattern: ["we", "have"], 
      translations: ["У нас есть ______."], 
      examples: [
        "We have a house. (У нас есть дом.)"
      ], 
      id: "we-have", 
      hasName: true 
    },
    { 
      structure: "They have ____.", 
      pattern: ["they", "have"], 
      translations: ["У них есть ______."], 
      examples: [
        "They have friends. (У них есть друзья.)"
      ], 
      id: "they-have", 
      hasName: true 
    }
  ],
  requiredCorrect: 10,
  validateStructure: function(text, structure) {
    const words = text.split(' ').filter(word => word.length > 0);
    const pattern = structure.pattern;
    let wordIndex = 0;

    // Сбрасываем window.usedNames при старте урока
    window.usedNames = [];

    function normalizeWord(word) {
      word = word.toLowerCase();
      return word;
    }

    let normalizedWords = [];
    for (let word of words) {
      normalizedWords.push(normalizeWord(word));
    }

    // Проверяем, что начало текста соответствует шаблону
    for (let part of pattern) {
      if (!normalizedWords[wordIndex] || normalizedWords[wordIndex] !== part) {
        return false;
      }
      wordIndex++;
    }

    // Для всех структур (hasName: true) после шаблона должен быть предмет
    if (wordIndex >= normalizedWords.length) {
      return false; // Должно быть хотя бы одно слово после шаблона (предмет)
    }

    const item = normalizedWords.slice(wordIndex).join(' ');

    // Проверяем уникальность предмета
    if (structure.hasName) {
      if (window.usedNames && window.usedNames.includes(item)) {
        return false; // Предмет уже использовался
      }
      window.usedNames.push(item);
    }

    return true;
  }
});
