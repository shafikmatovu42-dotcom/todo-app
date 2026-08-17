import { redisGet, redisSet } from './_redis.js';

const DEFAULT_REQS = [
  {
    id: 'req_101',
    userId: 'u2',
    userName: 'Enterprise Client',
    userEmail: 'customer@upcorp.com',
    apiType: 'JAHWI AI Gateway (Gemini Pro Engine)',
    status: 'approved',
    requestedAt: '2026-08-08 14:30',
    approvedKey: 'UP_KEY_JAHWI_8A91F03C7E'
  },
  {
    id: 'req_102',
    userId: 'u2',
    userName: 'Enterprise Client',
    userEmail: 'customer@upcorp.com',
    apiType: 'UPShop Enterprise POS Sync API',
    status: 'pending',
    requestedAt: '2026-08-11 10:15',
    approvedKey: null
  }
];

export default async function handler(req, res) {
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
    let reqs = await redisGet('up_api_requests');
    if (!reqs || !Array.isArray(reqs) || reqs.length === 0) {
      reqs = DEFAULT_REQS;
      await redisSet('up_api_requests', reqs);
    }
    return res.status(200).json(reqs);
  }

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { requests } = body || {};
    if (!Array.isArray(requests)) {
      return res.status(400).json({ error: 'Invalid payload: requests array required' });
    }
    await redisSet('up_api_requests', requests);
    return res.status(200).json({ success: true, requests });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
