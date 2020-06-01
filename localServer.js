'use strict'

const app = require('./src/')

const PORT = process.env.SERVER_PORT || 5000
app.listen(PORT, () => console.log(`🚀 🚀 🚀 Server has been started on port ${PORT} ❤️ ❤️ ❤️ `))
