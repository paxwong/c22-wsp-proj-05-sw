// let bob = document.querySelector('.man')
let startButton = document.querySelector('.start-button');
let main = document.querySelector('.main-container');
let end = document.querySelector('.end');
let hidden = document.querySelector('.killed-bob-container');
let killedBobText = document.querySelector('.killed-bob');
let score = document.querySelector('#score');

//https://cms.tecky.io/course/map-v22/WSP007?p=03-ajax.md
window.onload = (event) => {
    refreshCounter()
}

startButton.addEventListener('click', function () {
    createBob()
})

function createBob() {
    console.log()
    const newBob = document.createElement('img')
    newBob.className = `bobRun`
    newBob.style.animationDuration = '10s'
    newBob.style.top = `${Math.random() * 80}vh`
    newBob.src = './bobrun.gif'
    main.insertBefore(newBob, end)
    setTimeout(() => {
        newBob.parentNode.removeChild(newBob)
    }, 10000)

    newBob.addEventListener('click', async function () {

        let positionX = newBob.getBoundingClientRect().x
        let positionY = newBob.getBoundingClientRect().y
        newBob.parentNode.removeChild(newBob)
        const dieBob = document.createElement('img')
        dieBob.className = `dieBob`
        dieBob.style.top = `${positionY}px`
        dieBob.style.left = `${positionX}px`
        dieBob.src = await switchImage()
        main.insertBefore(dieBob, end)
        setTimeout(() => {
            dieBob.parentNode.removeChild(dieBob)
        }, 8000)

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
        if (res.ok) { refreshCounter() }
    })
}


async function refreshCounter() {
    let result = await fetch('/counter')
    let counter = await result.json()
    score.textContent = counter
}


async function switchImage() {
    const res = await fetch(
      'http://localhost:8080/bobdie.gif',
    )
    const result = await res.blob()
    const objectURL = URL.createObjectURL(result)
    return objectURL
  }