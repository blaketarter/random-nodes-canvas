import {
  getMouseCoords,
} from '../mouse/index';

const dotStyle = 'rgb(221, 221, 221)';
const rectStyle = 'rgba(221, 221, 221, 0.2)';
const lineStyle = {
  0: 'rgba(221, 221, 221, 0.4)',
  1: 'rgba(247, 147, 30, 0.4)',
  2: 'rgba(247, 147, 30, 0.8)',
};

export const drawNode = (node, ctx) => {
  ctx.fillStyle = dotStyle;
  ctx.fillRect(
    node.coords[0],
    node.coords[1],
    1,
    1,
  );
};

export const drawRect = (node, ctx, opts) => {
  ctx.strokeStyle = rectStyle;
  ctx.strokeRect(
    (node.col - 1) * opts.spacing,
    (node.row - 1) * opts.spacing,
    opts.spacing,
    opts.spacing,
  );
};

export const drawLine = (from, to, ctx, highlightLevel) => {
  ctx.strokeStyle = lineStyle[highlightLevel];
  ctx.beginPath();
  ctx.moveTo(from.coords[0], from.coords[1]);
  ctx.lineTo(to.coords[0], to.coords[1]);
  ctx.closePath();
  ctx.stroke();
};

export const drawConnections = (node, ctx) => {
  node.siblings
    .forEach(sibling => drawLine(node, sibling, ctx, node.highlightLevel));
};

export const getHighlightedNode = (nodes, mouse) => {
  let highlightedNode;

  nodes.forEach((node) => {
    if (
      (node.minX <= mouse.x && mouse.x <= node.maxX) &&
      (node.minY <= mouse.y && mouse.y <= node.maxY)
    ) {
      highlightedNode = node;
      node.setHighlightLevel(2);
    } else {
      node.setHighlightLevel(0);
    }
  });

  if (highlightedNode) {
    highlightedNode.siblings.forEach((node) => {
      node.setHighlightLevel(1);
    });
  }
};

export const draw = (canvas, ctx, nodes, opts) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  getHighlightedNode(nodes, getMouseCoords());

  nodes.forEach((node) => {
    drawNode(node, ctx, opts);
    // drawRect(node, ctx, opts);
    drawConnections(node, ctx, opts);
  });
};
