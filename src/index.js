const TWENTYFIVE_MINUTES = 25 * 60;
const FIVE_MINUTES = 5 * 60;
let isSessionMode = true;
let breakLength = 5 * 60;
let sessionLength = 25 * 60;
let sessionTimer;
let breakTimer;

const breakDecrementElement = document.getElementById("break-decrement");
const breakLengthElement = document.getElementById("break-length");
const breakIncrementElement = document.getElementById("break-increment");
const sessionDecrementElement = document.getElementById("session-decrement");
const sessionLengthElement = document.getElementById("session-length");
const sessionIncrementElement = document.getElementById("session-increment");
const timerMinutes = document.getElementById("timer-minutes");
const timerSeconds = document.getElementById("timer-seconds");
const startStopButton = document.getElementById("start_stop");
const resetButton = document.getElementById("reset");
const timerLabelElement = document.getElementById("timer-label");
const audio = document.getElementById("beep");

async function playAudio() {
  audio.play();
  await sleep(3000);
  audio.pause();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function updateUITimer(length) {
  if (Math.floor(length / 60).toString().length === 1) {
    timerMinutes.textContent = "0" + Math.floor(length / 60);
  } else {
    timerMinutes.textContent = Math.floor(length / 60);
  }
  if ((length % 60).toString().length === 1) {
    timerSeconds.textContent = "0" + (length % 60);
  } else {
    timerSeconds.textContent = length % 60;
  }
}

function reset() {
  breakLength = FIVE_MINUTES;
  sessionLength = TWENTYFIVE_MINUTES;
  breakLengthElement.textContent = FIVE_MINUTES / 60;
  sessionLengthElement.textContent = TWENTYFIVE_MINUTES / 60;
  clearInterval(sessionTimer);
  clearInterval(breakTimer);
  sessionTimer = undefined;
  breakTimer = undefined;
  timerLabelElement.textContent = "Session";
  isSessionMode = true;
  timerMinutes.textContent = TWENTYFIVE_MINUTES / 60;
  timerSeconds.textContent = "00";
  audio.pause();
  audio.currentTime = 0;
}

function startBreak() {
  sessionTimer = undefined;
  isSessionMode = false;
  timerLabelElement.textContent = "Break";

  breakTimer = setInterval(async () => {
    breakLength -= 1;
    updateUITimer(breakLength);

    if (breakLength === 0) {
      audio.play();
      clearInterval(breakTimer);
      await sleep(8000);
      sessionLength = parseInt(sessionLengthElement.textContent, 10) * 60;
      updateUITimer(sessionLength);
      startSession();
    }
  }, 1000);
}

function startSession() {
  breakTimer = undefined;
  isSessionMode = true;
  timerLabelElement.textContent = "Session";

  sessionTimer = setInterval(async () => {
    sessionLength -= 1;
    updateUITimer(sessionLength);

    if (sessionLength === 0) {
      audio.play();
      clearInterval(sessionTimer);
      await sleep(8000);
      breakLength = parseInt(breakLengthElement.textContent, 10) * 60;
      updateUITimer(breakLength);
      startBreak();
    }
  }, 1000);
}

startStopButton.addEventListener("click", () => {
  if (isSessionMode) {
    if (sessionTimer == undefined) {
      startSession();
    } else {
      clearInterval(sessionTimer);
      sessionTimer = undefined;
    }
  } else {
    if (breakTimer == undefined) {
      startBreak();
    } else {
      clearInterval(breakTimer);
      breakTimer = undefined;
    }
  }
});

resetButton.addEventListener("click", () => {
  reset();
});

breakDecrementElement.addEventListener("click", () => {
  if (breakLength - 60 === 0) {
    return;
  }
  breakLength -= 60;
  breakLengthElement.textContent = breakLength / 60;
});

breakIncrementElement.addEventListener("click", () => {
  if ((breakLength + 60) / 60 > 60) {
    return;
  }
  breakLength += 60;
  breakLengthElement.textContent = breakLength / 60;
});

sessionDecrementElement.addEventListener("click", () => {
  if (sessionLength - 60 === 0) {
    return;
  }
  sessionLength -= 60;
  sessionLengthElement.textContent = sessionLength / 60;
  if (isSessionMode) {
    timerMinutes.textContent = sessionLength / 60;
  }
});

sessionIncrementElement.addEventListener("click", () => {
  if ((sessionLength + 60) / 60 > 60) {
    return;
  }
  sessionLength += 60;
  sessionLengthElement.textContent = sessionLength / 60;
  if (isSessionMode) {
    timerMinutes.textContent = sessionLength / 60;
  }
});
