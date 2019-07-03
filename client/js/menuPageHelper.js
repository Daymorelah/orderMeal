/* eslint-disable no-unused-vars */

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
 * This method is called when the fetch request used to post
 * a request to place an order fails.
 */
const modalReadyForPlaceOrderRequest = () => {
  document.querySelector('#loader-container-modal').style.display = 'none';
  document.querySelector('#meals-ordered').style.display = 'block';
  document.querySelector('#contact-user').style.display = 'block';
  document.querySelector('#place-order').textContent = 'Create Order';
  document.querySelector('#place-order').disabled = false;
  document.querySelector('#cancel-order').disabled = false;
  document.querySelector.disabled = false;
};

/**
 * Defines a method that shows the error message from a fetch
 * @param {object} res - Response object
 * @param {string} type - Type of message to show (error or success)
 */
const showResponseMessage = (res, type) => {
  document.querySelector('#response-container p').textContent = '';
  document.querySelector('#response-container').style.display = 'block';
  document.querySelector('#response-container').setAttribute('class', `${type}-response`);
  document.querySelector('#response-container p').textContent = `${res.data.message}!`;
};

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
    'beforeend', `<h2><span class="meal-property"> type: </span>${res.meal_type}</h2>`,
  );
  cardFragment.appendChild(menuHeader);
  const menuBody = document.createElement('div');
  menuBody.setAttribute('class', 'card-body');
  menuBody.insertAdjacentHTML(
    'beforeend', `<p><span class="meal-property">${res.meal_type}: </span>${res.meal} </p>`,
  );
  menuBody.insertAdjacentHTML(
    'beforeend', `<p><span class="meal-property">Prize: </span>&#8358;${res.prize}</p>`,
  );
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
const addOrReduceQuantity = (add, reduce) => {
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
  addOrReduceQuantity(add, reduce);
};

/**
 * This method is called prior to the fetch request
 * to place an order is called.
 */
const requestToPlaceOrderInProgress = () => {
  document.querySelector('#response-container').style.display = 'none';
  document.querySelector('#meals-ordered').style.display = 'none';
  document.querySelector('#contact-user').style.display = 'none';
  document.querySelector('#cancel-order').disabled = true;
  document.querySelector('#place-order').disabled = true;
  document.querySelector('#place-order').textContent = 'Creating order ...';
  document.querySelector('#loader-container-modal').style.display = 'flex';
};
