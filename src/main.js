// M.Tech Computer Engineering Academic & Research Workspace
// Comprehensive Modern Implementation conforming to NEP-2020 (2026 Pattern)

import './style.css';
import { CURRICULUM_METADATA, SEMESTERS } from './data/curriculum.js';
import { SUBJECT_NOTES } from './data/notes.js';
import { LAB_ASSIGNMENTS } from './data/labData.js';
import { RESEARCH_PAPERS } from './data/researchPapers.js';
import { ACADEMIC_RESOURCES } from './data/resources.js';
import { findAiResponse } from './data/aiKnowledgeBase.js';
import { QUIZ_QUESTIONS, FLASHCARD_DECKS } from './data/quizData.js';
import { 
  state, 
  saveState, 
  trackRecentlyViewed, 
  toggleBookmarkItem, 
  isItemBookmarked, 
  toggleUnitCompleted, 
  toggleTopicChecked, 
  addStudyTask, 
  toggleTaskCompleted, 
  deleteStudyTask, 
  setPaperStatus, 
  savePaperNote, 
  saveStudentNote 
} from './state.js';
import { marked } from 'marked';
import { createIcons, icons } from 'lucide';

// Configure marked
marked.setOptions({
  gfm: true,
  breaks: true
});

const appEl = document.getElementById('app');

// Helper: Format credit string properly
function formatCredits(count) {
  return count === 1 ? "1 credit" : `${count} credits`;
}

