const lessonsData = [];

// Load lessons in order
// Lesson 1 (Beginner Part One)
document.write('<script src="lessons/lesson1_beginner1.js"></script>');
// Lesson 3 (Beginner Part One)
document.write('<script src="lessons/lesson3_beginner1.js"></script>');

// Function to add lesson data (called by each lesson file)
function addLesson(lesson) {
  lessonsData.push(lesson);
}