import { Editor } from "@monaco-editor/react";
import { SetStateAction, useEffect } from "react";

const Code = ({
  code,
  setCode,
  output,
  setOutput,
  socket,
  room,
}: {
  code: string;
  setCode: (value: SetStateAction<string>) => void;
  output: string;
  setOutput: (value: SetStateAction<string>) => void;
  socket: WebSocket | null;
  room: string;
}) => {
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
    //   console.log("Message received", event.data);
      const data = JSON.parse(event.data);
      if (data.type === "code") {
        setCode(data.code);
        setOutput(data.output);
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  const sendMessage = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error("Socket is not connected");
      return;
    }

    const message = JSON.stringify({
      type: "code",
      room,
      code,
      output,
    });

    console.log("Sending message:", message);
    socket.send(message);
  };

  useEffect(() => {
    sendMessage();
  }, [code, output]);

  const runCode = () => {
    try {
      let logs: string[] = [];
      const originalConsoleLog = console.log;

      console.log = (...args) => logs.push(args.join(" "));

      const result = new Function(code)();

      console.log = originalConsoleLog;

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
