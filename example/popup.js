// popup.js
document.getElementById('injectButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.runtime.sendMessage({ action: 'fetchRemoteJS' });
    });
  });
  