import React, { useState } from "react";
import CityClock from "./CityClock";
import moment from "moment-timezone";
import "./App.css";

function App() {
  const [cityInput, setCityInput] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("Asia");
  const [clocks, setClocks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [is24Hour, setIs24Hour] = useState(true);

  const toggleTimeFormat = () => {
    setIs24Hour(!is24Hour);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const continents = [
    "Africa",
    "Antarctica",
    "Asia",
    "Europe",
    "North America",
    "Oceania",
    "South America",
  ];

  const continentMap = {
    Africa: "Africa",
    Antarctica: "Antarctica",
    Asia: "Asia",
    Europe: "Europe",
    Oceania: "Oceania",
    America: "North America",
  };

  const handleAddCity = async () => {
    if (!cityInput.trim()) return;

    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityInput}&count=1`
      );

      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        alert("City not found! Try again.");
        return;
      }

      const cityData = data.results[0];
      const timezone = cityData.timezone;
      const cityName = cityData.name;

      let cityContinent = timezone.split("/")[0];

      if (cityContinent === "America") {
        const country = cityData.country_code;

        const southAmericaCountries = [
          "BR",
          "AR",
          "CL",
          "CO",
          "PE",
          "VE",
          "UY",
          "PY",
          "BO",
          "EC",
          "GY",
          "SR",
          "GF",
          "FK",
        ];

        if (southAmericaCountries.includes(country)) {
          cityContinent = "South America";
        } else {
          cityContinent = "North America";
        }
      } else {
        cityContinent = continentMap[cityContinent] || cityContinent;
      }

      if (
        cityContinent.toLowerCase() !== selectedContinent.toLocaleLowerCase()
      ) {
        alert("Invalid input: City does not belong to selected contient.");
        return;
      }

      if (clocks.find((c) => c.name.toLowerCase() === cityName.toLowerCase())) {
        alert("City already added!");
        return;
      }

      setClocks([...clocks, { name: `${cityName}`, timezone }]);
      setCityInput("");
    } catch (err) {
      console.error(err);
      alert("Error fetching city data!");
    }
  };

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen`}>
      <div
        className={`absolute inset-0 bg-worldmap bg-cover transition-all duration-500 ${
          darkMode ? "brightness-50" : "brightness-100"
        }`}
      ></div>

      <div className="relative z-10 min-h-screen px-6">
        <div className="flex justify-end p-4">
          <button
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              darkMode
                ? "bg-yellow-400 text-black hover:bg-yellow-500 "
                : "bg-blue-500 text-white hover:bg-blue-600 "
            }`}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <button
            onClick={toggleTimeFormat}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              darkMode
                ? "bg-green-400 text-black hover:bg-green-500"
                : "bg-purple-500 text-white hover:bg-purple-600"
            }`}
          >
            {is24Hour ? "🕒 Switch to 12 Hours" : "⏰ Switch to 24 Hours"}
          </button>
        </div>

        <h1
          className={`text-5xl font-serif text-center mb-6 transition-colors duration-500 ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          🌍 World Clock
        </h1>

        <div className="flex justify-center">
          <div
            className={`shadow-lg rounded-xl p-6 flex space-x-4 mb-6 w-full max-w-xl items-center transition-colors duration-500 ${
              darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
            }`}
          >
            <select
              value={selectedContinent}
              onChange={(e) => setSelectedContinent(e.target.value)}
              className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-black border-gray-300"
              }`}
            >
              {continents.map((cont, idx) => (
                <option key={idx} value={cont}>
                  {cont}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Enter timezone (e.g. Kolkata)"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              className={`flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-black border-gray-300"
              }`}
            />

            <button
              onClick={handleAddCity}
              className={`px-4 py-2 rounded-lg shadow-md transition ${
                darkMode
                  ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Add Clock
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
          {clocks.map((city, idx) => (
            <CityClock
              key={idx}
              city={city.name}
              timezone={city.timezone}
              is24Hour={is24Hour}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
