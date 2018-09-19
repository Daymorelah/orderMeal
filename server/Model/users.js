import pool from './db/connectToDb';

/**
 * Creates a user table
 * @constant
 * @function createUserTable
 * @returns {Promise}
 */
const createUserTable = () => new Promise((resolve, reject) => {
  pool.query('DROP TABLE IF EXISTS users CASCADE', (err, res) => {
    if (err) {
      reject(Error('An error occurred trying to drop table users. ', err));
    } else if (res) {
      pool.query(`CREATE TABLE users(
                  id SERIAL PRIMARY KEY,
                  username VARCHAR(255) NOT NULL UNIQUE,
                  password VARCHAR(255) NOT NULL,
                  email VARCHAR(255) NOT NULL UNIQUE
                  )`, (error, response) => {
          if (error) {
            reject(Error('An error occurred trying to create table users. ', error));
          }
          if (response) {
            resolve('Table users has been Created succesfully');
          }
        });
    } else {
      reject('Something awkward happened!!');
    }
  });
});

export default createUserTable;
