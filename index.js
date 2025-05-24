const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/psa', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing URL');

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});