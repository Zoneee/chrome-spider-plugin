async function process() {
    // TODO:测试
    var data = [
        // ['风险帐号ID', '所属平台', '主页链接'],
    ]
    // 向下滚动五个屏幕
    // 一个屏幕24个用户
    for (let i = 1; i < 6; i++) {
        // 每滚动一次滚动距离增加一个屏幕
        var windowHeight = window.innerHeight;
        var currentScrollY = window.scrollY;

        // 计算向下滚动的距离，例如滚动到下一个屏幕
        var scrollDistance = windowHeight * i;

        window.scrollBy(0, scrollDistance);
        await waitTime(5000)
    }

    // 保存数据
    var labs = document.querySelectorAll('div[data-testid="cellInnerDiv"] a[class="css-175oi2r r-1wbh5a2 r-dnmrzs r-1ny4l3l r-1loqt21"]')
    // https://twitter.com/ShouldHaveCat
    var result = [...labs].map(s => {
        return [s.innerText, 'twitter', `https://twitter.com/${s.innerText}`]
    })
    data = data.concat(result)
    await waitTime(2000)
    chrome.runtime.sendMessage({ type: 'twitter_data', data: data })
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

console.log('twitter 已注入');
if (document.URL.includes('twitter')) {
    debugger
    var flag = JSON.parse(window.localStorage.getItem('dfs_pluging_flag'))
    console.log(`dfs_pluging task check: ${flag}`);
    if (flag) {
        process()
    }
}
