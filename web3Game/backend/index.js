import express from 'express'
// turn this commonjs import into an es6 import
import { verifyMessage } from '@wagmi/core'
import { config } from './utils.js'
const app = express()
const port = 3001

// Use middleware to parse JSON bodies
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})
// POST /verify we get the signature and the message and address from the client
app.post('/verify', async (req, res) => {
  const { signature, message, address } = req.body
  console.log(signature, message, address)
  // We use the verifyMessage function from the wagmi package
  const result = await verifyMessage(config, {
    address: address,
    message: message,
    signature: signature,
  })
  console.log(result)
  res.send(JSON.stringify({ result:result }))
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})