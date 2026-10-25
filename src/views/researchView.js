// Research Literature Workspace View
import { RESEARCH_PAPERS } from '../data/researchPapers.js';
import { isItemBookmarked } from '../state.js';
import { escapeHtml } from '../utils.js';

export function renderResearchView(state) {
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
              <span class="badge-tag">${escapeHtml(paper.subjectName)}</span>
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <!-- Reading Status Select -->
                <select class="status-select" data-paper-status-id="${paper.id}" aria-label="Reading status">
                  <option value="to-read" ${currentStatus === 'to-read' ? 'selected' : ''}>To Read</option>
                  <option value="reading" ${currentStatus === 'reading' ? 'selected' : ''}>Reading</option>
                  <option value="read" ${currentStatus === 'read' ? 'selected' : ''}>Read</option>
                </select>
                <button class="btn-icon-square ${bookmarked ? 'active' : ''}" style="width:28px; height:28px;" data-bookmark-paper-id="${paper.id}" type="button" aria-label="Bookmark Paper" title="Bookmark Paper">
                  <i data-lucide="bookmark" style="width:14px; height:14px;"></i>
                </button>
              </div>
            </div>

            <h3 class="paper-title">${escapeHtml(paper.title)}</h3>
            <div class="paper-authors">${escapeHtml(paper.authors)} (${paper.year})</div>
            <div class="paper-venue-meta">Venue: ${escapeHtml(paper.venue)} • DOI: ${escapeHtml(paper.doi)}</div>

            <div class="paper-abstract-box">
              <strong>Abstract:</strong> ${escapeHtml(paper.abstract)}
            </div>

            <!-- Tags -->
            <div style="display:flex; gap:0.4rem; margin-bottom:1rem; flex-wrap:wrap;">
              ${paper.tags.map(tag => `<span class="tag-quiet">${escapeHtml(tag)}</span>`).join('')}
            </div>

            <!-- Action Bar -->
            <div class="paper-actions-bar">
              <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                <a href="${paper.url}" target="_blank" rel="noopener noreferrer" class="btn-header-action" style="text-decoration:none;">
                  <i data-lucide="external-link" style="width:13px; height:13px;"></i>
                  <span>Open Original Paper PDF</span>
                </a>
                <button class="btn-header-action" data-copy-bibtex="${paper.id}" type="button" title="Copy BibTeX Citation">
                  <i data-lucide="copy" style="width:13px; height:13px;"></i>
                  <span>Copy BibTeX</span>
                </button>
                <button class="btn-header-action" data-paper-notes-toggle="${paper.id}" type="button">
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
              >${escapeHtml(personalNote)}</textarea>
              <button class="btn-header-action" style="margin-top:0.45rem; padding:0.25rem 0.65rem;" data-save-paper-note="${paper.id}" type="button">
                Save Note
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
