import WebSocket, { WebSocketServer } from "ws";

interface User {
  socket: WebSocket;
  room: string;
  name: string;
}

interface Room {
  code: string;
  output: string;
}

const users: User[] = [];
const rooms: Record<string, Room> = {};

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  ws.on("message", (message: string) => {
    const messageData = JSON.parse(message);

    if (messageData.type === "join") {
      users.push({
        socket: ws,
        room: messageData.room,
        name: messageData.name,
      });
      
      if (!rooms[messageData.room]) {
        rooms[messageData.room] = { code: "", output: "" };
      }
      console.log(messageData);
      
      ws.send(
        JSON.stringify({
          type: "joined",
          room: messageData.room,
          name: messageData.name,
          code: rooms[messageData.room].code,
          output: rooms[messageData.room].output,
        })
      );
    }
    
    if (messageData.type === "code") {
      if (rooms[messageData.room]) {
        rooms[messageData.room].code = messageData.message;
        rooms[messageData.room].output = messageData.output;
      }

      console.log(messageData)
      
      users.forEach((user) => {
        if (user.room === messageData.room) {
          user.socket.send(
            JSON.stringify({
              type: "message",
              room: messageData.room,
              name: messageData.name,
              message: messageData.message,
              output: messageData.output,
            })
          );
        }
      });
    }
  });

  ws.on("close", () => {
    const index = users.findIndex((user) => user.socket === ws);
    if (index !== -1) {
      users.splice(index, 1);
    }
  });
});
