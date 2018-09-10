const getStarted = document.querySelector('#get-started');
const learnMore = document.querySelector('#learn-more');

getStarted.addEventListener('click', () =>{
  window.location = `${location.origin}/UI/html/signupPage.html`;
});

learnMore.addEventListener('click', () =>{
  window.location = `${location.origin}/UI/html/aboutPage.html`;
});