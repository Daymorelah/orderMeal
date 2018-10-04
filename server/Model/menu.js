import pool from './db/connectToDb';
import {
  tableCreated,
  couldNotCreatTable,
  couldNotDropTable,
  somethingAwkwardHappened } from '../Utilities/helper';

const queryToCreateTable = `CREATE TABLE menu(
  id SERIAL PRIMARY KEY,
  meal_type VARCHAR(255) NOT NULL,
  meal VARCHAR(255) NOT NULL,
  prize INTEGER NOT NULL,
  userId SMALLINT NOT NULL, 
  FOREIGN KEY (userId) REFERENCES users(id)  
  )`;

/**
 * Creates a user table
 * @constant
 * @function createMenuTable
 * @returns {Promise}
 */
const createMenuTable = () => new Promise((resolve, reject) => {
  pool.query('DROP TABLE IF EXISTS menu CASCADE', (err, res) => {
    if (err) {
      reject(couldNotDropTable('menu'));
    }
    if (res) {
      pool.query(queryToCreateTable, (error) => {
        if (error) {
          reject(couldNotCreatTable(), error);
        } else {
          resolve(tableCreated('menu'));
        }
      });
    } else {
      reject(somethingAwkwardHappened());
    }
  });
});

export default createMenuTable;
