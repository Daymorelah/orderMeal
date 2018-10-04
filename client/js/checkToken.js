
/**
 * Defines the method that checks if a token is present
 */
const checkToken = () => {
  if (localStorage.getItem('token') !== null) {
    window.location = './userProfile.html';
  }
};

checkToken();
