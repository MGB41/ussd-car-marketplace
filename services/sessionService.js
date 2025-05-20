const db = require('../database');

async function handleSession(sessionId, phoneNumber, text) {
  try {
    // Check if session exists
    const [sessions] = await db.query(
      'SELECT * FROM Sessions WHERE sessionId = ?',
      [sessionId]
    );
    
    if (sessions.length === 0) {
      // Create new session
      await db.query(
        'INSERT INTO Sessions (sessionId, phoneNumber, userInput, currentMenu) VALUES (?, ?, ?, ?)',
        [sessionId, phoneNumber, text, 'welcome']
      );
      
      return {
        sessionId,
        phoneNumber,
        text: '',
        language: 'en',
        currentMenu: 'welcome',
        isNew: true
      };
    } else {
      // Update existing session
      const session = sessions[0];
      await db.query(
        'UPDATE Sessions SET userInput = ?, lastActivity = CURRENT_TIMESTAMP WHERE sessionId = ?',
        [text, sessionId]
      );
      
      // Process menu navigation based on user input
      const currentMenu = await processMenuNavigation(session, text);
      
      return {
        sessionId,
        phoneNumber,
        text,
        language: session.language,
        currentMenu,
        isNew: false
      };
    }
  } catch (error) {
    console.error('Session handling error:', error);
    throw error;
  }
}

async function processMenuNavigation(session, text) {
  // Split the text to get the latest input
  const inputs = text.split('*');
  const latestInput = inputs[inputs.length - 1];
  
  // Process based on current menu
  switch (session.currentMenu) {
    case 'welcome':
      // Language selection
      if (latestInput === '1') {
        await updateSessionLanguage(session.sessionId, 'en');
        return 'main';
      } else if (latestInput === '2') {
        await updateSessionLanguage(session.sessionId, 'rw');
        return 'main';
      }
      return 'welcome';
      
    case 'main':
      // Main menu selection
      if (latestInput === '1') {
        return 'browse_cars';
      } else if (latestInput === '2') {
        return 'sell_car';
      } else if (latestInput === '3') {
        return 'my_transactions';
      }
      return 'main';
      
    case 'browse_cars':
      // Handle car browsing
      if (latestInput === '0') {
        return 'main';
      }
      return 'car_details';
      
    case 'car_details':
      // Handle car details
      if (latestInput === '1') {
        return 'buy_car';
      } else if (latestInput === '0') {
        return 'browse_cars';
      }
      return 'car_details';
      
    case 'buy_car':
      // Handle car purchase
      if (latestInput === '1') {
        return 'confirm_purchase';
      } else if (latestInput === '0') {
        return 'car_details';
      }
      return 'buy_car';
      
    case 'confirm_purchase':
      // Handle purchase confirmation
      return 'purchase_complete';
      
    case 'sell_car':
      // Handle car selling
      if (latestInput === '0') {
        return 'main';
      }
      return 'sell_car_details';
      
    case 'my_transactions':
      // Handle transactions
      if (latestInput === '0') {
        return 'main';
      }
      return 'transaction_details';
      
    default:
      return 'welcome';
  }
}

async function updateSessionLanguage(sessionId, language) {
  await db.query(
    'UPDATE Sessions SET language = ?, currentMenu = ? WHERE sessionId = ?',
    [language, 'main', sessionId]
  );
}

module.exports = {
  handleSession
};