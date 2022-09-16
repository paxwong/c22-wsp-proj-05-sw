
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
        // profile: 
    };

    // console.log(contractObject);

    const res = await fetch('/order', {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset = utf-8",
        },
        body: JSON.stringify(contractObject)
    })

})


// formidable
