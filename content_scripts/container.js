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
    title.innerHTML = 'FB'
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
}

function importKeyWords(file) {
    console.log('import');

    var reader = new FileReader();

    reader.onload = function (event) {
        // 读取完成后的回调，文件内容在 event.target.result 中
        var fileContent = event.target.result;
        console.log(fileContent);
        alert('文件已导入！')
    };

    // 以文本形式读取文件内容
    reader.readAsText(file);
}
function process() {
    console.log('process');

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
    var mouseMoveEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
        // clientX: 135,
        // clientY: 188,
    });
    targetElement.dispatchEvent(mouseMoveEvent);
    setTimeout(() => {
        targetElement = document.querySelector('input[placeholder="搜索"]')
            || document.querySelector('input[placeholder="search"]')
        // targetElement.dispatchEvent(mouseMoveEvent);
        targetElement.value = 'cat'
    }, 3000);

    // var event = new MouseEvent('mousemove', {
    //     clientX: 135,
    //     clientY: 188
    // });
    // document.dispatchEvent(event);
    // event = new MouseEvent('click', {
    //     bubbles: true,
    //     cancelable: true,
    //     view: window,
    // })
    // document.dispatchEvent(event);
    // event = new MouseEvent('mousemove', {
    //     clientX: 194,
    //     clientY: 108
    // });

    // var inputElement = document.querySelector('input[placeholder="搜索"]') ||
    //     document.querySelector('input[placeholder="search"]');
    // inputElement.innerHTML = 'xxxx'
}

initContainer()
