
async function getPresentJobs() {
    let data = await fetch('/memos/presentJobs')
    if (data.status === 401) {
        document.querySelector('.presentJobs').innerHTML = 'YOU HAVE NO ACCESS'
    }
    let jobs = await data.json()
    let html = ''

    for (let job of jobs.rows) {
        html += `
            <div class="contract-container">
                <div class="contract-profile">
                    <div class="target-picture"><img src="${job.photo}"></img></div>
                </div>
                <div class="target-details">
                    <li>
                        <div class="target-name">Name: ${job.name}</div>
                    </li>
                    <li>
                        <div class="target-age">Age: ${job.age}</div>
                    </li>
                    <li>
                        <div class="target-nationality">Nationality: ${job.nationality}</div>
                    </li>
                    <li>
                        <div class="target-location">Location: ${job.location}</div>
                    </li>
                    <li>
                        <div class="target-bounty">Bounty: ${job.bounty}</div>
                    </li>
                    <li>
                        <div class="description">Mission Description: ${job.description}</div>
                    </li>
                    <li>
                        <div class="remarks">Target Remark: ${job.remarks}</div>
                    </li>
                    <form class="submit-evidence">
                        <div class="evidence">
                            <label for="id"><input name="id" value="${job.id}"></label>
                            <label for="evidence"> Submit evidence for approval :
                                <input type="file" name="image" id="image" value="Choose file" />
                            </label>
                        </div>
                        <div class="submit-button">
                            <input type="submit" value="Submit" />
                        </div>
                    </form>
                </div>
            </div>
        `
    }

    const container = document.querySelector('.presentJobs')
    container.innerHTML = html
}

async function getCompletedJobs() {
    let data = await fetch('/memos/completedJobs')
    let jobs = await data.json()
    let html = ""

    for (let job of jobs.rows) {
        // console.log(data["bounty"])
        html += `
        <div class="contract-container">
        <div class="contract-profile">
            <div class="target-picture"><img src="${job.photo}"></img></div>
        </div>
        <div class="target-details">
            <li>
                <div class="target-name">Name: ${job.name}</div>
            </li>
            <li>
                <div class="target-age">Age: ${job.age}</div>
            </li>
            <li>
                <div class="target-nationality">Nationality: ${job.nationality}</div>
            </li>
            <li>
                <div class="target-location">Location: ${job.location}</div>
            </li>
            <li>
                <div class="target-bounty">Bounty: ${job.bounty}</div>
            </li>
            <li>
                <div class="description">Mission Description: ${job.description}</div>
            </li>
            <li>
                <div class="remarks">Target Remark: ${job.remarks}</div>
            </li>
        </div>
    </div>
            `

    }

    const container = document.querySelector('.completedJobs')
    container.innerHTML = html
}


async function submitEvidence() {
    let evidences = document.querySelectorAll('.submit-evidence')
    for (let evidence of evidences) {
        evidence.addEventListener('submit', async (event) => {
            event.preventDefault();

            const form = event.target
            const formData = new FormData(form)
            console.log(formData)        
            const res = await fetch('/memos/evidences', {
                method: "POST",
                body: formData,
            })
            if (res.ok) {
                alert(`Successfully uploaded evidence, pending admin's approval`)
            }
        }
        )
    }
}




async function init() {
    await getCompletedJobs()
    await getPresentJobs()
    await submitEvidence()
}

init()