// Environment variables
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

// constants
const createOAuthAppAuth = require('@octokit/auth')['createOAuthAppAuth']
const cors = require('cors')
const express = require('express')
const app = express()
const config = require('./config')
const port = process.env.NODE_ENV === "production" ? process.env.PORT : 3003

// middleware
app.use(express.json())
app.use(cors())

app.get('/', async (req, res) => {
  try {
    const { query } = req
    const { code, env, scopes } = query
    const { clientIds } = config.github
    const clientId = clientIds[env]
    const clientSecret = process.env[`${env.toUpperCase()}_GITHUB_CLIENT_SECRET`]

    const auth = createOAuthAppAuth({
      clientId,
      clientSecret,
      code,
      scopes,
    })
    
    const tokenAuthentication = await auth({ type: "token" })
      .catch(c => null)
    
    res.send(tokenAuthentication || '')
  }
  catch (c) {
    console.error(c)
    res.send('')
  }
})

app.listen(port)
console.log(`Server running on port ${port}`)
