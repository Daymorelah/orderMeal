const signupForm = document.querySelector('form');
const loginButton = document.querySelector('#login-button');

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();
  window.location = './UI/html/homePage.html';
});

loginButton.addEventListener('click', () => {
  window.location = `${location.origin}/UI/html/loginPage.html`;
});