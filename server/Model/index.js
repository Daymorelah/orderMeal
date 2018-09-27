
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
    console.log(usersTableResult);
    createOrdersTable().then((ordersTableResult) => {
      console.log(ordersTableResult);
      createMenuTable().then((menuTableResult) => {
        console.log(menuTableResult);
        process.exit();
      }).catch(error => console.log(error));
    }).catch(error => console.log(error));
  }).catch(error => console.log(error));
};

createTables();
