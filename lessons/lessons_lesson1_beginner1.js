addLesson({
  level: "beginner1",
  lesson: "lesson1",
  name: "Урок 1",
  structures: [
    { structure: "I am [name].", pattern: ["i", "am", "name"], id: "s1", hasName: true },
    { structure: "You are [name].", pattern: ["you", "are", "name"], id: "s2", hasName: true },
    { structure: "What is your name?", pattern: ["what", "is", "your", "name"], id: "s3", hasName: false },
    { structure: "My name is [name].", pattern: ["my", "name", "is", "name"], id: "s4", hasName: true },
    { structure: "This is [name].", pattern: ["this", "is", "name"], id: "s5", hasName: true }
  ],
  requiredCorrect: 2, // 2 correct examples per structure
  validateStructure: function(text, structure) {
    const words = text.split(' ').filter(word => word.length > 0);
    const pattern = structure.pattern;
    let wordIndex = 0;

    for (let part of pattern) {
      if (part === 'name') {
        if (!words[wordIndex]) return false; // Must have a word for name
        wordIndex++;
      } else {
        if (!words[wordIndex] || words[wordIndex] !== part) return false;
        wordIndex++;
      }
    }
    return wordIndex === words.length; // Ensure no extra words
  }
});