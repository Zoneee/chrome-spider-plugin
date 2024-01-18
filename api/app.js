const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs')
const port = 3000;


let authorizations = []; // 保存文件内容的变量

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// 读取文件内容的异步函数
function readAuthorizationFile() {
    try {
        var fileContent = fs.readFileSync('./tokens.txt', 'utf-8');
        authorizations = fileContent.split('\r\n')
    } catch (error) {
        console.error('Error reading file:', error);
    }
}

// 初始化时调用读取文件内容的函数
readAuthorizationFile();


// 提供 public 文件夹中的静态文件
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('Home')
})

// 根路径返回 hello.js 文件内容
app.get('/hello', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'hello.js'));
});

app.all('/authorize/:token', (req, res) => {
    const token = req.params.token;
    console.log(token);
    if (authorizations.includes(token)) {
        res.send('OK')
    } else {
        res.status(403).send('Forbidden')
    }
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
