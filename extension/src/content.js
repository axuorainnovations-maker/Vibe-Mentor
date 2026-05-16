let active = false;
let mode = 'guidance';
let captureInterval = null;
let overlayCanvas = null;
let ctx = null;
let animationFrame = null;

// Create overlay canvas
function createOverlay() {
  if (overlayCanvas) return;

  overlayCanvas = document.createElement('canvas');
  overlayCanvas.id = 'vibe-mentor-overlay';
  overlayCanvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999999;
    pointer-events: none;
  `;
  overlayCanvas.width = window.innerWidth;
  overlayCanvas.height = window.innerHeight;
  document.body.appendChild(overlayCanvas);
  ctx = overlayCanvas.getContext('2d');

  window.addEventListener('resize', () => {
    overlayCanvas.width = window.innerWidth;
    overlayCanvas.height = window.innerHeight;
  });
}

function removeOverlay() {
  if (overlayCanvas) {
    overlayCanvas.remove();
    overlayCanvas = null;
    ctx = null;
  }
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
}

// Draw cursor at position
function drawCursor(x, y, state = 'idle') {
  if (!ctx) return;
  ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

  // Draw cursor arrow
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 14, y + 10);
  ctx.lineTo(x + 10, y + 14);
  ctx.lineTo(x, y + 4);
  ctx.closePath();
  ctx.fillStyle = '#6366F1';
  ctx.fill();

  // Draw glow for hover/click states
  if (state === 'hover') {
    ctx.beginPath();
    ctx.arc(x + 5, y + 7, 20, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
    ctx.fill();
  } else if (state === 'click') {
    ctx.beginPath();
    ctx.arc(x + 5, y + 7, 25, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + 5, y + 7, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
    ctx.fill();

    // Pulse animation
    setTimeout(() => {
      if (ctx) ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    }, 500);
  }
}

// Animate cursor along a path
function animateCursor(path, callback) {
  if (!path || path.length === 0) return;
  if (!overlayCanvas) createOverlay();

  let index = 0;
  const duration = 2500;
  const startTime = performance.now();
  const startPos = path[0];
  const endPos = path[path.length - 1];

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    if (index < path.length - 1) {
      const t = progress * (path.length - 1);
      index = Math.min(Math.floor(t), path.length - 2);
    }

    const p = path[index] || path[0];
    drawCursor(p.x, p.y, progress > 0.8 ? 'hover' : 'idle');

    if (progress < 1) {
      animationFrame = requestAnimationFrame(step);
    } else {
      if (endPos && callback) {
        drawCursor(endPos.x, endPos.y, 'click');
        setTimeout(callback, 1000);
      }
    }
  }

  animationFrame = requestAnimationFrame(step);
}

// Capture screen using canvas
async function captureScreen() {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const captureCtx = canvas.getContext('2d');

    // Use html2canvas approach - capture visible DOM
    const html = document.documentElement;
    const rect = html.getBoundingClientRect();

    captureCtx.fillStyle = getComputedStyle(document.body).backgroundColor || '#ffffff';
    captureCtx.fillRect(0, 0, canvas.width, canvas.height);

    // Serialize DOM for AI analysis
    const elements = document.querySelectorAll('button, a, input, select, textarea, [role="button"]');
    const interactiveElements = Array.from(elements).slice(0, 20).map(el => ({
      tag: el.tagName.toLowerCase(),
      text: el.textContent?.trim()?.substring(0, 50) || '',
      type: el.getAttribute('type') || '',
      rect: el.getBoundingClientRect(),
    }));

    return {
      screenshot: canvas.toDataURL('image/png', 0.5),
      elements: interactiveElements,
    };
  } catch (err) {
    console.error('Capture failed:', err);
    return null;
  }
}

// Analyze screen via API
async function analyzeScreen() {
  const capture = await captureScreen();
  if (!capture) return;

  try {
    const response = await fetch('http://localhost:3001/api/extension/analyze-screen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (localStorage.getItem('token') || ''),
      },
      body: JSON.stringify({
        screenshot: capture.screenshot,
        taskDescription: document.querySelector('[data-task-description]')?.textContent || '',
        ageGroup: localStorage.getItem('ageGroup') || '12+',
      }),
    });

    const data = await response.json();
    if (data.cursorPath && data.cursorPath.length > 0) {
      animateCursor(data.cursorPath, () => {
        if (data.clickAt) {
          highlightElement(data.clickAt.x, data.clickAt.y);
        }
      });
    }

    if (data.voiceNarration) {
      speak(data.voiceNarration);
    }

    showInstruction(data.instruction);
  } catch (err) {
    console.error('Analysis failed:', err);
  }
}

// Click-to-explain feature
function setupClickToExplain() {
  document.addEventListener('click', async (e) => {
    if (!active || mode !== 'guidance') return;

    e.preventDefault();
    e.stopPropagation();

    const target = e.target;
    target.style.outline = '2px solid #6366F1';
    target.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';

    try {
      const response = await fetch('http://localhost:3001/api/extension/explain-element', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + (localStorage.getItem('token') || ''),
        },
        body: JSON.stringify({
          elementText: target.textContent?.trim()?.substring(0, 100) || '',
          elementTag: target.tagName.toLowerCase(),
          parentContext: target.parentElement?.textContent?.trim()?.substring(0, 200) || '',
          taskDescription: document.querySelector('[data-task-description]')?.textContent || '',
        }),
      });

      const data = await response.json();
      showExplanationModal(data.explanation, data.voiceNarration);
    } catch (err) {
      console.error('Explain failed:', err);
    }
  }, true);
}

// Voice narration
function speak(text) {
  if (!text || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

// Show instruction tooltip
function showInstruction(text) {
  const existing = document.getElementById('vibe-instruction');
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.id = 'vibe-instruction';
  el.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000000;
    background: #111827;
    border: 1px solid #1F2937;
    border-radius: 12px;
    padding: 12px 20px;
    color: #E5E7EB;
    font-size: 14px;
    max-width: 500px;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    animation: fadeIn 0.3s ease;
  `;
  el.textContent = text;
  document.body.appendChild(el);

  // Add keyframe animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateX(-50%) translateY(10px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `;
  document.head.appendChild(style);

  setTimeout(() => el.remove(), 5000);
}

