const modalContainer = document.querySelector('#addOrder-modal-container');
const cancelOrder = document.querySelector('#cancel-order');
const placeOrderButton = document.querySelector('#place-order');
const addOrder = document.querySelector('#add-order');
const responseContainer = document.querySelector('#response-container');
const responseContent = document.querySelector('#response-container p');
const mealsOrderedContainer = document.querySelector('#meals-ordered-container');
const searchMeal = document.querySelector('#search-meal-icon');
const filterBy = document.querySelector('#filter');

// const menuUrl = 'https://ordermymeal.herokuapp.com/api/v1/menu';
const menuUrl = 'http://localhost:2022/api/v1/menu';

/**
 * Defines a method to hide the create-order modal. This method is called when the
 * cancel meal button is clicked.
 */
const closeModalView = () => {
  modalContainer.style.display = 'none';
  document.querySelector('#meals-ordered').innerHTML = '';
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach((addToCartButton) => {
    addToCartButton.removeAttribute('disabled');
  });
};

/**
 * Describes the method that removes a meal from the selected meals.
 * @param {object} event - Object that references the event being fired 
 */
const removeMeal = (event) => {
  const mealsOrder = event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
  mealsOrder.removeChild(event.target.parentNode.parentNode.parentNode.parentNode);
};

/**
 * Adds an event listener to the create Order button to show the
 * meal selected summary modal.
 */
addOrder.addEventListener('click', () => {
  const mealsInCart = document.querySelector('#meals-ordered').innerHTML;
  modalContainer.style.display = 'block';
  if (mealsInCart === '') {
    document.querySelector('#no-meal-in-cart').style.display = 'block';
    document.querySelector('#place-order').style.display = 'none';
    document.querySelector('#contact-user').style.display = 'none';
  } else {
    document.querySelector('#address').value = '';
    document.querySelector('#phone-number').value = '';
    document.querySelector('#no-meal-in-cart').style.display = 'none';
    document.querySelector('#place-order').style.display = 'block';
    document.querySelector('#contact-user').style.display = 'block';
    const removeSelectedMeal = document.querySelectorAll('.remove-meal');
    removeSelectedMeal.forEach((meal) => {
      meal.addEventListener('click', event => removeMeal(event));
    });
  }
});

/**
 * Adds a keypress event listener on the menu-form container 
 */
