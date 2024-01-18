const extensions = 'https://developer.chrome.com/docs/extensions'
const webstore = 'https://developer.chrome.com/docs/webstore'
var installed = false
var authorized = false
chrome.runtime.onInstalled.addListener(async (tab) => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
});

chrome.action.onClicked.addListener(async (tab) => {
    await authorize(tab)
    if (authorized) {
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

        if (nextState === "ON") {
            installContainer(tab)
            installShade(tab)
        } else if (nextState === "OFF") {
            uninstallContainer(tab)
            uninstallShade(tab)
        }
    } else {
    }
});

async function authorize(tab) {
    try {

        var url = `http://localhost:3000/authorize/${1233}`
        var resp = await fetch(url)
        if (resp.text() === 'OK') {
            content = true
        } else {
            chrome.scripting.executeScript({
                files: ["/content_scripts/unactived.js"],
                target: { tabId: tab.id },
            });
            chrome.scripting.insertCSS({
                files: ["/content_scripts/unactived.css"],
                target: { tabId: tab.id },
            });
        }
    } catch (error) {
        chrome.scripting.executeScript({
            files: ["/content_scripts/unactived.js"],
            target: { tabId: tab.id },
        });
        chrome.scripting.insertCSS({
            files: ["/content_scripts/unactived.css"],
            target: { tabId: tab.id },
        });
    }
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
