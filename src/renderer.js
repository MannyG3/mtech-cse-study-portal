// Renderer Engine: Orchestrates Shell Mount, Partial Updates, KaTeX, and Lucide Icons
import { SEMESTERS } from './data/curriculum.js';
import { SUBJECT_NOTES } from './data/notes.js';
import { state, saveState, getDefaultWelcomeMessage } from './state.js';
import { renderHeader, updateTimerDisplay } from './components/header.js';
import { renderSidebar } from './components/sidebar.js';
import { renderRightPanel } from './components/rightPanel.js';
import { renderAiSideDrawer, scrollDrawerToBottom } from './components/aiDrawer.js';
import { renderActiveModalLayer } from './components/modals.js';
import { renderDashboardView } from './views/dashboardView.js';
import { renderCourseView } from './views/courseView.js';
import { renderResourcesView, getFilteredResources, renderResourceResultsInner } from './views/resourcesView.js';
import { renderPlannerView } from './views/plannerView.js';
import { renderResearchView } from './views/researchView.js';
import { renderBookmarksView } from './views/bookmarksView.js';
import { createIcons, icons } from 'lucide';
import renderMathInElement from 'katex/contrib/auto-render';
import 'katex/dist/katex.min.css';

let appEl = null;

export function getActiveSemester() {
  return SEMESTERS.find(s => s.id === state.activeSemesterId) || SEMESTERS[0];
}

export function findCourseByCode(code) {
  for (const sem of SEMESTERS) {
    const course = sem.courses.find(c => c.code === code);
    if (course) return course;
  }
  return getActiveSemester().courses[0];
}

export function initRenderer(root) {
  appEl = root;
  mountShell();
  renderApp();
}

function mountShell() {
  if (!appEl) return;
  document.documentElement.setAttribute('data-theme', state.theme);

  appEl.innerHTML = `
    <div id="appShell">
      <div id="headerHost"></div>
      <div class="workspace-container" id="workspaceContainer">
        <div id="sidebarHost"></div>
        <main class="main-content-column" id="mainContentHost"></main>
        <div id="rightPanelHost"></div>
      </div>
      <div id="aiDrawerHost"></div>
      <div id="modalHostLayer"></div>
      <div class="toast-container" id="toastHost"></div>
    </div>
  `;
}

export function renderApp() {
  if (!appEl) return;
  document.documentElement.setAttribute('data-theme', state.theme);

  const mainCol = document.getElementById('mainContentHost');
  const savedScroll = mainCol ? mainCol.scrollTop : 0;

  const activeSem = getActiveSemester();
  const activeCourse = activeSem.courses.find(c => c.code === state.activeCourseCode) || findCourseByCode(state.activeCourseCode);
  const notesData = SUBJECT_NOTES[activeCourse.code] || null;

  // 1. Header
  const headerHost = document.getElementById('headerHost');
  if (headerHost) headerHost.innerHTML = renderHeader(state);

  // 2. Sidebar
  const sidebarHost = document.getElementById('sidebarHost');
  if (sidebarHost) sidebarHost.innerHTML = renderSidebar(state, activeSem);

  // 3. Main Center Workspace View
  updateMainContent();

  // 4. Right Panel (Scratchpad & COs)
  updateRightPanel(activeCourse);

  // 5. Container collapse class
  const wsContainer = document.getElementById('workspaceContainer');
  if (wsContainer) {
    if (!state.isRightSidebarOpen || state.activeView !== 'course') {
      wsContainer.classList.add('panel-collapsed');
    } else {
      wsContainer.classList.remove('panel-collapsed');
    }
  }

  // 6. AI Drawer
  updateAiDrawer();

  // 7. Modals Layer
  updateModalLayer();

  // Run post-render icon injection and math rendering
  afterRender(appEl);

  const restoredMain = document.getElementById('mainContentHost');
  if (restoredMain && savedScroll > 0) restoredMain.scrollTop = savedScroll;
}

export function updateMainContent() {
  const mainCol = document.getElementById('mainContentHost');
  if (!mainCol) return;

  const activeSem = getActiveSemester();
  const activeCourse = activeSem.courses.find(c => c.code === state.activeCourseCode) || findCourseByCode(state.activeCourseCode);
  const notesData = SUBJECT_NOTES[activeCourse.code] || null;

  let html = '';
  if (state.activeView === 'dashboard') {
    html = renderDashboardView(state, activeSem);
  } else if (state.activeView === 'resources') {
    html = renderResourcesView(state);
  } else if (state.activeView === 'planner') {
    html = renderPlannerView(state);
  } else if (state.activeView === 'research') {
    html = renderResearchView(state);
  } else if (state.activeView === 'bookmarks') {
    html = renderBookmarksView(state);
  } else if (state.activeView === 'course') {
    html = renderCourseView(activeCourse, notesData, state);
  }

  mainCol.innerHTML = html;
  afterRender(mainCol);
}

export function updateRightPanel(activeCourse) {
  const rightHost = document.getElementById('rightPanelHost');
  if (!rightHost) return;

  if (state.activeView === 'course' && state.isRightSidebarOpen) {
    const course = activeCourse || findCourseByCode(state.activeCourseCode);
    rightHost.innerHTML = renderRightPanel(course);
    const pad = document.getElementById('courseScratchpadArea');
    if (pad) pad.value = state.studentNotes[state.activeCourseCode] || '';
  } else {
    rightHost.innerHTML = '';
  }
}

export function updateSidebar() {
  const sidebarHost = document.getElementById('sidebarHost');
  if (sidebarHost) {
    sidebarHost.innerHTML = renderSidebar(state, getActiveSemester());
    createIcons({ icons, nameAttr: 'data-lucide', root: sidebarHost });
  }
}

export function updateModalLayer() {
  const modalHost = document.getElementById('modalHostLayer');
  if (!modalHost) return;

  modalHost.innerHTML = renderActiveModalLayer(state);
  afterRender(modalHost);

  const cmdInput = document.getElementById('cmdPaletteSearchInput');
  if (cmdInput) cmdInput.focus();

  const keyInput = document.getElementById('geminiApiKeySetting');
  if (keyInput) keyInput.value = state.geminiApiKey || '';
}

export function updateAiDrawer() {
  const aiHost = document.getElementById('aiDrawerHost');
  if (!aiHost) return;

  const activeCourse = findCourseByCode(state.activeCourseCode);
  aiHost.innerHTML = state.isAiDrawerOpen ? renderAiSideDrawer(state, activeCourse) : '';
  afterRender(aiHost);
}

export function refreshResourceResults() {
  const host = document.getElementById('resourceResultsHost');
  if (!host) return;

  const filtered = getFilteredResources(state.resourceFilter);
  host.innerHTML = renderResourceResultsInner(filtered);
  createIcons({ icons, nameAttr: 'data-lucide', root: host });
}

export function showToast(message) {
  const host = document.getElementById('toastHost');
  if (!host) return;

  const toast = document.createElement('div');
  toast.className = 'toast-message-pill';
  toast.textContent = message;
  host.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 140ms ease-out';
    setTimeout(() => toast.remove(), 150);
  }, 2200);
}

export function afterRender(container) {
  const root = container || document.body;

  // Build Lucide icons
  createIcons({ icons, nameAttr: 'data-lucide', root });

  // Render KaTeX mathematical formulas
  try {
    renderMathInElement(root, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\(', right: '\\)', display: false },
        { left: '\\[', right: '\\]', display: true }
      ],
      throwOnError: false
    });
  } catch {
    // KaTeX is robust to malformed student text
  }
}
