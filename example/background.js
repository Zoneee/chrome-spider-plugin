chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'fetchRemoteJS') {
        fetch('http://localhost:3000/hello')
            .then(response => response.text())
            .then(scriptContent => {
                chrome.tabs.sendMessage(sender.tab.id, { action: 'injectScript', code: scriptContent });
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    }
});
