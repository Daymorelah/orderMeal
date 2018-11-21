
const loginFormContainer = document.querySelector('#login-form');
const loginForm = document.querySelector('form');
const responseContainer = document.querySelector('#response-container');
const responseContent = document.querySelector('#response-container p');

/**
 * Adds an event listener for a keypress on the login form
 */
loginForm.addEventListener('keypress', () => {
  responseContainer.style.display = 'none';
});

/**
 * Defines the method that shows the response message returned form the fetch method
 * @param {object} res - Response object
 * @param {String} type - Type of message to show (error or success)
 */
const showResponseMessage = (res, type) => {
  responseContainer.style.display = 'block';
  responseContainer.setAttribute('class', `${type}-response`);
  responseContent.textContent = `${res.data.message}!`;
};

/* eslint-disable no-undef */
/**
 * Adds an event listener for a submit event on the login form
 */
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
    const decoded = jwt_decode(res.data.token);
    localStorage.setItem('decoded', JSON.stringify(decoded));
    localStorage.setItem('token', `${res.data.token}`);
    showResponseMessage(res, 'success');
    loginFormContainer.style.display = 'none';
    loginForm.reset();
    homePage = decoded.verified ? './mealsOrdered.html' : './availableOrders.html';
    setTimeout(() => {
      window.location = `${homePage}`;
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
/* eslint-enable no-undef */
