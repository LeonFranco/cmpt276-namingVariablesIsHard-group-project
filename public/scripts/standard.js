const socket = io.connect(window.location.origin);

const drawingDivs = $(".drawing");
let svgArr = [];
let category = "";
let drawingCount = 0;


socket.on('serverSendRandomCategoryName', (cat) => {
  category = cat;
  socket.emit('clientRequestCategorySize', category);
});

socket.on('serverSendCategorySize', (categorySize) => {
  const drawingIds = randomArray(categorySize, drawingDivs.length);

  $('.drawing').each(function (index) {
    socket.emit('clientRequestDrawing', { category: category, id: drawingIds[index] });
  });
});

socket.on('serverSendDrawing', (drawingData) => {
  const { word, svg } = drawingData;
  svgArr.push(svg);
  $(drawingDivs[drawingCount]).html(svgArr[drawingCount]);
  drawingCount++;
});

function fillDrawingDivs() {
  socket.emit('clientRequestRandomCategoryName');
}

function randomArray(upperbound, size) {
  let arr = [];
  while (arr.length < size) {
    let r = randomRange(upperbound);
    if (arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
};

function randomRange(upperbound) {
  return Math.floor(Math.random() * upperbound);
};

$(document).ready(() => {
  fillDrawingDivs();
});