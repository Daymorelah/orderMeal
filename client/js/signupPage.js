const signupFormContainer = document.querySelector('#signup-form');
const signupForm = document.querySelector('form');
const loginButton = document.querySelector('#login-button');
const responseContainer = document.querySelector('#response-container');
const responseContent = document.querySelector('#response-container p');

signupForm.addEventListener('keypress', () => {
  responseContainer.style.display = 'none';
});

/* eslint-disable no-else-return */
const handleResponse = res => res.json().then((response) => {
  if (res.ok) {
    return response;
  } else {
    return Promise.reject(Object.assign({}, response, {
      status: res.status,
      statusText: res.statusText,
    }));
  }
});
/* eslint-disable no-else-return */

const showErrorMessage = (res, type) => {
  responseContainer.style.display = 'block';
  responseContainer.setAttribute('class', `${type}-response`);
  responseContent.textContent = `${res.data.message}!`;
};

signupForm.addEventListener('submit', (event) => {
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;
  const email = document.querySelector('#email').value;
  const userDetails = {
    username,
    password,
    email,
  };
  event.preventDefault();
  fetch(
    'https://ordermymeal.herokuapp.com/api/v1/auth/signup',
    {
      method: 'POST',
      body: JSON.stringify(userDetails),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ).then(handleResponse).then((res) => {
    localStorage.setItem('token', `${res.data.token}`);
    localStorage.setItem('userId', `${res.data.id}`);
    localStorage.setItem('username', `${res.data.username}`);
    showErrorMessage(res, 'success');
    signupFormContainer.style.display = 'none';
    signupForm.reset();
    setTimeout(() => {
      window.location = './userProfile.html';
    }, 2500);
  })
    .catch((error) => {
      showErrorMessage(error, 'error');
    });
});

loginButton.addEventListener('click', () => {
  window.location = './loginPage.html';
});
