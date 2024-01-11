var keywords = []
var data = [
    ['风险帐号ID', '所属平台', '主页链接'],
]

var g_status_info
// 网页右上角添加元素
function initContainer() {
    // 创建元素
    var container = document.createElement('div')
    var title = document.createElement('div')
    var btn_bar = document.createElement('div')
    var import_btn = document.createElement('input')
    var process_btn = document.createElement('div')
    var status_bar = document.createElement('div')
    var status_label = document.createElement('div')
    var status_info = document.createElement('div')
    // 添加样式
    container.classList.add('pluging-container')
    title.classList.add('title')
    title.innerHTML = 'INS'
    btn_bar.classList.add('btn-bar')
    import_btn.classList.add('btn')
    import_btn.classList.add('import')
    import_btn.type = 'file'
    process_btn.classList.add('btn')
    process_btn.classList.add('process')
    process_btn.textContent = '执行'
    status_bar.classList.add('status-bar')
    status_label.innerHTML = '状态：'
    status_info.classList.add('status')
    status_info.innerHTML = '待执行'
    // 添加事件
    import_btn.addEventListener('change', (e) => {
        // 处理文件选择事件
        var selectedFile = e.currentTarget.files[0];
        importKeyWords(selectedFile);
    })
    process_btn.addEventListener('click', () => {
        process()
    })
    // 添加元素
    // btn_bar.appendChild(import_btn)
    btn_bar.appendChild(process_btn)
    status_bar.appendChild(status_label)
    status_bar.appendChild(status_info)
    container.appendChild(title)
    container.appendChild(btn_bar)
    container.appendChild(import_btn)
    container.appendChild(status_bar)
    document.body.appendChild(container)
    // 全局变量
    g_status_info = status_info
}

function importKeyWords(file) {
    console.log('import');

    var reader = new FileReader();

    reader.onload = function (event) {
        // 读取完成后的回调，文件内容在 event.target.result 中
        var fileContent = event.target.result;
        console.log(fileContent);
        keywords = fileContent.split('\r\n')
        alert('文件已导入！')
        g_status_info.classList.remove('red')
        g_status_info.classList.add('green')
        g_status_info.innerHTML = '已导入'
    };

    // 以文本形式读取文件内容
    reader.readAsText(file);
    g_status_info.classList.add('red')
    g_status_info.innerHTML = '导入中'
}
async function process() {
    g_status_info.classList.remove('green')
    g_status_info.classList.add('red')
    g_status_info.innerHTML = '执行中！请勿操作！'
    alert('执行中！请勿操作！')
    data = [
        ['风险帐号ID', '所属平台', '主页链接'],
    ]
    // var targetElement = document.querySelector('#test')
    // var mouseMoveEvent = new MouseEvent('click', {
    //     bubbles: true,
    //     cancelable: true,
    //     view: window,
    //     // clientX: 135,
    //     // clientY: 188,
    // });
    // targetElement.dispatchEvent(mouseMoveEvent);


    var targetElement = document.querySelector('a[href="#"]')
    sendClick(targetElement)
    // setTimeout(() => {
    //     targetElement = document.querySelector('input[placeholder="搜索"]')
    //         || document.querySelector('input[placeholder="search"]')
    //     // targetElement.dispatchEvent(mouseMoveEvent);
    //     // targetElement.value = 'cat'
    //     sendClick(targetElement)
    //     sendKey(targetElement, 'cat')
    // }, 3000);

    for (let i = 0; i < keywords.length; i++) {
        const k = keywords[i];
        g_status_info.innerHTML = `正在执行：${k}`

        await waitTime(2000)
        targetElement = document.querySelector('input[placeholder="搜索"]')
            || document.querySelector('input[placeholder="search"]')
        sendClick(targetElement)
        sendKey(targetElement, k)
        await waitTime(5000)
        addData()
    }
    await waitTime(2000)
    exportCsv()
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

function addData() {
    var names = document.querySelectorAll('span[class*="x1lliihq x1plvlek xryxfnj x1n2onr6 x193iq5w xeuugli x1fj9vlw x13faqbe x1vvkbs x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x x1i0vuye xvs91rp x1s688f x5n08af x10wh9bi x1wdrske x8viiok x18hxmgj"]')
    var result = [...names].map(s => {
        return [s.innerText, 'ins', `https://www.instagram.com/${s.innerText}`]
    })
    data = data.concat(result)
}

function exportCsv() {
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
    g_status_info.innerHTML = `执行结束`
}

initContainer()
