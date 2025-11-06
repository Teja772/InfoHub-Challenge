// [PASTE THIS ENTIRE BLOCK INTO YOUR api/index.js FILE]

import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());

const WEATHER_KEY = process.env.WEATHER_API_KEY;
const CURRENCY_KEY = process.env.CURRENCY_API_KEY;

// --- API #1: QUOTE (Using Reliable Mock Data) ---
// This fixes the error and is allowed by the assignment.
const quotes = [
    { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { quote: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
    { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" }
];

app.get('/api/quote', (req, res) => {
    // Get a random quote from the array
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json(randomQuote);
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
export default app;