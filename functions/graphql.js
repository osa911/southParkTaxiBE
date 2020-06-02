const { createLambdaServer, prisma } = require('./bundle')

const server = createLambdaServer()

try {
  prisma.connect()
  console.log('DB CONNECTED')
  prisma.user.findMany().then((res) => {
    console.log('USERS_LIST: ', res)
  })
} catch (e) {
  console.log('Server Error', e.message)
  prisma.disconnect()
  process.exit(1)
}

exports.handler = server.createHandler({
  cors: {
    origin: '*',
  },
  onHealthCheck(req) {
    console.log('onHealthCheck_req> ', req)
  },
})
