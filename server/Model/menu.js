import pool from './db/connectToDb';

/**
 * Creates a user table
 * @constant
 * @function createMenuTable
 * @returns {Promise}
 */
const createMenuTable = () => new Promise((resolve, reject) => {
  pool.query('DROP TABLE IF EXISTS menu CASCADE', (err, res) => {
    if (err) {
      reject(Error('An error occurred trying to drop table menu.'));
    } else if (res) {
      pool.query(`CREATE TABLE menu(
        id SERIAL PRIMARY KEY,
        meal_type VARCHAR(255) NOT NULL,
        meal VARCHAR(255) NOT NULL,
        prize INTEGER NOT NULL,
        userId SMALLINT NOT NULL, 
        FOREIGN KEY (userId) REFERENCES users(id)  
        )`, (error, response) => {
          if (error) {
            reject(Error('An error occurred trying to create table menu.'));
          } else if (response) {
            resolve('Table menu has been created successfully.');
          }
        });
    } else {
      reject('Something awkward happened!!');
    }
  });
});

export default createMenuTable;
