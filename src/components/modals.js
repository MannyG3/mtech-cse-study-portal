// Modal Dialogs & Command Palette Layer
import { QUIZ_QUESTIONS, FLASHCARD_DECKS } from '../data/quizData.js';
import { SEMESTERS } from '../data/curriculum.js';
import { SUBJECT_NOTES } from '../data/notes.js';
import { RESEARCH_PAPERS } from '../data/researchPapers.js';
import { ACADEMIC_RESOURCES } from '../data/resources.js';
import { escapeHtml } from '../utils.js';
import confetti from 'canvas-confetti';

export let commandPaletteMatches = [];

export function renderActiveModalLayer(state) {
  if (!state.activeModal) return '';

  if (state.activeModal === 'search') return renderSearchModal();
  if (state.activeModal === 'taskModal') return renderTaskModal();
  if (state.activeModal === 'quiz') return renderQuizModal(state);
  if (state.activeModal === 'flashcards') return renderFlashcardsModal(state);
  if (state.activeModal === 'calc') return renderCalcModal();
  if (state.activeModal === 'settings') return renderSettingsModal();
  if (state.activeModal === 'pdfReader') return renderPdfReaderModal(state);
  return '';
}

function renderSearchModal() {
  return `
    <div class="dialog-modal-backdrop" id="modalBackdrop" role="dialog" aria-modal="true" aria-label="Command Palette">
      <div class="dialog-modal-card">
        <div style="padding:0.75rem 1rem; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:0.65rem;">
          <i data-lucide="search" style="width:16px; height:16px; color:var(--text-dim);"></i>
          <input 
            type="text" 
            id="cmdPaletteSearchInput" 
            placeholder="Search subjects, units, formulas, research papers, resources..." 
            style="flex:1; border:none; background:transparent; font-size:var(--text-base); color:var(--text-main); outline:none;" 
            autofocus 
            aria-label="Search curriculum records"
          />
          <kbd class="kbd-shortcut">Esc</kbd>
        </div>
        <div style="padding:0.5rem; max-height:360px; overflow-y:auto;" id="cmdPaletteResults">
          <p style="font-size:var(--text-xs); color:var(--text-dim); padding:1rem; text-align:center;">
            Type any term (e.g. 'Knapsack', 'PageRank', 'Transformer', 'ANOVA', 'BM25', 'ResNet')...
          </p>
        </div>
      </div>
    </div>
  `;
}

