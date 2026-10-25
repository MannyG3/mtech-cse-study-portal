// M.Tech Computer Engineering Academic & Research Workspace
// Conforming to Autonomous NEP-2020 Curriculum (2026 Pattern)

import './style.css';
import { initRenderer } from './renderer.js';
import { bindAppEvents } from './events.js';

const appEl = document.getElementById('app');

if (appEl) {
  bindAppEvents(appEl);
  initRenderer(appEl);
}
