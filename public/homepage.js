const socket = io.connect();

async function getData() {
    let res2 = await fetch("/order")

    let datas = await res2.json()

    let html = ""

    for (let data of datas) {
        html += `
            <div class="contract"> Target Name : ${data.name} </div>
        `

    }

    const container = document.querySelector('.container')
    container.innerHTML = html

}
getData() 