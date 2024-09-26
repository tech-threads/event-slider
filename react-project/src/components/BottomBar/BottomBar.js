import Alert from "../Alert/Alert";
import "./BottomBar.css";

function BottomBar() {
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
