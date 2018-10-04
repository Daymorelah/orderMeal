
/**
 * Defines the method that checks if a token is present
 */
const checkIfNotRegistered = () => {
  if (localStorage.getItem('token') !== null) {
    window.location = './userProfile.html';
  }
};

checkIfNotRegistered();
