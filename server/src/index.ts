import WebSocket, { WebSocketServer } from "ws";

interface Room {
  slug: string;
  code: string;
  output: string;
  sockets: WebSocket[];
}

const rooms: Room[] = [];

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  ws.on("message", (message: string) => {
    const messageData = JSON.parse(message);

    if (messageData.type === "join") {
      const room = rooms.find((room) => room.slug === messageData.room);
      if (!room) {
        rooms.push({
          slug: messageData.room,
          code: "",
          output: "",
          sockets: [ws],
        });
        ws.send(
          JSON.stringify({
            type: "joined",
            room: messageData.room,
            code: "",
            output: "",
          })
        );
      } else {
        room.sockets.push(ws);
        ws.send(
          JSON.stringify({
            type: "joined",
            room: room,
            code: room.code,
            output: room.output,
          })
        );
      }
    }

    if (messageData.type === "code") {
      // console.log(messageData);

      const room = rooms.find((room) => room.slug === messageData.room);
      if (room) {
        room.code = messageData.code;
        console.log(room);
        room.sockets.forEach((socket) => {
          if (socket !== ws) {
            socket.send(
              JSON.stringify({
                type: "code",
                code: messageData.code,
                output: messageData.output,
              })
            );
          }
        });
      }
    }
  });

  ws.on("close", () => {
    const room = rooms.find((room) => room.sockets.includes(ws));
    if (room) {
      room.sockets = room.sockets.filter((socket) => socket !== ws);
    }
  });
});
