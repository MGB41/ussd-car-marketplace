const express = require('express');
const router = express.Router();
const db = require('../database');
const { handleSession } = require('../services/sessionService');
const { getMenu } = require('../services/menuService');

router.post('/', async (req, res) => {
  try {
    // Extract USSD parameters
    const { sessionId, phoneNumber, text } = req.body;
    
    // Handle session and get appropriate menu
    const session = await handleSession(sessionId, phoneNumber, text);
    const response = await getMenu(session);
    
    // Send response back to Africa's Talking
    res.set('Content-Type', 'text/plain');
    res.send(response);
  } catch (error) {
    console.error('USSD Error:', error);
    res.status(500).send('END An error occurred. Please try again later.');
  }
});

module.exports = router;