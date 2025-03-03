import { useEffect, useState } from "react";
import Code from "./components/Code";

const App = () => {
  const [code, setCode] = useState("");
  const [room, setRoom] = useState<null | string>(null);
  const [inputRoom, setInputRoom] = useState("");
  const [output, setOutput] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!room) return;
    
    const newSocket = new WebSocket("ws://localhost:8080");
    setSocket(newSocket);
    
    newSocket.onopen = () => {
      newSocket.send(
        JSON.stringify({
          type: "join",
          room
        })
      );
    };

    return () => {
      newSocket.close();
    };
  }, [room]);

  if (!room) {
    return (
      <div className="h-screen w-full p-4">
        <input
          type="text"
          placeholder="Room"
          className="p-2 border border-gray-300 rounded"
          value={inputRoom}
          onChange={(e) => setInputRoom(e.target.value)}
        />
        <button
          onClick={() => setRoom(inputRoom)}
          className="bg-blue-500 text-white px-4 py-1 rounded ml-2"
        >
          Join Room
        </button>
      </div>
    );
  }

  return (
    <Code code={code} setCode={setCode} output={output} setOutput={setOutput} socket={socket!} room={room} />
  );
};

export default App;
