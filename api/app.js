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

// 获取YYYY-MM-DD格式时间
function getNow() {
    var d = new Date()
    return new Date(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`)
}


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
    console.log(`receive: ${token}`);
    // 读取文件内容
    var fileContent = fs.readFileSync('./tokens.json', 'utf-8');
    var authorizations = JSON.parse(fileContent)
    // 判断token是否存在
    var item = authorizations.filter(s => s.token === token)[0]
    if (item === undefined || item === null) {
        res.status(403).send('Token undifined')
    } else {
        // 判断token是否过期
        var expire = new Date(item.expire)
        var now = getNow()
        if (expire - now > 0) {
            res.send('OK')
        } else {
            res.status(403).send('Token expired')
        }
    }
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
