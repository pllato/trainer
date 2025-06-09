const lessonsData = [];
let isFetchingLessons = false;
let lastValidatedText = null;
let lastValidatedTime = 0;

// Function to add lesson data
function addLesson(lesson) {
  if (!lessonsData.some(existing => existing.lesson === lesson.lesson && existing.level === lesson.level)) {
    lessonsData.push(lesson);
    console.log('Lesson added:', lesson.name, 'Total lessons:', lessonsData.length);
  } else {
    console.log('Duplicate lesson skipped:', lesson.name);
  }
}

// Function to populate lesson select dropdown
function populateLessonSelect(attempt = 1, maxAttempts = 20) {
  const levelLessonScreen = document.getElementById('level-lesson-screen');
  if (levelLessonScreen && levelLessonScreen.style.display === 'none') {
    console.log('Level-lesson screen is hidden, skipping populateLessonSelect');
    return;
  }

  const lessonSelect = document.getElementById('lesson');
  if (!lessonSelect) {
    if (attempt < maxAttempts) {
      console.warn(`Lesson select element not found, retrying in 1s (attempt ${attempt}/${maxAttempts})`);
      console.log('Current DOM state:', document.body ? document.body.innerHTML.substring(0, 200) : 'No body');
      setTimeout(() => populateLessonSelect(attempt + 1, maxAttempts), 1000);
    } else {
      console.error('Lesson select element not found after max attempts');
    }
    return;
  }
  lessonSelect.innerHTML = '<option value="">Выберите урок</option>';

  lessonsData.sort((a, b) => {
    if (a.level === b.level) {
      const lessonA = parseInt(a.lesson.replace('lesson', '')) || 0;
      const lessonB = parseInt(b.lesson.replace('lesson', '')) || 0;
      return lessonA - lessonB;
    }
    return a.level.localeCompare(b.level);
  });

  lessonsData.forEach(lesson => {
    const option = document.createElement('option');
    option.value = lesson.lesson;
    option.textContent = lesson.name;
    lessonSelect.appendChild(option);
  });
  console.log('Lesson select populated with', lessonsData.length, 'lessons');
}

// Fetch lessons from GitHub API
async function fetchLessons() {
  if (isFetchingLessons) {
    console.log('fetchLessons already running, skipping');
    return;
  }
  isFetchingLessons = true;
  const url = 'https://api.github.com/repos/pllato/elc-trainer/contents/lessons';
  console.log('Starting to fetch lessons from:', url);
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const files = await response.json();
    console.log('Files fetched from GitHub:', files.length, 'files');

    for (const file of files.filter(f => f.name.endsWith('.js'))) {
      console.log('Processing file:', file.name);
      try {
        const fileResponse = await fetch(file.download_url);
        if (!fileResponse.ok) {
          throw new Error(`Failed to fetch ${file.name}`);
        }
        const content = await fileResponse.text();
        eval(content);
        console.log('Loaded file:', file.name);
      } catch (error) {
        console.error('Error loading file:', file.name, error);
      }
    }

    console.log('Lessons loaded from GitHub:', lessonsData.length, 'lessons');
    setTimeout(() => populateLessonSelect(), 180000); // Increased delay to 180 seconds
  } catch (error) {
    console.error('Error loading lessons:', error);
    if (lessonsData.length > 0) {
      populateLessonSelect();
    }
  } finally {
    isFetchingLessons = false;
  }
}

// Reset lesson state
function resetLessonState() {
  window.lessonStarted = false;
  window.usedVerbs = [];
  window.userProgress = {};
  lastValidatedText = null;
  lastValidatedTime = 0;
  console.log('Lesson state reset');
  // Reset overall progress bar
  const overallProgress = document.getElementById('overall-progress');
  const overallProgressText = document.getElementById('overall-progress-text');
  if (overallProgress) {
    overallProgress.style.width = '0%';
  }
  if (overallProgressText) {
    overallProgressText.textContent = '0/0';
  }
  // Reset individual progress bars
  const progressBars = document.getElementById('progress-bars');
  if (progressBars) {
    progressBars.innerHTML = '';
  }
}

