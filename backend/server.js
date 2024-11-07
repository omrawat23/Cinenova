const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Helper function to modify URLs in content
const modifyUrls = (content, type) => {
  if (type === 'text/html') {
    const $ = cheerio.load(content);
    
    // Modify script sources
    $('script').each((i, elem) => {
      const src = $(elem).attr('src');
      if (src && !src.startsWith('http')) {
        $(elem).attr('src', `/proxy/static/${src.split('?')[0]}`);
      }
    });
    
    // Modify CSS sources
    $('link[rel="stylesheet"]').each((i, elem) => {
      const href = $(elem).attr('href');
      if (href && !href.startsWith('http')) {
        $(elem).attr('href', `/proxy/static/${href.split('?')[0]}`);
      }
    });
    
    // Remove ad-related elements
    $('script[src*="ads"]').remove();
    $('script[src*="analytics"]').remove();
    $('div[id*="ads"]').remove();
    $('div[class*="ads"]').remove();
    
    return $.html();
  }
  return content;
};

// Main proxy for the video embed
app.get('/proxy/video/:videoId', async (req, res) => {
  const { videoId } = req.params;
  
  try {
    const response = await axios({
      method: 'get',
      url: `https://embed.su/embed/movie/${videoId}`,
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://embed.su/',
        'Origin': 'https://embed.su'
      }
    });

    const contentType = response.headers['content-type'];
    let content = response.data.toString();
    
    // Modify content if it's HTML
    if (contentType.includes('text/html')) {
      content = modifyUrls(content, contentType);
    }

    // Set headers
    res.set({
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600'
    });

    res.send(content);
  } catch (error) {
    console.error('Proxy Error:', error.message);
    res.status(500).send('Error fetching content');
  }
});

// Proxy for static assets (JS, CSS)
app.get('/proxy/static/:file', async (req, res) => {
  const { file } = req.params;
  
  try {
    const response = await axios({
      method: 'get',
      url: `https://embed.su/static/${file}`,
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Referer': 'https://embed.su/',
        'Origin': 'https://embed.su'
      }
    });

    // Set correct MIME type based on file extension
    const ext = file.split('.').pop().toLowerCase();
    const mimeTypes = {
      'js': 'application/javascript',
      'css': 'text/css',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'svg': 'image/svg+xml'
    };

    res.set({
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400'
    });

    res.send(response.data);
  } catch (error) {
    console.error('Static Asset Error:', error.message);
    res.status(500).send('Error fetching static asset');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});