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
            location.replace('http://localhost:8080/index.html')
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
    const res = await fetch('/session')
    res.json().then(function (data) {
        if (!data.user) {
            location.replace('/loginsignup.html') //no session
            return
        }
        if (data.user.account_type === 'admin') {
            location.replace('/admin.html')
            return
        }
        if (data.user) {
            location.replace('/userinformation.html') //have session
            return
        }
    })
})


// --> chatroom //
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
// --> chatroom //

window.onload = (function () {
    checkSession()
})

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