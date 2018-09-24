
import pool from '../Model/db/connectToDb';
import queries from '../Model/queries';

/**
 * Class representing the menu controller
 * @description menu controller
 */
class MenuController {
  /**
   * 
   * @param {object} req - request object 
   * @param {object} res - response object
   * @returns {object} res - response from the server
   */
  static getAllMenu(req, res) {
    pool.query(queries.viewMenu, (error, response) => {
      if (error) {
        res.status(500).jsend.error({
          code: 500,
          message: 'Internal server error while processing your request.',
        });
      } else if (response) {
        if (response.rowCount) {
          res.jsend.success({
            code: 200,
            message: 'Request completed successfully',
            menu: response.rows,
          });
        } else {
          res.jsend.success({
            code: 200,
            message: 'Request completed successfully. No menu available yet.',
            menu: null,
          });
        }
      }
    });
  }
}

export default MenuController;
