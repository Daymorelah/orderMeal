const modalContainer = document.querySelector('#addOrder-modal-container');
const cancelOrder = document.querySelector('#cancel-order');
const placeOrderButton = document.querySelector('#place-order');
const addOrder = document.querySelector('#add-order');
const responseContainer = document.querySelector('#response-container');
const responseContent = document.querySelector('#response-container p');
const mealsOrderedContainer = document.querySelector('#meals-ordered-container');
const searchMeal = document.querySelector('#search-meal-icon');
const filterBy = document.querySelector('#filter');

const menuUrl = 'https://ordermymeal.herokuapp.com/api/v1/menu';

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

/* eslint-disable no-undef */
/**
 * Adds an event listener to the place Order button to show the
 * meal selected summary modal.
 */
addOrder.addEventListener('click', () => {
  const mealsInCart = document.querySelector('#meals-ordered').innerHTML;
  modalContainer.style.display = 'block';
  if (mealsInCart === '') {
    document.querySelector('#response-container').style.display = 'none';
    document.querySelector('#no-meal-in-cart').style.display = 'block';
    placeOrderButton.style.display = 'none';
    cancelOrder.textContent = 'Back to menu';
    cancelOrder.disabled = false;
    document.querySelector('#contact-user').style.display = 'none';
  } else {
    document.querySelector('#address').value = '';
    document.querySelector('#phone-number').value = '';
    document.querySelector('#no-meal-in-cart').style.display = 'none';
    document.querySelector('#response-container').style.display = 'none';
    placeOrderButton.style.display = 'block';
    cancelOrder.disabled = false;
    cancelOrder.textContent = 'Cancel Order';
    modalReadyForPlaceOrderRequest();
    const removeSelectedMeal = document.querySelectorAll('.remove-meal');
    removeSelectedMeal.forEach((meal) => {
      meal.addEventListener('click', event => removeMeal(event));
    });
  }
});
/* eslint-enable no-undef */

/**
 * Adds a keypress event listener on the menu-form container 
 */
mealsOrderedContainer.addEventListener('keypress', () => {
  responseContainer.style.display = 'none';
});

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
 * Defines the method used to send a post request to place an order
 * @param {object} orderDetails - Details of the order to send as the body
 * of the post request
 */
const placeOrder = (orderDetails) => {
  const Url = 'https://ordermymeal.herokuapp.com/api/v1/orders';
  requestToPlaceOrderInProgress();
  fetch(Url, {
    method: 'POST',
    headers: {
      'x-access-token': `${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderDetails),
  }).then(handleResponse).then((res) => {
    document.querySelector('#loader-container-modal').style.display = 'none';
    showResponseMessage(res, 'success');
    placeOrderButton.style.display = 'none';
    setTimeout(() => closeModalView(), 2000);
  }).catch((error) => {
    if (error.message === 'Failed to fetch') {
      responseContainer.style.display = 'block';
      responseContainer.setAttribute('class', 'error-response');
      responseContent.textContent =
        'No internet connection. Check Your connection to the internet';
      modalReadyForPlaceOrderRequest();
    } else {
      showResponseMessage(error, 'error');
      modalReadyForPlaceOrderRequest();
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
    let mealAndQuantity;
    const mealDetails = mealSelected.textContent.split(':');
    const quantity = mealDetails[2].split('Prize')[0].trim();
    let prize = parseInt(mealDetails[3].trim().split('₦').join(''), 10);
    prize *= quantity; total += prize;
    if (mealDetails[0] === 'Refreshment') {
      const drink = mealDetails[1].split('Quantity')[0].trim();
      mealAndQuantity = `${drink}::${quantity}`;
      quantityArray.push(mealAndQuantity);
      drinkArray.push(drink);
    } else {
      const meal = mealDetails[1].split('Quantity')[0].trim();
      mealAndQuantity = `${meal}::${quantity}`;
      quantityArray.push(mealAndQuantity);
      mealArray.push(meal);
    }
  });
  mealsOrdered.prize = total;
  mealsOrdered.quantity = quantityArray;
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

/* eslint-disable no-undef */
window.onload = () => checkIfRegistered(); loadMenu();
/* eslint-enable no-undef */
