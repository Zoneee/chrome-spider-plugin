chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'injectScript') {
      const script = document.createElement('script');
      script.textContent = message.code;
      document.head.appendChild(script);
    }
  });
  