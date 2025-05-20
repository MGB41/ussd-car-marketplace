require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const ussdRouter = require('./routes/ussd');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/ussd', ussdRouter);

// Default route
app.get('/', (req, res) => {
  res.send('USSD Car Marketplace API is running');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});