import React, { useState, useEffect } from 'react';
import axios from 'axios';

function QuoteGenerator() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // This function fetches a new quote from our backend
  const fetchQuote = () => {
    setIsLoading(true);
    setError(null);
    
    axios.get('/api/quote')
      .then(response => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch(err => {
        setError('Could not fetch quote. The API might be down.');
        setIsLoading(false);
      });
  };

  // Run this function once on the initial load
  useEffect(() => {
    fetchQuote();
  }, []); // The empty array [] means this runs once

  // This part handles the "Loading..." and "Error..." messages
  if (isLoading && !data) return <p className="loading-text">Loading quote...</p>;
  if (error) return <p className="error-text">{error}</p>;

  // This is the final result
  return (
    <div className="module quote-module">
      {/* This part shows the data even while loading a new one */}
      {data && (
        <>
          <blockquote>"{data.quote}"</blockquote>
          <p>- {data.author}</p>
        </>
      )}

      <button onClick={fetchQuote} disabled={isLoading} style={{marginTop: '15px'}}>
        {isLoading ? 'Loading...' : 'New Quote'}
      </button>
    </div>
  );
}

export default QuoteGenerator;