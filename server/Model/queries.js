
/**
 * Represents database queries used by the
 * route handlers/Controllers
 * @constant
 * @type {object}
 */
const queries = {
  signup: 'INSERT INTO users (username, password, email, photo, is_email_verified, used_social_auth) VALUES($1,$2,$3,$4,$5,$6) RETURNING id, username, email',
  orderHistory: 'SELECT * FROM orders WHERE userId=$1',
  isUsernameValid: 'SELECT * FROM users WHERE username=$1',
  viewMenu: 'SELECT * FROM menu LIMIT 21',
  viewMenuFilter: 'SELECT * FROM menu WHERE meal_type=$1 LIMIT 12',
  createOrder: `INSERT INTO orders (name, meal, refreshment, quantity, prize, address, userId, phonenumber)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
  getAllOrders: 'SELECT * FROM orders LIMIT 6',
  getAnOrder: 'SELECT * FROM orders WHERE id=$1',
  addMealToMenu: `INSERT INTO menu (meal, prize, meal_type, userId)
                  values($1,$2,$3,$4) RETURNING *`,
  isOrderValid: 'SELECT status FROM orders WHERE id=$1',
  updateOrderStatus: 'UPDATE orders SET status=$1 WHERE id=$2 RETURNING *',
  editMenuItem: `UPDATE menu SET meal=$1, prize=$2, meal_type=$3
                  WHERE id IN (SELECT id from menu WHERE id=$4)`,
  doesEmailExist: 'SELECT email, username, id, is_email_verified FROM users WHERE email=$1',
  verifyUserEmail: 'UPDATE users SET is_email_verified=$1 WHERE username=$2 RETURNING email',
};

export default queries;
