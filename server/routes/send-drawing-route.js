const sendDrawingRoute = require('express').Router();
const quickdraw = require('../lib/quickdraw/quickdraw-api');
const qdsr = require('quickdraw-svg-render')

sendDrawingRoute.get('/random', (req, res) => {
  console.log('Random drawing requested');

  quickdraw.getRandomDrawing((drawing) => {
    const svgArray = qdsr(drawing.drawing, true);
    const svgHTMLElem = svgArray.reduce((currentVal, nextVal) => {
      return currentVal + nextVal;
    });

    res.status(req.httpStatus.OK).send({ word: drawing.word, svg: svgHTMLElem });
  });
});

module.exports = sendDrawingRoute;