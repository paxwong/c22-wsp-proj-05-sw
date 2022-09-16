
const contractData = document.querySelector("#contract-form");
contractData.addEventListener("submit", async function (e) {
    console.log(contractData);

    e.preventDefault();
    const form = e.target
    const formData = new FormData()


    formData.append('targetName', form.targetName.value)
    formData.append('bounty', form.bounty.value)
    formData.append('missionDescription', form.missionDescription.value)
    formData.append('image', form.image.files[0])

    // formData.append('text', content)
    // formData.append('image', file)

    console.log(formData);

    const res = await fetch('/memos/order', {
        method: "POST",


        body: formData,
    })
    const result = await res.json()
    console.log('form result', result)


})


// <form class="decision-form">
// <label for="id"><input name="id" value="${data.id}"></label>
// <label for="decision" value="123">Status</label>
// <select name="decision" id="status">
//     <option value="approved">Approve</option>
//     <option value="rejected">Reject</option>
// </select>
// <input type="submit" value="Submit" />
// </form>
