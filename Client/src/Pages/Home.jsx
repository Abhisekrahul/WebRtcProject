import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../Providers/Socket";
const HomePage = () => {
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [email, setEmail] = useState();
  const [roomId, setRoomId] = useState();

  const handelRoomJoined = useCallback(
    ({ roomId }) => {
      navigate(`/room/${roomId}`);
    },
    [navigate]
  );
  useEffect(() => {
    socket.on("joined-room", handelRoomJoined);

    return () => {
      socket.off("joined-room", handelRoomJoined);
    };
  }, [handelRoomJoined, socket]);

  const handleJoinRoom = () => {
    socket.emit("join-room", { emailId: email, roomId });
  };

  return (
    <div className="homepage-container">
      <div className="input-container">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter your emailId"
        />
        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          type="text"
          placeholder="enter RoomId"
        />
        <button onClick={handleJoinRoom} className="button">
          Enter Room
        </button>
      </div>
    </div>
  );
};
export default HomePage;
