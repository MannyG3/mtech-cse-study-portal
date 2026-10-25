// Academic Dashboard View
import { CURRICULUM_METADATA, SEMESTERS } from '../data/curriculum.js';
import { RESEARCH_PAPERS } from '../data/researchPapers.js';
import { formatCredits, escapeHtml, countCurriculumUnits } from '../utils.js';

export function renderDashboardView(state, activeSem) {
  const pendingTasks = state.studyTasks.filter(t => !t.completed);
  const totalUnits = countCurriculumUnits(SEMESTERS);
  const completedUnitsCount = state.completedUnits.length;
  const progressPercent = totalUnits > 0 ? Math.min(100, Math.round((completedUnitsCount / totalUnits) * 100)) : 0;

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
        <button class="btn-header-action" style="background:var(--accent); color:#fff; border-color:var(--accent);" id="resumeStudyingBtn" data-jump-course="${lastCourse.code}" type="button">
          <i data-lucide="play" style="width:14px; height:14px;"></i>
          <span>Continue: ${lastCourse.title}</span>
        </button>
        <button class="btn-header-action" id="dashOpenPlannerBtn" type="button">
          <i data-lucide="calendar-plus" style="width:14px; height:14px;"></i>
          <span>Add Study Task</span>
        </button>
        <button class="btn-header-action" id="dashOpenResearchBtn" type="button">
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
          <button class="btn-header-action" style="padding:0.2rem 0.5rem; font-size:var(--text-xs);" id="dashAddTaskModalBtn" type="button">
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
                <input type="checkbox" style="margin-top:3px; accent-color:var(--accent); cursor:pointer;" data-dash-toggle-task="${task.id}" aria-label="Mark task done" />
                <div style="flex:1;">
                  <div class="task-title-cell">${escapeHtml(task.title)}</div>
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
                  <div class="task-title-cell">${escapeHtml(item.title)}</div>
                  <div class="task-meta-cell">${escapeHtml(item.subtitle || '')}</div>
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
          <div class="subject-summary-tile" data-select-course="${course.code}" role="button" tabindex="0" aria-label="${course.title}">
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
