// Quick diagnostic script for Google Gemini API key
const apiKey = process.env.GEMINI_API_KEY;
const models = ['gemini-3-flash-preview', 'gemini-3.5-flash', 'gemini-3.8-flash'];

async function testGemini() {
  console.log('Testing Key:', apiKey.slice(0, 8) + '...' + apiKey.slice(-6));
  for (const m of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Respond in 3 words: Key is working' }] }]
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        console.log(`\n[SUCCESS] Model "${m}" responded: "${text}"`);
        console.log('\nYour Google Gemini API Key is 100% operational for Civil PM!\n');
        return;
      } else {
        console.log(`[Info] Model ${m} status: ${res.status}`);
      }
    } catch (e) {
      console.log(`[Info] Model ${m} connection error: ${e.message}`);
    }
  }
  console.log('\n[FAIL] Could not reach models. Please check your internet connection.\n');
}

testGemini();
