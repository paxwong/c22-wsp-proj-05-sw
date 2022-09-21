
window.onload = (async function () {
    await checkSession()
})

async function init() {
    await getData()
    await formAddEventListener()
    await getEvidence()
    await evidenceAddEventListener()
}

init()

async function logout() {
    const logout = document.querySelector('.logout');
    logout.addEventListener('click', async function (event) {
        event.preventDefault();
        const res = await fetch('/logout', {
            method: 'DELETE',
        })
        if (res.ok) {
            // alert('Logout successfully')
            location.replace('http://localhost:8080/index.html')
        }
    })
}

logout()

function openForm() {
    document.querySelector("#wallet-login").style.display = "block";
}




function displayMessage(msg) {
    const div = document.createElement("div")
    div.textContent = msg
    document.querySelector(".chat-messages").append(div)

}


function disconnectAll() {
    socket.emit('disconnectAll')
}


function openChatBubble() {
    let element = document.getElementById("chat-bubble");
    element.classList.toggle("open")
}
// --> chatroom //



async function checkSession() {
    let session = await fetch('/session')
    session.json().then(function (data) {
        if (!data.user) {
            let bubble = document.querySelector('.chatchatchat')
            bubble.parentNode.removeChild(bubble)
        }
        if (data.user) {
            document.querySelector('.chatchatchat').innerHTML = `
      <div id="chat-bubble">
      <div class="chat-container">
        <div class="chat-header">
          <div class="user-avatar" onclick="openChatBubble()">
            <div class="img-container">
              <img src="https://source.unsplash.com/random/35x35">
            </div>
            <div class="user-status-info">
              <div>Chatroom</div>
              <p>Active now</p>
            </div>
          </div>

          <a href="#" onclick="openChatBubble()">
            <img src="./icons/close.svg">
          </a>
          </nav>
        </div>
      </div>

      <div class="chat-body">
        <div class="sender-other">
          <div class="chat-messages"></div>
        </div>

        <div class="chat-form-container">
          <form id="chat-form">
            <input name="message" id="msg" type="text" placeholder="Type a message..." required autocomplete="off" />
            <button class="btn" type="submit"><i class="fas fa-paper-plane"></i></button>
          </form>
        </div>
      </div>
    </div>
  </div>
  </div>`
        }

        const messageData = document.getElementById("chat-form");

        messageData.addEventListener("submit", async function (e) {
            e.preventDefault();
            //   console.log("ready to send to server")
            // const contractObject = {};
            const form = e.target
            const messageObject = {}
            messageObject.message = messageData.message.value;
            console.log(messageObject)
            form.reset()

            const res = await fetch("/user/admin/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset = utf-8",
                },
                body: JSON.stringify(messageObject)
            })
            const content = await res.json();
            //   console.log(content + "message back on earth")
            if (res.ok) {
                // displayMessage( messageObject.message)
            }

        })
    })
}
async function getEvidence() {
    let results = await fetch ('/memos/evidences')
    if (!results.ok){
        document.querySelector('.pendingEvidences').innerHTML = 'UNAUTHORISED'
        return
    }
    let datas = await results.json()
    let html = ''
    for (let data of datas.rows) {
        html += `
        <div class="contract-container">
                <div class="contract-profile">
                    <div class="target-picture"><img src="/${data.target_photo}"></img></div>
                </div>
                <div class="target-details">
                    <li>
                        <div class="target-name">Name: ${data.name}</div>
                    </li>
                    <li>
                        <div class="target-age">Age: ${data.age}</div>
                    </li>
                    <li>
                        <div class="target-nationality">Nationality: ${data.nationality}</div>
                    </li>
                    <li>
                        <div class="target-location">Location: ${data.location}</div>
                    </li>
                    <li>
                        <div class="target-bounty">Bounty: ${data.bounty}</div>
                    </li>
                    <li>
                        <div class="description">Mission Description: ${data.description}</div>
                    </li>
                    <li>
                        <div class="remarks">Target Remark: ${data.remarks}</div>
                    </li>
                    <form class="evidence-decision-form">
                        <label for="id"><input name="killer" value="${data.killer_id}"></label>
                        <label for="id"><input name="id" value="${data.evidence_id}"></label>
                        <label for="decision" value="123">Status</label>
                        <select name="decision" id="status">
                            <option value="approved">Approve</option>
                            <option value="pending">Reject</option>
                        </select>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
                <div class="contract-profile">
                <div class="target-picture"><img src="/${data.evidence_photo}"></img></div>
            </div>
            </div>`
    }
    const container = document.querySelector('.pendingEvidences')
    container.innerHTML = html
}

async function getData() {
    let clientData = await fetch('/memos/admin-order')
    if (!clientData.ok){
        document.querySelector('.container').innerHTML = 'UNAUTHORISED'
        return
    }
    let datas = await clientData.json()
    let html = ""

    for (let data of datas.rows) {
        // console.log(data["bounty"])
        html += `
            <div class="contract-container">
                <div class="contract-profile">
                    <div class="target-picture"><img src="/${data.photo}"></img></div>
                </div>
                <div class="target-details">
                    <li>
                        <div class="target-name">Name: ${data.name}</div>
                    </li>
                    <li>
                        <div class="target-age">Age: ${data.age}</div>
                    </li>
                    <li>
                        <div class="target-nationality">Nationality: ${data.nationality}</div>
                    </li>
                    <li>
                        <div class="target-location">Location: ${data.location}</div>
                    </li>
                    <li>
                        <div class="target-bounty">Bounty: ${data.bounty}</div>
                    </li>
                    <li>
                        <div class="description">Mission Description: ${data.description}</div>
                    </li>
                    <li>
                        <div class="remarks">Target Remark: ${data.remarks}</div>
                    </li>
                    <form class="decision-form">
                        <label for="id"><input name="id" value="${data.id}"></label>
                        <label for="decision" value="123">Status</label>
                        <select name="decision" id="status">
                            <option value="approved">Approve</option>
                            <option value="rejected">Reject</option>
                        </select>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        `

    }

    const container = document.querySelector('.container')
    container.innerHTML = html
}




async function evidenceAddEventListener() {
    let evidences = document.querySelectorAll('.evidence-decision-form')
    for (let evidence of evidences) {
        evidence.addEventListener('submit', async (event) => {
            event.preventDefault();
            const killer = event.target.killer.value
            const id = event.target.id.value;
            const status = event.target.decision.value;
            // console.log(id, status)
            const res = await fetch('/memos/evidence-decision', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id,
                    status,
                    killer
                })
            })
            if (res.ok) {
                init()
            }
        }
        )
    }
}

async function formAddEventListener() {
    let decisions = document.querySelectorAll('.decision-form')
    for (let decision of decisions) {
        decision.addEventListener('submit', async (event) => {
            event.preventDefault();
            const id = event.target.id.value;
            const status = event.target.decision.value;
            // console.log(id, status)
            const res = await fetch('/decision', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id,
                    status
                })
            })
            if (res.ok) {
                init()
            }
        }
        )
    }
}





