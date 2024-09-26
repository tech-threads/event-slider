import React, { useContext, useEffect } from "react";
import YouTubePlayer from "./YouTubePlayer";
import Countdown from "./Countdown";
import SponsorScroller from "./SponsorScroller";
import ConfigContext from "./ConfigProvider";

const App = () => {
  const config = useContext(ConfigContext);

  useEffect(() => {
    // Add any additional logic needed for handling the config
  }, [config]);

  return (
    <div>
      <YouTubePlayer
        videoId="defaultVideoId"
        onReady={() => console.log("Player is ready")}
        onError={(error) => console.error("Player error:", error)}
      />
      <Countdown
        endDateTime={config["event-end-times"]?.[0]?.["day-camp"]}
        elementId="countdown-daycamp"
      />
      <Countdown
        endDateTime={config["event-end-times"]?.[0]?.["cc-classic"]}
        elementId="countdown-classic"
      />
      <SponsorScroller />
    </div>
  );
};

export default App;
