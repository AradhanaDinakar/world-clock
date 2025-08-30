import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import './App.css'; 

const CityClock = ({ city, timezone }) => {
  const [time, setTime] = useState(moment().tz(timezone).format('HH:mm:ss'));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment().tz(timezone).format('HH:mm:ss'));
    }, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <div className='bg-white shadow-md rounded-xl p-4 flex flex-col items-center text-center hover:shadow-lg transition'>
      <h3 className='text-xl font-semibold text-gray-800 mb-2'>{city}</h3>
      <p className='text-2xl font-bold text-blue-600 mb-1'>{time}</p>
      <small className='text-gray-500 text-sm'>{timezone}</small>
    </div>
  );
};

export default CityClock;
