const closeModal = document.querySelector('#close-modal');
const modalContainer = document.querySelector('#addOrder-modal-container');
const cancelMeal = document.querySelector('#cancel-meal');
const addOrder = document.querySelector('#add-order');
const createMeal = document.querySelector('#create-meal');
const responseContainer = document.querySelector('#response-container');
const responseContent = document.querySelector('#response-container p');
const menuContent = document.querySelector('#menu-content');
const searchMeal = document.querySelector('#search-meal-icon');
const filterBy = document.querySelector('#filter');

const menuUrl = 'https://ordermymeal.herokuapp.com/api/v1/menu';

/**
 * Defines a method to hide the create-order modal
 */
const closeModalView = () => {
  modalContainer.style.display = 'none';
};

/**
 * Adds an event listener to the addOrder button
 */
addOrder.addEventListener('click', () => {
  modalContainer.style.display = 'block';
});

/**
 * Adds a keypress event listener on the menu-form container 
 */
menuContent.addEventListener('keypress', () => {
  responseContainer.style.display = 'none';
});

/**
 * Defines the method used to show a response when a null value is returned
 * @param {string} menu - Meal selected to filter by
 * @returns {object} - Document fragment that contains a div that holds
 * the response message to be shown when no content is returned 
 */
const noContent = (menu) => {
  const fragment = document.createDocumentFragment();
  const divTag = document.createElement('div');
  divTag.setAttribute('id', 'no-menu');
  divTag.innerHTML = `<h3>There are no ${menu} available yet.</h3>
    <p>You can check back soon or go to your<a href='./userProfile.html'>Profile page</a></p>`;
  return fragment.appendChild(divTag);
};

/**
 * Defines a method that shows the response gotten form the fetch method 
 * @param {object} res - Response object 
 * @param {string} type - Type of response to show (error or success)
 */
const showResponseMessage = (res, type) => {
  responseContainer.style.display = 'block';
  responseContainer.setAttribute('class', `${type}-response`);
  responseContent.textContent = `${res.data.message}!`;
};

/**
 * A method that defines the creation of a meal card
 * @param {object} res - Response object
 * @returns {Object} - A div tag that defines a meal card
 */
const createMealCard = (res) => {
  const cardFragment = document.createDocumentFragment();
  const divTag = document.createElement('div');
  divTag.setAttribute('class', 'meal-cards');
  const menuHeader = document.createElement('div');
  menuHeader.setAttribute('class', 'card-heading');
  menuHeader.insertAdjacentHTML('beforeend', `
  <h2><span class="meal-property">type: </span>${res.meal_type}</h2>`);
  cardFragment.appendChild(menuHeader);
  const menuBody = document.createElement('div');
  menuBody.setAttribute('class', 'card-body');
  menuBody.insertAdjacentHTML('beforeend', `
  <p><span class="meal-property">Appetizer: </span>${res.meal}</p>`);
  menuBody.insertAdjacentHTML('beforeend', `
  <p><span class="meal-property">Prize: </span>&#8358; ${res.prize}</p>`);
  cardFragment.appendChild(menuBody);
  const menuFooter = document.createElement('div');
  menuFooter.setAttribute('class', 'card-footer');
  menuFooter.insertAdjacentHTML('beforeend', '<button class="add-to-cart">Add to cart</button>');
  cardFragment.appendChild(menuFooter);
  divTag.appendChild(cardFragment);
  return divTag;
};

/**
 * Describes the the method used to add a menu to the list of menus 
 * @param {object} res - Response object 
 */
const addMenuToList = (res) => {
  const mealCardContainer = document.querySelector('#meal-card-container');
  mealCardContainer.appendChild(createMealCard(res.data.menuCreated[0]));
};

/* eslint-disable no-undef */
/**
 * Defines the method used to create a menu item
 */
const createMenuItem = () => {
  const mealType = document.querySelector('#modal-meal-type').value;
  const meal = document.querySelector('#modal-meal').value;
  const prize = document.querySelector('#modal-prize').value;
  const menuDetails = {
    mealType, prize, meal,
  };
  fetch('http://localhost:2022/api/v1/menu', {
    method: 'POST',
    body: JSON.stringify(menuDetails),
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': `${localStorage.getItem('token')}`,
    },
  }).then(handleResponse).then((res) => {
    showResponseMessage(res, 'success');
    menuContent.reset();
    addMenuToList(res);
    setTimeout(() => {
      responseContainer.style.display = 'none';
      modalContainer.style.display = 'none';
    }, 2000);
  }).catch((error) => {
    showResponseMessage(error, 'error');
  });
};

/**
 * Defines the method used to add a menu to the cart
 * @param {object} event - The target event 
 */
const addMenuToCart = (event) => {
  const mealType = event.target.parentElement.parentElement.children.item(1).textContent.split(' ');
};

/**
 * Defines the method that loads the available menu in the DOM 
 */
const loadMenu = () => {
  let URL;
  if (filterBy.value.length) {
    const filter = `?filter=${filterBy.value}`;
    URL = `${menuUrl}${filter}`;
  } else {
    URL = `${menuUrl}`;
  }
  document.querySelector('#loader-container').style.display = 'flex';
  fetch(`${URL}`,
    {
      method: 'GET',
    },
  ).then(handleResponse).then((res) => {
    const mealCardContainer = document.querySelector('#meal-card-container');
    const numberOfMenu = document.querySelector('#ordered-meal-text h3');
    const fragment = document.createDocumentFragment();
    if (res.data.menu === null) {
      document.querySelector('#no-internet').style.display = 'none';
      document.querySelector('#paginate-container').style.display = 'none';
      document.querySelector('#loader-container').style.display = 'none';
      numberOfMenu.textContent = 'meals available | 0';
      mealCardContainer.style.justifyContent = 'center';
      mealCardContainer.appendChild(noContent(`${filterBy.value}`));
    } else {
      numberOfMenu.textContent = `meals available | ${res.data.menu.length}`;
      res.data.menu.forEach((menu) => {
        fragment.appendChild(createMealCard(menu));
      });
      mealCardContainer.appendChild(fragment);
      const addToCart = document.querySelectorAll('.add-to-cart');
      addToCart.forEach((addToCartButton) => {
        addToCartButton.addEventListener('click', event => addMenuToCart(event));
      });
      document.querySelector('#loader-container').style.display = 'none';
      document.querySelector('#no-internet').style.display = 'none';
    }
  }).catch((err) => {
    if (err.message === 'Failed to fetch') {
      setTimeout(() => {
        document.querySelector('#loader-container').style.display = 'none';
        document.querySelector('#paginate-container').style.display = 'none';
        document.querySelector('#no-internet').style.display = 'block';
      }, 2000);
    }
  });
};

/**
 * Defines the method used to filter the search for available menu
 */
const filterMealSearch = () => {
  const mealCardContainer = document.querySelector('#meal-card-container');
  mealCardContainer.innerHTML = '';
  loadMenu();
};

/**
 * Defines the method used to check if a user is registered
 */
const checkIfRegistered = () => {
  const logout = document.querySelector('#logout');
  if (localStorage.getItem('token') === null) {
    logout.textContent = 'Sign Up';
    logout.setAttribute('href', './signupPage.html');
  } else {
    logout.textContent = 'View Profile';
    logout.setAttribute('href', './userProfile.html');
  }
};

/**
 * Add event listeners to modal elements
 */
searchMeal.addEventListener('click', filterMealSearch);
closeModal.addEventListener('click', closeModalView);
cancelMeal.addEventListener('click', closeModalView);
createMeal.addEventListener('click', createMenuItem);

window.onload = () => checkIfRegistered(); loadMenu();
