const loginForm = document.querySelector('form');
const signupButton = document.querySelector('#signup-button');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  window.location = `${location.origin}/UI/html/homePage.html`;
});

signupButton.addEventListener('click', () => {
  window.location = `${location.origin}/UI/html/signupPage.html`;
});