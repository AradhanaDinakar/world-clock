import React, { useState } from "react";
import CityClock from "./CityClock";
import moment from "moment-timezone";
import "./App.css";

function App() {
  const [cityInput, setCityInput] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("Asia");
  const [clocks, setClocks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

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
    <div className={darkMode ? "dark min-h-screen" : "min-h-screen"}>
      <div className="min-h-screen bg-[url('Worldmap.jpg')] bg-cover text-white dark:bg-gray-900 dark:text-gray-100">
        <div className="flex justify-end p-4">
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 dark:bg-yellow-400 dark:text-black transition"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
        <h1 className="text-5xl font-serif text-white mb-6 text-center">
          🌍 World Clock
        </h1>

        <div className="flex justify-center">
          <div className="bg-white shadow-lg rounded-xl p-6 flex space-x-4 mb-6 w-full max-w-xl items-center">
            <select
              value={selectedContinent}
              onChange={(e) => setSelectedContinent(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ing-blue-400 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />

            <button
              onClick={handleAddCity}
              className="bg-blue-500 hover:bg-blue-600 text-black font-semibold px-4 py-2 rounded-lg shadow-md trnsition dark:bg-yellow-400 dark:hover:bg-yellow-500 dark:text-black"
            >
              Add Clock
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
          {clocks.map((city, idx) => (
            <CityClock key={idx} city={city.name} timezone={city.timezone} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
