const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

app.get('/api/psa-population', async (req, res) => {
  const { player, cardNumber, brand, variety } = req.query;

  const searchParams = new URLSearchParams({
    query: `${player} ${brand} ${cardNumber} ${variety || ''}`.trim()
  });

  try {
    const response = await axios.get(`https://www.psacard.com/pop/report`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.psacard.com/',
        'Origin': 'https://www.psacard.com'
      },
      params: searchParams
    });

    const html = response.data;

    // Use regex or cheerio to extract population data from `html`
    const psa8 = extractPopulation(html, '8');
    const psa9 = extractPopulation(html, '9');
    const psa10 = extractPopulation(html, '10');

    res.json({
      psa8,
      psa9,
      psa10
    });
  } catch (error) {
    console.error('AxiosError:', error.message);
    res.status(500).send(`AxiosError: ${error.message}`);
  }
});

// Simple regex fallback (can be replaced with cheerio for robust parsing)
function extractPopulation(html, grade) {
  const regex = new RegExp(`<td>${grade}<\\/td>\\s*<td[^>]*>(\\d+)<\\/td>`, 'i');
  const match = html.match(regex);
  return match ? parseInt(match[1], 10) : 0;
}

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
