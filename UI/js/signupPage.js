const signupForm = document.querySelector('form');
const loginButton = document.querySelector('#login-button');

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();
  window.location = './homePage.html';
});

loginButton.addEventListener('click', () => {
  window.location = './loginPage.html';
});