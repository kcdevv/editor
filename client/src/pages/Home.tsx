import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";

const Home = () => {
  const roomIdRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const socket = useSocket();

  const handleJoin = () => {
    if (!roomIdRef.current?.value || !nameRef.current?.value) {
      alert("Please enter both Room ID and Name");
      return;
    }

    const roomId = roomIdRef.current.value.trim();
    const userName = nameRef.current.value.trim();

    if (socket?.readyState === WebSocket.OPEN) {
      navigate(`/${roomId}`, {
        state: {
          roomId: roomId,
          user: userName,
        },
      });
    } else {
      alert("WebSocket connection not ready. Please try again.");
    }
  };

  return (
    <div className="w-full h-screen bg-zinc-300 flex flex-col items-center justify-center gap-4">
      <input
        type="text"
        ref={roomIdRef}
        placeholder="Enter Room ID"
        className="p-2 border rounded"
      />
      <input
        type="text"
        ref={nameRef}
        placeholder="Enter Your Name"
        className="p-2 border rounded"
      />
      <button
        onClick={handleJoin}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Join
      </button>
    </div>
  );
};

export default Home;
