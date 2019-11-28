const socket = io.connect(window.location.origin);

const drawingDiv = $('#drawing');
const scoreDisplay = $('#score');
const roundDisplay = $('#round');
const categoryDisplay = $('#category');
const playAgainBtn = $('#playAgainButton');
const passBtn = $('#passButton');
const failBtn = $('#failButton');

let category = "";
let playerScore = 0;
let round = 0;
let continueGame = true;
let drawingLoaded = false;
let drawingPassed = false;

$(document).ready(() => {
    startGame();
});

function startGame() {
    playerScore = 0;
    round = 0;
    nextRound();
}

function nextRound() {
    scoreDisplay.text(`Score: ${playerScore}`);
    if(round < 10) {
        round++;
        roundDisplay.text(`Round: ${round}`);
        getRound();
    } else {
        gameFinished();
    }
}

function getRound() {
    category = "";
    drawingLoaded = false;
    drawingPassed = Math.random() >= 0.5;
    socket.emit('clientRequestRandomCategoryName', 1, '', drawingPassed);
}

socket.on('serverSendRandomCategoryName', (cat) => {
    category = cat;
    categoryDisplay.html(category);

    socket.emit('clientRequestCountFromCategory', {
        category: category,
        count: 1,
        recognized: drawingPassed
    });
});

socket.on(('serverSendDrawing'), (drawingData) => {
    const { word, svg } = drawingData;
    drawingDiv.html(svg);
    drawingLoaded = true;
});

passBtn.click(() => {
    submitGuess(true);
});

failBtn.click(() => {
    submitGuess(false);
});

function submitGuess(selectedPassed) {
    if(drawingLoaded && continueGame) {
        if(selectedPassed === drawingPassed) {
            playerScore++;
        }

        nextRound();
    }
}

function gameFinished() {
    continueGame = false;
    alert(`Game finished!\n\nScore: ${playerScore}\n\nClick "Play Again" to start a new game!`);
}

playAgainBtn.click(() => {
    if(drawingLoaded) {
        continueGame = true;
        startGame();
    }
});
