require('dotenv').config();
const mysql = require('mysql2/promise');

async function initializeDatabase() {
  let connection;
  
  try {
    // Create connection without database selected
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    });
    
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`Database ${process.env.DB_NAME} created or already exists`);
    
    // Use the database
    await connection.query(`USE ${process.env.DB_NAME}`);
    
    // Create Sessions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Sessions (
        sessionID VARCHAR(255) PRIMARY KEY,
        phoneNumber VARCHAR(20) NOT NULL,
        userInput TEXT,
        language VARCHAR(10) DEFAULT 'en',
        currentMenu VARCHAR(50),
        tempData TEXT,
        lastActivity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Sessions table created or already exists');
    
    // Create Cars table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Cars (
        carID INT AUTO_INCREMENT PRIMARY KEY,
        make VARCHAR(50) NOT NULL,
        model VARCHAR(50) NOT NULL,
        year INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        sellerPhone VARCHAR(20) NOT NULL,
        status ENUM('available', 'sold') DEFAULT 'available',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Cars table created or already exists');
    
    // Create Transactions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Transactions (
        transactionID INT AUTO_INCREMENT PRIMARY KEY,
        carID INT NOT NULL,
        buyerPhone VARCHAR(20) NOT NULL,
        sellerPhone VARCHAR(20) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        transactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (carID) REFERENCES Cars(carID)
      )
    `);
    console.log('Transactions table created or already exists');
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initializeDatabase();