mealsOrderedContainer.addEventListener('keypress', () => {
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
// const showResponseMessage = (res, type) => {
//   responseContainer.style.display = 'block';
//   responseContainer.setAttribute('class', `${type}-response`);
//   responseContent.textContent = `${res.data.message}!`;
// };

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
  menuHeader.insertAdjacentHTML(
    'beforeend', `<h2><span class="meal-property"> type: </span>${res.meal_type}</h2>`);
  cardFragment.appendChild(menuHeader);
  const menuBody = document.createElement('div');
  menuBody.setAttribute('class', 'card-body');
  menuBody.insertAdjacentHTML(
    'beforeend', `<p><span class="meal-property">${res.meal_type}: </span>${res.meal} </p>`);
  menuBody.insertAdjacentHTML(
    'beforeend', `<p><span class="meal-property">Prize: </span>&#8358;${res.prize}</p>`);
  cardFragment.appendChild(menuBody);
  const menuFooter = document.createElement('div');
  menuFooter.setAttribute('class', 'card-footer');
  menuFooter.insertAdjacentHTML('beforeend', '<button class="add-to-cart">Add to cart</button>');
  cardFragment.appendChild(menuFooter);
  divTag.appendChild(cardFragment);
  return divTag;
};

/**
 * A method that creates the UI for a user to choose the 
 * quantity of the meal to order for.
 * @returns - A DIV that contains the UI that allows a user choose
 * the quantity of meal to order
 */
const chooseMealQuantity = () => {
  const quantityFragment = document.createDocumentFragment();
  const divQuantityContainer = document.createElement('div');
  divQuantityContainer.setAttribute('class', 'meal-quantity-container');
  const divTagMealQuantity = document.createElement('div');
  divTagMealQuantity.setAttribute('class', 'meal-quantity');
  const pTagMealQuantity = document.createElement('p');
  pTagMealQuantity.insertAdjacentText('beforeend', ' Quantity: ');
  quantityFragment.appendChild(pTagMealQuantity);
  divTagMealQuantity.insertAdjacentHTML('beforeend', `<span class="add"><i class="fas fa-plus fa-xs">
  </i></span><span class="number">1</span><span class="reduce"><i class="fas fa-minus fa-xs"></i></span>
  <span class="remove-meal"><i class="fas fa-times fa-xs"></i></span>`);
  quantityFragment.appendChild(divTagMealQuantity);
  divQuantityContainer.appendChild(quantityFragment);
  return divQuantityContainer;
};

/**
 * Describes the method used to show a modal summary of the meals
 * that the user has selected to order for.
 * @param {array} mealDetail - An array of details of the selected meal
 */
const showSelectedMeal = (mealDetail) => {
  const fragment = document.createDocumentFragment();
  const divTag = document.createElement('div');
  divTag.setAttribute('class', 'meal-ordered');
  const pTagMealType = document.createElement('p');
  const pTagMealPrize = document.createElement('p');
  const mealType = mealDetail.slice(undefined, -2).join(' ');
  const mealPrize = mealDetail.slice(-2).join(' ');
  pTagMealType.textContent = mealType;
  fragment.appendChild(pTagMealType);
  fragment.appendChild(chooseMealQuantity());
  pTagMealPrize.textContent = mealPrize;
  fragment.appendChild(pTagMealPrize);
  divTag.appendChild(fragment);
  document.querySelector('#meals-ordered').appendChild(divTag);
};

/**
 * Describes the event handler method that handles the click event on
 * the plus sign in the summary modal to increase the quantity of meal ordered.
 * @param {object} event - The event object returned after firing an event
 */
const increaseQuantity = (event) => {
  const plusSign = event.target;
  const presentValue = plusSign.parentNode.nextElementSibling.innerText;
  plusSign.parentNode.nextElementSibling.innerText = parseInt(presentValue, 10) + 1;
};

/**
 * Describes the event handler method that handles the click event on
 * the minus sign in the summary modal to reduce the quantity of meal ordered.
 * @param {object} event - The event object returned after firing an event
 */
const reduceQuantity = (event) => {
  const minusSign = event.target;
  let presentValue = minusSign.parentNode.previousElementSibling.innerText;
  presentValue = (parseInt(presentValue, 10) === 1) ? 1 : presentValue - 1;
  minusSign.parentNode.previousElementSibling.innerText = presentValue;
};

/**
 * A method that adds an event handler on each plus and minus sign in
 * the order summary modal.
 * @param {object} add - DOM object representing the clickable plus sign
 * @param {object} reduce -  DOM object representing the clickable plus sign
 */
const addReduceQuantity = (add, reduce) => {
  add.forEach((plusSign) => {
    plusSign.addEventListener('click', increaseQuantity);
  });
  reduce.forEach((minusSign) => {
    minusSign.addEventListener('click', reduceQuantity);
  });
};

/**
 * Defines the method used to add a menu to the cart
 * @param {object} event - The target event 
 */
const addMenuToCart = (event) => {
  const addToCartButton = event.target;
  addToCartButton.disabled = 'true';
  const mealCardBody = addToCartButton.parentElement.parentElement.children.item(1);
  const mealDetail = mealCardBody.textContent.split(' ');
  showSelectedMeal(mealDetail);
  const add = document.querySelectorAll('.add');
  const reduce = document.querySelectorAll('.reduce');
  addReduceQuantity(add, reduce);
};

/* eslint-disable no-undef */
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
 * Defines a method that shows the error message from a fetch
 * @param {object} res - Response object 
 * @param {string} type - Type of message to show (error or success)
 */
const showErrorMessage = (res, type) => {
  responseContainer.style.display = 'block';
  responseContainer.setAttribute('class', `${type}-response`);
  responseContent.textContent = `${res.data.message}!`;
};
const placeOrder = (orderDetails) => {
  const Url = 'http://localhost:2022/api/v1/orders';
  fetch(Url, {
    method: 'POST',
    headers: {
      'x-access-token': `${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderDetails),
  }).then(handleResponse).then(() => {
  }).catch((error) => {
    if (error.message === 'Failed to fetch') {
      responseContainer.style.display = 'block';
      responseContainer.setAttribute('class', 'error-response');
      document.querySelector('#response-container').textContent = `
      No internet connection. Check Your connection`;
    } else {
      showErrorMessage(error, 'error');
    }
  });
};
/* eslint-enable no-undef */

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
 * Updates the top-right text content on the page.
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
 * Defines the function that generates part the body used in the post
 * request to place an order.
 * @param {object} mealsSelected - HTMLCollection of the children of the 
 * DIV container that houses the meals being selected by the user
 * @returns {object} mealsOrdered - Part of te body used in the POST request
 * to place an order.
 */
const generateMealDetails = (mealsSelected) => {
  let total = 0; const mealsOrdered = {};
  const drinkArray = []; const quantityArray = []; const mealArray = [];
  [].forEach.call(mealsSelected, (mealSelected) => {
    const mealAndQuantity = {};
    const mealDetails = mealSelected.textContent.split(':');
    const quantity = mealDetails[2].split('Prize')[0].trim();
    let prize = parseInt(mealDetails[3].trim().split('₦').join(''), 10);
    prize *= quantity; total += prize;
    if (mealDetails[0] === 'Refreshment') {
      const drink = mealDetails[1].split('Quantity')[0].trim();
      mealAndQuantity[`${drink}`] = quantity;
      quantityArray.push(mealAndQuantity);
      drinkArray.push(drink);
    } else {
      const meal = mealDetails[1].split('Quantity')[0].trim();
      mealAndQuantity[`'${meal}'`] = quantity;
      quantityArray.push(mealAndQuantity);
      mealArray.push(meal);
    }
  });
  mealsOrdered.prize = total;
  mealsOrdered.meal = mealArray.length ? mealArray : 'none';
  mealsOrdered.drink = drinkArray.length ? drinkArray : 'none';
  return mealsOrdered;
};

/**
 * Defines the method used to create an order. This method is called
 * when the user clicks on the place order button in the order summary modal
 * @param {object} event - the event object that is being fired
 */
const startProcessingOrder = (event) => {
  const mealsSelected = event.target.parentNode.children.item(0).children;
  let mealsOrdered = generateMealDetails(mealsSelected);
  const address = document.querySelector('#address').value;
  const phoneNumber = document.querySelector('#phone-number').value;
  const name = localStorage.getItem('username');
  mealsOrdered = Object.assign({}, mealsOrdered, { address, phoneNumber, name });
  placeOrder(mealsOrdered);
};

/**
 * Add event listeners to modal elements
 */
searchMeal.addEventListener('click', filterMealSearch);
cancelOrder.addEventListener('click', closeModalView);
placeOrderButton.addEventListener('click', startProcessingOrder);

window.onload = () => checkIfRegistered(); loadMenu();
