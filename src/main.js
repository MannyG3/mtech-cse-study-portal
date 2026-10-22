// M.Tech Computer Engineering Curriculum & Study Companion
// Calm, Editorial Design System (Linear / Notion / Readwise Inspired)
// NEP-2020 Pattern (2026 Academic Pattern)

import './style.css';
import { CURRICULUM_METADATA, SEMESTERS } from './data/curriculum.js';
import { SUBJECT_NOTES } from './data/notes.js';
import { LAB_ASSIGNMENTS } from './data/labData.js';
import { findAiResponse } from './data/aiKnowledgeBase.js';
import { QUIZ_QUESTIONS, FLASHCARD_DECKS } from './data/quizData.js';
import { 
  state, 
  saveState, 
  toggleUnitCompleted, 
  toggleTopicChecked, 
  saveStudentNote 
} from './state.js';
import { marked } from 'marked';
import confetti from 'canvas-confetti';
import { createIcons, icons } from 'lucide';

// Configure marked
marked.setOptions({
  gfm: true,
  breaks: true
});

const appEl = document.getElementById('app');

// Helper: Format credit string properly
function formatCredits(count) {
  if (count === 1) return "1 credit";
  return `${count} credits`;
}

// Helper: Format teaching scheme hours cleanly
function formatTeachingScheme(scheme) {
  if (!scheme) return "";
  const parts = [];
  if (scheme.lectures && scheme.lectures > 0) {
    parts.push(`${scheme.lectures} hrs/wk lecture`);
  }
  if (scheme.practical && scheme.practical > 0) {
    parts.push(`${scheme.practical} hrs/wk practical`);
  }
  if (scheme.tutorial && scheme.tutorial > 0) {
    parts.push(`${scheme.tutorial} hrs/wk tutorial`);
  }
  return parts.join(" • ");
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

  // Compute overall curriculum progress
  const totalUnits = SEMESTERS[0].courses.reduce((acc, c) => acc + (c.units ? c.units.length : 0), 0);
  const completedCount = state.completedUnits.length;
  const progressPercent = totalUnits > 0 ? Math.round((completedCount / totalUnits) * 100) : 0;

  // Split courses by Core (PCC) vs Electives (PEC / VSEC / Lab)
  const coreCourses = activeSem.courses.filter(c => c.type === 'PCC');
  const electiveCourses = activeSem.courses.filter(c => c.type !== 'PCC');

  appEl.innerHTML = `
    <!-- Quiet Header Navbar -->
    <header class="site-header">
      <div class="header-left">
        <button class="btn-quiet-icon" id="toggleMobileNav" title="Toggle Navigation" style="display:none;" class="mobile-toggle">
          <i data-lucide="menu" style="width:16px; height:16px;"></i>
        </button>

        <div class="header-brand">
          <span class="header-title">M.Tech Computer Engineering</span>
          <span class="header-subtitle">• NEP-2020</span>
        </div>

        <!-- Semester Selector -->
        <select class="semester-select" id="semSelect" aria-label="Select Semester">
          ${SEMESTERS.map(s => `
            <option value="${s.id}" ${s.id === state.activeSemesterId ? 'selected' : ''}>
              ${s.name} (${s.totalCredits} credits)
            </option>
          `).join('')}
        </select>
      </div>

      <div class="header-right">
        <!-- Quiet Pomodoro Control -->
        <button class="timer-control ${state.pomodoro.isRunning ? 'running' : ''}" id="timerToggleBtn" title="Focus Timer: Click to Start / Pause">
          <span class="timer-indicator-dot"></span>
          <span id="timerDigits">${formatTime(state.pomodoro.seconds)}</span>
          <span style="font-size:0.65rem; color:var(--text-dim);">${state.pomodoro.mode === 'work' ? 'FOCUS' : 'BREAK'}</span>
        </button>

        <!-- Command Palette Trigger -->
        <button class="search-btn" id="openSearchBtn">
          <i data-lucide="search" style="width:13px; height:13px;"></i>
          <span>Search...</span>
          <kbd class="search-kbd">Ctrl K</kbd>
        </button>

        <!-- Study Tools Dropdown Trigger -->
        <button class="btn-nav-action" id="openStudyMenuBtn">
          <i data-lucide="compass" style="width:14px; height:14px;"></i>
          <span>Study Tools</span>
        </button>

        <!-- AI Tutor Drawer Trigger -->
        <button class="btn-nav-action" id="openAiDrawerBtn">
          <i data-lucide="message-square" style="width:14px; height:14px;"></i>
          <span>AI Tutor</span>
        </button>

        <!-- Right Panel Toggle -->
        <button class="btn-quiet-icon ${state.isRightSidebarOpen ? 'active' : ''}" id="toggleRightPanelBtn" title="Toggle Right Sidebar">
          <i data-lucide="sidebar" style="width:15px; height:15px;"></i>
        </button>

        <!-- Theme Toggle -->
        <button class="btn-quiet-icon" id="toggleThemeBtn" title="Toggle Light / Dark Theme">
          <i data-lucide="${state.theme === 'dark' ? 'sun' : 'moon'}" style="width:15px; height:15px;"></i>
        </button>
      </div>
    </header>

    <!-- Three-Column Layout -->
    <div class="layout-container ${!state.isRightSidebarOpen ? 'panel-collapsed' : ''}">
      <!-- Left Slim Navigation -->
      <aside class="sidebar-left ${state.mobileSidebarOpen ? 'mobile-open' : ''}" id="sidebarLeft">
        <!-- Minimal Progress Line -->
        <div class="progress-summary-box">
          <div class="progress-label-row">
            <span class="progress-text">Syllabus Progress</span>
            <span class="progress-subtext">
              ${completedCount === 0 ? 'Start with Unit 1' : `${completedCount} of ${totalUnits} units (${progressPercent}%)`}
            </span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-indicator" style="width: ${progressPercent}%;"></div>
          </div>
        </div>

        <!-- Subject List: Core Courses -->
        <div>
          <div class="nav-group-title">Core Courses</div>
          <nav class="subject-nav-list">
            ${coreCourses.map(course => renderSubjectNavRow(course)).join('')}
          </nav>
        </div>

        <!-- Subject List: Electives & Labs -->
        ${electiveCourses.length > 0 ? `
          <div>
            <div class="nav-group-title">Electives & Practical</div>
            <nav class="subject-nav-list">
              ${electiveCourses.map(course => renderSubjectNavRow(course)).join('')}
            </nav>
          </div>
        ` : ''}

        <!-- Bottom Tools Shortcuts -->
        <div class="sidebar-bottom-tools">
          <button class="sidebar-tool-link" id="sidePracticeQuiz">
            <i data-lucide="check-circle-2" style="width:14px; height:14px;"></i>
            <span>Practice Quiz</span>
          </button>
          <button class="sidebar-tool-link" id="sideFlashcards">
            <i data-lucide="layers" style="width:14px; height:14px;"></i>
            <span>Revision Flashcards</span>
          </button>
          <button class="sidebar-tool-link" id="sideMarkTarget">
            <i data-lucide="calculator" style="width:14px; height:14px;"></i>
            <span>Target Mark Calculator</span>
          </button>
          <button class="sidebar-tool-link" id="sideLabHub">
            <i data-lucide="terminal" style="width:14px; height:14px;"></i>
            <span>Lab Practice I Sandbox</span>
          </button>
        </div>
      </aside>

      <!-- Center Reading Column -->
      <main class="main-column">
        ${renderCourseHeader(activeCourse)}
        ${renderStickyTabs(activeCourse)}
        ${renderTabContent(activeCourse, notesData)}
      </main>

      <!-- Right Collapsible Panel: TOC & Scratchpad -->
      ${state.isRightSidebarOpen ? renderRightPanel(activeCourse) : ''}
    </div>

    <!-- AI Tutor Side Drawer -->
    ${state.isAiDrawerOpen ? renderAiDrawer(activeCourse) : ''}

    <!-- Command Palette & Modals -->
    <div id="modalHost">
      ${renderActiveModal()}
    </div>

    <!-- Quiet Toast Notification Host -->
    <div class="toast-host" id="toastHost"></div>
  `;

  // Render crisp line icons with Lucide
  createIcons({ icons });

  // Attach all event listeners
  attachEventListeners();
}

