const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = 4175;

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

http
  .createServer((req, res) => {
    const requestPath = req.url === '/' ? '/website/apnee-du-sommeil.html' : req.url;
    const safePath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, '');
    const filePath = path.join(root, safePath);

    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        res.writeHead(error.code === 'ENOENT' ? 404 : 500);
        res.end(error.code === 'ENOENT' ? 'Not found' : 'Server error');
        return;
      }

      const extension = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': contentTypes[extension] || 'application/octet-stream'
      });
      res.end(data);
    });
  })
  .listen(port, '127.0.0.1', () => {
    console.log(`Sunrise prototype server running at http://127.0.0.1:${port}/`);
  });
