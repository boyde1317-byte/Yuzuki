import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pushToGitHub } from "./utils/github.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const ZIP_PATH = path.join(__dirname, "../../tasks/Yuzuki-slim.zip");

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost`);

  if (url.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "ok", uptime: process.uptime() }));
  }

  if (url.pathname === "/download" || url.pathname === "/download/") {
    try {
      const stat = fs.statSync(ZIP_PATH);
      res.writeHead(200, {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=\"Yuzuki-slim.zip\"",
        "Content-Length": stat.size,
      });
      fs.createReadStream(ZIP_PATH).pipe(res);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("❌ File not found");
    }
    return;
  }

  if (url.pathname === "/push" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", async () => {
      try {
        let message = "Update from Yuzuki MD";
        try { message = JSON.parse(body).message || message; } catch {}
        const result = await pushToGitHub(message);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, ...result }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("🐋 Yuzuki MD is running");
});

server.listen(PORT, () => {
  console.log(`Health server listening on port ${PORT}`);
});

export default server;
