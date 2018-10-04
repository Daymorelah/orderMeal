/* eslint-disable no-else-return, no-unused-vars */
/**
 * Defines the method that handles the response form fetch
 * @param {object} res - Response object
 * @returns {object} - Object returned from the fetch method 
 */
const handleResponse = res => res.json().then((response) => {
  if (res.ok) {
    return response;
  } else {
    return Promise.reject(Object.assign({}, response, {
      status: res.status,
      statusText: res.statusText,
    }));
  }
});
/* eslint-disable no-else-return */
