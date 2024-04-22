import React, { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "../Providers/Socket";
import { usePeer } from "../Providers/Peer";

const RoomPage = () => {
  const { socket } = useSocket();
  const {
    peer,
    createOffer,
    createAnswer,
    setRemoteAnswer,
    sendStrem,
    remoteStream,
  } = usePeer();
  const [myStream, setStream] = useState(null);
  const [remoteEmailId, setRemoteEmailId] = useState();

  const handelNewUserJoined = useCallback(
    async (data) => {
      const { emailId } = data;
      console.log("new User joined room", emailId);
      const offer = await createOffer();
      socket.emit("call-user", { emailId, offer });
      setRemoteEmailId(emailId);
    },
    [createOffer, socket, setRemoteEmailId]
  );

  const handelIncommingCall = useCallback(
    async (data) => {
      const { from, offer } = data;
      console.log("incomming call from ", from, offer);
      const ans = await createAnswer(offer);
      socket.emit("call-accepted", { emailId: from, ans });
      setRemoteEmailId(from);
    },
    [createAnswer, socket, setRemoteEmailId]
  );

  const handelCallAccepted = useCallback(
    async (data) => {
      const { ans } = data;
      console.log("Call got Accepted", ans);
      await setRemoteAnswer(ans);
    },
    [setRemoteAnswer]
  );

  const getUserMediaStrem = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    setStream(stream);
  }, []);
  const handelNegosiation = useCallback(async () => {
    const localOffer = await peer.createOffer();
    socket.emit("call-user", { emailId: remoteEmailId, offer: localOffer });
  }, [createOffer, remoteEmailId, socket]);

  useEffect(() => {
    socket.on("user-joined", handelNewUserJoined);
    socket.on("incomming-call", handelIncommingCall);
    socket.on("call-accepted", handelCallAccepted);

    // return () => {
    //   socket.off("user-joined", handelNewUserJoined);
    //   socket.off("incomming-call", handelIncommingCall);
    //   socket.off("call-accepted", handelCallAccepted);
    // };
  }, [handelNewUserJoined, handelIncommingCall, handelCallAccepted, socket]);

  useEffect(() => {
    peer.addEventListener("negotiontionneeded", handelNegosiation);
    return () => {
      peer.removeEventListener("negotiontionneeded", handelNegosiation);
    };
  }, []);

  useEffect(() => {
    getUserMediaStrem();
  }, []);

  return (
    <div className="room-page-container">
      <h1>Room Page</h1>
      <h4>You are connected to{remoteEmailId}</h4>
      <button onClick={(e) => sendStrem(myStream)}>Send My Video</button>
      <ReactPlayer url={myStream} playing muted />
      <ReactPlayer url={remoteStream} playing />
    </div>
  );
};
export default RoomPage;
