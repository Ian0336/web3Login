import express from 'express'
// turn this commonjs import into an es6 import
import { verifyMessage } from '@wagmi/core'
import { config } from './utils.js'
import cors from 'cors'
import { generateTokens } from './utils/jwt.js'
import { MESSAGE_EXPIRY } from './config/auth.js'

const app = express()
const port = 3001

// Store for nonces (in production, use Redis or a database)
const nonceStore = new Map();

const userText = {}
// Use middleware to parse JSON bodies
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3000'
}))
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/auth/nonce', (req, res) => {
  const nonce = Math.floor(Math.random() * 1000000)
  const timestamp = Date.now()
  
  // Store the nonce and timestamp
  nonceStore.set(nonce.toString(), timestamp)
  
  // Clean up old nonces
  for (const [storedNonce, storedTimestamp] of nonceStore.entries()) {
    if (Date.now() - storedTimestamp > MESSAGE_EXPIRY) {
      nonceStore.delete(storedNonce)
    }
  }
  
  res.json({ 
    message: `Sign this message to log in to the application\nNonce: ${nonce}\nTimestamp: ${timestamp}`, 
    nonce: nonce 
  })
})
// POST /verify we get the signature and the message and address from the client
app.post('/api/auth/login', async (req, res) => {
  try {
    const { signature, message, address } = req.body
    
    // Extract nonce and timestamp from message
    const nonceMatch = message.match(/Nonce: (\d+)/)
    const timestampMatch = message.match(/Timestamp: (\d+)/)
    
    if (!nonceMatch || !timestampMatch) {
      return res.status(400).json({ error: 'Invalid message format' })
    }
 
    
    const nonce = nonceMatch[1]
    const timestamp = parseInt(timestampMatch[1])
    
    // Verify nonce exists and hasn't expired
    const storedTimestamp = nonceStore.get(nonce)
    if (!storedTimestamp || storedTimestamp !== timestamp) {
      return res.status(400).json({ error: 'Invalid or expired nonce' })
    }
    
    // Check message expiry
    if (Date.now() - timestamp > MESSAGE_EXPIRY) {
      return res.status(400).json({ error: 'Message has expired' })
    }

    // Verify the signature
    const isValid = await verifyMessage(config, {
      address,
      message,
      signature
    })
    
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid signature' })
    }
    
    // Remove used nonce
    nonceStore.delete(nonce)
    
    // Generate JWT tokens
    const tokens = generateTokens(address)
    
    res.json(tokens)
  } catch (error) {
    console.error("Verification error:", error)
    res.status(400).json({ error: 'Verification failed' })
  }
})
// Verify JWT token
app.post('/api/auth/verifyToken', (req, res) => {
  const { token } = req.body
  const decoded = verifyToken(token)
  res.json(decoded)
})

// get user's text 
app.get('/api/data/text', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const address = decoded.address;
    const text = userText[address];
    res.json({ text: text || "" });
  } catch (error) {
    console.error('Error getting text:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// set user's text
app.post('/api/data/text', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const address = decoded.address;
    const text = req.body.text;
    if (typeof text !== 'string') {
      return res.status(400).json({ error: 'Text must be a string' });
    }

    userText[address] = text;
    res.json({ success: true });
  } catch (error) {
    console.error('Error setting text:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})