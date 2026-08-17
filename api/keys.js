import { redisGet, redisSet } from './_redis.js';

const DEFAULT_KEYS = [
  { id: 'k1', name: 'JAHWI Gemini AI Key', provider: 'Google Cloud Engine', value: 'KEY_VAULT_GEMINI_V2_PRO_AUTHENTICATED', active: true, createdAt: '2026-08-06' }
];

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    let keys = await redisGet('up_api_keys');
    if (!keys || !Array.isArray(keys) || keys.length === 0) {
      keys = DEFAULT_KEYS;
      await redisSet('up_api_keys', keys);
    }
    return res.status(200).json(keys);
  }

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { keys } = body || {};
    if (!Array.isArray(keys)) {
      return res.status(400).json({ error: 'Invalid payload: keys array required' });
    }
    await redisSet('up_api_keys', keys);
    return res.status(200).json({ success: true, keys });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
