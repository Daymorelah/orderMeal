const smallWidthNav = document.querySelector('#small-width-nav');
const hamburger = document.querySelector('#hamburger');
const profileName = document.querySelector('#user-identify-text h2');
const greetUSer = document.querySelector('#user-identify-text p');
const logUserOut = document.querySelector('#logout');

hamburger.addEventListener('click', () => {
  if (smallWidthNav.classList) {
    smallWidthNav.classList.toggle('open');
  }
});
logUserOut.addEventListener('click', () => {
  localStorage.removeItem('token');
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
const generateMealImage = () => {
  const imageTag = document.createElement('img');
  imageTag.setAttribute('src', './images/burger.png');
  return imageTag;
};
const noContent = () => {
  const fragment = document.createDocumentFragment();
  const divTag = document.createElement('div');
  divTag.setAttribute('id', 'no-orders');
  divTag.innerHTML = `<h3>You have not created any orders yet</h3>
    <p>You can start taking your orders by creating one <a href='./orderFoodPage.html'>Create Order</a></p>`;
  return fragment.appendChild(divTag);
};
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
  drink.insertAdjacentHTML('beforeend', `<span>${order.drink}</span>`);
  fragment.appendChild(drink);
  quantity.insertAdjacentHTML('beforeend', '<span class="meal-property">Quantity: </span>');
  quantity.insertAdjacentHTML('beforeend', `<span>${order.quantity}</span>`);
  fragment.appendChild(quantity);
  prize.insertAdjacentHTML('beforeend', '<span class="meal-property">Prize: </span>');
  prize.insertAdjacentHTML('beforeend', `<span>&#8358; ${order.prize}</span>`);
  fragment.appendChild(prize);
  divTag.appendChild(fragment);
  return divTag;
};
const loadOrderHistory = () => {
  document.querySelector('#loader-container').style.display = 'flex';
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');
  profileName.textContent = `Hello ${username}!`;
  greetUSer.textContent = 'Our delicious meals are waiting for you!';
  const mealsContainer = document.querySelector('#meals-ordered');
  mealsContainer.innerHTML = '';
  fetch(`https://ordermymeal.herokuapp.com/api/v1/users/${userId}/orders`,
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

window.onload = () => loadOrderHistory();
