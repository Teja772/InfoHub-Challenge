import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WeatherModule() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/api/weather')
      .then(response => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Could not fetch weather');
        setIsLoading(false);
      });
  }, []);

  // This shows loading or error states [cite: 14]
  if (isLoading) return <p className="loading-text">Loading real-time weather...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="module weather-module">
      <h3>{data.temperature}</h3>
      <p>{data.condition} in Hyderabad</p>
    </div>
  );
}
export default WeatherModule;