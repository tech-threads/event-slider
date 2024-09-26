import "./TopBar.css";

import CountDown from "./../CountDown/CountDown";
import Clock from "./../Clock/Clock";

function TopBar() {
  return (
    <div className="top-bar">
      <CountDown targetDate="2024-11-15 08:00:00" />
      <Clock />
      <div>
        <img
          src="https://event-slider.vercel.app/frame.png"
          alt="Event Signup QR Code"
        />
      </div>
    </div>
  );
}

export default TopBar;
