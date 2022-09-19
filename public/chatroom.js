const socket = io.connect();
console.log("testing");

socket.on("private_msg", content => {
  console.log("message-data123: ", content)
  displayMessage(content)
  const html = document.querySelector('.chat-messages')
  html.innerHTML += `<div>${channel}: ${content}</div>`
  console.log(`${channel}: ${content}`)
  // always scroll to bottom
  let messageBody = document.querySelector('.chat-messages');
  messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
})


const messageData = document.getElementById("chat-form");

messageData.addEventListener("submit", async function (e) {
  e.preventDefault();
  console.log("ready to send to server")
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
  console.log(content + "message back on earth")
  if (res.ok) {
    // displayMessage( messageObject.message)
  }

})

function displayMessage(msg) {
  const div = document.createElement("div")
  div.textContent = msg
  document.querySelector(".chat-messages").append(div)
  
}


function disconnectAll() {
  socket.emit('disconnectAll')
}