// Show explanation modal
function showExplanationModal(explanation, voiceNarration) {
  const existing = document.getElementById('vibe-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'vibe-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000001;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s ease;
  `;

  modal.innerHTML = `
    <div style="
      background: #111827;
      border: 1px solid #1F2937;
      border-radius: 16px;
      padding: 24px;
      max-width: 400px;
      width: 90%;
    ">
      <h3 style="color: #E5E7EB; font-size: 15px; font-weight: 600; margin-bottom: 8px;">
        What's this?
      </h3>
      <p style="color: #9CA3AF; font-size: 13px; line-height: 1.5; margin-bottom: 16px;">
        ${explanation}
      </p>
      <button id="vibe-close-modal" style="
        width: 100%;
        height: 36px;
        border: none;
        border-radius: 10px;
        background: #6366F1;
        color: white;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
      ">Got it!</button>
    </div>
  `;

  document.body.appendChild(modal);
  if (voiceNarration) speak(voiceNarration);

  document.getElementById('vibe-close-modal').addEventListener('click', () => {
    modal.remove();
    // Reset element styling
    document.querySelectorAll('[style*="outline"]').forEach(el => {
      el.style.outline = '';
      el.style.backgroundColor = '';
    });
  });
}

// Highlight element at coordinates
function highlightElement(x, y) {
  const el = document.elementFromPoint(x, y);
  if (el) {
    el.style.outline = '2px solid #6366F1';
    el.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
  }
}

// Message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'TOGGLE_GUIDANCE':
      active = request.active;
      if (active) {
        createOverlay();
        captureInterval = setInterval(analyzeScreen, 2000);
        analyzeScreen();
      } else {
        removeOverlay();
        if (captureInterval) clearInterval(captureInterval);
        document.getElementById('vibe-instruction')?.remove();
        document.getElementById('vibe-modal')?.remove();
      }
      sendResponse({ success: true });
      break;

    case 'SET_MODE':
      mode = request.mode;
      sendResponse({ success: true });
      break;

    case 'GET_STATUS':
      sendResponse({ active, mode });
      break;
  }
});

// Initialize
setupClickToExplain();
