const path = require('path')

const express = require('express')

const SERVER_PORT = process.env.SERVER_PORT || 3000

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.listen(SERVER_PORT, () => {
  console.log(`server listening on port ${SERVER_PORT}`)
})