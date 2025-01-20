import httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer({});
const TARGET_SERVER = process.env.TARGET_SERVER || "https://kliq-repo-backend.vercel.app"; // Your backend

export default function handler(req, res) {
  console.log("🚀 Proxy is running...");

  if (!TARGET_SERVER) {
    res.status(500).json({ error: "TARGET_SERVER is not set" });
    return;
  }

  console.log(`➡️ Forwarding request to: ${TARGET_SERVER}${req.url}`);

  proxy.web(req, res, { target: TARGET_SERVER, changeOrigin: true }, (err) => {
    console.error("❌ Proxy error:", err);
    res.status(500).json({ error: "Proxy failed" });
  });
}