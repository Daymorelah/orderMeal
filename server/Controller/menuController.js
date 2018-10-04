
import pool from '../Model/db/connectToDb';
import queries from '../Model/queries';
import { sendServerError } from '../Utilities/helper';

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
    if (req.query.filter) {
      pool.query(queries.viewMenuFilter, [`${req.query.filter}`], (error, response) => {
        if (error) {
          sendServerError(res);
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
              message: `Request completed successfully. No ${req.query.filter} available yet.`,
              menu: null,
            });
          }
        }
      });
    } else {
      pool.query(queries.viewMenu, (error, response) => {
        if (error) {
          sendServerError(res);
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
          sendServerError(res);
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