// Helper: Format Pomodoro Time
function formatTime(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// ============================================================================
// Core Render Pipeline
// ============================================================================

function renderApp() {
  document.documentElement.setAttribute('data-theme', state.theme);

  const activeSem = SEMESTERS.find(s => s.id === state.activeSemesterId) || SEMESTERS[0];
  const activeCourse = activeSem.courses.find(c => c.code === state.activeCourseCode) || activeSem.courses[0];
  const notesData = SUBJECT_NOTES[activeCourse.code] || null;

  // Calculate Progress
  const totalUnits = SEMESTERS[0].courses.reduce((acc, c) => acc + (c.units ? c.units.length : 0), 0);
  const completedCount = state.completedUnits.length;
  const progressPercent = totalUnits > 0 ? Math.round((completedCount / totalUnits) * 100) : 0;

  // Separate Core and Elective courses
  const coreCourses = activeSem.courses.filter(c => c.type === 'PCC');
  const electiveCourses = activeSem.courses.filter(c => c.type !== 'PCC');

  appEl.innerHTML = `
    <!-- Top Site Header -->
    <header class="site-header">
      <div class="header-left">
        <button class="btn-icon-square" id="toggleMobileNavBtn" style="display:none;" title="Toggle Navigation">
          <i data-lucide="menu" style="width:16px; height:16px;"></i>
        </button>

        <div class="header-brand" id="brandHomeNav">
          <div class="header-logo-icon">M</div>
          <div class="header-title-text">M.Tech CSE Workspace</div>
          <span class="badge-tag">2026 PATTERN</span>
        </div>

        <!-- Semester Switcher -->
        <select class="semester-dropdown" id="semesterSelector" aria-label="Select Semester">
          ${SEMESTERS.map(s => `
            <option value="${s.id}" ${s.id === state.activeSemesterId ? 'selected' : ''}>
              ${s.name} (${s.totalCredits} credits)
            </option>
          `).join('')}
        </select>
      </div>

      <div class="header-right">
        <!-- Quiet Pomodoro Focus Timer -->
        <button class="timer-pill-btn ${state.pomodoro.isRunning ? 'running' : ''}" id="timerWidgetBtn" title="Focus Timer: Click to Start / Pause">
          <i data-lucide="clock" style="width:13px; height:13px;"></i>
          <span id="timerDigitEl">${formatTime(state.pomodoro.seconds)}</span>
          <span style="font-size:0.65rem; color:var(--text-dim);">${state.pomodoro.mode === 'work' ? 'FOCUS' : 'BREAK'}</span>
        </button>

        <!-- Command Palette Trigger -->
        <button class="search-command-btn" id="openCommandPaletteBtn">
          <i data-lucide="search" style="width:13px; height:13px;"></i>
          <span>Search or jump to...</span>
          <kbd class="kbd-shortcut">Ctrl K</kbd>
        </button>

        <!-- AI Tutor Trigger -->
        <button class="btn-header-action" id="openAiDrawerTrigger">
          <i data-lucide="sparkles" style="width:14px; height:14px; color:var(--accent);"></i>
          <span>AI Tutor</span>
        </button>

        <!-- Right Panel Toggle -->
        ${state.activeView === 'course' ? `
          <button class="btn-icon-square ${state.isRightSidebarOpen ? 'active' : ''}" id="toggleRightPanelBtn" title="Toggle Scratchpad & Outcomes">
            <i data-lucide="sidebar" style="width:15px; height:15px;"></i>
          </button>
        ` : ''}

        <!-- Theme Switcher -->
        <button class="btn-icon-square" id="themeSwitchBtn" title="Toggle Dark/Light Mode">
          <i data-lucide="${state.theme === 'dark' ? 'sun' : 'moon'}" style="width:15px; height:15px;"></i>
        </button>
      </div>
    </header>

    <!-- Workspace Layout -->
    <div class="workspace-container ${!state.isRightSidebarOpen || state.activeView !== 'course' ? 'panel-collapsed' : ''}">
      <!-- Left Sidebar -->
      <aside class="sidebar-left ${state.mobileSidebarOpen ? 'mobile-open' : ''}" id="leftSidebar">
        <!-- Main Navigation Links -->
        <nav class="sidebar-main-nav">
          <button class="nav-link-btn ${state.activeView === 'dashboard' ? 'active' : ''}" data-nav-view="dashboard">
            <i data-lucide="layout-dashboard" style="width:15px; height:15px;"></i>
            <span>Academic Dashboard</span>
          </button>
          <button class="nav-link-btn ${state.activeView === 'resources' ? 'active' : ''}" data-nav-view="resources">
            <i data-lucide="book-marked" style="width:15px; height:15px;"></i>
            <span>Resource Library</span>
          </button>
          <button class="nav-link-btn ${state.activeView === 'planner' ? 'active' : ''}" data-nav-view="planner">
            <i data-lucide="calendar" style="width:15px; height:15px;"></i>
            <span>Study Planner (${state.studyTasks.filter(t => !t.completed).length})</span>
          </button>
          <button class="nav-link-btn ${state.activeView === 'research' ? 'active' : ''}" data-nav-view="research">
            <i data-lucide="file-text" style="width:15px; height:15px;"></i>
            <span>Research Workspace</span>
          </button>
          <button class="nav-link-btn ${state.activeView === 'bookmarks' ? 'active' : ''}" data-nav-view="bookmarks">
            <i data-lucide="bookmark" style="width:15px; height:15px;"></i>
            <span>Saved Bookmarks (${state.bookmarks.length})</span>
          </button>
        </nav>

        <hr style="border:none; border-top:1px solid var(--border-subtle); margin:0.35rem 0;" />

        <!-- Subject Curriculum List -->
        <div>
          <div class="nav-section-title">Core Subjects (PCC)</div>
          <div style="display:flex; flex-direction:column; gap:0.2rem;">
            ${coreCourses.map(c => renderSidebarCourseRow(c)).join('')}
          </div>
        </div>

        ${electiveCourses.length > 0 ? `
          <div>
            <div class="nav-section-title">Electives & Practical</div>
            <div style="display:flex; flex-direction:column; gap:0.2rem;">
              ${electiveCourses.map(c => renderSidebarCourseRow(c)).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Sidebar Footer Tools -->
        <div style="margin-top:auto; padding-top:0.75rem; border-top:1px solid var(--border-subtle); display:flex; flex-direction:column; gap:0.25rem;">
          <button class="nav-link-btn" id="openQuizShortcut">
            <i data-lucide="check-circle-2" style="width:14px; height:14px;"></i>
            <span>Practice Exam Quiz</span>
          </button>
          <button class="nav-link-btn" id="openFlashShortcut">
            <i data-lucide="layers" style="width:14px; height:14px;"></i>
            <span>Revision Flashcards</span>
          </button>
          <button class="nav-link-btn" id="openCalcShortcut">
            <i data-lucide="calculator" style="width:14px; height:14px;"></i>
            <span>Target Mark Calculator</span>
          </button>
        </div>
      </aside>

      <!-- Center Main Content Column -->
      <main class="main-content-column">
        ${renderActiveWorkspaceView(activeCourse, notesData)}
      </main>

      <!-- Right Panel: Course Outcomes & Scratchpad -->
      ${state.activeView === 'course' && state.isRightSidebarOpen ? renderRightPanel(activeCourse) : ''}
    </div>

    <!-- AI Tutor Side Drawer -->
    ${state.isAiDrawerOpen ? renderAiSideDrawer(activeCourse) : ''}

    <!-- Modal Host Layer -->
    <div id="modalHostLayer">
      ${renderActiveModalLayer()}
    </div>

    <!-- Toast Notification Host -->
    <div class="toast-container" id="toastHost"></div>
  `;

  // Render Lucide crisp line icons
  createIcons({ icons });

  // Attach event handlers
  attachEventListeners();
}

// ============================================================================
// Render Sidebar Course Row
// ============================================================================

function renderSidebarCourseRow(course) {
  const isSelected = state.activeView === 'course' && course.code === state.activeCourseCode;
  return `
    <button class="course-item-row ${isSelected ? 'active' : ''}" data-select-course="${course.code}">
      <span class="course-item-title">${course.title}</span>
      <span class="course-item-meta">${course.code} • ${formatCredits(course.credits)}</span>
    </button>
  `;
}

// ============================================================================
// Render Main Content View Router
// ============================================================================

function renderActiveWorkspaceView(activeCourse, notesData) {
  if (state.activeView === 'dashboard') {
    return renderDashboardView();
  } else if (state.activeView === 'resources') {
    return renderResourceLibraryView();
  } else if (state.activeView === 'planner') {
    return renderPlannerView();
  } else if (state.activeView === 'research') {
    return renderResearchWorkspaceView();
  } else if (state.activeView === 'bookmarks') {
    return renderBookmarksView();
  } else if (state.activeView === 'course') {
    return renderCourseWorkspaceView(activeCourse, notesData);
  }
  return renderDashboardView();
}

// ============================================================================
// VIEW 1: Modern Academic Dashboard
// ============================================================================

function renderDashboardView() {
  const activeSem = SEMESTERS.find(s => s.id === state.activeSemesterId) || SEMESTERS[0];
  const pendingTasks = state.studyTasks.filter(t => !t.completed);
  const totalUnits = SEMESTERS[0].courses.reduce((acc, c) => acc + (c.units ? c.units.length : 0), 0);
  const completedUnitsCount = state.completedUnits.length;
  const progressPercent = totalUnits > 0 ? Math.round((completedUnitsCount / totalUnits) * 100) : 0;

  // Last visited course or default
  const lastVisitedCode = state.recentlyViewed.length > 0 ? state.recentlyViewed[0].code : "2604PCC501";
  const lastCourse = activeSem.courses.find(c => c.code === lastVisitedCode) || activeSem.courses[0];

  return `
    <!-- Welcome Header Banner -->
    <div class="dashboard-welcome-banner">
      <div class="welcome-row-top">
        <div>
          <span class="badge-tag">Academic Year 2026–27</span>
          <h1 class="welcome-heading" style="margin-top:0.4rem;">M.Tech Computer Engineering Workspace</h1>
        </div>
        <div style="font-size:var(--text-xs); color:var(--text-dim); text-align:right;">
          ${CURRICULUM_METADATA.institution}<br/>
          Autonomous NEP-2020 Curriculum
        </div>
      </div>
      <p class="welcome-sub">
        Welcome to your integrated research, syllabus notes, and laboratory simulation workspace. Track masteries, review seminar literature, and plan study milestones.
      </p>

      <!-- Quick Action Buttons -->
      <div style="display:flex; gap:0.65rem; flex-wrap:wrap;">
        <button class="btn-header-action" style="background:var(--accent); color:#fff; border-color:var(--accent);" id="resumeStudyingBtn" data-jump-course="${lastCourse.code}">
          <i data-lucide="play" style="width:14px; height:14px;"></i>
          <span>Continue: ${lastCourse.title}</span>
        </button>
        <button class="btn-header-action" id="dashOpenPlannerBtn">
          <i data-lucide="calendar-plus" style="width:14px; height:14px;"></i>
          <span>Add Study Task</span>
        </button>
        <button class="btn-header-action" id="dashOpenResearchBtn">
          <i data-lucide="file-text" style="width:14px; height:14px;"></i>
          <span>Research Papers (${RESEARCH_PAPERS.length})</span>
        </button>
      </div>
    </div>

    <!-- Quick Stat Tiles -->
    <div class="dashboard-stats-grid">
      <div class="stat-tile-card">
        <span class="stat-tile-label">Syllabus Mastered</span>
        <span class="stat-tile-value">${completedUnitsCount} / ${totalUnits}</span>
        <span class="stat-tile-desc">${progressPercent}% total curriculum progress</span>
      </div>
      <div class="stat-tile-card">
        <span class="stat-tile-label">Pending Study Tasks</span>
        <span class="stat-tile-value" style="color:var(--accent);">${pendingTasks.length}</span>
        <span class="stat-tile-desc">${state.studyTasks.filter(t => t.completed).length} tasks completed</span>
      </div>
      <div class="stat-tile-card">
        <span class="stat-tile-label">Saved Bookmarks</span>
        <span class="stat-tile-value">${state.bookmarks.length}</span>
        <span class="stat-tile-desc">Topics, codes & papers</span>
      </div>
      <div class="stat-tile-card">
        <span class="stat-tile-label">Seminal Papers</span>
        <span class="stat-tile-value">${RESEARCH_PAPERS.length}</span>
        <span class="stat-tile-desc">Mapped to syllabus units</span>
      </div>
    </div>

    <!-- Two-Column Split: Tasks & Recently Viewed -->
    <div class="dashboard-split-grid">
      <!-- Left Panel: Upcoming Deadlines & Tasks -->
      <div class="dashboard-panel-box">
        <div class="panel-header-line">
          <span class="panel-title-text">Upcoming Study Tasks & Deadlines</span>
          <button class="btn-header-action" style="padding:0.2rem 0.5rem; font-size:var(--text-xs);" id="dashAddTaskModalBtn">
            <i data-lucide="plus" style="width:12px; height:12px;"></i>
            <span>New Task</span>
          </button>
        </div>

        ${pendingTasks.length === 0 ? `
          <div style="font-size:var(--text-xs); color:var(--text-dim); padding:1.5rem; text-align:center;">
            No pending tasks. You are all caught up!
          </div>
        ` : `
          <div style="display:flex; flex-direction:column;">
            ${pendingTasks.slice(0, 4).map(task => `
              <div class="task-row-item">
                <input type="checkbox" style="margin-top:3px; accent-color:var(--accent); cursor:pointer;" data-dash-toggle-task="${task.id}" />
                <div style="flex:1;">
                  <div class="task-title-cell">${task.title}</div>
                  <div class="task-meta-cell">
                    <span class="priority-tag priority-${task.priority}">${task.priority}</span>
                    <span>•</span>
                    <span>Due: ${task.dueDate || 'No date'}</span>
                    <span>•</span>
                    <span>${task.courseCode}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- Right Panel: Recently Viewed Resources -->
      <div class="dashboard-panel-box">
        <div class="panel-header-line">
          <span class="panel-title-text">Recently Viewed Resources</span>
          <span style="font-size:var(--text-xs); color:var(--text-dim);">${state.recentlyViewed.length} items</span>
        </div>

        ${state.recentlyViewed.length === 0 ? `
          <div style="font-size:var(--text-xs); color:var(--text-dim); padding:1.5rem; text-align:center;">
            No recently opened items yet. Start exploring subjects or lab manuals!
          </div>
        ` : `
          <div style="display:flex; flex-direction:column; gap:0.4rem;">
            ${state.recentlyViewed.slice(0, 5).map(item => `
              <div class="task-row-item" style="cursor:pointer;" data-jump-recent-id="${item.id}" data-jump-recent-code="${item.code || ''}" data-jump-recent-tab="${item.tab || 'units'}">
                <i data-lucide="file-text" style="width:15px; height:15px; color:var(--accent); flex-shrink:0; margin-top:2px;"></i>
                <div style="flex:1;">
                  <div class="task-title-cell">${item.title}</div>
                  <div class="task-meta-cell">${item.subtitle || ''}</div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>

    <!-- Semester Course Shortcuts -->
    <div style="margin-bottom:1rem; display:flex; align-items:center; justify-content:space-between;">
      <h3 style="font-size:var(--text-md); font-weight:600; color:var(--text-main);">
        ${activeSem.name} Subjects & Framework
      </h3>
      <span style="font-size:var(--text-xs); color:var(--text-dim);">
        ${activeSem.courses.length} subjects • ${activeSem.totalCredits} credits total
      </span>
    </div>

    <div class="subjects-summary-grid">
      ${activeSem.courses.map(course => {
        const uCount = course.units ? course.units.length : 0;
        return `
          <div class="subject-summary-tile" data-select-course="${course.code}">
            <div class="subject-tile-header">
              <span class="badge-tag">${course.code}</span>
              <span style="font-size:var(--text-xs); color:var(--text-dim);">${formatCredits(course.credits)}</span>
            </div>
            <h4 style="font-size:var(--text-sm); font-weight:600; color:var(--text-main); margin-bottom:0.35rem;">
              ${course.title}
            </h4>
            <p style="font-size:var(--text-xs); color:var(--text-muted); line-height:1.45; margin-bottom:0.65rem;">
              ${course.description ? course.description.slice(0, 95) + '...' : 'Syllabus specifications and lecture notes.'}
            </p>
            <div style="display:flex; align-items:center; justify-content:space-between; font-size:var(--text-xs); color:var(--text-dim);">
              <span>${uCount > 0 ? `${uCount} Syllabus Units` : 'Laboratory Project'}</span>
              <span style="color:var(--accent); font-weight:500;">Open Workspace →</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ============================================================================
// VIEW 2: Academic Resource Library
// ============================================================================

function renderResourceLibraryView() {
  const { semester, subject, type, search } = state.resourceFilter;

  // Filter items
  const filtered = ACADEMIC_RESOURCES.filter(r => {
    if (semester !== 'ALL' && r.semester !== semester) return false;
    if (subject !== 'ALL' && r.subjectCode !== subject) return false;
    if (type !== 'ALL' && r.type !== type) return false;
    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      const match = r.title.toLowerCase().includes(q) || 
                    r.description.toLowerCase().includes(q) || 
                    r.subjectTitle.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return `
    <div style="margin-bottom:1.5rem;">
      <h1 class="welcome-heading">Academic Resource Library</h1>
      <p class="welcome-sub">
        Browse lecture notes, lab manuals, official syllabus PDF specifications, question banks, and reference documents.
      </p>
    </div>

    <!-- Filter & Search Bar -->
    <div class="resource-filter-bar">
      <!-- Search Input -->
      <div style="flex:1; min-width:220px; position:relative;">
        <input 
          type="text" 
          class="input-quiet" 
          id="resourceSearchInput" 
          placeholder="Filter resources by title, topic, or keyword..." 
          value="${state.resourceFilter.search}" 
          style="width:100%;"
        />
      </div>

      <!-- Resource Type Filter -->
      <select class="semester-dropdown" id="filterResourceType">
        <option value="ALL" ${type === 'ALL' ? 'selected' : ''}>All Types</option>
        <option value="Notes" ${type === 'Notes' ? 'selected' : ''}>Lecture Notes</option>
        <option value="PDF" ${type === 'PDF' ? 'selected' : ''}>Syllabus PDF</option>
        <option value="Lab Manual" ${type === 'Lab Manual' ? 'selected' : ''}>Lab Manual</option>
        <option value="Question Bank" ${type === 'Question Bank' ? 'selected' : ''}>Question Bank</option>
        <option value="Textbook" ${type === 'Textbook' ? 'selected' : ''}>Textbooks</option>
      </select>

      <!-- Subject Filter -->
      <select class="semester-dropdown" id="filterResourceSubject">
        <option value="ALL" ${subject === 'ALL' ? 'selected' : ''}>All Subjects</option>
        <option value="2604PCC501" ${subject === '2604PCC501' ? 'selected' : ''}>Advanced Algorithms</option>
        <option value="2604PCC502" ${subject === '2604PCC502' ? 'selected' : ''}>Advanced Database Systems</option>
        <option value="2604PCC503" ${subject === '2604PCC503' ? 'selected' : ''}>Machine Learning</option>
        <option value="2604PCC504" ${subject === '2604PCC504' ? 'selected' : ''}>Distributed Computing</option>
        <option value="2604OE505A" ${subject === '2604OE505A' ? 'selected' : ''}>Data Engineering</option>
        <option value="2604OE505D" ${subject === '2604OE505D' ? 'selected' : ''}>Quantum Computing</option>
        <option value="2604PCC526" ${subject === '2604PCC526' ? 'selected' : ''}>Lab Practice - I</option>
      </select>
    </div>

    <!-- Results Counter -->
    <div style="font-size:var(--text-xs); color:var(--text-dim); margin-bottom:1rem;">
      Showing ${filtered.length} of ${ACADEMIC_RESOURCES.length} resources
    </div>

    <!-- Resource Cards Grid -->
    ${filtered.length === 0 ? `
      <div class="empty-state-card">
        <h3 class="empty-state-title">No Resources Found</h3>
        <p class="empty-state-desc">No academic resources match your search criteria. Try clearing the filters.</p>
        <button class="btn-primary-action" id="resetResourceFilterBtn">Clear Filters</button>
      </div>
    ` : `
      <div class="resource-cards-list">
        ${filtered.map(res => {
          const bookmarked = isItemBookmarked(res.id);
          return `
            <div class="resource-item-card">
              <div class="resource-card-top">
                <div style="display:flex; align-items:center; justify-content:space-between;">
                  <span class="resource-type-badge">${res.type}</span>
                  <span style="font-size:var(--text-xs); color:var(--text-dim);">${res.size}</span>
                </div>
                <h3 class="resource-card-title">${res.title}</h3>
                <p class="resource-card-desc">${res.description}</p>
                <div style="font-size:var(--text-xs); color:var(--text-dim); margin-top:0.45rem;">
                  Subject: <strong>${res.subjectTitle}</strong>
                </div>
              </div>

              <div class="resource-card-footer">
                <div style="display:flex; gap:0.45rem;">
                  <button class="btn-header-action" style="padding:0.25rem 0.6rem; font-size:var(--text-xs);" data-open-resource-id="${res.id}">
                    <i data-lucide="eye" style="width:13px; height:13px;"></i>
                    <span>Open</span>
                  </button>
                  <button class="btn-header-action" style="padding:0.25rem 0.6rem; font-size:var(--text-xs);" data-print-resource-id="${res.id}" title="Print Document">
                    <i data-lucide="printer" style="width:13px; height:13px;"></i>
                  </button>
                </div>
                <button class="btn-icon-square ${bookmarked ? 'active' : ''}" style="width:28px; height:28px;" data-bookmark-resource-id="${res.id}" title="Bookmark Resource">
                  <i data-lucide="bookmark" style="width:14px; height:14px;"></i>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `}
  `;
}

// ============================================================================
// VIEW 3: Study Planner (Tasks & Deadlines)
// ============================================================================

function renderPlannerView() {
  const pending = state.studyTasks.filter(t => !t.completed);
  const completed = state.studyTasks.filter(t => t.completed);

  return `
    <div style="margin-bottom:1.5rem;">
      <h1 class="welcome-heading">Study Planner & Task Management</h1>
      <p class="welcome-sub">
        Organize dissertation milestones, exam preparations, lab submissions, and daily study objectives.
      </p>
    </div>

    <!-- Header Actions -->
    <div class="planner-header-row">
      <div style="font-size:var(--text-sm); color:var(--text-muted);">
        <strong>${pending.length}</strong> tasks remaining • <strong>${completed.length}</strong> completed
      </div>
      <button class="btn-primary-action" id="openNewTaskModalBtn">
        <i data-lucide="plus" style="width:14px; height:14px;"></i>
        <span>Create Study Task</span>
      </button>
    </div>

    <!-- Active Tasks List -->
    <div style="margin-bottom:2rem;">
      <h3 style="font-size:var(--text-sm); font-weight:600; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.04em; margin-bottom:0.75rem;">
        Active Tasks (${pending.length})
      </h3>

      ${pending.length === 0 ? `
        <div class="empty-state-card" style="padding:1.5rem; max-width:100%; margin:0;">
          <p style="font-size:var(--text-sm); color:var(--text-muted);">No active tasks. Add a milestone to stay focused!</p>
        </div>
      ` : `
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
          ${pending.map(task => `
            <div class="planner-task-card">
              <div style="display:flex; align-items:flex-start; gap:0.75rem;">
                <input type="checkbox" style="margin-top:4px; accent-color:var(--accent); cursor:pointer;" data-toggle-task-id="${task.id}" />
                <div>
                  <h4 style="font-size:var(--text-md); font-weight:600; color:var(--text-main); margin-bottom:0.25rem;">
                    ${task.title}
                  </h4>
                  ${task.description ? `<p style="font-size:var(--text-xs); color:var(--text-muted); margin-bottom:0.45rem;">${task.description}</p>` : ''}
                  <div style="display:flex; align-items:center; gap:0.65rem; font-size:var(--text-xs); color:var(--text-dim);">
                    <span class="priority-tag priority-${task.priority}">${task.priority}</span>
                    <span>•</span>
                    <span>Course: <strong>${task.courseCode}</strong></span>
                    <span>•</span>
                    <span>Due: <strong>${task.dueDate || 'No deadline'}</strong></span>
                  </div>
                </div>
              </div>
              <button class="btn-icon-square" style="color:var(--text-dim);" data-delete-task-id="${task.id}" title="Delete Task">
                <i data-lucide="trash-2" style="width:14px; height:14px;"></i>
              </button>
            </div>
          `).join('')}
        </div>
      `}
    </div>

    <!-- Completed Tasks List -->
    ${completed.length > 0 ? `
      <div>
        <h3 style="font-size:var(--text-sm); font-weight:600; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.04em; margin-bottom:0.75rem;">
          Completed Tasks (${completed.length})
        </h3>
        <div style="display:flex; flex-direction:column; gap:0.45rem;">
          ${completed.map(task => `
            <div class="planner-task-card" style="opacity:0.65;">
              <div style="display:flex; align-items:flex-start; gap:0.75rem;">
                <input type="checkbox" checked style="margin-top:4px; accent-color:var(--accent); cursor:pointer;" data-toggle-task-id="${task.id}" />
                <div>
                  <div style="font-size:var(--text-sm); font-weight:500; text-decoration:line-through; color:var(--text-muted);">
                    ${task.title}
                  </div>
                  <div style="font-size:var(--text-xs); color:var(--text-dim); margin-top:0.2rem;">
                    Completed • ${task.courseCode}
                  </div>
                </div>
              </div>
              <button class="btn-icon-square" style="color:var(--text-dim);" data-delete-task-id="${task.id}" title="Delete Task">
                <i data-lucide="trash-2" style="width:14px; height:14px;"></i>
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;
}

// ============================================================================
// VIEW 4: Research Workspace (Papers, BibTeX, Notes)
// ============================================================================

function renderResearchWorkspaceView() {
  return `
    <div style="margin-bottom:1.5rem;">
      <h1 class="welcome-heading">Research Literature Workspace</h1>
      <p class="welcome-sub">
        Explore seminal postgraduate papers mapped directly to your M.Tech syllabus. Manage reading queues, cite in BibTeX, and keep personal literature review notes.
      </p>
    </div>

    <!-- Research Paper Cards List -->
    <div style="display:flex; flex-direction:column; gap:1.25rem;">
      ${RESEARCH_PAPERS.map(paper => {
        const currentStatus = state.paperStatus[paper.id] || "to-read";
        const personalNote = state.paperNotes[paper.id] || "";
        const bookmarked = isItemBookmarked(paper.id);

        return `
          <div class="research-paper-card" id="${paper.id}">
            <div class="paper-card-header">
              <span class="badge-tag">${paper.subjectName}</span>
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <!-- Reading Status Select -->
                <select class="status-select" data-paper-status-id="${paper.id}">
                  <option value="to-read" ${currentStatus === 'to-read' ? 'selected' : ''}>To Read</option>
                  <option value="reading" ${currentStatus === 'reading' ? 'selected' : ''}>Reading</option>
                  <option value="read" ${currentStatus === 'read' ? 'selected' : ''}>Read</option>
                </select>
                <button class="btn-icon-square ${bookmarked ? 'active' : ''}" style="width:28px; height:28px;" data-bookmark-paper-id="${paper.id}" title="Bookmark Paper">
                  <i data-lucide="bookmark" style="width:14px; height:14px;"></i>
                </button>
              </div>
            </div>

            <h3 class="paper-title">${paper.title}</h3>
            <div class="paper-authors">${paper.authors} (${paper.year})</div>
            <div class="paper-venue-meta">Venue: ${paper.venue} • DOI: ${paper.doi}</div>

            <div class="paper-abstract-box">
              <strong>Abstract:</strong> ${paper.abstract}
            </div>

            <!-- Tags -->
            <div style="display:flex; gap:0.4rem; margin-bottom:1rem; flex-wrap:wrap;">
              ${paper.tags.map(tag => `<span class="tag-quiet">${tag}</span>`).join('')}
            </div>

            <!-- Action Bar -->
            <div class="paper-actions-bar">
              <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                <a href="${paper.url}" target="_blank" rel="noopener noreferrer" class="btn-header-action" style="text-decoration:none;">
                  <i data-lucide="external-link" style="width:13px; height:13px;"></i>
                  <span>Open Original Paper PDF</span>
                </a>
                <button class="btn-header-action" data-copy-bibtex="${paper.id}" title="Copy BibTeX Citation">
                  <i data-lucide="copy" style="width:13px; height:13px;"></i>
                  <span>Copy BibTeX</span>
                </button>
                <button class="btn-header-action" data-paper-notes-toggle="${paper.id}">
                  <i data-lucide="edit-3" style="width:13px; height:13px;"></i>
                  <span>${personalNote ? 'Edit Notes' : 'Add Reading Note'}</span>
                </button>
              </div>
            </div>

            <!-- Collapsible Personal Paper Note -->
            <div class="paper-note-container" id="noteBox_${paper.id}" style="${personalNote ? 'display:block;' : 'display:none;'} margin-top:1rem; padding-top:1rem; border-top:1px solid var(--border-subtle);">
              <label style="font-size:var(--text-xs); font-weight:600; color:var(--text-dim); text-transform:uppercase; display:block; margin-bottom:0.35rem;">
                Personal Research Notes:
              </label>
              <textarea 
                class="input-quiet" 
                style="width:100%; height:75px; resize:vertical;" 
                id="paperNoteInput_${paper.id}"
                placeholder="Key takeaways, methodology points, or dissertation ideas from this paper..."
              >${personalNote}</textarea>
              <button class="btn-header-action" style="margin-top:0.45rem; padding:0.25rem 0.65rem;" data-save-paper-note="${paper.id}">
                Save Note
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ============================================================================
// VIEW 5: Bookmarks Management
// ============================================================================

function renderBookmarksView() {
  return `
    <div style="margin-bottom:1.5rem;">
      <h1 class="welcome-heading">Saved Academic Bookmarks</h1>
      <p class="welcome-sub">
        Quick access to high-yield algorithm notes, research papers, and lab manuals saved across your study sessions.
      </p>
    </div>

    ${state.bookmarks.length === 0 ? `
      <div class="empty-state-card">
        <h3 class="empty-state-title">No Bookmarks Saved Yet</h3>
        <p class="empty-state-desc">
          Click the bookmark icon on any research paper, lab assignment, or syllabus resource to pin it here for rapid revision.
        </p>
        <button class="btn-primary-action" id="exploreResourcesBtn">Explore Resource Library</button>
      </div>
    ` : `
      <div style="display:flex; flex-direction:column; gap:0.75rem;">
        ${state.bookmarks.map(bm => `
          <div class="planner-task-card" style="align-items:center;">
            <div style="display:flex; align-items:center; gap:0.75rem;">
              <i data-lucide="bookmark" style="width:16px; height:16px; color:var(--accent);"></i>
              <div>
                <h4 style="font-size:var(--text-md); font-weight:600; color:var(--text-main); margin-bottom:0.15rem;">
                  ${bm.title}
                </h4>
                <div style="font-size:var(--text-xs); color:var(--text-dim);">
                  ${bm.type ? `Type: ${bm.type} • ` : ''}${bm.subtitle || ''}
                </div>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              ${bm.linkCode ? `
                <button class="btn-header-action" style="font-size:var(--text-xs);" data-jump-bookmark-code="${bm.linkCode}" data-jump-bookmark-tab="${bm.linkTab || 'units'}">
                  Jump to Section →
                </button>
              ` : ''}
              <button class="btn-icon-square" data-remove-bookmark-id="${bm.id}" title="Remove Bookmark">
                <i data-lucide="trash-2" style="width:14px; height:14px;"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `}
  `;
}

// ============================================================================
// VIEW 6: Course Workspace (Syllabus, Notes, Lab, Question Bank, Textbooks)
// ============================================================================

function renderCourseWorkspaceView(course, notesData) {
  // Track this course view in history
  trackRecentlyViewed({
    id: `course_${course.code}`,
    title: course.title,
    subtitle: `${course.code} • ${formatCredits(course.credits)}`,
    code: course.code,
    tab: state.activeTab
  });

  const isLab = course.type === 'PCC_LAB' || course.code === '2604PCC526';
  const teachingText = course.teachingScheme?.lectures ? `${course.teachingScheme.lectures} hrs/wk lecture` : (isLab ? `4 hrs/wk practical` : '');

  return `
    <!-- Course Header Area -->
    <div class="course-hero-header">
      <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem; flex-wrap:wrap;">
        <span class="badge-tag">${course.code}</span>
        <span class="badge-tag">${course.typeFullName || course.type}</span>
        <span class="badge-tag">${formatCredits(course.credits)}</span>
        ${teachingText ? `<span class="badge-tag">${teachingText}</span>` : ''}
      </div>

      <h1 class="course-headline">${course.title}</h1>
      <p class="course-desc-paragraph">${course.description || 'Curriculum framework conforming to autonomous NEP-2020 guidelines.'}</p>

      <!-- Action Row -->
      <div style="display:flex; gap:0.5rem; margin-bottom:1.5rem; flex-wrap:wrap;">
        ${isLab ? `
          <button class="btn-primary-action" id="openLabDirectBtn">
            <i data-lucide="play" style="width:14px; height:14px;"></i>
            <span>Open Lab Simulators</span>
          </button>
        ` : `
          <button class="btn-primary-action" id="jumpUnitOneBtn">
            <i data-lucide="book-open" style="width:14px; height:14px;"></i>
            <span>Continue Unit 1</span>
          </button>
        `}
        <button class="btn-header-action" id="askCourseAiBtn">
          <i data-lucide="sparkles" style="width:14px; height:14px; color:var(--accent);"></i>
          <span>Ask AI Tutor</span>
        </button>
        <button class="btn-header-action" id="printSyllabusBtn">
          <i data-lucide="printer" style="width:14px; height:14px;"></i>
          <span>Print Notes</span>
        </button>
      </div>

      <!-- Compact Exam Evaluation Row -->
      <div class="exam-eval-row">
        <div style="display:flex; align-items:baseline; justify-content:space-between; font-size:var(--text-xs); color:var(--text-dim); font-weight:600; text-transform:uppercase;">
          <span>Evaluation Scheme (Autonomous 2026 Pattern)</span>
          <span style="color:var(--text-main);">Total: 100 Marks</span>
        </div>
        <div class="exam-bar-container">
          <div style="width:20%; background:var(--seg-tae);" title="TAE: 20%"></div>
          <div style="width:20%; background:var(--seg-cae);" title="CAE: 20%"></div>
          <div style="width:60%; background:var(--seg-ese);" title="ESE: 60%"></div>
        </div>
        <div style="display:flex; gap:1.5rem; font-size:var(--text-xs); color:var(--text-muted); flex-wrap:wrap;">
          <div><span style="color:var(--text-dim);">TAE (Internal):</span> <strong>${course.examScheme?.tae ?? 20} Marks</strong> (20%)</div>
          <div><span style="color:var(--text-dim);">CAE (Mid-Sem):</span> <strong>${course.examScheme?.cae ?? 20} Marks</strong> (20%)</div>
          <div><span style="color:var(--text-dim);">ESE (End-Sem):</span> <strong>${course.examScheme?.ese ?? 60} Marks</strong> (60%)</div>
        </div>
      </div>
    </div>

    <!-- Sticky Underline Tab Bar -->
    <nav class="sticky-tab-bar" aria-label="Course Section Tabs">
      <button class="tab-underline-btn ${state.activeTab === 'units' ? 'active' : ''}" data-tab="units">
        <i data-lucide="book-open" style="width:14px; height:14px;"></i>
        <span>Syllabus & Units</span>
      </button>

      <button class="tab-underline-btn ${state.activeTab === 'notes' ? 'active' : ''}" data-tab="notes">
        <i data-lucide="file-text" style="width:14px; height:14px;"></i>
        <span>Study Notes</span>
      </button>

      ${(isLab || course.parts) ? `
        <button class="tab-underline-btn ${state.activeTab === 'lab' ? 'active' : ''}" data-tab="lab">
          <i data-lucide="terminal" style="width:14px; height:14px;"></i>
          <span>Lab Practice Assignments</span>
        </button>
      ` : ''}

      <button class="tab-underline-btn ${state.activeTab === 'questions' ? 'active' : ''}" data-tab="questions">
        <i data-lucide="help-circle" style="width:14px; height:14px;"></i>
        <span>Question Bank</span>
      </button>

      <button class="tab-underline-btn ${state.activeTab === 'books' ? 'active' : ''}" data-tab="books">
        <i data-lucide="library" style="width:14px; height:14px;"></i>
        <span>Textbooks</span>
      </button>
    </nav>

    <!-- Tab Pane Body -->
    <div>
      ${renderCourseTabContent(course, notesData)}
    </div>
  `;
}

function renderCourseTabContent(course, notesData) {
  if (state.activeTab === 'units') {
    if (!course.units || course.units.length === 0) {
      return `
        <div class="empty-state-card">
          <h3 class="empty-state-title">Practical / Experiential Course</h3>
          <p class="empty-state-desc">This course focuses on laboratory implementations and project deliverables.</p>
          <button class="btn-primary-action" id="jumpToLabTabBtn">View Lab Assignments</button>
        </div>
      `;
    }

    return `
      <div style="display:flex; flex-direction:column; gap:0.85rem;">
        ${course.units.map((unit, uIdx) => {
          const unitId = `${course.code}_unit_${uIdx}`;
          const isMastered = state.completedUnits.includes(unitId);

          return `
            <div class="unit-accordion-item ${uIdx === 0 ? 'open' : ''}" id="unitCard_${uIdx}">
              <div class="unit-accordion-header" data-toggle-unit-idx="${uIdx}">
                <div style="display:flex; align-items:baseline; gap:0.65rem;">
                  <span class="badge-tag">${unit.unitNo}</span>
                  <span style="font-size:var(--text-md); font-weight:600; color:var(--text-main);">${unit.title}</span>
                </div>
                <div style="display:flex; align-items:center; gap:0.65rem;">
                  <span style="font-size:var(--text-xs); color:var(--text-dim);">${unit.hours} hrs</span>
                  <label style="display:flex; align-items:center; gap:0.35rem; font-size:var(--text-xs); color:var(--text-muted); cursor:pointer;" onclick="event.stopPropagation();">
                    <input type="checkbox" style="accent-color:var(--accent); cursor:pointer;" class="unit-mastery-chk" data-u-id="${unitId}" ${isMastered ? 'checked' : ''} />
                    <span>${isMastered ? 'Mastered' : 'Mark Done'}</span>
                  </label>
                  <i data-lucide="chevron-down" style="width:14px; height:14px; color:var(--text-muted);"></i>
                </div>
              </div>

              <div class="unit-accordion-body">
                <div style="font-size:var(--text-xs); font-weight:600; text-transform:uppercase; color:var(--text-dim); margin-bottom:0.65rem;">
                  Topic Checklist (Click to track progress)
                </div>

                <div style="display:flex; flex-direction:column; gap:0.35rem; margin-bottom:1rem;">
                  ${unit.topics.map((t, tIdx) => {
                    const topKey = `${unitId}_topic_${tIdx}`;
                    const checked = state.checkedTopics.includes(topKey);
                    return `
                      <div class="task-row-item ${checked ? 'done' : ''}" style="margin-bottom:0; cursor:pointer;" data-topic-check-key="${topKey}">
                        <input type="checkbox" ${checked ? 'checked' : ''} style="accent-color:var(--accent); pointer-events:none; margin-top:3px;" />
                        <span style="font-size:var(--text-sm); line-height:1.45;">${t}</span>
                      </div>
                    `;
                  }).join('')}
                </div>

                <div style="display:flex; justify-content:flex-end; gap:0.5rem; padding-top:0.75rem; border-top:1px solid var(--border-subtle);">
                  <button class="btn-header-action" data-jump-to-notes-tab="notes">
                    <i data-lucide="file-text" style="width:13px; height:13px;"></i>
                    <span>Read Notes & Derivations</span>
                  </button>
                  <button class="btn-header-action" data-unit-ask-ai="${unit.title}">
                    <i data-lucide="sparkles" style="width:13px; height:13px; color:var(--accent);"></i>
                    <span>Explain Unit with AI</span>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  if (state.activeTab === 'notes') {
    if (!notesData?.units || notesData.units.length === 0) {
      return `
        <div class="empty-state-card">
          <h3 class="empty-state-title">No Notes Database for this Module</h3>
          <p class="empty-state-desc">Generate custom notes and derivations for this subject using the AI Assistant.</p>
        </div>
      `;
    }

    return `
      <div style="display:flex; flex-direction:column; gap:1.75rem;">
        ${notesData.units.map(unit => `
          <div id="unitNotes_${unit.unitNo.replace(/\s+/g, '')}">
            <h3 style="font-size:var(--text-lg); font-weight:700; color:var(--text-main); margin-bottom:0.85rem; border-bottom:1px solid var(--border-subtle); padding-bottom:0.35rem;">
              ${unit.unitNo}: ${unit.title}
            </h3>

            <div style="display:flex; flex-direction:column; gap:1rem;">
              ${(unit.keyConcepts || []).map(c => `
                <div class="stat-tile-card" style="padding:1.25rem;">
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.45rem;">
                    <h4 style="font-size:var(--text-md); font-weight:600; color:var(--text-main);">${c.heading}</h4>
                    <button class="btn-icon-square" data-ai-concept-ask="${c.heading}" title="Deep-dive with AI">
                      <i data-lucide="sparkles" style="width:13px; height:13px; color:var(--accent);"></i>
                    </button>
                  </div>
                  <div style="font-size:var(--text-sm); color:var(--text-muted); line-height:1.65;">
                    ${marked.parse(c.content)}
                  </div>
                  ${c.formula ? `
                    <div style="background:var(--bg-subtle); border:1px solid var(--border-subtle); border-radius:var(--radius-xs); padding:0.55rem 0.85rem; font-family:var(--font-mono); font-size:var(--text-xs); color:var(--text-main); margin-top:0.75rem; display:flex; align-items:center; justify-content:space-between;">
                      <span>📐 Formula / Recurrence: <code>${c.formula}</code></span>
                      <button class="btn-header-action" style="padding:0.2rem 0.5rem; font-size:0.68rem;" data-copy-math-text="${escapeHtml(c.formula)}">
                        Copy
                      </button>
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (state.activeTab === 'lab') {
    return `
      <div style="display:flex; flex-direction:column; gap:1.5rem;">
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <button class="btn-header-action active" data-filter-lab-part="ALL">All Assignments</button>
          <button class="btn-header-action" data-filter-lab-part="Part A">Part A: Algorithms</button>
          <button class="btn-header-action" data-filter-lab-part="Part B">Part B: Databases</button>
          <button class="btn-header-action" data-filter-lab-part="Part C">Part C: Machine Learning</button>
          <button class="btn-header-action" data-filter-lab-part="Part D">Part D: Distributed Systems</button>
        </div>

        <div style="display:flex; flex-direction:column; gap:1.5rem;">
          ${LAB_ASSIGNMENTS.map(assign => `
            <div class="lab-split-card" data-lab-card-part="${assign.part}">
              <div class="lab-split-header">
                <div>
                  <h3 style="font-size:var(--text-md); font-weight:600; color:var(--text-main);">${assign.title}</h3>
                  <p style="font-size:var(--text-xs); color:var(--text-muted); margin-top:0.2rem;">${assign.problemStatement}</p>
                </div>
                <div style="display:flex; gap:0.4rem; align-items:center;">
                  <span class="badge-tag">${assign.part}</span>
                  <span class="badge-tag" style="font-family:var(--font-mono);">${assign.timeComplexity}</span>
                </div>
              </div>

              <div class="lab-grid-two-pane">
                <!-- Left Code Column -->
                <div class="lab-code-column">
                  <div style="padding:0.45rem 0.85rem; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; font-size:var(--text-xs); font-family:var(--font-mono); color:var(--text-dim);">
                    <span>Implementation Code</span>
                    <button class="btn-header-action" style="padding:0.15rem 0.5rem; font-size:0.68rem;" data-copy-lab-code-id="${assign.id}">
                      <i data-lucide="copy" style="width:11px; height:11px;"></i>
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre style="padding:1rem; overflow-x:auto; font-family:var(--font-mono); font-size:0.75rem; color:var(--text-main); line-height:1.55; max-height:420px;" id="code_${assign.id}"><code>${escapeHtml(assign.pythonCode)}</code></pre>
                </div>

                <!-- Right Simulator Column -->
                <div class="lab-simulator-column">
                  <span style="font-size:var(--text-xs); font-weight:600; text-transform:uppercase; color:var(--text-dim); letter-spacing:0.04em;">
                    Live Interactive Simulation
                  </span>
                  ${renderInteractiveSimControls(assign)}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (state.activeTab === 'questions') {
    const qUnits = notesData?.units?.filter(u => u.examQuestions?.length) || [];
    return `
      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        ${qUnits.map(unit => `
          <div class="stat-tile-card" style="padding:1.25rem;">
            <h4 style="font-size:var(--text-sm); font-weight:700; color:var(--text-main); margin-bottom:0.75rem;">
              ${unit.unitNo}: ${unit.title}
            </h4>
            <div style="display:flex; flex-direction:column; gap:0.65rem;">
              ${unit.examQuestions.map(eq => `
                <div style="display:flex; align-items:baseline; gap:0.65rem; font-size:var(--text-sm);">
                  <span class="badge-tag" style="font-family:var(--font-mono); font-weight:600;">${eq.marks}M</span>
                  <span style="flex:1; color:var(--text-main);">${eq.q}</span>
                  <button class="btn-icon-square" style="width:26px; height:26px;" data-ai-answer-q="${escapeHtml(eq.q)}" title="Get model answer with AI">
                    <i data-lucide="sparkles" style="width:12px; height:12px; color:var(--accent);"></i>
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (state.activeTab === 'books') {
    const books = course.textBooks || [];
    const refBooks = course.referenceBooks || [];

    return `
      <div style="display:flex; flex-direction:column; gap:1.75rem;">
        <div>
          <h3 style="font-size:var(--text-lg); font-weight:700; color:var(--text-main); margin-bottom:0.85rem;">
            Prescribed Textbooks
          </h3>
          <div style="display:flex; flex-direction:column; gap:0.65rem;">
            ${books.map((b, i) => `
              <div class="stat-tile-card" style="padding:0.95rem 1.15rem;">
                <div style="font-size:var(--text-xs); color:var(--text-dim);">Textbook ${i + 1}</div>
                <div style="font-size:var(--text-sm); font-weight:500; color:var(--text-main); margin-top:0.2rem;">${b}</div>
              </div>
            `).join('')}
          </div>
        </div>

        ${refBooks.length > 0 ? `
          <div>
            <h3 style="font-size:var(--text-lg); font-weight:700; color:var(--text-main); margin-bottom:0.85rem;">
              Reference Literature
            </h3>
            <div style="display:flex; flex-direction:column; gap:0.65rem;">
              ${refBooks.map((b, i) => `
                <div class="stat-tile-card" style="padding:0.95rem 1.15rem;">
                  <div style="font-size:var(--text-xs); color:var(--text-dim);">Reference ${i + 1}</div>
                  <div style="font-size:var(--text-sm); font-weight:500; color:var(--text-main); margin-top:0.2rem;">${b}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  return '';
}

function renderInteractiveSimControls(assign) {
  if (assign.interactiveType === 'knapsack') {
    return `
      <div class="form-field-quiet">
        <label style="font-size:var(--text-xs); color:var(--text-muted);">Item Values (comma-separated):</label>
        <input class="input-quiet" id="knapValues" value="60, 100, 120" />
      </div>
      <div class="form-field-quiet">
        <label style="font-size:var(--text-xs); color:var(--text-muted);">Item Weights (comma-separated):</label>
        <input class="input-quiet" id="knapWeights" value="10, 20, 30" />
      </div>
      <div class="form-field-quiet">
        <label style="font-size:var(--text-xs); color:var(--text-muted);">Knapsack Capacity (W):</label>
        <input class="input-quiet" id="knapCapacity" type="number" value="50" />
      </div>
      <button class="btn-header-action" style="background:var(--accent); color:#fff; border-color:var(--accent); justify-content:center;" id="runKnapsackSim">
        Compute Optimal Profit
      </button>
      <div class="output-box-quiet" id="knapOutput">Click 'Compute' to calculate bottom-up DP table.</div>
    `;
  }

  if (assign.interactiveType === 'platforms') {
    return `
      <div class="form-field-quiet">
        <label style="font-size:var(--text-xs); color:var(--text-muted);">Arrivals (24hr):</label>
        <input class="input-quiet" id="platArrivals" value="09:00, 09:40, 09:50, 11:00, 15:00, 18:00" />
      </div>
      <div class="form-field-quiet">
        <label style="font-size:var(--text-xs); color:var(--text-muted);">Departures:</label>
        <input class="input-quiet" id="platDepartures" value="09:10, 12:00, 11:20, 11:30, 19:00, 20:00" />
      </div>
      <button class="btn-header-action" style="background:var(--accent); color:#fff; border-color:var(--accent); justify-content:center;" id="runPlatformsSim">
        Calculate Minimum Platforms
      </button>
      <div class="output-box-quiet" id="platOutput">Click 'Calculate' to simulate station platforms.</div>
    `;
  }

  if (assign.interactiveType === 'two_generals') {
    return `
      <div class="form-field-quiet">
        <label style="font-size:var(--text-xs); color:var(--text-muted);">Packet Loss Rate (0.0 to 0.9):</label>
        <input class="input-quiet" id="lossProb" type="number" step="0.1" min="0" max="0.9" value="0.4" />
      </div>
      <button class="btn-header-action" style="background:var(--accent); color:#fff; border-color:var(--accent); justify-content:center;" id="runTwoGeneralsSim">
        Simulate Coordination Protocol
      </button>
      <div class="output-box-quiet" id="twoGeneralsOutput">Click 'Simulate' to test atomic coordination.</div>
    `;
  }

  if (assign.interactiveType === 'bully_election') {
    return `
      <div class="form-field-quiet">
        <label style="font-size:var(--text-xs); color:var(--text-muted);">Failed Coordinator:</label>
        <select class="input-quiet" id="bullyFailedNode">
          <option value="5" selected>Node P5 (Highest UID)</option>
          <option value="4">Node P4</option>
        </select>
      </div>
      <div class="form-field-quiet">
        <label style="font-size:var(--text-xs); color:var(--text-muted);">Initiating Node:</label>
        <select class="input-quiet" id="bullyInitiator">
          <option value="2" selected>Node P2 detects crash</option>
          <option value="1">Node P1 detects crash</option>
        </select>
      </div>
      <button class="btn-header-action" style="background:var(--accent); color:#fff; border-color:var(--accent); justify-content:center;" id="runBullyElectionSim">
        Run Bully Election
      </button>
      <div class="output-box-quiet" id="bullyOutput">Click 'Run' to trigger election broadcast.</div>
    `;
  }

  return `
    <p style="font-size:var(--text-xs); color:var(--text-muted); line-height:1.5;">
      Test case inputs and oral examination preparation points available with AI Tutor.
    </p>
    <button class="btn-header-action" data-unit-ask-ai="${assign.title}">
      <i data-lucide="sparkles" style="width:13px; height:13px; color:var(--accent);"></i>
      <span>Explain with AI</span>
    </button>
    <div class="output-box-quiet">Implementation verified for laboratory submission.</div>
  `;
}

// ============================================================================
// Right Sidebar: Course Outcomes & Personal Scratchpad
// ============================================================================

function renderRightPanel(course) {
  const currentNote = state.studentNotes[course.code] || "";

  return `
    <aside class="sidebar-right">
      ${course.courseOutcomes?.length ? `
        <div>
          <div class="nav-section-title">Course Outcomes (COs)</div>
          <div style="display:flex; flex-direction:column; gap:0.4rem;">
            ${course.courseOutcomes.map(co => `
              <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-xs); padding:0.45rem 0.6rem; font-size:var(--text-xs);">
                <strong style="color:var(--accent);">${co.id}:</strong> ${co.text}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Course Personal Scratchpad -->
      <div style="display:flex; flex-direction:column; gap:0.35rem; margin-top:0.5rem;">
        <div style="display:flex; align-items:baseline; justify-content:space-between;">
          <span class="nav-section-title" style="margin-bottom:0;">Personal Scratchpad</span>
          <span style="font-size:0.65rem; color:var(--status-success);" id="scratchpadSaveStatus">Saved</span>
        </div>
        <textarea 
          class="input-quiet" 
          id="courseScratchpadArea" 
          style="width:100%; height:160px; font-size:var(--text-xs); line-height:1.45; resize:vertical;" 
          placeholder="Jot formulas, exam notes, or viva points for ${course.code}..."
        >${currentNote}</textarea>
        <button class="btn-header-action" style="justify-content:center; font-size:var(--text-xs); padding:0.3rem 0.6rem;" id="saveCourseNoteBtn">
          Save Note
        </button>
      </div>
    </aside>
  `;
}

// ============================================================================
// AI Tutor Side Drawer
// ============================================================================

function renderAiSideDrawer(activeCourse) {
  return `
    <div class="ai-drawer-overlay" id="aiDrawerOverlayBackdrop"></div>
    <div class="ai-drawer-content" id="aiDrawerContent">
      <div class="ai-drawer-header">
        <div>
          <h3 style="font-size:var(--text-sm); font-weight:700; color:var(--text-main);">M.Tech AI Academic Assistant</h3>
          <p style="font-size:0.68rem; color:var(--text-dim);">${state.geminiApiKey ? 'Live Gemini 1.5' : 'Curriculum Grounded Engine'}</p>
        </div>
        <div style="display:flex; gap:0.35rem;">
          <button class="btn-icon-square" id="openAiSettingsBtn" title="API Key Settings">
            <i data-lucide="settings" style="width:14px; height:14px;"></i>
          </button>
          <button class="btn-icon-square" id="clearChatBtn" title="Clear Chat">
            <i data-lucide="trash-2" style="width:14px; height:14px;"></i>
          </button>
          <button class="btn-icon-square" id="closeAiDrawerBtn" title="Close Drawer">
            <i data-lucide="x" style="width:15px; height:15px;"></i>
          </button>
        </div>
      </div>

      <!-- Quick Prompt Suggestions -->
      <div style="padding:0.6rem 1rem; border-bottom:1px solid var(--border-subtle); display:flex; gap:0.4rem; overflow-x:auto;">
        <button class="tag-quiet" data-send-ai-prompt="Explain 0/1 Knapsack dynamic programming recurrence">0/1 Knapsack</button>
        <button class="tag-quiet" data-send-ai-prompt="How does Chandy-Lamport snapshot algorithm record in-flight channels?">Chandy-Lamport</button>
        <button class="tag-quiet" data-send-ai-prompt="Compare Vector Clocks vs Lamport Scalar Clocks with update rules">Vector Clocks</button>
        <button class="tag-quiet" data-send-ai-prompt="Explain R-Tree spatial indexing and bounding rectangles">R-Trees</button>
      </div>

      <!-- Messages Stream -->
      <div class="ai-chat-history" id="aiChatStream">
        ${state.chatHistory.map(msg => `
          <div class="chat-bubble-row ${msg.sender}">
            ${marked.parse(msg.text)}
            ${msg.source ? `<div style="font-size:0.65rem; color:var(--text-dim); margin-top:0.35rem;">Source: ${msg.source}</div>` : ''}
          </div>
        `).join('')}
      </div>

      <!-- Input Bar -->
      <form class="ai-input-bar" id="aiDrawerForm">
        <input 
          type="text" 
          class="input-quiet" 
          id="aiDrawerInput" 
          placeholder="Ask a technical or syllabus question..." 
          style="flex:1;" 
          autocomplete="off"
        />
        <button type="submit" class="btn-header-action" style="background:var(--accent); color:#fff; border-color:var(--accent); padding:0.4rem 0.85rem;">
          Send
        </button>
      </form>
    </div>
  `;
}

// ============================================================================
// Modals & Command Palette Layer
// ============================================================================

function renderActiveModalLayer() {
  if (!state.activeModal) return '';

  if (state.activeModal === 'search') return renderSearchModal();
  if (state.activeModal === 'taskModal') return renderTaskModal();
  if (state.activeModal === 'quiz') return renderQuizModal();
  if (state.activeModal === 'flashcards') return renderFlashcardsModal();
  if (state.activeModal === 'calc') return renderCalcModal();
  if (state.activeModal === 'settings') return renderSettingsModal();
  if (state.activeModal === 'pdfReader') return renderPdfReaderModal();
  return '';
}

function renderSearchModal() {
  return `
    <div class="dialog-modal-backdrop" id="modalBackdrop">
      <div class="dialog-modal-card">
        <div style="padding:0.75rem 1rem; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:0.65rem;">
          <i data-lucide="search" style="width:16px; height:16px; color:var(--text-dim);"></i>
          <input 
            type="text" 
            id="cmdPaletteSearchInput" 
            placeholder="Search subjects, algorithms, research papers, resources..." 
            style="flex:1; border:none; background:transparent; font-size:var(--text-base); color:var(--text-main); outline:none;" 
            autofocus 
          />
          <kbd class="kbd-shortcut">Esc</kbd>
        </div>
        <div style="padding:0.5rem; max-height:360px; overflow-y:auto;" id="cmdPaletteResults">
          <p style="font-size:var(--text-xs); color:var(--text-dim); padding:1rem; text-align:center;">
            Type any term (e.g. 'Knapsack', 'MapReduce', 'SVM', 'Lamport', 'Delta Lake')...
          </p>
        </div>
      </div>
    </div>
  `;
}

function renderTaskModal() {
  return `
    <div class="dialog-modal-backdrop" id="modalBackdrop">
      <div class="dialog-modal-card" style="max-width:480px;">
        <div style="padding:0.85rem 1.15rem; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:var(--text-sm); font-weight:600; color:var(--text-main);">New Study Milestone / Task</span>
          <button class="btn-icon-square" id="closeGenericModalBtn"><i data-lucide="x" style="width:14px; height:14px;"></i></button>
        </div>
        <form style="padding:1.25rem; display:flex; flex-direction:column; gap:0.75rem;" id="createTaskForm">
          <div class="form-field-quiet">
            <label style="font-size:var(--text-xs); color:var(--text-muted);">Task Title *</label>
            <input class="input-quiet" id="taskTitleInput" required placeholder="e.g. Master Floyd-Warshall DP recurrence" />
          </div>
          <div class="form-field-quiet">
            <label style="font-size:var(--text-xs); color:var(--text-muted);">Course Tag</label>
            <select class="input-quiet" id="taskCourseSelect">
              <option value="GENERAL">General / Seminar</option>
              <option value="2604PCC501">2604PCC501: Advanced Algorithms</option>
              <option value="2604PCC502">2604PCC502: Advanced Database Systems</option>
              <option value="2604PCC503">2604PCC503: Machine Learning</option>
              <option value="2604PCC504">2604PCC504: Distributed Computing</option>
              <option value="2604OE505A">2604OE505A: Data Engineering</option>
              <option value="2604OE505D">2604OE505D: Quantum Computing</option>
              <option value="2604PCC526">2604PCC526: Lab Practice - I</option>
            </select>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <div class="form-field-quiet">
              <label style="font-size:var(--text-xs); color:var(--text-muted);">Due Date</label>
              <input type="date" class="input-quiet" id="taskDateInput" />
            </div>
            <div class="form-field-quiet">
              <label style="font-size:var(--text-xs); color:var(--text-muted);">Priority</label>
              <select class="input-quiet" id="taskPrioritySelect">
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="normal" selected>Normal</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div class="form-field-quiet">
            <label style="font-size:var(--text-xs); color:var(--text-muted);">Description (optional)</label>
            <textarea class="input-quiet" id="taskDescInput" style="height:60px; resize:vertical;" placeholder="Key derivation steps, textbook chapter, or assignment file..."></textarea>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:0.5rem;">
            <button type="button" class="btn-header-action" id="cancelTaskModalBtn">Cancel</button>
            <button type="submit" class="btn-primary-action">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderPdfReaderModal() {
  const res = state.modalData?.resource;
  return `
    <div class="dialog-modal-backdrop" id="modalBackdrop">
      <div class="dialog-modal-card" style="width:780px; max-width:94vw;">
        <div style="padding:0.85rem 1.15rem; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:var(--text-sm); font-weight:600; color:var(--text-main);">${res?.title || 'Academic Resource'}</span>
          <button class="btn-icon-square" id="closeGenericModalBtn"><i data-lucide="x" style="width:14px; height:14px;"></i></button>
        </div>
        <div style="padding:1.5rem; max-height:75vh; overflow-y:auto;">
          <div style="background:var(--bg-subtle); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:1rem; margin-bottom:1rem;">
            <div style="font-size:var(--text-xs); color:var(--text-dim);">Resource Type: ${res?.type} • Category: ${res?.category}</div>
            <div style="font-size:var(--text-sm); color:var(--text-muted); margin-top:0.35rem;">${res?.description}</div>
          </div>
          <div style="font-size:var(--text-sm); color:var(--text-main); line-height:1.6;">
            <p>This resource is officially prescribed for <strong>${res?.subjectTitle}</strong> under the Autonomous NEP-2020 syllabus.</p>
            <p style="margin-top:0.75rem;">You can print or download the curriculum reference sheet, review the corresponding notes in the workspace, or generate custom model answers using the AI Assistant.</p>
          </div>
          <div style="display:flex; gap:0.5rem; justify-content:flex-end; margin-top:1.5rem;">
            <button class="btn-header-action" onclick="window.print()">
              <i data-lucide="printer" style="width:13px; height:13px;"></i>
              <span>Print View</span>
            </button>
            <button class="btn-primary-action" id="closeGenericModalActionBtn">
              <span>Back to Workspace</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderQuizModal() {
  const questions = QUIZ_QUESTIONS[state.activeCourseCode] || QUIZ_QUESTIONS["2604PCC501"];
  const currentIdx = state.modalData?.quizIndex || 0;
  const q = questions[currentIdx];
  const userAnswers = state.modalData?.userAnswers || {};
  const isAnswered = userAnswers[currentIdx] !== undefined;

  return `
    <div class="dialog-modal-backdrop" id="modalBackdrop">
      <div class="dialog-modal-card">
        <div style="padding:0.85rem 1.15rem; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:var(--text-sm); font-weight:600; color:var(--text-main);">Practice Exam Quiz (${currentIdx + 1} of ${questions.length})</span>
          <button class="btn-icon-square" id="closeGenericModalBtn"><i data-lucide="x" style="width:14px; height:14px;"></i></button>
        </div>
        <div style="padding:1.25rem 1.4rem;">
          <p style="font-size:var(--text-base); font-weight:600; color:var(--text-main); margin-bottom:1rem;">
            ${q.question}
          </p>

          <div style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1.25rem;">
            ${q.options.map((opt, optIdx) => {
              let btnStyle = "background:var(--bg-subtle); border-color:var(--border-subtle);";
              if (isAnswered) {
                if (optIdx === q.correctAnswer) {
                  btnStyle = "background:var(--status-success-bg); border-color:var(--status-success); color:var(--status-success); font-weight:600;";
                } else if (userAnswers[currentIdx] === optIdx) {
                  btnStyle = "background:var(--status-danger-bg); border-color:var(--status-danger); color:var(--status-danger);";
                }
              }

              return `
                <button class="btn-header-action" style="justify-content:flex-start; text-align:left; ${btnStyle}" data-quiz-option="${optIdx}" ${isAnswered ? 'disabled' : ''}>
                  <span style="font-weight:600; width:18px;">${String.fromCharCode(65 + optIdx)}.</span>
                  <span>${opt}</span>
                </button>
              `;
            }).join('')}
          </div>

          ${isAnswered ? `
            <div style="background:var(--bg-subtle); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:0.75rem 0.95rem; font-size:var(--text-xs); color:var(--text-muted); line-height:1.5;">
              <strong>Explanation:</strong> ${q.explanation}
            </div>
          ` : ''}

          <div style="display:flex; justify-content:space-between; margin-top:1.5rem;">
            <button class="btn-header-action" id="prevQuizQuestionBtn" ${currentIdx === 0 ? 'disabled' : ''}>Previous</button>
            ${currentIdx < questions.length - 1 ? `
              <button class="btn-primary-action" id="nextQuizQuestionBtn" ${!isAnswered ? 'disabled' : ''}>Next</button>
            ` : `
              <button class="btn-primary-action" id="finishQuizQuestionBtn" ${!isAnswered ? 'disabled' : ''}>Finish & Score</button>
            `}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderFlashcardsModal() {
  const deck = FLASHCARD_DECKS[state.activeCourseCode] || FLASHCARD_DECKS["2604PCC501"];
  const currentIdx = state.modalData?.flashIndex || 0;
  const card = deck[currentIdx];
  const isFlipped = state.modalData?.isFlipped || false;

  return `
    <div class="dialog-modal-backdrop" id="modalBackdrop">
      <div class="dialog-modal-card">
        <div style="padding:0.85rem 1.15rem; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:var(--text-sm); font-weight:600; color:var(--text-main);">Revision Flashcards (${currentIdx + 1} of ${deck.length})</span>
          <button class="btn-icon-square" id="closeGenericModalBtn"><i data-lucide="x" style="width:14px; height:14px;"></i></button>
        </div>
        <div style="padding:1.25rem 1.4rem;">
          <div 
            style="background:var(--bg-subtle); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:2rem 1.5rem; text-align:center; min-height:180px; display:flex; flex-direction:column; justify-content:center; cursor:pointer;"
            id="flipCardSurfaceEl"
          >
            <div style="font-size:var(--text-xs); text-transform:uppercase; color:var(--text-dim); margin-bottom:0.75rem;">
              ${isFlipped ? 'Answer & Derivation' : 'Question / Concept'}
            </div>
            <div style="font-family:var(--font-sans); font-size:var(--text-md); font-weight:500; color:var(--text-main); line-height:1.5; white-space:pre-wrap;">
              ${isFlipped ? card.back : card.front}
            </div>
            <div style="font-size:var(--text-xs); color:var(--text-dim); margin-top:1rem;">
              Click card to ${isFlipped ? 'see question' : 'reveal answer'}
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1.25rem;">
            <button class="btn-header-action" id="prevFlashCardBtn" ${currentIdx === 0 ? 'disabled' : ''}>Previous</button>
            <span style="font-size:var(--text-xs); color:var(--text-dim);">${currentIdx + 1} / ${deck.length}</span>
            <button class="btn-header-action" id="nextFlashCardBtn" ${currentIdx === deck.length - 1 ? 'disabled' : ''}>Next</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCalcModal() {
  return `
    <div class="dialog-modal-backdrop" id="modalBackdrop">
      <div class="dialog-modal-card" style="max-width:480px;">
        <div style="padding:0.85rem 1.15rem; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:var(--text-sm); font-weight:600; color:var(--text-main);">Target Mark Calculator</span>
          <button class="btn-icon-square" id="closeGenericModalBtn"><i data-lucide="x" style="width:14px; height:14px;"></i></button>
        </div>
        <div style="padding:1.25rem;">
          <p style="font-size:var(--text-xs); color:var(--text-muted); margin-bottom:1rem;">
            Autonomous Scheme: Teacher Assessment (TAE: 20) + Mid-Sem (CAE: 20) + End-Sem (ESE: 60) = 100 Marks.
          </p>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <div class="form-field-quiet">
              <label style="font-size:var(--text-xs); color:var(--text-muted);">Teacher Assessment (TAE / 20):</label>
              <input class="input-quiet" type="number" min="0" max="20" id="calcTaeField" value="18" />
            </div>
            <div class="form-field-quiet">
              <label style="font-size:var(--text-xs); color:var(--text-muted);">Continuous Assessment / Mid-Sem (CAE / 20):</label>
              <input class="input-quiet" type="number" min="0" max="20" id="calcCaeField" value="16" />
            </div>
            <div class="form-field-quiet">
              <label style="font-size:var(--text-xs); color:var(--text-muted);">Target Grade:</label>
              <select class="input-quiet" id="calcTargetGradeSelect">
                <option value="90">O Grade (>= 90 Marks / 10 CGPA)</option>
                <option value="80" selected>A+ Grade (>= 80 Marks / 9 CGPA)</option>
                <option value="70">A Grade (>= 70 Marks / 8 CGPA)</option>
                <option value="60">B+ Grade (>= 60 Marks / 7 CGPA)</option>
              </select>
            </div>
            <button class="btn-primary-action" id="runCalcMarksBtn" style="justify-content:center; margin-top:0.25rem;">
              Calculate Required ESE Score
            </button>
            <div class="output-box-quiet" id="calcModalOutput">Enter internal scores to compute required End-Sem score.</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSettingsModal() {
  return `
    <div class="dialog-modal-backdrop" id="modalBackdrop">
      <div class="dialog-modal-card" style="max-width:440px;">
        <div style="padding:0.85rem 1.15rem; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:var(--text-sm); font-weight:600; color:var(--text-main);">AI Tutor Settings</span>
          <button class="btn-icon-square" id="closeGenericModalBtn"><i data-lucide="x" style="width:14px; height:14px;"></i></button>
        </div>
        <div style="padding:1.25rem;">
          <p style="font-size:var(--text-xs); color:var(--text-muted); margin-bottom:1rem;">
            The portal provides offline grounded syllabus answers. Enter a Gemini API key if you desire free-form live LLM reasoning.
          </p>
          <div class="form-field-quiet">
            <label style="font-size:var(--text-xs); color:var(--text-muted);">Google Gemini API Key (stored locally):</label>
            <input class="input-quiet" type="password" id="geminiApiKeySetting" value="${state.geminiApiKey}" placeholder="AIzaSy..." />
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.25rem;">
            <button class="btn-header-action" id="clearApiKeyQuietBtn">Clear</button>
            <button class="btn-primary-action" id="saveApiKeyQuietBtn">Save Key</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// Event Listeners & Interactive Handlers
// ============================================================================

function attachEventListeners() {
  // Mobile Nav Toggle
  document.getElementById('toggleMobileNavBtn')?.addEventListener('click', () => {
    state.mobileSidebarOpen = !state.mobileSidebarOpen;
    renderApp();
  });

  // Logo Click -> Dashboard
  document.getElementById('brandHomeNav')?.addEventListener('click', () => {
    state.activeView = 'dashboard';
    saveState();
    renderApp();
  });

  // Navigation Links View Switching
  document.querySelectorAll('[data-nav-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeView = btn.getAttribute('data-nav-view');
      state.mobileSidebarOpen = false;
      saveState();
      renderApp();
    });
  });

  // Semester Dropdown
  document.getElementById('semesterSelector')?.addEventListener('change', (e) => {
    const semId = e.target.value;
    state.activeSemesterId = semId;
    const semObj = SEMESTERS.find(s => s.id === semId);
    if (semObj?.courses?.length) {
      state.activeCourseCode = semObj.courses[0].code;
    }
    saveState();
    renderApp();
    showToast(`Switched to ${semObj?.name}`);
  });

  // Course Selection in Sidebar & Dashboard
  document.querySelectorAll('[data-select-course]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeCourseCode = btn.getAttribute('data-select-course');
      state.activeView = 'course';
      state.activeTab = 'units';
      state.mobileSidebarOpen = false;
      saveState();
      renderApp();
    });
  });

  // Dashboard shortcuts
  document.getElementById('resumeStudyingBtn')?.addEventListener('click', (e) => {
    const code = e.currentTarget.getAttribute('data-jump-course');
    state.activeCourseCode = code;
    state.activeView = 'course';
    state.activeTab = 'units';
    saveState();
    renderApp();
  });

  document.getElementById('dashOpenPlannerBtn')?.addEventListener('click', () => {
    state.activeView = 'planner';
    saveState();
    renderApp();
  });

  document.getElementById('dashOpenResearchBtn')?.addEventListener('click', () => {
    state.activeView = 'research';
    saveState();
    renderApp();
  });

  document.getElementById('dashAddTaskModalBtn')?.addEventListener('click', () => {
    state.activeModal = 'taskModal';
    renderApp();
  });

  // Recently viewed jump
  document.querySelectorAll('[data-jump-recent-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-jump-recent-code');
      const tab = btn.getAttribute('data-jump-recent-tab');
      if (code) {
        state.activeCourseCode = code;
        state.activeView = 'course';
        state.activeTab = tab || 'units';
        saveState();
        renderApp();
      }
    });
  });

  // Dashboard Task Toggle Check
  document.querySelectorAll('[data-dash-toggle-task]').forEach(chk => {
    chk.addEventListener('change', () => {
      const id = chk.getAttribute('data-dash-toggle-task');
      toggleTaskCompleted(id);
      renderApp();
      showToast("Task updated!");
    });
  });

  // Underline Tabs Switcher
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeTab = btn.getAttribute('data-tab');
      renderApp();
    });
  });

  // Theme Switch
  document.getElementById('themeSwitchBtn')?.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    saveState();
    renderApp();
    showToast(`Switched to ${state.theme} mode`);
  });

  // Right Panel Toggle
  document.getElementById('toggleRightPanelBtn')?.addEventListener('click', () => {
    state.isRightSidebarOpen = !state.isRightSidebarOpen;
    renderApp();
  });

  // Pomodoro Focus Timer
  document.getElementById('timerWidgetBtn')?.addEventListener('click', toggleFocusTimer);

  // Command Palette Open & Shortcuts
  document.getElementById('openCommandPaletteBtn')?.addEventListener('click', () => {
    state.activeModal = 'search';
    renderApp();
  });

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      state.activeModal = 'search';
      renderApp();
    }
    if (e.key === 'Escape' && state.activeModal) {
      state.activeModal = null;
      renderApp();
    }
  });

  // AI Drawer Open / Close
  document.getElementById('openAiDrawerTrigger')?.addEventListener('click', () => {
    state.isAiDrawerOpen = true;
    renderApp();
    setTimeout(() => document.getElementById('aiDrawerInput')?.focus(), 100);
  });

  document.getElementById('closeAiDrawerBtn')?.addEventListener('click', () => {
    state.isAiDrawerOpen = false;
    renderApp();
  });

  document.getElementById('aiDrawerOverlayBackdrop')?.addEventListener('click', () => {
    state.isAiDrawerOpen = false;
    renderApp();
  });

  // Course Workspace Actions
  document.getElementById('jumpUnitOneBtn')?.addEventListener('click', () => {
    state.activeTab = 'units';
    renderApp();
    document.getElementById('unitCard_0')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('openLabDirectBtn')?.addEventListener('click', () => {
    state.activeTab = 'lab';
    renderApp();
  });

  document.getElementById('askCourseAiBtn')?.addEventListener('click', () => {
    state.isAiDrawerOpen = true;
    renderApp();
    executeAiAssistantQuery(`Summarize the syllabus, course outcomes, and exam preparation tips for ${state.activeCourseCode}`);
  });

  document.getElementById('printSyllabusBtn')?.addEventListener('click', () => {
    window.print();
  });

  // Unit Accordion
  document.querySelectorAll('[data-toggle-unit-idx]').forEach(hdr => {
    hdr.addEventListener('click', () => {
      const idx = hdr.getAttribute('data-toggle-unit-idx');
      document.getElementById(`unitCard_${idx}`)?.classList.toggle('open');
    });
  });

  // Unit Mastery Checkbox
  document.querySelectorAll('.unit-mastery-chk').forEach(chk => {
    chk.addEventListener('change', () => {
      const uId = chk.getAttribute('data-u-id');
      toggleUnitCompleted(uId);
      renderApp();
      showToast(state.completedUnits.includes(uId) ? "Unit marked mastered!" : "Unit marked incomplete");
    });
  });

  // Topic Check Item
  document.querySelectorAll('[data-topic-check-key]').forEach(row => {
    row.addEventListener('click', () => {
      const key = row.getAttribute('data-topic-check-key');
      toggleTopicChecked(key);
      renderApp();
    });
  });

  // Read Notes Tab jump
  document.querySelectorAll('[data-jump-to-notes-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeTab = 'notes';
      renderApp();
    });
  });

  document.querySelectorAll('[data-unit-ask-ai]').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-unit-ask-ai');
      state.isAiDrawerOpen = true;
      renderApp();
      executeAiAssistantQuery(`Explain unit: "${title}" in detail with key theorems, derivations, and exam points.`);
    });
  });

  // Concept AI Deep Dive
  document.querySelectorAll('[data-ai-concept-ask]').forEach(btn => {
    btn.addEventListener('click', () => {
      const c = btn.getAttribute('data-ai-concept-ask');
      state.isAiDrawerOpen = true;
      renderApp();
      executeAiAssistantQuery(`Explain ${c} with complete mathematical formulation and complexity analysis.`);
    });
  });

  document.querySelectorAll('[data-copy-math-text]').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.getAttribute('data-copy-math-text');
      navigator.clipboard.writeText(f);
      showToast("Formula copied to clipboard");
    });
  });

  // Questions AI Answer
  document.querySelectorAll('[data-ai-answer-q]').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-ai-answer-q');
      state.isAiDrawerOpen = true;
      renderApp();
      executeAiAssistantQuery(`Provide a model autonomous exam answer for: "${q}"`);
    });
  });

  // Course Scratchpad Save
  document.getElementById('saveCourseNoteBtn')?.addEventListener('click', () => {
    const text = document.getElementById('courseScratchpadArea')?.value || "";
    saveStudentNote(state.activeCourseCode, text);
    showToast("Course note saved!");
  });

  // Resource Library Actions
  document.getElementById('resourceSearchInput')?.addEventListener('input', (e) => {
    state.resourceFilter.search = e.target.value;
    renderApp();
  });
  document.getElementById('filterResourceType')?.addEventListener('change', (e) => {
    state.resourceFilter.type = e.target.value;
    renderApp();
  });
  document.getElementById('filterResourceSubject')?.addEventListener('change', (e) => {
    state.resourceFilter.subject = e.target.value;
    renderApp();
  });
  document.getElementById('resetResourceFilterBtn')?.addEventListener('click', () => {
    state.resourceFilter = { semester: "ALL", subject: "ALL", type: "ALL", search: "" };
    renderApp();
  });

  document.querySelectorAll('[data-open-resource-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-open-resource-id');
      const res = ACADEMIC_RESOURCES.find(r => r.id === id);
      if (res) {
        state.activeModal = 'pdfReader';
        state.modalData = { resource: res };
        renderApp();
      }
    });
  });

  document.querySelectorAll('[data-bookmark-resource-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-bookmark-resource-id');
      const res = ACADEMIC_RESOURCES.find(r => r.id === id);
      if (res) {
        toggleBookmarkItem({
          id: res.id,
          type: res.type,
          title: res.title,
          subtitle: res.subjectTitle,
          linkCode: res.subjectCode !== 'GENERAL' ? res.subjectCode : null,
          linkTab: 'units'
        });
        renderApp();
        showToast("Bookmark updated!");
      }
    });
  });

  // Planner Task Toggle & Delete
  document.querySelectorAll('[data-toggle-task-id]').forEach(chk => {
    chk.addEventListener('change', () => {
      const id = chk.getAttribute('data-toggle-task-id');
      toggleTaskCompleted(id);
      renderApp();
      showToast("Task updated!");
    });
  });

  document.querySelectorAll('[data-delete-task-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-delete-task-id');
      deleteStudyTask(id);
      renderApp();
      showToast("Task deleted");
    });
  });

  document.getElementById('openNewTaskModalBtn')?.addEventListener('click', () => {
    state.activeModal = 'taskModal';
    renderApp();
  });

  // Create Task Form Submit
  document.getElementById('createTaskForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('taskTitleInput')?.value.trim();
    const courseCode = document.getElementById('taskCourseSelect')?.value;
    const dueDate = document.getElementById('taskDateInput')?.value;
    const priority = document.getElementById('taskPrioritySelect')?.value;
    const description = document.getElementById('taskDescInput')?.value.trim();

    if (title) {
      addStudyTask({ title, courseCode, dueDate, priority, description });
      state.activeModal = null;
      renderApp();
      showToast("New study task created!");
    }
  });

  // Research Papers Handlers
  document.querySelectorAll('[data-paper-status-id]').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const id = sel.getAttribute('data-paper-status-id');
      setPaperStatus(id, e.target.value);
      showToast("Reading status updated!");
    });
  });

  document.querySelectorAll('[data-copy-bibtex]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-copy-bibtex');
      const paper = RESEARCH_PAPERS.find(p => p.id === id);
      if (paper?.bibtex) {
        navigator.clipboard.writeText(paper.bibtex);
        showToast("BibTeX citation copied to clipboard!");
      }
    });
  });

  document.querySelectorAll('[data-paper-notes-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-paper-notes-toggle');
      const box = document.getElementById(`noteBox_${id}`);
      if (box) {
        box.style.display = box.style.display === 'none' ? 'block' : 'none';
      }
    });
  });

  document.querySelectorAll('[data-save-paper-note]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-save-paper-note');
      const val = document.getElementById(`paperNoteInput_${id}`)?.value || "";
      savePaperNote(id, val);
      showToast("Research note saved!");
    });
  });

  document.querySelectorAll('[data-bookmark-paper-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-bookmark-paper-id');
      const paper = RESEARCH_PAPERS.find(p => p.id === id);
      if (paper) {
        toggleBookmarkItem({
          id: paper.id,
          type: "Research Paper",
          title: paper.title,
          subtitle: `${paper.authors} (${paper.year})`,
          linkCode: paper.subjectCode,
          linkTab: 'notes'
        });
        renderApp();
        showToast("Paper bookmark updated!");
      }
    });
  });

  // Bookmarks View Actions
  document.querySelectorAll('[data-remove-bookmark-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-remove-bookmark-id');
      toggleBookmarkItem({ id });
      renderApp();
      showToast("Bookmark removed");
    });
  });

  document.querySelectorAll('[data-jump-bookmark-code]').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-jump-bookmark-code');
      const tab = btn.getAttribute('data-jump-bookmark-tab');
      state.activeCourseCode = code;
      state.activeView = 'course';
      state.activeTab = tab || 'units';
      saveState();
      renderApp();
    });
  });

  document.getElementById('exploreResourcesBtn')?.addEventListener('click', () => {
    state.activeView = 'resources';
    saveState();
    renderApp();
  });

  // Modal Closers
  document.getElementById('closeGenericModalBtn')?.addEventListener('click', () => {
    state.activeModal = null;
    renderApp();
  });
  document.getElementById('closeGenericModalActionBtn')?.addEventListener('click', () => {
    state.activeModal = null;
    renderApp();
  });
  document.getElementById('cancelTaskModalBtn')?.addEventListener('click', () => {
    state.activeModal = null;
    renderApp();
  });
  document.getElementById('modalBackdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'modalBackdrop') {
      state.activeModal = null;
      renderApp();
    }
  });

  // AI Drawer Form
  document.getElementById('aiDrawerForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('aiDrawerInput');
    const q = input?.value.trim();
    if (q) {
      input.value = '';
      executeAiAssistantQuery(q);
    }
  });

  document.querySelectorAll('[data-send-ai-prompt]').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-send-ai-prompt');
      executeAiAssistantQuery(q);
    });
  });

  document.getElementById('clearChatBtn')?.addEventListener('click', () => {
    state.chatHistory = [{
      sender: "bot",
      time: "Just now",
      text: "Conversation cleared. How can I assist you with your syllabus?",
      source: "Syllabus Reference"
    }];
    saveState();
    renderApp();
  });

  document.getElementById('openAiSettingsBtn')?.addEventListener('click', () => {
    state.activeModal = 'settings';
    renderApp();
  });

  document.getElementById('saveApiKeyQuietBtn')?.addEventListener('click', () => {
    const k = document.getElementById('geminiApiKeySetting')?.value.trim();
    state.geminiApiKey = k;
    saveState();
    state.activeModal = null;
    renderApp();
    showToast("Gemini API key saved!");
  });

  document.getElementById('clearApiKeyQuietBtn')?.addEventListener('click', () => {
    state.geminiApiKey = "";
    saveState();
    state.activeModal = null;
    renderApp();
    showToast("API key cleared");
  });

  // Shortcuts
  document.getElementById('openQuizShortcut')?.addEventListener('click', () => {
    state.activeModal = 'quiz';
    state.modalData = { quizIndex: 0, userAnswers: {} };
    renderApp();
  });

  document.getElementById('openFlashShortcut')?.addEventListener('click', () => {
    state.activeModal = 'flashcards';
    state.modalData = { flashIndex: 0, isFlipped: false };
    renderApp();
  });

  document.getElementById('openCalcShortcut')?.addEventListener('click', () => {
    state.activeModal = 'calc';
    renderApp();
  });

  // Lab Simulators
  attachLabSimulators();

  // Quiz Navigation
  attachQuizHandlers();

  // Flashcards Navigation
  attachFlashcardHandlers();

  // Marks Calculator
  attachMarksCalcHandlers();

  // Command Palette Search
  attachCommandPaletteHandlers();
}

