const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let users = {};

app.use(express.static(__dirname));

io.on("connection", (socket) => {

  socket.on("join", (username) => {
    users[socket.id] = username;
    io.emit("users", Object.values(users));
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", {
      user: users[socket.id],
      msg
    });
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("users", Object.values(users));
  });

});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server running...");
});
