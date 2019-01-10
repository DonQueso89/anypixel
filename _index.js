(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/license-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the license.
 */

'use strict';

module.exports = require('./lib/anypixel');

},{"./lib/anypixel":2}],2:[function(require,module,exports){
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/license-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the license.
 */

'use strict';

module.exports.config = require('./config');
module.exports.canvas = require('./canvas');
module.exports.events = require('./events');
module.exports.events.setStateListenerOn(document);

},{"./canvas":3,"./config":4,"./events":5}],3:[function(require,module,exports){
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/license-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the license.
 */

'use strict';

var config = require('./config');
var canvas = module.exports = {};

var domCanvas = document.getElementById(config.canvasId);

domCanvas.width = config.width;
domCanvas.height = config.height;

/**
 * Returns the 2D canvas context
 */
canvas.getContext2D = function getContext2D() {
	return domCanvas.getContext('2d');
}

/**
 * Returns the 3D canvas context
 */
canvas.getContext3D = function getContext3D() {
	return domCanvas.getContext('webgl', {preserveDrawingBuffer: true});
}
},{"./config":4}],4:[function(require,module,exports){
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/license-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the license.
 */

'use strict';

/**
 * Expose some configuration data. The user can overwrite this if their setup is different.
 */
var config = module.exports = {};

config.canvasId = 'button-canvas';
config.width = 140;
config.height = 42;
},{}],5:[function(require,module,exports){
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/license-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the license.
 */

'use strict';

/**
 * Listen for the 'buttonStates' event from a DOM target and emit onButtonDown / Up events
 * depending on the reported button state
 */
var events = module.exports = {};

events.setStateListenerOn = function setStateListenerOn(target) {
		
	if (target.anypixelListener) {
		return;
	}
	
	target.anypixelListener = true;

	target.addEventListener('buttonStates', function(data) {
		data.detail.forEach(function(button) {
			var x = button.p.x;
			var y = button.p.y;
			var state = button.s;
			var event = state === 1 ? 'onButtonDown' : 'onButtonUp';
			var key = x + ':' + y;

			if (state === 1) {
				events.pushedButtons[key] = {x: x, y: y};
			} else {
				delete events.pushedButtons[key];
			}
			
			target.dispatchEvent(new CustomEvent(event, {detail: {x: x, y: y}}));
		});
	});
}

/**
 * A map of currently-pushed buttons, provided for utility
 */
events.pushedButtons = {};

},{}],6:[function(require,module,exports){
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

},{"anypixel":1}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm5vZGVfbW9kdWxlcy9hbnlwaXhlbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbnlwaXhlbC9saWIvYW55cGl4ZWwuanMiLCJub2RlX21vZHVsZXMvYW55cGl4ZWwvbGliL2NhbnZhcy5qcyIsIm5vZGVfbW9kdWxlcy9hbnlwaXhlbC9saWIvY29uZmlnLmpzIiwibm9kZV9tb2R1bGVzL2FueXBpeGVsL2xpYi9ldmVudHMuanMiLCJzcmMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL2xpY2Vuc2UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgbGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvYW55cGl4ZWwnKTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvbGljZW5zZS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBsaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMuY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcnKTtcbm1vZHVsZS5leHBvcnRzLmNhbnZhcyA9IHJlcXVpcmUoJy4vY2FudmFzJyk7XG5tb2R1bGUuZXhwb3J0cy5ldmVudHMgPSByZXF1aXJlKCcuL2V2ZW50cycpO1xubW9kdWxlLmV4cG9ydHMuZXZlbnRzLnNldFN0YXRlTGlzdGVuZXJPbihkb2N1bWVudCk7XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL2xpY2Vuc2UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgbGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpO1xudmFyIGNhbnZhcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnZhciBkb21DYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjb25maWcuY2FudmFzSWQpO1xuXG5kb21DYW52YXMud2lkdGggPSBjb25maWcud2lkdGg7XG5kb21DYW52YXMuaGVpZ2h0ID0gY29uZmlnLmhlaWdodDtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSAyRCBjYW52YXMgY29udGV4dFxuICovXG5jYW52YXMuZ2V0Q29udGV4dDJEID0gZnVuY3Rpb24gZ2V0Q29udGV4dDJEKCkge1xuXHRyZXR1cm4gZG9tQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgM0QgY2FudmFzIGNvbnRleHRcbiAqL1xuY2FudmFzLmdldENvbnRleHQzRCA9IGZ1bmN0aW9uIGdldENvbnRleHQzRCgpIHtcblx0cmV0dXJuIGRvbUNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcsIHtwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IHRydWV9KTtcbn0iLCIvKipcbiAqIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL2xpY2Vuc2UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgbGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRXhwb3NlIHNvbWUgY29uZmlndXJhdGlvbiBkYXRhLiBUaGUgdXNlciBjYW4gb3ZlcndyaXRlIHRoaXMgaWYgdGhlaXIgc2V0dXAgaXMgZGlmZmVyZW50LlxuICovXG52YXIgY29uZmlnID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuY29uZmlnLmNhbnZhc0lkID0gJ2J1dHRvbi1jYW52YXMnO1xuY29uZmlnLndpZHRoID0gMTQwO1xuY29uZmlnLmhlaWdodCA9IDQyOyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvbGljZW5zZS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBsaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBMaXN0ZW4gZm9yIHRoZSAnYnV0dG9uU3RhdGVzJyBldmVudCBmcm9tIGEgRE9NIHRhcmdldCBhbmQgZW1pdCBvbkJ1dHRvbkRvd24gLyBVcCBldmVudHNcbiAqIGRlcGVuZGluZyBvbiB0aGUgcmVwb3J0ZWQgYnV0dG9uIHN0YXRlXG4gKi9cbnZhciBldmVudHMgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5ldmVudHMuc2V0U3RhdGVMaXN0ZW5lck9uID0gZnVuY3Rpb24gc2V0U3RhdGVMaXN0ZW5lck9uKHRhcmdldCkge1xuXHRcdFxuXHRpZiAodGFyZ2V0LmFueXBpeGVsTGlzdGVuZXIpIHtcblx0XHRyZXR1cm47XG5cdH1cblx0XG5cdHRhcmdldC5hbnlwaXhlbExpc3RlbmVyID0gdHJ1ZTtcblxuXHR0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uU3RhdGVzJywgZnVuY3Rpb24oZGF0YSkge1xuXHRcdGRhdGEuZGV0YWlsLmZvckVhY2goZnVuY3Rpb24oYnV0dG9uKSB7XG5cdFx0XHR2YXIgeCA9IGJ1dHRvbi5wLng7XG5cdFx0XHR2YXIgeSA9IGJ1dHRvbi5wLnk7XG5cdFx0XHR2YXIgc3RhdGUgPSBidXR0b24ucztcblx0XHRcdHZhciBldmVudCA9IHN0YXRlID09PSAxID8gJ29uQnV0dG9uRG93bicgOiAnb25CdXR0b25VcCc7XG5cdFx0XHR2YXIga2V5ID0geCArICc6JyArIHk7XG5cblx0XHRcdGlmIChzdGF0ZSA9PT0gMSkge1xuXHRcdFx0XHRldmVudHMucHVzaGVkQnV0dG9uc1trZXldID0ge3g6IHgsIHk6IHl9O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZGVsZXRlIGV2ZW50cy5wdXNoZWRCdXR0b25zW2tleV07XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHRhcmdldC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChldmVudCwge2RldGFpbDoge3g6IHgsIHk6IHl9fSkpO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxuLyoqXG4gKiBBIG1hcCBvZiBjdXJyZW50bHktcHVzaGVkIGJ1dHRvbnMsIHByb3ZpZGVkIGZvciB1dGlsaXR5XG4gKi9cbmV2ZW50cy5wdXNoZWRCdXR0b25zID0ge307XG4iLCJ2YXIgYW55cGl4ZWwgPSByZXF1aXJlKCdhbnlwaXhlbCcpO1xudmFyIGN0eCA9IGFueXBpeGVsLmNhbnZhcy5nZXRDb250ZXh0MkQoKTtcbmN0eC5pbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcblxudmFyIHBpeGVsID0gY3R4LmNyZWF0ZUltYWdlRGF0YSgxLCAxKTsgLy8gZGF0YSBvYmplY3QgdXNlZCB0byB1cGRhdGUgcGl4ZWxzIHdpdGggcHV0SW1hZ2VEYXRhXG52YXIgcGl4ZWxEYXRhID0gcGl4ZWwuZGF0YTtcbnZhciBjb2xvcnMgPSBbJyNGMDAnLCAnIzBGMCcsICcjMDBGJ107XG52YXIgZ3JpZCA9IHt9O1xuY1doaXRlID0gWzI1NSwgMjU1LCAyNTUsIDI1NV07XG5jQmxhY2sgPSBbMCwgMCwgMCwgMjU1XTtcbmNvbnN0IERFQUQgPSAwO1xuY29uc3QgQUxJVkUgPSAxO1xuY29uc3QgbnVtQ29scyA9IGFueXBpeGVsLmNvbmZpZy53aWR0aDtcbmNvbnN0IG51bVJvd3MgPSBhbnlwaXhlbC5jb25maWcuaGVpZ2h0O1xuXG5cbi8qXG4gKiBUT0RPOiBcbiAqICAtIGFjdGl2YXRlIGNlbGxzIHdpdGggY2xpY2tcbiAqICAtIGFkanVzdGluZyBjb2xvcnMgZm9yIGFsaXZlIGFuZCBkZWFkIGNlbGxzXG4gKiAgLSBhZGp1c3Rpbmcgc2hhcGVzXG4gKiAgLSBhZGp1c3RpbmcgZGltZW5zaW9ucyBvZiBncmlkXG4gKiAgLSBhZGp1c3QgYnJ1c2ggc2l6ZVxuICovXG5cblxubGV0IG5laWdoYm91cnMgPSBbXG4gICAgWzAsIC0xXSxcbiAgICBbLTEsIDBdLFxuICAgIFstMSwgLTFdLFxuICAgIFsxLCAxXSxcbiAgICBbMSwgMF0sXG4gICAgWzAsIDFdLFxuICAgIFstMSwgMV0sXG4gICAgWzEsIC0xXVxuXTtcblxuY2xhc3MgQ29vcmRpbmF0ZSB7XG4gIGNvbnN0cnVjdG9yKHgsIHksIGNvbG9yLCBzdGF0ZSkge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuXG4gIH1cbn1cblxuZnVuY3Rpb24gcmFuZG9tSW5pdEdyaWQoKSB7XG4gIC8vIEluaXQgcmFuZG9tIGFjdGl2YXRpb25zXG4gIGZvciAodmFyIHggPSAwOyB4IDwgbnVtQ29sczsgeCsrKSB7XG4gICAgZm9yICh2YXIgeSA9IDA7IHkgPCBudW1Sb3dzOyB5KyspIHtcbiAgICAgIGxldCBzdGF0ZSA9IE1hdGgucmFuZG9tKCkgPCAuNSA/IERFQUQgOiBBTElWRTtcbiAgICAgIGxldCBmaWxsQ29sb3IgPSBzdGF0ZSA9PSBERUFEID8gY1doaXRlIDogY0JsYWNrO1xuICAgICAgZ3JpZFtbeCwgeV1dID0gbmV3IENvb3JkaW5hdGUoeCwgeSwgZmlsbENvbG9yLCBzdGF0ZSk7XG4gICAgICBwaXhlbERhdGFbMF0gPSBmaWxsQ29sb3JbMF07XG4gICAgICBwaXhlbERhdGFbMV0gPSBmaWxsQ29sb3JbMV07XG4gICAgICBwaXhlbERhdGFbMl0gPSBmaWxsQ29sb3JbMl07XG4gICAgICBwaXhlbERhdGFbM10gPSBmaWxsQ29sb3JbM107XG4gICAgICBjdHgucHV0SW1hZ2VEYXRhKHBpeGVsLCB4LCB5KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBMaXN0ZW4gZm9yIG9uQnV0dG9uRG93biBldmVudHMgYW5kIGRyYXcgYSAyeDIgcmVjdGFuZ2xlIGF0IHRoZSBldmVudCBzaXRlXG4gKi9cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ29uQnV0dG9uRG93bicsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gIGN0eC5maWxsU3R5bGUgPSAnIzAwMCc7XG4gIGdyaWRbW2V2ZW50LmRldGFpbC54LCBldmVudC5kZXRhaWwueV1dLnN0YXRlID0gQUxJVkU7XG4gIGN0eC5maWxsUmVjdChldmVudC5kZXRhaWwueCwgZXZlbnQuZGV0YWlsLnksIDEsIDEpO1xufSk7XG5cbmZ1bmN0aW9uIHJlc29sdmVDb29yZGluYXRlU3RhdGUoY29vcmRpbmF0ZSkge1xuICBsZXQgbnVtQWxpdmVOZWlnaGJvdXJzID0gbmVpZ2hib3Vycy5tYXAoXG4gICAgICBuID0+IGdyaWRbW2Nvb3JkaW5hdGUueCArIG5bMF0sIGNvb3JkaW5hdGUueSArIG5bMV1dXVxuICApLnJlZHVjZShcbiAgICAgIChhLCBlKSA9PiBhICsgKGUgPT0gdW5kZWZpbmVkID8gMCA6IGUuc3RhdGUgPT0gQUxJVkUpLFxuICAgICAgMFxuICApO1xuXG4gIC8vIEJpcnRoIG9yIFN1cnZpdmFsXG4gIGlmIChudW1BbGl2ZU5laWdoYm91cnMgPT0gMykge1xuICAgIHJldHVybiBBTElWRTtcbiAgfVxuICAvLyBTdXJ2aXZhbFxuICBpZiAoY29vcmRpbmF0ZS5zdGF0ZSA9PSBBTElWRSAmJiBudW1BbGl2ZU5laWdoYm91cnMgPT0gMikge1xuICAgIHJldHVybiBBTElWRTtcbiAgfVxuICAvLyBEZWF0aCBieSBsb25lbGluZXNzIG9yIG92ZXJwb3B1bGF0aW9uXG4gIHJldHVybiBERUFEO1xufVxuXG5mdW5jdGlvbiB1cGRhdGUoKSB7XG4gIHZhciBuZXdHcmlkID0ge307XG4gIGZvciAodmFyIHggPSAwOyB4IDwgbnVtQ29sczsgeCsrKSB7XG4gICAgZm9yICh2YXIgeSA9IDA7IHkgPCBudW1Sb3dzOyB5KyspIHtcbiAgICAgIGxldCBjb29yZGluYXRlID0gZ3JpZFtbeCwgeV1dO1xuICAgICAgbmV4dFN0YXRlID0gcmVzb2x2ZUNvb3JkaW5hdGVTdGF0ZShjb29yZGluYXRlKTtcbiAgICAgIGxldCBmaWxsQ29sb3IgPSBuZXh0U3RhdGUgPT0gREVBRCA/IGNXaGl0ZSA6IGNCbGFjaztcbiAgICAgIG5ld0dyaWRbW3gsIHldXSA9IG5ldyBDb29yZGluYXRlKHgsIHksIGZpbGxDb2xvciwgbmV4dFN0YXRlKTtcbiAgICAgIHBpeGVsRGF0YVswXSA9IGZpbGxDb2xvclswXTtcbiAgICAgIHBpeGVsRGF0YVsxXSA9IGZpbGxDb2xvclsxXTtcbiAgICAgIHBpeGVsRGF0YVsyXSA9IGZpbGxDb2xvclsyXTtcbiAgICAgIHBpeGVsRGF0YVszXSA9IGZpbGxDb2xvclszXTtcbiAgICAgIGN0eC5wdXRJbWFnZURhdGEocGl4ZWwsIHgsIHkpO1xuICAgIH1cbiAgfVxuICBncmlkID0gbmV3R3JpZDtcbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgcmFuZG9tSW5pdEdyaWQoKTtcbiAgICAvLyBTdGFydCBhbmltYXRpb24gc2VxdWVuY2VcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG4gIH0sIGZhbHNlKTtcbiJdfQ==
