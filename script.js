import moment from "https://esm.sh/moment";
import YouTubePlayer from "https://esm.sh/youtube-player";
import Sponsors from "./sponsors.js";

let activeVideo = null;

const rampVolume = (targetPlayer, volume, direction, callback = () => { }) => {
  let interval = setInterval(async () => {
    let currentVolume = await targetPlayer.getVolume();
    if (currentVolume === volume) {
      clearInterval(interval);
      callback();
    } else {
      targetPlayer.setVolume(currentVolume + (direction === "up" ? 1 : -1));
    }
  }, 100);
};

const minutesToMilliseconds = (minutes) => minutes * 60 * 1000;

// HH:mm:ss Countdown
const startCountDown = (eventEndDateTime, eventName) => {
  const wrapper = document.getElementById(eventName);
  const hour = wrapper.querySelector(".hour");
  const minute = wrapper.querySelector(".minute");
  const second = wrapper.querySelector(".second");

  let interval = setInterval(() => {
    let now = moment();

    let eventEnd = moment(eventEndDateTime);
    let duration = moment.duration(eventEnd.diff(now));

    let hours = duration.asHours().toFixed(2).padStart(2, "0");
    let minutes = duration.minutes().toString().padStart(2, "0");
    let seconds = duration.seconds().toString().padStart(2, "0");

    hour.innerHTML = hours.slice(0, 2);
    minute.innerHTML = minutes;
    second.innerHTML = seconds;
  }, 1000);
};

const srcSponsors = [...Sponsors];
const sponsorList = [...srcSponsors];
const defaultIframe =
  "https://www.youtube.com/embed/B-0wgmKDxho?si=QN79JaPR_YMoIBUr";

