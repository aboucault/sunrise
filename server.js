const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = Number(process.env.PORT || 4175);

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.svg': 'image/svg+xml'
};

const routeMap = {
  '/': '/website/apnee-du-sommeil.html',
  '/apnee-du-sommeil': '/website/apnee-du-sommeil.html',
  '/apnee-du-sommeil.html': '/website/apnee-du-sommeil.html',
  '/blog': '/website/blog.html',
  '/blog.html': '/website/blog.html',
  '/commander': '/website/commander.html',
  '/commander.html': '/website/commander.html',
  '/styles.css': '/website/styles.css',
  '/masthead.js': '/website/masthead.js',
  '/quiz.js': '/website/quiz.js',
  '/app': '/app/index.html',
  '/app.html': '/app/index.html'
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);
  const requestPath = routeMap[url.pathname] || url.pathname;
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
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Sunrise prototype server running at http://127.0.0.1:${port}/`);
});

module.exports = server;
