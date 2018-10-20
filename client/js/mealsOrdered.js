const smallWidthNav = document.querySelector('#small-width-nav');
const hamburger = document.querySelector('#hamburger');

hamburger.addEventListener('click', () => {
  if (smallWidthNav.classList) {
    smallWidthNav.classList.toggle('open');
  }
});

/**
 * Defines the method generate the message shown when null order
 * is returned form the server
 */
const noContent = () => {
  const fragment = document.createDocumentFragment();
  const divTag = document.createElement('div');
  divTag.setAttribute('id', 'no-orders');
  divTag.innerHTML = '<h3>There are no meal-orders yet</h3>';
  return fragment.appendChild(divTag);
};

/**
 * Defines the method used to generate the card  heading for a meal
 * being ordered by a user
 */
const generateCardHeader = (name) => {
  const fragment = document.createDocumentFragment();
  const divTag = document.createElement('div');
  divTag.setAttribute('class', 'card-heading');
  divTag.insertAdjacentHTML('beforeend',
    `<h2><span class="meal-property">Customer: </span>${name}</h2>`);
  divTag.insertAdjacentHTML('beforeend',
    '<span class="card-heading-icon"><i class="fas fa-check"></i></span>');
  fragment.appendChild(divTag);
  return fragment;
};

/**
 * Defines the method used to generate the card body for a meal
 * being ordered by a user
 */
const generateCardBody = (order) => {
  const fragment = document.createDocumentFragment();
  const divTag = document.createElement('div');
  const quantityArray = [];
  divTag.setAttribute('class', 'card-body');
  order.quantity.forEach(element => quantityArray.push(element.split('::')));
  order.meal.forEach((meal) => {
    if (meal === 'none') {
      divTag.insertAdjacentHTML('beforeend',
        '<p><span class="meal-property">Order: </span>No meal ordered</p>');
    } else {
      const mealQuantity = quantityArray.find(quantity => quantity[0] === meal);
      divTag.insertAdjacentHTML('beforeend',
        `<p><span class="meal-property">Order: </span>${meal}</p>`);
      divTag.insertAdjacentHTML('beforeend',
        `<p><span class="meal-property">Quantity: </span>${mealQuantity[1]}</p>`);
    }
  });
  order.refreshment.forEach((drink) => {
    if (drink === 'none') {
      divTag.insertAdjacentHTML('beforeend',
        '<p><span class="meal-property">Order: </span>No Drink ordered</p>');
    } else {
      const drinkQuantity = quantityArray.find(quantity => quantity[0] === drink);
      divTag.insertAdjacentHTML('beforeend',
        `<p><span class="meal-property">Drink: </span>${drink}</p>`);
      divTag.insertAdjacentHTML('beforeend',
        `<p><span class="meal-property">Quantity: </span>${drinkQuantity[1]}</p>`);
    }
  });
  divTag.insertAdjacentHTML('beforeend',
    `<p><span class="meal-property">Prize: </span>&#8358; ${order.prize}</p>`);
  divTag.insertAdjacentHTML('beforeend',
    `<p><span class="meal-property">Address: </span>${order.address}</p>`);
  divTag.insertAdjacentHTML('beforeend',
    `<p><span class="meal-property">Phone Number: </span>${order.phonenumber}</p>`);
  divTag.insertAdjacentHTML('beforeend',
    `<p><span class="meal-property">Status: </span>${order.status}</p>`);
  fragment.appendChild(divTag);
  return fragment;
};

/**
 * Defines the method used to generate the card  heading for a meal
 * being ordered by a user.
 */
const generateCardFooter = () => {
  const fragment = document.createDocumentFragment();
  const divTag = document.createElement('div');
  divTag.setAttribute('class', 'card-footer');
  divTag.insertAdjacentHTML('beforeend',
    '<button class="accept">accept</button>');
  divTag.insertAdjacentHTML('beforeend',
    '<button class="decline">decline</button>');
  fragment.appendChild(divTag);
  return fragment;
};

const updateOrderStatus = (event) => {
  const acceptButton = event.target;
  const status = acceptButton.textContent;
  switch (status) {
    case 'accept':
      acceptButton.textContent = 'processing';
      break;
    case 'processing':
      acceptButton.textContent = 'complete';
      break;
    default:
      acceptButton.textContent = 'accept';
  }
};

/* eslint-disable no-undef */
const getMealsOrdered = () => {
  document.querySelector('#loader-container').style.display = 'flex';
  const ordersContainer = document.querySelector('#meal-card-container');
  ordersContainer.innerHTML = '';
  fetch('https://ordermymeal.herokuapp.com/api/v1/orders',
    {
      headers: {
        'x-access-token': localStorage.getItem('token'),
      },
    }).then(handleResponse).then((res) => {
    const fragment = document.createDocumentFragment();
    if (res.data.orders === null) {
      document.querySelector('#paginate-container').style.display = 'none';
      document.querySelector('#search-meal-container').style.display = 'none';
      document.querySelector('#loader-container').style.display = 'none';
      fragment.appendChild(noContent());
    } else {
      document.querySelector('#order-number').textContent =
        `ordered meals | ${res.data.orders.length || 0}`;
      res.data.orders.forEach((order) => {
        const orderCard = document.createElement('div');
        orderCard.setAttribute('class', 'meal-cards');
        orderCard.appendChild(generateCardHeader(order.name));
        orderCard.appendChild(generateCardBody(order));
        orderCard.appendChild(generateCardFooter());
        fragment.appendChild(orderCard);
      });
      document.querySelector('#loader-container').style.display = 'none';
    }
    ordersContainer.appendChild(fragment);
    document.querySelectorAll('.accept').forEach((acceptButton) => {
      acceptButton.addEventListener('click', event => updateOrderStatus(event));
    });
    document.querySelectorAll('.accept').forEach((declineButton) => {
      declineButton.addEventListener('click', () => declineOrder);
    });
  })
    .catch((err) => {
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

window.onload = () => getMealsOrdered();
