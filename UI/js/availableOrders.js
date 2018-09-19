const smallWidthNav = document.querySelector('#small-width-nav');
const hamburger = document.querySelector('#hamburger');
const closeModal = document.querySelector('#close-modal');
const modalContainer = document.querySelector('#addOrder-modal-container');
const cancelMeal = document.querySelector('#cancel-meal');
const addOrder = document.querySelector('#add-order');

hamburger.addEventListener('click', () => {
  if (smallWidthNav.classList) {
    smallWidthNav.classList.toggle('open');
  }
});

const closeModalView = () => {
  modalContainer.style.display = 'none';
};

addOrder.addEventListener('click', () => {
  modalContainer.style.display = 'block';
});

closeModal.addEventListener('click', closeModalView);
cancelMeal.addEventListener('click', closeModalView);

