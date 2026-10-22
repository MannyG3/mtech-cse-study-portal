// Global App State & LocalStorage Synchronization
// Designed for Modern Academic Portal (NEP-2020, 2026 Pattern)

const STORAGE_KEYS = {
  THEME: "mtech_theme_v3",
  COMPLETED_UNITS: "mtech_completed_units_v3",
  CHECKED_TOPICS: "mtech_checked_topics_v3",
  BOOKMARKS: "mtech_bookmarks_v3",
  STUDENT_NOTES: "mtech_student_notes_v3",
  CHAT_HISTORY: "mtech_chat_history_v3",
  GEMINI_API_KEY: "mtech_gemini_api_key_v3",
  ACTIVE_SEMESTER: "mtech_active_sem_v3",
  ACTIVE_COURSE: "mtech_active_course_v3",
};

export const state = {
  theme: localStorage.getItem(STORAGE_KEYS.THEME) || "light",
  activeSemesterId: localStorage.getItem(STORAGE_KEYS.ACTIVE_SEMESTER) || "sem1",
  activeCourseCode: localStorage.getItem(STORAGE_KEYS.ACTIVE_COURSE) || "2604PCC501",
  activeTab: "units", // 'units' | 'notes' | 'lab' | 'questions' | 'books'
  completedUnits: JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLETED_UNITS) || "[]"),
  checkedTopics: JSON.parse(localStorage.getItem(STORAGE_KEYS.CHECKED_TOPICS) || "[]"),
  bookmarks: JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS) || "[]"),
  studentNotes: JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENT_NOTES) || "{}"),
  chatHistory: JSON.parse(localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY) || "null") || [
    {
      sender: "bot",
      time: "Just now",
      text: "Welcome to your syllabus study assistant. You can ask for derivations, proof sketches, algorithm runtimes, or sample exam questions for any unit in the curriculum.",
      source: "Syllabus Reference"
    }
  ],
  geminiApiKey: localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY) || "",
  isAiDrawerOpen: false,
  isRightSidebarOpen: true,
  isStudyMenuOpen: false,
  isTimerMenuOpen: false,
  activeModal: null, // 'quiz' | 'flashcards' | 'calc' | 'search' | 'settings' | null
  modalData: null,
  mobileSidebarOpen: false,
  questionMarksFilter: "ALL", // 'ALL' | 2 | 5 | 10
  pomodoro: {
    seconds: 25 * 60,
    isRunning: false,
    timerId: null,
    mode: 'work' // 'work' | 'break'
  }
};

export function saveState() {
  localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
  localStorage.setItem(STORAGE_KEYS.ACTIVE_SEMESTER, state.activeSemesterId);
  localStorage.setItem(STORAGE_KEYS.ACTIVE_COURSE, state.activeCourseCode);
  localStorage.setItem(STORAGE_KEYS.COMPLETED_UNITS, JSON.stringify(state.completedUnits));
  localStorage.setItem(STORAGE_KEYS.CHECKED_TOPICS, JSON.stringify(state.checkedTopics));
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(state.bookmarks));
  localStorage.setItem(STORAGE_KEYS.STUDENT_NOTES, JSON.stringify(state.studentNotes));
  localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(state.chatHistory));
  localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, state.geminiApiKey);
}

export function toggleUnitCompleted(unitId) {
  const idx = state.completedUnits.indexOf(unitId);
  if (idx === -1) {
    state.completedUnits.push(unitId);
  } else {
    state.completedUnits.splice(idx, 1);
  }
  saveState();
}

export function toggleTopicChecked(topicId) {
  const idx = state.checkedTopics.indexOf(topicId);
  if (idx === -1) {
    state.checkedTopics.push(topicId);
  } else {
    state.checkedTopics.splice(idx, 1);
  }
  saveState();
}

export function saveStudentNote(courseCode, noteText) {
  state.studentNotes[courseCode] = noteText;
  saveState();
}
