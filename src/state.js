// Global App State & LocalStorage Persistence
// M.Tech CSE Academic Workspace

import { MAX_CHAT_MESSAGES } from './utils.js';

const STORAGE_KEYS = {
  THEME: "mtech_workspace_theme",
  ACTIVE_VIEW: "mtech_active_view",
  ACTIVE_SEMESTER: "mtech_active_sem",
  ACTIVE_COURSE: "mtech_active_course",
  COMPLETED_UNITS: "mtech_completed_units",
  CHECKED_TOPICS: "mtech_checked_topics",
  BOOKMARKS: "mtech_bookmarks",
  STUDENT_NOTES: "mtech_student_notes",
  STUDY_TASKS: "mtech_study_tasks",
  RECENTLY_VIEWED: "mtech_recently_viewed",
  PAPER_STATUS: "mtech_paper_status",
  PAPER_NOTES: "mtech_paper_notes",
  CHAT_HISTORY: "mtech_chat_history",
  GEMINI_API_KEY: "mtech_gemini_api_key",
};

const DEFAULT_WELCOME = {
  sender: "bot",
  time: "Just now",
  text: "Welcome to your M.Tech Academic Assistant. I am grounded in your syllabus, course outcomes, research papers, and lab manuals. Ask me to explain derivations, solve recurrences, or generate viva questions.",
  source: "Syllabus Reference"
};

const DEFAULT_TASKS = [
  {
    id: "task_1",
    title: "Master Strassen's Matrix Multiplication Recurrence",
    description: "Derive T(n) = 7T(n/2) + O(n^2) = O(n^2.807) for Continuous Assessment Exam (CAE).",
    courseCode: "2604PCC501",
    dueDate: "2026-11-05",
    priority: "urgent",
    completed: false,
    createdAt: Date.now() - 86400000
  },
  {
    id: "task_2",
    title: "Implement 0/1 Knapsack in Lab Practice - I",
    description: "Write bottom-up DP table and backtracking algorithm in Python.",
    courseCode: "2604PCC526",
    dueDate: "2026-11-10",
    priority: "high",
    completed: false,
    createdAt: Date.now() - 43200000
  },
  {
    id: "task_3",
    title: "Read Chandy-Lamport (1985) Paper on Distributed Snapshots",
    description: "Review FIFO channel markers and state recording mechanism.",
    courseCode: "2604PCC504",
    dueDate: "2026-11-15",
    priority: "normal",
    completed: false,
    createdAt: Date.now() - 21600000
  }
];

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null || raw === "") return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function loadString(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

export const state = {
  theme: loadString(STORAGE_KEYS.THEME, "dark"),
  activeView: loadString(STORAGE_KEYS.ACTIVE_VIEW, "dashboard"),
  activeSemesterId: loadString(STORAGE_KEYS.ACTIVE_SEMESTER, "sem1"),
  activeCourseCode: loadString(STORAGE_KEYS.ACTIVE_COURSE, "2604PCC501"),
  activeTab: "units",

  completedUnits: loadJSON(STORAGE_KEYS.COMPLETED_UNITS, []),
  checkedTopics: loadJSON(STORAGE_KEYS.CHECKED_TOPICS, []),

  bookmarks: loadJSON(STORAGE_KEYS.BOOKMARKS, []),
  recentlyViewed: loadJSON(STORAGE_KEYS.RECENTLY_VIEWED, []),

  studyTasks: loadJSON(STORAGE_KEYS.STUDY_TASKS, null) ?? DEFAULT_TASKS,
  studentNotes: loadJSON(STORAGE_KEYS.STUDENT_NOTES, {}),

  paperStatus: loadJSON(STORAGE_KEYS.PAPER_STATUS, {}),
  paperNotes: loadJSON(STORAGE_KEYS.PAPER_NOTES, {}),

  resourceFilter: {
    semester: "ALL",
    subject: "ALL",
    type: "ALL",
    search: ""
  },

  isAiDrawerOpen: false,
  isRightSidebarOpen: true,
  mobileSidebarOpen: false,
  activeModal: null,
  modalData: null,
  questionMarksFilter: "ALL",
  expandedUnits: {},

  pomodoro: {
    seconds: 25 * 60,
    isRunning: false,
    timerId: null,
    mode: 'work'
  },

  geminiApiKey: loadString(STORAGE_KEYS.GEMINI_API_KEY, ""),
  chatHistory: loadJSON(STORAGE_KEYS.CHAT_HISTORY, null) ?? [DEFAULT_WELCOME]
};

export function saveState() {
  try {
    if (Array.isArray(state.chatHistory) && state.chatHistory.length > MAX_CHAT_MESSAGES) {
      state.chatHistory = state.chatHistory.slice(-MAX_CHAT_MESSAGES);
    }

    localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_VIEW, state.activeView);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SEMESTER, state.activeSemesterId);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_COURSE, state.activeCourseCode);
    localStorage.setItem(STORAGE_KEYS.COMPLETED_UNITS, JSON.stringify(state.completedUnits));
    localStorage.setItem(STORAGE_KEYS.CHECKED_TOPICS, JSON.stringify(state.checkedTopics));
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(state.bookmarks));
    localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(state.recentlyViewed));
    localStorage.setItem(STORAGE_KEYS.STUDY_TASKS, JSON.stringify(state.studyTasks));
    localStorage.setItem(STORAGE_KEYS.STUDENT_NOTES, JSON.stringify(state.studentNotes));
    localStorage.setItem(STORAGE_KEYS.PAPER_STATUS, JSON.stringify(state.paperStatus));
    localStorage.setItem(STORAGE_KEYS.PAPER_NOTES, JSON.stringify(state.paperNotes));
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(state.chatHistory));
    localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, state.geminiApiKey);
  } catch (err) {
    console.warn("Unable to persist workspace state:", err);
  }
}

