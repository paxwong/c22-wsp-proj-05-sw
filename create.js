// Get data from the form and display it
// async function displayContract() {
//     const res = await fetch("/");
//     const contractData = await res.json();

//     let htmlStr = ``;
//     for (const )
// }

const contractData = document.getElementById("contract-form");
contractData.addEventListener("submit", function (e) {
    e.preventDefault();

    const contractObject = {
        name: contractData["targetName"].value,
        age: contractData["age"].value,
        nationality: contractData["nationality"].value,
        location: contractData["location"].value,
        missionDescription: contractData["mission-description"].value,

    };

    console.log(contractObject);

    const res = await fetch("/", {
        method: "POST",
        headers: {
            contentType: "application/json"
        }
    })

})


