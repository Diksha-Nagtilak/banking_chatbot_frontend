/**
 * Production Static File Server for Azure Web App (App Service / Linux Node.js)
 * Zero external dependencies - uses Node.js standard library.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=UTF-8',
};

const server = http.createServer((req, res) => {
  // Azure health check / ping
  if (req.url === '/health' || req.url === '/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', uptime: process.uptime(), timestamp: new Date().toISOString() }));
    return;
  }

  // Parse path without query string
  const cleanUrl = (req.url || '/').split('?')[0];
  let filePath = path.join(DIST_DIR, cleanUrl === '/' ? 'index.html' : cleanUrl);

  // Security check: prevent directory traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    // If file doesn't exist or is a directory, fallback to index.html for SPA routing
    if (err || !stats.isFile()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Cache control: assets with hashes can be cached long-term, index.html must not be cached aggressively
    const cacheControl = ext === '.html'
      ? 'no-cache, no-store, must-revalidate'
      : 'public, max-age=31536000, immutable';

    const headers = {
      'Content-Type': contentType,
      'Cache-Control': cacheControl,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
    };

    // Compress with gzip if supported
    const acceptEncoding = req.headers['accept-encoding'] || '';
    const readStream = fs.createReadStream(filePath);

    if (/\bgzip\b/.test(acceptEncoding) && (contentType.startsWith('text/') || contentType.includes('javascript') || contentType.includes('json') || contentType.includes('svg'))) {
      headers['Content-Encoding'] = 'gzip';
      res.writeHead(200, headers);
      readStream.pipe(zlib.createGzip()).pipe(res);
    } else {
      res.writeHead(200, headers);
      readStream.pipe(res);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[AegisBank Frontend] Production server running on http://0.0.0.0:${PORT}`);
  console.log(`[AegisBank Frontend] Serving static files from: ${DIST_DIR}`);
});
