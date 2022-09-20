
async function getData() {

    let clientData = await fetch('/memos/admin-order')
    let datas = await clientData.json()
    // console.log(datas.rows[0]["bounty"])
    let html = ""

    for (let data of datas.rows) {
        // console.log(data["bounty"])
        html += `
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
                        <div class="target-bounty">Bounty: ${data.bounty}</div>
                    </li>
                    <li>
                        <div class="description">Mission Description: ${data.description}</div>
                    </li>
                    <li>
                        <div class="remarks">Target Remark: ${data.remarks}</div>
                    </li>
                </div>
            </div>
        `

    }

    const container = document.querySelector('.container')
    container.innerHTML = html
}
getData()
