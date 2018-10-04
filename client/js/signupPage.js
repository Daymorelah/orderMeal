const signupFormContainer = document.querySelector('#signup-form');
const signupForm = document.querySelector('form');
const responseContainer = document.querySelector('#response-container');
const responseContent = document.querySelector('#response-container p');

/**
 * Adds an event listener for a keypress on the signup form
 */
signupForm.addEventListener('keypress', () => {
  responseContainer.style.display = 'none';
});

/**
 * Defines a method that shows the error message from a fetch
 * @param {object} res - Response object 
 * @param {string} type - Type of message to show (error or success)
 */
const showErrorMessage = (res, type) => {
  responseContainer.style.display = 'block';
  responseContainer.setAttribute('class', `${type}-response`);
  responseContent.textContent = `${res.data.message}!`;
};

/* eslint-disable no-undef */
/**
 * Adds an event listener for a submit event on the signup form
 */
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
  const loginButton = event.target.children.item(2);
  loginButton.disabled = 'true';
  loginButton.textContent = 'Signing in ...';
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
      window.location = './availableOrders.html';
    }, 2500);
  })
    .catch((error) => {
      loginButton.disabled = false;
      loginButton.textContent = 'Login';
      if (error.message === 'Failed to fetch') {
        responseContainer.style.display = 'block';
        responseContainer.setAttribute('class', 'error-response');
        document.querySelector('#response-container').textContent = `
          No internet connection. Check Your connection`;
      } else {
        showErrorMessage(error, 'error');
      }
    });
});
/* eslint-enable no-undef */
