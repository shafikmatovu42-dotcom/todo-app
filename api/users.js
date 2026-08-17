import { redisGet, redisSet } from './_redis.js';

const DEFAULT_USERS = [
  { id: 'u1', name: 'System Admin', email: 'admin@upcorp.com', password: 'admin123', role: 'admin', joinedAt: '2026-08-01' },
  { id: 'u2', name: 'Enterprise Client', email: 'customer@upcorp.com', password: 'customer123', role: 'customer', joinedAt: '2026-08-05' }
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
    let users = await redisGet('up_app_users');
    if (!users || !Array.isArray(users) || users.length === 0) {
      users = DEFAULT_USERS;
      await redisSet('up_app_users', users);
    }
    return res.status(200).json(users);
  }

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { users } = body || {};
    if (!Array.isArray(users)) {
      return res.status(400).json({ error: 'Invalid payload: users array required' });
    }
    await redisSet('up_app_users', users);
    return res.status(200).json({ success: true, users });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
