const socket = io.connect();
let xButton = document.querySelector('.bi-x-lg');
let connectButton = document.querySelector('.metamask')
let userinfo = document.querySelector('.bi-person-bounding-box')

let account = null;
let signature = null;
let message = "Signing message in wallet";

async function logout() {
    const logout = document.querySelector('.logout');
    logout.addEventListener('click', async function (event) {
        event.preventDefault();
        const res = await fetch('/logout', {
            method: 'DELETE',
        })
        if (res.ok) {
            // alert('Logout successfully')
            location.replace('/index.html')
        }
    })
}

logout()

function openForm() {
    document.querySelector("#wallet-login").style.display = "block";
}

xButton.addEventListener('click', function () {
    document.querySelector("#wallet-login").style.display = "none"
})





let wallet = document.querySelector(".wallet");
wallet.addEventListener('click', async function () {
    // let PopDisplay = document.querySelector("#wallet-login").style.display
    if (document.querySelector("#wallet-login").style.display == "block") {
        document.querySelector("#wallet-login").style.display = "none"
    } else {
        document.querySelector("#wallet-login").style.display = "block"
    }
})


async function checkConnection() {
    if (window.ethereum) {
        await window.ethereum.send('eth_requestAccounts');
        window.web3 = new Web3(window.ethereum);

        let accounts = await web3.eth.getAccounts()
        account = accounts[0]
        document.querySelector('.wallet-address').textContent = account; //!!
        document.querySelector('.wallet-text').textContent = "Connected to"
    }
}

async function signMessage() {
    signature = await web3.eth.personal.sign(message, account);
    console.log("Signature: " + signature);
}

connectButton.addEventListener('click', function () {
    checkConnection();
    document.querySelector("#wallet-login").style.display = "none"
})


// signMessage()


userinfo.addEventListener('click', async function (event) {
    event.preventDefault();
    const res = await fetch('/userinfo', {
        method: 'POST',
    })
    if (res.ok) {
        location.replace('/userinformation.html')
        //have session
    }
    if (!res.ok) {
        location.replace('/loginsignup.html') //no session
    }
})

window.onload = function () {
    init()
    checkSession()
    getData()
}

async function init() {
    let result = await fetch('/userinformation')
    result.json().then(function (data) {
        console.log(data)
        document.querySelector('.welcome').innerHTML = `Hi, <span class="name-highlight">${data.username}</span> <br>
        Welcome to your account profile`
    })
}

async function getData() {
    // let res2 = await fetch('/order')
    // let datas = await res2.json()
    let userorders = await fetch('/memos/user-order')
    let datas = await userorders.json()
    let html = ""
    if (userorders.status === 401){
        alert('Please login first')
        location.replace('/loginsignup.html')
        return
    }
    if (userorders.ok){
        // console.log(datas)
    for (let data of datas.rows) {
        // console.log(data["bounty"])
        html += `
            <div class="contract-container">
                <div class="contract-profile">
                    <div class="target-picture"><img src="${data.photo}"></img></div>
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
                    <li>
                    <div class="${data.status}">${data.status}</div>
                    </li>
                </div>
            </div>
        `

    }

    const container = document.querySelector('.previous-cases')
    container.innerHTML = html
}
}
// chatroom

socket.on("private_msg", content => {
    //   console.log("message-data123: ", content)
    displayMessage(content)
    const html = document.querySelector('.chat-messages')
    html.innerHTML += `<div>${channel}: ${content}</div>`
    console.log(`${channel}: ${content}`)
    // always scroll to bottom
    let messageBody = document.querySelector('.chat-messages');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
})




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


// window.onload = (function () {
//     checkSession()
// })

async function checkSession() {
    let session = await fetch('/session')
    session.json().then(function (data) {
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
                let messageBody = document.querySelector('.chat-messages');
                messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
            }

        })
        }

        
    })
}
