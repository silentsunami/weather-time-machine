"use strict";

/*
 * Tiny zero-dependency static file server for the Weather Time Machine.
 *
 * Used for:
 *   - Local development:  `npm start`  (http://localhost:3000)
 *   - Deploying to a Node web service (e.g. Render "Web Service", Railway,
 *     Fly.io, Heroku) that expects a process listening on $PORT.
 *
 * If you deploy to a *static* host (Render Static Site, GitHub Pages,
 * Netlify, Vercel) you don't need this file at all — those serve ./public
 * directly.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
// When unset, listen on all interfaces (IPv6 + IPv4 dual-stack) so both
// `localhost` (often ::1) and 127.0.0.1 work locally, and cloud hosts can reach it.
const HOST = process.env.HOST;
const PUBLIC_DIR = path.join(__dirname, "public");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8"
};

function handleRequest(req, res) {
  let reqPath = decodeURIComponent((req.url || "/").split("?")[0]);
  if (reqPath === "/") reqPath = "/index.html";

  const filePath = path.join(PUBLIC_DIR, path.normalize(reqPath));

  // Never allow escaping the public directory.
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("403 Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end('<h1>404 — Page not found</h1><p><a href="/">Back to the Weather Time Machine 🚀</a></p>');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
}

function listen(host, { primary }) {
  const server = http.createServer(handleRequest);
  server.on("error", (err) => {
    if (primary) {
      console.error(`Could not start server on ${host || "default"}:${PORT} — ${err.message}`);
      process.exit(1);
    }
    // The secondary (IPv6 loopback) listener is best-effort; ignore its errors.
  });
  server.listen(PORT, host, () => {
    if (primary) console.log(`🚀 Weather Time Machine running at http://127.0.0.1:${PORT}`);
  });
}

if (HOST) {
  // Explicit host requested — honour exactly that.
  listen(HOST, { primary: true });
} else {
  // Primary: all IPv4 interfaces (required by cloud hosts like Render).
  listen("0.0.0.0", { primary: true });
  // Best-effort extra listener so `localhost` (often ::1) also works on dev machines.
  listen("::1", { primary: false });
}
