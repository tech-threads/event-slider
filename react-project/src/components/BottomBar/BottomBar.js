import Alert from "../Alert/Alert";
import "./BottomBar.css";

import websocket from "../../helpers/websocket";
import { useEffect } from "react";

function BottomBar() {
  useEffect(() => {
    websocket.connect("ws://stl9p4-8080.csb.app/").then((socket) => {
      socket.on("video:start", (data) => {
        console.log("Video Starting with data: ", data);
      });
    });
  });

  return (
    <div className="bottom-bar">
      <div>
        <img
          src="https://southernutahcodecamp.com/wp-content/uploads/2018/09/codecamp_white.svg"
          alt="CodeCamp Logo"
        />
      </div>
      <Alert
        type="info"
        message="Food is being served at 12pm. Please form two lines. One line on each side of the table."
      />
    </div>
  );
}

export default BottomBar;
