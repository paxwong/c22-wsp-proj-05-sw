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

  // if (document.querySelector('#chatroom_playerName').innerHTML === from.username) {
  //   document.querySelector(
  //     "#message_display"
  //   ).innerHTML += `<div>${from.username}:${content}</div>`;
  //   document.querySelector('#message_display').scrollTop = document.querySelector('#message_display').scrollHeight
  // }
// });

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


////louie
// async function createChats() {
//   const chatsFormElement = document.querySelector('#message-form')
//   chatsFormElement.addEventListener('submit', async (e) => {
//     e.preventDefault()
//     const form = e.target
//     const content = form.chat.value
//     socket.emit('chat', ({ content, username, socketID }))
//     form.reset()
//   })
// }
// // createChats()
// socket.on('chat', ({ data, username }) => {
//   const html = document.querySelector('.chat-messages')
//   html.innerHTML += `<div>${username}: ${content}</div>`
//   console.log(`${userName}: ${content}`)
//   // always scroll to bottom
//   let messageBody = document.querySelector('#scroll');
//   messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
// })

  // const res = await fetch('/speak/:username', {
  //     method: "POST",
  //     headers: {
  //         "Content-Type": "application/json; charset = utf-8",
  //     },
  //     body: JSON.stringify(contractObject)
  // })
  // };

  // socket.emit("private_message", {
  //     content,
  //     to: toPlayer.id,
  //   });
  //   document.querySelector(
  //     "#message_display"
  //   ).innerHTML += `<div>${sender.username}:${content}</div>`;
  //   document.querySelector("#message_content").value = "";
  //   document.querySelector('#message_display').scrollTop = document.querySelector('#message_display').scrollHeight





// document.querySelector("#playerName").innerText = playerName;

// let toPlayer;
// let sender;


// socket.on('disconnectAll', () => {
//   window.location.href = '/chatroom.html'
// })

// socket.on("init_room_list", (roomList) => {
//   console.log("init_room_list = ", roomList);
//   w3IncludeHTML(() => {
//     initPlayerList(roomList);
//     socket.on("new_player", (newPlayer) => {
//       console.log("newPlayer found:", newPlayer);
//       document.querySelector(
//         "#playerList"
//       ).innerHTML += `<div id='player_${newPlayer.id}'>${newPlayer.username}<button type='button' data-username= "${newPlayer.username}"  data-player-id = "${newPlayer.id}" onclick='chat(this)'>Chat</button></div>`;
//     });

//     socket.on("player_left", (playerToLeave) => {
//       console.log("player is leaving:", playerToLeave);
//     //   document.querySelector("#player_" + playerToLeave.id).remove();
//       let chatRoomPlayerName = document.querySelector('#chatroom_playerName').innerHTML
//       console.log(chatRoomPlayerName);
//       console.log(playerToLeave.username);
//       if (chatRoomPlayerName === playerToLeave.username) {
//         document.querySelector(
//           "#message_display"
//         ).innerHTML += `<div>${playerToLeave.username}已離開</div>`;
//         document.querySelector('#chatroom > fieldset').disabled = true
//       }

//     });
// document
//   .querySelector("#chat-form")
//   .addEventListener("submit", sendMessage);
//   });
// });
// function initPlayerList(roomList) {
//   console.log("initPlayerList called");
//   let playerListContent = "";
//   roomList.forEach((player) => {
//     if (player.username == playerName) {
//       sender = {
//         id: player.id,
//         username: playerName,
//       };
//       playerListContent += `<div id='player_${player.id}'>${player.username} (me)</div>`;
//     } else {
//       playerListContent += `<div id='player_${player.id}'>${player.username}<button type='button' data-username= "${player.username}"  data-player-id = "${player.id}" onclick='chat(this)'>Chat</button></div>`;
//     }
//   });

//   document.querySelector("#playerList").innerHTML = playerListContent;
// }

// async function chat(e) {

//   toPlayer = {
//     id: e.getAttribute('data-player-id'),
//     username: e.getAttribute('data-username'),
//   };
//   document.querySelector("#chatroom_playerName").innerText =
//     e.getAttribute('data-username');
//   let privateMessages = await fetch("/private_message", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       toPlayer,
//       sender,
//     }),
//   });
//   privateMessages = await privateMessages.json();
//   document.querySelector("#message_display").innerHTML = "";
//   for (privateMessage of privateMessages) {
//     document.querySelector(
//       "#message_display"
//     ).innerHTML += `<div>${privateMessage.from.username}:${privateMessage.content}</div>`;
//     document.querySelector('#message_display').scrollTop = document.querySelector('#message_display').scrollHeight
//   }
//   document.querySelector('#chatroom > fieldset').disabled = false
//   $("#chatroom").slideDown();
// }

// function sendMessage(event) {
//   event.preventDefault();
//   console.log("sending message to :", toPlayer);
//   let content = document.querySelector("#message_content").value;

//   socket.emit("private_message", {
//     content,
//     to: toPlayer.id,
//   });
//   document.querySelector(
//     "#message_display"
//   ).innerHTML += `<div>${sender.username}:${content}</div>`;
//   document.querySelector("#message_content").value = "";
//   document.querySelector('#message_display').scrollTop = document.querySelector('#message_display').scrollHeight
// }


function disconnectAll() {
  socket.emit('disconnectAll')
}