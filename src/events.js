// Centralized Event Delegation & Global Shortcuts
import { 
  state, 
  saveState, 
  trackRecentlyViewed, 
  toggleBookmarkItem, 
  toggleUnitCompleted, 
  toggleTopicChecked, 
  addStudyTask, 
  toggleTaskCompleted, 
  deleteStudyTask, 
  setPaperStatus, 
  savePaperNote, 
  saveStudentNote,
  getDefaultWelcomeMessage
} from './state.js';
import { SEMESTERS } from './data/curriculum.js';
import { ACADEMIC_RESOURCES } from './data/resources.js';
import { 
  renderApp, 
  updateMainContent, 
  updateSidebar, 
  updateRightPanel, 
  updateModalLayer, 
  updateAiDrawer, 
  refreshResourceResults, 
  showToast, 
  findCourseByCode, 
  getActiveSemester 
} from './renderer.js';
import { updateTimerDisplay } from './components/header.js';
import { executeAiQuery } from './components/aiDrawer.js';
import { 
  searchCommandPalette, 
  commandPaletteMatches, 
  finishQuizAction, 
  runMarksCalculator 
} from './components/modals.js';
import { 
  runKnapsackSim, 
  runPlatformsSim, 
  runTwoGeneralsSim, 
  runBullyElectionSim 
} from './simulations.js';

let eventsBound = false;

export function bindAppEvents(appEl) {
  if (eventsBound) return;
  eventsBound = true;

  window.addEventListener('keydown', onGlobalKeydown);
  appEl.addEventListener('click', onAppClick);
  appEl.addEventListener('change', onAppChange);
  appEl.addEventListener('input', onAppInput);
  appEl.addEventListener('submit', onAppSubmit);
}

function onGlobalKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    state.activeModal = 'search';
    updateModalLayer();
  }
  if (e.key === 'Escape' && (state.activeModal || state.isAiDrawerOpen)) {
    state.activeModal = null;
    state.isAiDrawerOpen = false;
    updateModalLayer();
    updateAiDrawer();
  }
}

export function setView(view) {
  state.activeView = view;
  state.mobileSidebarOpen = false;
  saveState();
  renderApp();
}

export function openCourse(code, tab = 'units', expandUnitId = null) {
  state.activeCourseCode = code;
  state.activeView = 'course';
  state.activeTab = tab;
  state.mobileSidebarOpen = false;
  if (expandUnitId) {
    state.expandedUnits[expandUnitId] = true;
  }
  const course = findCourseByCode(code);
  if (course) {
    trackRecentlyViewed({
      id: `course_${course.code}`,
      title: course.title,
      subtitle: `${course.code} • ${course.credits} credits`,
      code: course.code,
      tab
    });
  }
  saveState();
  renderApp();
}

export function closeModal() {
  state.activeModal = null;
  state.modalData = null;
  updateModalLayer();
}

export function openAiDrawer(query) {
  state.isAiDrawerOpen = true;
  updateAiDrawer();
  if (query) {
    executeAiQuery(query, state, updateAiDrawer);
  } else {
    setTimeout(() => document.getElementById('aiDrawerInput')?.focus(), 60);
  }
}

