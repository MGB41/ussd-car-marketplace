const db = require('../database');
const carService = require('./carService');
const transactionService = require('./transactionService');

// Menu text in different languages (keeping the existing code)
// ...

async function getMenu(session) {
  try {
    const { currentMenu, language, phoneNumber, text } = session;
    let menuContent = '';
    
    // Process menu based on current state
    switch (currentMenu) {
      case 'welcome':
        menuContent = menuText[language || 'en'].welcome;
        break;
        
      case 'main':
        menuContent = menuText[language || 'en'].main;
        break;
        
      case 'browse_cars':
        // Dynamically fetch available cars
        const cars = await carService.listAvailableCars();
        menuContent = language === 'rw' ? 'Imodoka zihari:\n' : 'Available Cars:\n';
        
        cars.forEach((car, index) => {
          menuContent += `${index + 1}. ${car.make} ${car.model} - $${car.price}\n`;
        });
        
        menuContent += language === 'rw' ? '0. Gusubira inyuma' : '0. Back to Main Menu';
        break;
        
      case 'car_details':
        // Extract car ID from user input
        const inputs = text.split('*');
        const carIndex = parseInt(inputs[inputs.length - 2]) - 1;
        const availableCars  = await carService.listAvailableCars();
        
        if (availableCars [carIndex]) {
          const car = cars[carIndex];
          menuContent = language === 'rw' 
            ? `Ibisobanuro by'imodoka:\nUbwoko: ${car.make}\nModeli: ${car.model}\nUmwaka: ${car.year}\nIgiciro: $${car.price}\n\n1. Gura iyi modoka\n0. Gusubira inyuma`
            : `Car Details:\nMake: ${car.make}\nModel: ${car.model}\nYear: ${car.year}\nPrice: $${car.price}\n\n1. Buy this car\n0. Back to car list`;
            
          // Store car ID in session for purchase
          await db.query(
            'UPDATE Sessions SET tempData = ? WHERE sessionId = ?',
            [JSON.stringify({ carId: car.carID }), session.sessionId]
          );
        } else {
          menuContent = language === 'rw' 
            ? 'Imodoka ntibashije kuboneka. Gerageza nanone.'
            : 'Car not found. Please try again.';
        }
        break;
        
      case 'buy_car':
        // Get car ID from session
        const [sessionData] = await db.query(
          'SELECT tempData FROM Sessions WHERE sessionId = ?',
          [session.sessionId]
        );
        
        if (sessionData.length > 0 && sessionData[0].tempData) {
          const { carId } = JSON.parse(sessionData[0].tempData);
          const car = await carService.getCarDetails(carId);
          
          menuContent = language === 'rw'
            ? `Ugiye kugura ${car.make} ${car.model} ku giciro cya $${car.price}\n1. Emeza kugura\n0. Guhagarika`
            : `You are about to purchase ${car.make} ${car.model} for $${car.price}\n1. Confirm Purchase\n0. Cancel`;
        } else {
          menuContent = language === 'rw'
            ? 'Habaye ikibazo. Gerageza nanone.'
            : 'An error occurred. Please try again.';
        }
        break;
        
      case 'confirm_purchase':
        // Process purchase
        const [purchaseSession] = await db.query(
          'SELECT tempData FROM Sessions WHERE sessionId = ?',
          [session.sessionId]
        );
        
        if (purchaseSession.length > 0 && purchaseSession[0].tempData) {
          const { carId } = JSON.parse(purchaseSession[0].tempData);
          await carService.purchaseCar(carId, phoneNumber);
          
          menuContent = language === 'rw'
            ? 'Twishimiye kukumenyesha ko ugiye kugura imodoka. Nyir\'imodoka azakuvugisha vuba.'
            : 'Congratulations! You have successfully purchased the car. The seller will contact you soon.';
        } else {
          menuContent = language === 'rw'
            ? 'Habaye ikibazo. Gerageza nanone.'
            : 'An error occurred. Please try again.';
        }
        break;
        
      case 'my_transactions':
        // Fetch user transactions
        const transactions = await carService.getUserTransactions(phoneNumber);
        menuContent = language === 'rw' ? 'Ubucuruzi bwawe:\n' : 'Your Transactions:\n';
        
        if (transactions.length === 0) {
          menuContent += language === 'rw' 
            ? 'Nta bucuruzi bwawe bwaboneka.'
            : 'No transactions found.';
        } else {
          transactions.forEach((transaction, index) => {
            const date = new Date(transaction.transactionDate).toISOString().split('T')[0];
            const isBuyer = transaction.buyerPhone === phoneNumber;
            
            menuContent += language === 'rw'
              ? `${index + 1}. ${transaction.make} ${transaction.model} - ${isBuyer ? 'Yaguwe' : 'Yagurishijwe'} ku wa ${date}\n`
              : `${index + 1}. ${transaction.make} ${transaction.model} - ${isBuyer ? 'Purchased' : 'Sold'} on ${date}\n`;
          });
        }
        
        menuContent += language === 'rw' ? '\n0. Gusubira inyuma' : '\n0. Back to Main Menu';
        break;
        
      // Add more cases for other menus
      
      default:
        menuContent = menuText[language || 'en'].welcome;
    }
    
    // Determine if this is a continuing session or end session
    const isEndSession = currentMenu === 'purchase_complete';
    const prefix = isEndSession ? 'END ' : 'CON ';
    
    return prefix + menuContent;
  } catch (error) {
    console.error('Menu service error:', error);
    return 'END An error occurred. Please try again later.';
  }
}

module.exports = {
  getMenu
};
