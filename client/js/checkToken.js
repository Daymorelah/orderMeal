
const checkToken = () => {
  if (localStorage.getItem('token') !== null) {
    window.location = './userProfile.html';
  }
};

checkToken();
