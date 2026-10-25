// Course Workspace View: Units, Notes, Labs, Question Bank, Textbooks
import { LAB_ASSIGNMENTS } from '../data/labData.js';
import { formatCredits, escapeHtml, renderMarkdown } from '../utils.js';

export function labsForCourse(course) {
  if (!course) return [];
  if (course.code === '2604PCC526' || course.type === 'PCC_LAB') return LAB_ASSIGNMENTS;
  return LAB_ASSIGNMENTS.filter(a => a.subject === course.title);
}

export function renderCourseView(course, notesData, state) {
  const isLab = course.type === 'PCC_LAB' || course.code === '2604PCC526';
  const matchingLabs = labsForCourse(course);
  const teachingText = course.teachingScheme?.lectures ? `${course.teachingScheme.lectures} hrs/wk lecture` : (isLab ? `4 hrs/wk practical` : '');

  return `
    <!-- Course Header Area -->
    <div class="course-hero-header">
      <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem; flex-wrap:wrap;">
        <span class="badge-tag">${course.code}</span>
        <span class="badge-tag">${course.typeFullName || course.type}</span>
        <span class="badge-tag">${formatCredits(course.credits)}</span>
        ${teachingText ? `<span class="badge-tag">${teachingText}</span>` : ''}
      </div>

      <h1 class="course-headline">${course.title}</h1>
      <p class="course-desc-paragraph">${course.description || 'Curriculum framework conforming to autonomous NEP-2020 guidelines.'}</p>

      <!-- Action Row -->
      <div class="course-actions-row">
        ${isLab ? `
          <button class="btn-primary-action" id="openLabDirectBtn" type="button">
            <i data-lucide="play" style="width:14px; height:14px;"></i>
            <span>Open Lab Simulators</span>
          </button>
        ` : `
          <button class="btn-primary-action" id="jumpUnitOneBtn" type="button">
            <i data-lucide="book-open" style="width:14px; height:14px;"></i>
            <span>Continue Unit 1</span>
          </button>
        `}
        <button class="btn-header-action" id="askCourseAiBtn" type="button">
          <i data-lucide="sparkles" style="width:14px; height:14px; color:var(--accent);"></i>
          <span>Ask AI Tutor</span>
        </button>
        <button class="btn-header-action" id="printSyllabusBtn" type="button">
          <i data-lucide="printer" style="width:14px; height:14px;"></i>
          <span>Print Notes</span>
        </button>
      </div>

      <!-- Compact Exam Evaluation Row -->
      <div class="exam-eval-row">
        <div class="exam-eval-header">
          <span>Evaluation Scheme (Autonomous 2026 Pattern)</span>
          <span class="exam-eval-total">Total: 100 Marks</span>
        </div>
        <div class="exam-bar-container">
          <div style="width:20%; background:var(--seg-tae);" title="TAE: 20%"></div>
          <div style="width:20%; background:var(--seg-cae);" title="CAE: 20%"></div>
          <div style="width:60%; background:var(--seg-ese);" title="ESE: 60%"></div>
        </div>
        <div class="exam-eval-breakdown">
          <div><span style="color:var(--text-dim);">TAE (Internal):</span> <strong>${course.examScheme?.tae ?? 20} Marks</strong> (20%)</div>
          <div><span style="color:var(--text-dim);">CAE (Mid-Sem):</span> <strong>${course.examScheme?.cae ?? 20} Marks</strong> (20%)</div>
          <div><span style="color:var(--text-dim);">ESE (End-Sem):</span> <strong>${course.examScheme?.ese ?? 60} Marks</strong> (60%)</div>
        </div>
      </div>
    </div>

    <!-- Sticky Underline Tab Bar -->
    <nav class="sticky-tab-bar" aria-label="Course Section Tabs">
      <button class="tab-underline-btn ${state.activeTab === 'units' ? 'active' : ''}" data-tab="units" type="button">
        <i data-lucide="book-open" style="width:14px; height:14px;"></i>
        <span>Syllabus & Units</span>
      </button>

      <button class="tab-underline-btn ${state.activeTab === 'notes' ? 'active' : ''}" data-tab="notes" type="button">
        <i data-lucide="file-text" style="width:14px; height:14px;"></i>
        <span>Study Notes</span>
      </button>

      ${(isLab || matchingLabs.length > 0) ? `
        <button class="tab-underline-btn ${state.activeTab === 'lab' ? 'active' : ''}" data-tab="lab" type="button">
          <i data-lucide="terminal" style="width:14px; height:14px;"></i>
          <span>Lab Practice Assignments</span>
        </button>
      ` : ''}

      <button class="tab-underline-btn ${state.activeTab === 'questions' ? 'active' : ''}" data-tab="questions" type="button">
        <i data-lucide="help-circle" style="width:14px; height:14px;"></i>
        <span>Question Bank</span>
      </button>

      <button class="tab-underline-btn ${state.activeTab === 'books' ? 'active' : ''}" data-tab="books" type="button">
        <i data-lucide="library" style="width:14px; height:14px;"></i>
        <span>Textbooks</span>
      </button>
    </nav>

    <!-- Tab Pane Body -->
    <div>
      ${renderCourseTabContent(course, notesData, state)}
    </div>
  `;
}

