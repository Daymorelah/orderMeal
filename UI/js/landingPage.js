const getStarted = document.querySelector('#get-started');
const learnMore = document.querySelector('#learn-more');

getStarted.addEventListener('click', () =>{
  window.location = './signupPage.html';
});

learnMore.addEventListener('click', () =>{
  window.location = './aboutPage.html';
});