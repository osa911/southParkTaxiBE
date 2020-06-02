'use strict'

const { createLocalServer } = require('./src/')

const app = createLocalServer()
const PORT = process.env.SERVER_PORT || 5000

app.listen({ port: PORT }).then(({ url }) => console.log(`🚀 🚀 🚀 Server has been started on ${url} ❤️ ❤️ ❤️ `))
