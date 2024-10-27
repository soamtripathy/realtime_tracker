const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const dotenv = require("dotenv");
// socket io setup
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

//ejs setup
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

try {
  io.on("connection", function (socket) {
    socket.on("send-location", function (data) {
      io.emit("receive-location", { id: socket.id, ...data });
    });
    socket.on("disconnect", function () {
      io.emit("user-disconnected", socket.id);
    });
  });
} catch (e) {
  console.error("SocketIO is not working, reason : ", e);
}

dotenv.config({
  path: "./.env",
});

app.get("/", (req, res) => {
  res.render("index");
});
const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log("App is running on port: ", port);
});
