
const contractData = document.querySelector("#contract-form");
contractData.addEventListener("submit", async function (e) {
    // console.log(contractData);
    if (!e.target.targetName) {
        alert('Missing information')
        return
    }
    e.preventDefault();
    const form = e.target
    const formData = new FormData(form)

    // formData.append('targetName', form.targetName.value)
    // formData.append('age', form.age.value)
    // formData.append('company', form.company.value)
    // formData.append('nationality', form.nationality.value)
    // formData.append('location', form.location.value)
    // formData.append('remarks', form.remarks.value)
    // formData.append('image', form.image.files[0])

    const res = await fetch('/memos/target', {
        method: "POST",
        body: formData,
    })
    const result = await res.json()
    console.log('form result', result)
    alert('Target uploaded successfully, please create order')
    location.replace('/create-contract.html')
    // const result = await res.json()
    // document.querySelector('#contract-form').innerHTML = result

})
