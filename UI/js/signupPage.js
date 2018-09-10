const signupButton = document.querySelector('signup-button');
const loginButton = document.querySelector('login-button');

signupButton.addEventListener('click', () => {
  window.location = `${location.origin}/UI/html/homePage.html`;
});

loginButton.addEventListener('click', () => {
  window.location = `${location.origin}/UI/html/loginPage.html`;
});