function onAppClick(e) {
  if (e.target.id === 'modalBackdrop') {
    closeModal();
    return;
  }

  const t = e.target.closest([
    '#toggleMobileNavBtn', '#brandHomeNav', '#resumeStudyingBtn', '#dashOpenPlannerBtn',
    '#dashOpenResearchBtn', '#dashAddTaskModalBtn', '#openNewTaskModalBtn', '#themeSwitchBtn',
    '#toggleRightPanelBtn', '#timerWidgetBtn', '#openCommandPaletteBtn', '#openAiDrawerTrigger',
    '#closeAiDrawerBtn', '#aiDrawerOverlayBackdrop', '#jumpUnitOneBtn', '#openLabDirectBtn',
    '#jumpToLabTabBtn', '#askCourseAiBtn', '#printSyllabusBtn', '#saveCourseNoteBtn',
    '#resetResourceFilterBtn', '#exploreResourcesBtn', '#closeGenericModalBtn',
    '#closeGenericModalActionBtn', '#cancelTaskModalBtn', '#clearChatBtn',
    '#openAiSettingsBtn', '#saveApiKeyQuietBtn', '#clearApiKeyQuietBtn', '#openQuizShortcut',
    '#openFlashShortcut', '#openCalcShortcut', '#runKnapsackSim', '#runPlatformsSim',
    '#runTwoGeneralsSim', '#runBullyElectionSim', '#nextQuizQuestionBtn', '#prevQuizQuestionBtn',
    '#finishQuizQuestionBtn', '#flipCardSurfaceEl', '#nextFlashCardBtn', '#prevFlashCardBtn',
    '#runCalcMarksBtn',
    '[data-nav-view]', '[data-select-course]', '[data-tab]', '[data-jump-course]',
    '[data-jump-recent-id]', '[data-toggle-unit-idx]', '[data-topic-check-key]',
    '[data-jump-to-notes-tab]', '[data-unit-ask-ai]', '[data-ai-concept-ask]',
    '[data-copy-math-text]', '[data-ai-answer-q]', '[data-open-resource-id]',
    '[data-print-resource-id]', '[data-bookmark-resource-id]', '[data-toggle-task-id]',
    '[data-delete-task-id]', '[data-copy-bibtex]', '[data-paper-notes-toggle]',
    '[data-save-paper-note]', '[data-bookmark-paper-id]', '[data-remove-bookmark-id]',
    '[data-jump-bookmark-code]', '[data-send-ai-prompt]', '[data-copy-lab-code-id]',
    '[data-filter-lab-part]', '[data-quiz-option]', '[data-cmd-match-idx]', '[data-marks-filter]'
  ].join(','));

  if (!t) return;
  const id = t.id;

  if (id === 'toggleMobileNavBtn') {
    state.mobileSidebarOpen = !state.mobileSidebarOpen;
    updateSidebar();
    return;
  }
  if (id === 'brandHomeNav') {
    setView('dashboard');
    return;
  }
  if (t.dataset.navView) {
    setView(t.dataset.navView);
    return;
  }
  if (t.dataset.selectCourse) {
    openCourse(t.dataset.selectCourse);
    return;
  }
  if (t.dataset.jumpCourse) {
    openCourse(t.dataset.jumpCourse);
    return;
  }
  if (t.dataset.jumpRecentId) {
    const code = t.getAttribute('data-jump-recent-code');
    const tab = t.getAttribute('data-jump-recent-tab') || 'units';
    if (code) openCourse(code, tab);
    return;
  }
  if (id === 'themeSwitchBtn') {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    saveState();
    renderApp();
    showToast(`Switched to ${state.theme} mode`);
    return;
  }
  if (id === 'toggleRightPanelBtn') {
    state.isRightSidebarOpen = !state.isRightSidebarOpen;
    saveState();
    renderApp();
    return;
  }
  if (id === 'timerWidgetBtn') {
    togglePomodoroTimer();
    return;
  }
  if (id === 'openCommandPaletteBtn') {
    state.activeModal = 'search';
    updateModalLayer();
    return;
  }
  if (id === 'openAiDrawerTrigger') {
    openAiDrawer();
    return;
  }
  if (id === 'closeAiDrawerBtn' || id === 'aiDrawerOverlayBackdrop') {
    state.isAiDrawerOpen = false;
    updateAiDrawer();
    return;
  }
  if (id === 'dashOpenPlannerBtn' || id === 'openNewTaskModalBtn' || id === 'dashAddTaskModalBtn') {
    state.activeModal = 'taskModal';
    updateModalLayer();
    return;
  }
  if (id === 'dashOpenResearchBtn') {
    setView('research');
    return;
  }
  if (t.dataset.tab) {
    state.activeTab = t.dataset.tab;
    saveState();
    updateMainContent();
    return;
  }
  if (id === 'jumpUnitOneBtn') {
    state.activeTab = 'units';
    state.expandedUnits[`${state.activeCourseCode}_unit_0`] = true;
    updateMainContent();
    return;
  }
  if (id === 'openLabDirectBtn' || id === 'jumpToLabTabBtn') {
    state.activeTab = 'lab';
    updateMainContent();
    return;
  }
  if (id === 'askCourseAiBtn') {
    openAiDrawer(`Summarize the syllabus, course outcomes, and exam preparation tips for ${state.activeCourseCode}`);
    return;
  }
  if (id === 'printSyllabusBtn') {
    window.print();
    return;
  }
  if (t.dataset.toggleUnitIdx != null) {
    const idx = t.dataset.toggleUnitIdx;
    const card = document.getElementById(`unitCard_${idx}`);
    card?.classList.toggle('open');
    const chk = card?.querySelector('.unit-mastery-chk');
    const unitId = chk?.getAttribute('data-u-id');
    if (unitId) state.expandedUnits[unitId] = card.classList.contains('open');
    return;
  }
  if (t.dataset.topicCheckKey) {
    toggleTopicChecked(t.dataset.topicCheckKey);
    updateMainContent();
    return;
  }
  if (t.dataset.jumpToNotesTab) {
    state.activeTab = 'notes';
    updateMainContent();
    return;
  }
  if (t.dataset.unitAskAi) {
    openAiDrawer(`Explain unit: "${t.dataset.unitAskAi}" in detail with key theorems, derivations, and exam points.`);
    return;
  }
  if (t.dataset.aiConceptAsk) {
    openAiDrawer(`Provide an in-depth derivation and exam solution for concept: "${t.dataset.aiConceptAsk}". Include formulas and complexities.`);
    return;
  }
  if (t.dataset.copyMathText) {
    navigator.clipboard.writeText(t.dataset.copyMathText);
    showToast("Formula copied to clipboard");
    return;
  }
  if (t.dataset.aiAnswerQ) {
    openAiDrawer(`Please draft a comprehensive university exam answer with step-by-step points for: "${t.dataset.aiAnswerQ}"`);
    return;
  }
  if (id === 'saveCourseNoteBtn') {
    const text = document.getElementById('courseScratchpadArea')?.value || "";
    saveStudentNote(state.activeCourseCode, text);
    const status = document.getElementById('scratchpadSaveStatus');
    if (status) {
      status.textContent = "Saved";
      status.style.color = "var(--status-success)";
    }
    showToast("Personal note saved");
    return;
  }
  if (t.dataset.openResourceId) {
    const res = ACADEMIC_RESOURCES.find(r => r.id === t.dataset.openResourceId);
    if (res) {
      state.activeModal = 'pdfReader';
      state.modalData = { resource: res };
      updateModalLayer();
      trackRecentlyViewed({
        id: res.id,
        title: res.title,
        subtitle: `${res.type} • ${res.subjectTitle}`
      });
    }
    return;
  }
  if (t.dataset.printResourceId) {
    window.print();
    return;
  }
  if (t.dataset.bookmarkResourceId) {
    const res = ACADEMIC_RESOURCES.find(r => r.id === t.dataset.bookmarkResourceId);
    if (res) {
      toggleBookmarkItem({
        id: res.id,
        title: res.title,
        subtitle: `${res.type} • ${res.subjectTitle}`,
        type: res.type
      });
      refreshResourceResults();
      showToast("Resource bookmark updated");
    }
    return;
  }
  if (id === 'resetResourceFilterBtn') {
    state.resourceFilter = { semester: 'ALL', subject: 'ALL', type: 'ALL', search: '' };
    const searchInput = document.getElementById('resourceSearchInput');
    if (searchInput) searchInput.value = '';
    const typeSelect = document.getElementById('filterResourceType');
    if (typeSelect) typeSelect.value = 'ALL';
    const subjSelect = document.getElementById('filterResourceSubject');
    if (subjSelect) subjSelect.value = 'ALL';
    refreshResourceResults();
    return;
  }
  if (t.dataset.toggleTaskId) {
    toggleTaskCompleted(t.dataset.toggleTaskId);
    updateMainContent();
    showToast("Task updated");
    return;
  }
  if (t.dataset.deleteTaskId) {
    deleteStudyTask(t.dataset.deleteTaskId);
    updateMainContent();
    showToast("Task deleted");
    return;
  }
  if (t.dataset.copyBibtex) {
    copyBibtex(t.dataset.copyBibtex);
    return;
  }
  if (t.dataset.paperNotesToggle) {
    const box = document.getElementById(`noteBox_${t.dataset.paperNotesToggle}`);
    if (box) box.style.display = box.style.display === 'none' ? 'block' : 'none';
    return;
  }
  if (t.dataset.savePaperNote) {
    const id = t.dataset.savePaperNote;
    const txt = document.getElementById(`paperNoteInput_${id}`)?.value || "";
    savePaperNote(id, txt);
    showToast("Research notes saved!");
    return;
  }
  if (t.dataset.bookmarkPaperId) {
    toggleBookmarkItem({
      id: t.dataset.bookmarkPaperId,
      title: `Paper: ${t.dataset.bookmarkPaperId}`,
      type: "Research Paper"
    });
    updateMainContent();
    showToast("Paper bookmark updated");
    return;
  }
  if (t.dataset.removeBookmarkId) {
    toggleBookmarkItem({ id: t.dataset.removeBookmarkId });
    updateMainContent();
    showToast("Bookmark removed");
    return;
  }
  if (t.dataset.jumpBookmarkCode) {
    openCourse(t.dataset.jumpBookmarkCode, t.getAttribute('data-jump-bookmark-tab') || 'units');
    return;
  }
  if (id === 'exploreResourcesBtn') {
    setView('resources');
    return;
  }
  if (id === 'closeGenericModalBtn' || id === 'closeGenericModalActionBtn' || id === 'cancelTaskModalBtn') {
    closeModal();
    return;
  }
  if (t.dataset.sendAiPrompt) {
    executeAiQuery(t.dataset.sendAiPrompt, state, updateAiDrawer);
    return;
  }
  if (id === 'clearChatBtn') {
    state.chatHistory = [getDefaultWelcomeMessage()];
    saveState();
    updateAiDrawer();
    return;
  }
  if (id === 'openAiSettingsBtn') {
    state.activeModal = 'settings';
    updateModalLayer();
    return;
  }
  if (id === 'saveApiKeyQuietBtn') {
    state.geminiApiKey = document.getElementById('geminiApiKeySetting')?.value.trim() || '';
    saveState();
    closeModal();
    showToast("Gemini API key saved!");
    return;
  }
  if (id === 'clearApiKeyQuietBtn') {
    state.geminiApiKey = "";
    saveState();
    closeModal();
    showToast("API key cleared");
    return;
  }
  if (id === 'openQuizShortcut') {
    state.activeModal = 'quiz';
    state.modalData = { quizIndex: 0, userAnswers: {} };
    updateModalLayer();
    return;
  }
  if (id === 'openFlashShortcut') {
    state.activeModal = 'flashcards';
    state.modalData = { flashIndex: 0, isFlipped: false };
    updateModalLayer();
    return;
  }
  if (id === 'openCalcShortcut') {
    state.activeModal = 'calc';
    updateModalLayer();
    return;
  }
  if (id === 'runKnapsackSim') {
    runKnapsackSim(showToast);
    return;
  }
  if (id === 'runPlatformsSim') {
    runPlatformsSim(showToast);
    return;
  }
  if (id === 'runTwoGeneralsSim') {
    runTwoGeneralsSim();
    return;
  }
  if (id === 'runBullyElectionSim') {
    runBullyElectionSim();
    return;
  }
  if (t.dataset.copyLabCodeId) {
    const el = document.getElementById(`code_${t.dataset.copyLabCodeId}`);
    if (el) {
      navigator.clipboard.writeText(el.innerText || el.textContent);
      showToast("Python code copied to clipboard!");
    }
    return;
  }
  if (t.dataset.filterLabPart) {
    const part = t.dataset.filterLabPart;
    document.querySelectorAll('[data-filter-lab-part]').forEach(b => b.classList.remove('active'));
    t.classList.add('active');
    document.querySelectorAll('.lab-split-card').forEach(card => {
      card.style.display = (part === 'ALL' || card.getAttribute('data-lab-card-part') === part) ? 'block' : 'none';
    });
    return;
  }
  if (t.dataset.quizOption != null) {
    if (!state.modalData) state.modalData = { quizIndex: 0, userAnswers: {} };
    if (!state.modalData.userAnswers) state.modalData.userAnswers = {};
    state.modalData.userAnswers[state.modalData.quizIndex] = parseInt(t.dataset.quizOption, 10);
    updateModalLayer();
    return;
  }
  if (id === 'nextQuizQuestionBtn') {
    state.modalData.quizIndex++;
    updateModalLayer();
    return;
  }
  if (id === 'prevQuizQuestionBtn') {
    state.modalData.quizIndex--;
    updateModalLayer();
    return;
  }
  if (id === 'finishQuizQuestionBtn') {
    finishQuizAction(state, (msg) => {
      showToast(msg);
      closeModal();
    });
    return;
  }
  if (id === 'flipCardSurfaceEl') {
    if (!state.modalData) state.modalData = { flashIndex: 0, isFlipped: false };
    state.modalData.isFlipped = !state.modalData.isFlipped;
    updateModalLayer();
    return;
  }
  if (id === 'nextFlashCardBtn') {
    state.modalData.flashIndex++;
    state.modalData.isFlipped = false;
    updateModalLayer();
    return;
  }
  if (id === 'prevFlashCardBtn') {
    state.modalData.flashIndex--;
    state.modalData.isFlipped = false;
    updateModalLayer();
    return;
  }
  if (id === 'runCalcMarksBtn') {
    runMarksCalculator();
    return;
  }
  if (t.dataset.cmdMatchIdx != null) {
    const idx = parseInt(t.dataset.cmdMatchIdx, 10);
    commandPaletteMatches[idx]?.action();
    closeModal();
    return;
  }
  if (t.dataset.marksFilter) {
    state.questionMarksFilter = t.dataset.marksFilter;
    updateMainContent();
  }
}

