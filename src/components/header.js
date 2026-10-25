// Header Component: Top Navigation, Semester Picker, Timer, Theme & Search
import { SEMESTERS } from '../data/curriculum.js';
import { formatTime } from '../utils.js';

export function renderHeader(state) {
  return `
    <header class="site-header">
      <div class="header-left">
        <button class="btn-icon-square mobile-nav-toggle" id="toggleMobileNavBtn" type="button" aria-label="Toggle navigation" title="Toggle Navigation">
          <i data-lucide="menu" style="width:16px; height:16px;"></i>
        </button>

        <div class="header-brand" id="brandHomeNav" role="button" tabindex="0" aria-label="Home">
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
        <button class="timer-pill-btn ${state.pomodoro.isRunning ? 'running' : ''}" id="timerWidgetBtn" type="button" aria-label="Focus timer" title="Focus Timer: Click to Start / Pause">
          <i data-lucide="clock" style="width:13px; height:13px;"></i>
          <span id="timerDigitEl">${formatTime(state.pomodoro.seconds)}</span>
          <span id="timerModeEl" style="font-size:0.65rem; color:var(--text-dim);">${state.pomodoro.mode === 'work' ? 'FOCUS' : 'BREAK'}</span>
        </button>

        <!-- Command Palette Trigger -->
        <button class="search-command-btn" id="openCommandPaletteBtn" type="button" aria-label="Search or jump to (Ctrl+K)">
          <i data-lucide="search" style="width:13px; height:13px;"></i>
          <span>Search or jump to...</span>
          <kbd class="kbd-shortcut">Ctrl K</kbd>
        </button>

        <!-- AI Tutor Trigger -->
        <button class="btn-header-action" id="openAiDrawerTrigger" type="button" aria-label="Open AI Tutor">
          <i data-lucide="sparkles" style="width:14px; height:14px; color:var(--accent);"></i>
          <span>AI Tutor</span>
        </button>

        <!-- Right Panel Toggle -->
        ${state.activeView === 'course' ? `
          <button class="btn-icon-square ${state.isRightSidebarOpen ? 'active' : ''}" id="toggleRightPanelBtn" type="button" aria-label="Toggle scratchpad and outcomes" title="Toggle Scratchpad & Outcomes">
            <i data-lucide="sidebar" style="width:15px; height:15px;"></i>
          </button>
        ` : ''}

        <!-- Theme Switcher -->
        <button class="btn-icon-square" id="themeSwitchBtn" type="button" aria-label="Toggle color theme" title="Toggle Dark/Light Mode">
          <i data-lucide="${state.theme === 'dark' ? 'sun' : 'moon'}" style="width:15px; height:15px;"></i>
        </button>
      </div>
    </header>
  `;
}

export function updateTimerDisplay(seconds, mode, isRunning) {
  const digitEl = document.getElementById('timerDigitEl');
  const modeEl = document.getElementById('timerModeEl');
  const btn = document.getElementById('timerWidgetBtn');
  if (digitEl) digitEl.textContent = formatTime(seconds);
  if (modeEl) modeEl.textContent = mode === 'work' ? 'FOCUS' : 'BREAK';
  if (btn) {
    if (isRunning) btn.classList.add('running');
    else btn.classList.remove('running');
  }
}
