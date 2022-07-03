// server.js
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const express = require('express')
const expressApp = express()

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000
// when using middleware `hostname` and `port` must be provided below
const nextApp = next({ dev, hostname, port })
const handle = nextApp.getRequestHandler()

const nextRouter = async (req, res) => {
  try {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    await handle(req, res, parsedUrl)
    
  } catch (err) {
    console.error('Error occurred handling', req.url, err)
    res.statusCode = 500
    res.end('internal server error')
  }
}

nextApp.prepare().then(() => {
  expressApp.use(nextRouter)
  expressApp.listen(port, () => {
    console.log(`next app listening on port ${port}`)
  })
})