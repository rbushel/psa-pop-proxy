const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/psa-population', async (req, res) => {
  const { player, cardNumber, brand, variety } = req.query;

  if (!player || !cardNumber || !brand) {
    return res.status(400).send('Missing required parameters: player, cardNumber, and brand are required.');
  }

  // Build the PSA URL to fetch population data (adjust URL if PSA uses different format)
  const psaUrl = `https://www.psacard.com/pop/api/population?player=${encodeURIComponent(player)}&cardNumber=${encodeURIComponent(cardNumber)}&brand=${encodeURIComponent(brand)}&variety=${encodeURIComponent(variety || '')}`;

  try {
    const response = await axios.get(psaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'application/json',
        'Referer': 'https://www.psacard.com/',
        'Origin': 'https://www.psacard.com'
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
