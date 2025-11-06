const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());

const WEATHER_KEY = process.env.WEATHER_API_KEY;
const CURRENCY_KEY = process.env.CURRENCY_API_KEY;

// --- API #1: QUOTE (Upgraded to Live API) ---
app.get('/api/quote', async (req, res) => {
    try {
        // Call the external Quotable API
        const response = await axios.get('https://api.quotable.io/random');
        
        // Simplify the response to match our frontend
        const data = {
            quote: response.data.content,
            author: response.data.author
        };
        res.json(data);

    } catch (error) {
        console.error("Quote API Error:", error.message);
        // Fallback to a single mock quote if the API fails
        res.status(500).json({ 
            quote: "The only way to do great work is to love what you do.", 
            author: "Steve Jobs (Fallback)" 
        });
    }
});

// --- API #2: WEATHER (Geolocation) ---
app.get('/api/weather', async (req, res) => {
    const { lat, lon, city } = req.query;
    let url;

    try {
        if (lat && lon) {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric`;
        } else {
            const defaultCity = city || "London"; 
            url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&appid=${WEATHER_KEY}&units=metric`;
        }
        
        const response = await axios.get(url);
        const simplifiedData = {
            temperature: `${Math.round(response.data.main.temp)}°C`,
            condition: response.data.weather[0].description,
            city: response.data.name 
        };
        res.json(simplifiedData);

    } catch (error) {
        console.error("Weather API Error:", error.message);
        res.status(500).json({ error: "Could not fetch weather. Check API key." });
    }
});

// --- API #3: CURRENCY (Live Rates) ---
app.get('/api/currency', async (req, res) => {
    const { amount } = req.query;
    if (!amount) {
        return res.status(400).json({ error: "Amount is required" });
    }
    try {
        const url = `https://v6.exchangerate-api.com/v6/${CURRENCY_KEY}/latest/INR`;
        const response = await axios.get(url);
        const rates = response.data.conversion_rates;
        const inrAmount = parseFloat(amount);
        const usdAmount = (inrAmount * rates.USD).toFixed(2);
        const eurAmount = (inrAmount * rates.EUR).toFixed(2);
        
        res.json({
            inr: inrAmount,
            usd: usdAmount,
            eur: eurAmount
        });
    } catch (error) {
        console.error("Currency API Error:", error.message);
        res.status(500).json({ error: "Could not fetch currency rates." });
    }
});

// Export the app for Vercel
module.exports = app;