const Server = require('./server')

exports.createServer = (requestListener) => new Server(requestListener)
