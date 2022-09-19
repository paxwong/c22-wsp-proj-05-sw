const socket = io.connect();
let xButton = document.querySelector('.bi-x-lg');
let connectButton = document.querySelector('.metamask')
let userinfo = document.querySelector('.bi-person-bounding-box')

let account = null;
let signature = null;
let message = "Signing message in wallet";

// async function getData() {
//     let res2 = await fetch('/order')

//     let datas = await res2.json()
//     console.log(req.session.user)

// if(req.session.user.account_type === "")

// let html = ""

// for (let data of datas) {
//     html += `
//     <div class="contract-container">
//         <div class="contract-profile">
//             <div class="target-picture"></div>
//         </div>
//         <div class="target-details">
//             <li>
//                 <div class="target-name">Name: ${data.name}</div>
//             </li>
//             <li>
//                 <div class="target-age">Age: ${data.age}</div>
//             </li>
//             <li>
//                 <div class="target-nationality">Nationality: ${data.nationality}</div>
//             </li>
//             <li>
//                 <div class="target-location">Location: ${data.location}</div>
//             </li>
//             <li>
//                 <div class="description">Mission description: ${data.description}</div>
//             </li>
//         </div>
//     </div>
//     `

// }

// const container = document.querySelector('.container')
// container.innerHTML = html

// }
// getData()



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
    const res = await fetch('/userinfo', {
        method: 'POST',
    })
    if (res.ok) {
        location.replace('/userinformation.html') //have session
    }
    if (!res.ok) {
        location.replace('/loginsignup.html') //no session
    }
})