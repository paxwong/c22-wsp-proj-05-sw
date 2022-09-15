// function to input the contract details into inner HTML
// Get data from the form and display it

// async function displayContract() {
//     const res = await fetch("/order");
//     const contractData = await res.json();

//     let htmlStr = '';
//     for (let contract of contractData) {
//         htmlStr += ``
//     }
// }

const contractData = document.getElementById("contract-form");
contractData.addEventListener("submit", async function (e) {
    e.preventDefault();

    // const contractObject = {};
    const contractObject = {
        name: contractData["targetName"].value,
        age: contractData["age"].value,
        nationality: contractData["nationality"].value,
        location: contractData["location"].value,
        missionDescription: contractData["mission-description"].value,
        bounty: contractData["bounty"].value,

    };

    // console.log(contractObject);

    const res = await fetch('/order', {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset = utf-8",
        },
        body: JSON.stringify(contractObject)
    })
    // const contractContent = await res.json();
    // if (res.ok) {

    // }

    // if (res.ok) {
    //     // function here
    //     for (let result of results) {

    //     }
    //     document.querySelector('#display-container').innerHTML += `
    //     <div>Target name : ${} </div>
    //     `

    // } else {

    // }
    // const result = await res.json()
    // document.querySelector('#').innerHTML = result
})


// formidable
