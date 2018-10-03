
const checkToken = () => {
  if (localStorage.getItem('token') === null) {
    window.location = './signupPage.html';
  }
};

checkToken();
