// M.Tech Computer Engineering Study Hub & AI Copilot
// Pattern: NEP-2020 Autonomous Curriculum (2026 Pattern)
// Ultra Modern UI & UX (Linear / Raycast / Stripe Inspired)

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

// Subject Icon & Accent mapping
const SUBJECT_ACCENTS = {
  "2604PCC501": { icon: "binary", emoji: "⚡", color: "#6366f1" },
  "2604PCC502": { icon: "database", emoji: "🗄️", color: "#06b6d4" },
  "2604PCC503": { icon: "brain", emoji: "🧠", color: "#10b981" },
  "2604PCC504": { icon: "network", emoji: "🌐", color: "#f59e0b" },
  "2604OE505A": { icon: "layers", emoji: "🌊", color: "#3b82f6" },
  "2604OE505B": { icon: "bar-chart-3", emoji: "📊", color: "#8b5cf6" },
  "2604OE505C": { icon: "cpu", emoji: "📡", color: "#ec4899" },
  "2604OE505D": { icon: "atom", emoji: "⚛️", color: "#14b8a6" },
  "2604PCC526": { icon: "flask-conical", emoji: "🧪", color: "#10b981" },
  "2604VSEC506": { icon: "scroll", emoji: "📜", color: "#f97316" }
};

// ============================================================================
// Core Render Pipeline
// ============================================================================

function renderApp() {
  document.documentElement.setAttribute('data-theme', state.theme);

  const activeSem = SEMESTERS.find(s => s.id === state.activeSemesterId) || SEMESTERS[0];
  const activeCourse = activeSem.courses.find(c => c.code === state.activeCourseCode) || activeSem.courses[0];
  const notesData = SUBJECT_NOTES[activeCourse.code] || null;

  // Compute Syllabus Progress Percentage
  const totalUnits = SEMESTERS[0].courses.reduce((acc, c) => acc + (c.units ? c.units.length : 0), 0);
  const completedCount = state.completedUnits.length;
  const progressPercent = Math.min(100, Math.round((completedCount / (totalUnits || 1)) * 100));
  const circleOffset = 138 - (138 * progressPercent) / 100; // circumference ~ 138

  appEl.innerHTML = `
    <!-- Top Modern Navbar -->
    <header class="header-nav">
      <!-- Left Branding -->
      <div class="nav-brand-group">
        <button class="action-icon-btn mobile-menu-btn" id="toggleMobileNav" title="Toggle Navigation">
          <i data-lucide="menu"></i>
        </button>
        <div class="brand-icon-gem">
          <i data-lucide="graduation-cap"></i>
        </div>
        <div class="brand-info-wrap">
          <h1>M.Tech Study OS <span class="nep-tag">2026 PATTERN</span></h1>
          <p>${CURRICULUM_METADATA.institution} • Autonomous NEP-2020</p>
        </div>
      </div>

      <!-- Center Semester Slider -->
      <nav class="semester-slider-bar" aria-label="Semester Switcher">
        ${SEMESTERS.map(sem => `
          <button class="semester-segment-btn ${sem.id === state.activeSemesterId ? 'active' : ''}" data-sem-id="${sem.id}">
            ${sem.name}
          </button>
        `).join('')}
      </nav>

      <!-- Right Header Actions -->
      <div class="header-actions-dock">
        <!-- Pomodoro Focus Timer -->
        <button class="pomodoro-pill-widget ${state.pomodoro.isRunning ? 'running' : ''}" id="pomodoroTrigger" title="Click to Start / Pause Focus Timer">
          <span class="timer-dot"></span>
          <span id="pomodoroTimerDisplay">${formatTime(state.pomodoro.seconds)}</span>
          <span style="font-size:0.68rem; opacity:0.75;">${state.pomodoro.mode === 'work' ? 'FOCUS' : 'BREAK'}</span>
        </button>

        <!-- Command Palette / Search -->
        <button class="cmd-palette-btn" id="openSearchCmdBtn">
          <i data-lucide="search" style="width:14px; height:14px;"></i>
          <span>Search syllabus...</span>
          <kbd class="kbd-badge">Ctrl+K</kbd>
        </button>

        <!-- AI Copilot Trigger -->
        <button class="ai-copilot-trigger-btn" id="summonAiCopilotBtn">
          <i data-lucide="bot" style="width:16px; height:16px;"></i>
          <span>AI Tutor</span>
        </button>

        <!-- Toggle Right Sidebar -->
        <button class="action-icon-btn" id="toggleRightSidebarBtn" title="Toggle Table of Contents & Scratchpad">
          <i data-lucide="${state.isRightSidebarOpen ? 'panel-right-close' : 'panel-right-open'}"></i>
        </button>

        <!-- Theme Toggle -->
        <button class="action-icon-btn" id="toggleThemeBtn" title="Toggle Dark/Light Mode">
          <i data-lucide="${state.theme === 'dark' ? 'sun' : 'moon'}"></i>
        </button>
      </div>
    </header>

    <!-- Main 3-Column Workspace -->
    <div class="workspace-grid ${!state.isRightSidebarOpen ? 'right-closed' : ''}">
      <!-- Left Sidebar: Course Selection & Progress -->
      <aside class="sidebar-left ${state.mobileSidebarOpen ? 'mobile-open' : ''}" id="sidebarLeft">
        <!-- Circular Progress Widget -->
        <div class="syllabus-meter-card">
          <div class="progress-circle-wrap">
            <svg class="progress-circle-svg" viewBox="0 0 50 50">
              <defs>
                <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#6366f1"/>
                  <stop offset="50%" stop-color="#8b5cf6"/>
                  <stop offset="100%" stop-color="#d946ef"/>
                </linearGradient>
              </defs>
              <circle class="progress-circle-bg" cx="25" cy="25" r="22"></circle>
              <circle class="progress-circle-fill" cx="25" cy="25" r="22" 
                stroke-dasharray="138" 
                stroke-dashoffset="${circleOffset}">
              </circle>
            </svg>
            <div class="progress-center-text">${progressPercent}%</div>
          </div>
          <div class="meter-info">
            <h4>Curriculum Mastery</h4>
            <p>${completedCount} of ${totalUnits} units completed</p>
          </div>
        </div>

        <!-- Academic Tools Grid -->
        <div>
          <div class="sidebar-heading">Academic Tools</div>
          <div class="tools-quick-grid">
            <button class="tool-tile-btn" id="openQuizModalBtn">
              <span class="tool-tile-icon">🎯</span>
              <span class="tool-tile-label">Practice Quiz</span>
            </button>
            <button class="tool-tile-btn" id="openFlashModalBtn">
              <span class="tool-tile-icon">⚡</span>
              <span class="tool-tile-label">Flashcards</span>
            </button>
            <button class="tool-tile-btn" id="openCalcModalBtn">
              <span class="tool-tile-icon">📊</span>
              <span class="tool-tile-label">Mark Target</span>
            </button>
            <button class="tool-tile-btn" id="openLabHubBtn">
              <span class="tool-tile-icon">🧪</span>
              <span class="tool-tile-label">Lab Practice I</span>
            </button>
          </div>
        </div>

        <!-- Course Navigation List -->
        <div>
          <div class="sidebar-heading">
            <span>${activeSem.name} Subjects</span>
            <span style="color:var(--brand-primary-light);">${activeSem.courses.length}</span>
          </div>
          <nav class="subject-nav-stack" aria-label="Course list">
            ${activeSem.courses.map(course => {
              const isActive = course.code === state.activeCourseCode;
              const accent = SUBJECT_ACCENTS[course.code] || { emoji: "📘", color: "#6366f1" };
              return `
                <button class="subject-item-card ${isActive ? 'active' : ''}" data-course-code="${course.code}">
                  <div class="subject-avatar-badge" style="color:${accent.color};">
                    ${accent.emoji}
                  </div>
                  <div class="subject-meta-col">
                    <div class="subject-row-title">${course.title}</div>
                    <div class="subject-row-sub">
                      <span class="badge-code">${course.code}</span>
                      <span>${course.credits} Credits</span>
                      <span>•</span>
                      <span>${course.type}</span>
                    </div>
                  </div>
                </button>
              `;
            }).join('')}
          </nav>
        </div>
      </aside>

      <!-- Center Main Workspace Pane -->
      <main class="main-center-pane">
        ${renderCourseHero(activeCourse)}
        ${renderSegmentedTabs(activeCourse)}
        ${renderActiveTabPane(activeCourse, notesData)}
      </main>

      <!-- Right Sidebar: On This Page & Student Scratchpad -->
      ${state.isRightSidebarOpen ? renderRightSidebar(activeCourse, notesData) : ''}
    </div>

    <!-- AI Chatbot Floating Rail -->
    <div class="ai-copilot-rail">
      <button class="ai-fab-btn" id="fabCopilotTrigger" title="Ask M.Tech AI Tutor">
        <span>🤖</span>
        <span class="fab-badge"></span>
      </button>

      ${state.isChatOpen ? renderAiCopilotWindow(activeCourse) : ''}
    </div>

    <!-- Modal Host Layer -->
    <div id="modalHost">
      ${renderModalLayer()}
    </div>

    <!-- Toast Notification Container -->
    <div class="toast-container" id="toastContainer"></div>
  `;

  // Render SVG icons with Lucide
  createIcons({ icons });

  // Attach all DOM event listeners
  attachEventListeners();
}

