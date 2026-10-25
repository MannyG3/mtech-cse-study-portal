// Left Navigation Sidebar Component
import { formatCredits } from '../utils.js';

export function renderSidebar(state, activeSem) {
  const coreCourses = activeSem.courses.filter(c => c.type === 'PCC');
  const electiveCourses = activeSem.courses.filter(c => c.type !== 'PCC');

  return `
    <aside class="sidebar-left ${state.mobileSidebarOpen ? 'mobile-open' : ''}" id="leftSidebar">
      <!-- Main Navigation Links -->
      <nav class="sidebar-main-nav">
        <button class="nav-link-btn ${state.activeView === 'dashboard' ? 'active' : ''}" data-nav-view="dashboard" type="button">
          <i data-lucide="layout-dashboard" style="width:15px; height:15px;"></i>
          <span>Academic Dashboard</span>
        </button>
        <button class="nav-link-btn ${state.activeView === 'resources' ? 'active' : ''}" data-nav-view="resources" type="button">
          <i data-lucide="book-marked" style="width:15px; height:15px;"></i>
          <span>Resource Library</span>
        </button>
        <button class="nav-link-btn ${state.activeView === 'planner' ? 'active' : ''}" data-nav-view="planner" type="button">
          <i data-lucide="calendar" style="width:15px; height:15px;"></i>
          <span>Study Planner (${state.studyTasks.filter(t => !t.completed).length})</span>
        </button>
        <button class="nav-link-btn ${state.activeView === 'research' ? 'active' : ''}" data-nav-view="research" type="button">
          <i data-lucide="file-text" style="width:15px; height:15px;"></i>
          <span>Research Workspace</span>
        </button>
        <button class="nav-link-btn ${state.activeView === 'bookmarks' ? 'active' : ''}" data-nav-view="bookmarks" type="button">
          <i data-lucide="bookmark" style="width:15px; height:15px;"></i>
          <span>Saved Bookmarks (${state.bookmarks.length})</span>
        </button>
      </nav>

      <hr style="border:none; border-top:1px solid var(--border-subtle); margin:0.35rem 0;" />

      <!-- Subject Curriculum List -->
      <div>
        <div class="nav-section-title">Core Subjects (PCC)</div>
        <div style="display:flex; flex-direction:column; gap:0.2rem;">
          ${coreCourses.map(c => renderSidebarCourseRow(c, state)).join('')}
        </div>
      </div>

      ${electiveCourses.length > 0 ? `
        <div>
          <div class="nav-section-title">Electives & Practical</div>
          <div style="display:flex; flex-direction:column; gap:0.2rem;">
            ${electiveCourses.map(c => renderSidebarCourseRow(c, state)).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Sidebar Footer Tools -->
      <div style="margin-top:auto; padding-top:0.75rem; border-top:1px solid var(--border-subtle); display:flex; flex-direction:column; gap:0.25rem;">
        <button class="nav-link-btn" id="openQuizShortcut" type="button">
          <i data-lucide="check-circle-2" style="width:14px; height:14px;"></i>
          <span>Practice Exam Quiz</span>
        </button>
        <button class="nav-link-btn" id="openFlashShortcut" type="button">
          <i data-lucide="layers" style="width:14px; height:14px;"></i>
          <span>Revision Flashcards</span>
        </button>
        <button class="nav-link-btn" id="openCalcShortcut" type="button">
          <i data-lucide="calculator" style="width:14px; height:14px;"></i>
          <span>Target Mark Calculator</span>
        </button>
      </div>
    </aside>
  `;
}

export function renderSidebarCourseRow(course, state) {
  const isSelected = state.activeView === 'course' && course.code === state.activeCourseCode;
  return `
    <button class="course-item-row ${isSelected ? 'active' : ''}" data-select-course="${course.code}" type="button">
      <span class="course-item-title">${course.title}</span>
      <span class="course-item-meta">${course.code} • ${formatCredits(course.credits)}</span>
    </button>
  `;
}
