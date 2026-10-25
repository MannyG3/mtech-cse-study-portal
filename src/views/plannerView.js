// Study Planner & Task Management View
import { escapeHtml } from '../utils.js';

export function renderPlannerView(state) {
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
      <button class="btn-primary-action" id="openNewTaskModalBtn" type="button">
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
                <input type="checkbox" style="margin-top:4px; accent-color:var(--accent); cursor:pointer;" data-toggle-task-id="${task.id}" aria-label="Mark task done" />
                <div>
                  <h4 style="font-size:var(--text-md); font-weight:600; color:var(--text-main); margin-bottom:0.25rem;">
                    ${escapeHtml(task.title)}
                  </h4>
                  ${task.description ? `<p style="font-size:var(--text-xs); color:var(--text-muted); margin-bottom:0.45rem;">${escapeHtml(task.description)}</p>` : ''}
                  <div style="display:flex; align-items:center; gap:0.65rem; font-size:var(--text-xs); color:var(--text-dim);">
                    <span class="priority-tag priority-${task.priority}">${task.priority}</span>
                    <span>•</span>
                    <span>Course: <strong>${escapeHtml(task.courseCode)}</strong></span>
                    <span>•</span>
                    <span>Due: <strong>${escapeHtml(task.dueDate || 'No deadline')}</strong></span>
                  </div>
                </div>
              </div>
              <button class="btn-icon-square" style="color:var(--text-dim);" data-delete-task-id="${task.id}" type="button" aria-label="Delete Task" title="Delete Task">
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
                <input type="checkbox" checked style="margin-top:4px; accent-color:var(--accent); cursor:pointer;" data-toggle-task-id="${task.id}" aria-label="Mark task incomplete" />
                <div>
                  <div style="font-size:var(--text-sm); font-weight:500; text-decoration:line-through; color:var(--text-muted);">
                    ${escapeHtml(task.title)}
                  </div>
                  <div style="font-size:var(--text-xs); color:var(--text-dim); margin-top:0.2rem;">
                    Completed • ${escapeHtml(task.courseCode)}
                  </div>
                </div>
              </div>
              <button class="btn-icon-square" style="color:var(--text-dim);" data-delete-task-id="${task.id}" type="button" aria-label="Delete Task" title="Delete Task">
                <i data-lucide="trash-2" style="width:14px; height:14px;"></i>
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;
}
