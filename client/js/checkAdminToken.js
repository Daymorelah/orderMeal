
/**
 * Defines the method that checks if an admin token is present
 */
const checkAdminToken = () => {
  if (localStorage.getItem('decoded') !== null) {
    const verified = JSON.parse(localStorage.getItem('decoded')).verified;
    if (verified === undefined) {
      window.location = './loginPage.html';
    }
  } else {
    window.location = './loginPage.html';
  }
};

checkAdminToken();
