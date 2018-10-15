
/**
 * Defines the response when an internal server error occurs 
 * @param {object} res - Response object
 * @return {res} - Response object 
 */
export const sendServerError = (res) => {
  res.status(500).jsend.error({
    code: 500,
    message: 'Internal server error.',
  });
};

/**
 * Defines the response returned when an unauthorized user
 * tries to access a protected/restricted route
 * @param {object} res - Response object
 * @returns {res} - Response object 
 */
export const userNotAuthorized = (res) => {
  res.status(401).jsend.fail({
    code: 401,
    message: 'User not authorized',
  });
};

/**
 * Defines the error message returned when a database table could not be dropped
 * @param {string} tableName - Name of the database table to operate on
 * @returns {object} - A new error object 
 */
export const couldNotDropTable = tableName =>
  Error(`An error occurred trying to drop table ${tableName}.`);

/**
 * Defines the message returned when a query crates a table successfully
 * @param {string} tableName - Name of the database table to create
 * @returns {string} - Message signifying query completed successfully 
 */
export const tableCreated = tableName =>
  `Table ${tableName} has been Created successfully`;

/**
 * Defines the message returned when an error occurred while trying to create a table
 * @param {string} tableName - Name of the database table to operate on
 * @returns {string} - Returned message.
 */
export const couldNotCreatTable = tableName =>
  `An error occurred trying to create table ${tableName}`;

  /**
 * Defines the error message when an unforseen error occurs
 * @returns {string} - Message returned
 */
export const somethingAwkwardHappened = () =>
  'Something awkward happened!!';

/**
 * Defines the method to check for non-integer values in a string
 * @param {string} valueToCheck - String to check for non-integers
 * @returns {boolean} - Indicates if a non-integer value is found
 */
export const checkForInteger = valueToCheck => valueToCheck.search(/\D/g) === -1;

/**
 * Defines the failed message returned when a string contains non-integer values
 * @param {object} res - Response object 
 * @param {string} value - String to check for non-integer values
 * @returns {res} - Response object
 */
export const valueShouldBeInteger = (res, value) => {
  res.status(400).jsend.fail({
    code: 400,
    message: `The ${value} should be an integer.`,
  });
};

/**
 * Defines the failed message returned when required fields are missing.
 * @param {object} res - Response object
 * @returns {res} - Response object 
 */
export const allFieldsRequired = (res) => {
  res.status(400).jsend.fail({
    code: 400,
    message: 'Invalid request. All fields are required',
  });
};

/**
 * Defines the response returned when value queried for is null 
 * @param {object} res - Response object
 * @param {string} valueQueried - Value being queried for
 * @returns {res} - Response object
 */
export const noValuesYet = (res, valueQueried) => {
  res.jsend.success({
    code: 200,
    message: `There are no ${valueQueried} yet`,
    orders: null,
  });
};

/* eslint-disable no-useless-escape, consistent-return*/
/**
 * Defines the method that validate an array of strings. It ensures that
 * all element of the array is a string 
 * @param {array} arrayToCheck - Array whose elements we want to validate
 * @param {object} res - Response object
 * @returns {boolean} - Determine if the array is valid or not
 */
export const validateArrayOfStrings = (res, arrayToCheck) => {
  if (Array.isArray(arrayToCheck)) {
    arrayToCheck.forEach((element) => {
      if (element.search(/[^\w\s\.\-]/g) === -1) return true;
      res.status(400).jsend.fail({
        code: 400,
        message: 'Invalid string elements in meal/drink array',
      });
    });
  } else {
    res.status(400).jsend.fail({
      code: 400,
      message: 'meal and drink fields should be an Array',
    });
  }
};

/**
 * Defines the method that handles invalid string fields
 * @param {object} res - Response object
 * @returns {object} - Response object 
 */
export const stringFieldNotValid = (res) => {
  res.status(400).jsend.fail({
    code: 400,
    message: 'Invalid request. String fields should contain letters, numbers, -, . or _.',
  });
};

/* eslint-disable consistent-return, no-else-return */
/**
 * Defines the method that validate an array of objects. It ensures that
 * all element of the array is an object whose key value is a valid string 
 * @param {array} arrayToCheck - Array whose elements we want to validate
 * @param {object} res - Response object
 * @returns {boolean} - Determine if the array is valid or not
 */
export const validateArrayOfObjects = (res, arrayToCheck) => {
  if (Array.isArray(arrayToCheck)) {
    arrayToCheck.forEach((element) => {
      if (typeof (element) === 'object') {
        if (Object.keys(element)[0].search(/[^\w\s\.\-]/g) !== -1) return false;
      } else {
        res.status(400).jsend.fail({
          code: 400,
          message: 'Quantity field should be an Array of object(S)',
        });
      }
    });
    return true;
  } else {
    res.status(400).jsend.fail({
      code: 400,
      message: 'Quantity field should be an Array',
    });
  }
};

