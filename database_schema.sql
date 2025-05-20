-- Sessions table for tracking user interactions
CREATE TABLE IF NOT EXISTS Sessions (
  sessionID VARCHAR(255) PRIMARY KEY,
  phoneNumber VARCHAR(20) NOT NULL,
  userInput TEXT,
  language VARCHAR(10) DEFAULT 'en',
  currentMenu VARCHAR(50),
  lastActivity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cars table for storing car listings
CREATE TABLE IF NOT EXISTS Cars (
  carID INT AUTO_INCREMENT PRIMARY KEY,
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  sellerPhone VARCHAR(20) NOT NULL,
  status ENUM('available', 'sold') DEFAULT 'available',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table for tracking car purchases
CREATE TABLE IF NOT EXISTS Transactions (
  transactionID INT AUTO_INCREMENT PRIMARY KEY,
  carID INT NOT NULL,
  buyerPhone VARCHAR(20) NOT NULL,
  sellerPhone VARCHAR(20) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  transactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (carID) REFERENCES Cars(carID)
);