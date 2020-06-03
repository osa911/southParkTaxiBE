const { createLambdaServer, prisma } = require('./bundle')

const server = createLambdaServer()

try {
  prisma.connect()
  console.log('DB CONNECTED')
  const host = process.env.FE_HOST
  console.log('FE_host> ', host)
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
    origin: process.env.FE_HOST,
    credentials: true,
  },
})
