const fs = require('fs');
const path = require('path');

module.exports = async function () {
  const newsItems = [
    {
      "url": "https://www.tbsnews.net/economy/corporates/bscf-hosts-second-astronomy-camp-2025-1265951",
      "date": "2025-10-21"
    },
    {
      "url": "https://todaytvbd.com/today-nation/3093/",
      "date": "2026-05-23"
    },
    {
      "url": "https://dailyenglishtimes.com/?p=8073&utm_source=ReviveOldPost&utm_medium=social&utm_campaign=ReviveOldPost&fbclid=IwY2xjawQa6iVleHRuA2FlbQIxMQBicmlkETFROEdOblNJTWNFYzR5dXdWc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHigLVkD616wapcM4BYHEujqcu0xseZiG8gM8St91o6n5CLwmy38QE3WQcSbp_aem_CwSrRbSp9lbQjzwwuSFEHg",
      "date": "2024-05-15"
    },
    {
      "url": "https://www.bigganchinta.com/events/5awbnfw1ba?fbclid=IwY2xjawQatQpleHRuA2FlbQIxMQBicmlkETFGVlNXWXh4d0dQMW1XT3E5c3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHtBYfeicG6AagUDJJAuNEeJeIMRtOwx77jeZZvecdF03iQTZ4UdYyLbxUqb2_aem_LkVGTdYSWv_DDuGOMllEcA",
      "date": "2024-05-20"
    },
    {
      "url": "https://thedhakadiary.com/news/5677?fbclid=IwY2xjawQaogRleHRuA2FlbQIxMQBicmlkETFNMWdEU1M0dlI4TjlwM0ZZc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHjSoPVEXKe_4hKmgZpn-G30KwTG2Gb5s5OpwMTs6_lc_oaV1kWP86nJ-sUfI_aem_yRRhq2akzK1XPvg5aA9JVA",
      "date": "2025-10-08"
    },
    {
      "url": "https://www.somoynews.tv/news/2024-05-15/08IDw6uJ",
      "date": "2024-05-15"
    },
    {
      "url": "https://www.tbsnews.net/economy/corporates/bscf-hosts-second-astronomy-camp-2025-1265951",
      "date": "2025-10-21"
    },
    {
      "url": "https://dhakarshomoy.com/news-detail/7218?fbclid=IwY2xjawQZSyxleHRuA2FlbQIxMQBicmlkETFuZkhYUEJPZlp3bzlVazBPc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHvywu6D0uDfkLpXGTYmWDFhYAAHye3VyY61mJjtSJmwjdh2AJDU4dIr3sG6K_aem_XT23LWz7d94IJvSRZtLGSA",
      "date": "2025-11-14"
    },
    {
      "url": "https://spotlightnews24.com/bangladesh/872039?fbclid=IwY2xjawQZSuZleHRuA2FlbQIxMQBicmlkETFuZkhYUEJPZlp3bzlVazBPc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHiReF6kEmxfD0YxiuVV3wOK1QJy1_5-6NZlRNxopE7teNxIdNhCE0YxOg5lQ_aem_XeD_lX0MIQlktibf5sNIGQ",
      "date": "2025-11-15"
    },
    {
      "url": "https://www.bigganchinta.com/events/5a31zt4279?fbclid=IwY2xjawQZSMZleHRuA2FlbQIxMQBicmlkETFuZkhYUEJPZlp3bzlVazBPc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHmr6HiqUDEaX9XyuV2F6tLrwnkOkw1rmqV16T9mDkqLTfxA7malmVryHCnp__aem_YUKI6yUqLrLmVBy_rWULxA",
      "date": "2025-11-18"
    },
    {
      "url": "https://iid.dev/to-bridge-the-knowledge-gap-in-education-national-panel-calls-for-science-education-reform-in-bangladesh/",
      "date": "2025-09-15"
    }
  ];

  const results = [];

  const activeJsonFiles = new Set();
  const activeImageFiles = new Set();

  // Create a cache directory for the API responses
  const cacheDir = path.join(process.cwd(), '.cache', 'microlink');
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  // Create a directory for cached images
  const imageDir = path.join(process.cwd(), 'src', 'contents', 'news-images');
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }

  // Helper to download image
  async function downloadImage(url, filename) {
    const dest = path.join(imageDir, filename);
    if (fs.existsSync(dest)) return `/contents/news-images/${filename}`;

    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        }
      });
      if (!res.ok) throw new Error(`Failed to fetch image: HTTP ${res.status} ${res.statusText}`);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(dest, buffer);
      return `/contents/news-images/${filename}`;
    } catch (e) {
      console.error("Error downloading image:", url, e.message);
      return null;
    }
  }

  // Helper for delay to avoid rate limits
  const delay = ms => new Promise(res => setTimeout(res, ms));

  for (let item of newsItems) {
    // 1. Clean URL to avoid tracking parameters which often break preview APIs
    let cleanUrlObj;
    try {
      cleanUrlObj = new URL(item.url);
      cleanUrlObj.searchParams.delete('fbclid');
      cleanUrlObj.searchParams.delete('utm_source');
      cleanUrlObj.searchParams.delete('utm_medium');
      cleanUrlObj.searchParams.delete('utm_campaign');
    } catch (e) {
      console.error("Invalid URL:", item.url);
      results.push({ ...item, preview: null });
      continue;
    }

    let cleanUrl = cleanUrlObj.toString();

    // Basic hash for filename
    let cacheKey = Buffer.from(cleanUrl).toString('base64').replace(/[/+=]/g, '_');
    let jsonFilename = cacheKey + '.json';
    activeJsonFiles.add(jsonFilename);
    let cacheFile = path.join(cacheDir, jsonFilename);

    let previewData = null;

    if (fs.existsSync(cacheFile)) {
      try {
        previewData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      } catch (e) { }
    }

    if (!previewData) {
      // Not in cache, fetch from API
      try {
        await delay(800); // 800ms delay to be safe with Microlink rate limits
        let apiReq = `https://api.microlink.io?url=${encodeURIComponent(cleanUrl)}`;
        let response = await fetch(apiReq);
        let res = await response.json();

        if (res.status === 'success') {
          previewData = res.data;
          // Only save to cache if we actually got a title
          if (previewData.title) {
            fs.writeFileSync(cacheFile, JSON.stringify(previewData));
          }
        } else {
          console.error("Microlink API error for", cleanUrl, res);
        }
      } catch (e) {
        console.error("Error fetching preview for", cleanUrl, e.message);
      }
    }

    if (previewData) {
      // Download the image if available
      if (previewData.image && previewData.image.url) {
        let ext = path.extname(new URL(previewData.image.url).pathname) || '.jpg';
        if (ext.length > 5) ext = '.jpg'; // Fallback if no valid extension
        let imageFilename = `thumb_${cacheKey}${ext}`;
        activeImageFiles.add(imageFilename);

        let localUrl = await downloadImage(previewData.image.url, imageFilename);
        if (localUrl) {
          previewData.image.localUrl = localUrl;
        }
      }

      results.push({
        ...item,
        url: cleanUrl, // update to cleaned URL
        preview: previewData
      });
    } else {
      results.push({ ...item, url: cleanUrl, preview: null });
    }
  }

  // --- Orphan Cleanup ---
  try {
    const existingJsonFiles = fs.readdirSync(cacheDir);
    for (let file of existingJsonFiles) {
      if (file.endsWith('.json') && !activeJsonFiles.has(file)) {
        fs.unlinkSync(path.join(cacheDir, file));
        console.log(`Cleaned up orphan JSON: ${file}`);
      }
    }

    const existingImageFiles = fs.readdirSync(imageDir);
    for (let file of existingImageFiles) {
      if (!activeImageFiles.has(file)) {
        fs.unlinkSync(path.join(imageDir, file));
        console.log(`Cleaned up orphan image: ${file}`);
      }
    }
  } catch (err) {
    console.error("Cleanup error:", err);
  }

  return results;
};
