addLesson({
  level: "beginner1",
  lesson: "lesson10",
  name: "Урок 10",
  structures: [
    { 
      structure: "This is ______.", 
      pattern: ["this", "is"], 
      translations: ["Это ______.", "Вот ______."], 
      examples: [
        "This is Madina. (Это Мадина.)",
        "This is John. (Это Джон.)",
        "This is cat. (Это кошка.)",
        "This is Egor. (Это Егор.)"
      ], 
      id: "this-is-name", 
      hasName: true 
    },
    { 
      structure: "This is ____ ____.", 
      pattern: ["this", "is"], 
      translations: ["Это ____ ______.", "Вот ____ ______."], 
      examples: [
        "This is my bag. (Это моя сумка.)",
        "This is his dog. (Это его собака.)",
        "This is her car. (Это её машина.)",
        "This is its toy. (Это его игрушка.)",
        "This is our book. (Это наша книга.)",
        "This is their house. (Это их дом.)",
        "This is his car. (Это его машина.)"
      ], 
      id: "this-is-pronoun-thing", 
      hasName: false 
    },
    { 
      structure: "This is ____'s ____.", 
      pattern: ["this", "is"], 
      translations: ["Это ______ ______.", "Вот ______ ______."], 
      examples: [
        "This is Madina's bag. (Это сумка Мадины.)",
        "This is John's car. (Это машина Джона.)",
        "This is cat's toy. (Это игрушка кошки.)",
        "This is Egor's car. (Это машина Егора.)"
      ], 
      id: "this-is-possessive-thing", 
      hasName: false 
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

    for (let part of pattern) {
      if (!normalizedWords[wordIndex] || normalizedWords[wordIndex] !== part) {
        return false;
      }
      wordIndex++;
    }

    if (structure.id === "this-is-name") {
      if (wordIndex >= normalizedWords.length) {
        return false;
      }
      const name = normalizedWords.slice(wordIndex).join(' ');
      const firstWordAfterThisIs = normalizedWords[wordIndex];
      if (firstWordAfterThisIs.endsWith("'s")) {
        return false;
      }
      if (normalizedWords.length - wordIndex === 2 && ["my", "our", "his", "her", "its", "their"].includes(firstWordAfterThisIs)) {
        return false;
      }
      if (window.usedNames && window.usedNames.includes(name)) {
        return false;
      }
      window.usedNames.push(name);
      return true;
    }

    if (structure.id === "this-is-pronoun-thing") {
      if (wordIndex + 2 > normalizedWords.length) {
        return false;
      }
      if (wordIndex + 2 !== normalizedWords.length) {
        return false;
      }
      const pronoun = normalizedWords[wordIndex];
      if (!["my", "our", "his", "her", "its", "their"].includes(pronoun)) {
        return false;
      }
      return true;
    }

    if (structure.id === "this-is-possessive-thing") {
      if (wordIndex + 2 > normalizedWords.length) {
        return false;
      }
      if (wordIndex + 2 !== normalizedWords.length) {
        return false;
      }
      const possessiveForm = normalizedWords[wordIndex];
      if (!possessiveForm.endsWith("'s")) {
        return false;
      }
      return true;
    }

    return false;
  }
});