// ============================================================================
// Render Course Hero Banner
// ============================================================================

function renderCourseHero(course) {
  const accent = SUBJECT_ACCENTS[course.code] || { emoji: "📘", color: "#6366f1" };
  const isLab = course.type === 'PCC_LAB' || course.code === '2604PCC526';

  let pillClass = 'pcc';
  if (course.type === 'PEC') pillClass = 'pec';
  if (isLab) pillClass = 'lab';

  return `
    <section class="course-hero-banner" id="courseHero">
      <div class="hero-meta-row">
        <div class="hero-pill-tags">
          <span class="hero-pill ${pillClass}">${course.typeFullName || course.type}</span>
          <span class="hero-pill" style="background:var(--bg-surface); color:var(--text-muted); border:1px solid var(--border-hairline);">
            Code: ${course.code}
          </span>
          <span class="hero-pill" style="background:var(--bg-surface); color:var(--text-muted); border:1px solid var(--border-hairline);">
            ${course.credits} Credits • ${course.teachingScheme?.lectures || 0} Hrs/Wk
          </span>
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <button class="action-icon-btn" id="ttsReadCourseSummary" title="Listen to Course Overview (TTS)">
            <i data-lucide="volume-2"></i>
          </button>
          <button class="action-icon-btn" id="quickAskHeroAi" title="Ask AI about this course">
            <i data-lucide="sparkles"></i>
          </button>
          <button class="action-icon-btn" id="printNotesBtn" title="Print Syllabus & Notes">
            <i data-lucide="printer"></i>
          </button>
        </div>
      </div>

      <h2 class="hero-title-main">${course.title}</h2>
      <p class="hero-desc-main">${course.description || 'Comprehensive M.Tech computer engineering syllabus.'}</p>

      <!-- Exam & Continuous Assessment Scheme Visualizer -->
      <div class="exam-scheme-bar-wrap">
        <div class="exam-scheme-bar-header">
          <span>EXAMINATION SCHEME & WEIGHTAGE (AUTONOMOUS 2026 PATTERN)</span>
          <span style="color:var(--brand-primary-light);">Total: 100 Marks</span>
        </div>
        <div class="multi-seg-progress-bar">
          <div class="bar-seg-tae" title="Teacher Assessment Exam: 20 Marks"></div>
          <div class="bar-seg-cae" title="Continuous Assessment / Mid-Sem: 20 Marks"></div>
          <div class="bar-seg-ese" title="End-Semester Autonomous Exam: 60 Marks"></div>
        </div>
        <div class="scheme-legend-row">
          <div class="legend-item">
            <span class="legend-dot" style="background:#38bdf8;"></span>
            <span>TAE: <strong>${course.examScheme?.tae ?? 20} Marks</strong> (20%)</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot" style="background:#a855f7;"></span>
            <span>CAE (Mid-Sem): <strong>${course.examScheme?.cae ?? 20} Marks</strong> (20%)</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot" style="background:#6366f1;"></span>
            <span>ESE (End-Sem): <strong>${course.examScheme?.ese ?? 60} Marks</strong> (60%)</span>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ============================================================================
// Render Segmented View Tabs
// ============================================================================

function renderSegmentedTabs(course) {
  const isLabCourse = course.type === 'PCC_LAB' || course.code === '2604PCC526';

  return `
    <div class="segmented-tab-dock" role="tablist">
      <button class="seg-tab-btn ${state.activeTab === 'units' ? 'active' : ''}" data-tab-name="units">
        <i data-lucide="book-open" style="width:16px; height:16px;"></i>
        <span>Syllabus & Units</span>
      </button>

      <button class="seg-tab-btn ${state.activeTab === 'notes' ? 'active' : ''}" data-tab-name="notes">
        <i data-lucide="file-text" style="width:16px; height:16px;"></i>
        <span>Study Notes & Derivations</span>
      </button>

      ${(isLabCourse || course.parts) ? `
        <button class="seg-tab-btn ${state.activeTab === 'lab' ? 'active' : ''}" data-tab-name="lab">
          <i data-lucide="flask-conical" style="width:16px; height:16px;"></i>
          <span>Lab Practice Assignments</span>
        </button>
      ` : ''}

      <button class="seg-tab-btn ${state.activeTab === 'questions' ? 'active' : ''}" data-tab-name="questions">
        <i data-lucide="help-circle" style="width:16px; height:16px;"></i>
        <span>Question Bank (2M/5M/10M)</span>
      </button>

      <button class="seg-tab-btn ${state.activeTab === 'books' ? 'active' : ''}" data-tab-name="books">
        <i data-lucide="library" style="width:16px; height:16px;"></i>
        <span>Textbooks & References</span>
      </button>
    </div>
  `;
}

// ============================================================================
// Render Active Content Pane
// ============================================================================

function renderActiveTabPane(course, notesData) {
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

// 1. Units Pane with Interactive Checklist
function renderUnitsPane(course) {
  if (!course.units || course.units.length === 0) {
    return `
      <div style="background:var(--bg-card); padding:2.5rem; border-radius:var(--radius-lg); text-align:center; border:1px solid var(--border-hairline);">
        <p style="color:var(--text-muted); margin-bottom:1rem;">
          This subject is evaluated based on laboratory projects or dissertation research stages.
        </p>
        <button class="ai-copilot-trigger-btn" style="margin:0 auto;" id="askAiLabPlanBtn">
          Ask AI for Research & Lab Roadmap
        </button>
      </div>
    `;
  }

  return `
    <div class="units-stack">
      ${course.units.map((unit, uIdx) => {
        const unitId = `${course.code}_unit_${uIdx}`;
        const isMastered = state.completedUnits.includes(unitId);

        return `
          <div class="unit-expand-card ${uIdx === 0 ? 'open' : ''}" id="unitCard_${uIdx}">
            <div class="unit-card-header" data-unit-toggle="${uIdx}">
              <div class="unit-title-meta-left">
                <span class="unit-num-badge">${unit.unitNo}</span>
                <span class="unit-header-title">${unit.title}</span>
              </div>
              <div class="unit-header-meta-right">
                <span class="unit-hours-chip">⏱️ ${unit.hours} Hrs</span>
                <label style="display:flex; align-items:center; gap:0.4rem; cursor:pointer; font-size:0.75rem; color:var(--text-muted);" onclick="event.stopPropagation();">
                  <input type="checkbox" class="mastery-check-box" data-unit-id="${unitId}" ${isMastered ? 'checked' : ''}/>
                  <span>${isMastered ? 'Mastered' : 'Mark Done'}</span>
                </label>
                <i data-lucide="chevron-down" style="width:16px; height:16px; transition:transform 0.25s;" class="chevron-icon"></i>
              </div>
            </div>

            <div class="unit-card-body">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.85rem;">
                <span style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--text-dim); letter-spacing:0.05em;">
                  Topic Checklist (Click to mark completed)
                </span>
                <button class="action-icon-btn" style="width:28px; height:28px;" data-unit-tts="${unit.title}" title="Listen to Unit Topics">
                  <i data-lucide="volume-2" style="width:14px; height:14px;"></i>
                </button>
              </div>

              <ul class="topics-interactive-list">
                ${unit.topics.map((t, tIdx) => {
                  const topicKey = `${unitId}_topic_${tIdx}`;
                  const isChecked = state.checkedTopics.includes(topicKey);

                  return `
                    <li class="topic-interactive-row ${isChecked ? 'checked' : ''}" data-topic-key="${topicKey}">
                      <div class="topic-check-box">
                        ${isChecked ? '<i data-lucide="check" style="width:12px; height:12px;"></i>' : ''}
                      </div>
                      <div class="topic-text-content">${t}</div>
                    </li>
                  `;
                }).join('')}
              </ul>

              <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.25rem;">
                <button class="seg-tab-btn" data-jump-to-notes="${unit.unitNo}">
                  <i data-lucide="file-text" style="width:14px; height:14px;"></i>
                  <span>Read Detailed Notes</span>
                </button>
                <button class="ai-copilot-trigger-btn" style="font-size:0.75rem; padding:0.35rem 0.85rem;" data-ai-explain-unit="${unit.title}">
                  <i data-lucide="sparkles" style="width:14px; height:14px;"></i>
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

// 2. Study Notes & Formulas Pane
function renderNotesPane(course, notesData) {
  if (!notesData?.units || notesData.units.length === 0) {
    return `
      <div style="background:var(--bg-card); padding:2rem; border-radius:var(--radius-lg); text-align:center; border:1px solid var(--border-hairline);">
        <p style="color:var(--text-muted); margin-bottom:1rem;">
          Generate comprehensive university notes & formulas for ${course.code} using AI Copilot.
        </p>
        <button class="ai-copilot-trigger-btn" style="margin:0 auto;" id="generateNotesAiBtn">
          Generate Full Subject Study Notes
        </button>
      </div>
    `;
  }

  return `
    <div class="concepts-grid-stack">
      ${notesData.units.map(unit => `
        <div style="margin-bottom:1.5rem;" id="notes_${unit.unitNo.replace(/\s+/g, '')}">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.85rem;">
            <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-main); display:flex; align-items:center; gap:0.5rem;">
              <span class="unit-num-badge">${unit.unitNo}</span>
              <span>${unit.title}</span>
            </h3>
            <button class="action-icon-btn" style="width:30px; height:30px;" data-tts-unit-notes="${unit.title}" title="Listen to this section">
              <i data-lucide="volume-2" style="width:14px; height:14px;"></i>
            </button>
          </div>

          <div style="display:flex; flex-direction:column; gap:1rem;">
            ${(unit.keyConcepts || []).map(c => `
              <article class="concept-article-card">
                <div class="concept-card-top">
                  <h4 class="concept-card-title">${c.heading}</h4>
                  <button class="action-icon-btn" style="width:30px; height:30px;" data-ai-concept-prompt="${c.heading}" title="Deep-dive with AI">
                    <i data-lucide="sparkles" style="width:14px; height:14px;"></i>
                  </button>
                </div>
                <div class="concept-prose-text">${marked.parse(c.content)}</div>
                ${c.formula ? `
                  <div class="concept-formula-ribbon">
                    <span>📐 Formula / Recurrence:</span>
                    <code>${c.formula}</code>
                    <button class="action-icon-btn" style="width:26px; height:26px;" data-copy-formula="${escapeHtml(c.formula)}" title="Copy Formula">
                      <i data-lucide="copy" style="width:12px; height:12px;"></i>
                    </button>
                  </div>
                ` : ''}
              </article>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// 3. Lab Practice Pane
function renderLabPane(course) {
  return `
    <div style="display:flex; flex-direction:column; gap:1.5rem;">
      <div style="background:var(--bg-card); border:1px solid var(--border-hairline); border-radius:var(--radius-lg); padding:1.4rem;">
        <h3 style="font-size:1.15rem; font-weight:800; color:var(--text-main); margin-bottom:0.35rem;">
          🧪 Lab Practice - I (Course Code: 2604PCC526)
        </h3>
        <p style="font-size:0.86rem; color:var(--text-muted); line-height:1.55;">
          Interactive code implementations in Python, SQL, and MongoDB with live execution simulation runners for Algorithms, Databases, Machine Learning, and Distributed Computing.
        </p>
      </div>

      <!-- Part Filter Pills -->
      <div class="segmented-tab-dock" style="margin-bottom:0;">
        <button class="seg-tab-btn active" data-lab-filter="ALL">All Assignments</button>
        <button class="seg-tab-btn" data-lab-filter="Part A">Part A: Algorithms</button>
        <button class="seg-tab-btn" data-lab-filter="Part B">Part B: ADBMS</button>
        <button class="seg-tab-btn" data-lab-filter="Part C">Part C: Machine Learning</button>
        <button class="seg-tab-btn" data-lab-filter="Part D">Part D: Distributed Systems</button>
      </div>

      <!-- Lab Cards -->
      <div class="lab-cards-list">
        ${LAB_ASSIGNMENTS.map(assign => renderModernLabCard(assign)).join('')}
      </div>
    </div>
  `;
}

function renderModernLabCard(assign) {
  return `
    <article class="lab-card" data-lab-part-tag="${assign.part}" style="margin-bottom:1.5rem;">
      <div class="lab-card-header">
        <div class="lab-title-group">
          <h3>${assign.title}</h3>
          <p>${assign.problemStatement}</p>
        </div>
        <div class="lab-badges">
          <span class="hero-pill lab">${assign.part}</span>
          <span class="hero-pill" style="background:var(--bg-app); font-family:var(--font-mono); font-size:0.7rem;">
            ⏱️ ${assign.timeComplexity}
          </span>
        </div>
      </div>

      <div class="lab-body">
        <!-- Code Editor Mockup -->
        <div class="code-editor-mock">
          <div class="code-header">
            <div class="code-dots">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
            </div>
            <span class="code-lang-label">Python / SQL Solution</span>
            <button class="copy-code-btn" data-lab-copy-id="${assign.id}">
              <i data-lucide="copy" style="width:13px; height:13px;"></i> Copy Code
            </button>
          </div>
          <pre class="code-pre" id="code_${assign.id}"><code>${escapeHtml(assign.pythonCode)}</code></pre>
        </div>

        <!-- Live Simulation Sandbox -->
        <div class="interactive-sandbox">
          <div class="sandbox-title">
            <i data-lucide="play-circle" style="width:18px; height:18px;"></i>
            <span>Interactive Simulator</span>
          </div>
          ${renderModernSandboxControls(assign)}
        </div>
      </div>
    </article>
  `;
}

function renderModernSandboxControls(assign) {
  if (assign.interactiveType === 'knapsack') {
    return `
      <div class="sandbox-form-group">
        <label class="sandbox-label">Item Values ($):</label>
        <input class="sandbox-input" id="knapValues" value="60, 100, 120" />
      </div>
      <div class="sandbox-form-group">
        <label class="sandbox-label">Item Weights (kg):</label>
        <input class="sandbox-input" id="knapWeights" value="10, 20, 30" />
      </div>
      <div class="sandbox-form-group">
        <label class="sandbox-label">Knapsack Capacity (W):</label>
        <input class="sandbox-input" id="knapCapacity" type="number" value="50" />
      </div>
      <button class="sandbox-run-btn" id="runKnapsackSim">
        <i data-lucide="play" style="width:14px; height:14px;"></i> Compute Optimal Subset
      </button>
      <div class="sandbox-output-box" id="knapOutput">Click 'Compute' to calculate DP matrix & optimal profit...</div>
    `;
  }

  if (assign.interactiveType === 'platforms') {
    return `
      <div class="sandbox-form-group">
        <label class="sandbox-label">Train Arrivals (24hr):</label>
        <input class="sandbox-input" id="platArrivals" value="09:00, 09:40, 09:50, 11:00, 15:00, 18:00" />
      </div>
      <div class="sandbox-form-group">
        <label class="sandbox-label">Train Departures:</label>
        <input class="sandbox-input" id="platDepartures" value="09:10, 12:00, 11:20, 11:30, 19:00, 20:00" />
      </div>
      <button class="sandbox-run-btn" id="runPlatformsSim">
        <i data-lucide="train" style="width:14px; height:14px;"></i> Calculate Minimum Platforms
      </button>
      <div class="sandbox-output-box" id="platOutput">Click 'Calculate' to simulate station schedule...</div>
    `;
  }

  if (assign.interactiveType === 'two_generals') {
    return `
      <div class="sandbox-form-group">
        <label class="sandbox-label">Packet Loss Probability (0.0 to 0.9):</label>
        <input class="sandbox-input" id="lossProb" type="number" step="0.1" min="0" max="0.9" value="0.4" />
      </div>
      <button class="sandbox-run-btn" id="runTwoGeneralsSim">
        <i data-lucide="shield" style="width:14px; height:14px;"></i> Simulate Coordination Protocol
      </button>
      <div class="sandbox-output-box" id="twoGeneralsOutput">Click 'Simulate' to test atomic coordination...</div>
    `;
  }

  if (assign.interactiveType === 'bully_election') {
    return `
      <div class="sandbox-form-group">
        <label class="sandbox-label">Crashed Coordinator:</label>
        <select class="sandbox-input" id="bullyFailedNode">
          <option value="5" selected>Node P5 (Highest UID)</option>
          <option value="4">Node P4</option>
        </select>
      </div>
      <div class="sandbox-form-group">
        <label class="sandbox-label">Initiating Process:</label>
        <select class="sandbox-input" id="bullyInitiator">
          <option value="2" selected>Node P2 detects crash</option>
          <option value="1">Node P1 detects crash</option>
          <option value="3">Node P3 detects crash</option>
        </select>
      </div>
      <button class="sandbox-run-btn" id="runBullyElectionSim">
        <i data-lucide="crown" style="width:14px; height:14px;"></i> Run Bully Election Algorithm
      </button>
      <div class="sandbox-output-box" id="bullyOutput">Click 'Run' to trigger message broadcast & leader election...</div>
    `;
  }

  return `
    <div style="font-size:0.82rem; color:var(--text-muted); line-height:1.5;">
      Verify step-by-step logic and viva questions with our AI Tutor.
    </div>
    <button class="sandbox-run-btn" data-ai-explain-lab="${assign.title}">
      <i data-lucide="sparkles" style="width:14px; height:14px;"></i> Explain Algorithm with AI
    </button>
    <div class="sandbox-output-box">Ready for oral / term-work demonstration.</div>
  `;
}

// 4. Questions Pane
function renderQuestionsPane(course, notesData) {
  const unitsWithQuestions = notesData?.units?.filter(u => u.examQuestions?.length) || [];

  return `
    <div style="display:flex; flex-direction:column; gap:1.25rem;">
      <!-- Marks Filter -->
      <div class="segmented-tab-dock" style="margin-bottom:0;">
        <button class="seg-tab-btn ${state.questionMarksFilter === 'ALL' ? 'active' : ''}" data-marks-filter="ALL">All Questions</button>
        <button class="seg-tab-btn ${state.questionMarksFilter === 2 ? 'active' : ''}" data-marks-filter="2">2 Marks (Short)</button>
        <button class="seg-tab-btn ${state.questionMarksFilter === 5 ? 'active' : ''}" data-marks-filter="5">5 Marks (Medium)</button>
        <button class="seg-tab-btn ${state.questionMarksFilter === 10 ? 'active' : ''}" data-marks-filter="10">10 Marks (Long)</button>
      </div>

      ${unitsWithQuestions.map(unit => {
        const filteredQ = unit.examQuestions.filter(q => 
          state.questionMarksFilter === 'ALL' || q.marks === parseInt(state.questionMarksFilter, 10)
        );
        if (filteredQ.length === 0) return '';

        return `
          <div class="questions-box">
            <div class="questions-header">
              <i data-lucide="help-circle" style="width:16px; height:16px;"></i>
              <span>${unit.unitNo}: ${unit.title}</span>
            </div>
            <div>
              ${filteredQ.map(eq => `
                <div class="q-item">
                  <span class="q-marks-pill">${eq.marks} Marks</span>
                  <span style="flex:1;">${eq.q}</span>
                  <button class="action-icon-btn" style="width:28px; height:28px;" data-ai-answer-question="${escapeHtml(eq.q)}" title="Get Model Answer from AI">
                    <i data-lucide="sparkles" style="width:13px; height:13px;"></i>
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
    <div style="display:flex; flex-direction:column; gap:1.5rem;">
      <div>
        <h3 style="font-size:1.1rem; font-weight:700; margin-bottom:0.85rem; color:var(--text-main);">
          📖 Prescribed Textbooks (Autonomous Syllabus)
        </h3>
        <div class="books-grid">
          ${books.map((b, i) => `
            <div class="book-card">
              <span class="book-icon">📘</span>
              <div class="book-details">
                <h4>Textbook ${i + 1}</h4>
                <p>${b}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      ${refBooks.length > 0 ? `
        <div>
          <h3 style="font-size:1.1rem; font-weight:700; margin-bottom:0.85rem; color:var(--text-main);">
            📚 Reference Books & E-Books
          </h3>
          <div class="books-grid">
            ${refBooks.map((b, i) => `
              <div class="book-card">
                <span class="book-icon">📗</span>
                <div class="book-details">
                  <h4>Reference ${i + 1}</h4>
                  <p>${b}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// ============================================================================
// Render Right Sidebar (TOC & Student Scratchpad)
// ============================================================================

function renderRightSidebar(course, notesData) {
  const currentNote = state.studentNotes[course.code] || "";

  return `
    <aside class="sidebar-right" id="sidebarRight">
      <!-- Course Outcomes Box -->
      ${course.courseOutcomes?.length ? `
        <div>
          <div class="sidebar-heading">Course Outcomes (COs)</div>
          <div style="display:flex; flex-direction:column; gap:0.4rem;">
            ${course.courseOutcomes.map(co => `
              <div style="background:var(--bg-surface); border:1px solid var(--border-hairline); border-radius:var(--radius-xs); padding:0.45rem 0.65rem; font-size:0.73rem;">
                <strong style="color:var(--brand-primary-light);">${co.id}:</strong> ${co.text}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Quick Jump Table of Contents -->
      ${course.units?.length ? `
        <div>
          <div class="sidebar-heading">On This Page</div>
          <nav class="toc-nav-list">
            <a href="#courseHero" class="toc-link-item active">
              <i data-lucide="arrow-up-right" style="width:12px; height:12px;"></i>
              <span>Overview</span>
            </a>
            ${course.units.map((u, i) => `
              <a href="#unitCard_${i}" class="toc-link-item">
                <i data-lucide="hash" style="width:12px; height:12px;"></i>
                <span>${u.unitNo}: ${u.title.split(' ')[0]}...</span>
              </a>
            `).join('')}
          </nav>
        </div>
      ` : ''}

      <!-- Student Personal Scratchpad Note -->
      <div class="scratchpad-card">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <span style="font-size:0.75rem; font-weight:700; color:var(--text-main);">
            📝 Student Quick Scratchpad
          </span>
          <span style="font-size:0.68rem; color:var(--brand-success);" id="scratchpadSaveStatus">Saved</span>
        </div>
        <textarea 
          class="scratchpad-textarea" 
          id="studentScratchpadText" 
          placeholder="Jot down formulas, exam dates, or personal doubts for ${course.code}..."
        >${currentNote}</textarea>
        <button class="seg-tab-btn" id="saveScratchpadBtn" style="justify-content:center; font-size:0.75rem;">
          <i data-lucide="save" style="width:12px; height:12px;"></i> Save Note
        </button>
      </div>
    </aside>
  `;
}

// ============================================================================
// Render AI Copilot Drawer
// ============================================================================

function renderAiCopilotWindow(course) {
  return `
    <div class="ai-copilot-window" id="aiCopilotWindow">
      <!-- Header -->
      <div class="chat-header">
        <div class="chat-title-group">
          <div class="chat-bot-avatar">🤖</div>
          <div class="chat-title-text">
            <h4>M.Tech AI Copilot</h4>
            <p>${state.geminiApiKey ? 'Live Gemini 1.5' : 'Neural Syllabus Engine'}</p>
          </div>
        </div>
        <div class="chat-controls">
          <button class="chat-ctrl-btn" id="openSettingsModalBtn" title="Gemini API Key Settings">⚙️</button>
          <button class="chat-ctrl-btn" id="clearChatHistoryBtn" title="Clear History">🗑️</button>
          <button class="chat-ctrl-btn" id="closeCopilotBtn" title="Minimize">✕</button>
        </div>
      </div>

      <!-- Quick Suggestion Chips -->
      <div class="chat-chips-scroll">
        <button class="chat-chip" data-ai-chip="Explain 0/1 Knapsack recurrence step-by-step">🎒 0/1 Knapsack</button>
        <button class="chat-chip" data-ai-chip="How does Chandy-Lamport snapshot algorithm work?">📸 Chandy-Lamport</button>
        <button class="chat-chip" data-ai-chip="Compare Vector Clocks vs Lamport Scalar Clocks">⏰ Vector Clocks</button>
        <button class="chat-chip" data-ai-chip="Explain R-Trees for spatial indexing">🗺️ R-Trees</button>
        <button class="chat-chip" data-ai-chip="What is the exam marking scheme for M.Tech?">📊 Exam Scheme</button>
      </div>

      <!-- Chat Messages Container -->
      <div class="chat-messages-container" id="chatMessagesBox">
        ${state.chatHistory.map((msg, idx) => `
          <div class="chat-msg ${msg.sender}">
            <div class="chat-bubble">
              ${marked.parse(msg.text)}
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.2rem;">
              ${msg.source ? `<span class="chat-source-tag">⚡ ${msg.source}</span>` : '<span></span>'}
              ${msg.sender === 'bot' ? `
                <button class="action-icon-btn" style="width:22px; height:22px; border:none; background:transparent;" data-tts-msg-idx="${idx}" title="Listen to answer">
                  <i data-lucide="volume-2" style="width:12px; height:12px;"></i>
                </button>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Chat Input Form -->
      <form class="chat-input-bar" id="copilotForm">
        <input 
          type="text" 
          class="chat-input" 
          id="copilotInput" 
          placeholder="Ask anything about ${course.code}..." 
          autocomplete="off"
        />
        <button type="submit" class="chat-send-btn" title="Send Query">
          <i data-lucide="arrow-up" style="width:16px; height:16px;"></i>
        </button>
      </form>
    </div>
  `;
}

// ============================================================================
// Render Modals
// ============================================================================

function renderModalLayer() {
  if (!state.activeModal) return '';

  if (state.activeModal === 'quiz') return renderQuizModal();
  if (state.activeModal === 'flashcards') return renderFlashcardsModal();
  if (state.activeModal === 'calc') return renderMarksCalcModal();
  if (state.activeModal === 'search') return renderSearchModal();
  if (state.activeModal === 'settings') return renderSettingsModal();
  return '';
}

function renderQuizModal() {
  const questions = QUIZ_QUESTIONS[state.activeCourseCode] || QUIZ_QUESTIONS["2604PCC501"];
  const currentIdx = state.modalData?.quizIndex || 0;
  const q = questions[currentIdx];
  const userAnswers = state.modalData?.userAnswers || {};
  const isAnswered = userAnswers[currentIdx] !== undefined;

  return `
    <div class="modal-overlay" id="modalBackdrop">
      <div class="modal-card">
        <div class="modal-header">
          <h3>🎯 Practice Exam Quiz (${currentIdx + 1}/${questions.length})</h3>
          <button class="modal-close-btn" id="closeCurrentModal">✕</button>
        </div>
        <div class="modal-body">
          <p class="quiz-question-text">${q.question}</p>
          <div class="quiz-options-list">
            ${q.options.map((opt, optIdx) => {
              let optClass = '';
              if (isAnswered) {
                if (optIdx === q.correctAnswer) optClass = 'correct';
                else if (userAnswers[currentIdx] === optIdx) optClass = 'wrong';
              } else if (userAnswers[currentIdx] === optIdx) {
                optClass = 'selected';
              }

              return `
                <button class="quiz-option-btn ${optClass}" data-quiz-choice="${optIdx}" ${isAnswered ? 'disabled' : ''}>
                  <span style="font-weight:700;">${String.fromCharCode(65 + optIdx)}.</span>
                  <span>${opt}</span>
                </button>
              `;
            }).join('')}
          </div>

          ${isAnswered ? `
            <div class="quiz-explanation-box">
              <strong>💡 Explanation:</strong> ${q.explanation}
            </div>
          ` : ''}

          <div style="display:flex; justify-content:space-between; margin-top:1.5rem;">
            <button class="seg-tab-btn" id="prevQuizStep" ${currentIdx === 0 ? 'disabled' : ''}>← Previous</button>
            ${currentIdx < questions.length - 1 ? `
              <button class="seg-tab-btn active" id="nextQuizStep" ${!isAnswered ? 'disabled' : ''}>Next →</button>
            ` : `
              <button class="ai-copilot-trigger-btn" id="finishQuizStep" ${!isAnswered ? 'disabled' : ''}>Finish & Score 🏆</button>
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
    <div class="modal-overlay" id="modalBackdrop">
      <div class="modal-card">
        <div class="modal-header">
          <h3>⚡ Quick Revision Flashcards (${currentIdx + 1}/${deck.length})</h3>
          <button class="modal-close-btn" id="closeCurrentModal">✕</button>
        </div>
        <div class="modal-body">
          <div class="flashcard-3d-scene ${isFlipped ? 'flipped' : ''}" id="flashCardFlipWrap">
            <div class="flashcard-inner">
              <div class="flashcard-face flashcard-front">
                <span style="font-size:0.72rem; text-transform:uppercase; letter-spacing:0.06em; opacity:0.85;">Concept / Question</span>
                <div class="flashcard-title" style="margin-top:0.85rem;">${card.front}</div>
                <div class="flashcard-sub">👆 Click to flip and reveal formula</div>
              </div>
              <div class="flashcard-face flashcard-back">
                <span style="font-size:0.72rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--brand-primary-light);">Answer & Derivation</span>
                <div class="flashcard-text" style="margin-top:0.85rem;">${card.back}</div>
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <button class="seg-tab-btn" id="prevFlashCardBtn" ${currentIdx === 0 ? 'disabled' : ''}>← Previous</button>
            <span style="font-size:0.75rem; color:var(--text-muted);">${currentIdx + 1} of ${deck.length}</span>
            <button class="seg-tab-btn active" id="nextFlashCardBtn" ${currentIdx === deck.length - 1 ? 'disabled' : ''}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderMarksCalcModal() {
  return `
    <div class="modal-overlay" id="modalBackdrop">
      <div class="modal-card">
        <div class="modal-header">
          <h3>📊 Autonomous Exam & Target GPA Calculator</h3>
          <button class="modal-close-btn" id="closeCurrentModal">✕</button>
        </div>
        <div class="modal-body">
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">
            Autonomous Scheme: Teacher Assessment (TAE: 20) + Mid-Sem (CAE: 20) + End-Sem (ESE: 60) = 100 Marks.
          </p>
          <div style="display:flex; flex-direction:column; gap:0.85rem;">
            <div class="sandbox-form-group">
              <label class="sandbox-label">Teacher Assessment Exam (TAE / 20):</label>
              <input class="sandbox-input" type="number" min="0" max="20" id="calcTaeVal" value="18" />
            </div>
            <div class="sandbox-form-group">
              <label class="sandbox-label">Continuous Assessment / Mid-Sem (CAE / 20):</label>
              <input class="sandbox-input" type="number" min="0" max="20" id="calcCaeVal" value="16" />
            </div>
            <div class="sandbox-form-group">
              <label class="sandbox-label">Desired Target Grade:</label>
              <select class="sandbox-input" id="calcTargetGradeSel">
                <option value="90">O Grade (>= 90 Marks / 10 CGPA)</option>
                <option value="80" selected>A+ Grade (>= 80 Marks / 9 CGPA)</option>
                <option value="70">A Grade (>= 70 Marks / 8 CGPA)</option>
                <option value="60">B+ Grade (>= 60 Marks / 7 CGPA)</option>
              </select>
            </div>
            <button class="sandbox-run-btn" id="runCalcMarksBtn">Compute Required End-Sem Marks</button>
            <div class="sandbox-output-box" id="calcModalOutput">Enter internal marks and click Compute.</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSearchModal() {
  return `
    <div class="modal-overlay" id="modalBackdrop">
      <div class="modal-card">
        <div class="modal-header">
          <h3>🔍 Instant Syllabus & Topic Search</h3>
          <button class="modal-close-btn" id="closeCurrentModal">✕</button>
        </div>
        <div class="modal-body">
          <div class="search-modal-input-wrap">
            <span class="search-icon-inside">🔍</span>
            <input 
              type="text" 
              class="search-modal-input" 
              id="liveSearchInput" 
              placeholder="Search algorithms, units, formulas, lab codes..." 
              autofocus
            />
          </div>
          <div class="search-results-list" id="searchLiveResults">
            <p style="font-size:0.82rem; color:var(--text-muted); text-align:center; padding:1.5rem;">
              Type any keyword (e.g. 'Knapsack', 'Chandy-Lamport', 'SVM', 'R-Tree')...
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSettingsModal() {
  return `
    <div class="modal-overlay" id="modalBackdrop">
      <div class="modal-card">
        <div class="modal-header">
          <h3>⚙️ AI Copilot Configuration</h3>
          <button class="modal-close-btn" id="closeCurrentModal">✕</button>
        </div>
        <div class="modal-body">
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">
            The portal includes an instant **Neural Syllabus Engine** preloaded with full M.Tech curriculum knowledge that works completely offline.
          </p>
          <div class="sandbox-form-group">
            <label class="sandbox-label">Custom Google Gemini API Key (Optional):</label>
            <input 
              type="password" 
              class="sandbox-input" 
              id="apiKeyInput" 
              value="${state.geminiApiKey}" 
              placeholder="AIzaSy..." 
            />
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
            <button class="seg-tab-btn" id="clearKeyBtn">Clear Key</button>
            <button class="seg-tab-btn active" id="saveKeyBtn">Save & Apply</button>
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

  // Semester Switching
  document.querySelectorAll('.semester-segment-btn[data-sem-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const semId = btn.getAttribute('data-sem-id');
      state.activeSemesterId = semId;
      const semObj = SEMESTERS.find(s => s.id === semId);
      if (semObj?.courses?.length) {
        state.activeCourseCode = semObj.courses[0].code;
      }
      saveState();
      renderApp();
      showToast(`Switched to ${semObj.name}`);
    });
  });

  // Course Item Switching
  document.querySelectorAll('.subject-item-card[data-course-code]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeCourseCode = btn.getAttribute('data-course-code');
      state.activeTab = 'units';
      state.mobileSidebarOpen = false;
      saveState();
      renderApp();
    });
  });

  // Segmented Tabs Switching
  document.querySelectorAll('.seg-tab-btn[data-tab-name]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeTab = btn.getAttribute('data-tab-name');
      renderApp();
    });
  });

  // Theme Toggle
  document.getElementById('toggleThemeBtn')?.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    saveState();
    renderApp();
    showToast(`Theme switched to ${state.theme} mode`);
  });

  // Right Sidebar Toggle
  document.getElementById('toggleRightSidebarBtn')?.addEventListener('click', () => {
    state.isRightSidebarOpen = !state.isRightSidebarOpen;
    renderApp();
  });

  // Pomodoro Focus Timer Toggle
  document.getElementById('pomodoroTrigger')?.addEventListener('click', togglePomodoro);

  // Unit Accordion Toggle
  document.querySelectorAll('[data-unit-toggle]').forEach(hdr => {
    hdr.addEventListener('click', () => {
      const uIdx = hdr.getAttribute('data-unit-toggle');
      const card = document.getElementById(`unitCard_${uIdx}`);
      if (card) card.classList.toggle('open');
    });
  });

  // Unit Mastery Checkbox
  document.querySelectorAll('.mastery-check-box').forEach(chk => {
    chk.addEventListener('change', () => {
      const uId = chk.getAttribute('data-unit-id');
      toggleUnitCompleted(uId);
      renderApp();
      showToast(state.completedUnits.includes(uId) ? "Unit marked as mastered! 🎉" : "Unit marked as incomplete");
    });
  });

  // Topic Interactive Row Click
  document.querySelectorAll('.topic-interactive-row[data-topic-key]').forEach(row => {
    row.addEventListener('click', () => {
      const topicKey = row.getAttribute('data-topic-key');
      toggleTopicChecked(topicKey);
      renderApp();
    });
  });

  // Jump to Notes Tab
  document.querySelectorAll('[data-jump-to-notes]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeTab = 'notes';
      renderApp();
    });
  });

  // Copy Formula Ribbon
  document.querySelectorAll('[data-copy-formula]').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.getAttribute('data-copy-formula');
      navigator.clipboard.writeText(f);
      showToast("Formula copied to clipboard! 📋");
    });
  });

  // Quick Tools Click
  document.getElementById('openQuizModalBtn')?.addEventListener('click', () => {
    state.activeModal = 'quiz';
    state.modalData = { quizIndex: 0, userAnswers: {} };
    renderApp();
  });

  document.getElementById('openFlashModalBtn')?.addEventListener('click', () => {
    state.activeModal = 'flashcards';
    state.modalData = { flashIndex: 0, isFlipped: false };
    renderApp();
  });

  document.getElementById('openCalcModalBtn')?.addEventListener('click', () => {
    state.activeModal = 'calc';
    renderApp();
  });

  document.getElementById('openLabHubBtn')?.addEventListener('click', () => {
    state.activeCourseCode = '2604PCC526';
    state.activeTab = 'lab';
    saveState();
    renderApp();
  });

  // Search Palette Click & Shortcuts
  document.getElementById('openSearchCmdBtn')?.addEventListener('click', () => {
    state.activeModal = 'search';
    renderApp();
  });

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      state.activeModal = 'search';
      renderApp();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'j') {
      e.preventDefault();
      toggleCopilotChat();
    }
    if (e.key === 'Escape' && state.activeModal) {
      state.activeModal = null;
      renderApp();
    }
  });

  // Close Modals
  document.getElementById('closeCurrentModal')?.addEventListener('click', () => {
    state.activeModal = null;
    renderApp();
  });

  document.getElementById('modalBackdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'modalBackdrop') {
      state.activeModal = null;
      renderApp();
    }
  });

  // AI Copilot FAB & Buttons
  const toggleCopilotChat = () => {
    state.isChatOpen = !state.isChatOpen;
    renderApp();
    if (state.isChatOpen) {
      setTimeout(() => {
        document.getElementById('copilotInput')?.focus();
        scrollChatToBottom();
      }, 100);
    }
  };

  document.getElementById('fabCopilotTrigger')?.addEventListener('click', toggleCopilotChat);
  document.getElementById('summonAiCopilotBtn')?.addEventListener('click', toggleCopilotChat);
  document.getElementById('closeCopilotBtn')?.addEventListener('click', () => {
    state.isChatOpen = false;
    renderApp();
  });

  // Hero AI
  document.getElementById('quickAskHeroAi')?.addEventListener('click', () => {
    state.isChatOpen = true;
    renderApp();
    handleCopilotQuery(`Summarize key exam topics and high-weightage chapters for ${state.activeCourseCode}`);
  });

  // Text-To-Speech (TTS) Reader
  document.getElementById('ttsReadCourseSummary')?.addEventListener('click', () => {
    const activeCourse = SEMESTERS.find(s => s.id === state.activeSemesterId)?.courses?.find(c => c.code === state.activeCourseCode);
    if (activeCourse) {
      speakText(`${activeCourse.title}. ${activeCourse.description}`);
    }
  });

  document.querySelectorAll('[data-unit-tts]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = btn.getAttribute('data-unit-tts');
      speakText(`Unit overview: ${title}`);
    });
  });

  document.querySelectorAll('[data-tts-msg-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-tts-msg-idx'), 10);
      const msg = state.chatHistory[idx];
      if (msg) speakText(msg.text.replace(/[*_#`$]/g, ''));
    });
  });

  // Print notes
  document.getElementById('printNotesBtn')?.addEventListener('click', () => {
    window.print();
  });

  // Suggestion Chips Click
  document.querySelectorAll('[data-ai-chip]').forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-ai-chip');
      handleCopilotQuery(query);
    });
  });

  // Copilot Form Submit
  document.getElementById('copilotForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('copilotInput');
    const q = input?.value.trim();
    if (q) {
      input.value = '';
      handleCopilotQuery(q);
    }
  });

  // Clear Chat History
  document.getElementById('clearChatHistoryBtn')?.addEventListener('click', () => {
    state.chatHistory = [{
      sender: "bot",
      time: "Just now",
      text: "Chat cleared! How can I assist you with your M.Tech syllabus today?",
      source: "Neural Syllabus Engine"
    }];
    saveState();
    renderApp();
  });

  // Settings Modal Buttons
  document.getElementById('openSettingsModalBtn')?.addEventListener('click', () => {
    state.activeModal = 'settings';
    renderApp();
  });

  document.getElementById('saveKeyBtn')?.addEventListener('click', () => {
    const key = document.getElementById('apiKeyInput')?.value.trim();
    state.geminiApiKey = key;
    saveState();
    state.activeModal = null;
    renderApp();
    showToast("Gemini API Key saved! 🔑");
  });

  document.getElementById('clearKeyBtn')?.addEventListener('click', () => {
    state.geminiApiKey = '';
    saveState();
    state.activeModal = null;
    renderApp();
    showToast("API Key cleared.");
  });

  // Deep-Dive AI Prompts
  document.querySelectorAll('[data-ai-concept-prompt]').forEach(btn => {
    btn.addEventListener('click', () => {
      const c = btn.getAttribute('data-ai-concept-prompt');
      state.isChatOpen = true;
      renderApp();
      handleCopilotQuery(`Explain ${c} with complete mathematical derivation and complexity.`);
    });
  });

  document.querySelectorAll('[data-ai-answer-question]').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-ai-answer-question');
      state.isChatOpen = true;
      renderApp();
      handleCopilotQuery(`Provide a model autonomous exam answer for: "${q}"`);
    });
  });

  document.querySelectorAll('[data-ai-explain-unit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const u = btn.getAttribute('data-ai-explain-unit');
      state.isChatOpen = true;
      renderApp();
      handleCopilotQuery(`Give me a structured summary of unit: "${u}"`);
    });
  });

  // Student Scratchpad Save
  document.getElementById('saveScratchpadBtn')?.addEventListener('click', () => {
    const text = document.getElementById('studentScratchpadText')?.value || "";
    saveStudentNote(state.activeCourseCode, text);
    showToast("Student note saved! 💾");
  });

  // Lab Simulators & Sandbox
  attachLabSimulators();

  // Quiz Navigation
  attachQuizHandlers();

  // Flashcards Navigation
  attachFlashcardHandlers();

  // Marks Calculator
  attachMarksCalcHandlers();

  // Live Search Input
  attachSearchHandlers();
}

