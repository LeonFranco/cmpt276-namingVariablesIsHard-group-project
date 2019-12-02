const gameModeMenu = $('#gameModeMenu');
const difficultyMenu = $('#difficultyMenu');
const confirmationMenu = $('#confirmationMenu');

$(document).ready(() => {
  difficultyMenu.hide();
  confirmationMenu.hide();
});


let gameMode;
let difficulty;

const standardBtn = $('#standardButton');
const oddOneOutBtn = $('#oddOneOutButton');
const timedBtn = $('#timedButton');
const wordHuntBtn = $('#wordHuntButton');
const passOrFailBtn = $('#passOrFailButton');

standardBtn.click(() => {
  gameMode = standardBtn.text();
  gameModePicked();
});

oddOneOutBtn.click(() => {
  gameMode = oddOneOutBtn.text();
  gameModePicked();
});

timedBtn.click(() => {
  gameMode = timedBtn.text();
  gameModePicked();
});

wordHuntBtn.click(() => {
  gameMode = wordHuntBtn.text();
  gameModePicked();
});

passOrFailBtn.click(() => {
  gameMode = passOrFailBtn.text();

  $('#confirmationMessage').text(`Play ${gameMode}?`);

  gameModeMenu.hide();
  confirmationMenu.show();
});


const easyBtn = $('#easyButton');
const normalBtn = $('#normalButton');
const hardBtn = $('#hardButton');
const backBtn = $('#backButton');

easyBtn.click(() => {
  difficulty = easyBtn.text();
  difficultyPicked();
});

normalBtn.click(() => {
  difficulty = normalBtn.text();
  difficultyPicked();
});

hardBtn.click(() => {
  difficulty = hardBtn.text();
  difficultyPicked();
});

backBtn.click(reset);


const yesBtn = $('#yesButton');
const noBtn = $('#noButton');

noBtn.click(reset);
yesBtn.click(() => {
  gameMode = gameMode.toLowerCase().replace(/ /g, "-");

  if (gameMode !== 'pass-or-fail') {
    difficulty = difficulty.toLowerCase();
    window.location.href = `${window.location.origin}/game-mode/${gameMode}/${difficulty}`;
  }
  else {
    window.location.href = `${window.location.origin}/game-mode/${gameMode}`;
  }
});


function gameModePicked() {
  gameModeMenu.hide();
  difficultyMenu.show();
}

function difficultyPicked() {
  $('#confirmationMessage').text(`Play ${gameMode} with ${difficulty} difficulty?`);

  difficultyMenu.hide();
  confirmationMenu.show();
}

function reset() {
  gameMode = undefined;
  difficulty = undefined;

  difficultyMenu.hide();
  confirmationMenu.hide();
  gameModeMenu.show();
}
