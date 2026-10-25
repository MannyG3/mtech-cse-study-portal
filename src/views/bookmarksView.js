// Saved Academic Bookmarks View
import { escapeHtml } from '../utils.js';

export function renderBookmarksView(state) {
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
        <button class="btn-primary-action" id="exploreResourcesBtn" type="button">Explore Resource Library</button>
      </div>
    ` : `
      <div style="display:flex; flex-direction:column; gap:0.75rem;">
        ${state.bookmarks.map(bm => `
          <div class="planner-task-card" style="align-items:center;">
            <div style="display:flex; align-items:center; gap:0.75rem;">
              <i data-lucide="bookmark" style="width:16px; height:16px; color:var(--accent);"></i>
              <div>
                <h4 style="font-size:var(--text-md); font-weight:600; color:var(--text-main); margin-bottom:0.15rem;">
                  ${escapeHtml(bm.title)}
                </h4>
                <div style="font-size:var(--text-xs); color:var(--text-dim);">
                  ${bm.type ? `Type: ${escapeHtml(bm.type)} • ` : ''}${escapeHtml(bm.subtitle || '')}
                </div>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              ${bm.linkCode ? `
                <button class="btn-header-action" style="font-size:var(--text-xs);" data-jump-bookmark-code="${escapeHtml(bm.linkCode)}" data-jump-bookmark-tab="${escapeHtml(bm.linkTab || 'units')}" type="button">
                  Jump to Section →
                </button>
              ` : ''}
              <button class="btn-icon-square" data-remove-bookmark-id="${escapeHtml(bm.id)}" type="button" aria-label="Remove Bookmark" title="Remove Bookmark">
                <i data-lucide="trash-2" style="width:14px; height:14px;"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `}
  `;
}
