async function process() {
    var data = [
        ['风险帐号ID', '所属平台', '主页链接'],
    ]
    var targetElement = document.querySelector('a[href="#"]')
    sendClick(targetElement)

    debugger
    var keywords = JSON.parse(window.localStorage.getItem('dsp_spider_keywords'))
    for (let i = 0; i < keywords.length; i++) {
        const k = keywords[i];

        // 等待数据加载
        await waitTime(2000)
        targetElement = document.querySelector('input[placeholder="搜索"]')
            || document.querySelector('input[placeholder="search"]')
        sendClick(targetElement)
        sendKey(targetElement, k)
        await waitTime(5000)

        // 保存数据
        var names = document.querySelectorAll('span[class*="x1lliihq x1plvlek xryxfnj x1n2onr6 x193iq5w xeuugli x1fj9vlw x13faqbe x1vvkbs x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x x1i0vuye xvs91rp x1s688f x5n08af x10wh9bi x1wdrske x8viiok x18hxmgj"]')
        var result = [...names].map(s => {
            return [s.innerText, 'ins', `https://www.instagram.com/${s.innerText}`]
        })
        data = data.concat(result)
    }
    await waitTime(2000)
    exportCsv(data)
    chrome.runtime.sendMessage({ type: 'ins_exported', data: 'OK' })
}

function waitTime(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

function sendClick(element) {
    var mouseMoveEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
        // clientX: 135,
        // clientY: 188,
    });
    element.dispatchEvent(mouseMoveEvent);
}

function sendKey(element, key) {
    console.log(`send:${key}`);
    element.value = key

    // 创建并触发输入事件
    var inputEvent = new Event('input', { bubbles: true });
    element.dispatchEvent(inputEvent);

    // // 创建并触发键盘事件
    // var enterEvent = new KeyboardEvent('keydown', {
    //     key: key,
    //     bubbles: true
    // });
    // element.dispatchEvent(enterEvent);

    // var enterEvent = new KeyboardEvent('keyup', {
    //     key: key,
    //     bubbles: true
    // });
    // element.dispatchEvent(enterEvent);
}

function sendEnter(element) {
    // 创建并触发键盘事件
    var enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true
    });
    element.dispatchEvent(enterEvent);

    var enterEvent = new KeyboardEvent('keyup', {
        key: 'Enter',
        bubbles: true
    });
    element.dispatchEvent(enterEvent);
}

function exportCsv(data) {
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

if (document.URL.includes('instagram')) {
    process()
}