function renderCourseTabContent(course, notesData, state) {
  if (state.activeTab === 'units') {
    if (!course.units || course.units.length === 0) {
      return `
        <div class="empty-state-card">
          <h3 class="empty-state-title">Practical / Experiential Course</h3>
          <p class="empty-state-desc">This course focuses on laboratory implementations and project deliverables.</p>
          <button class="btn-primary-action" id="jumpToLabTabBtn" type="button">View Lab Assignments</button>
        </div>
      `;
    }

    return `
      <div style="display:flex; flex-direction:column; gap:0.85rem;">
        ${course.units.map((unit, uIdx) => {
          const unitId = `${course.code}_unit_${uIdx}`;
          const isMastered = state.completedUnits.includes(unitId);
          const isOpen = state.expandedUnits[unitId] ?? (uIdx === 0);

          return `
            <div class="unit-accordion-item ${isOpen ? 'open' : ''}" id="unitCard_${uIdx}">
              <div class="unit-accordion-header" data-toggle-unit-idx="${uIdx}">
                <div style="display:flex; align-items:baseline; gap:0.65rem;">
                  <span class="badge-tag">${unit.unitNo}</span>
                  <span style="font-size:var(--text-md); font-weight:600; color:var(--text-main);">${escapeHtml(unit.title)}</span>
                </div>
                <div style="display:flex; align-items:center; gap:0.65rem;">
                  <span style="font-size:var(--text-xs); color:var(--text-dim);">${unit.hours} hrs</span>
                  <label style="display:flex; align-items:center; gap:0.35rem; font-size:var(--text-xs); color:var(--text-muted); cursor:pointer;" onclick="event.stopPropagation();">
                    <input type="checkbox" style="accent-color:var(--accent); cursor:pointer;" class="unit-mastery-chk" data-u-id="${unitId}" ${isMastered ? 'checked' : ''} aria-label="Mark unit mastered" />
                    <span>${isMastered ? 'Mastered' : 'Mark Done'}</span>
                  </label>
                  <i data-lucide="chevron-down" style="width:14px; height:14px; color:var(--text-muted);"></i>
                </div>
              </div>

              <div class="unit-accordion-body">
                <div style="font-size:var(--text-xs); font-weight:600; text-transform:uppercase; color:var(--text-dim); margin-bottom:0.65rem;">
                  Topic Checklist (Click to track progress)
                </div>

                <div style="display:flex; flex-direction:column; gap:0.35rem; margin-bottom:1rem;">
                  ${unit.topics.map((t, tIdx) => {
                    const topKey = `${unitId}_topic_${tIdx}`;
                    const checked = state.checkedTopics.includes(topKey);
                    return `
                      <div class="task-row-item ${checked ? 'done' : ''}" style="margin-bottom:0; cursor:pointer;" data-topic-check-key="${topKey}">
                        <input type="checkbox" ${checked ? 'checked' : ''} style="accent-color:var(--accent); pointer-events:none; margin-top:3px;" aria-label="${escapeHtml(t)}" />
                        <span style="font-size:var(--text-sm); line-height:1.45;">${escapeHtml(t)}</span>
                      </div>
                    `;
                  }).join('')}
                </div>

                <div style="display:flex; justify-content:flex-end; gap:0.5rem; padding-top:0.75rem; border-top:1px solid var(--border-subtle);">
                  <button class="btn-header-action" data-jump-to-notes-tab="notes" type="button">
                    <i data-lucide="file-text" style="width:13px; height:13px;"></i>
                    <span>Read Notes & Derivations</span>
                  </button>
                  <button class="btn-header-action" data-unit-ask-ai="${escapeHtml(unit.title)}" type="button">
                    <i data-lucide="sparkles" style="width:13px; height:13px; color:var(--accent);"></i>
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

  if (state.activeTab === 'notes') {
    if (!notesData?.units || notesData.units.length === 0) {
      return `
        <div class="empty-state-card">
          <h3 class="empty-state-title">No Notes Database for this Module</h3>
          <p class="empty-state-desc">Generate custom notes and derivations for this subject using the AI Assistant.</p>
        </div>
      `;
    }

    return `
      <div style="display:flex; flex-direction:column; gap:1.75rem;">
        ${notesData.units.map(unit => `
          <div id="unitNotes_${unit.unitNo.replace(/\s+/g, '')}">
            <h3 style="font-size:var(--text-lg); font-weight:700; color:var(--text-main); margin-bottom:0.85rem; border-bottom:1px solid var(--border-subtle); padding-bottom:0.35rem;">
              ${escapeHtml(unit.unitNo)}: ${escapeHtml(unit.title)}
            </h3>

            <div style="display:flex; flex-direction:column; gap:1rem;">
              ${(unit.keyConcepts || []).map(c => `
                <div class="stat-tile-card" style="padding:1.25rem;">
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.45rem;">
                    <h4 style="font-size:var(--text-md); font-weight:600; color:var(--text-main);">${escapeHtml(c.heading)}</h4>
                    <button class="btn-icon-square" data-ai-concept-ask="${escapeHtml(c.heading)}" type="button" aria-label="Deep-dive with AI" title="Deep-dive with AI">
                      <i data-lucide="sparkles" style="width:13px; height:13px; color:var(--accent);"></i>
                    </button>
                  </div>
                  <div style="font-size:var(--text-sm); color:var(--text-muted); line-height:1.65;">
                    ${renderMarkdown(c.content)}
                  </div>
                  ${c.formula ? `
                    <div style="background:var(--bg-subtle); border:1px solid var(--border-subtle); border-radius:var(--radius-xs); padding:0.55rem 0.85rem; font-family:var(--font-mono); font-size:var(--text-xs); color:var(--text-main); margin-top:0.75rem; display:flex; align-items:center; justify-content:space-between;">
                      <span>📐 Formula / Recurrence: <code>${escapeHtml(c.formula)}</code></span>
                      <button class="btn-header-action" style="padding:0.2rem 0.5rem; font-size:0.68rem;" data-copy-math-text="${escapeHtml(c.formula)}" type="button">
                        Copy
                      </button>
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (state.activeTab === 'lab') {
    const labs = labsForCourse(course);
    if (labs.length === 0) {
      return `
        <div class="empty-state-card">
          <h3 class="empty-state-title">No Lab Assignments For This Course</h3>
          <p class="empty-state-desc">Open Lab Practice - I to run the interactive simulators for Algorithms, Databases, ML, and Distributed Systems.</p>
        </div>
      `;
    }
    return `
      <div style="display:flex; flex-direction:column; gap:1.5rem;">
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <button class="btn-header-action active" type="button" data-filter-lab-part="ALL">All Assignments</button>
          <button class="btn-header-action" type="button" data-filter-lab-part="Part A">Part A: Algorithms</button>
          <button class="btn-header-action" type="button" data-filter-lab-part="Part B">Part B: Databases</button>
          <button class="btn-header-action" type="button" data-filter-lab-part="Part C">Part C: Machine Learning</button>
          <button class="btn-header-action" type="button" data-filter-lab-part="Part D">Part D: Distributed Systems</button>
        </div>

        <div style="display:flex; flex-direction:column; gap:1.5rem;">
          ${labs.map(assign => `
            <div class="lab-split-card" data-lab-card-part="${assign.part}">
              <div class="lab-split-header">
                <div>
                  <h3 style="font-size:var(--text-md); font-weight:600; color:var(--text-main);">${escapeHtml(assign.title)}</h3>
                  <p style="font-size:var(--text-xs); color:var(--text-muted); margin-top:0.2rem;">${escapeHtml(assign.problemStatement)}</p>
                </div>
                <div style="display:flex; gap:0.4rem; align-items:center;">
                  <span class="badge-tag">${escapeHtml(assign.part)}</span>
                  <span class="badge-tag" style="font-family:var(--font-mono);">${escapeHtml(assign.timeComplexity)}</span>
                </div>
              </div>

              <div class="lab-grid-two-pane">
                <!-- Left Code Column -->
                <div class="lab-code-column">
                  <div style="padding:0.45rem 0.85rem; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; font-size:var(--text-xs); font-family:var(--font-mono); color:var(--text-dim);">
                    <span>Implementation Code</span>
                    <button class="btn-header-action" style="padding:0.15rem 0.5rem; font-size:0.68rem;" data-copy-lab-code-id="${assign.id}" type="button">
                      <i data-lucide="copy" style="width:11px; height:11px;"></i>
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre style="padding:1rem; overflow-x:auto; font-family:var(--font-mono); font-size:0.75rem; color:var(--text-main); line-height:1.55; max-height:420px;" id="code_${assign.id}"><code>${escapeHtml(assign.pythonCode)}</code></pre>
                </div>

                <!-- Right Simulator Column -->
                <div class="lab-simulator-column">
                  <span style="font-size:var(--text-xs); font-weight:600; text-transform:uppercase; color:var(--text-dim); letter-spacing:0.04em;">
                    Live Interactive Simulation
                  </span>
                  ${renderInteractiveSimControls(assign)}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (state.activeTab === 'questions') {
    const markFilter = state.questionMarksFilter;
    const qUnits = (notesData?.units || []).map(unit => ({
      ...unit,
      examQuestions: (unit.examQuestions || []).filter(eq => markFilter === 'ALL' || String(eq.marks) === String(markFilter))
    })).filter(u => u.examQuestions.length);

    return `
      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          ${['ALL', '2', '5', '10'].map(m => `
            <button class="btn-header-action ${markFilter === m ? 'active' : ''}" type="button" data-marks-filter="${m}">
              ${m === 'ALL' ? 'All Marks' : `${m} Marks`}
            </button>
          `).join('')}
        </div>
        ${qUnits.length === 0 ? `
          <div class="empty-state-card">
            <h3 class="empty-state-title">No Questions For This Filter</h3>
            <p class="empty-state-desc">Try another marks filter, or ask the AI Tutor to generate a model answer.</p>
          </div>
        ` : qUnits.map(unit => `
          <div class="stat-tile-card" style="padding:1.25rem;">
            <h4 style="font-size:var(--text-sm); font-weight:700; color:var(--text-main); margin-bottom:0.75rem;">
              ${escapeHtml(unit.unitNo)}: ${escapeHtml(unit.title)}
            </h4>
            <div style="display:flex; flex-direction:column; gap:0.65rem;">
              ${unit.examQuestions.map(eq => `
                <div style="display:flex; align-items:baseline; gap:0.65rem; font-size:var(--text-sm);">
                  <span class="badge-tag" style="font-family:var(--font-mono); font-weight:600;">${eq.marks}M</span>
                  <span style="flex:1; color:var(--text-main);">${escapeHtml(eq.q)}</span>
                  <button class="btn-icon-square" type="button" style="width:26px; height:26px;" data-ai-answer-q="${escapeHtml(eq.q)}" aria-label="Get model answer" title="Get model answer with AI">
                    <i data-lucide="sparkles" style="width:12px; height:12px; color:var(--accent);"></i>
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (state.activeTab === 'books') {
    const books = course.textBooks || [];
    const refBooks = course.referenceBooks || [];

    return `
      <div style="display:flex; flex-direction:column; gap:1.75rem;">
        <div>
          <h3 style="font-size:var(--text-lg); font-weight:700; color:var(--text-main); margin-bottom:0.85rem;">
            Prescribed Textbooks
          </h3>
          <div style="display:flex; flex-direction:column; gap:0.65rem;">
            ${books.map((b, i) => `
              <div class="stat-tile-card" style="padding:0.95rem 1.15rem;">
                <div style="font-size:var(--text-xs); color:var(--text-dim);">Textbook ${i + 1}</div>
                <div style="font-size:var(--text-sm); font-weight:500; color:var(--text-main); margin-top:0.2rem;">${escapeHtml(b)}</div>
              </div>
            `).join('')}
          </div>
        </div>

        ${refBooks.length > 0 ? `
          <div>
            <h3 style="font-size:var(--text-lg); font-weight:700; color:var(--text-main); margin-bottom:0.85rem;">
              Reference Literature
            </h3>
            <div style="display:flex; flex-direction:column; gap:0.65rem;">
              ${refBooks.map((b, i) => `
                <div class="stat-tile-card" style="padding:0.95rem 1.15rem;">
                  <div style="font-size:var(--text-xs); color:var(--text-dim);">Reference ${i + 1}</div>
                  <div style="font-size:var(--text-sm); font-weight:500; color:var(--text-main); margin-top:0.2rem;">${escapeHtml(b)}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  return '';
}

function renderInteractiveSimControls(assign) {
  if (assign.interactiveType === 'knapsack') {
    return `
      <div class="form-field-quiet">
        <label style="font-size:var(--text-xs); color:var(--text-muted);">Item Values (comma-separated):</label>
        <input class="input-quiet" id="knapValues" value="60, 100, 120" aria-label="Item Values" />
      </div>
      <div class="form-field-quiet">
        <label style="font-size:var(--text-xs); color:var(--text-muted);">Item Weights (comma-separated):</label>
        <input class="input-quiet" id="knapWeights" value="10, 20, 30" aria-label="Item Weights" />
      </div>
      <div class="form-field-quiet">
        <label style="font-size:var(--text-xs); color:var(--text-muted);">Knapsack Capacity (W):</label>
        <input class="input-quiet" id="knapCapacity" type="number" value="50" aria-label="Knapsack Capacity" />
      </div>
      <button class="btn-header-action" style="background:var(--accent); color:#fff; border-color:var(--accent); justify-content:center;" id="runKnapsackSim" type="button">
        Compute Optimal Profit
      </button>
      <div class="output-box-quiet" id="knapOutput">Click 'Compute' to calculate bottom-up DP table.</div>
    `;
  }

  if (assign.interactiveType === 'platforms') {
    return `
      <div class="form-field-quiet">
        <label style="font-size:var(--text-xs); color:var(--text-muted);">Arrivals (24hr):</label>
        <input class="input-quiet" id="platArrivals" value="09:00, 09:40, 09:50, 11:00, 15:00, 18:00" aria-label="Arrivals" />
      </div>
      <div class="form-field-quiet">
        <label style="font-size:var(--text-xs); color:var(--text-muted);">Departures:</label>
        <input class="input-quiet" id="platDepartures" value="09:10, 12:00, 11:20, 11:30, 19:00, 20:00" aria-label="Departures" />
      </div>
      <button class="btn-header-action" style="background:var(--accent); color:#fff; border-color:var(--accent); justify-content:center;" id="runPlatformsSim" type="button">
        Calculate Minimum Platforms
      </button>
      <div class="output-box-quiet" id="platOutput">Click 'Calculate' to simulate station platforms.</div>
    `;
  }

  if (assign.interactiveType === 'two_generals') {
    return `
      <div class="form-field-quiet">
        <label style="font-size:var(--text-xs); color:var(--text-muted);">Packet Loss Rate (0.0 to 0.9):</label>
        <input class="input-quiet" id="lossProb" type="number" step="0.1" min="0" max="0.9" value="0.4" aria-label="Loss Rate" />
      </div>
      <button class="btn-header-action" style="background:var(--accent); color:#fff; border-color:var(--accent); justify-content:center;" id="runTwoGeneralsSim" type="button">
        Simulate Coordination Protocol
      </button>
      <div class="output-box-quiet" id="twoGeneralsOutput">Click 'Simulate' to test atomic coordination.</div>
    `;
  }

  if (assign.interactiveType === 'bully_election') {
    return `
      <div class="form-field-quiet">
        <label style="font-size:var(--text-xs); color:var(--text-muted);">Failed Coordinator:</label>
        <select class="input-quiet" id="bullyFailedNode" aria-label="Failed Coordinator">
          <option value="5" selected>Node P5 (Highest UID)</option>
          <option value="4">Node P4</option>
        </select>
      </div>
      <div class="form-field-quiet">
        <label style="font-size:var(--text-xs); color:var(--text-muted);">Initiating Node:</label>
        <select class="input-quiet" id="bullyInitiator" aria-label="Initiating Node">
          <option value="2" selected>Node P2 detects crash</option>
          <option value="1">Node P1 detects crash</option>
        </select>
      </div>
      <button class="btn-header-action" style="background:var(--accent); color:#fff; border-color:var(--accent); justify-content:center;" id="runBullyElectionSim" type="button">
        Run Bully Election
      </button>
      <div class="output-box-quiet" id="bullyOutput">Click 'Run' to trigger election broadcast.</div>
    `;
  }

  return `
    <p style="font-size:var(--text-xs); color:var(--text-muted); line-height:1.5;">
      Test case inputs and oral examination preparation points available with AI Tutor.
    </p>
    <button class="btn-header-action" data-unit-ask-ai="${escapeHtml(assign.title)}" type="button">
      <i data-lucide="sparkles" style="width:13px; height:13px; color:var(--accent);"></i>
      <span>Explain with AI</span>
    </button>
    <div class="output-box-quiet">Implementation verified for laboratory submission.</div>
  `;
}
