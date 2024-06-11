const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs')
const port = 3000;

const btoa = (text) => {
    return Buffer.from(text, 'binary').toString('base64');
};


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
function encode(text) {
    // 将字符串转为bit数组
    function stringToBitArray(str) {
        const result = [];
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            const binaryString = charCode.toString(2).padStart(8, '0');
            result.push(...binaryString.split('').map(Number));
        }
        return result;
    }

    // 颠倒数组
    function reverseArray(arr) {
        return arr.reverse();
    }

    // 将bit数组转为base64
    function bitArrayToBase64(bitArray) {
        const binaryString = bitArray.join('');
        const byteCharacters = [];
        for (let i = 0; i < binaryString.length; i += 8) {
            byteCharacters.push(String.fromCharCode(parseInt(binaryString.substr(i, 8), 2)));
        }
        const byteString = byteCharacters.join('');
        return btoa(byteString);
    }

    // 生成随机的8位二进制字符串
    function generateRandomBinaryString(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += Math.round(Math.random());
        }
        return result;
    }

    // 生成 [min, max] 范围内的随机整数
    function getRandomIntInclusive(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var l_salt1 = getRandomIntInclusive(1, 9)
    var l_salt2 = getRandomIntInclusive(1, 9)
    const inputString = JSON.stringify({
        salt1: generateRandomBinaryString(l_salt1),
        authorized: text,
        salt2: generateRandomBinaryString(l_salt2)
    });
    const bitArray = stringToBitArray(inputString);
    const reversedArray = reverseArray(bitArray);
    const base64Output = bitArrayToBase64(reversedArray);
    return base64Output
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
        res.status(403).send(encode('Token undifined'))
    } else {
        // 判断token是否过期
        var expire = new Date(item.expire)
        var now = getNow()
        if (expire - now > 0) {
            res.send(encode(true))
        } else {
            res.status(403).send(encode('Token expired'))
        }
    }
})

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${port}`);
});
