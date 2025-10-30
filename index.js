const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const intent = req.body.queryResult.intent.displayName;

  if (intent === "Check_Weather") {
    const city = req.body.queryResult.parameters['place'];
    const responseText = `The weather in ${city} is expected to be sunny with 30°C.`;
    return res.json({ fulfillmentText: responseText });
  }

  else if (intent === "Book_Flight") {
    const destination = req.body.queryResult.parameters['place'];
    const budget = req.body.queryResult.parameters['budget'];
    const responseText = `I can help you book a flight to ${destination} within your budget of ${budget}.`;
    return res.json({ fulfillmentText: responseText });
  }

  else {
    return res.json({ fulfillmentText: "Sorry, I didn’t get that." });
  }
});

app.listen(3000, () => console.log('Webhook running on port 3000'));
