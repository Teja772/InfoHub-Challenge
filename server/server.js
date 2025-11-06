// 1. Import all tools
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config(); // This loads your .env file

// 2. Create the server
const app = express();
const PORT = 3001;
app.use(cors());

// 3. Get API keys from the secure .env file
const WEATHER_KEY = process.env.WEATHER_API_KEY;
const CURRENCY_KEY = process.env.CURRENCY_API_KEY;

// ---------------------------------------------------
// API #1: The Quote Generator (Mock Data)
// (This is allowed by the instructions [cite: 18])
// ---------------------------------------------------
const quotes = [
    { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
];

app.get('/api/quote', (req, res) => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json(randomQuote);
});

// ---------------------------------------------------
// API #2: The Weather Information (Live Data) [cite: 5]
// ---------------------------------------------------
app.get('/api/weather', async (req, res) => {
    try {
        const city = "Hyderabad"; // Job location
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_KEY}&units=metric`;
        
        const response = await axios.get(url);

        const simplifiedData = {
            temperature: `${Math.round(response.data.main.temp)}°C`,
            condition: response.data.weather[0].description
        };
        res.json(simplifiedData);

    } catch (error) {
        console.error("Weather API Error:", error.message);
        res.status(500).json({ error: "Could not fetch weather. Check API key." });
    }
});

// ---------------------------------------------------
// API #3: The Currency Converter (Live Data) [cite: 6]
// ---------------------------------------------------
app.get('/api/currency', async (req, res) => {
    // This API will get a value from the user, like ?amount=100
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


// 5. Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});