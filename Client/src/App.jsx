import { Routes, Route } from "react-router-dom";

import "./App.css";
import HomePage from "./Pages/Home";
import { SocketProvider } from "./Providers/Socket";
import RoomPage from "./Pages/Room";
import { PeerProvide } from "./Providers/Peer";

function App() {
  return (
    <div>
      <SocketProvider>
        <PeerProvide>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/room/:roomId" element={<RoomPage />} />
          </Routes>
        </PeerProvide>
      </SocketProvider>
    </div>
  );
}

export default App;
