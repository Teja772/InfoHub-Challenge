// [PASTE THIS ENTIRE BLOCK INTO YOUR api/index.js FILE]

// 1. Import all tools using the NEW 'import' syntax
import express from 'express';
import cors from 'cors';
import axios from 'axios';

// 2. Create the server
const app = express();
app.use(cors());

// Vercel gets these from your "Environment Variables" settings
const WEATHER_KEY = process.env.WEATHER_API_KEY;
const CURRENCY_KEY = process.env.CURRENCY_API_KEY;

// --- API #1: QUOTE (Live API) ---
app.get('/api/quote', async (req, res) => {
    try {
        const response = await axios.get('https://api.quotable.io/random');
        const data = {
            quote: response.data.content,
            author: response.data.author
        };
        res.json(data);
    } catch (error) {
        console.error("Quote API Error:", error.message);
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

// Export the app for Vercel using the new 'export default' syntax
export default app;