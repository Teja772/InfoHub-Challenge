// [PASTE THIS INTO src/App.jsx]
import React, { useState } from 'react';
import WeatherModule from './components/WeatherModule';
import CurrencyConverter from './components/CurrencyConverter';
import QuoteGenerator from './components/QuoteGenerator';
import './App.css'; // We just created this

function App() {
  const [activeTab, setActiveTab] = useState('weather');

  const renderModule = () => {
    switch (activeTab) {
      case 'weather': return <WeatherModule />;
      case 'currency': return <CurrencyConverter />;
      case 'quote': return <QuoteGenerator />;
      default: return <WeatherModule />;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>InfoHub</h1>
        <p>Your everyday utilities, all in one place.</p>
      </header>
      
      <nav className="app-nav">
        <button onClick={() => setActiveTab('weather')} className={activeTab === 'weather' ? 'active' : ''}>
          Weather
        </button>
        <button onClick={() => setActiveTab('currency')} className={activeTab === 'currency' ? 'active' : ''}>
          Currency
        </button>
        <button onClick={() => setActiveTab('quote')} className={activeTab === 'quote' ? 'active' : ''}>
          Quote
        </button>
      </nav>

      <main className="app-content">
        {renderModule()}
      </main>
    </div>
  );
}
export default App;