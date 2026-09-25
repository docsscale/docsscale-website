// Minimal static server that mimics how Hostinger serves the export:
// directory → index.html, "/about" → 301 "/about/", unknown paths → the
// matching 404.html (funnel 404 under /free-system/). POSTs to send-lead.php
// are answered like the real handler so forms can be exercised offline.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
};

export function startServer(root, port = 0) {
  const absRoot = path.resolve(root);
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);

    if (pathname.endsWith('send-lead.php')) {
      if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        return res.end('{"ok":false,"error":"Method not allowed."}');
      }
      let body = '';
      req.on('data', (c) => (body += c));
      req.on('end', () => {
        server.emit('lead', { path: pathname, body });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"ok":true}');
      });
      return;
    }

    let file = path.join(absRoot, pathname);
    if (!file.startsWith(absRoot)) {
      res.writeHead(400);
      return res.end();
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      if (!pathname.endsWith('/')) {
        res.writeHead(301, { Location: pathname + '/' + url.search });
        return res.end();
      }
      file = path.join(file, 'index.html');
    }
    if (!fs.existsSync(file)) {
      const in404 = pathname.startsWith('/free-system/') ? 'free-system/404.html' : '404.html';
      res.writeHead(404, { 'Content-Type': TYPES['.html'] });
      return fs.createReadStream(path.join(absRoot, in404)).pipe(res);
    }
    const type = TYPES[path.extname(file)] || 'application/octet-stream';
    // Compress text like Hostinger's CDN does, so performance runs are realistic.
    if (/gzip/.test(req.headers['accept-encoding'] || '') && /text|javascript|json|xml|svg/.test(type)) {
      res.writeHead(200, { 'Content-Type': type, 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' });
      return fs.createReadStream(file).pipe(zlib.createGzip()).pipe(res);
    }
    res.writeHead(200, { 'Content-Type': type });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}

// CLI: node tests/visual/serve.mjs <root> [port]
if (import.meta.url === `file://${process.argv[1]}`) {
  const [root = 'reference/live-2026-09-25', port = '8790'] = process.argv.slice(2);
  startServer(root, Number(port)).then((s) =>
    console.log(`Serving ${root} at http://127.0.0.1:${s.address().port}`),
  );
}
