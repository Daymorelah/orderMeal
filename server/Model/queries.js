
/**
 * Represents database queries used by the 
 * route handlers/Controllers
 * @constant
 * @type {object}
 */
const queries = {
  signup: 'INSERT INTO users (username, password, email) VALUES($1,$2,$3) RETURNING *',
  isUsernameValid: 'SELECT * FROM users WHERE username=',
  viewMenu: 'SELECT * FROM menu LIMIT 6',
};

export default queries;
