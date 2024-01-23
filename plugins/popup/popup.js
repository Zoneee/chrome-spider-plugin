var token = ''
var keywords = []
var authorized = false //TODO:启用。demo不启用
var updated_keywords = false
async function init() {
    // 认证事件
    document.getElementById('authorize').addEventListener('change', async (e) => {
        var selectedFile = e.currentTarget.files[0];
        await importToken(selectedFile)
        await authorize()
        isReadied()
    })
    // 关键词事件
    document.getElementById('keyword').addEventListener('change', async (e) => {
        var selectedFile = e.currentTarget.files[0];
        await importKeyWords(selectedFile)
        updated_keywords = true
        document.getElementById('keyword_status').classList.add('green')
        document.getElementById('keyword_status').classList.remove('red')
        document.getElementById('keyword_status').innerText = '已上传关键词'
        isReadied()
    })
    // ins/twitter/facebook事件
    var processes = document.getElementsByClassName('process')
    processes[0].addEventListener('click', (e) => {
        if (authorized && !e.target.classList.contains('disable')) {
            chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                if (tabs[0].url.includes('instagram')) {
                    // 完成测试
                    await startTask(true)
                    await installINS(tabs[0])
                } else {
                    alert('请前往ins/twitter/facebook使用插件！')
                    setStatus('请前往ins/twitter/facebook使用插件！')
                }
            })
        }
    })
    processes[1].addEventListener('click', (e) => {
        if (authorized && !e.target.classList.contains('disable')) {
            chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                if (tabs[0].url.includes('twitter')) {
                    // 完成测试
                    await startTask(true)
                    await chrome.storage.local.set({
                        'twitter_data': [
                            ['风险帐号ID', '所属平台', '主页链接'],
                        ]
                    })
                    await installTW(tabs[0])
                } else {
                    alert('请前往ins/twitter/facebook使用插件！')
                    setStatus('请前往ins/twitter/facebook使用插件！')
                }
            })
        }
    })
    processes[2].addEventListener('click', (e) => {
        if (authorized && !e.target.classList.contains('disable')) {
            chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                if (tabs[0].url.includes('facebook')) {
                    // 完成测试
                    await startTask(true)
                    await chrome.storage.local.set({
                        'facebook_data': [
                            ['风险帐号ID', '所属平台', '主页链接'],
                        ]
                    })
                    await installFB(tabs[0])
                } else {
                    alert('请前往ins/twitter/facebook使用插件！')
                    setStatus('请前往ins/twitter/facebook使用插件！')
                }
            })
        }
    })
    // 通信事件
    chrome.runtime.onMessage.addListener(async (req, sender, res) => {
        if (req.type == 'twitter_data') {
            // Twitter数据中转
            // var data = []
            var storage = await chrome.storage.local.get('twitter_data') || []
            var data = storage['twitter_data'].concat(req.data)
            await chrome.storage.local.set({ 'twitter_data': data })
        } else if (req.type == 'facebook_data') {
            // Facebook数据中转
            // var data = []
            var storage = await chrome.storage.local.get('facebook_data') || []
            var data = storage['facebook_data'].concat(req.data)
            await chrome.storage.local.set({ 'facebook_data': data })
        } else if (req.type == 'update_status') {
            // ins任务词更新
            setStatus(req.data)
        } else if (req.type == 'task_end') {
            // ins/twitter/facebook任务完成
            await startTask(false)
            setStatus('任务完成')
        }
    })
    await startTask(false)
}
// 导入关键词
function importKeyWords(file) {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();

        reader.onload = function (event) {
            // 读取完成后的回调，文件内容在 event.target.result 中
            var fileContent = event.target.result;
            console.log(fileContent);
            keywords = fileContent.split('\r\n')
            window.localStorage.setItem('dfs_pluging_keywords', JSON.stringify(keywords))
            resolve()
        };

        // 以文本形式读取文件内容
        reader.readAsText(file);
    })
}
// 导入token
function importToken(file) {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();

        reader.onload = function (event) {
            // 读取完成后的回调，文件内容在 event.target.result 中
            var fileContent = event.target.result;
            console.log(fileContent);
            token = fileContent.split('\r\n')[0]
            resolve()
        };

        // 以文本形式读取文件内容
        reader.readAsText(file);
    })
}
// 认证token
async function authorize() {
    authorized = false
    var resp = await fetch(`http://localhost:3000/authorize/${token}`, { mode: 'no-cors' })
    if (resp.status != 200) {
        // 认证失败
        setStatus('认证失败')
        document.getElementById('authorize_status').classList.remove('green')
        document.getElementById('authorize_status').classList.add('red')
        document.getElementById('authorize_status').innerText = '认证失败'
    } else {
        var text = await decord(await resp.text())
        if (text.authorized) {
            // 成功
            setStatus('认证成功')
            document.getElementById('authorize_status').classList.add('green')
            document.getElementById('authorize_status').classList.remove('red')
            document.getElementById('authorize_status').innerText = '认证成功'
            authorized = true
        }
    }
}
// 解密
async function decord(encrypted) {
    // 将base64字符串转为bit数组
    function base64ToBitArray(base64String) {
        const byteString = atob(base64String);
        const result = [];
        for (let i = 0; i < byteString.length; i++) {
            const binaryString = byteString.charCodeAt(i).toString(2).padStart(8, '0');
            result.push(...binaryString.split('').map(Number));
        }
        return result;
    }

    // 颠倒数组
    function reverseArray(arr) {
        return arr.reverse();
    }

    // 将bit数组转为字符串
    function bitArrayToString(bitArray) {
        const result = [];
        for (let i = 0; i < bitArray.length; i += 8) {
            const byte = bitArray.slice(i, i + 8).join('');
            result.push(String.fromCharCode(parseInt(byte, 2)));
        }
        return result.join('');
    }

    // 解码主程序
    const base64Input = encrypted; // 使用之前的输出作为输入
    const reversedArrayDecoded = reverseArray(base64ToBitArray(base64Input));
    const decodedString = bitArrayToString(reversedArrayDecoded);
    return JSON.parse(decodedString)
}

