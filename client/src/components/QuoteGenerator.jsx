import React, { useState, useEffect } from 'react';
import axios from 'axios';

function QuoteGenerator() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // This function fetches a new quote
  const fetchQuote = () => {
    setIsLoading(true);
    axios.get('http://localhost:3001/api/quote')
      .then(response => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch(err => {
        setError('Could not fetch quote');
        setIsLoading(false);
      });
  };

  // Run this function once on load
  useEffect(() => {
    fetchQuote();
  }, []);

  if (isLoading) return <p className="loading-text">Loading quote...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="module quote-module">
      <blockquote>"{data.quote}"</blockquote>
      <p>- {data.author}</p>
      <button onClick={fetchQuote} style={{marginTop: '15px'}}>New Quote</button>
    </div>
  );
}
export default QuoteGenerator;