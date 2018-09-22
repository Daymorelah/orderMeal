
/**
 * Represents database queries used by the 
 * route handlers/Controllers
 * @constant
 * @type {object}
 */
const queries = {
  signup: 'INSERT INTO users (username, password, email) VALUES($1,$2,$3) RETURNING *',
  orderHistory: 'SELECT * FROM orders WHERE userId=',
};

export default queries;
