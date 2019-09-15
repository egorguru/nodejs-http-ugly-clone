const net = require('net')

const { createRequest } = require('./utils')
const Response = require('./response')

module.exports = class Server {

	constructor(requestListener) {
		this.server = net.createServer()
		this.server.on('connection', (socket) => {
			socket.once('readable', () => {
				const request = createRequest(socket)
				const response = new Response(socket)
				requestListener(request, response)
			})
		})
	}

	listen(...args) {
		this.server.listen(...args)
	}

	close() {
		this.server.close()
	}
}
