const signupButton = document.querySelector('form');
const loginButton = document.querySelector('#login-button');

signupButton.addEventListener('submit', (event) => {
  event.preventDefault();
  window.location = `${location.origin}/UI/html/homePage.html`;
});

loginButton.addEventListener('click', () => {
  window.location = `${location.origin}/UI/html/loginPage.html`;
});