// ============================================================================
// Focus Timer Logic
// ============================================================================

function toggleFocusTimer() {
  if (state.pomodoro.isRunning) {
    clearInterval(state.pomodoro.timerId);
    state.pomodoro.isRunning = false;
    showToast("Focus timer paused");
  } else {
    state.pomodoro.isRunning = true;
    showToast("Focus session started (25 min)");
    state.pomodoro.timerId = setInterval(() => {
      if (state.pomodoro.seconds > 0) {
        state.pomodoro.seconds--;
        const el = document.getElementById('timerDigitEl');
        if (el) el.textContent = formatTime(state.pomodoro.seconds);
      } else {
        clearInterval(state.pomodoro.timerId);
        state.pomodoro.isRunning = false;
        showToast("Focus session finished! Time for a 5-minute break.");
        state.pomodoro.seconds = state.pomodoro.mode === 'work' ? 5 * 60 : 25 * 60;
        state.pomodoro.mode = state.pomodoro.mode === 'work' ? 'break' : 'work';
      }
    }, 1000);
  }
  renderApp();
}

// ============================================================================
// Lab Practice Simulators Logic
// ============================================================================

function attachLabSimulators() {
  // Knapsack
  document.getElementById('runKnapsackSim')?.addEventListener('click', () => {
    try {
      const val = document.getElementById('knapValues').value.split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x));
      const wt = document.getElementById('knapWeights').value.split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x));
      const W = parseInt(document.getElementById('knapCapacity').value, 10);

      if (val.length !== wt.length || val.length === 0 || isNaN(W)) {
        document.getElementById('knapOutput').textContent = "Error: Input values and weights must have matching lengths.";
        return;
      }

      const n = val.length;
      const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

      for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= W; w++) {
          if (wt[i - 1] <= w) {
            dp[i][w] = Math.max(dp[i - 1][w], val[i - 1] + dp[i - 1][w - wt[i - 1]]);
          } else {
            dp[i][w] = dp[i - 1][w];
          }
        }
      }

      let res = dp[n][W];
      let currW = W;
      const selected = [];
      for (let i = n; i > 0 && res > 0; i--) {
        if (res !== dp[i - 1][currW]) {
          selected.push(`Item ${i} (Weight: ${wt[i - 1]}, Value: ${val[i - 1]})`);
          res -= val[i - 1];
          currW -= wt[i - 1];
        }
      }

      document.getElementById('knapOutput').textContent = 
        `Optimal Max Value: $${dp[n][W]}\n` +
        `Selected Items: ${selected.length ? selected.reverse().join(', ') : 'None'}\n` +
        `Bottom-up DP table computed in O(n*W) time.`;
      showToast("0/1 Knapsack optimal value calculated");
    } catch (err) {
      document.getElementById('knapOutput').textContent = "Error: " + err.message;
    }
  });

  // Platforms
  document.getElementById('runPlatformsSim')?.addEventListener('click', () => {
    try {
      const arr = document.getElementById('platArrivals').value.split(',').map(x => x.trim()).sort();
      const dep = document.getElementById('platDepartures').value.split(',').map(x => x.trim()).sort();

      let i = 0, j = 0, current = 0, maxPlat = 0;
      const n = arr.length;

      while (i < n && j < n) {
        if (arr[i] <= dep[j]) {
          current++;
          if (current > maxPlat) maxPlat = current;
          i++;
        } else {
          current--;
          j++;
        }
      }

      document.getElementById('platOutput').textContent = `Minimum Platforms Needed: ${maxPlat}\nAlgorithm: Greedy activity intervals in O(n log n) time.`;
      showToast(`Minimum platforms required: ${maxPlat}`);
    } catch (err) {
      document.getElementById('platOutput').textContent = "Error: " + err.message;
    }
  });

  // Two Generals
  document.getElementById('runTwoGeneralsSim')?.addEventListener('click', () => {
    const dropProb = parseFloat(document.getElementById('lossProb').value) || 0.4;
    let output = "Two Generals Protocol Simulation:\n";
    let delivered = false;

    for (let r = 1; r <= 6; r++) {
      if (Math.random() >= dropProb) {
        output += `Attempt ${r}: Message 'ATTACK AT DAWN' acknowledged!\n`;
        delivered = true;
        break;
      } else {
        output += `Attempt ${r}: Packet dropped in transit. Retransmitting...\n`;
      }
    }

    output += delivered 
      ? "\nResult: Agreement established under bounded retransmissions." 
      : "\nResult: Channel failed repeatedly. Illustrates impossibility of guaranteed consensus over unconfirmed lossy channels.";
    document.getElementById('twoGeneralsOutput').textContent = output;
  });

  // Bully Election
  document.getElementById('runBullyElectionSim')?.addEventListener('click', () => {
    const failed = parseInt(document.getElementById('bullyFailedNode').value, 10);
    const initiator = parseInt(document.getElementById('bullyInitiator').value, 10);

    let output = `Bully Election Protocol Trace:\n`;
    output += `Status: Coordinator P${failed} has crashed.\n`;
    output += `P${initiator} detects heartbeat timeout and broadcasts ELECTION.\n`;

    const higherNodes = [3, 4, 5].filter(x => x > initiator && x !== failed);
    if (higherNodes.length > 0) {
      const winner = Math.max(...higherNodes);
      output += `Higher node P${winner} responds OK and broadcasts COORDINATOR.\n`;
      output += `\nResult: Node P${winner} elected new leader.`;
    } else {
      output += `No higher alive node responded.\n`;
      output += `\nResult: Node P${initiator} declares itself COORDINATOR.`;
    }
    document.getElementById('bullyOutput').textContent = output;
  });

  // Copy Lab Code
  document.querySelectorAll('[data-copy-lab-code-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-copy-lab-code-id');
      const el = document.getElementById(`code_${id}`);
      if (el) {
        navigator.clipboard.writeText(el.textContent);
        showToast("Code copied to clipboard");
      }
    });
  });

  // Filter Lab Part
  document.querySelectorAll('[data-filter-lab-part]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter-lab-part]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const p = btn.getAttribute('data-filter-lab-part');

      document.querySelectorAll('[data-lab-card-part]').forEach(card => {
        const cardPart = card.getAttribute('data-lab-card-part');
        card.style.display = (p === 'ALL' || cardPart === p) ? 'block' : 'none';
      });
    });
  });
}

