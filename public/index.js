// let bob = document.querySelector('.man')
let startButton = document.querySelector('.start-button');
let main = document.querySelector('.main-container');
let end = document.querySelector('.end');

function start() {
    document.querySelector('.man').style.animationDuration = '2s';
    document.querySelector('.man').style.top = `${Math.random()*80 - 15}vh`;
    document.querySelector('.man').className = 'running-man'
}

function createBob() {
    const newBob = document.createElement("img")
    newBob.style.top = `${Math.random()*80 - 15}vh`
    newBob.style.animationDuration = '2s'
    newBob.src = './manwithname.gif'
    newBob.className = 'running-man'
    main.insertBefore(newBob,end)
}

startButton.addEventListener('click', function() {
//     if (document.querySelector('.man')) {
//     start()
// }
createBob()
})