// ============================================================================
// Render Subject Row (Left Navigation)
// ============================================================================

function renderSubjectNavRow(course) {
  const isActive = course.code === state.activeCourseCode;
  return `
    <button class="subject-nav-row ${isActive ? 'active' : ''}" data-nav-code="${course.code}">
      <span class="subject-row-name">${course.title}</span>
      <span class="subject-row-meta">${course.code} • ${formatCredits(course.credits)}</span>
    </button>
  `;
}

// ============================================================================
// Render Course Header Section
// ============================================================================

function renderCourseHeader(course) {
  const teachingText = formatTeachingScheme(course.teachingScheme);
  const isLab = course.type === 'PCC_LAB' || course.code === '2604PCC526';

  return `
    <header class="course-header-area" id="courseHeaderSection">
      <div class="course-meta-top">
        <span class="tag-quiet">${course.code}</span>
        <span class="tag-quiet">${course.typeFullName || course.type}</span>
        <span class="tag-quiet">${formatCredits(course.credits)}</span>
        ${teachingText ? `<span class="tag-quiet">${teachingText}</span>` : ''}
      </div>

      <h1 class="course-display-title">${course.title}</h1>
      <p class="course-editorial-desc">${course.description || 'Curriculum framework conforming to autonomous NEP-2020 guidelines.'}</p>

      <!-- Primary Action Row -->
      <div class="course-action-bar">
        ${isLab ? `
          <button class="btn-primary-action" id="actionPrimaryLab">
            <i data-lucide="play" style="width:14px; height:14px;"></i>
            <span>Open Lab Simulators</span>
          </button>
        ` : `
          <button class="btn-primary-action" id="actionContinueUnit">
            <i data-lucide="book-open" style="width:14px; height:14px;"></i>
            <span>Continue Unit 1</span>
          </button>
        `}

        <button class="btn-secondary-action" id="actionAskCourseAi">
          <i data-lucide="message-square" style="width:14px; height:14px;"></i>
          <span>Ask AI Tutor</span>
        </button>

        <button class="btn-secondary-action" id="actionPrintNotes" title="Printable syllabus view">
          <i data-lucide="printer" style="width:14px; height:14px;"></i>
          <span>Print Syllabus</span>
        </button>
      </div>

      <!-- Compact Exam Scheme Stat Row -->
      <div class="exam-stat-row">
        <div class="exam-stat-header">
          <span>Evaluation Weightage (Autonomous 2026 Pattern)</span>
          <span style="color:var(--text-main); font-weight:600;">Total: 100 Marks</span>
        </div>
        <div class="exam-single-bar">
          <div class="seg-tae" title="Teacher Assessment Exam (20%)"></div>
          <div class="seg-cae" title="Continuous Assessment Mid-Sem (20%)"></div>
          <div class="seg-ese" title="End-Semester Autonomous Exam (60%)"></div>
        </div>
        <div class="exam-legend-row">
          <div class="exam-legend-item">
            <span class="legend-swatch" style="background:var(--seg-tae);"></span>
            <span>TAE: <strong>${course.examScheme?.tae ?? 20} Marks</strong> (20%)</span>
          </div>
          <div class="exam-legend-item">
            <span class="legend-swatch" style="background:var(--seg-cae);"></span>
            <span>CAE: <strong>${course.examScheme?.cae ?? 20} Marks</strong> (20%)</span>
          </div>
          <div class="exam-legend-item">
            <span class="legend-swatch" style="background:var(--seg-ese);"></span>
            <span>ESE: <strong>${course.examScheme?.ese ?? 60} Marks</strong> (60%)</span>
          </div>
        </div>
      </div>
    </header>
  `;
}

// ============================================================================
// Sticky Tabs with Underline Indicator
// ============================================================================

function renderStickyTabs(course) {
  const isLabCourse = course.type === 'PCC_LAB' || course.code === '2604PCC526';

  return `
    <nav class="sticky-tabs-wrapper" aria-label="Course Sections">
      <button class="underline-tab-btn ${state.activeTab === 'units' ? 'active' : ''}" data-tab="units">
        <i data-lucide="book-open" style="width:14px; height:14px;"></i>
        <span>Syllabus & Units</span>
      </button>

      <button class="underline-tab-btn ${state.activeTab === 'notes' ? 'active' : ''}" data-tab="notes">
        <i data-lucide="file-text" style="width:14px; height:14px;"></i>
        <span>Study Notes</span>
      </button>

      ${(isLabCourse || course.parts) ? `
        <button class="underline-tab-btn ${state.activeTab === 'lab' ? 'active' : ''}" data-tab="lab">
          <i data-lucide="terminal" style="width:14px; height:14px;"></i>
          <span>Lab Practice Assignments</span>
        </button>
      ` : ''}

      <button class="underline-tab-btn ${state.activeTab === 'questions' ? 'active' : ''}" data-tab="questions">
        <i data-lucide="help-circle" style="width:14px; height:14px;"></i>
        <span>Question Bank</span>
      </button>

      <button class="underline-tab-btn ${state.activeTab === 'books' ? 'active' : ''}" data-tab="books">
        <i data-lucide="library" style="width:14px; height:14px;"></i>
        <span>Textbooks</span>
      </button>
    </nav>
  `;
}

// ============================================================================
// Render Tab Content Panes
// ============================================================================

function renderTabContent(course, notesData) {
  if (state.activeTab === 'units') {
    return renderUnitsPane(course);
  } else if (state.activeTab === 'notes') {
    return renderNotesPane(course, notesData);
  } else if (state.activeTab === 'lab') {
    return renderLabPane(course);
  } else if (state.activeTab === 'questions') {
    return renderQuestionsPane(course, notesData);
  } else if (state.activeTab === 'books') {
    return renderBooksPane(course);
  }
  return renderUnitsPane(course);
}

