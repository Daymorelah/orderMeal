
const loginFormContainer = document.querySelector('#login-form');
const loginForm = document.querySelector('form');
const responseContainer = document.querySelector('#response-container');
const responseContent = document.querySelector('#response-container p');

loginForm.addEventListener('keypress', () => {
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

const showResponseMessage = (res, type) => {
  responseContainer.style.display = 'block';
  responseContainer.setAttribute('class', `${type}-response`);
  responseContent.textContent = `${res.data.message}!`;
};

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;
  const userDetails = {
    username,
    password,
  };
  const loginButton = event.target.children.item(2);
  loginButton.disabled = 'true';
  loginButton.textContent = 'Logging in ...';
  fetch(
    'https://ordermymeal.herokuapp.com/api/v1/auth/login',
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
    showResponseMessage(res, 'success');
    loginFormContainer.style.display = 'none';
    loginForm.reset();
    setTimeout(() => {
      window.location = './availableOrders.html';
    }, 2500);
  }).catch((error) => {
    loginButton.disabled = false;
    loginButton.textContent = 'Login';
    if (error.message === 'Failed to fetch') {
      responseContainer.style.display = 'block';
      responseContainer.setAttribute('class', 'error-response');
      document.querySelector('#response-container').textContent = `
        No internet connection. Check Your connection`;
    } else {
      showResponseMessage(error, 'error');
    }
  });
});

