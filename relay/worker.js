// Pourr relay service: a Cloudflare Worker that hands the app short-lived TURN
// credentials, so the long-term TURN key never appears in the public app.
//
// Settings (Worker → Settings → Variables and Secrets):
//   TURN_KEY_ID          text    the TURN key ID from Cloudflare Realtime
//   TURN_KEY_API_TOKEN   secret  the TURN key's API token
//   ALLOWED_ORIGINS      text    e.g. https://vjitintech.github.io,https://pourr.app

const TTL_SECONDS = 3600; // one hour is longer than any pour

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    const originOk = allowed.length === 0 || allowed.includes(origin);
    const cors = {
      'Access-Control-Allow-Origin': originOk && origin ? origin : (allowed[0] || '*'),
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    const { pathname } = new URL(request.url);
    if (pathname === '/' || pathname === '/health') {
      return json({ ok: true, service: 'pourr-relay' }, 200, cors);
    }
    if (pathname !== '/ice' || request.method !== 'GET') return json({ error: 'Not found' }, 404, cors);
    if (!originOk) return json({ error: 'This site is not allowed to use the Pourr relay.' }, 403, cors);
    if (!env.TURN_KEY_ID || !env.TURN_KEY_API_TOKEN) return json({ error: 'Relay is not configured yet.' }, 503, cors);

    const res = await fetch(
      `https://rtc.live.cloudflare.com/v1/turn/keys/${env.TURN_KEY_ID}/credentials/generate-ice-servers`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.TURN_KEY_API_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ttl: TTL_SECONDS }),
      }
    );
    if (!res.ok) return json({ error: `Cloudflare returned ${res.status}` }, 502, cors);

    const data = await res.json();
    const list = Array.isArray(data.iceServers) ? data.iceServers : [data.iceServers];
    // Browsers block port 53, so drop those addresses to avoid a slow timeout.
    const iceServers = list.filter(Boolean).map(s => ({
      ...s,
      urls: (Array.isArray(s.urls) ? s.urls : [s.urls]).filter(u => !/:53(\?|$)/.test(u)),
    }));

    return json({ iceServers, ttl: TTL_SECONDS }, 200, { ...cors, 'Cache-Control': 'no-store' });
  },
};

function json(body, status, headers) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } });
}
