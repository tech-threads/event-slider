import React, { useEffect, useRef } from "react";
import moment from "moment";

const Countdown = ({ endDateTime, elementId }) => {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment();
      const eventEnd = moment(endDateTime);
      const duration = moment.duration(eventEnd.diff(now));

      const hours = duration.hours().toString().padStart(2, "0");
      const minutes = duration.minutes().toString().padStart(2, "0");
      const seconds = duration.seconds().toString().padStart(2, "0");

      if (hourRef.current) hourRef.current.innerHTML = hours;
      if (minuteRef.current) minuteRef.current.innerHTML = minutes;
      if (secondRef.current) secondRef.current.innerHTML = seconds;
    }, 1000);

    return () => clearInterval(interval);
  }, [endDateTime]);

  return (
    <div id={elementId}>
      <span className="hour" ref={hourRef}></span>:
      <span className="minute" ref={minuteRef}></span>:
      <span className="second" ref={secondRef}></span>
    </div>
  );
};

export default Countdown;