function onAppChange(e) {
  const t = e.target;
  if (t.id === 'semesterSelector') {
    const semId = t.value;
    state.activeSemesterId = semId;
    const semObj = SEMESTERS.find(s => s.id === semId);
    if (semObj?.courses?.length) state.activeCourseCode = semObj.courses[0].code;
    saveState();
    renderApp();
    showToast(`Switched to ${semObj?.name}`);
    return;
  }
  if (t.classList.contains('unit-mastery-chk')) {
    const uId = t.getAttribute('data-u-id');
    toggleUnitCompleted(uId);
    updateMainContent();
    showToast(state.completedUnits.includes(uId) ? "Unit marked mastered!" : "Unit marked incomplete");
    return;
  }
  if (t.dataset.dashToggleTask || t.dataset.toggleTaskId) {
    toggleTaskCompleted(t.dataset.dashToggleTask || t.dataset.toggleTaskId);
    updateMainContent();
    showToast("Task updated!");
    return;
  }
  if (t.id === 'filterResourceType') {
    state.resourceFilter.type = t.value;
    refreshResourceResults();
    return;
  }
  if (t.id === 'filterResourceSubject') {
    state.resourceFilter.subject = t.value;
    refreshResourceResults();
    return;
  }
  if (t.dataset.paperStatusId) {
    setPaperStatus(t.dataset.paperStatusId, t.value);
    showToast("Reading status updated!");
  }
}

