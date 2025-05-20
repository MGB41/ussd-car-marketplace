# USSD Car Marketplace Application

A USSD application for buying and selling cars with support for English and Kinyarwanda languages.

## Features

- Multi-language support (English and Kinyarwanda)
- Session management
- Car browsing and purchasing
- Transaction history
- Database integration

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   AFRICAS_TALKING_API_KEY=your_api_key
   AFRICAS_TALKING_USERNAME=sandbox
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   DB_PORT=3306
   ```
4. Initialize the database:
   ```
   node initDb.js
   ```
5. Start the application:
   ```
   npm start
   ```

## API Endpoints

- `POST /ussd` - USSD endpoint for Africa's Talking

## Menu Flow

1. Welcome Screen (Language Selection)
   - English
   - Kinyarwanda

2. Main Menu
   - Browse Cars
   - Sell a Car
   - My Transactions

3. Browse Cars
   - List of available cars
   - Car details
   - Purchase flow

4. My Transactions
   - List of past transactions
   - Transaction details

## Database Schema

- Sessions: Tracks user sessions and navigation
- Cars: Stores car listings
- Transactions: Records car purchases
```

## 7. Deployment Configuration for Render

Create a `render.yaml` file for deployment on Render:

```yaml:render.yaml
services:
  - type: web
    name: ussd-car-marketplace
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: PORT
        value: 3000
      - key: AFRICAS_TALKING_API_KEY
        sync: false
      - key: AFRICAS_TALKING_USERNAME
        value: sandbox
      - key: DB_HOST
        sync: false
      - key: DB_USER
        sync: false
      - key: DB_PASSWORD
        sync: false
      - key: DB_NAME
        sync: false
      - key: DB_PORT
        value: 3306
```

## 8. Final Steps

1. Test the application locally:
```bash
npm run dev