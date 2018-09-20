import pool from './db/connectToDb';

/**
 * Creates a user table
 * @constant
 * @function createOrdersTable
 * @returns {Promise}
 */
const createOrdersTable = () => new Promise((resolve, reject) => {
  pool.query('DROP TABLE IF EXISTS orders CASCADE', (err, res) => {
    if (err) {
      reject(Error('An error occurred trying to drop table orders.'));
    } else if (res) {
      pool.query(`CREATE TABLE orders(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        meal VARCHAR(255) NOT NULL,
        refreshment VARCHAR(255) NOT NULL,
        quantity SMALLINT NOT NULL,
        prize INTEGER NOT NULL,
        address TEXT NOT NULL,
        userId SMALLINT NOT NULL, 
        FOREIGN KEY (userId) REFERENCES users(id)
        )`, (error, response) => {
          if (error) {
            reject(Error('An error occurred trying to create table orders.'));
          } else if (response) {
            resolve('Table orders has been created successfully.');
          }
        });
    } else {
      reject('Something awkward happened!!');
    }
  });
});

export default createOrdersTable;
