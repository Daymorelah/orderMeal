const smallWidthNav = document.querySelector('#small-width-nav');
const hamburger = document.querySelector('#hamburger');

hamburger.addEventListener('click', () => {
  if (smallWidthNav.classList) {
    smallWidthNav.classList.toggle('open');
  }
});
