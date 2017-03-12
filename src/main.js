// todo
// make everything non mutating (as much as possible)
// pure funtions
// optimize

import {
  clamp,
  randomInArr,
  getRandomBetween,
} from './utils/index';

import {
  getMouseCoords,
  setMouseCoords,
} from './mouse/index';

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
} from './directions/index';

import initOpts from './opts/index';
import generateNodes, {
  connectNodes,
  checkIfNodeShouldChangeDir,
  getDirExcludes,
} from './node/index';

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
} from './move/index';

import {
  drawNode,
  drawRect,
  drawLine,
  drawConnections,
  getHighlightedNode,
  draw,
} from './draw/index';

function startRender() {
  const opts = initOpts({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  const stats = new Stats();
  stats.showPanel(0);
  
  document.onmousemove = setMouseCoords;
  const canvas = document.getElementById('graph');
  const ctx = canvas.getContext('2d');

  document.body.appendChild(stats.dom);

  canvas.width = opts.maxX;
  canvas.height = opts.maxY;

  let nodes = generateNodes(opts);
  nodes = connectNodes(nodes, opts);

  render(canvas, ctx, nodes, opts, stats);
}

function render(canvas, ctx, nodes, opts, stats) {
  stats.begin();
  draw(canvas, ctx, nodes, opts);
  stats.end();

  const newNodes = moveNodes(nodes);
  window.requestAnimationFrame(() => render(canvas, ctx, newNodes, opts, stats));
}

window.onload = startRender;
