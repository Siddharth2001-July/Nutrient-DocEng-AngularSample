const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Load JWT private key
const jwtKeyPath = path.join(__dirname, 'config', 'nutrient', 'jwt.pem');
const jwtKey = fs.readFileSync(jwtKeyPath, 'utf8');

// JWT preparation function
const prepareJwt = function (documentId) {
  const claims = {
    document_id: documentId,
    permissions: ["read-document", "write", "download"],
  };

  return jwt.sign(claims, jwtKey, {
    algorithm: "RS256",
    expiresIn: 60 * 60, // 1 hour
    allowInsecureKeySizes: true,
  });
};

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running' });
});

app.get('/api/data', (req, res) => {
  res.json({ 
    message: 'Data from backend API',
    timestamp: new Date().toISOString(),
    data: {
      users: 10,
      documents: 25,
      status: 'active'
    }
  });
});

// JWT endpoint for Nutrient Document Engine
app.post('/api/jwt', (req, res) => {
  try {
    const { documentId } = req.body;
    
    if (!documentId) {
      return res.status(400).json({ error: 'documentId is required' });
    }

    const token = prepareJwt(documentId);
    res.json({ jwt: token });
  } catch (error) {
    console.error('JWT generation error:', error);
    res.status(500).json({ error: 'Failed to generate JWT' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});