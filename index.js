const http = require('./http')

http
	.createServer((req, res) => {
		switch (req.url) {
			case '/get-message':
				res.writeHead(200, { 'Content-Type': 'text/plain' })
				res.end('Hello There')
				break
			case '/get-request-body':
				req.on('data', (buffer) => {
					res.setHeader('Content-Type', 'application/json')
					res.end(buffer)
				})
				break
			case '/chunk-data':
				res.setHeader('Content-Type', 'text/plain')
				res.write('First Message\n')
				setTimeout(() => res.end('Second Message'), 3000)
				break
			default:
				res.setHeader('Content-Type', 'text/plain')
				res.end('Mock')
		}
	})
	.listen(8080, () => console.log('START'))
