const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

let users = {};

io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("join", (username) => {
        users[socket.id] = username;
        io.emit("message", username + " دخل الشات 🔥");
    });

    socket.on("message", (msg) => {
        const username = users[socket.id];
        io.emit("message", username + ": " + msg);
    });

    socket.on("disconnect", () => {
        const username = users[socket.id];
        if (username) {
            io.emit("message", username + " خرج ❌");
        }
        delete users[socket.id];
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
