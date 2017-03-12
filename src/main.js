import {
  setMouseCoords,
} from './mouse';
import initOpts from './opts';
import generateNodes, {
  connectNodes,
} from './node';
import {
  moveNodes,
} from './move';
import {
  draw,
} from './draw';

function render(canvas, ctx, nodes, opts, beforeRender, afterRender) {
  beforeRender();
  draw(canvas, ctx, nodes, opts);
  afterRender();

  const newNodes = moveNodes(nodes);
  window.requestAnimationFrame(() =>
    render(canvas, ctx, newNodes, opts, beforeRender, afterRender));
}

function startRender({
  height,
  width,
  cellSize,
  canvasElement,
  beforeRender,
  afterRender,
}) {
  const opts = initOpts({
    height,
    width,
    cellSize,
  });

  document.onmousemove = setMouseCoords;
  const canvas = canvasElement;
  const ctx = canvas.getContext('2d');

  canvas.width = opts.maxX;
  canvas.height = opts.maxY;

  let nodes = generateNodes(opts);
  nodes = connectNodes(nodes, opts);

  render(canvas, ctx, nodes, opts, beforeRender, afterRender);
}

class RandomNodes {
  constructor({
    height,
    width,
    cellSize,
    beforeRender = () => { },
    afterRender = () => { },
    canvasElement,
  }) {
    this.height = height;
    this.width = width;
    this.cellSize = cellSize;
    this.canvasElement = canvasElement;
    this.beforeRender = beforeRender;
    this.afterRender = afterRender;
  }

  start() {
    startRender({
      height: this.height,
      width: this.width,
      cellSize: this.cellSize,
      canvasElement: this.canvasElement,
      beforeRender: this.beforeRender,
      afterRender: this.afterRender,
    });
  }
}

export default RandomNodes;
