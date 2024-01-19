var token = ''
var keywords = []
var authorized = true //TODO:测试
function init() {
    document.getElementById('token').addEventListener('change', (e) => {
        var selectedFile = e.currentTarget.files[0];
        importToken(selectedFile)
    })
    document.getElementById('keyword').addEventListener('change', (e) => {
        var selectedFile = e.currentTarget.files[0];
        importKeyWords(selectedFile)
    })
    document.getElementById('authorize').addEventListener('click', (e) => { authorize() })
    document.getElementById('process').addEventListener('click', (e) => {
        if (authorized) {
            chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                if (tabs[0].url.includes('instagram')) {
                    // 完成测试
                    installINS(tabs[0])
                } else if (tabs[0].url.includes('twitter')) {
                    // 完成测试
                    await chrome.storage.local.set({
                        'twitter_data': [
                            ['风险帐号ID', '所属平台', '主页链接'],
                        ]
                    })
                    installTW(tabs[0])
                } else if (tabs[0].url.includes('facebook')) {
                    // TODO:facebook
                }
            })
        }
    })

    chrome.runtime.onMessage.addListener(async (req, sender, res) => {
        if (req.type == 'twitter_data') {
            // var data = []
            var storage = await chrome.storage.local.get('twitter_data') || []
            var data = storage['twitter_data'].concat(req.data)
            await chrome.storage.local.set({ 'twitter_data': data })
        }
    })
}
// 导入关键词
function importKeyWords(file) {
    var reader = new FileReader();

    reader.onload = function (event) {
        // 读取完成后的回调，文件内容在 event.target.result 中
        var fileContent = event.target.result;
        console.log(fileContent);
        keywords = fileContent.split('\r\n')
        window.localStorage.setItem('dsp_spider_keywords', JSON.stringify(keywords))
    };

    // 以文本形式读取文件内容
    reader.readAsText(file);
}
// 导入token
function importToken(file) {
    var reader = new FileReader();

    reader.onload = function (event) {
        // 读取完成后的回调，文件内容在 event.target.result 中
        var fileContent = event.target.result;
        console.log(fileContent);
        token = fileContent.split('\r\n')[0]
    };

    // 以文本形式读取文件内容
    reader.readAsText(file);
}
// 认证token
async function authorize() {
    authorized = false
    var resp = await fetch(`http://localhost:3000/authorize/${token}`, { mode: 'no-cors' })
    var text = await resp.text()
    if (resp.status != 200) {
        // 认证失败
        setStatus('认证失败')
    } else if (text === 'OK') {
        // 成功
        setStatus('认证成功')
        authorized = true
    } else {
        // 认证失败
        setStatus('认证失败')
    }
}
// 注入ins
function installINS(tab) {
    function injectedFunction(data) {
        window.localStorage.setItem('dsp_spider_keywords', data)
    }
    // 通过注入方式传递keywords
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: injectedFunction,
        args: [JSON.stringify(keywords)]
    })
    // 注入任务脚本
    chrome.scripting.executeScript({
        files: ["ins/ins.js"],
        target: { tabId: tab.id },
    });
}
// 注入Twitter
async function installTW(tab) {
    for (let i = 0; i < keywords.length; i++) {
        const kw = keywords[i];

        chrome.tabs.update(tab.id,
            { url: `https://twitter.com/search?q=${kw}&src=typed_query&f=user` },
            function (updatedTab) {
                // 确保标签页已成功更新
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                } else {
                    console.log('Tab updated:', updatedTab);
                    // 注入脚本到标签页
                    chrome.scripting.executeScript({
                        files: ["twitter/twitter.js"],
                        target: { tabId: tab.id },
                    });
                }
            });
        // 等待
        // TODO:增加功能。收到tw完成单个词汇消息后进行下一词汇。
        await waitTime(1000 * 60)
    }
    function exportCsv(data) {
        data = JSON.parse(data)
        // 构建 CSV 数据
        // var csvContent = 'data:text/csv;charset=utf-8,';
        var csvContent = '';
        data.forEach(function (row) {
            csvContent += row.join(',') + '\n';
        });

        // 创建 Blob 对象
        var blob = new Blob([csvContent], { type: 'text/csv' });

        // 创建 Blob URL
        var blobUrl = URL.createObjectURL(blob);

        // 创建并设置下载链接
        var link = document.createElement('a');
        link.setAttribute('href', blobUrl);
        link.setAttribute('download', 'exported_data.csv');
        document.body.appendChild(link);

        // 模拟点击下载链接
        link.click();

        // 释放 Blob URL
        URL.revokeObjectURL(blobUrl);
    }
    // 通过注入方式导出数据
    var storage = await chrome.storage.local.get('twitter_data')
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: exportCsv,
        args: [JSON.stringify(storage['twitter_data'])]
    })
}
function setStatus(status) {
    document.getElementById('status').innerHTML = status
}

function waitTime(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

init()