// ============================================================================
// Quiz & Flashcards Logic
// ============================================================================

function attachQuizHandlers() {
  document.querySelectorAll('[data-quiz-option]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pick = parseInt(btn.getAttribute('data-quiz-option'), 10);
      state.modalData.userAnswers[state.modalData.quizIndex] = pick;
      renderApp();
    });
  });

  document.getElementById('nextQuizQuestionBtn')?.addEventListener('click', () => {
    state.modalData.quizIndex++;
    renderApp();
  });

  document.getElementById('prevQuizQuestionBtn')?.addEventListener('click', () => {
    state.modalData.quizIndex--;
    renderApp();
  });

  document.getElementById('finishQuizQuestionBtn')?.addEventListener('click', () => {
    const questions = QUIZ_QUESTIONS[state.activeCourseCode] || QUIZ_QUESTIONS["2604PCC501"];
    let score = 0;
    questions.forEach((q, idx) => {
      if (state.modalData.userAnswers[idx] === q.correctAnswer) score++;
    });

    const percent = Math.round((score / questions.length) * 100);
    alert(`Quiz Result: ${score} of ${questions.length} correct (${percent}%).`);
    state.activeModal = null;
    renderApp();
  });
}

function attachFlashcardHandlers() {
  document.getElementById('flipCardSurfaceEl')?.addEventListener('click', () => {
    state.modalData.isFlipped = !state.modalData.isFlipped;
    renderApp();
  });

  document.getElementById('nextFlashCardBtn')?.addEventListener('click', () => {
    state.modalData.flashIndex++;
    state.modalData.isFlipped = false;
    renderApp();
  });

  document.getElementById('prevFlashCardBtn')?.addEventListener('click', () => {
    state.modalData.flashIndex--;
    state.modalData.isFlipped = false;
    renderApp();
  });
}

