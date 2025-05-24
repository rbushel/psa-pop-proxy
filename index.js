const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/psa-population', async (req, res) => {
  const { player, cardNumber, brand, variety } = req.query;

  if (!player || !cardNumber || !brand || !variety) {
    return res.status(400).send('Missing required query parameters');
  }

  try {
    // Compose the actual PSA website URL you want to scrape
    // Example URL format (replace with the real one you're scraping):
    const psaUrl = `https://www.psacard.com/pop/${encodeURIComponent(player)}/${encodeURIComponent(cardNumber)}/${encodeURIComponent(brand)}/${encodeURIComponent(variety)}`;

    const response = await axios.get(psaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    // Send back the raw HTML or parse and send JSON as needed
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
