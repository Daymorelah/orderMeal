
/**
 * Represents database queries used by the 
 * route handlers/Controllers
 * @constant
 * @type {object}
 */
const queries = {
  signup: 'INSERT INTO users (username, password, email) VALUES($1,$2,$3) RETURNING *',
  orderHistory: 'SELECT * FROM orders WHERE userId=$1',
  isUsernameValid: 'SELECT * FROM users WHERE username=$1',
  viewMenu: 'SELECT * FROM menu LIMIT 12',
  viewMenuFilter: 'SELECT * FROM menu WHERE meal_type=$1 LIMIT 12',
  createOrder: `INSERT INTO orders (name, meal, refreshment, quantity, prize, address, userId)
                VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
  getAllOrders: 'SELECT * FROM orders LIMIT 6',
  getAnOrder: 'SELECT * FROM orders WHERE id=$1',
  addMealToMenu: `INSERT INTO menu (meal, prize, meal_type, userId)
                  values($1,$2,$3,$4) RETURNING *`,
  isOrderValid: 'SELECT status FROM orders WHERE id=$1',
  updateOrderStatus: 'UPDATE orders SET status=$1 WHERE id=$2 RETURNING *',
};

export default queries;
