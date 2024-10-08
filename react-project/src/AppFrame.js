import "./AppFrame.css";
import TopBar from "./components/TopBar/TopBar";
import BottomBar from "./components/BottomBar/BottomBar";
import Canvas from "./components/Canvas/Canvas";

import client from "socket.io-client";

const websocket = "ws://stl9p4-8080.csb.app";

const socket = client(websocket);

socket.on("connect", () => {
  console.log("Connected to the socket API.");
});

function AppFrame() {
  return (
    <>
      <TopBar />
      <Canvas />
      <BottomBar />
    </>
  );
}

export default AppFrame;
