async function getData() {
    // let res2 = await fetch('/order')

    // let datas = await res2.json()

    let clientData = await fetch('/memos/clients-order')
    let datas = await clientData.json()
    // if (datas.status === 'pending') {
    //     console.log(`your contracts ${datas.name}`)
    //     return
    // }
    console.log(datas.rows)

    // let html = ""

    // const container = document.querySelector('.container')

    for (let data of datas.rows) {


        console.log(data.id)



    }
    // console.log(datas.status)


    // console.log(req.session.user)
    // let html = ""


    // if (req.session.user.account_type === "client") {

    // }



    // else if (req.session.user.account_type === "killer") {

    // } else if (req.session.user.account_type === "admin" && ) {

    // }


    // function getContractData() {
    //     for (let data of datas) {
    //         html += `
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

    //     }

    //     const container = document.querySelector('.container')
    //     container.innerHTML = html
    // }


}
getData()
