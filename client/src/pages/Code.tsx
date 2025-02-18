import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

const Code = () => {
  const [code, setCode] = useState('console.log("Hello, World!");');
  const socket = useSocket()
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (!socket) return;
    const message = {
      type: "code",
      message: code,
      room: "default",
      name: "user",
    };
    socket.send(JSON.stringify(message));
  }, [code]);

  const runCode = () => {
    try {
      let logs: string[] = [];
      const originalConsoleLog = console.log;

      console.log = (...args) => logs.push(args.join(" "));

      const result = eval(code);

      console.log = originalConsoleLog;

      setOutput(
        logs.length
          ? logs.join("\n")
          : result !== undefined
          ? result.toString()
          : "Code executed successfully!"
      );
    } catch {
      setOutput("Something went wrong");
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
