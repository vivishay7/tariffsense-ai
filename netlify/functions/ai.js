// TariffSense AI — Gemini Proxy
// Deploy to Netlify. Set GEMINI_API_KEY in Netlify environment variables.
// Users never see or need an API key.

exports.handler = async (event) => {
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-ID',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    const { prompt, maxTokens = 1500 } = JSON.parse(event.body || '{}');

    if (!prompt || typeof prompt !== 'string') {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid prompt' }) };
    }

    const apiKey = process.env.GAK_GEMKEY;
    if (!apiKey) {
      return { statusCode: 503, headers: CORS, body: JSON.stringify({ error: 'AI service not configured. Set GAK_GEMKEY in Netlify environment variables.' }) };
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: Math.min(parseInt(maxTokens) || 1500, 2500), temperature: 0.3 }
      })
    });

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      return { statusCode: geminiRes.status, headers: CORS, body: JSON.stringify({ error: `Gemini error: ${errBody}` }) };
    }

    const data = await geminiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Empty response from AI' }) };

    return { statusCode: 200, headers: CORS, body: JSON.stringify({ text }) };

  } catch (e) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: e.message }) };
  }
};
