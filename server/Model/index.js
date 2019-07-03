
import createUsersTable from './users';
import createOrdersTable from './orders';
import createMenuTable from './menu';
/**
 * Creates tables for the app.
 * @constant
 * @function createTables
 */
const createTables = () => {
  createUsersTable().then((usersTableResult) => {
    console.log(usersTableResult); //eslint-disable-line
    createOrdersTable().then((ordersTableResult) => {
      console.log(ordersTableResult); //eslint-disable-line
      createMenuTable().then((menuTableResult) => {
        console.log(menuTableResult); //eslint-disable-line
        process.exit();
      }).catch(error => console.log(error)); //eslint-disable-line
    }).catch(error => console.log(error)); //eslint-disable-line
  }).catch(error => console.log(error)); //eslint-disable-line
};

createTables();
