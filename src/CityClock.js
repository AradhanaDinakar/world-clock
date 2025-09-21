import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import "./App.css";

const CityClock = ({ city, timezone, is24Hour }) => {
  const [time, setTime] = useState(
    moment()
      .tz(timezone)
      .format(is24Hour ? "HH:mm:ss" : "hh:mm:ss A")
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        moment()
          .tz(timezone)
          .format(is24Hour ? "HH:mm:ss" : "hh:mm:ss A")
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [timezone, is24Hour]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 flex flex-col items-center text-center hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
        {city}
      </h3>
      <p className="text-2xl font-bold text-blue-600 mb-1">{time}</p>
      <small className="text-gray-500 dark:text-gray-300 text-sm">
        {timezone}
      </small>
    </div>
  );
};

export default CityClock;
