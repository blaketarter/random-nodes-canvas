// todo
// make everything non mutating (as much as possible)
// pure funtions
// optimize

import {
  setMouseCoords,
} from './mouse/index';
import initOpts from './opts/index';
import generateNodes, {
  connectNodes,
} from './node/index';
import {
  moveNodes,
} from './move/index';
import {
  draw,
} from './draw/index';

function render(canvas, ctx, nodes, opts, stats) {
  stats.begin();
  draw(canvas, ctx, nodes, opts);
  stats.end();

  const newNodes = moveNodes(nodes);
  window.requestAnimationFrame(() => render(canvas, ctx, newNodes, opts, stats));
}

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

window.onload = startRender;
