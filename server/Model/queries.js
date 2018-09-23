
/**
 * Represents database queries used by the 
 * route handlers/Controllers
 * @constant
 * @type {object}
 */
const queries = {
  signup: 'INSERT INTO users (username, password, email) VALUES($1,$2,$3) RETURNING *',
  isUsernameValid: 'SELECT * FROM users WHERE username=',
  createOrder: `INSERT INTO orders (name, meal, refreshment, quantity, prize, address, userId)
                VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
};

export default queries;