// ============================================================================
// Pomodoro Focus Timer Logic
// ============================================================================

function togglePomodoro() {
  if (state.pomodoro.isRunning) {
    clearInterval(state.pomodoro.timerId);
    state.pomodoro.isRunning = false;
    showToast("Focus timer paused ⏸️");
  } else {
    state.pomodoro.isRunning = true;
    showToast("Focus session started! ⏱️ 25 minutes of deep learning.");
    state.pomodoro.timerId = setInterval(() => {
      if (state.pomodoro.seconds > 0) {
        state.pomodoro.seconds--;
        const display = document.getElementById('pomodoroTimerDisplay');
        if (display) display.textContent = formatTime(state.pomodoro.seconds);
      } else {
        clearInterval(state.pomodoro.timerId);
        state.pomodoro.isRunning = false;
        confetti({ particleCount: 100, spread: 60 });
        speakText("Focus session completed! Time to take a five minute break.");
        showToast("Focus session completed! 🏆 Take a 5-minute break.");
        state.pomodoro.seconds = state.pomodoro.mode === 'work' ? 5 * 60 : 25 * 60;
        state.pomodoro.mode = state.pomodoro.mode === 'work' ? 'break' : 'work';
      }
    }, 1000);
  }
  renderApp();
}

function formatTime(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// ============================================================================
// Text-To-Speech (Web Speech API)
// ============================================================================

function speakText(text) {
  if (!('speechSynthesis' in window)) {
    showToast("Text-to-speech not supported in this browser.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
  showToast("Playing audio narration... 🔊");
}

// ============================================================================
// Toast Notification
// ============================================================================

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-pill';
  toast.innerHTML = `<span>✨</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// ============================================================================
// Lab Practice Simulators
// ============================================================================

function attachLabSimulators() {
  // Knapsack
  document.getElementById('runKnapsackSim')?.addEventListener('click', () => {
    try {
      const valStr = document.getElementById('knapValues').value;
      const wtStr = document.getElementById('knapWeights').value;
      const W = parseInt(document.getElementById('knapCapacity').value, 10);

      const val = valStr.split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x));
      const wt = wtStr.split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x));

      if (val.length !== wt.length || val.length === 0 || isNaN(W)) {
        document.getElementById('knapOutput').textContent = "⚠️ Error: Values and weights must match!";
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

      // Backtracking
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
        `✅ OPTIMAL MAXIMUM PROFIT: \$${dp[n][W]}\n` +
        `📦 SELECTED ITEMS: ${selected.length ? selected.reverse().join(', ') : 'None'}\n` +
        `🧮 DP Matrix computed in O(n*W) time complexity.`;
      showToast("0/1 Knapsack optimal solution computed!");
    } catch (err) {
      document.getElementById('knapOutput').textContent = "Error: " + err.message;
    }
  });

  // Train Platforms
  document.getElementById('runPlatformsSim')?.addEventListener('click', () => {
    try {
      const arr = document.getElementById('platArrivals').value.split(',').map(x => x.trim()).sort();
      const dep = document.getElementById('platDepartures').value.split(',').map(x => x.trim()).sort();

      let i = 0, j = 0, current = 0, maxPlat = 0;
      const n = arr.length;
      const log = [];

      while (i < n && j < n) {
        if (arr[i] <= dep[j]) {
          current++;
          log.push(`[${arr[i]}] Train Arrived -> Platforms Occupied: ${current}`);
          if (current > maxPlat) maxPlat = current;
          i++;
        } else {
          current--;
          log.push(`[${dep[j]}] Train Departed -> Platforms Occupied: ${current}`);
          j++;
        }
      }

      document.getElementById('platOutput').textContent = 
        `🚂 MINIMUM PLATFORMS NEEDED: ${maxPlat}\n\n` +
        `Timeline Event Log:\n` + log.slice(0, 6).join('\n') + (log.length > 6 ? `\n... (+${log.length - 6} more events)` : '');
      showToast(`Minimum platforms calculated: ${maxPlat}`);
    } catch (err) {
      document.getElementById('platOutput').textContent = "Error: " + err.message;
    }
  });

  // Two Generals
  document.getElementById('runTwoGeneralsSim')?.addEventListener('click', () => {
    const dropProb = parseFloat(document.getElementById('lossProb').value) || 0.4;
    let output = "⚔️ TWO GENERALS PROTOCOL SIMULATION:\n";
    let attempts = 0;
    let delivered = false;

    for (let r = 1; r <= 6; r++) {
      attempts++;
      const dropped = Math.random() < dropProb;
      if (!dropped) {
        output += `Attempt ${r}: Message 'ATTACK AT DAWN' DELIVERED via courier!\n`;
        delivered = true;
        break;
      } else {
        output += `Attempt ${r}: Courier CAPTURED/LOST (Packet dropped) ❌ Retransmitting...\n`;
      }
    }

    if (delivered) {
      output += `\n🎯 Outcome: Agreement reached after ${attempts} round(s).`;
    } else {
      output += `\n⚠️ Outcome: Channel failed! FLP / Two Generals impossibility observed.`;
    }
    document.getElementById('twoGeneralsOutput').textContent = output;
  });

  // Bully Election
  document.getElementById('runBullyElectionSim')?.addEventListener('click', () => {
    const failed = parseInt(document.getElementById('bullyFailedNode').value, 10);
    const initiator = parseInt(document.getElementById('bullyInitiator').value, 10);

    let output = `👑 BULLY ELECTION SIMULATION\n`;
    output += `Initial State: Coordinator Node P${failed} has crashed!\n`;
    output += `[P${initiator}] Heartbeat timeout detected from P${failed}.\n`;
    output += `[P${initiator}] Broadcasts ELECTION message to higher nodes: `;

    const higherNodes = [];
    for (let i = initiator + 1; i <= 5; i++) {
      if (i !== failed) higherNodes.push(`P${i}`);
    }
    output += higherNodes.length ? higherNodes.join(', ') + '\n' : 'No higher alive nodes!\n';

    if (higherNodes.length > 0) {
      const highestAlive = Math.max(...higherNodes.map(p => parseInt(p.replace('P', ''), 10)));
      output += `[P${highestAlive}] Responds 'OK' to P${initiator} and assumes election.\n`;
      output += `[P${highestAlive}] Broadcasts COORDINATOR to all alive nodes.\n`;
      output += `\n🏆 NEW ELECTED LEADER: Node P${highestAlive}!`;
    } else {
      output += `[P${initiator}] Receives no replies within timeout.\n`;
      output += `[P${initiator}] Declares itself COORDINATOR!\n`;
      output += `\n🏆 NEW ELECTED LEADER: Node P${initiator}!`;
    }
    document.getElementById('bullyOutput').textContent = output;
  });

  // Lab Copy Buttons
  document.querySelectorAll('[data-lab-copy-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-lab-copy-id');
      const codeEl = document.getElementById(`code_${id}`);
      if (codeEl) {
        navigator.clipboard.writeText(codeEl.textContent);
        showToast("Lab code copied to clipboard! 📋");
      }
    });
  });

  // Lab Filter Pills
  document.querySelectorAll('[data-lab-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-lab-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-lab-filter');

      document.querySelectorAll('[data-lab-part-tag]').forEach(card => {
        const part = card.getAttribute('data-lab-part-tag');
        card.style.display = (filter === 'ALL' || part === filter) ? 'block' : 'none';
      });
    });
  });

  // Question Marks Filter
  document.querySelectorAll('[data-marks-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-marks-filter');
      state.questionMarksFilter = filter === 'ALL' ? 'ALL' : parseInt(filter, 10);
      renderApp();
    });
  });
}

// ============================================================================
// Quiz & Flashcard Interactive Handlers
// ============================================================================

function attachQuizHandlers() {
  document.querySelectorAll('[data-quiz-choice]').forEach(btn => {
    btn.addEventListener('click', () => {
      const choice = parseInt(btn.getAttribute('data-quiz-choice'), 10);
      const cur = state.modalData.quizIndex;
      state.modalData.userAnswers[cur] = choice;
      renderApp();
    });
  });

  document.getElementById('nextQuizStep')?.addEventListener('click', () => {
    state.modalData.quizIndex++;
    renderApp();
  });

  document.getElementById('prevQuizStep')?.addEventListener('click', () => {
    state.modalData.quizIndex--;
    renderApp();
  });

  document.getElementById('finishQuizStep')?.addEventListener('click', () => {
    const questions = QUIZ_QUESTIONS[state.activeCourseCode] || QUIZ_QUESTIONS["2604PCC501"];
    let score = 0;
    questions.forEach((q, idx) => {
      if (state.modalData.userAnswers[idx] === q.correctAnswer) score++;
    });

    const percent = Math.round((score / questions.length) * 100);
    if (percent >= 70) {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }

    alert(`🏆 Quiz Finished!\nYour Score: ${score} / ${questions.length} (${percent}%)\n\nExcellent revision!`);
    state.activeModal = null;
    renderApp();
  });
}

function attachFlashcardHandlers() {
  document.getElementById('flashCardFlipWrap')?.addEventListener('click', () => {
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
    const tae = parseFloat(document.getElementById('calcTaeVal').value) || 0;
    const cae = parseFloat(document.getElementById('calcCaeVal').value) || 0;
    const target = parseFloat(document.getElementById('calcTargetGradeSel').value) || 80;

    const currentInternal = tae + cae; // out of 40
    const neededEse = target - currentInternal; // out of 60

    let msg = `Current Internal: ${currentInternal} / 40 Marks\n`;
    if (neededEse > 60) {
      msg += `⚠️ Even with 60/60 in ESE, max total is ${currentInternal + 60}. Target requires higher internal marks!`;
    } else if (neededEse <= 0) {
      msg += `🎉 You have already secured ${currentInternal} marks! Passing ESE guarantees target grade!`;
    } else {
      const esePercent = Math.round((neededEse / 60) * 100);
      msg += `🎯 Required Autonomous End-Sem Exam Score: ${neededEse.toFixed(1)} / 60 Marks (${esePercent}%) to achieve target grade!`;
    }
    document.getElementById('calcModalOutput').textContent = msg;
    showToast("Target marks calculated!");
  });
}

function attachSearchHandlers() {
  const input = document.getElementById('liveSearchInput');
  const resultsContainer = document.getElementById('searchLiveResults');

  input?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q || q.length < 2) {
      resultsContainer.innerHTML = `<p style="font-size:0.82rem; color:var(--text-muted); text-align:center; padding:1.5rem;">Type any keyword...</p>`;
      return;
    }

    const matches = [];

    // Search courses and units
    SEMESTERS.forEach(sem => {
      sem.courses.forEach(course => {
        if (course.title.toLowerCase().includes(q) || course.code.toLowerCase().includes(q)) {
          matches.push({
            title: `${course.code}: ${course.title}`,
            sub: `${sem.name} • ${course.typeFullName || course.type}`,
            code: course.code,
            tab: 'units'
          });
        }
        if (course.units) {
          course.units.forEach(u => {
            if (u.title.toLowerCase().includes(q) || u.topics.some(t => t.toLowerCase().includes(q))) {
              matches.push({
                title: `${course.code} ${u.unitNo}: ${u.title}`,
                sub: `Topic match in ${course.title}`,
                code: course.code,
                tab: 'units'
              });
            }
          });
        }
      });
    });

    // Search labs
    LAB_ASSIGNMENTS.forEach(lab => {
      if (lab.title.toLowerCase().includes(q) || lab.problemStatement.toLowerCase().includes(q)) {
        matches.push({
          title: `🧪 Lab: ${lab.title}`,
          sub: `${lab.part} • ${lab.subject}`,
          code: '2604PCC526',
          tab: 'lab'
        });
      }
    });

    if (matches.length === 0) {
      resultsContainer.innerHTML = `<p style="font-size:0.82rem; color:var(--text-muted); text-align:center; padding:1.5rem;">No direct matches found. Try asking the AI Copilot!</p>`;
      return;
    }

    resultsContainer.innerHTML = matches.slice(0, 10).map(m => `
      <div class="search-result-item" data-jump-code="${m.code}" data-jump-tab="${m.tab}">
        <span class="search-item-title">${m.title}</span>
        <span class="search-item-sub">${m.sub}</span>
      </div>
    `).join('');

    resultsContainer.querySelectorAll('[data-jump-code]').forEach(item => {
      item.addEventListener('click', () => {
        state.activeCourseCode = item.getAttribute('data-jump-code');
        state.activeTab = item.getAttribute('data-jump-tab');
        state.activeModal = null;
        renderApp();
      });
    });
  });
}

// ============================================================================
// AI Copilot Query Processing
// ============================================================================

async function handleCopilotQuery(userText) {
  state.chatHistory.push({
    sender: "user",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: userText
  });
  saveState();
  renderApp();
  scrollChatToBottom();

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
          source: "Live Gemini 1.5 Flash"
        });
        saveState();
        renderApp();
        scrollChatToBottom();
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
    source: `${aiAnswer.source} (${aiAnswer.confidence}% match)`
  });
  saveState();
  renderApp();
  scrollChatToBottom();
}

function scrollChatToBottom() {
  const container = document.getElementById('chatMessagesBox');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Initial Launch
renderApp();
