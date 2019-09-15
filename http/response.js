const { STATUS_CODES } = require('http')

module.exports = class Response {

	constructor(socket) {
		this.socket = socket
		this.status = 200
		this.headersSent = false
		this.isChunked = false
		this.headers = {}
	}

	setStatus(status) {
		this.status = status
	}

	setHeader(key, value) {
		this.headers[key] = value
	}

	writeHead(statusCode = this.status, headers = {}) {
		if (!this.headersSent) {
			this.headersSent = true
			for (const key in headers) {
				this.setHeader(key, headers[key])
			}
			this.setHeader('Date', new Date().toGMTString())
			if (!this.headers['Content-Length']) {
				this.isChunked = true
				this.setHeader('Transfer-Encoding', 'chunked')
			}
			this.socket.write(`HTTP/1.1 ${statusCode} ${STATUS_CODES[statusCode]}\r\n`)
			for (const key in this.headers) {
				this.socket.write(`${key}: ${this.headers[key]}\r\n`)
			}
			this.socket.write('\r\n')
		}
	}

	write(chunk) {
		if (!this.headersSent) {
			if (!this.headers['Content-Length']) {
				this.isChunked = true
				this.setHeader('Transfer-Encoding', 'chunked')
			}
			this.writeHead()
		}
		if (this.isChunked) {
			const hexSize = chunk.length.toString(16)
			this.socket.write(hexSize + '\r\n')
			this.socket.write(chunk + '\r\n')
		} else {
			this.socket.write(chunk)
		}
	}

	end(chunk) {
		if (!this.headersSent) {
			if (!this.headers['Content-Length']) {
				this.setHeader('Content-Length', chunk ? chunk.length : 0)
			}
			this.writeHead()
		}
		if (this.isChunked) {
			if (chunk) {
				this.write(chunk)
			}
			this.socket.end('0\r\n\r\n')
		} else {
			this.socket.end(chunk)
		}
	}
}
