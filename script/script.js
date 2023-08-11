let timerEl = document.getElementById('countdown');
let startTimer = document.querySelector('startGame-btn');

let timeLeft = 6;
function countDown () {
  let timeInterval = setInterval(function () {
    timeLeft--;
    timerEl.textContent = timeLeft + ' until quiz begins. Get Ready!';

    if (timeLeft === 0) {
      clearInterval(timeInterval);
    }
  }, 1000);
}

startTimer = document.addEventListener('click', countDown);