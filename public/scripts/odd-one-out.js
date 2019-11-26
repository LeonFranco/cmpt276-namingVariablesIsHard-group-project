let num;

const socket = io.connect(window.location.origin);

const drawingDivs = $(".drawing");
const scoreDisplay = $('#score');
const playAgainBtn = $('#playAgainButton');

let svgArr = [];
let svgNormal = [];
let svgOdd;
let category = "";
let oddCategory = "";
let drawingCount = 0;
let oddIndex = 0;
let playerScore = 0;
let continueGame = true;
let allDrawingsLoaded = false;

socket.on('serverSendRandomCategoryName', (cat) => {
    if (category === "") {
        category = cat;
        socket.emit('clientRequestCountFromCategory', {
            category: category,
            count: drawingDivs.length - 1
        });
    } else {
        oddCategory = cat;
        socket.emit('clientRequestFromCategory', oddCategory);
    }

});

socket.on('serverSendDrawing', (drawingData) => {
    const { word, svg } = drawingData;
    if (word === category) {
        svgNormal.push(svg);
    } else {
        svgOdd = svg;
    }
    drawingCount++;
    allDrawingsLoaded = drawingCount === drawingDivs.length;
    if (allDrawingsLoaded) {
        oddIndex = randomRange(num);
        for(let i = 0; i < drawingDivs.length; i++) {
            if(i === oddIndex) {
                svgArr.push(svgOdd);
            } else {
                svgArr.push(svgNormal.pop());
            }
        }

        for (let i = 0; i < svgArr.length; i++) {
            $(drawingDivs[i]).html(svgArr[i]);
            $(drawingDivs[i]).on('click', function () {
                select(i);
            });
        }
    }
});

function randomRange(upperbound) {
    return Math.floor(Math.random() * upperbound);
}

function fillDrawingDivs() {
    svgArr = [];

    category = "";
    oddCategory = "";

    drawingCount = 0;
    allDrawingsLoaded = false;

    socket.emit('clientRequestRandomCategoryName');
    socket.emit('clientRequestRandomCategoryName');
}

$(document).ready(() => {
    console.log(difficulty);
    if (difficulty === 'easy') {
        num = 6;
    } else if (difficulty === 'normal') {
        num = 4;
    } else if (difficulty === 'hard') {
        num = 3;
    }
    scoreDisplay.text(`Score: ${playerScore}`);

    for (let i = 1; i <= num; i++) {
        document.getElementById('drawing' + i).addEventListener('click', function () {
            select(i - 1);
        });
    }

    fillDrawingDivs();
});

function select(index) {
    if (continueGame && allDrawingsLoaded) {

        if (index === oddIndex) {
            scoreDisplay.text(`Score: ${++playerScore}`);

            fillDrawingDivs();
        } else {
            continueGame = false;

            let alertString = "";
            alertString += `Game over!\n`;
            alertString += `It was picture ${oddIndex + 1}.\n\n`;
            alertString += `The common category was ${category}.\n`;
            alertString += `The odd one out was from ${oddCategory}.\n\n`;
            alertString += `Score: ${playerScore}\n\n`;
            alertString += `Click "Play Again" to start a new game!`;

            alert(alertString);
        }
    }
};

playAgainBtn.click(() => {
    if (allDrawingsLoaded) {
        console.log('play again clicked')
        continueGame = true;

        playerScore = 0;

        scoreDisplay.text(`Score: ${playerScore}`);

        fillDrawingDivs();
    }
});