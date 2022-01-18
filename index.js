const http = require('http');
const fs = require('fs');
const path = require('path');


function isFile(filename) {
	return fs.lstatSync(filename).isFile();
}

function isDirectory(filename) {
	return fs.lstatSync(filename).isDirectory();
}

function getList(executionDir) {
	return fs.readdirSync(executionDir);
}

let currentUrl = process.cwd();
const server = http.createServer((req, res) => {
	if (req.method === 'GET' && req.url !== '/favicon.ico' && !req.url.includes('/file')) {
		if (req.url === '/') {
			currentUrl = process.cwd();
		}
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});

		currentUrl += req.url;
		currentUrl = path.normalize(currentUrl);

		getList(currentUrl).forEach((el) => {
			let pathFile = path.normalize(currentUrl + '/' + el);

			if (isDirectory(pathFile)) {
				res.write(`<a href="/${el}" style="text-decoration:none; color:#ff9800;">${el}</a><br>`);
			}
		});
		getList(currentUrl).forEach((el) => {
			let pathFile = path.normalize(currentUrl + '/' + el);

			if (isFile(pathFile)) {
				res.write(`<a href="/file/${el}">${el}</a><br>`);
			}
		});
		res.end();
	}

	if (req.url.includes('/file')) {
		let url = path.normalize(currentUrl + '/' + path.basename(req.url));

		const data = fs.readFileSync(url, 'utf-8');
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});
		res.end(data);
	}
})
server.listen(3000, 'localhost');