function onAppInput(e) {
  const t = e.target;
  if (t.id === 'resourceSearchInput') {
    state.resourceFilter.search = t.value;
    refreshResourceResults();
    return;
  }
  if (t.id === 'cmdPaletteSearchInput') {
    searchCommandPalette(t.value, openCourse, setView);
    return;
  }
  if (t.id === 'courseScratchpadArea') {
    const status = document.getElementById('scratchpadSaveStatus');
    if (status) {
      status.textContent = 'Unsaved';
      status.style.color = 'var(--status-warning)';
    }
  }
}

function onAppSubmit(e) {
  const t = e.target;
  if (t.id === 'aiDrawerForm') {
    e.preventDefault();
    const input = document.getElementById('aiDrawerInput');
    const q = input?.value.trim();
    if (q) {
      input.value = "";
      executeAiQuery(q, state, updateAiDrawer);
    }
    return;
  }
  if (t.id === 'createTaskForm') {
    e.preventDefault();
    const title = document.getElementById('taskTitleInput')?.value.trim();
    const courseCode = document.getElementById('taskCourseSelect')?.value;
    const dueDate = document.getElementById('taskDateInput')?.value;
    const priority = document.getElementById('taskPrioritySelect')?.value;
    const description = document.getElementById('taskDescInput')?.value.trim();

    if (title) {
      addStudyTask({ title, courseCode, dueDate, priority, description });
      closeModal();
      updateMainContent();
      showToast("Study task added successfully!");
    }
  }
}

