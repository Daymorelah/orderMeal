import pool from './db/connectToDb';
import {
  tableCreated,
  couldNotCreatTable,
  couldNotDropTable,
  somethingAwkwardHappened,
} from '../Utilities/helper';

const queryToCreateTable = `CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
  )`;

/**
 * Defines creating a user table
 * @constant
 * @function createUserTable
 * @returns {Promise}
 */
const createUserTable = () => new Promise((resolve, reject) => {
  pool.query('DROP TABLE IF EXISTS users CASCADE', (err, res) => {
    if (err) {
      reject(couldNotDropTable('users'));
    }
    if (res) {
      pool.query(queryToCreateTable, (error) => {
        if (error) {
          reject(couldNotCreatTable(), error);
        } else {
          resolve(tableCreated('users'));
        }
      });
    } else {
      reject(somethingAwkwardHappened());
    }
  });
});

export default createUserTable;