// Update overall progress bar
function updateOverallProgress(lessonId) {
  const lesson = lessonsData.find(l => l.lesson === lessonId);
  if (!lesson || !lesson.structures) {
    console.log(`Lesson ${lessonId} not found or has no structures`);
    return;
  }

  const totalRequired = lesson.structures.length * lesson.requiredCorrect;
  let totalCorrect = 0;

  // Calculate total progress based on capped contributions
  lesson.structures.forEach(structure => {
    if (!structure.id) {
      console.warn('Structure ID is undefined:', structure);
      return;
    }
    const count = window.userProgress[structure.id] || 0;
    const cappedCount = Math.min(count, lesson.requiredCorrect);
    totalCorrect += cappedCount;
    console.log(`Structure ${structure.id}: ${cappedCount}/${lesson.requiredCorrect}, Contributes: ${cappedCount} to total`);
  });

  totalCorrect = Math.min(totalCorrect, totalRequired);
  console.log(`Total progress: ${totalCorrect}/${totalRequired}`);

  const overallProgress = document.getElementById('overall-progress');
  const overallProgressText = document.getElementById('overall-progress-text');
  if (overallProgress && overallProgressText) {
    const percentage = (totalCorrect / totalRequired) * 100;
    overallProgress.style.width = `${percentage}%`;
    overallProgressText.textContent = `${totalCorrect}/${totalRequired}`;
    console.log(`Overall progress: ${totalCorrect}/${totalRequired}, Percentage: ${percentage}%`);
  } else {
    console.log('Overall progress elements not found');
  }
}

// Update individual progress bars
function updateProgressBars(lessonId) {
  if (!lessonId) {
    console.log('lessonId is undefined, cannot update progress bars');
    return;
  }

  const lesson = lessonsData.find(l => l.lesson === lessonId);
  if (!lesson || !lesson.structures) {
    console.log(`Lesson ${lessonId} not found or has no structures`);
    return;
  }

  const progressBars = document.getElementById('progress-bars');
  if (!progressBars) {
    console.log('Progress bars container not found');
    return;
  }

  progressBars.innerHTML = '';
  lesson.structures.forEach((struct, index) => {
    if (!struct.id) {
      console.warn(`Structure ID is undefined at index ${index}:`, struct);
      // Присваиваем временный ID, если он отсутствует
      struct.id = `struct-${index}`;
    }
    const totalCorrect = window.userProgress[struct.id] || 0;
    const div = document.createElement('div');
    div.className = 'mb-2';
    div.setAttribute('data-structure', struct.id);

    let barsHTML = `
      <p class="text-sm">${struct.structure || 'Unknown structure'}</p>
    `;

    const firstBarProgress = Math.min(totalCorrect, lesson.requiredCorrect);
    const firstBarPercentage = (firstBarProgress / lesson.requiredCorrect) * 100;
    console.log(`Structure: ${struct.structure}, Total Correct: ${totalCorrect}, First Bar Percentage: ${firstBarPercentage}%`);
    barsHTML += `
      <div class="w-full bg-gray-200 rounded-full h-2.5 mb-1">
        <div class="progress bg-[#373D8D] h-2.5 rounded-full" style="width: ${firstBarPercentage}%"></div>
      </div>
    `;

    barsHTML += `
      <p class="text-xs text-gray-600">${totalCorrect}/${lesson.requiredCorrect}</p>
    `;
    div.innerHTML = barsHTML;
    progressBars.appendChild(div);
  });

  updateOverallProgress(lessonId);
}

// Update progress for a specific structure
function updateProgress(structureId, isCorrect, lessonId) {
  if (!window.userProgress) window.userProgress = {};
  if (!window.userProgress[structureId]) window.userProgress[structureId] = 0;

  const lesson = lessonsData.find(l => l.lesson === lessonId);
  const requiredCorrect = lesson ? lesson.requiredCorrect : 10;

  console.log(`Before update: ${structureId}, Current progress: ${window.userProgress[structureId]}/${requiredCorrect}`);

  if (isCorrect && window.userProgress[structureId] < requiredCorrect) {
    window.userProgress[structureId]++;
    console.log(`Updated progress for ${structureId}: ${window.userProgress[structureId]}/${requiredCorrect}`);
    updateProgressBars(lessonId);
  } else if (isCorrect) {
    console.log(`Excess answer for ${structureId}, not counted: ${window.userProgress[structureId]}/${requiredCorrect}`);
  }
}

// Handle lesson selection
function selectLesson(lessonId) {
  resetLessonState();
  const lesson = lessonsData.find(l => l.lesson === lessonId);
  if (lesson) {
    console.log(`Selected lesson: ${lesson.name}`);
  }
}

