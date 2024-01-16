const extensions = 'https://developer.chrome.com/docs/extensions'
const webstore = 'https://developer.chrome.com/docs/webstore'
var installed = false

chrome.runtime.onInstalled.addListener(async (tab) => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
});

chrome.action.onClicked.addListener(async (tab) => {
    loadJs(tab)
    if (true) {
        // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
        const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
        console.log(prevState);
        // Next state will always be the opposite
        const nextState = prevState === 'ON' ? 'OFF' : 'ON'

        // Set the action badge to the next state
        await chrome.action.setBadgeText({
            tabId: tab.id,
            text: nextState,
        })

        loadJs(tab)
        if (nextState === "ON") {
            installContainer(tab)
            installShade(tab)
        } else if (nextState === "OFF") {
            uninstallContainer(tab)
            uninstallShade(tab)
        }
    }
});
function loadJs(tab) {
    var url = 'http://localhost:3000/hello'
    fetch(url)
        .then(response => response.text())
        .then(scriptContent => {
            chrome.tabs.sendMessage(tab.id, { action: 'injectScript', code: scriptContent });
            // chrome.tabs.executeScript(tab.id, { code: scriptContent });
        });
}

function installContainer(tab) {
    if (!installed) {
        chrome.scripting.executeScript({
            files: ["/content_scripts/container.js"],
            target: { tabId: tab.id },
        });
        installed = true
    }
    else {
        chrome.scripting.executeScript({
            files: ["/content_scripts/container-show.js"],
            target: { tabId: tab.id },
        });
    }
    chrome.scripting.insertCSS({
        files: ["/content_scripts/container.css"],
        target: { tabId: tab.id },
    });
}
function installShade(tab) {
    chrome.scripting.executeScript({
        files: ["/content_scripts/shade.js"],
        target: { tabId: tab.id },
    });
    chrome.scripting.insertCSS({
        files: ["/content_scripts/shade.css"],
        target: { tabId: tab.id },
    });
}
function uninstallContainer(tab) {
    chrome.scripting.executeScript({
        files: ["/content_scripts/container-hidden.js"],
        target: { tabId: tab.id },
    });
    chrome.scripting.removeCSS({
        files: ["shade.css"],
        target: { tabId: tab.id },
    });
}
function uninstallShade(tab) {
    chrome.scripting.removeCSS({
        files: ["shade.css"],
        target: { tabId: tab.id },
    });
}