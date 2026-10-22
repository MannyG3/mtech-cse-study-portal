// Global App State & LocalStorage Synchronization
// Designed for Modern Academic Portal (NEP-2020, 2026 Pattern)

const STORAGE_KEYS = {
  THEME: "mtech_theme_v2",
  COMPLETED_UNITS: "mtech_completed_units_v2",
  CHECKED_TOPICS: "mtech_checked_topics_v2",
  BOOKMARKS: "mtech_bookmarks_v2",
  STUDENT_NOTES: "mtech_student_notes_v2",
  CHAT_HISTORY: "mtech_chat_history_v2",
  GEMINI_API_KEY: "mtech_gemini_api_key_v2",
  ACTIVE_SEMESTER: "mtech_active_sem_v2",
  ACTIVE_COURSE: "mtech_active_course_v2",
};

export const state = {
  theme: localStorage.getItem(STORAGE_KEYS.THEME) || "dark",
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
      text: "👋 **Welcome to your M.Tech Computer Engineering AI Copilot!**\n\nI am calibrated on the Autonomous NEP-2020 curriculum (2026 Pattern). You can ask me to:\n- Explain complex algorithmic recurrences & derivations\n- Walk through distributed consensus & clock synchronization\n- Provide step-by-step model answers for 2M, 5M, and 10M exam questions\n- Review and debug code implementations for **Lab Practice - I**.",
      source: "Neural Syllabus Engine"
    }
  ],
  geminiApiKey: localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY) || "",
  isChatOpen: false,
  isChatDocked: false, // false = floating drawer, true = docked right column
  isRightSidebarOpen: true,
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
