import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";

const Code = () => {
  const [code, setCode] = useState('console.log("Hello, World!");');
  const [output, setOutput] = useState("");
  const location = useLocation();
  const { roomId, user } = location.state;
  const socket = useSocket();;

  useEffect(() => {
    if (!socket) return;

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "joined",
        room: roomId,
        name: user
      }));
    } else {
      socket.onopen = () => {
        socket.send(JSON.stringify({
          type: "joined",
          room: roomId,
          name: user
        }));
      };
    }

    const message = {
      type: "code",
      message: code,
      room: roomId,
      name: user,
      output: output
    };
    socket.send(JSON.stringify(message));
  }, [code]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "code") {
          setCode(data.message);
          setOutput(data.output);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onmessage = handleMessage;

    return () => {
      if (socket) {
        socket.onmessage = null; // Cleanup listener
      }
    };
  }, [roomId]);

  const runCode = () => {
    try {
      let logs: string[] = [];
      const originalConsoleLog = console.log;

      console.log = (...args) => logs.push(args.join(" "));

      // Safer alternative to eval
      const result = new Function(code)();

      console.log = originalConsoleLog; // Restore console.log

      setOutput(
        logs.length
          ? logs.join("\n")
          : result !== undefined
          ? result.toString()
          : "Code executed successfully!"
      );
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <div className="h-screen w-full p-4">
      <div className="flex gap-2 mb-2">
        <button
          onClick={runCode}
          className="bg-green-500 text-white px-4 py-1 rounded"
        >
          Run Code
        </button>
      </div>

      <Editor
        height="60vh"
        language="javascript"
        value={code}
        onChange={(value) => setCode(value || "")}
        theme="vs-dark"
      />

      <div className="bg-gray-900 text-white p-2 mt-2 h-32 overflow-auto">
        <strong>Output:</strong>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default Code;
