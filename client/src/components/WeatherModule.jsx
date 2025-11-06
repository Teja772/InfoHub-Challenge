// [PASTE THIS ENTIRE BLOCK INTO client/src/components/WeatherModule.jsx]

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WeatherModule() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ask for browser location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // --- SUCCESS ---
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude); 
        },
        (err) => {
          // --- FAILURE ---
          console.warn("User denied location. Defaulting to London.");
          fetchWeather(null, null, "London"); 
        }
      );
    } else {
      // Browser doesn't support geolocation
      console.warn("Geolocation not supported. Defaulting to London.");
      fetchWeather(null, null, "London");
    }
  }, []); // Runs once on load

  // Helper function to call our backend
  const fetchWeather = (lat, lon, city) => {
    let url = '/api/weather'; 

    if (lat && lon) {
      url += `?lat=${lat}&lon=${lon}`;
    } else {
      url += `?city=${city || 'London'}`;
    }

    axios.get(url)
      .then(response => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Could not fetch weather');
        setIsLoading(false);
      });
  };

  // Handle loading and error states
  if (isLoading) return <p className="loading-text">Getting your location & weather...</p>;
  if (error) return <p className="error-text">{error}</p>;

  // --- THIS IS THE FIX ---
  // We add 'data && (...)'
  // This tells React to only render this block IF data is not null.
  return (
    data && (
      <div className="module weather-module">
        <h3>{data.temperature}</h3>
        <p>{data.condition} in {data.city}</p>
      </div>
    )
  );
}

export default WeatherModule;