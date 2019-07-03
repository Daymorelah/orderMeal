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
  divTag.insertAdjacentHTML('beforeend',
    `<p><span class="meal-property">Order Number: </span>${order.id}</p>`);
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
    `<p><span class="meal-property">Status: ${order.status}</span></p>`);
  fragment.appendChild(divTag);
  return fragment;
};

/**
 * Defines the method used to generate the card  heading for a meal
 * being ordered by a user.
 */
const generateCardFooter = (status) => {
  let orderStatus = '';
  orderStatus = status === 'new' ? 'accept' : status;
  const fragment = document.createDocumentFragment();
  const divTag = document.createElement('div');
  divTag.setAttribute('class', 'card-footer');
  if (orderStatus === 'completed' || orderStatus === 'cancelled') {
    return fragment;
  }
  if (orderStatus === 'processing') {
    divTag.insertAdjacentHTML('beforeend',
      '<button class="accept">completed</button>');
  } else {
    divTag.insertAdjacentHTML('beforeend',
      `<button class="accept">${orderStatus}</button>`);
  }
  if (status === 'new') {
    divTag.insertAdjacentHTML('beforeend',
      '<button class="decline">decline</button>');
  }
  fragment.appendChild(divTag);
  return fragment;
};

/* eslint-disable no-undef */
/**
 * Describes the method that updates the status of an order
 * @param {object} event - The event object being handled 
 */
const updateOrderStatus = (event) => {
  const acceptButton = event.target;
  if (acceptButton.parentNode.parentNode.childElementCount === 4) {
    acceptButton.parentNode.parentNode.children.item(3).style.display = 'none';
  }
  const status = acceptButton.textContent;
  let orderStatus = '';
  switch (status) {
    case 'accept':
      orderStatus = 'processing';
      break;
    case 'completed':
      orderStatus = 'completed';
      break;
    default:
      orderStatus = 'accept';
  }
  let orderId = acceptButton.parentNode.previousElementSibling.children.item(0).textContent;
  orderId = orderId.split(':');
  orderId = parseInt(orderId[1].trim(), 10);
  acceptButton.textContent = 'Updating status...';
  if (status === 'new') acceptButton.nextElementSibling.style.display = 'none';
  acceptButton.disabled = 'true';
  // fetch(`https://ordermymeal.herokuapp.com/api/v1/orders/${orderId}`,
  fetch(`https://localhost:2022/api/v1/orders/${orderId}`,
    {
      headers: {
        'x-access-token': localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: `${orderStatus}` }),
      method: 'PUT',
    },
  ).then(handleResponse).then((res) => {
    if (res.data.code === 200) {
      acceptButton.textContent = orderStatus === 'processing' ? 'completed' : '';
      const statusPosition = acceptButton.parentNode.previousElementSibling.childElementCount - 1;
      const statusTag = acceptButton.parentNode.previousElementSibling.children;
      statusTag.item(statusPosition).innerHTML = '';
      statusTag.item(statusPosition).insertAdjacentHTML('beforeend',
        `<p><span class="meal-property">Status: ${orderStatus}</span></p>`);
      acceptButton.disabled = 'false';
    }
  }).catch((error) => {
    if (error.message === 'Failed to fetch') {
      acceptButton.parentNode.parentNode.insertAdjacentHTML('beforeend',
        '<p class="update-failed">Could not connect to the internet.</p>',
      );
    }
    acceptButton.textContent = status;
  });
};

/**
 * Describes the method that declines an order.
 * @param {object} event - The event object being handled
 */
const declineOrder = (event) => {
  const declineButton = event.target;
  const acceptButton = declineButton.previousElementSibling;
  acceptButton.style.display = 'none';
  declineButton.textContent = 'Updating order ...';
  let orderId = acceptButton.parentNode.previousElementSibling.children.item(0).textContent;
  orderId = orderId.split(':');
  orderId = parseInt(orderId[1].trim(), 10);
  fetch(`https://ordermymeal.herokuapp.com/api/v1/orders/${orderId}`,
    {
      headers: {
        'x-access-token': localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'cancelled' }),
      method: 'PUT',
    },
  ).then(handleResponse).then((res) => {
    if (res.data.code === 200) {
      declineButton.textContent = 'declined';
      const statusPosition = declineButton.parentNode.previousElementSibling.childElementCount - 1;
      const statusTag = declineButton.parentNode.previousElementSibling.children;
      statusTag.item(statusPosition).innerHTML = '';
      statusTag.item(statusPosition).insertAdjacentHTML('beforeend',
        '<p><span class="meal-property">Status: Declined </p>');
    }
  });
};

/**
 * Describes the method that displays meals ordered by users of the app.
 * This method is called when the page loads.
 */
const getMealsOrdered = () => {
  document.querySelector('#loader-container').style.display = 'flex';
  const ordersContainer = document.querySelector('#meal-card-container');
  ordersContainer.innerHTML = '';
  fetch(
    'https://ordermymeal.herokuapp.com/api/v1/orders',
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
        orderCard.appendChild(generateCardFooter(order.status));
        fragment.appendChild(orderCard);
      });
      document.querySelector('#loader-container').style.display = 'none';
    }
    ordersContainer.appendChild(fragment);
    document.querySelectorAll('.accept').forEach((acceptButton) => {
      acceptButton.addEventListener('click', event => updateOrderStatus(event));
    });
    document.querySelectorAll('.decline').forEach((declineButton) => {
      declineButton.addEventListener('click', event => declineOrder(event));
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