function togglePomodoroTimer() {
  if (state.pomodoro.isRunning) {
    clearInterval(state.pomodoro.timerId);
    state.pomodoro.isRunning = false;
    updateTimerDisplay(state.pomodoro.seconds, state.pomodoro.mode, state.pomodoro.isRunning);
    showToast("Pomodoro timer paused");
  } else {
    state.pomodoro.isRunning = true;
    updateTimerDisplay(state.pomodoro.seconds, state.pomodoro.mode, state.pomodoro.isRunning);
    showToast(state.pomodoro.mode === 'work' ? "Focus session started (25 min)" : "Break started (5 min)");
    state.pomodoro.timerId = setInterval(() => {
      if (state.pomodoro.seconds > 0) {
        state.pomodoro.seconds--;
        updateTimerDisplay(state.pomodoro.seconds, state.pomodoro.mode, state.pomodoro.isRunning);
      } else {
        clearInterval(state.pomodoro.timerId);
        state.pomodoro.isRunning = false;
        const finishedWork = state.pomodoro.mode === 'work';
        state.pomodoro.mode = finishedWork ? 'break' : 'work';
        state.pomodoro.seconds = finishedWork ? 5 * 60 : 25 * 60;
        showToast(finishedWork ? "Focus session finished! Time for a 5-minute break." : "Break finished. Back to focus.");
        renderApp();
      }
    }, 1000);
  }
}