export function trackRecentlyViewed(item) {
  const filtered = state.recentlyViewed.filter(x => x.id !== item.id);
  filtered.unshift({
    ...item,
    timestamp: Date.now()
  });
  state.recentlyViewed = filtered.slice(0, 10);
  saveState();
}

export function toggleBookmarkItem(item) {
  const idx = state.bookmarks.findIndex(x => x.id === item.id);
  if (idx === -1) {
    state.bookmarks.unshift({
      ...item,
      bookmarkedAt: Date.now()
    });
  } else {
    state.bookmarks.splice(idx, 1);
  }
  saveState();
}

export function isItemBookmarked(id) {
  return state.bookmarks.some(x => x.id === id);
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

export function addStudyTask(task) {
  const newTask = {
    id: `task_${Date.now()}`,
    title: task.title,
    description: task.description || "",
    courseCode: task.courseCode || "GENERAL",
    dueDate: task.dueDate || "",
    priority: task.priority || "normal",
    completed: false,
    createdAt: Date.now()
  };
  state.studyTasks.unshift(newTask);
  saveState();
  return newTask;
}

export function toggleTaskCompleted(taskId) {
  const t = state.studyTasks.find(x => x.id === taskId);
  if (t) {
    t.completed = !t.completed;
    saveState();
  }
}

export function deleteStudyTask(taskId) {
  state.studyTasks = state.studyTasks.filter(x => x.id !== taskId);
  saveState();
}

export function setPaperStatus(paperId, status) {
  state.paperStatus[paperId] = status;
  saveState();
}

export function savePaperNote(paperId, noteText) {
  state.paperNotes[paperId] = noteText;
  saveState();
}

export function saveStudentNote(courseCode, noteText) {
  state.studentNotes[courseCode] = noteText;
  saveState();
}

export function getDefaultWelcomeMessage() {
  return { ...DEFAULT_WELCOME };
}
