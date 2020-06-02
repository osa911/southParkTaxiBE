const { createLambdaServer } = require('./bundle')

const server = createLambdaServer()

exports.handler = server.createHandler({
  cors: {
    origin: '*',
  },
})
