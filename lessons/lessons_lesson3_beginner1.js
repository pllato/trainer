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
  requiredCorrect: 2,
  irregularPlurals: {
    "child": "children",
    "person": "people",
    "man": "men",
    "woman": "women",
    "mouse": "mice",
    "goose": "geese",
    "foot": "feet",
    "tooth": "teeth"
  },
  // Список допустимых составных профессий (до 3 слов)
  compoundProfessions: [
    "police officer",
    "software engineer",
    "school teacher",
    "bus driver",
    "fire fighter",
    "web developer",
    "graphic designer",
    "data scientist",
    "civil engineer",
    "flight attendant"
  ],
  validateStructure: function(text, structure) {
    console.log('Raw input:', text);
    // Удаляем пунктуацию, приводим к нижнему регистру и нормализуем пробелы
    const cleanedText = text.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase().trim().replace(/\s+/g, ' ');
    console.log('Cleaned text:', cleanedText);

    const words = cleanedText.split(' ').filter(word => word.length > 0);
    console.log('Split words:', words);

    if (words.length === 0) {
      console.log('Пустая строка');
      return false;
    }

    const pattern = structure.pattern;
    let wordIndex = 0;
    let spokenProfession = "";
    let baseForm = ""; // Базовая форма для проверки уникальности

    for (let part of pattern) {
      if (part === 'profession') {
        if (!words[wordIndex]) {
          console.log('Ожидалась профессия на позиции', wordIndex, ', но слово отсутствует');
          return false; // Должна быть профессия
        }

        // Проверяем, является ли профессия составной (1, 2 или 3 слова)
        let professionWords = [];
        // Пробуем 3 слова
        if (words[wordIndex + 2]) {
          const threeWords = words.slice(wordIndex, wordIndex + 3).join(' ');
          if (this.compoundProfessions.includes(threeWords)) {
            professionWords = [threeWords];
          }
        }
        // Пробуем 2 слова
        if (professionWords.length === 0 && words[wordIndex + 1]) {
          const twoWords = words.slice(wordIndex, wordIndex + 2).join(' ');
          if (this.compoundProfessions.includes(twoWords)) {
            professionWords = [twoWords];
          }
        }
        // Если не нашли составную профессию, берём 1 слово
        if (professionWords.length === 0) {
          professionWords = [words[wordIndex]];
        }

        spokenProfession = professionWords[0];
        const professionWordCount = spokenProfession.split(' ').length;
        wordIndex += professionWordCount;

        // Определяем базовую форму для проверки уникальности (без "s" в конце последнего слова)
        const professionParts = spokenProfession.split(' ');
        const lastWord = professionParts[professionParts.length - 1];
        let lastWordBaseForm = lastWord;
        if (lastWord.endsWith('s')) {
          lastWordBaseForm = lastWord.slice(0, -1); // Убираем "s" для регулярных форм
        } else {
          // Проверяем, является ли последнее слово нерегулярной формой множественного числа
          lastWordBaseForm = Object.keys(this.irregularPlurals).find(
            key => this.irregularPlurals[key] === lastWord
          ) || lastWord;
        }
        // Базовая форма — это вся профессия, но с последним словом в базовой форме
        baseForm = [...professionParts.slice(0, -1), lastWordBaseForm].join(' ');

        // Для "We are ____s" и "They are ____s" профессия должна быть во множественном числе
        if (structure.requiresPlural) {
          const isRegularPlural = lastWord.endsWith('s'); // Регулярная форма множественного числа
          const isIrregularPlural = Object.values(this.irregularPlurals).includes(lastWord); // Нерегулярная форма
          if (!isRegularPlural && !isIrregularPlural) {
            console.log('Ожидалась форма множественного числа для профессии:', spokenProfession);
            return false; // Должно быть либо "s", либо нерегулярная форма
          }
        } else {
          // Для единственного числа (I, You, He, She)
          const isIrregularPlural = Object.values(this.irregularPlurals).includes(lastWord);
          if (isIrregularPlural) {
            console.log('Нерегулярная форма множественного числа не допускается для единственного числа:', spokenProfession);
            return false; // Нерегулярная форма множественного числа не допускается
          }
          if (lastWord.endsWith('s')) {
            console.log('Множественное число не допускается для единственного числа:', spokenProfession);
            return false; // Не должно быть во множественном числе
          }
          if (wordIndex > professionWordCount && words[wordIndex - professionWordCount - 1] !== 'a') {
            console.log('Ожидался артикль "a" перед профессией');
            return false; // Должно быть 'a' перед профессией
          }
        }
      } else {
        if (!words[wordIndex] || words[wordIndex] !== part) {
          console.log('Ожидалось слово "', part, '" на позиции', wordIndex, ', получено', words[wordIndex] || 'ничего');
          return false;
        }
        wordIndex++;
      }
    }

    // Проверяем, что нет лишних слов
    if (wordIndex !== words.length) {
      console.log('Лишние слова:', words.slice(wordIndex));
      return false;
    }

    // Проверяем уникальность профессии (если hasName: true)
    if (structure.hasName) {
      if (typeof window !== 'undefined' && window.spokenHistory) {
        const isDuplicate = window.spokenHistory.includes(baseForm);
        if (isDuplicate) {
          console.log('Профессия уже использовалась:', baseForm);
          return false; // Профессия уже использовалась
        }
      } else {
        console.warn('spokenHistory не доступен');
      }
    }

    console.log('Валидация пройдена для:', text);
    return true;
  }
});
