const db = require('../database');

async function listAvailableCars() {
  try {
    const [cars] = await db.query(
      'SELECT * FROM Cars WHERE status = "available" ORDER BY createdAt DESC LIMIT 10'
    );
    return cars;
  } catch (error) {
    console.error('Error listing cars:', error);
    throw error;
  }
}

async function getCarDetails(carId) {
  try {
    const [cars] = await db.query(
      'SELECT * FROM Cars WHERE carID = ?',
      [carId]
    );
    return cars.length > 0 ? cars[0] : null;
  } catch (error) {
    console.error('Error getting car details:', error);
    throw error;
  }
}

async function addNewCar(carData) {
  try {
    const { make, model, year, price, sellerPhone } = carData;
    const [result] = await db.query(
      'INSERT INTO Cars (make, model, year, price, sellerPhone) VALUES (?, ?, ?, ?, ?)',
      [make, model, year, price, sellerPhone]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error adding new car:', error);
    throw error;
  }
}

async function purchaseCar(carId, buyerPhone) {
  try {
    // Get car details
    const car = await getCarDetails(carId);
    if (!car) {
      throw new Error('Car not found');
    }
    
    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();
    
    try {
      // Update car status
      await connection.query(
        'UPDATE Cars SET status = "sold" WHERE carID = ?',
        [carId]
      );
      
      // Record transaction
      await connection.query(
        'INSERT INTO Transactions (carID, buyerPhone, sellerPhone, amount) VALUES (?, ?, ?, ?)',
        [carId, buyerPhone, car.sellerPhone, car.price]
      );
      
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error purchasing car:', error);
    throw error;
  }
}

async function getUserTransactions(phoneNumber) {
  try {
    const [transactions] = await db.query(
      `SELECT t.*, c.make, c.model, c.year 
       FROM Transactions t 
       JOIN Cars c ON t.carID = c.carID 
       WHERE t.buyerPhone = ? OR t.sellerPhone = ? 
       ORDER BY t.transactionDate DESC`,
      [phoneNumber, phoneNumber]
    );
    return transactions;
  } catch (error) {
    console.error('Error getting user transactions:', error);
    throw error;
  }
}

module.exports = {
  listAvailableCars,
  getCarDetails,
  addNewCar,
  purchaseCar,
  getUserTransactions
};
