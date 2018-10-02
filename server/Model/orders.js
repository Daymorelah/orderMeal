import pool from './db/connectToDb';
import {
  tableCreated,
  couldNotCreatTable,
  couldNotDropTable,
  somethingAwkwardHappened } from '../Utilities/helper';

const queryToCreateTable = `CREATE TYPE order_status AS ENUM 
  ('new', 'processing', 'cancelled', 'completed');
  CREATE TABLE orders(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    meal VARCHAR(255) NOT NULL,
    refreshment VARCHAR(255) NOT NULL,
    quantity SMALLINT NOT NULL,
    prize INTEGER NOT NULL,
    address TEXT NOT NULL,
    status order_status DEFAULT 'new' NOT NULL,
    userId SMALLINT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  )`;

const queryToStartWith = `DROP TABLE IF EXISTS orders CASCADE; 
  DROP TYPE IF EXISTS order_status`;

/**
 * Defines creating orders table
 * @constant
 * @function createOrdersTable
 * @returns {Promise}
 */
const createOrdersTable = () => new Promise((resolve, reject) => {
  pool.query(queryToStartWith, (err, res) => {
    if (err) {
      reject(couldNotDropTable('orders'));
    }
    if (res) {
      pool.query(queryToCreateTable, (error) => {
        if (error) {
          reject(couldNotCreatTable(), error);
        } else {
          resolve(tableCreated());
        }
      });
    } else {
      reject(somethingAwkwardHappened());
    }
  });
});
export default createOrdersTable;
