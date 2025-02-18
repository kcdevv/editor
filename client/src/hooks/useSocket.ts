import { useEffect, useState } from "react";

export function useSocket() {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    setWs(socket);

    socket.onmessage = (message) => {
      console.log(`${message.data}`);
    };

    return () => socket.close();
  }, []);

  return ws;
}
