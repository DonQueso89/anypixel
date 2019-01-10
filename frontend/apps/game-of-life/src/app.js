var anypixel = require('anypixel');
var ctx = anypixel.canvas.getContext2D();
ctx.imageSmoothingEnabled = false;

var pixel = ctx.createImageData(1, 1); // data object used to update pixels with putImageData
var pixelData = pixel.data;
var colors = ['#F00', '#0F0', '#00F'];
var grid = {};
cWhite = [255, 255, 255, 255];
cBlack = [0, 0, 0, 255];
const DEAD = 0;
const ALIVE = 1;
const numCols = anypixel.config.width;
const numRows = anypixel.config.height;


/*
 * TODO: 
 *  - activate cells with click
 *  - adjusting colors for alive and dead cells
 *  - adjusting shapes
 *  - adjusting dimensions of grid
 *  - adjust brush size
 */


let neighbours = [
    [0, -1],
    [-1, 0],
    [-1, -1],
    [1, 1],
    [1, 0],
    [0, 1],
    [-1, 1],
    [1, -1]
];

class Coordinate {
  constructor(x, y, color, state) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.state = state;

  }
}

function randomInitGrid() {
  // Init random activations
  for (var x = 0; x < numCols; x++) {
    for (var y = 0; y < numRows; y++) {
      let state = Math.random() < .5 ? DEAD : ALIVE;
      let fillColor = state == DEAD ? cWhite : cBlack;
      grid[[x, y]] = new Coordinate(x, y, fillColor, state);
      pixelData[0] = fillColor[0];
      pixelData[1] = fillColor[1];
      pixelData[2] = fillColor[2];
      pixelData[3] = fillColor[3];
      ctx.putImageData(pixel, x, y);
    }
  }
}

/**
 * Listen for onButtonDown events and draw a 2x2 rectangle at the event site
 */
document.addEventListener('onButtonDown', function(event) {
  ctx.fillStyle = '#000';
  grid[[event.detail.x, event.detail.y]].state = ALIVE;
  ctx.fillRect(event.detail.x, event.detail.y, 1, 1);
});

function resolveCoordinateState(coordinate) {
  let numAliveNeighbours = neighbours.map(
      n => grid[[coordinate.x + n[0], coordinate.y + n[1]]]
  ).reduce(
      (a, e) => a + (e == undefined ? 0 : e.state == ALIVE),
      0
  );

  // Birth or Survival
  if (numAliveNeighbours == 3) {
    return ALIVE;
  }
  // Survival
  if (coordinate.state == ALIVE && numAliveNeighbours == 2) {
    return ALIVE;
  }
  // Death by loneliness or overpopulation
  return DEAD;
}

function update() {
  var newGrid = {};
  for (var x = 0; x < numCols; x++) {
    for (var y = 0; y < numRows; y++) {
      let coordinate = grid[[x, y]];
      nextState = resolveCoordinateState(coordinate);
      let fillColor = nextState == DEAD ? cWhite : cBlack;
      newGrid[[x, y]] = new Coordinate(x, y, fillColor, nextState);
      pixelData[0] = fillColor[0];
      pixelData[1] = fillColor[1];
      pixelData[2] = fillColor[2];
      pixelData[3] = fillColor[3];
      ctx.putImageData(pixel, x, y);
    }
  }
  grid = newGrid;
  window.requestAnimationFrame(update);
}

document.addEventListener('DOMContentLoaded', function() {
    randomInitGrid();
    // Start animation sequence
    window.requestAnimationFrame(update);
  }, false);
