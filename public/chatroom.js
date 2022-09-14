const socket = io.connect();
console.log("testing");

socket.on('private-msg',msg=>{
    alert(msg)
})
let content = document.querySelector("#chat-form").value;

document.querySelector("#chat-form").addEventListener("submit",(e)=> {
e.preventDefault();
// socket.emit("private_message", {
//     content,
//     to: toPlayer.id,
//   });
//   document.querySelector(
//     "#message_display"
//   ).innerHTML += `<div>${sender.username}:${content}</div>`;
//   document.querySelector("#message_content").value = "";
//   document.querySelector('#message_display').scrollTop = document.querySelector('#message_display').scrollHeight



})


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
socket.on("private_message", ({ content, from }) => {
  if (document.querySelector('#chatroom_playerName').innerHTML === from.username) {
    document.querySelector(
      "#message_display"
    ).innerHTML += `<div>${from.username}:${content}</div>`;
    document.querySelector('#message_display').scrollTop = document.querySelector('#message_display').scrollHeight
  }
});

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