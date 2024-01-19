
var installed = false
var authorized = false
chrome.runtime.onInstalled.addListener(async (tab) => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
});

chrome.runtime.onMessage.addListener((req, sender, res) => {
    if (req.type == 'ins_process') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            installIns(tabs[0])
        })
    }
})

function waitTime(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

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
            // install(tab)
        } else if (nextState === "OFF") {
        }
    } else {
    }
});

async function authorize(tab) {
    try {
        var url = `http://localhost:3000/authorize/${123}`
        var resp = await fetch(url)
        var content = await resp.text()
        if (content === 'OK') {
            authorized = true
        } else {
            authorized = false
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
        console.error(error);
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

async function installTwitter(tab) {
    var urls = [
        'https://twitter.com/search?q=cat&src=typed_query&f=user',
        'https://twitter.com/search?q=dog&src=typed_query&f=user'
    ]

    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];

        chrome.tabs.update(tab.id, { url: url }, function (updatedTab) {
            // 确保标签页已成功更新
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
            } else {
                console.log('Tab updated:', updatedTab);
                // 注入脚本到标签页
                chrome.scripting.executeScript({
                    files: ["/twitter/twitter.js"],
                    target: { tabId: tab.id },
                });
            }
        });

        await waitTime(1000 * 60)
    }
}

async function installIns(tab) {
    chrome.scripting.executeScript({
        files: ["ins/ins.js"],
        target: { tabId: tab.id },
    });
}