const db = require('../database');

async function getTransactionDetails(transactionId) {
  try {
    const [transactions] = await db.query(
      `SELECT t.*, c.make, c.model, c.year, c.price 
       FROM Transactions t 
       JOIN Cars c ON t.carID = c.carID 
       WHERE t.transactionID = ?`,
      [transactionId]
    );
    return transactions.length > 0 ? transactions[0] : null;
  } catch (error) {
    console.error('Error getting transaction details:', error);
    throw error;
  }
}

module.exports = {
  getTransactionDetails
};