async function getConfig() {
  const url = "https://6555573184b36e3a431db63e.mockapi.io/config";

  const getConfigRequest = new Request(url + "?time=" + new Date().getTime(), {
    method: "GET",
    rejectUnauthorized: false,
    insecureHTTPParser: true,
    mode: "cors",
    cache: "no-store",
  });

  const response = await fetch(getConfigRequest).then((resp) => resp.json());
  // Check if the fetch was successful
  if (!response) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const config = response[0];
  return config;
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

const start = async function () {
  let config = {};

  var musicPlayer = YouTubePlayer("videomusic", {
    playerVars: {
      autoplay: 1,
      controls: 0,
      mute: 1,
      listType: "playlist",
      list: "PLhuOfWAQ8ocgRk7384XFcZSb56ZlCfUwa",
    },
  });

  musicPlayer.on("onError", (event) => {
    musicPlayer.nextVideo();
  });

  var player = YouTubePlayer("video", {
    playerVars: {
      autoplay: 1,
      controls: 0,
      mute: 1,
    },
  });

  // musicPlayer.loadVideoByUrl(defaultIframe)
  // activeVideo = defaultIframe
  musicPlayer.unMute();
  player.unMute();
  musicPlayer.setVolume(20);
  rampVolume(musicPlayer, 20, "up");

  try {
    config = await getConfig();
    startCountDown(
      config["event-end-times"][0]["day-camp"],
      "countdown-daycamp"
    );
    startCountDown(
      config["event-end-times"][0]["cc-classic"],
      "countdown-classic"
    );
    startCountDown(
      config["event-end-times"][0]["cc-classic"],
      "countdown-classic-background"
    );
  } catch (e) {
    console.error(e);
  }

  var scroller = document.getElementById("scroller");

  if (scroller) {
    var block = scroller.querySelector(".block");

    if (block) {
      var sponsorIndex = 0;

      for (let i = 0; i < 100; i++) {
        var newBlock = block.cloneNode(true);
        newBlock.querySelectorAll(".box").forEach((block) => {
          block.setAttribute(
            "style",
            "height: " + getRandomArbitrary(30, 80) + "%;"
          );
        });

        if (!sponsorList[sponsorIndex]) continue;

        var sponsor = sponsorList[sponsorIndex];
        var content = newBlock.querySelector(".content");
        content.setAttribute(
          "style",
          "background-image: url('" + sponsor.logo + "');"
        );

        newBlock.querySelector(".sponsor").classList.add(sponsor.type);

        if (sponsorIndex >= sponsorList.length - 1) {
          sponsorIndex = 0;
        } else {
          sponsorIndex++;
        }
        scroller.appendChild(newBlock);
      }
    }

    const wrapper = document.querySelector(".wrapper");
    let wrapperStyle = wrapper.getAttribute("style");

    if (wrapperStyle == null || wrapperStyle.opacity == null || wrapperStyle.opacity == undefined) {
      wrapper.setAttribute("style", "opacity: 1;");
    }

    var fadeToWhite = (callback = () => { }) => {
      var internalLoop = setInterval(() => {
        wrapper.style.opacity -= 0.01;
        if (wrapper.style.opacity <= 0) {
          clearInterval(internalLoop)
          callback()
        }
      }, 50);
    }

    var fadeFromWhite = () => {
      var internalLoop = setInterval(() => {
        wrapper.style.opacity = parseFloat(wrapper.style.opacity) + 0.01;
        if (wrapper.style.opacity >= 1) {
          clearInterval(internalLoop)
        }
      }, 50);
    }

    var fadeToWhiteLoop = setInterval(async () => {
      fadeToWhite(() => {
        const background = document.querySelector(".countdown-background");
        background.classList.add("open");
        setTimeout(() => { background.classList.remove('open'); fadeFromWhite() }, 10000)
      })
    }, 1000000);

    var overrideIsSet = false;

    var configLoop = setInterval(async () => {
      config = await getConfig();

      const clock = document.querySelector(".clock");
      const hour = clock.querySelector(".hour");
      const minute = clock.querySelector(".minute");
      const ampm = clock.querySelector(".ampm");
      const now = moment();

      hour.innerHTML = now.format("hh");
      minute.innerHTML = now.format("mm");
      ampm.innerHTML = now.format("A");

      if (config["wifi-information"]) {
        const networkName = document.querySelector(".network-name");
        const networkPass = document.querySelector(".network-password");

        networkName.innerHTML = config["wifi-information"]["network-name"];
        networkPass.innerHTML = config["wifi-information"]["network-password"];
      }

      if (config['notice-override'] && config['notice-override']['enabled']) {
        switch (config["notice-override"]["type"]) {
          case "video":
            if (
              activeVideo !==
              config["notice-override"]["src"]
            ) {
              const videoPlayer = document.getElementById('video-player')

              rampVolume(musicPlayer, 0, "down", () => {
                videoPlayer.classList.add('open')
                player.loadVideoByUrl(config["notice-override"]["src"])
                rampVolume(player, 100, "up")
              })

              activeVideo = config["notice-override"]["src"]
              overrideIsSet = true
            }
            break;

          case "text":
            let text = document.getElementById("text-announcement");
            text.innerHTML = config["notice-override"]["src"];
            break;
        }
        return;
      } else {
        if (overrideIsSet) {
          switch (config["notice-override"]["type"]) {
            case "video":
              rampVolume(player, 0, "down", () => {
                const videoPlayer = document.getElementById('video-player')
                videoPlayer.classList.remove('open')
                rampVolume(musicPlayer, 20, "up")
              })
              break;
            case "text":
              let text = document.getElementById("text-announcement");
              text.innerHTML = "";
              break;
          }
        }
      }

      if (config.announcements) {
        config.announcements.forEach((announcement) => {
          let showAt = moment(announcement["show-at"], "YYYY-MM-DD hh:mm:ss");
          let hideAt = moment(announcement["hide-at"], "YYYY-MM-DD hh:mm:ss");
          let now = moment();

          // show if showAt is before now and hideAt is after now and hideAt is after showAt
          if (
            showAt.isSameOrBefore(now) &&
            showAt.isSameOrBefore(hideAt) &&
            !hideAt.isBefore(now)
          ) {
            // Show it
            switch (announcement["type"]) {
              case "video":
                if (activeVideo !== announcement["src"]) {
                  const videoPlayer = document.getElementById("video-player");
                  // alert("showing video");
                  rampVolume(musicPlayer, 0, "down", () => {
                    console.log("ramping up");
                    videoPlayer.classList.add("open");
                    player.loadVideoByUrl(announcement["src"]);
                    rampVolume(player, 100, "up");
                  });

                  activeVideo = announcement["src"];

                  if (announcement["duration"]) {
                    setTimeout(
                      () => {
                        rampVolume(player, 0, "down", () => {
                          videoPlayer.classList.remove("open");
                          rampVolume(musicPlayer, 20, "up");
                        });
                        activeVideo = defaultIframe;
                      },
                      minutesToMilliseconds(announcement["duration"]) // update to grab from config after work
                    );
                  }
                }
                break;

              case "text":
                let text = document.getElementById("text-announcement");

                text.innerHTML = announcement.src;

                if (announcement["duration"]) {
                  setTimeout(
                    () => {
                      text.innerHTML = "";
                    },
                    minutesToMilliseconds(announcement["duration"]) // update to grab from config after work
                  );
                }
                break;
            }
          }
        });
      }
    }, 1000);

    var loop = setInterval(() => {
      window.requestAnimationFrame(() => {
        scroller.scrollLeft += 1;

        // reset when we reach the end of the scroller
        if (scroller.scrollLeft >= scroller.scrollWidth - 1920) {
          scroller.scrollLeft -= scroller.scrollWidth / 2;
          scroller.innerHTML += scroller.children;
        }
      });
    }, 5);
  }
};

window.start = start;

// Needs:
// assets for buildings
// -- music
// countdown
// -- links (fetch from github repo?)
