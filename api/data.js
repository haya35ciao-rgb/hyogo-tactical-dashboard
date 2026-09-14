const KEY = "hyogo_tactical_dashboard";

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

async function redis(command) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Redis environment variables are missing");

  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command)
  });

  if (!r.ok) throw new Error(`Redis request failed: ${r.status}`);
  return r.json();
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const result = await redis(["GET", KEY]);
      if (!result.result) return json(res, 200, { data: null });
      return json(res, 200, { data: JSON.parse(result.result) });
    }

    if (req.method === "PUT") {
      const auth = req.headers.authorization || "";
      const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

      if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
        return json(res, 401, { error: "unauthorized" });
      }

      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      if (!body || typeof body.data !== "object") {
        return json(res, 400, { error: "invalid_payload" });
      }

      const payload = JSON.stringify(body.data);
      if (payload.length > 900000) {
        return json(res, 413, { error: "payload_too_large" });
      }

      await redis(["SET", KEY, payload]);
      return json(res, 200, { ok: true });
    }

    res.setHeader("Allow", "GET, PUT");
    return json(res, 405, { error: "method_not_allowed" });
  } catch (e) {
    console.error(e);
    return json(res, 500, { error: "server_error" });
  }
}
