const loginForm = document.querySelector('form');
const signupButton = document.querySelector('#signup-button');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  window.location = './userProfile.html';
});

signupButton.addEventListener('click', () => {
  window.location = './signupPage.html';
});
