import React, { useState } from 'react';
import CityClock from './CityClock';
import moment from 'moment-timezone';
import './App.css';

function App() {
  const [cityInput, setCityInput] = useState('');
  const [selectedContinent, setSelectedContient] = useState('Asia');
  const [clocks, setClocks] = useState([]);

   const continents = [
    "Africa",
    "Antarctica",
    "Asia",
    "Europe",
    "North_America",
    "Oceania",
    "South_America"
  ];

  const handleAddCity = () => {
    if (!cityInput.trim()) return;

    const formattedCity = cityInput.trim().replace(' ','_');
    const timezone = `${selectedContinent}/${formattedCity}`;

    if (!moment.tz.names().includes(timezone)) {
      alert('Invalid city! Try full timezone name. Example: Asia/Kolkata');
      return;
    }

    if (clocks.find(c => c.timezone === timezone)) {
      alert('City already added!');
      return;
    }

    const cityName = formattedCity.replace('_', ' ');

    setClocks([...clocks, { name: cityName, timezone }]);
    setCityInput('');
  };

  return (
    <div className="min-h-screen bg-[url('Worldmap.jpg')] bg-cover bg-center text-white">
      <h1 className='text-5xl font-serif text-white mb-6 text-center'>
        🌍 World Clock
      </h1>

      <div className='flex justify-center'>
        <div className='bg-white shadow-lg rounded-xl p-6 flex space-x-4 mb-6 w-full max-w-xl items-center'>
        <select
          value={selectedContinent}
          onChange={(e) => setSelectedContient(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {continents.map((cont, idx) => (
            <option key={idx} value={cont}
            >
              {cont.replace('_',' ')}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Enter timezone (e.g. Kolkata)"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 "
        />
        <button 
            onClick={handleAddCity}
            className="bg-blue-500 hover:bg-blue-600 text-black font-semibold px-4 py-2 rounded-lg shadow-md transition"
        >
              Add Clock
        </button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl'>
        {clocks.map((city, idx) => (
          <CityClock key={idx} city={city.name} timezone={city.timezone} />
        ))}
      </div>
    </div>
  );
}

export default App;
