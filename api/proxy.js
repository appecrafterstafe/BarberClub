// api/proxy.js
export default async function handler(req, res) {
  const SCRIPT_URL = process.env.VITE_SCRIPT_URL;

  if (!SCRIPT_URL) {
    return res.status(500).json({
      ok: false,
      message: 'Falta VITE_SCRIPT_URL en el entorno de Vercel'
    });
  }

  try {
    const method = req.method || 'GET';
    const body = ['GET', 'HEAD'].includes(method) ? undefined : req.body;

    const response = await fetch(SCRIPT_URL, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers?.authorization ? { Authorization: req.headers.authorization } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const text = await response.text();

    try {
      const json = JSON.parse(text);
      return res.status(response.status).json(json);
    } catch (err) {
      return res.status(response.status).send(text);
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Proxy error: ' + String(error)
    });
  }
}
