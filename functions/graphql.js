const { createLambdaServer, prisma } = require('./bundle')

const server = createLambdaServer()

try {
  prisma.connect()
} catch (e) {
  console.log('Server Error', e.message)
  prisma.disconnect()
  process.exit(1)
}

exports.handler = server.createHandler({
  cors: {
    origin: process.env.FE_HOST,
    credentials: true,
  },
})
