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

const getMenuURl = 'https://ordermymeal.herokuapp.com/api/v1/menu';
const closeModalView = () => {
  modalContainer.style.display = 'none';
};
addOrder.addEventListener('click', () => {
  modalContainer.style.display = 'block';
});
menuContent.addEventListener('keypress', () => {
  responseContainer.style.display = 'none';
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
const noMenuYet = (menu) => {
  const fragment = document.createDocumentFragment();
  const divTag = document.createElement('div');
  divTag.setAttribute('id', 'no-menu');
  divTag.innerHTML = `<h3>There are no ${menu} available yet.</h3>
    <p>You can check back soon or go to your<a href='./userProfile.html'>Profile page</a></p>`;
  return fragment.appendChild(divTag);
};
const showResponseMessage = (res, type) => {
  responseContainer.style.display = 'block';
  responseContainer.setAttribute('class', `${type}-response`);
  responseContent.textContent = `${res.data.message}!`;
};
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
const addMenuToList = (res) => {
  const mealCardContainer = document.querySelector('#meal-card-container');
  mealCardContainer.appendChild(createMealCard(res.data.menuCreated[0]));
};
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
      'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoiYWRtaW4yIiwiZW1haWwiOiJhZG1pbjJAd2VtYWlsLmNvbSIsImlhdCI6MTUzODYyMjU1NywiZXhwIjoxNTM4NzA4OTU3fQ.g18aRAzGsVQPESqQw7iMmYeWa3R3WYnJFIoZhII9Q98',
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
const loadMenu = () => {
  let URL;
  if (filterBy.value.length) {
    const filter = `?filter=${filterBy.value}`;
    URL = `${getMenuURl}${filter}`;
  } else {
    URL = `${getMenuURl}`;
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
      mealCardContainer.appendChild(noMenuYet(`${filterBy.value}`));
    } else {
      numberOfMenu.textContent = `meals available | ${res.data.menu.length}`;
      res.data.menu.forEach((menu) => {
        fragment.appendChild(createMealCard(menu));
      });
      mealCardContainer.appendChild(fragment);
      document.querySelector('#loader-container').style.display = 'none';
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
const filterMealSearch = () => {
  const mealCardContainer = document.querySelector('#meal-card-container');
  mealCardContainer.innerHTML = '';
  loadMenu();
};
searchMeal.addEventListener('click', filterMealSearch);
closeModal.addEventListener('click', closeModalView);
cancelMeal.addEventListener('click', closeModalView);
createMeal.addEventListener('click', createMenuItem);

window.onload = () => loadMenu();
