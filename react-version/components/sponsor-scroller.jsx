import React, { useEffect, useRef } from "react";
import Sponsors from "./sponsors";

const SponsorScroller = () => {
  const scrollerRef = useRef(null);

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (scroller) {
      let sponsorIndex = 0;

      const addSponsors = () => {
        for (let i = 0; i < 100; i++) {
          const newBlock = document.createElement("div");
          newBlock.classList.add("block");

          const box = document.createElement("div");
          box.classList.add("box");
          box.style.height = `${Math.random() * (80 - 30) + 30}%`;

          const content = document.createElement("div");
          content.classList.add("content");
          content.style.backgroundImage = `url('${Sponsors[sponsorIndex].logo}')`;

          newBlock.appendChild(box);
          newBlock.appendChild(content);
          scroller.appendChild(newBlock);

          sponsorIndex = (sponsorIndex + 1) % Sponsors.length;
        }
      };

      addSponsors();

      const scrollInterval = setInterval(() => {
        if (scroller) {
          scroller.scrollLeft += 1;

          if (scroller.scrollLeft >= scroller.scrollWidth - 1920) {
            scroller.scrollLeft -= scroller.scrollWidth / 2;
            scroller.innerHTML += scroller.innerHTML;
          }
        }
      }, 11);

      return () => clearInterval(scrollInterval);
    }
  }, []);

  return <div id="scroller" ref={scrollerRef}></div>;
};

export default SponsorScroller;
