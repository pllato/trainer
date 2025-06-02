addLesson({
  level: "beginner1",
  lesson: "lesson3",
  name: "Урок 3",
  structures: [
    { structure: "I am a _______.", pattern: ["i", "am", "a", "profession"], id: "s1", hasName: true },
    { structure: "You are a _______.", pattern: ["you", "are", "a", "profession"], id: "s2", hasName: true },
    { structure: "He is a ________.", pattern: ["he", "is", "a", "profession"], id: "s3", hasName: true },
    { structure: "She is a ________.", pattern: ["she", "is", "a", "profession"], id: "s4", hasName: true },
    { structure: "We are ____s.", pattern: ["we", "are", "profession"], id: "s5", hasName: true, requiresPlural: true },
    { structure: "They are ____s.", pattern: ["they", "are", "profession"], id: "s6", hasName: true, requiresPlural: true }
  ],
  requiredCorrect: 2, // 2 correct examples per structure
  professions: ["teacher", "doctor", "engineer", "artist", "student", "chef", "driver", "lawyer", "nurse", "programmer"],
  validateStructure: function(text, structure) {
    const words = text.split(' ').filter(word => word.length > 0);
    const pattern = structure.pattern;
    let wordIndex = 0;

    for (let part of pattern) {
      if (part === 'profession') {
        if (!words[wordIndex]) return false; // Must have a word for profession
        const spokenProfession = words[wordIndex];
        
        // Check if the spoken word is a valid profession
        if (!this.professions.includes(spokenProfession.replace(/s$/, ''))) {
          return false; // Not a valid profession
        }

        // For "We are ____s" and "They are ____s", the profession must be plural (end with 's')
        if (structure.requiresPlural) {
          if (!spokenProfession.endsWith('s')) return false; // Must be plural
        } else {
          // For singular structures, ensure the profession is singular and preceded by 'a'
          if (spokenProfession.endsWith('s')) return false; // Must be singular
          if (wordIndex > 0 && words[wordIndex - 1] !== 'a') return false; // Must have 'a' before profession
        }

        wordIndex++;
      } else {
        if (!words[wordIndex] || words[wordIndex] !== part) return false;
        wordIndex++;
      }
    }
    return wordIndex === words.length; // Ensure no extra words
  }
});