// function to input the contract details into inner HTML
// Get data from the form and display it

async function displayContract() {
    const res = await fetch("/order");
    const contractData = await res.json();

    let htmlStr = ``;
    for (const )
}

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

    };

    // console.log(contractObject);

    const res = await fetch("/order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset = utf-8",
        },
        body: JSON.stringify(contractObject)
    })
    if (res.status === 200) {
        // function here
    }
    // const result = await res.json()
    // document.querySelector('#').innerHTML = result
})


