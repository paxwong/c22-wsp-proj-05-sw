// let bob = document.querySelector('.man')
let startButton = document.querySelector('.start-button');
let main = document.querySelector('.main-container');
let end = document.querySelector('.end');
let hidden = document.querySelector('.killed-bob-container');
let killedBobText = document.querySelector('.killed-bob');
let score = document.querySelector('#score');

window.onload = (event) => {
    refreshCounter()
}

function createBob() {
    const newBob = document.createElement("img")
    newBob.style.top = `${Math.random() * 80}vh`
    newBob.style.animationDuration = '10s'
    newBob.src = './manwithname.gif'
    newBob.className = 'running-man'
    main.insertBefore(newBob, end)

    newBob.addEventListener('click', async function (event) {
        // bob.src = './bobdie.gif' //問james/dickson (lower priority)
        newBob.style.animationDuration = '0s'
        hidden.style.minHeight = '125px';
        hidden.style.maxHeight = '125px';
        killedBobText.style.fontSize = '2rem';
        let counter = 1
        const res = await fetch('/counter', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                counter
            })
        }
        )
        if (res.ok) {
            refreshCounter()
        }
    })
}

async function refreshCounter() {
    let result = await fetch('/counter')
    let counter = await result.json()
    score.textContent = counter
}

startButton.addEventListener('click', function () {
    createBob()
})
