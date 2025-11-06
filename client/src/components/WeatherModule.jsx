import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WeatherModule() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This is the new part: Ask for browser location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // --- SUCCESS ---
          // The user clicked "Allow"
          const { latitude, longitude } = position.coords;
          // Fetch weather using the user's coordinates
          fetchWeather(latitude, longitude); 
        },
        (err) => {
          // --- FAILURE ---
          // The user clicked "Block" or an error occurred
          console.warn("User denied location. Defaulting to London.");
          // Fetch weather for the default city
          fetchWeather(null, null, "London"); 
        }
      );
    } else {
      // The browser is old and doesn't support geolocation
      console.warn("Geolocation not supported. Defaulting to London.");
      fetchWeather(null, null, "London"); // Fetch for default city
    }
  }, []); // The empty array [] means this runs only once

  // This is a new helper function to call our backend
  const fetchWeather = (lat, lon, city) => {
    let url = '/api/weather'; // This is our Vercel API endpoint

    if (lat && lon) {
      // If we have coordinates, add them to the URL
      url += `?lat=${lat}&lon=${lon}`;
    } else {
      // Otherwise, add the default city to the URL
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

  // This part handles the "Loading..." and "Error..." messages
  if (isLoading) return <p className="loading-text">Getting your location & weather...</p>;
  if (error) return <p className="error-text">{error}</p>;

  // This is the final result
  return (
    <div className="module weather-module">
      <h3>{data.temperature}</h3>
      <p>{data.condition} in {data.city}</p>
    </div>
  );
}
export default WeatherModule;