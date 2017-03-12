import {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  UP_LEFT,
  UP_RIGHT,
  DOWN_LEFT,
  DOWN_RIGHT,
} from '../directions/index';

import {
  getRandomBetween,
} from '../utils/index';

class Node {
  constructor(opts) {
    this.x = opts.x;
    this.y = opts.y;
    this.row = opts.row;
    this.col = opts.col;
    this.siblings = [];

    this.shouldChangeDir = false;
    this.dir = null;
    this.changeDirCountdown = 0;
    this.dirExcludes = [];

    this.minX = opts.minX;
    this.maxX = opts.maxX;

    this.minY = opts.minY;
    this.maxY = opts.maxY;

    this.highlightLevel = 0;
  }

  addSibling(node) {
    this.siblings.push(node);
  }

  setDir(dir) {
    this.dir = dir;
  }

  setDirExcludes(excludes) {
    this.dirExcludes = excludes;
  }

  setHighlightLevel(newLevel) {
    this.highlightLevel = newLevel;
  }

  setX(newX) {
    this.x = newX;
  }

  setY(newY) {
    this.y = newY;
  }

  setShouldChangeDir(shouldChange) {
    this.shouldChangeDir = shouldChange;
  }

  setDirCountdown(newCount) {
    this.changeDirCountdown = newCount;
  }
}

export const connectNodes = (nodes, opts) => {
  nodes.forEach((node, index) => {
    if (node.col !== 1 && nodes[index - 1]) { // to the left
      nodes[index - 1].addSibling(node);
    }

    if (nodes[index - opts.xBlocks]) { // to the top
      nodes[index - opts.xBlocks].addSibling(node);
    }

    if (node.col !== opts.xBlocks && nodes[index + 1]) { // to the right
      nodes[index + 1].addSibling(node);
    }

    if (nodes[index + opts.xBlocks]) { // to the bottom
      nodes[index + opts.xBlocks].addSibling(node);
    }
  });

  return nodes;
};

export const checkIfNodeShouldChangeDir = (node) => {
  if (node.x === node.minX || node.x === node.maxX) {
    return true;
  } else if (node.y === node.minY || node.y === node.maxY) {
    return true;
  }
  return false;
};

export const getDirExcludes = (node) => {
  if (node.x === node.minX) {
    return [LEFT, UP, DOWN, UP_LEFT, DOWN_LEFT];
  } else if (node.x === node.maxX) {
    return [RIGHT, UP, DOWN, UP_RIGHT, DOWN_RIGHT];
  } else if (node.y === node.minY) {
    return [LEFT, UP, RIGHT, UP_LEFT, UP_RIGHT];
  } else if (node.y === node.maxY) {
    return [LEFT, DOWN, RIGHT, DOWN_LEFT, DOWN_RIGHT];
  }

  return [];
};

export default function generateNodes(opts) {
  const nodes = [];

  for (let y = 1, yy = opts.yBlocks; y <= yy; y += 1) {
    const ySpacing = (y === yy) ? opts.endSizeY : opts.spacing;
    const minY = (y - 1) * opts.spacing;

    for (let x = 1, xx = opts.xBlocks; x <= xx; x += 1) {
      const xSpacing = (x === xx) ? opts.endSizeX : opts.spacing;
      const minX = (x - 1) * opts.spacing;

      nodes.push(new Node({
        col: x,
        row: y,
        x: getRandomBetween(minX, minX + xSpacing),
        y: getRandomBetween(minY, minY + ySpacing),
        minX,
        maxX: minX + xSpacing,
        minY,
        maxY: minY + ySpacing,
      }));
    }
  }

  return nodes;
}
