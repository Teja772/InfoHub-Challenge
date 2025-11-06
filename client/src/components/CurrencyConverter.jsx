import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CurrencyConverter() {
  const [amount, setAmount] = useState(100);
  const [debouncedAmount, setDebouncedAmount] = useState(100);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // This is the "debounce" hook. It waits for the user to stop typing.
  useEffect(() => {
    const handler = setTimeout(() => {
      if (amount) {
        setDebouncedAmount(amount);
      }
    }, 500); // Wait 500ms after user stops typing

    // Cleanup function to cancel the timer
    return () => {
      clearTimeout(handler);
    };
  }, [amount]); // This effect runs every time 'amount' changes

  // This hook runs when the 'debouncedAmount' changes (after the 500ms delay)
  useEffect(() => {
    if (!debouncedAmount) return; // Don't run if the input is empty

    setIsLoading(true);
    setError(null);

    axios.get(`/api/currency?amount=${debouncedAmount}`)
      .then(response => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Could not fetch rates');
        setIsLoading(false);
      });
  }, [debouncedAmount]); // This runs when the debounced amount is set

  return (
    <div className="module currency-converter">
      <h3>INR Currency Converter</h3>
      <p>Converts automatically as you type:</p>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      {/* The "Convert" button is no longer needed! */}

      {isLoading && <p className="loading-text">Loading rates...</p>}
      {error && <p className="error-text">{error}</p>}
      
      {data && !isLoading && (
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