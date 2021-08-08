import express from "express";
import http from "http";
import SocketIo from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/public", express.static(__dirname + "/public"));

const handleListening = () => {
  console.log("listening to http://localhost:3000");
};

const httpServer = http.createServer(app);

const ioServer = SocketIo(httpServer);

httpServer.listen(3000, handleListening);

ioServer.on("connection", (socket) => {
  let currentRoom;
  socket.nickname = "anonymous";

  socket.onAny((event) => {
    console.log(`event : ${event} started`);
  });
  socket.on("room", (roomObject, done) => {
    if (roomObject.nickname) {
      socket.nickname = roomObject.nickname;
    }
    socket.join(roomObject.roomName);
    console.log(`${socket.nickname} joined to room ${roomObject.roomName}`);

    currentRoom = roomObject.roomName;

    socket
      .to(roomObject.roomName)
      .emit(
        "addmessage",
        `${socket.nickname} joined to room ${roomObject.roomName}`
      );

    done();
  });

  socket.on("disconnecting", () => {
    socket
      .to(currentRoom)
      .emit("addmessage", `${socket.nickname} leaved the room`);
  });

  socket.on("chat", (chat, done) => {
    socket.to(currentRoom).emit("addmessage", `${socket.nickname} : ${chat}`);
    done(`you : ${chat}`);
  });
});

/*
const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "anonymous";
  console.log("connected to the browser");
  socket.on("message", (message) => {
    const jsonMessage = JSON.parse(message.toString());
    switch (jsonMessage.type) {
      case "new_message":
        sockets.forEach(
          (aSocket) => aSocket.send(`${socket.nickname}: ${jsonMessage.text}`) // 내가 놓친것. 백엔드에서 아예 소켓정보를 보내버리면 프론트엔드에서 확인안해도 된다는점.
        );
        return;
      case "nickname":
        socket.nickname = jsonMessage.nickname; // 내가 실수한 부분.. ==가 아니라 =를 써줘야 함.
        socket.send(`your nickname has changed to ${socket.nickname}`);
        return;
    }
  });
});
*/
