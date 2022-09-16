
const contractData = document.getElementById("contract-form");
contractData.addEventListener("submit", async function (e) {
    console.log(contractData);

    e.preventDefault();
    const form = e.target
    const formData = new FormData()


    formData.append('targetName', form.targetName.value)
    formData.append('age', form.age.value)
    formData.append('nationality', form.nationality.value)
    formData.append('location', form.location.value)
    formData.append('missionDescription', form.missionDescription.value)
    formData.append('image', form.image.files[0])

    // formData.append('text', content)
    // formData.append('image', file)

    console.log(formData);

    const res = await fetch('/order', {
        method: "POST",
        // headers: {
        //     "Content-Type": "application/json; charset = utf-8",
        // },
        // body: JSON.stringify(contractObject)
        body: formData,
    })
    const result = await res.json()
    document.querySelector('#contract-form').innerHTML = result
})



// formidable
