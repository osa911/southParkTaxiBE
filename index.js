const { ApolloServer } = require('apollo-server-express')
const { PrismaClient } = require('@prisma/client')
const express = require('express')
const path = require('path')
const cors = require('cors')
require('dotenv').config()

const schema = require('./src/schema')
const { isAuthenticated } = require('./src/utils/auth')

const app = express()
const prisma = new PrismaClient()

app.use(cors())

const server = new ApolloServer({
  schema,
  // debug: false,
  engine: {
    rewriteError: (error) => ({
      message: error.message,
      state: error.originalError && error.originalError.state,
      locations: error.locations,
      path: error.path,
    }),
  },
  context: ({ req }) => {
    const auth = isAuthenticated(req)
    return {
      auth,
      db: prisma,
    }
  },
})


if (process.env.NODE_ENV !== 'production') {
  server.applyMiddleware({ app, path: '/api' })
}

if (process.env.NODE_ENV === 'production') {
  server.applyMiddleware({ app, path: '/.netlify/functions/api' })
  app.use('/', express.static(path.join(__dirname, 'client')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
  })
}

const PORT = process.env.SERVER_PORT || 5000

async function start () {
  try {
    prisma.connect()
    app.listen(PORT, () => console.log(`🚀 🚀 🚀 Server has been started on port ${PORT} ❤️ ❤️ ❤️ `))
  } catch (e) {
    console.log('Server Error', e.message)
    prisma.disconnect()
    process.exit(1)
  }
}

start()