function attachMarksCalcHandlers() {
  document.getElementById('runCalcMarksBtn')?.addEventListener('click', () => {
    const tae = parseFloat(document.getElementById('calcTaeField').value) || 0;
    const cae = parseFloat(document.getElementById('calcCaeField').value) || 0;
    const target = parseFloat(document.getElementById('calcTargetGradeSelect').value) || 80;

    const internalTotal = tae + cae; // out of 40
    const needed = target - internalTotal; // out of 60

    let msg = `Internal Marks: ${internalTotal} / 40\n`;
    if (needed > 60) {
      msg += `Note: Target cannot be reached with 60/60 in ESE. Internal score must be higher.`;
    } else if (needed <= 0) {
      msg += `Target achieved: Current internals meet the ${target} threshold. Passing ESE secures this grade.`;
    } else {
      const pct = Math.round((needed / 60) * 100);
      msg += `Required End-Sem (ESE) Score: ${needed.toFixed(1)} / 60 Marks (${pct}%) to secure target grade.`;
    }
    document.getElementById('calcModalOutput').textContent = msg;
  });
}

function attachCommandPaletteHandlers() {
  const input = document.getElementById('cmdPaletteSearchInput');
  const resultsBox = document.getElementById('cmdPaletteResults');

  input?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q || q.length < 2) {
      resultsBox.innerHTML = `<p style="font-size:var(--text-xs); color:var(--text-dim); padding:1rem; text-align:center;">Type any keyword...</p>`;
      return;
    }

    const matches = [];

    // Search courses
    SEMESTERS.forEach(sem => {
      sem.courses.forEach(c => {
        if (c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)) {
          matches.push({
            title: `${c.code}: ${c.title}`,
            sub: `${sem.name} • ${c.type}`,
            type: "Subject",
            action: () => {
              state.activeCourseCode = c.code;
              state.activeView = 'course';
              state.activeTab = 'units';
            }
          });
        }
      });
    });

    // Search research papers
    RESEARCH_PAPERS.forEach(p => {
      if (p.title.toLowerCase().includes(q) || p.authors.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q))) {
        matches.push({
          title: `Paper: ${p.title}`,
          sub: `${p.authors} (${p.year}) • ${p.venue}`,
          type: "Research Paper",
          action: () => {
            state.activeView = 'research';
          }
        });
      }
    });

    // Search resources
    ACADEMIC_RESOURCES.forEach(r => {
      if (r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)) {
        matches.push({
          title: `Resource: ${r.title}`,
          sub: `${r.type} • ${r.subjectTitle}`,
          type: "Resource",
          action: () => {
            state.activeView = 'resources';
          }
        });
      }
    });

    if (matches.length === 0) {
      resultsBox.innerHTML = `<p style="font-size:var(--text-xs); color:var(--text-dim); padding:1rem; text-align:center;">No matching records found.</p>`;
      return;
    }

    resultsBox.innerHTML = matches.slice(0, 8).map((m, idx) => `
      <button class="btn-header-action" style="width:100%; justify-content:flex-start; text-align:left; padding:0.55rem 0.85rem; margin-bottom:0.3rem;" data-cmd-match-idx="${idx}">
        <div style="flex:1;">
          <div style="font-size:var(--text-sm); font-weight:600; color:var(--text-main);">${m.title}</div>
          <div style="font-size:var(--text-xs); color:var(--text-dim); margin-top:0.15rem;">${m.sub}</div>
        </div>
        <span class="badge-tag">${m.type}</span>
      </button>
    `).join('');

    resultsBox.querySelectorAll('[data-cmd-match-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-cmd-match-idx'), 10);
        matches[idx]?.action();
        state.activeModal = null;
        saveState();
        renderApp();
      });
    });
  });
}

