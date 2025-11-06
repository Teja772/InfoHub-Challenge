import React, { useState } from 'react';
import axios from 'axios';

function CurrencyConverter() {
  const [amount, setAmount] = useState(100);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // This function runs when the button is clicked
  const handleConvert = () => {
    setIsLoading(true);
    setError(null);
    setData(null);

    // Call the backend with the amount
    axios.get(`http://localhost:3001/api/currency?amount=${amount}`)
      .then(response => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Could not fetch rates');
        setIsLoading(false);
      });
  };

  return (
    <div className="module currency-converter">
      <h3>INR Currency Converter</h3>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleConvert} disabled={isLoading}>
        {isLoading ? 'Converting...' : 'Convert'}
      </button>

      {error && <p className="error-text">{error}</p>}
      
      {data && (
        <div className="currency-results">
          <h4>{data.inr} INR is equal to:</h4>
          <p><strong>{data.usd}</strong> USD</p>
          <p><strong>{data.eur}</strong> EUR</p>
        </div>
      )}
    </div>
  );
}
export default CurrencyConverter;