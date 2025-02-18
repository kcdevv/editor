import WebSocket, { WebSocketServer } from "ws";

interface User {
    socket: WebSocket;
    room: string;
    name: string;
}

const users: User[] = []; // {socket, room, name}

const wss = new WebSocketServer({ port: 8080 });
wss.on("connection", (ws) => {
  ws.on("message", (message: string) => {
    const messagedata = JSON.parse(message);
    if (messagedata.type === "join") {
      users.push({
        socket: ws,
        room: messagedata.room,
        name: messagedata.name,
      });
      ws.send(
        JSON.stringify({
          type: "joined",
          room: messagedata.room,
          name: messagedata.name,
        })
      );
    }
    if (messagedata.type === "code") {
      users.forEach((user) => {
        if (user.room === messagedata.room) {
          user.socket.send(
            JSON.stringify({
              type: "message",
              room: messagedata.room,
              name: messagedata.name,
              message: messagedata.message,
            })
          );
        }
      });
    }
  });
});
