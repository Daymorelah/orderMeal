
/**
 * Represents database queries used by the 
 * route handlers/Controllers
 * @constant
 * @type {object}
 */
const queries = {
  signup: 'INSERT INTO users (username, password, email) VALUES($1,$2,$3) RETURNING *',
  orderHistory: 'SELECT * FROM orders WHERE userId=',
  isUsernameValid: 'SELECT * FROM users WHERE username=',
  viewMenu: 'SELECT * FROM menu LIMIT 6',
  createOrder: `INSERT INTO orders (name, meal, refreshment, quantity, prize, address, userId)
                VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
  getAllOrders: 'SELECT * FROM orders LIMIT 6',
};

export default queries;