function renderTaskModal() {
  return `
    <div class="dialog-modal-backdrop" id="modalBackdrop" role="dialog" aria-modal="true" aria-label="New Task">
      <div class="dialog-modal-card" style="max-width:480px;">
        <div style="padding:0.85rem 1.15rem; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:var(--text-sm); font-weight:600; color:var(--text-main);">New Study Milestone / Task</span>
          <button class="btn-icon-square" id="closeGenericModalBtn" type="button" aria-label="Close modal"><i data-lucide="x" style="width:14px; height:14px;"></i></button>
        </div>
        <form style="padding:1.25rem; display:flex; flex-direction:column; gap:0.75rem;" id="createTaskForm">
          <div class="form-field-quiet">
            <label style="font-size:var(--text-xs); color:var(--text-muted);">Task Title *</label>
            <input class="input-quiet" id="taskTitleInput" required placeholder="e.g. Master Floyd-Warshall DP recurrence" />
          </div>
          <div class="form-field-quiet">
            <label style="font-size:var(--text-xs); color:var(--text-muted);">Course Tag</label>
            <select class="input-quiet" id="taskCourseSelect" aria-label="Course Tag">
              <option value="GENERAL">General / Seminar</option>
              <option value="2604PCC501">2604PCC501: Advanced Algorithms</option>
              <option value="2604PCC502">2604PCC502: Advanced Database Systems</option>
              <option value="2604PCC503">2604PCC503: Machine Learning</option>
              <option value="2604PCC504">2604PCC504: Distributed Computing</option>
              <option value="2604PCC551">2604PCC551: Information Retrieval</option>
              <option value="2604PCC552">2604PCC552: Natural Language Processing</option>
              <option value="2604PCC553">2604PCC553: Deep Learning</option>
              <option value="2604RM601">2604RM601: Research Methodology</option>
            </select>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <div class="form-field-quiet">
              <label style="font-size:var(--text-xs); color:var(--text-muted);">Due Date</label>
              <input type="date" class="input-quiet" id="taskDateInput" aria-label="Due Date" />
            </div>
            <div class="form-field-quiet">
              <label style="font-size:var(--text-xs); color:var(--text-muted);">Priority</label>
              <select class="input-quiet" id="taskPrioritySelect" aria-label="Priority">
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="normal" selected>Normal</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div class="form-field-quiet">
            <label style="font-size:var(--text-xs); color:var(--text-muted);">Description (optional)</label>
            <textarea class="input-quiet" id="taskDescInput" style="height:60px; resize:vertical;" placeholder="Key derivation steps, textbook chapter, or assignment file..."></textarea>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:0.5rem;">
            <button type="button" class="btn-header-action" id="cancelTaskModalBtn">Cancel</button>
            <button type="submit" class="btn-primary-action">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderPdfReaderModal(state) {
  const res = state.modalData?.resource;
  return `
    <div class="dialog-modal-backdrop" id="modalBackdrop" role="dialog" aria-modal="true" aria-label="Resource Details">
      <div class="dialog-modal-card" style="width:780px; max-width:94vw;">
        <div style="padding:0.85rem 1.15rem; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:var(--text-sm); font-weight:600; color:var(--text-main);">${escapeHtml(res?.title || 'Academic Resource')}</span>
          <button class="btn-icon-square" id="closeGenericModalBtn" type="button" aria-label="Close modal"><i data-lucide="x" style="width:14px; height:14px;"></i></button>
        </div>
        <div style="padding:1.5rem; max-height:75vh; overflow-y:auto;">
          <div style="background:var(--bg-subtle); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:1rem; margin-bottom:1rem;">
            <div style="font-size:var(--text-xs); color:var(--text-dim);">Resource Type: ${escapeHtml(res?.type)} • Category: ${escapeHtml(res?.category)}</div>
            <div style="font-size:var(--text-sm); color:var(--text-muted); margin-top:0.35rem;">${escapeHtml(res?.description)}</div>
          </div>
          <div style="font-size:var(--text-sm); color:var(--text-main); line-height:1.6;">
            <p>This resource is officially prescribed for <strong>${escapeHtml(res?.subjectTitle)}</strong> under the Autonomous NEP-2020 syllabus.</p>
            <p style="margin-top:0.75rem;">You can print or download the curriculum reference sheet, review the corresponding notes in the workspace, or generate custom model answers using the AI Assistant.</p>
          </div>
          <div style="display:flex; gap:0.5rem; justify-content:flex-end; margin-top:1.5rem;">
            <button class="btn-header-action" onclick="window.print()" type="button">
              <i data-lucide="printer" style="width:13px; height:13px;"></i>
              <span>Print View</span>
            </button>
            <button class="btn-primary-action" id="closeGenericModalActionBtn" type="button">
              <span>Back to Workspace</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderQuizModal(state) {
  const questions = QUIZ_QUESTIONS[state.activeCourseCode] || [];
  if (!questions.length) {
    return `
      <div class="dialog-modal-backdrop" id="modalBackdrop" role="dialog" aria-modal="true" aria-label="Practice Exam Quiz">
        <div class="dialog-modal-card">
          <div style="padding:0.85rem 1.15rem; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:var(--text-sm); font-weight:600; color:var(--text-main);">Practice Exam Quiz</span>
            <button class="btn-icon-square" id="closeGenericModalBtn" type="button" aria-label="Close modal"><i data-lucide="x" style="width:14px; height:14px;"></i></button>
          </div>
          <div class="empty-state-card" style="margin:1.25rem;">
            <h3 class="empty-state-title">No Quiz For This Course Yet</h3>
            <p class="empty-state-desc">Select a Programme Core course (e.g. Algorithms, Database Systems, ML, Distributed Computing, IR, NLP, Deep Learning, or Research Methodology) to take a targeted quiz.</p>
          </div>
        </div>
      </div>
    `;
  }

  const currentIdx = state.modalData?.quizIndex || 0;
  const q = questions[currentIdx];
  const userAnswers = state.modalData?.userAnswers || {};
  const isAnswered = userAnswers[currentIdx] !== undefined;

  return `
    <div class="dialog-modal-backdrop" id="modalBackdrop" role="dialog" aria-modal="true" aria-label="Practice Exam Quiz">
      <div class="dialog-modal-card">
        <div style="padding:0.85rem 1.15rem; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:var(--text-sm); font-weight:600; color:var(--text-main);">Practice Exam Quiz (${currentIdx + 1} of ${questions.length})</span>
          <button class="btn-icon-square" id="closeGenericModalBtn" type="button" aria-label="Close modal"><i data-lucide="x" style="width:14px; height:14px;"></i></button>
        </div>
        <div style="padding:1.25rem 1.4rem;">
          <p style="font-size:var(--text-base); font-weight:600; color:var(--text-main); margin-bottom:1rem;">
            ${escapeHtml(q.question)}
          </p>

          <div role="radiogroup" aria-label="Quiz Answer Choices" style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1.25rem;">
            ${q.options.map((opt, optIdx) => {
              let btnStyle = "background:var(--bg-subtle); border-color:var(--border-subtle);";
              if (isAnswered) {
                if (optIdx === q.correctAnswer) {
                  btnStyle = "background:var(--status-success-bg); border-color:var(--status-success); color:var(--status-success); font-weight:600;";
                } else if (userAnswers[currentIdx] === optIdx) {
                  btnStyle = "background:var(--status-danger-bg); border-color:var(--status-danger); color:var(--status-danger);";
                }
              }

              return `
                <button 
                  class="btn-header-action" 
                  type="button"
                  role="radio"
                  aria-checked="${userAnswers[currentIdx] === optIdx ? 'true' : 'false'}"
                  style="justify-content:flex-start; text-align:left; ${btnStyle}" 
                  data-quiz-option="${optIdx}" 
                  ${isAnswered ? 'disabled' : ''}
                >
                  <span style="font-weight:600; width:18px;">${String.fromCharCode(65 + optIdx)}.</span>
                  <span>${escapeHtml(opt)}</span>
                </button>
              `;
            }).join('')}
          </div>

          ${isAnswered ? `
            <div style="background:var(--bg-subtle); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:0.75rem 0.95rem; font-size:var(--text-xs); color:var(--text-muted); line-height:1.5;">
              <strong>Explanation:</strong> ${escapeHtml(q.explanation)}
            </div>
          ` : ''}

          <div style="display:flex; justify-content:space-between; margin-top:1.5rem;">
            <button class="btn-header-action" id="prevQuizQuestionBtn" type="button" ${currentIdx === 0 ? 'disabled' : ''}>Previous</button>
            ${currentIdx < questions.length - 1 ? `
              <button class="btn-primary-action" id="nextQuizQuestionBtn" type="button" ${!isAnswered ? 'disabled' : ''}>Next</button>
            ` : `
              <button class="btn-primary-action" id="finishQuizQuestionBtn" type="button" ${!isAnswered ? 'disabled' : ''}>Finish & Score</button>
            `}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderFlashcardsModal(state) {
  const deck = FLASHCARD_DECKS[state.activeCourseCode] || [];
  if (!deck.length) {
    return `
      <div class="dialog-modal-backdrop" id="modalBackdrop" role="dialog" aria-modal="true" aria-label="Revision Flashcards">
        <div class="dialog-modal-card">
          <div style="padding:0.85rem 1.15rem; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:var(--text-sm); font-weight:600; color:var(--text-main);">Revision Flashcards</span>
            <button class="btn-icon-square" id="closeGenericModalBtn" type="button" aria-label="Close modal"><i data-lucide="x" style="width:14px; height:14px;"></i></button>
          </div>
          <div class="empty-state-card" style="margin:1.25rem;">
            <h3 class="empty-state-title">No Flashcards For This Course</h3>
            <p class="empty-state-desc">Flashcard decks are available for all core examination courses.</p>
          </div>
        </div>
      </div>
    `;
  }

  const currentIdx = state.modalData?.flashIndex || 0;
  const card = deck[currentIdx];
  const isFlipped = state.modalData?.isFlipped || false;

  return `
    <div class="dialog-modal-backdrop" id="modalBackdrop" role="dialog" aria-modal="true" aria-label="Revision Flashcards">
      <div class="dialog-modal-card">
        <div style="padding:0.85rem 1.15rem; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:var(--text-sm); font-weight:600; color:var(--text-main);">Revision Flashcards (${currentIdx + 1} of ${deck.length})</span>
          <button class="btn-icon-square" id="closeGenericModalBtn" type="button" aria-label="Close modal"><i data-lucide="x" style="width:14px; height:14px;"></i></button>
        </div>
        <div style="padding:1.25rem 1.4rem;">
          <div class="flashcard-3d" id="flipCardSurfaceEl" role="button" tabindex="0" aria-label="Click to flip flashcard">
            <div class="flashcard-inner ${isFlipped ? 'is-flipped' : ''}">
              <div class="flashcard-face front">
                <div style="font-size:var(--text-xs); text-transform:uppercase; color:var(--text-dim); margin-bottom:0.75rem;">Question / Concept</div>
                <div style="font-size:var(--text-md); font-weight:500; color:var(--text-main); line-height:1.5; white-space:pre-wrap;">${escapeHtml(card.front)}</div>
              </div>
              <div class="flashcard-face back">
                <div style="font-size:var(--text-xs); text-transform:uppercase; color:var(--text-dim); margin-bottom:0.75rem;">Answer & Derivation</div>
                <div style="font-size:var(--text-md); font-weight:500; color:var(--text-main); line-height:1.5; white-space:pre-wrap;">${escapeHtml(card.back)}</div>
              </div>
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1.25rem;">
            <button class="btn-header-action" type="button" id="prevFlashCardBtn" ${currentIdx === 0 ? 'disabled' : ''}>Previous</button>
            <span style="font-size:var(--text-xs); color:var(--text-dim);">${currentIdx + 1} / ${deck.length}</span>
            <button class="btn-header-action" type="button" id="nextFlashCardBtn" ${currentIdx === deck.length - 1 ? 'disabled' : ''}>Next</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCalcModal() {
  return `
    <div class="dialog-modal-backdrop" id="modalBackdrop" role="dialog" aria-modal="true" aria-label="Target Mark Calculator">
      <div class="dialog-modal-card" style="max-width:480px;">
        <div style="padding:0.85rem 1.15rem; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:var(--text-sm); font-weight:600; color:var(--text-main);">Target Mark Calculator</span>
          <button class="btn-icon-square" id="closeGenericModalBtn" type="button" aria-label="Close modal"><i data-lucide="x" style="width:14px; height:14px;"></i></button>
        </div>
        <div style="padding:1.25rem;">
          <p style="font-size:var(--text-xs); color:var(--text-muted); margin-bottom:1rem;">
            Autonomous Scheme: Teacher Assessment (TAE: 20) + Mid-Sem (CAE: 20) + End-Sem (ESE: 60) = 100 Marks.
          </p>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <div class="form-field-quiet">
              <label style="font-size:var(--text-xs); color:var(--text-muted);">Teacher Assessment (TAE / 20):</label>
              <input class="input-quiet" type="number" min="0" max="20" id="calcTaeField" value="18" aria-label="TAE marks out of 20" />
            </div>
            <div class="form-field-quiet">
              <label style="font-size:var(--text-xs); color:var(--text-muted);">Continuous Assessment / Mid-Sem (CAE / 20):</label>
              <input class="input-quiet" type="number" min="0" max="20" id="calcCaeField" value="16" aria-label="CAE marks out of 20" />
            </div>
            <div class="form-field-quiet">
              <label style="font-size:var(--text-xs); color:var(--text-muted);">Target Grade:</label>
              <select class="input-quiet" id="calcTargetGradeSelect" aria-label="Target Grade">
                <option value="90">O Grade (&gt;= 90 Marks / 10 CGPA)</option>
                <option value="80" selected>A+ Grade (&gt;= 80 Marks / 9 CGPA)</option>
                <option value="70">A Grade (&gt;= 70 Marks / 8 CGPA)</option>
                <option value="60">B+ Grade (&gt;= 60 Marks / 7 CGPA)</option>
              </select>
            </div>
            <button class="btn-primary-action" id="runCalcMarksBtn" type="button" style="justify-content:center; margin-top:0.25rem;">
              Calculate Required ESE Score
            </button>
            <div class="output-box-quiet" id="calcModalOutput">Enter internal scores to compute required End-Sem score.</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSettingsModal() {
  return `
    <div class="dialog-modal-backdrop" id="modalBackdrop" role="dialog" aria-modal="true" aria-label="Settings">
      <div class="dialog-modal-card" style="max-width:440px;">
        <div style="padding:0.85rem 1.15rem; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:var(--text-sm); font-weight:600; color:var(--text-main);">AI Tutor Settings</span>
          <button class="btn-icon-square" id="closeGenericModalBtn" type="button" aria-label="Close modal"><i data-lucide="x" style="width:14px; height:14px;"></i></button>
        </div>
        <div style="padding:1.25rem;">
          <p style="font-size:var(--text-xs); color:var(--text-muted); margin-bottom:1rem;">
            The portal provides offline grounded syllabus answers. Enter a Gemini API key if you desire free-form live LLM reasoning.
          </p>
          <div class="form-field-quiet">
            <label style="font-size:var(--text-xs); color:var(--text-muted);">Google Gemini API Key (stored locally):</label>
            <input class="input-quiet" type="password" id="geminiApiKeySetting" autocomplete="off" placeholder="AIzaSy..." aria-label="Gemini API Key" />
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.25rem;">
            <button class="btn-header-action" id="clearApiKeyQuietBtn" type="button">Clear</button>
            <button class="btn-primary-action" id="saveApiKeyQuietBtn" type="button">Save Key</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function finishQuizAction(state, onFinish) {
  const questions = QUIZ_QUESTIONS[state.activeCourseCode] || [];
  let score = 0;
  questions.forEach((q, idx) => {
    if (state.modalData?.userAnswers?.[idx] === q.correctAnswer) score++;
  });
  const percent = questions.length ? Math.round((score / questions.length) * 100) : 0;
  if (percent >= 70) {
    confetti({ particleCount: 140, spread: 70, origin: { y: 0.65 } });
  }
  if (onFinish) onFinish(`Quiz result: ${score} of ${questions.length} correct (${percent}%).`);
}

export function runMarksCalculator() {
  const tae = Math.min(20, Math.max(0, parseFloat(document.getElementById('calcTaeField')?.value) || 0));
  const cae = Math.min(20, Math.max(0, parseFloat(document.getElementById('calcCaeField')?.value) || 0));
  const target = parseFloat(document.getElementById('calcTargetGradeSelect')?.value) || 80;

  const internalTotal = tae + cae;
  const needed = target - internalTotal;

  let msg = `Internal Marks: ${internalTotal} / 40\n`;
  if (needed > 60) {
    msg += `Note: Target cannot be reached with 60/60 in ESE. Internal score must be higher.`;
  } else if (needed <= 0) {
    msg += `Target achieved: Current internals meet the ${target} threshold. Passing ESE secures this grade.`;
  } else {
    const pct = Math.round((needed / 60) * 100);
    msg += `Required End-Sem (ESE) Score: ${needed.toFixed(1)} / 60 Marks (${pct}%) to secure target grade.`;
  }
  const outEl = document.getElementById('calcModalOutput');
  if (outEl) outEl.textContent = msg;
}

export function searchCommandPalette(raw, onSelectCourse, onSelectView) {
  const resultsBox = document.getElementById('cmdPaletteResults');
  if (!resultsBox) return;
  const q = raw.toLowerCase().trim();
  if (!q || q.length < 2) {
    resultsBox.innerHTML = `<p style="font-size:var(--text-xs); color:var(--text-dim); padding:1rem; text-align:center;">Type any keyword...</p>`;
    return;
  }

  const matches = [];

  SEMESTERS.forEach(sem => {
    sem.courses.forEach(c => {
      if (c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q)) {
        matches.push({
          title: `${c.code}: ${c.title}`,
          sub: `${sem.name} • ${c.type}`,
          type: "Subject",
          action: () => onSelectCourse(c.code)
        });
      }
      (c.units || []).forEach((unit, uIdx) => {
        const hay = `${unit.title} ${(unit.topics || []).join(' ')}`.toLowerCase();
        if (hay.includes(q)) {
          matches.push({
            title: `${c.code} ${unit.unitNo}: ${unit.title}`,
            sub: `${c.title} • ${sem.name}`,
            type: "Unit",
            action: () => onSelectCourse(c.code, 'units', `${c.code}_unit_${uIdx}`)
          });
        }
      });
    });
  });

  Object.entries(SUBJECT_NOTES).forEach(([code, notes]) => {
    (notes.units || []).forEach(unit => {
      (unit.keyConcepts || []).forEach(concept => {
        if (concept.heading.toLowerCase().includes(q) || (concept.content || '').toLowerCase().includes(q)) {
          matches.push({
            title: concept.heading,
            sub: `${notes.courseTitle || code} • ${unit.unitNo}`,
            type: "Notes",
            action: () => onSelectCourse(code, 'notes')
          });
        }
      });
    });
  });

  RESEARCH_PAPERS.forEach(p => {
    if (p.title.toLowerCase().includes(q) || p.authors.toLowerCase().includes(q) || p.tags.some(tag => tag.toLowerCase().includes(q))) {
      matches.push({
        title: `Paper: ${p.title}`,
        sub: `${p.authors} (${p.year}) • ${p.venue}`,
        type: "Research Paper",
        action: () => onSelectView('research')
      });
    }
  });

  ACADEMIC_RESOURCES.forEach(r => {
    if (r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)) {
      matches.push({
        title: `Resource: ${r.title}`,
        sub: `${r.type} • ${r.subjectTitle}`,
        type: "Resource",
        action: () => onSelectView('resources')
      });
    }
  });

  commandPaletteMatches = matches.slice(0, 8);
  if (commandPaletteMatches.length === 0) {
    resultsBox.innerHTML = `<p style="font-size:var(--text-xs); color:var(--text-dim); padding:1rem; text-align:center;">No matching records found.</p>`;
    return;
  }

  resultsBox.innerHTML = commandPaletteMatches.map((m, idx) => `
    <button class="btn-header-action" type="button" style="width:100%; justify-content:flex-start; text-align:left; padding:0.55rem 0.85rem; margin-bottom:0.3rem;" data-cmd-match-idx="${idx}">
      <div style="flex:1;">
        <div style="font-size:var(--text-sm); font-weight:600; color:var(--text-main);">${escapeHtml(m.title)}</div>
        <div style="font-size:var(--text-xs); color:var(--text-dim); margin-top:0.15rem;">${escapeHtml(m.sub)}</div>
      </div>
      <span class="badge-tag">${escapeHtml(m.type)}</span>
    </button>
  `).join('');
}