// 注入ins
async function installINS(tab) {
    // 通过注入方式传递keywords
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: sendKeywords,
        args: [JSON.stringify(keywords)]
    })
    // 注入任务脚本
    await chrome.scripting.executeScript({
        files: ["scripts/ins.js"],
        target: { tabId: tab.id },
    });
}
// 注入Twitter
async function installTW(tab) {
    for (let i = 0; i < keywords.length; i++) {
        const kw = keywords[i];

        setStatus(`正在执行: ${kw}`)
        chrome.tabs.update(tab.id,
            { url: `https://twitter.com/search?q=${kw}&src=typed_query&f=user` },
            async function (updatedTab) {
                // 确保标签页已成功更新
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                } else {
                    console.log('Tab updated:', updatedTab);
                    // 页面加载等待
                    await waitTime(5000)
                    // 注入脚本到标签页
                    await startTask(true)
                    await chrome.scripting.executeScript({
                        files: ["scripts/twitter.js"],
                        target: { tabId: tab.id },
                    });
                }
            });
        // 等待
        // TODO:增加功能。收到tw完成单个词汇消息后进行下一词汇。
        await waitTime(1000 * 60)
    }

    // 通过注入方式导出数据
    var storage = await chrome.storage.local.get('twitter_data')
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: sendExportCsv,
        args: [JSON.stringify(storage['twitter_data'])]
    })
}
// 注入Facebook
async function installFB(tab) {

    for (let i = 0; i < keywords.length; i++) {
        const kw = keywords[i];

        setStatus(`正在执行: ${kw}`)
        chrome.tabs.update(tab.id,
            { url: `https://www.facebook.com/search/people?q=${kw}` },
            async function (updatedTab) {
                // 确保标签页已成功更新
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                } else {
                    console.log('Tab updated:', updatedTab);
                    // 页面加载等待
                    await waitTime(5000)
                    // 注入脚本到标签页
                    await startTask(true)
                    await chrome.scripting.executeScript({
                        files: ["scripts/facebook.js"],
                        target: { tabId: tab.id },
                    });
                }
            });
        // 等待
        // TODO:增加功能。收到tw完成单个词汇消息后进行下一词汇。
        await waitTime(1000 * 60)
    }

    // 通过注入方式导出数据
    var storage = await chrome.storage.local.get('facebook_data')
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: sendExportCsv,
        args: [JSON.stringify(storage['facebook_data'])]
    })
}
// 任务状态提示
function setStatus(status) {
    document.getElementById('status').innerHTML = status
}
function waitTime(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
// 注入脚本设置是否允许开始任务
async function startTask(status) {
    // true/false 允许开始任务/不允许开始任务
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            await chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: sendStartTask,
                args: [JSON.stringify(status)]
            })
            resolve()
        })
    })
}
// 检测认证和关键词上传。设置process btn状态
function isReadied() {
    if (authorized && updated_keywords) {
        var processes = document.getElementsByClassName('process')
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0].url.includes('instagram')) {
                processes[0].classList.remove('disable')
                processes[1].classList.add('disable')
                processes[2].classList.add('disable')
            } else if (tabs[0].url.includes('twitter')) {
                processes[0].classList.add('disable')
                processes[1].classList.remove('disable')
                processes[2].classList.add('disable')
            } else if (tabs[0].url.includes('facebook')) {
                processes[0].classList.add('disable')
                processes[1].classList.add('disable')
                processes[2].classList.remove('disable')
            } else {
                setStatus('请前往ins/twitter/facebook使用插件！')
            }
        })
    }
}

// 注入函数 sendXXXX
function sendKeywords(data) {
    // 混淆标记
    // 1==1==2==3==4==5
    // 源代码
    window.localStorage.setItem('dfs_pluging_keywords', data)
}
function sendStartTask(flag) {
    // 混淆标记
    // 1==1==2==3==4==5
    // 源代码
    window.localStorage.setItem('dfs_pluging_flag', flag)
}
function sendExportCsv(data) {
    // 混淆标记
    // 1==1==2==3==4==5
    // 源代码
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
    chrome.runtime.sendMessage({ type: 'task_end', data: 'OK' })
}
init()

chrome.runtime.onInstalled.addListener(async e => {
    await startTask(false)
})