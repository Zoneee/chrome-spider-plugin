
function ins() {
    console.log('ins');
    var btn = document.querySelector('.devsite-book-nav-toggle')
    console.log(btn);
}

function tw() {
    console.log('tw');
}

function fb() {
    console.log('fb');
}

document.querySelector('.ins-btn').addEventListener('click', async () => {
    ins()

})
document.querySelector('.tw-btn').addEventListener('click', async () => {
    tw()

})
document.querySelector('.fb-btn').addEventListener('click', async () => {
    fb()

})
console.log('111');
console.log(chrome);
