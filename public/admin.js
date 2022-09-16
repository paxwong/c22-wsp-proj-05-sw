const socket = io.connect();

async function getData() {
    let res2 = await fetch('/order')

    let datas = await res2.json()
    console.log(datas)
    let html = ""

    for (let data of datas) {
        html +=`
            <div class="contract-container">
                <div class="contract-profile">
                    <div class="target-picture"></div>
                </div>
                <div class="target-details">
                    <li>
                        <div class="target-name">Name: ${data.name}</div>
                    </li>
                    <li>
                        <div class="target-age">Age: ${data.age}</div>
                    </li>
                    <li>
                        <div class="target-nationality">Nationality: ${data.nationality}</div>
                    </li>
                    <li>
                        <div class="target-location">Location: ${data.location}</div>
                    </li>
                    <li>
                        <div class="description">Mission description: ${data.description}</div>
                    </li>
                    <form action="#">
                        <label for="id"><input value="${data.id}"></label>
                        <label for="status">Status</label>
                        <select name="decision" id="status">
                            <option value="approved">Approve</option>
                            <option value="rejected">Reject</option>
                        </select>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        `

    }

    const container = document.querySelector('.container')
    container.innerHTML = html

}
getData()



