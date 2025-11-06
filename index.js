import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  const intent = req.body?.queryResult?.intent?.displayName || "";
  const params = req.body?.queryResult?.parameters || {};
  const city = params["geo-city"] || params["city"] || "";

  // If your intent name in Dialogflow is "Travel_Advice" or "travel.weather"
  if (intent === "Travel_Advice" || intent === "travel.weather") {
    if (!city) {
      return res.json({ fulfillmentText: "Which city are you planning to visit?" });
    }

    const apiKey = "903507f17d707fecd352d38301efba77"; // your OpenWeatherMap key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=imperial`;

    try {
      const response = await axios.get(url);
      const weather = response.data.weather[0].description;
      const temp = response.data.main.temp;

      const reply = `Here’s a plan for your trip to ${city}:\n- Weather: ${weather}, ${temp}°F\n- Day 1: Visit famous landmarks\n- Day 2: Explore local food & culture\n- Day 3: Relax by scenic spots.`;

      return res.json({ fulfillmentText: reply });
    } catch (error) {
      console.error("Weather API error:", error);
      return res.json({
        fulfillmentText: `Sorry, I couldn’t fetch weather for ${city}.`,
      });
    }
  }

  // Default fallback
  return res.json({ fulfillmentText: "I didn't get that. Can you repeat?" });
});

app.get("/", (req, res) => res.send("Travel Planner webhook running 🌍"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