// SpeechRecognition handler
function startRecognition() {
  if (window.recognition && window.recognition.state === 'listening') {
    console.log('Распознавание уже активно');
    return;
  }

  window.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  window.recognition.lang = 'en'; // Убрали региональную привязку для большей гибкости
  window.recognition.continuous = true; // Включаем непрерывное распознавание
  window.recognition.interimResults = false; // Только финальные результаты

  const micIndicator = document.getElementById('mic-indicator');
  if (micIndicator) {
    micIndicator.textContent = 'Микрофон: Слушает...';
    micIndicator.className = 'text-green-600';
  }

  window.recognition.onresult = function(event) {
    const text = event.results[event.results.length - 1][0].transcript;
    const cleanedText = text.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    console.log('Распознанный текст:', cleanedText);
    const now = Date.now();
    if (cleanedText !== lastValidatedText || now - lastValidatedTime > 15000) {
      validateInput(cleanedText);
      lastValidatedText = cleanedText;
      lastValidatedTime = now;
    } else {
      console.log('Повторный ввод пропущен:', cleanedText);
    }
  };

  window.recognition.onerror = function(event) {
    console.error('Ошибка распознавания:', event.error);
    if (micIndicator) {
      micIndicator.textContent = `Микрофон: Ошибка (${event.error})`;
      micIndicator.className = 'text-red-600';
    }
    const errorMessage = document.createElement('p');
    errorMessage.className = 'text-red-600 text-sm mb-1';
    errorMessage.textContent = `Ошибка распознавания: ${event.error}. Проверьте микрофон или интернет.`;
    const log = document.getElementById('log');
    if (log) log.appendChild(errorMessage);

    if (event.error === 'network') {
      console.log('Проблема с сетью, пытаемся перезапустить через 5 секунд');
    } else if (event.error === 'no-speech') {
      console.log('Речь не обнаружена, продолжаем слушать');
      return; // Не останавливаем для no-speech
    } else if (event.error === 'aborted') {
      console.log('Распознавание прервано, перезапускаем');
    }

    window.recognition = null;
  };

  window.recognition.onend = function() {
    console.log('Распознавание завершено');
    if (micIndicator) {
      micIndicator.textContent = 'Микрофон: Остановлен';
      micIndicator.className = 'text-red-600';
    }
    window.recognition = null;
    // Показываем кнопку перезапуска
    const restartButton = document.getElementById('restart-listening-btn');
    if (restartButton) restartButton.classList.remove('hidden');

    // Перезапускаем через 5 секунд, если не активно
    setTimeout(() => {
      if (!window.recognition || window.recognition.state !== 'listening') {
        console.log('Перезапуск SpeechRecognition');
        startRecognition();
      }
    }, 5000);
  };

  try {
    window.recognition.start();
    console.log('SpeechRecognition запущен');
    if (micIndicator) {
      micIndicator.textContent = 'Микрофон: Слушает...';
      micIndicator.className = 'text-green-600';
    }
    // Скрываем кнопку перезапуска при старте
    const restartButton = document.getElementById('restart-listening-btn');
    if (restartButton) restartButton.classList.add('hidden');
  } catch (error) {
    console.error('Ошибка при запуске SpeechRecognition:', error);
    if (micIndicator) {
      micIndicator.textContent = 'Микрофон: Ошибка запуска';
      micIndicator.className = 'text-red-600';
    }
    const errorMessage = document.createElement('p');
    errorMessage.className = 'text-red-600 text-sm mb-1';
    errorMessage.textContent = 'Не удалось запустить распознавание. Проверьте микрофон и настройки браузера.';
    const log = document.getElementById('log');
    if (log) log.appendChild(errorMessage);
  }
}

// Validate input
function validateInput(text, lessonId = 'lesson13') {
  const lesson = lessonsData.find(l => l.lesson === lessonId);
  if (!lesson) {
    console.log(`Lesson ${lessonId} not found`);
    return;
  }

  let isCorrect = false;
  let currentStructure;
  for (const structure of lesson.structures) {
    if (lesson.validateStructure(text, structure)) {
      isCorrect = true;
      currentStructure = structure;
      break;
    }
  }

  console.log(`Validation result for "${text}": ${isCorrect ? 'Correct' : 'Incorrect'}`);
  if (isCorrect) {
    updateProgress(currentStructure.id, true, lessonId);
  }
}

// Start fetching lessons
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, starting fetchLessons');
  fetchLessons();
}, { once: true });
