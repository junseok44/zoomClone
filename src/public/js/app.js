const socket = io();

const roomContainer = document.querySelector("#welcome");
const roomForm = roomContainer.querySelector("form");
const chatContainer = document.querySelector("#chatContainer");
const chatList = document.querySelector("#chatList");
const roomTitle = document.querySelector("#roomTitle");
const chatForm = chatContainer.querySelector("form");

let roomName;

chatContainer.hidden = true;

function handleroomSubmit(event) {
  event.preventDefault();
  const roomInput = roomForm.elements[0];
  const roomNickname = roomForm.elements[1];
  socket.emit(
    "room",
    { roomName: roomInput.value, nickname: roomNickname.value },
    handleEnd
  );
  roomName = roomInput.value;
  roomInput.value = "";
  roomContainer.hidden = true;
  chatContainer.hidden = false;
}

function handleEnd() {
  roomTitle.innerText = roomName;
}

function handlecreateChat(event) {
  event.preventDefault();
  const chatInput = chatForm.elements[0];
  socket.emit("chat", chatInput.value, createMessage);
  chatInput.value = "";
}

roomForm.addEventListener("submit", handleroomSubmit);
chatForm.addEventListener("submit", handlecreateChat);

function createMessage(message) {
  const li = document.createElement("li");
  li.innerText = message;
  chatList.appendChild(li);
}

socket.on("addmessage", (chat) => {
  createMessage(chat);
});