function copyBibtex(paperId) {
  const bibMap = {
    "paper_chandy_lamport": `@article{chandy1985distributed,\n  author={Chandy, K. Mani and Lamport, Leslie},\n  journal={ACM TOCS},\n  title={Distributed Snapshots: Determining Global States of Distributed Systems},\n  year={1985}\n}`,
    "paper_strassen": `@article{strassen1969gaussian,\n  author={Strassen, Volker},\n  journal={Numerische Mathematik},\n  title={Gaussian Elimination is not Optimal},\n  year={1969}\n}`,
    "paper_pagerank": `@techreport{page1999pagerank,\n  author={Page, Lawrence and Brin, Sergey and Motwani, Rajeev and Winograd, Terry},\n  institution={Stanford InfoLab},\n  title={The PageRank Citation Ranking: Bringing Order to the Web},\n  year={1999}\n}`,
    "paper_attention": `@article{vaswani2017attention,\n  author={Vaswani, Ashish and Shazeer, Noam and Parmar, Niki and others},\n  journal={NeurIPS},\n  title={Attention Is All You Need},\n  year={2017}\n}`,
    "paper_mapreduce": `@article{dean2008mapreduce,\n  author={Dean, Jeffrey and Ghemawat, Sanjay},\n  journal={CACM},\n  title={MapReduce: Simplified Data Processing on Large Clusters},\n  year={2008}\n}`,
    "paper_deltalake": `@article{armbrust2020delta,\n  author={Armbrust, Michael and Das, Tathagata and others},\n  journal={PVLDB},\n  title={Delta Lake: High-Performance ACID Table Storage over Cloud Object Stores},\n  year={2020}\n}`
  };

  const bib = bibMap[paperId] || `@article{mtech_paper_${paperId},\n  title={Seminal Research Publication},\n  year={2026}\n}`;
  navigator.clipboard.writeText(bib);
  showToast("BibTeX citation copied to clipboard!");
}
