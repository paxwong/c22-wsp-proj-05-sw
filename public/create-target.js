
const contractData = document.querySelector("#contract-form");
contractData.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!e.target.targetName.value) {
        alert('Missing information')
        return
    }
    const checkName = await fetch('memos/targetList?inputName=' + e.target.targetName.value)
    if (!checkName.ok) {
        alert('This target name already exists')
        return
    }

    if (checkName.ok) {
        const form = e.target
        const formData = new FormData(form)
        const res = await fetch('/memos/target', {
            method: "POST",
            body: formData,
        })
        const result = await res.json()
        console.log('form result', result)
        alert('Target uploaded successfully, please create order')
        location.replace('/create-contract.html')
    }
})
