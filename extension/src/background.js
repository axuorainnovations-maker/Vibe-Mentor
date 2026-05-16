chrome.runtime.onInstalled.addListener(() => {
  console.log('Vibe Mentor extension installed');
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, {
    type: 'TOGGLE_GUIDANCE',
    active: true,
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'TASK_COMPLETE') {
    fetch('http://localhost:3001/api/extension/task-complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (request.token || ''),
      },
      body: JSON.stringify({
        lessonId: request.lessonId,
        taskId: request.taskId,
        screenshotProof: request.screenshot,
      }),
    }).then(res => res.json()).then(data => {
      sendResponse(data);
    }).catch(err => {
      console.error('Task complete failed:', err);
      sendResponse({ error: err.message });
    });
    return true;
  }
});
