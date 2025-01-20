import httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer({});
const TARGET_SERVER = process.env.TARGET_SERVER || "https://kliq-repo-backend.vercel.app"; // Your backend API

export default function handler(req, res) {
  console.log("🚀 Proxy is running...");

  if (!TARGET_SERVER) {
    res.status(500).json({ error: "Target server is not set" });
    return;
  }

  console.log(`➡️ Forwarding request to: ${TARGET_SERVER}${req.url}`);

  // Prevent infinite loop by blocking proxy calls to itself
  if (req.headers.host.includes("proxy")) {
    res.status(500).json({ error: "Infinite loop detected - Proxy cannot call itself" });
    return;
  }

  proxy.web(req, res, { target: TARGET_SERVER, changeOrigin: true }, (err) => {
    console.error("❌ Proxy error:", err);
    res.status(500).json({ error: "Proxy failed" });
  });
}