// ============================================================================
// AI Tutor Query Execution Engine
// ============================================================================

async function executeAiAssistantQuery(userText) {
  state.chatHistory.push({
    sender: "user",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: userText
  });
  saveState();
  renderApp();
  scrollDrawerToBottom();

  if (state.geminiApiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${state.geminiApiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert M.Tech Computer Engineering professor for the Autonomous 2026 Pattern NEP-2020 curriculum. Answer this student's query thoroughly with technical accuracy, mathematical formulas, and algorithms: "${userText}"`
            }]
          }]
        })
      });

      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        state.chatHistory.push({
          sender: "bot",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: data.candidates[0].content.parts[0].text,
          source: "Live Gemini 1.5"
        });
        saveState();
        renderApp();
        scrollDrawerToBottom();
        return;
      }
    } catch (e) {
      console.warn("Gemini API call failed, using built-in knowledge base:", e);
    }
  }

  const aiAnswer = findAiResponse(userText);
  state.chatHistory.push({
    sender: "bot",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: aiAnswer.text,
    source: aiAnswer.subject || "Syllabus Reference"
  });
  saveState();
  renderApp();
  scrollDrawerToBottom();
}

function scrollDrawerToBottom() {
  const box = document.getElementById('aiChatStream');
  if (box) {
    box.scrollTop = box.scrollHeight;
  }
}

// Toast
function showToast(message) {
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

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Initial Boot
renderApp();
