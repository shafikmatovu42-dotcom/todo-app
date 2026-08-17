// Helper utility for Upstash Redis REST API on Vercel

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export async function redisGet(key) {
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const res = await fetch(`${KV_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || data.result === null || data.result === undefined) return null;
    try {
      return typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
    } catch {
      return data.result;
    }
  } catch (err) {
    console.error(`[Redis GET Error ${key}]:`, err);
    return null;
  }
}

export async function redisSet(key, value) {
  if (!KV_URL || !KV_TOKEN) return false;
  try {
    const stringVal = typeof value === 'string' ? value : JSON.stringify(value);
    const res = await fetch(`${KV_URL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(['SET', key, stringVal])
    });
    return res.ok;
  } catch (err) {
    console.error(`[Redis SET Error ${key}]:`, err);
    return false;
  }
}
