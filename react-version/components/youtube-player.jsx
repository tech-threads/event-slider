import React, { useEffect, useRef } from "react";

const YouTubePlayer = ({ videoId, onReady, onError }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    const loadYouTubePlayer = async () => {
      const { default: YouTubePlayer } = await import("youtube-player");
      playerRef.current = YouTubePlayer("player", {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          mute: 1,
        },
      });

      playerRef.current.on("ready", onReady);
      playerRef.current.on("error", onError);
    };

    loadYouTubePlayer();
  }, [videoId, onReady, onError]);

  return <div id="player"></div>;
};

export default YouTubePlayer;
