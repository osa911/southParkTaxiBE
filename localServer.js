'use strict'
import { createLocalServer, prisma } from './src'

const server = createLocalServer()
const PORT = process.env.SERVER_PORT || 5000
try {
  prisma.connect()
  console.log('DB CONNECTED')
  server
    .listen({ port: PORT })
    .then(({ url }) => console.log(`🚀 🚀 🚀 Server has been started on ${url} ❤️ ❤️ ❤️ `))
} catch (e) {
  console.log('Server Error : ', e.message)
  prisma.disconnect()
  process.exit(1)
}
