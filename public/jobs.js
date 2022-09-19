async function getData() {
    let res2 = await fetch('/order')

    let datas = await res2.json()
    console.log(req.session.user)

    // if(req.session.user.account_type === "")

    // let html = ""

    // for (let data of datas) {
    //     html += `
    //     <div class="contract-container">
    //         <div class="contract-profile">
    //             <div class="target-picture"></div>
    //         </div>
    //         <div class="target-details">
    //             <li>
    //                 <div class="target-name">Name: ${data.name}</div>
    //             </li>
    //             <li>
    //                 <div class="target-age">Age: ${data.age}</div>
    //             </li>
    //             <li>
    //                 <div class="target-nationality">Nationality: ${data.nationality}</div>
    //             </li>
    //             <li>
    //                 <div class="target-location">Location: ${data.location}</div>
    //             </li>
    //             <li>
    //                 <div class="description">Mission description: ${data.description}</div>
    //             </li>
    //         </div>
    //     </div>
    //     `

    // }

    // const container = document.querySelector('.container')
    // container.innerHTML = html

}
getData()
