
import pool from '../Model/db/connectToDb';
import queries from '../Model/queries';

/**
 * Class representing the menu controller
 * @class MenuController
 * @description menu controller
 */
class MenuController {
  /**
   * Get Available Menu
   * Route: Get: /menu
   * @param {object} req - request object 
   * @param {object} res - response object
   * @returns {object} res - response object
   * @memberof MenuController
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

  /**
   * Add Meal To Menu
   * Route: POST: /menu
   * @param {object} req - request object 
   * @param {object} res - response object
   * @returns {res} res - response object
   * @memberof MenuController
   */
  static addMealToMenu(req, res) {
    const { meal, prize, mealType } = req.body;
    const { userId } = req.decoded;
    pool.query(`${queries.addMealToMenu}`, [`${meal}`, `${prize}`, `${mealType}`, `${userId}`],
      (err, response) => {
        if (err) {
          res.status(500).jsend.error({
            code: 500,
            message: 'Internal server error.',
          });
        } else if (response) {
          if (response.rowCount) {
            res.status(201).jsend.success({
              code: 201,
              message: 'Request completed successfully',
              menuCreated: response.rows,
            });
          }
        }
      });
  }
}

export default MenuController;
