const smallWidthNav = document.querySelector('#small-width-nav');
const hamburger = document.querySelector('#hamburger');
const profileName = document.querySelector('#user-identify-text h2');
const greetUSer = document.querySelector('#user-identify-text p');
const logUserOut = document.querySelectorAll('.logout');

/**
 * Adds an event listener on the hamburger icon
 */
hamburger.addEventListener('click', () => {
  if (smallWidthNav.classList) {
    smallWidthNav.classList.toggle('open');
  }
});

/**
 * Adds an event listener on the logout button
 */
logUserOut.forEach((logoutButton) => {
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location = './loginPage.html';
  });
});

/**
 * Defines the method used to generate the image for a meal
 */
const generateMealImage = () => {
  const imageTag = document.createElement('img');
  imageTag.setAttribute('src', './images/burger.png');
  return imageTag;
};

/**
 * Defines the method generate the message shown when null order
 * is returned form the server
 */
const noContent = () => {
  const fragment = document.createDocumentFragment();
  const divTag = document.createElement('div');
  divTag.setAttribute('id', 'no-orders');
  divTag.innerHTML = `<h3>You have not created any orders yet</h3>
    <p>You can start taking your orders by creating one <a href='./availableOrders.html'>
    Place Order</a></p>`;
  return fragment.appendChild(divTag);
};

/**
 * Defines the method that generates the details of a meal
 * @param {object} order - An object containing details of an order
 * @returns {object} - A div tag that contains details of a meal
 */
const generateMealDetails = (order) => {
  const fragment = document.createDocumentFragment();
  const divTag = document.createElement('div');
  divTag.setAttribute('class', 'meal-details');
  const meal = document.createElement('p');
  const quantity = document.createElement('p');
  const drink = document.createElement('p');
  const prize = document.createElement('p');
  meal.insertAdjacentHTML('beforeend', '<span class="meal-property">Meal: </span>');
  meal.insertAdjacentHTML('beforeend', `<span>${order.meal}</span>`);
  fragment.appendChild(meal);
  drink.insertAdjacentHTML('beforeend', '<span class="meal-property">Drink: </span>');
  drink.insertAdjacentHTML('beforeend', `<span>${order.refreshment[0]}`);
  fragment.appendChild(drink);
  quantity.insertAdjacentHTML('beforeend', '<span class="meal-property">Quantity: </span>');
  quantity.insertAdjacentHTML('beforeend', `<span>${order.quantity[0]}</span>`);
  fragment.appendChild(quantity);
  prize.insertAdjacentHTML('beforeend', '<span class="meal-property">Prize: </span>');
  prize.insertAdjacentHTML('beforeend', `<span>&#8358; ${order.prize}</span>`);
  fragment.appendChild(prize);
  divTag.appendChild(fragment);
  return divTag;
};

/* eslint-disable no-undef */
/**
 * Defines the method that loads the user history
 */
const loadOrderHistory = () => {
  document.querySelector('#loader-container').style.display = 'flex';
  const decoded = JSON.parse(localStorage.getItem('decoded'));
  profileName.textContent = `Hello ${decoded.username}!`;
  greetUSer.textContent = 'Our delicious meals are waiting for you!';
  const mealsContainer = document.querySelector('#meals-ordered');
  mealsContainer.innerHTML = '';
  fetch(
    `https://ordermymeal.herokuapp.com/api/v1/users/${decoded.userId}/orders`,
    {
      method: 'GET',
      headers: {
        'x-access-token': `${localStorage.getItem('token')}`,
      },
    },
  )
    .then(handleResponse).then((res) => {
      const fragment = document.createDocumentFragment();
      if (res.data.orders === null) {
        document.querySelector('#paginate-container').style.display = 'none';
        document.querySelector('#filter').style.display = 'none';
        document.querySelector('#loader-container').style.display = 'none';
        fragment.appendChild(noContent());
      } else {
        document.querySelector('#meal-number').textContent = res.data.orders.length || 0;
        res.data.orders.forEach((order) => {
          const mealCard = document.createElement('div');
          mealCard.setAttribute('class', 'meals');
          mealCard.appendChild(generateMealImage());
          mealCard.appendChild(generateMealDetails(order));
          fragment.appendChild(mealCard);
        });
        document.querySelector('#loader-container').style.display = 'none';
      }
      mealsContainer.appendChild(fragment);
    }).catch((err) => {
      if (err.message === 'Failed to fetch') {
        setTimeout(() => {
          document.querySelector('#loader-container').style.display = 'none';
          document.querySelector('#paginate-container').style.display = 'none';
          document.querySelector('#filter').style.display = 'none';
          document.querySelector('#no-internet').style.display = 'block';
        }, 2000);
      }
    });
};
/* eslint-enable no-undef */

window.onload = () => loadOrderHistory();
