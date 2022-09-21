
const contractData = document.querySelector("#contract-form");
contractData.addEventListener("submit", async function (e) {
    console.log(contractData);

    e.preventDefault();
    const form = e.target
    const formData = new FormData(form)


    // formData.append('targetName', form.targetName.value)
    // formData.append('bounty', form.bounty.value)
    // formData.append('missionDescription', form.missionDescription.value)
    // formData.append('image', form.image.files[0])

    // formData.append('text', content)
    // formData.append('image', file)

    console.log(formData);

    const res = await fetch('/memos/order', {
        method: "POST",
        body: formData,
    })
    const result = await res.json()
    console.log('form result', result)
    if (res.status === 401) {
        alert('Please login first')
        location.replace('/loginsignup.html')
        return
    }
    if (!res.ok) {
        alert('Please create target first')
        location.replace('/create-target.html')
        return
    }
    if (res.ok) {
        alert(`Order pending admin's approval`)
        location.replace('/userinformation.html')
        return
        // location.replace('/homepage.html')
    }
}
)


// submit redirection




// <form class="decision-form">
// <label for="id"><input name="id" value="${data.id}"></label>
// <label for="decision" value="123">Status</label>
// <select name="decision" id="status">
//     <option value="approved">Approve</option>
//     <option value="rejected">Reject</option>
// </select>
// <input type="submit" value="Submit" />
// </form>

async function loadPhoto() {
    let res = await fetch('/memos/targetList')
    if (res.ok) {
        let html = ``
        res.json().then(function (datas) {
            for (let data of datas) {
                html += `
                <option>${data.name}</option>
                `
            }
            document.querySelector('#chosen-target').innerHTML = html
            document.querySelector('#chosen-target').addEventListener('change', function () {
                for (let data of datas) {
                    if (document.querySelector('#chosen-target').value == data.name) {
                        if (data.photo === null) {
                            document.querySelector('.target-picture').innerHTML = `<img src="question-mark.png"></img>`

                        } else {
                        document.querySelector('.target-picture').innerHTML = `<img src="${data.photo}"></img>`
                    }}
                }
            })
        })
    }
}

loadPhoto()