// 1. Units Pane with Helpful Empty State
function renderUnitsPane(course) {
  // If the course doesn't have lecture units (e.g. Lab Practice I), render helpful empty state
  if (!course.units || course.units.length === 0) {
    return `
      <div class="empty-state-card">
        <h3 class="empty-state-title">Practical & Experiential Learning Course</h3>
        <p class="empty-state-desc">
          This course focuses on hands-on software development, database querying, and distributed system simulations rather than standard lecture modules.
        </p>
        <div class="empty-state-actions">
          <button class="btn-primary-action" id="emptyStateJumpLab">
            <i data-lucide="terminal" style="width:14px; height:14px;"></i>
            <span>View Lab Practice Assignments</span>
          </button>
          <button class="btn-secondary-action" id="emptyStateAskAi">
            <i data-lucide="message-square" style="width:14px; height:14px;"></i>
            <span>Ask AI for Guidance</span>
          </button>
        </div>
      </div>
    `;
  }

  return `
    <div class="units-editorial-stack">
      ${course.units.map((unit, uIdx) => {
        const unitId = `${course.code}_unit_${uIdx}`;
        const isMastered = state.completedUnits.includes(unitId);

        return `
          <div class="unit-row-card ${uIdx === 0 ? 'open' : ''}" id="unitCard_${uIdx}">
            <div class="unit-row-header" data-toggle-unit="${uIdx}">
              <div class="unit-header-left">
                <span class="unit-label-serif">${unit.unitNo}</span>
                <span class="unit-title-text">${unit.title}</span>
              </div>
              <div class="unit-header-right">
                <span class="unit-time-tag">${unit.hours} hrs</span>
                <label class="unit-done-toggle" onclick="event.stopPropagation();">
                  <input type="checkbox" class="mastery-check" data-unit-id="${unitId}" ${isMastered ? 'checked' : ''}/>
                  <span>${isMastered ? 'Done' : 'Mark complete'}</span>
                </label>
                <i data-lucide="chevron-down" style="width:15px; height:15px; color:var(--text-muted);"></i>
              </div>
            </div>

            <div class="unit-body-content">
              <div style="font-size:var(--text-xs); font-weight:600; text-transform:uppercase; color:var(--text-dim); margin-bottom:0.75rem; letter-spacing:0.04em;">
                Topic Checklist
              </div>

              <ul class="topic-checklist">
                ${unit.topics.map((t, tIdx) => {
                  const topicKey = `${unitId}_topic_${tIdx}`;
                  const isChecked = state.checkedTopics.includes(topicKey);

                  return `
                    <li class="topic-check-item ${isChecked ? 'done' : ''}" data-topic-key="${topicKey}">
                      <span class="checkbox-custom">
                        ${isChecked ? '<i data-lucide="check" style="width:11px; height:11px;"></i>' : ''}
                      </span>
                      <span>${t}</span>
                    </li>
                  `;
                }).join('')}
              </ul>

              <div class="unit-action-footer">
                <button class="btn-secondary-action" data-unit-open-notes="${unit.unitNo}">
                  <i data-lucide="file-text" style="width:13px; height:13px;"></i>
                  <span>Read Notes</span>
                </button>
                <button class="btn-secondary-action" data-unit-ai-explain="${unit.title}">
                  <i data-lucide="sparkles" style="width:13px; height:13px;"></i>
                  <span>Explain with AI</span>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// 2. Study Notes & Formulas Pane
function renderNotesPane(course, notesData) {
  if (!notesData?.units || notesData.units.length === 0) {
    return `
      <div class="empty-state-card">
        <h3 class="empty-state-title">No Lecture Notes Available</h3>
        <p class="empty-state-desc">
          Lecture notes are mapped directly to lecture-based PCC subjects. You can generate custom notes using the AI Tutor.
        </p>
        <div class="empty-state-actions">
          <button class="btn-primary-action" id="emptyStateAskAi">
            <i data-lucide="sparkles" style="width:14px; height:14px;"></i>
            <span>Generate Notes with AI</span>
          </button>
        </div>
      </div>
    `;
  }

  return `
    <div style="display:flex; flex-direction:column; gap:1.75rem;">
      ${notesData.units.map(unit => `
        <section id="notesSection_${unit.unitNo.replace(/\s+/g, '')}">
          <h3 style="font-family:var(--font-serif); font-size:var(--text-xl); font-weight:500; color:var(--text-main); margin-bottom:1rem; border-bottom:1px solid var(--border-subtle); padding-bottom:0.4rem;">
            ${unit.unitNo}: ${unit.title}
          </h3>

          <div style="display:flex; flex-direction:column; gap:1rem;">
            ${(unit.keyConcepts || []).map(c => `
              <article class="concept-note-entry">
                <h4>
                  <span>${c.heading}</span>
                  <button class="btn-quiet-icon" data-ai-concept="${c.heading}" title="Deep-dive with AI">
                    <i data-lucide="message-square" style="width:14px; height:14px;"></i>
                  </button>
                </h4>
                <div class="concept-prose">${marked.parse(c.content)}</div>
                ${c.formula ? `
                  <div class="concept-formula-box">
                    <span>Recurrence / Formula:</span>
                    <code>${c.formula}</code>
                    <button class="btn-quiet-icon" style="width:24px; height:24px;" data-copy-math="${escapeHtml(c.formula)}" title="Copy Formula">
                      <i data-lucide="copy" style="width:12px; height:12px;"></i>
                    </button>
                  </div>
                ` : ''}
              </article>
            `).join('')}
          </div>
        </section>
      `).join('')}
    </div>
  `;
}

// 3. Lab Practice Pane (Clean Two-Pane Design)
function renderLabPane(course) {
  return `
    <div style="display:flex; flex-direction:column; gap:1.5rem;">
      <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:1.25rem 1.4rem;">
        <h3 style="font-size:var(--text-md); font-weight:600; color:var(--text-main); margin-bottom:0.35rem;">
          Lab Practice - I (Course Code: 2604PCC526)
        </h3>
        <p style="font-size:var(--text-sm); color:var(--text-muted); line-height:1.55;">
          Executable reference implementations in Python and SQL with live interactive simulators for Algorithms, Database Systems, Machine Learning, and Distributed Systems.
        </p>
      </div>

      <!-- Parts Navigation Filter -->
      <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
        <button class="btn-secondary-action active" data-lab-part="ALL">All Assignments</button>
        <button class="btn-secondary-action" data-lab-part="Part A">Part A: Algorithms</button>
        <button class="btn-secondary-action" data-lab-part="Part B">Part B: Database Systems</button>
        <button class="btn-secondary-action" data-lab-part="Part C">Part C: Machine Learning</button>
        <button class="btn-secondary-action" data-lab-part="Part D">Part D: Distributed Systems</button>
      </div>

      <div class="lab-assignment-container">
        ${LAB_ASSIGNMENTS.map(assign => renderEditorialLabCard(assign)).join('')}
      </div>
    </div>
  `;
}

function renderEditorialLabCard(assign) {
  return `
    <article class="lab-card-editorial" data-part="${assign.part}">
      <header class="lab-card-editorial-header">
        <div>
          <h3>${assign.title}</h3>
          <p style="font-size:var(--text-xs); color:var(--text-muted); margin-top:0.25rem;">${assign.problemStatement}</p>
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem; flex-shrink:0;">
          <span class="tag-quiet">${assign.part}</span>
          <span class="tag-quiet" style="font-family:var(--font-mono);">${assign.timeComplexity}</span>
        </div>
      </header>

      <div class="lab-two-pane-grid">
        <!-- Left: Code Pane -->
        <div class="code-pane-editorial">
          <div class="code-pane-bar">
            <span>Solution Implementation</span>
            <button class="btn-secondary-action" style="padding:0.2rem 0.5rem; font-size:var(--text-xs);" data-lab-copy="${assign.id}">
              <i data-lucide="copy" style="width:12px; height:12px;"></i>
              <span>Copy Code</span>
            </button>
          </div>
          <pre class="code-pre-editorial" id="code_${assign.id}"><code>${escapeHtml(assign.pythonCode)}</code></pre>
        </div>

        <!-- Right: Simulator Pane -->
        <div class="simulator-pane-editorial">
          <div style="font-size:var(--text-xs); font-weight:600; text-transform:uppercase; color:var(--text-dim); letter-spacing:0.04em;">
            Live Execution Simulator
          </div>
          ${renderEditorialSimulator(assign)}
        </div>
      </div>
    </article>
  `;
}

function renderEditorialSimulator(assign) {
  if (assign.interactiveType === 'knapsack') {
    return `
      <div class="form-field-quiet">
        <label>Item Values (comma-separated):</label>
        <input class="input-quiet" id="knapValues" value="60, 100, 120" />
      </div>
      <div class="form-field-quiet">
        <label>Item Weights (comma-separated):</label>
        <input class="input-quiet" id="knapWeights" value="10, 20, 30" />
      </div>
      <div class="form-field-quiet">
        <label>Capacity (W):</label>
        <input class="input-quiet" id="knapCapacity" type="number" value="50" />
      </div>
      <button class="btn-primary-action" id="runKnapsackSim" style="justify-content:center;">
        <i data-lucide="play" style="width:13px; height:13px;"></i>
        <span>Compute Optimal Subset</span>
      </button>
      <div class="output-box-quiet" id="knapOutput">Click 'Compute' to calculate DP matrix and max profit.</div>
    `;
  }

  if (assign.interactiveType === 'platforms') {
    return `
      <div class="form-field-quiet">
        <label>Train Arrivals (24hr):</label>
        <input class="input-quiet" id="platArrivals" value="09:00, 09:40, 09:50, 11:00, 15:00, 18:00" />
      </div>
      <div class="form-field-quiet">
        <label>Train Departures:</label>
        <input class="input-quiet" id="platDepartures" value="09:10, 12:00, 11:20, 11:30, 19:00, 20:00" />
      </div>
      <button class="btn-primary-action" id="runPlatformsSim" style="justify-content:center;">
        <i data-lucide="play" style="width:13px; height:13px;"></i>
        <span>Calculate Minimum Platforms</span>
      </button>
      <div class="output-box-quiet" id="platOutput">Click 'Calculate' to simulate platform timeline.</div>
    `;
  }

  if (assign.interactiveType === 'two_generals') {
    return `
      <div class="form-field-quiet">
        <label>Transient Packet Loss Probability (0.0 to 0.9):</label>
        <input class="input-quiet" id="lossProb" type="number" step="0.1" min="0" max="0.9" value="0.4" />
      </div>
      <button class="btn-primary-action" id="runTwoGeneralsSim" style="justify-content:center;">
        <i data-lucide="play" style="width:13px; height:13px;"></i>
        <span>Simulate Coordination Protocol</span>
      </button>
      <div class="output-box-quiet" id="twoGeneralsOutput">Click 'Simulate' to test message acknowledgment.</div>
    `;
  }

  if (assign.interactiveType === 'bully_election') {
    return `
      <div class="form-field-quiet">
        <label>Failed Coordinator Node:</label>
        <select class="input-quiet" id="bullyFailedNode">
          <option value="5" selected>Node P5 (Highest UID)</option>
          <option value="4">Node P4</option>
        </select>
      </div>
      <div class="form-field-quiet">
        <label>Initiator Node:</label>
        <select class="input-quiet" id="bullyInitiator">
          <option value="2" selected>Node P2 detects crash</option>
          <option value="1">Node P1 detects crash</option>
        </select>
      </div>
      <button class="btn-primary-action" id="runBullyElectionSim" style="justify-content:center;">
        <i data-lucide="play" style="width:13px; height:13px;"></i>
        <span>Run Bully Election Algorithm</span>
      </button>
      <div class="output-box-quiet" id="bullyOutput">Click 'Run' to trigger election broadcast.</div>
    `;
  }

  return `
    <p style="font-size:var(--text-xs); color:var(--text-muted); line-height:1.5;">
      Test case inputs and oral examination preparation points available with AI Tutor.
    </p>
    <button class="btn-secondary-action" data-unit-ai-explain="${assign.title}">
      <i data-lucide="message-square" style="width:13px; height:13px;"></i>
      <span>Explain Code with AI</span>
    </button>
    <div class="output-box-quiet">Implementation ready for oral / term-work presentation.</div>
  `;
}

// 4. Questions Pane
function renderQuestionsPane(course, notesData) {
  const unitsWithQuestions = notesData?.units?.filter(u => u.examQuestions?.length) || [];

  return `
    <div style="display:flex; flex-direction:column; gap:1.25rem;">
      <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
        <button class="btn-secondary-action ${state.questionMarksFilter === 'ALL' ? 'active' : ''}" data-filter-q="ALL">All Questions</button>
        <button class="btn-secondary-action ${state.questionMarksFilter === 2 ? 'active' : ''}" data-filter-q="2">2 Marks (Short)</button>
        <button class="btn-secondary-action ${state.questionMarksFilter === 5 ? 'active' : ''}" data-filter-q="5">5 Marks (Medium)</button>
        <button class="btn-secondary-action ${state.questionMarksFilter === 10 ? 'active' : ''}" data-filter-q="10">10 Marks (Long)</button>
      </div>

      ${unitsWithQuestions.map(unit => {
        const filtered = unit.examQuestions.filter(q => 
          state.questionMarksFilter === 'ALL' || q.marks === parseInt(state.questionMarksFilter, 10)
        );
        if (filtered.length === 0) return '';

        return `
          <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:1.25rem;">
            <h4 style="font-size:var(--text-sm); font-weight:600; color:var(--text-main); margin-bottom:0.75rem;">
              ${unit.unitNo}: ${unit.title}
            </h4>
            <div style="display:flex; flex-direction:column; gap:0.65rem;">
              ${filtered.map(eq => `
                <div style="display:flex; align-items:baseline; gap:0.65rem; font-size:var(--text-sm);">
                  <span class="tag-quiet" style="font-weight:600; font-family:var(--font-mono);">${eq.marks}M</span>
                  <span style="flex:1; color:var(--text-main);">${eq.q}</span>
                  <button class="btn-quiet-icon" style="width:26px; height:26px;" data-ai-model-answer="${escapeHtml(eq.q)}" title="Get model answer">
                    <i data-lucide="message-square" style="width:13px; height:13px;"></i>
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// 5. Books Pane
function renderBooksPane(course) {
  const books = course.textBooks || [];
  const refBooks = course.referenceBooks || [];

  return `
    <div style="display:flex; flex-direction:column; gap:1.75rem;">
      <div>
        <h3 style="font-family:var(--font-serif); font-size:var(--text-xl); font-weight:500; color:var(--text-main); margin-bottom:0.85rem;">
          Prescribed Textbooks
        </h3>
        <div style="display:flex; flex-direction:column; gap:0.65rem;">
          ${books.map((b, i) => `
            <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:0.85rem 1.15rem;">
              <div style="font-size:var(--text-xs); color:var(--text-dim); margin-bottom:0.15rem;">Textbook ${i + 1}</div>
              <div style="font-size:var(--text-sm); font-weight:500; color:var(--text-main);">${b}</div>
            </div>
          `).join('')}
        </div>
      </div>

      ${refBooks.length > 0 ? `
        <div>
          <h3 style="font-family:var(--font-serif); font-size:var(--text-xl); font-weight:500; color:var(--text-main); margin-bottom:0.85rem;">
            Reference Literature
          </h3>
          <div style="display:flex; flex-direction:column; gap:0.65rem;">
            ${refBooks.map((b, i) => `
              <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:0.85rem 1.15rem;">
                <div style="font-size:var(--text-xs); color:var(--text-dim); margin-bottom:0.15rem;">Reference ${i + 1}</div>
                <div style="font-size:var(--text-sm); font-weight:500; color:var(--text-main);">${b}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// ============================================================================
// Render Right Panel (TOC & Scratchpad)
// ============================================================================

function renderRightPanel(course) {
  const currentNote = state.studentNotes[course.code] || "";

  return `
    <aside class="sidebar-right" id="sidebarRight">
      <!-- Course Outcomes Box -->
      ${course.courseOutcomes?.length ? `
        <div>
          <div class="toc-heading">Course Outcomes</div>
          <div style="display:flex; flex-direction:column; gap:0.35rem;">
            ${course.courseOutcomes.map(co => `
              <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-xs); padding:0.45rem 0.6rem; font-size:var(--text-xs);">
                <strong style="color:var(--accent);">${co.id}:</strong> ${co.text}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Table of Contents -->
      ${course.units?.length ? `
        <div>
          <div class="toc-heading">On This Page</div>
          <nav>
            <a href="#courseHeaderSection" class="toc-link">Overview & Exam Scheme</a>
            ${course.units.map((u, i) => `
              <a href="#unitCard_${i}" class="toc-link">${u.unitNo}: ${u.title}</a>
            `).join('')}
          </nav>
        </div>
      ` : ''}

      <!-- Student Personal Scratchpad -->
      <div class="scratchpad-editorial">
        <div style="display:flex; align-items:baseline; justify-content:space-between;">
          <span class="toc-heading" style="margin-bottom:0;">Course Scratchpad</span>
          <span style="font-size:0.65rem; color:var(--status-success);" id="scratchpadStatusLabel">Saved</span>
        </div>
        <textarea 
          class="scratchpad-area" 
          id="studentScratchpad" 
          placeholder="Jot down notes, exam dates, or personal derivations for ${course.code}..."
        >${currentNote}</textarea>
        <button class="btn-secondary-action" id="saveScratchpadBtn" style="justify-content:center; font-size:var(--text-xs); padding:0.3rem 0.6rem;">
          <span>Save Note</span>
        </button>
      </div>
    </aside>
  `;
}

// ============================================================================
// Render AI Tutor Side Drawer (Quiet Product Feature)
// ============================================================================

function renderAiDrawer(course) {
  return `
    <div class="drawer-backdrop" id="aiDrawerBackdrop"></div>
    <div class="ai-drawer-panel" id="aiDrawerPanel">
      <div class="drawer-header">
        <div>
          <h3>AI Syllabus Tutor</h3>
          <p style="font-size:var(--text-xs); color:var(--text-dim);">${state.geminiApiKey ? 'Live Gemini 1.5' : 'Neural Syllabus Reference'}</p>
        </div>
        <div style="display:flex; align-items:center; gap:0.25rem;">
          <button class="btn-quiet-icon" id="openApiKeyModal" title="Gemini API Key Settings">
            <i data-lucide="settings" style="width:14px; height:14px;"></i>
          </button>
          <button class="btn-quiet-icon" id="clearChatBtn" title="Clear Chat">
            <i data-lucide="trash-2" style="width:14px; height:14px;"></i>
          </button>
          <button class="btn-quiet-icon" id="closeAiDrawerBtn" title="Close Drawer">
            <i data-lucide="x" style="width:15px; height:15px;"></i>
          </button>
        </div>
      </div>

      <!-- Quick Topic Chips -->
      <div style="padding:0.6rem 1rem; border-bottom:1px solid var(--border-subtle); display:flex; gap:0.4rem; overflow-x:auto;">
        <button class="tag-quiet" data-ai-chip="Explain 0/1 Knapsack recurrence step-by-step">0/1 Knapsack</button>
        <button class="tag-quiet" data-ai-chip="How does Chandy-Lamport snapshot algorithm work?">Chandy-Lamport</button>
        <button class="tag-quiet" data-ai-chip="Compare Vector Clocks vs Lamport Scalar Clocks">Vector Clocks</button>
        <button class="tag-quiet" data-ai-chip="Explain R-Trees for spatial indexing">R-Trees</button>
      </div>

      <!-- Message History -->
      <div class="drawer-chat-stream" id="drawerChatStream">
        ${state.chatHistory.map(msg => `
          <div class="drawer-chat-bubble ${msg.sender}">
            ${marked.parse(msg.text)}
            ${msg.source ? `<div style="font-size:0.65rem; color:var(--text-dim); margin-top:0.35rem;">Ref: ${msg.source}</div>` : ''}
          </div>
        `).join('')}
      </div>

      <!-- Chat Input Row -->
      <form class="drawer-input-row" id="drawerChatForm">
        <input 
          type="text" 
          class="input-quiet" 
          id="drawerChatInput" 
          style="flex:1;" 
          placeholder="Ask about ${course.code}..." 
          autocomplete="off"
        />
        <button type="submit" class="btn-primary-action" style="padding:0.4rem 0.75rem;">
          <span>Send</span>
        </button>
      </form>
    </div>
  `;
}

// ============================================================================
// Modals & Command Palette
// ============================================================================

function renderActiveModal() {
  if (!state.activeModal) return '';

  if (state.activeModal === 'search') return renderSearchCommandPalette();
  if (state.activeModal === 'quiz') return renderQuizModal();
  if (state.activeModal === 'flashcards') return renderFlashcardsModal();
  if (state.activeModal === 'calc') return renderMarksCalcModal();
  if (state.activeModal === 'settings') return renderSettingsModal();
  if (state.activeModal === 'studyMenu') return renderStudyMenuModal();
  return '';
}

function renderSearchCommandPalette() {
  return `
    <div class="modal-overlay-quiet" id="modalBackdrop">
      <div class="modal-dialog-quiet">
        <div style="padding:0.75rem 1rem; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="search" style="width:16px; height:16px; color:var(--text-dim);"></i>
          <input 
            type="text" 
            id="cmdPaletteInput" 
            placeholder="Type a subject, unit, algorithm, or command..." 
            style="flex:1; border:none; background:transparent; font-size:var(--text-base); color:var(--text-main); outline:none;"
            autofocus
          />
          <kbd class="search-kbd">Esc</kbd>
        </div>
        <div style="padding:0.5rem; max-height:360px; overflow-y:auto;" id="cmdResultsList">
          <p style="font-size:var(--text-xs); color:var(--text-dim); padding:1rem; text-align:center;">
            Search any course code (e.g. 2604PCC501), algorithm (Knapsack, Simplex), or tool.
          </p>
        </div>
      </div>
    </div>
  `;
}

function renderStudyMenuModal() {
  return `
    <div class="modal-overlay-quiet" id="modalBackdrop">
      <div class="modal-dialog-quiet" style="max-width:440px;">
        <div class="modal-header-quiet">
          <span>Study & Revision Tools</span>
          <button class="btn-quiet-icon" id="closeModalQuietBtn"><i data-lucide="x" style="width:14px; height:14px;"></i></button>
        </div>
        <div class="modal-body-quiet" style="display:flex; flex-direction:column; gap:0.5rem;">
          <button class="btn-secondary-action" style="justify-content:flex-start; padding:0.75rem;" id="menuOpenQuiz">
            <i data-lucide="check-circle-2" style="width:16px; height:16px;"></i>
            <div style="text-align:left;">
              <div style="font-weight:600; font-size:var(--text-sm);">Practice Exam Quiz</div>
              <div style="font-size:var(--text-xs); color:var(--text-dim);">Self-assessment test with detailed explanations</div>
            </div>
          </button>
          <button class="btn-secondary-action" style="justify-content:flex-start; padding:0.75rem;" id="menuOpenFlash">
            <i data-lucide="layers" style="width:16px; height:16px;"></i>
            <div style="text-align:left;">
              <div style="font-weight:600; font-size:var(--text-sm);">Quick Flashcards</div>
              <div style="font-size:var(--text-xs); color:var(--text-dim);">Flip cards for formulas, theorems, and definitions</div>
            </div>
          </button>
          <button class="btn-secondary-action" style="justify-content:flex-start; padding:0.75rem;" id="menuOpenCalc">
            <i data-lucide="calculator" style="width:16px; height:16px;"></i>
            <div style="text-align:left;">
              <div style="font-weight:600; font-size:var(--text-sm);">Target Mark Calculator</div>
              <div style="font-size:var(--text-xs); color:var(--text-dim);">Estimate required End-Sem (ESE) score from TAE/CAE</div>
            </div>
          </button>
          <button class="btn-secondary-action" style="justify-content:flex-start; padding:0.75rem;" id="menuOpenLab">
            <i data-lucide="terminal" style="width:16px; height:16px;"></i>
            <div style="text-align:left;">
              <div style="font-weight:600; font-size:var(--text-sm);">Lab Practice I Sandbox</div>
              <div style="font-size:var(--text-xs); color:var(--text-dim);">Interactive simulators for Algorithms, ADBMS, ML & DC</div>
            </div>
          </button>
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
    <div class="modal-overlay-quiet" id="modalBackdrop">
      <div class="modal-dialog-quiet">
        <div class="modal-header-quiet">
          <span>Practice Quiz (${currentIdx + 1} of ${questions.length})</span>
          <button class="btn-quiet-icon" id="closeModalQuietBtn"><i data-lucide="x" style="width:14px; height:14px;"></i></button>
        </div>
        <div class="modal-body-quiet">
          <p style="font-size:var(--text-base); font-weight:500; color:var(--text-main); margin-bottom:1rem;">
            ${q.question}
          </p>

          <div style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1.25rem;">
            ${q.options.map((opt, optIdx) => {
              let btnStyle = "border-color:var(--border-subtle); background:var(--bg-card);";
              if (isAnswered) {
                if (optIdx === q.correctAnswer) {
                  btnStyle = "border-color:var(--status-success-border); background:var(--status-success-bg); color:var(--status-success); font-weight:600;";
                } else if (userAnswers[currentIdx] === optIdx) {
                  btnStyle = "border-color:var(--status-danger); background:var(--status-danger-bg); color:var(--status-danger);";
                }
              }

              return `
                <button class="btn-secondary-action" style="justify-content:flex-start; text-align:left; ${btnStyle}" data-quiz-pick="${optIdx}" ${isAnswered ? 'disabled' : ''}>
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
            <button class="btn-secondary-action" id="prevQuizBtn" ${currentIdx === 0 ? 'disabled' : ''}>Previous</button>
            ${currentIdx < questions.length - 1 ? `
              <button class="btn-primary-action" id="nextQuizBtn" ${!isAnswered ? 'disabled' : ''}>Next</button>
            ` : `
              <button class="btn-primary-action" id="finishQuizBtn" ${!isAnswered ? 'disabled' : ''}>Finish & Review</button>
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
    <div class="modal-overlay-quiet" id="modalBackdrop">
      <div class="modal-dialog-quiet">
        <div class="modal-header-quiet">
          <span>Revision Flashcard (${currentIdx + 1} of ${deck.length})</span>
          <button class="btn-quiet-icon" id="closeModalQuietBtn"><i data-lucide="x" style="width:14px; height:14px;"></i></button>
        </div>
        <div class="modal-body-quiet">
          <div 
            style="background:var(--bg-subtle); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:2rem 1.5rem; text-align:center; min-height:180px; display:flex; flex-direction:column; justify-content:center; cursor:pointer;"
            id="flipCardSurface"
          >
            <div style="font-size:var(--text-xs); text-transform:uppercase; color:var(--text-dim); margin-bottom:0.75rem;">
              ${isFlipped ? 'Answer & Derivation' : 'Question / Concept'}
            </div>
            <div style="font-family:${isFlipped ? 'var(--font-mono)' : 'var(--font-serif)'}; font-size:${isFlipped ? 'var(--text-sm)' : 'var(--text-lg)'}; color:var(--text-main); line-height:1.5; white-space:pre-wrap;">
              ${isFlipped ? card.back : card.front}
            </div>
            <div style="font-size:var(--text-xs); color:var(--text-dim); margin-top:1rem;">
              Click card to ${isFlipped ? 'see question' : 'reveal answer'}
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1.25rem;">
            <button class="btn-secondary-action" id="prevCardBtn" ${currentIdx === 0 ? 'disabled' : ''}>Previous</button>
            <span style="font-size:var(--text-xs); color:var(--text-dim);">${currentIdx + 1} / ${deck.length}</span>
            <button class="btn-secondary-action" id="nextCardBtn" ${currentIdx === deck.length - 1 ? 'disabled' : ''}>Next</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderMarksCalcModal() {
  return `
    <div class="modal-overlay-quiet" id="modalBackdrop">
      <div class="modal-dialog-quiet" style="max-width:480px;">
        <div class="modal-header-quiet">
          <span>Target Mark Calculator</span>
          <button class="btn-quiet-icon" id="closeModalQuietBtn"><i data-lucide="x" style="width:14px; height:14px;"></i></button>
        </div>
        <div class="modal-body-quiet">
          <p style="font-size:var(--text-xs); color:var(--text-muted); margin-bottom:1rem;">
            Calculates required Autonomous End-Semester score based on current internal marks (TAE: 20 + CAE: 20 + ESE: 60 = 100).
          </p>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <div class="form-field-quiet">
              <label>Teacher Assessment (TAE / 20):</label>
              <input class="input-quiet" type="number" min="0" max="20" id="taeInputVal" value="18" />
            </div>
            <div class="form-field-quiet">
              <label>Mid-Sem Exam (CAE / 20):</label>
              <input class="input-quiet" type="number" min="0" max="20" id="caeInputVal" value="16" />
            </div>
            <div class="form-field-quiet">
              <label>Target Grade:</label>
              <select class="input-quiet" id="gradeTargetSelect">
                <option value="90">O Grade (>= 90 Marks / 10 CGPA)</option>
                <option value="80" selected>A+ Grade (>= 80 Marks / 9 CGPA)</option>
                <option value="70">A Grade (>= 70 Marks / 8 CGPA)</option>
                <option value="60">B+ Grade (>= 60 Marks / 7 CGPA)</option>
              </select>
            </div>
            <button class="btn-primary-action" id="calcScoreBtn" style="justify-content:center; margin-top:0.35rem;">
              Calculate Required ESE Marks
            </button>
            <div class="output-box-quiet" id="calcModalOutput">Enter internal marks and click Calculate.</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSettingsModal() {
  return `
    <div class="modal-overlay-quiet" id="modalBackdrop">
      <div class="modal-dialog-quiet" style="max-width:440px;">
        <div class="modal-header-quiet">
          <span>AI Tutor Settings</span>
          <button class="btn-quiet-icon" id="closeModalQuietBtn"><i data-lucide="x" style="width:14px; height:14px;"></i></button>
        </div>
        <div class="modal-body-quiet">
          <p style="font-size:var(--text-xs); color:var(--text-muted); margin-bottom:1rem;">
            The portal provides offline syllabus answers by default. Enter a Gemini API key if you want free-form live LLM reasoning.
          </p>
          <div class="form-field-quiet">
            <label>Google Gemini API Key (stored in local browser only):</label>
            <input class="input-quiet" type="password" id="apiKeySettingInput" value="${state.geminiApiKey}" placeholder="AIzaSy..." />
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.25rem;">
            <button class="btn-secondary-action" id="clearKeyQuietBtn">Clear</button>
            <button class="btn-primary-action" id="saveKeyQuietBtn">Save Key</button>
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
  document.getElementById('toggleMobileNav')?.addEventListener('click', () => {
    state.mobileSidebarOpen = !state.mobileSidebarOpen;
    renderApp();
  });

  // Semester Selector
  document.getElementById('semSelect')?.addEventListener('change', (e) => {
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

  // Left Nav Subject Selection
  document.querySelectorAll('[data-nav-code]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeCourseCode = btn.getAttribute('data-nav-code');
      state.activeTab = 'units';
      state.mobileSidebarOpen = false;
      saveState();
      renderApp();
    });
  });

  // Tabs Switcher
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeTab = btn.getAttribute('data-tab');
      renderApp();
    });
  });

  // Theme Toggle
  document.getElementById('toggleThemeBtn')?.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    saveState();
    renderApp();
    showToast(`Theme changed to ${state.theme} mode`);
  });

  // Toggle Right Sidebar
  document.getElementById('toggleRightPanelBtn')?.addEventListener('click', () => {
    state.isRightSidebarOpen = !state.isRightSidebarOpen;
    renderApp();
  });

  // Pomodoro Focus Timer
  document.getElementById('timerToggleBtn')?.addEventListener('click', toggleFocusTimer);

  // Command Palette Open & Keyboard Shortcuts
  document.getElementById('openSearchBtn')?.addEventListener('click', () => {
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

  // Study Tools Menu Modal
  document.getElementById('openStudyMenuBtn')?.addEventListener('click', () => {
    state.activeModal = 'studyMenu';
    renderApp();
  });

  // AI Drawer Open / Close
  document.getElementById('openAiDrawerBtn')?.addEventListener('click', () => {
    state.isAiDrawerOpen = true;
    renderApp();
    setTimeout(() => document.getElementById('drawerChatInput')?.focus(), 100);
  });

  document.getElementById('closeAiDrawerBtn')?.addEventListener('click', () => {
    state.isAiDrawerOpen = false;
    renderApp();
  });

  document.getElementById('aiDrawerBackdrop')?.addEventListener('click', () => {
    state.isAiDrawerOpen = false;
    renderApp();
  });

  // Action Bar Buttons
  document.getElementById('actionContinueUnit')?.addEventListener('click', () => {
    state.activeTab = 'units';
    renderApp();
    document.getElementById('unitCard_0')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('actionPrimaryLab')?.addEventListener('click', () => {
    state.activeTab = 'lab';
    renderApp();
  });

  document.getElementById('actionAskCourseAi')?.addEventListener('click', () => {
    state.isAiDrawerOpen = true;
    renderApp();
    executeAiQuery(`Summarize the syllabus and key examination focus areas for ${state.activeCourseCode}`);
  });

  document.getElementById('actionPrintNotes')?.addEventListener('click', () => {
    window.print();
  });

  // Unit Accordion Toggle
  document.querySelectorAll('[data-toggle-unit]').forEach(hdr => {
    hdr.addEventListener('click', () => {
      const uIdx = hdr.getAttribute('data-toggle-unit');
      document.getElementById(`unitCard_${uIdx}`)?.classList.toggle('open');
    });
  });

  // Mastery Checkbox
  document.querySelectorAll('.mastery-check').forEach(chk => {
    chk.addEventListener('change', () => {
      const uId = chk.getAttribute('data-unit-id');
      toggleUnitCompleted(uId);
      renderApp();
      showToast(state.completedUnits.includes(uId) ? "Unit marked complete" : "Unit marked incomplete");
    });
  });

  // Topic Check Item
  document.querySelectorAll('.topic-check-item[data-topic-key]').forEach(item => {
    item.addEventListener('click', () => {
      const key = item.getAttribute('data-topic-key');
      toggleTopicChecked(key);
      renderApp();
    });
  });

  // Unit Read Notes & AI Explain
  document.querySelectorAll('[data-unit-open-notes]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeTab = 'notes';
      renderApp();
    });
  });

  document.querySelectorAll('[data-unit-ai-explain]').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-unit-ai-explain');
      state.isAiDrawerOpen = true;
      renderApp();
      executeAiQuery(`Explain unit: "${title}" in detail with key theorems and exam points.`);
    });
  });

  // Concept AI Deep Dive
  document.querySelectorAll('[data-ai-concept]').forEach(btn => {
    btn.addEventListener('click', () => {
      const c = btn.getAttribute('data-ai-concept');
      state.isAiDrawerOpen = true;
      renderApp();
      executeAiQuery(`Explain ${c} with complete mathematical formulation and complexity analysis.`);
    });
  });

  document.querySelectorAll('[data-copy-math]').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.getAttribute('data-copy-math');
      navigator.clipboard.writeText(f);
      showToast("Formula copied to clipboard");
    });
  });

  // Model Answer AI
  document.querySelectorAll('[data-ai-model-answer]').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-ai-model-answer');
      state.isAiDrawerOpen = true;
      renderApp();
      executeAiQuery(`Provide a model autonomous exam answer for: "${q}"`);
    });
  });

  // Empty State buttons
  document.getElementById('emptyStateJumpLab')?.addEventListener('click', () => {
    state.activeTab = 'lab';
    renderApp();
  });

  document.getElementById('emptyStateAskAi')?.addEventListener('click', () => {
    state.isAiDrawerOpen = true;
    renderApp();
    executeAiQuery(`Provide an overview and recommended milestones for ${state.activeCourseCode}`);
  });

  // Scratchpad Note Save
  document.getElementById('saveScratchpadBtn')?.addEventListener('click', () => {
    const text = document.getElementById('studentScratchpad')?.value || "";
    saveStudentNote(state.activeCourseCode, text);
    showToast("Scratchpad note saved");
  });

  // Lab Simulators
  attachLabSimulators();

  // Sidebar Tool Shortcuts
  document.getElementById('sidePracticeQuiz')?.addEventListener('click', () => {
    state.activeModal = 'quiz';
    state.modalData = { quizIndex: 0, userAnswers: {} };
    renderApp();
  });

  document.getElementById('sideFlashcards')?.addEventListener('click', () => {
    state.activeModal = 'flashcards';
    state.modalData = { flashIndex: 0, isFlipped: false };
    renderApp();
  });

  document.getElementById('sideMarkTarget')?.addEventListener('click', () => {
    state.activeModal = 'calc';
    renderApp();
  });

  document.getElementById('sideLabHub')?.addEventListener('click', () => {
    state.activeCourseCode = '2604PCC526';
    state.activeTab = 'lab';
    saveState();
    renderApp();
  });

  // Study Menu Modal Items
  document.getElementById('menuOpenQuiz')?.addEventListener('click', () => {
    state.activeModal = 'quiz';
    state.modalData = { quizIndex: 0, userAnswers: {} };
    renderApp();
  });
  document.getElementById('menuOpenFlash')?.addEventListener('click', () => {
    state.activeModal = 'flashcards';
    state.modalData = { flashIndex: 0, isFlipped: false };
    renderApp();
  });
  document.getElementById('menuOpenCalc')?.addEventListener('click', () => {
    state.activeModal = 'calc';
    renderApp();
  });
  document.getElementById('menuOpenLab')?.addEventListener('click', () => {
    state.activeCourseCode = '2604PCC526';
    state.activeTab = 'lab';
    saveState();
    renderApp();
  });

  // Close Modal
  document.getElementById('closeModalQuietBtn')?.addEventListener('click', () => {
    state.activeModal = null;
    renderApp();
  });
  document.getElementById('modalBackdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'modalBackdrop') {
      state.activeModal = null;
      renderApp();
    }
  });

  // Settings Modal Buttons
  document.getElementById('openApiKeyModal')?.addEventListener('click', () => {
    state.activeModal = 'settings';
    renderApp();
  });
  document.getElementById('saveKeyQuietBtn')?.addEventListener('click', () => {
    const k = document.getElementById('apiKeySettingInput')?.value.trim();
    state.geminiApiKey = k;
    saveState();
    state.activeModal = null;
    renderApp();
    showToast("Gemini API key saved");
  });
  document.getElementById('clearKeyQuietBtn')?.addEventListener('click', () => {
    state.geminiApiKey = "";
    saveState();
    state.activeModal = null;
    renderApp();
    showToast("Gemini API key cleared");
  });

  // Drawer Chat Form
  document.getElementById('drawerChatForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('drawerChatInput');
    const q = input?.value.trim();
    if (q) {
      input.value = '';
      executeAiQuery(q);
    }
  });

  document.querySelectorAll('[data-ai-chip]').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-ai-chip');
      executeAiQuery(q);
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

  // Quiz Modal Logic
  attachQuizHandlers();

  // Flashcards Logic
  attachFlashcardHandlers();

  // Marks Calc Logic
  attachMarksCalcHandlers();

  // Command Palette Live Search Logic
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
    showToast("Focus timer started (25 min)");
    state.pomodoro.timerId = setInterval(() => {
      if (state.pomodoro.seconds > 0) {
        state.pomodoro.seconds--;
        const digits = document.getElementById('timerDigits');
        if (digits) digits.textContent = formatTime(state.pomodoro.seconds);
      } else {
        clearInterval(state.pomodoro.timerId);
        state.pomodoro.isRunning = false;
        showToast("Focus session complete! Take a 5-minute break.");
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
  document.querySelectorAll('[data-lab-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-lab-copy');
      const el = document.getElementById(`code_${id}`);
      if (el) {
        navigator.clipboard.writeText(el.textContent);
        showToast("Code copied to clipboard");
      }
    });
  });

  // Lab Part Filter
  document.querySelectorAll('[data-lab-part]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-lab-part]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const p = btn.getAttribute('data-lab-part');

      document.querySelectorAll('.lab-card-editorial').forEach(card => {
        const cardPart = card.getAttribute('data-part');
        card.style.display = (p === 'ALL' || cardPart === p) ? 'block' : 'none';
      });
    });
  });

  // Question Marks Filter
  document.querySelectorAll('[data-filter-q]').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.getAttribute('data-filter-q');
      state.questionMarksFilter = f === 'ALL' ? 'ALL' : parseInt(f, 10);
      renderApp();
    });
  });
}

// ============================================================================
// Quiz & Flashcard Interactive Handlers
// ============================================================================

function attachQuizHandlers() {
  document.querySelectorAll('[data-quiz-pick]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pick = parseInt(btn.getAttribute('data-quiz-pick'), 10);
      state.modalData.userAnswers[state.modalData.quizIndex] = pick;
      renderApp();
    });
  });

  document.getElementById('nextQuizBtn')?.addEventListener('click', () => {
    state.modalData.quizIndex++;
    renderApp();
  });

  document.getElementById('prevQuizBtn')?.addEventListener('click', () => {
    state.modalData.quizIndex--;
    renderApp();
  });

  document.getElementById('finishQuizBtn')?.addEventListener('click', () => {
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
  document.getElementById('flipCardSurface')?.addEventListener('click', () => {
    state.modalData.isFlipped = !state.modalData.isFlipped;
    renderApp();
  });

  document.getElementById('nextCardBtn')?.addEventListener('click', () => {
    state.modalData.flashIndex++;
    state.modalData.isFlipped = false;
    renderApp();
  });

  document.getElementById('prevCardBtn')?.addEventListener('click', () => {
    state.modalData.flashIndex--;
    state.modalData.isFlipped = false;
    renderApp();
  });
}

function attachMarksCalcHandlers() {
  document.getElementById('calcScoreBtn')?.addEventListener('click', () => {
    const tae = parseFloat(document.getElementById('taeInputVal').value) || 0;
    const cae = parseFloat(document.getElementById('caeInputVal').value) || 0;
    const target = parseFloat(document.getElementById('gradeTargetSelect').value) || 80;

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
  const input = document.getElementById('cmdPaletteInput');
  const resultsBox = document.getElementById('cmdResultsList');

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
            code: c.code,
            tab: 'units'
          });
        }
        if (c.units) {
          c.units.forEach(u => {
            if (u.title.toLowerCase().includes(q) || u.topics.some(t => t.toLowerCase().includes(q))) {
              matches.push({
                title: `${c.code} ${u.unitNo}: ${u.title}`,
                sub: `Syllabus topic in ${c.title}`,
                code: c.code,
                tab: 'units'
              });
            }
          });
        }
      });
    });

    if (matches.length === 0) {
      resultsBox.innerHTML = `<p style="font-size:var(--text-xs); color:var(--text-dim); padding:1rem; text-align:center;">No matching courses or topics found.</p>`;
      return;
    }

    resultsBox.innerHTML = matches.slice(0, 8).map(m => `
      <button class="btn-secondary-action" style="width:100%; justify-content:flex-start; text-align:left; padding:0.5rem 0.75rem; margin-bottom:0.25rem;" data-cmd-jump-code="${m.code}" data-cmd-jump-tab="${m.tab}">
        <div>
          <div style="font-size:var(--text-sm); font-weight:500; color:var(--text-main);">${m.title}</div>
          <div style="font-size:var(--text-xs); color:var(--text-dim);">${m.sub}</div>
        </div>
      </button>
    `).join('');

    resultsBox.querySelectorAll('[data-cmd-jump-code]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeCourseCode = btn.getAttribute('data-cmd-jump-code');
        state.activeTab = btn.getAttribute('data-cmd-jump-tab');
        state.activeModal = null;
        renderApp();
      });
    });
  });
}

// ============================================================================
// AI Tutor Query Execution Engine
// ============================================================================

async function executeAiQuery(userText) {
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
  const box = document.getElementById('drawerChatStream');
  if (box) {
    box.scrollTop = box.scrollHeight;
  }
}

// Quiet Toast Notification
function showToast(message) {
  const host = document.getElementById('toastHost');
  if (!host) return;

  const toast = document.createElement('div');
  toast.className = 'toast-pill-quiet';
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
