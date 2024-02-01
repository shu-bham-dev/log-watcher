const express = require("express");
const http = require("http");
const fs = require("fs");
const tail = require("tail");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
  //   transports: ["websocket"],
});

const logFilePath = "./logger.log";

const tailStream = new tail.Tail(logFilePath);
io.on("connection", (socket) => {
  // Send last 10 lines to the new client
  const lastLines = getTailLines(logFilePath, 10);
  console.log(lastLines, "<<<<<<");
  socket.emit("initialData", lastLines);

  // Listen for file updates and broadcast to clients
  tailStream.on("line", (data) => {
    socket.emit("update", data);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    tailStream.unwatch();
  });
});

function getTailLines(filePath, linesCount) {
  const data = fs.readFileSync(filePath, "utf-8");
  const lines = data.split("\n");
  return lines.slice(Math.max(lines.length - linesCount, 0)).join("\n");
}

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
