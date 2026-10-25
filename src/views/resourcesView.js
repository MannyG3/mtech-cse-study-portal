// Academic Resource Library View
import { ACADEMIC_RESOURCES } from '../data/resources.js';
import { isItemBookmarked } from '../state.js';
import { escapeHtml } from '../utils.js';

export function getFilteredResources(resourceFilter) {
  const { semester, subject, type, search } = resourceFilter;
  return ACADEMIC_RESOURCES.filter(r => {
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
}

export function renderResourcesView(state) {
  const { type, subject, search } = state.resourceFilter;
  const filtered = getFilteredResources(state.resourceFilter);

  return `
    <div style="margin-bottom:1.5rem;">
      <h1 class="welcome-heading">Academic Resource Library</h1>
      <p class="welcome-sub">
        Browse lecture notes, lab manuals, official syllabus PDF specifications, question banks, and reference documents.
      </p>
    </div>

    <!-- Filter & Search Bar -->
    <div class="resource-filter-bar">
      <!-- Search Input (Input events only update #resourceResultsHost, never recreating this element) -->
      <div style="flex:1; min-width:220px; position:relative;">
        <input 
          type="text" 
          class="input-quiet" 
          id="resourceSearchInput" 
          placeholder="Filter resources by title, topic, or keyword..." 
          value="${escapeHtml(search)}" 
          style="width:100%;"
          aria-label="Filter resources"
        />
      </div>

      <!-- Resource Type Filter -->
      <select class="semester-dropdown" id="filterResourceType" aria-label="Filter by type">
        <option value="ALL" ${type === 'ALL' ? 'selected' : ''}>All Types</option>
        <option value="Notes" ${type === 'Notes' ? 'selected' : ''}>Lecture Notes</option>
        <option value="PDF" ${type === 'PDF' ? 'selected' : ''}>Syllabus PDF</option>
        <option value="Lab Manual" ${type === 'Lab Manual' ? 'selected' : ''}>Lab Manual</option>
        <option value="Question Bank" ${type === 'Question Bank' ? 'selected' : ''}>Question Bank</option>
        <option value="Textbook" ${type === 'Textbook' ? 'selected' : ''}>Textbooks</option>
      </select>

      <!-- Subject Filter -->
      <select class="semester-dropdown" id="filterResourceSubject" aria-label="Filter by subject">
        <option value="ALL" ${subject === 'ALL' ? 'selected' : ''}>All Subjects</option>
        <option value="2604PCC501" ${subject === '2604PCC501' ? 'selected' : ''}>Advanced Algorithms</option>
        <option value="2604PCC502" ${subject === '2604PCC502' ? 'selected' : ''}>Advanced Database Systems</option>
        <option value="2604PCC503" ${subject === '2604PCC503' ? 'selected' : ''}>Machine Learning</option>
        <option value="2604PCC504" ${subject === '2604PCC504' ? 'selected' : ''}>Distributed Computing</option>
        <option value="2604PCC551" ${subject === '2604PCC551' ? 'selected' : ''}>Information Retrieval</option>
        <option value="2604PCC552" ${subject === '2604PCC552' ? 'selected' : ''}>Natural Language Processing</option>
        <option value="2604PCC553" ${subject === '2604PCC553' ? 'selected' : ''}>Deep Learning</option>
        <option value="2604RM601" ${subject === '2604RM601' ? 'selected' : ''}>Research Methodology</option>
        <option value="2604OE505A" ${subject === '2604OE505A' ? 'selected' : ''}>Data Engineering</option>
        <option value="2604OE505D" ${subject === '2604OE505D' ? 'selected' : ''}>Quantum Computing</option>
        <option value="2604PCC526" ${subject === '2604PCC526' ? 'selected' : ''}>Lab Practice - I</option>
      </select>
    </div>

    <div id="resourceResultsHost">
      ${renderResourceResultsInner(filtered)}
    </div>
  `;
}

export function renderResourceResultsInner(filtered) {
  return `
    <div style="font-size:var(--text-xs); color:var(--text-dim); margin-bottom:1rem;">
      Showing ${filtered.length} of ${ACADEMIC_RESOURCES.length} resources
    </div>
    ${filtered.length === 0 ? `
      <div class="empty-state-card">
        <h3 class="empty-state-title">No Resources Found</h3>
        <p class="empty-state-desc">No academic resources match your search criteria. Try clearing the filters.</p>
        <button class="btn-primary-action" id="resetResourceFilterBtn" type="button">Clear Filters</button>
      </div>
    ` : `
      <div class="resource-cards-list">
        ${filtered.map(res => {
          const bookmarked = isItemBookmarked(res.id);
          return `
            <div class="resource-item-card">
              <div class="resource-card-top">
                <div style="display:flex; align-items:center; justify-content:space-between;">
                  <span class="resource-type-badge">${escapeHtml(res.type)}</span>
                  <span style="font-size:var(--text-xs); color:var(--text-dim);">${escapeHtml(res.size)}</span>
                </div>
                <h3 class="resource-card-title">${escapeHtml(res.title)}</h3>
                <p class="resource-card-desc">${escapeHtml(res.description)}</p>
                <div style="font-size:var(--text-xs); color:var(--text-dim); margin-top:0.45rem;">
                  Subject: <strong>${escapeHtml(res.subjectTitle)}</strong>
                </div>
              </div>
              <div class="resource-card-footer">
                <div style="display:flex; gap:0.45rem;">
                  <button class="btn-header-action" type="button" style="padding:0.25rem 0.6rem; font-size:var(--text-xs);" data-open-resource-id="${res.id}">
                    <i data-lucide="eye" style="width:13px; height:13px;"></i>
                    <span>Open</span>
                  </button>
                  <button class="btn-header-action" type="button" style="padding:0.25rem 0.6rem; font-size:var(--text-xs);" data-print-resource-id="${res.id}" aria-label="Print resource" title="Print Document">
                    <i data-lucide="printer" style="width:13px; height:13px;"></i>
                  </button>
                </div>
                <button class="btn-icon-square" type="button" data-bookmark-resource-id="${res.id}" aria-label="${bookmarked ? 'Remove bookmark' : 'Bookmark resource'}" title="${bookmarked ? 'Remove bookmark' : 'Bookmark resource'}">
                  <i data-lucide="bookmark" style="width:14px; height:14px; ${bookmarked ? 'fill:var(--accent); color:var(--accent);' : ''}"></i>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `}
  `;
}
