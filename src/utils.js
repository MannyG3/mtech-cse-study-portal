import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({
  gfm: true,
  breaks: true
});

export function formatCredits(count) {
  return count === 1 ? "1 credit" : `${count} credits`;
}

export function formatTime(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderMarkdown(text) {
  const html = marked.parse(String(text || ''), { async: false });
  return DOMPurify.sanitize(html);
}

export function countCurriculumUnits(semesters) {
  return semesters.reduce(
    (acc, sem) => acc + sem.courses.reduce((n, c) => n + (c.units?.length || 0), 0),
    0
  );
}

export function parseClockToMinutes(value) {
  const trimmed = String(value).trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

export const KNAPSACK_MAX_CAPACITY = 500;
export const MAX_CHAT_MESSAGES = 40;
