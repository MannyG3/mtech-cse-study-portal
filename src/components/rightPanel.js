// Right Sidebar: Course Outcomes & Personal Scratchpad
export function renderRightPanel(course) {
  if (!course) return '';
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
        ></textarea>
        <button class="btn-header-action" style="justify-content:center; font-size:var(--text-xs); padding:0.3rem 0.6rem;" id="saveCourseNoteBtn" type="button">
          Save Note
        </button>
      </div>
    </aside>
  `;
}
