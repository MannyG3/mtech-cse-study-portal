// AI Tutor Side Drawer Component & Service
import { renderMarkdown } from '../utils.js';
import { findAiResponse } from '../data/aiKnowledgeBase.js';
import { saveState } from '../state.js';

export function renderAiSideDrawer(state, activeCourse) {
  return `
    <div class="ai-drawer-overlay" id="aiDrawerOverlayBackdrop"></div>
    <div class="ai-drawer-content" id="aiDrawerContent">
      <div class="ai-drawer-header">
        <div>
          <h3 style="font-size:var(--text-sm); font-weight:700; color:var(--text-main);">M.Tech AI Academic Assistant</h3>
          <p style="font-size:0.68rem; color:var(--text-dim);">${state.geminiApiKey ? 'Live Gemini 2.0 Flash' : 'Curriculum Grounded Engine'}</p>
        </div>
        <div style="display:flex; gap:0.35rem;">
          <button class="btn-icon-square" id="openAiSettingsBtn" type="button" aria-label="API key settings" title="API Key Settings">
            <i data-lucide="settings" style="width:14px; height:14px;"></i>
          </button>
          <button class="btn-icon-square" id="clearChatBtn" type="button" aria-label="Clear chat history" title="Clear Chat">
            <i data-lucide="trash-2" style="width:14px; height:14px;"></i>
          </button>
          <button class="btn-icon-square" id="closeAiDrawerBtn" type="button" aria-label="Close AI drawer" title="Close Drawer">
            <i data-lucide="x" style="width:15px; height:15px;"></i>
          </button>
        </div>
      </div>

      <!-- Quick Prompt Suggestions -->
      <div style="padding:0.6rem 1rem; border-bottom:1px solid var(--border-subtle); display:flex; gap:0.4rem; overflow-x:auto;">
        <button class="tag-quiet" data-send-ai-prompt="Explain 0/1 Knapsack dynamic programming recurrence" type="button">0/1 Knapsack</button>
        <button class="tag-quiet" data-send-ai-prompt="How does Chandy-Lamport snapshot algorithm record in-flight channels?" type="button">Chandy-Lamport</button>
        <button class="tag-quiet" data-send-ai-prompt="Compare Vector Clocks vs Lamport Scalar Clocks with update rules" type="button">Vector Clocks</button>
        <button class="tag-quiet" data-send-ai-prompt="Explain R-Tree spatial indexing and bounding rectangles" type="button">R-Trees</button>
      </div>

      <!-- Messages Stream -->
      <div class="ai-chat-history" id="aiChatStream">
        ${state.chatHistory.map(msg => `
          <div class="chat-bubble-row ${msg.sender}">
            ${renderMarkdown(msg.text)}
            ${msg.source ? `<div style="font-size:0.65rem; color:var(--text-dim); margin-top:0.35rem;">Source: ${msg.source}</div>` : ''}
          </div>
        `).join('')}
      </div>

      <!-- Input Bar -->
      <form class="ai-input-bar" id="aiDrawerForm">
        <input 
          type="text" 
          class="input-quiet" 
          id="aiDrawerInput" 
          placeholder="Ask a technical or syllabus question..." 
          style="flex:1;" 
          autocomplete="off"
        />
        <button type="submit" class="btn-header-action" style="background:var(--accent); color:#fff; border-color:var(--accent); padding:0.4rem 0.85rem;">
          Send
        </button>
      </form>
    </div>
  `;
}

export function scrollDrawerToBottom() {
  const box = document.getElementById('aiChatStream');
  if (box) box.scrollTop = box.scrollHeight;
}

export async function executeAiQuery(userText, state, onUpdate) {
  state.chatHistory.push({
    sender: "user",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: userText
  });
  saveState();
  if (onUpdate) onUpdate();
  scrollDrawerToBottom();

  if (state.geminiApiKey) {
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": state.geminiApiKey
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: `You are an expert M.Tech Computer Engineering professor for the Autonomous 2026 Pattern NEP-2020 curriculum at Ajeenkya DY Patil School of Engineering. Ground answers in Advanced Algorithms, Advanced Database Systems, Machine Learning, Distributed Computing, Information Retrieval, Natural Language Processing, Deep Learning, and Research Methodology. Prefer recurrences, complexities, course outcomes, and exam-style structure. Student question follows.`
            }]
          },
          contents: [{
            parts: [{ text: userText }]
          }]
        })
      });

      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        state.chatHistory.push({
          sender: "bot",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: data.candidates[0].content.parts[0].text,
          source: "Live Gemini 2.0 Flash"
        });
        saveState();
        if (onUpdate) onUpdate();
        scrollDrawerToBottom();
        return;
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to curriculum knowledge base:", err);
    }
  }

  const aiAnswer = findAiResponse(userText);
  state.chatHistory.push({
    sender: "bot",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: aiAnswer.text,
    source: aiAnswer.subject || "Syllabus Reference"
  });
  saveState();
  if (onUpdate) onUpdate();
  scrollDrawerToBottom();
}
