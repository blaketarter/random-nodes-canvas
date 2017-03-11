// todo
// make everything non mutating (as much as possible)
// pure funtions
// optimize

import {
  clamp,
  randomInArr,
  getRandomBetween,
} from './utils/index.js';

import {
  getMouseCoords,
  setMouseCoords,
} from './mouse/index.js';

import {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  UP_LEFT,
  UP_RIGHT,
  DOWN_LEFT,
  DOWN_RIGHT,
  DIR_LIST,
  getRandomDirection,
} from './directions/index.js';

import initOpts from './opts/index.js';
import generateNodes, {
  connectNodes,
  checkIfNodeShouldChangeDir,
  getDirExcludes,
} from './node/index.js';

import {
  moveNodeUpBy,
  moveNodeDownBy,
  moveNodeLeftBy,
  moveNodeRightBy,
  moveNodeUpLeft,
  moveNodeUpRight,
  moveNodeDownLeft,
  moveNodeDownRight,
  moveDirectionRandomlyBy,
  moveTowardsMouse,
  moveNodes,
} from './move/index.js';

import {
  drawNode,
  drawRect,
  drawLine,
  drawConnections,
  getHighlightedNode,
  draw,
} from './draw/index.js';

const opts = initOpts({
  height: window.innerHeight,
  width: window.innerWidth,
});
let shouldRender = true;

let stats = new Stats();
stats.showPanel(0);

function startRender() {
  document.onmousemove = setMouseCoords;
  const canvas = document.getElementById('graph');
  const ctx = canvas.getContext('2d');
  
  document.body.appendChild(stats.dom);
  
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  
  let nodes = generateNodes(opts);
  nodes = connectNodes(nodes, opts);
  
  render(canvas, ctx, nodes);
  
  setTimeout(function() {
    shouldRender = false;
  }, 30000);
}

function render(canvas, ctx, nodes) {
  
  stats.begin();
  draw(canvas, ctx, nodes, opts);
  stats.end();
  
  if (shouldRender) {
    const newNodes = moveNodes(nodes);
    window.requestAnimationFrame(() => render(canvas, ctx, newNodes));
  }
}

window.onload = startRender;
