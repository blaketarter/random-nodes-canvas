import {
  clamp,
} from '../utils/index';

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
} from '../directions/index';

import {
  getMouseCoords,
} from '../mouse/index';

import {
  checkIfNodeShouldChangeDir,
  getDirExcludes,
} from '../node/index';

const moveBy = 0.05;
const changeDirCountdown = 120;

export const moveNodeUpBy = (node) => {
  node.coords[1] = clamp(node.coords[1] - moveBy, node.minY, node.maxY);
  return node;
};

export const moveNodeDownBy = (node) => {
  node.coords[1] = clamp(node.coords[1] + moveBy, node.minY, node.maxY);
  return node;
};

export const moveNodeRightBy = (node) => {
  node.coords[0] = clamp(node.coords[0] + moveBy, node.minX, node.maxX);
  return node;
};

export const moveNodeLeftBy = (node) => {
  node.coords[0] = clamp(node.coords[0] - moveBy, node.minX, node.maxX);
  return node;
};

export const moveNodeUpLeft = (node) => {
  node = moveNodeUpBy(node);
  node = moveNodeLeftBy(node);
  return node;
};

export const moveNodeUpRight = (node) => {
  node = moveNodeUpBy(node);
  node = moveNodeRightBy(node);
  return node;
};

export const moveNodeDownLeft = (node) => {
  node = moveNodeDownBy(node);
  node = moveNodeLeftBy(node);
  return node;
};

export const moveNodeDownRight = (node) => {
  node = moveNodeDownBy(node);
  node = moveNodeRightBy(node);
  return node;
};

const moveNodeDirSwitch = (node, dir) => {
  switch (dir) {
    case UP:
      node.setDir(UP);
      node = moveNodeUpBy(node);
      break;
    case DOWN:
      node.setDir(DOWN);
      node = moveNodeDownBy(node);
      break;
    case LEFT:
      node.setDir(LEFT);
      node = moveNodeLeftBy(node);
      break;
    case RIGHT:
      node.setDir(RIGHT);
      node = moveNodeRightBy(node);
      break;
    case UP_LEFT:
      node.setDir(UP_LEFT);
      node = moveNodeUpLeft(node);
      break;
    case UP_RIGHT:
      node.setDir(UP_RIGHT);
      node = moveNodeUpRight(node);
      break;
    case DOWN_LEFT:
      node.setDir(DOWN_LEFT);
      node = moveNodeDownLeft(node);
      break;
    case DOWN_RIGHT:
      node.setDir(DOWN_RIGHT);
      node = moveNodeDownRight(node);
      break;
  }

  return node;
};

export const moveDirectionRandomlyBy = (node) => {
  if (node.shouldChangeDir || node.changeDirCountdown <= 0 || !node.dir) {
    let dir;

    if (node.shouldChangeDir) {
      dir = getRandomDirection(node);
      node.shouldChangeDir = false;
    } else {
      dir = getRandomDirection(node);
    }

    node.changeDirCountdown = changeDirCountdown;

    node = moveNodeDirSwitch(node, dir);
  } else {
    node = moveNodeDirSwitch(node, node.dir);
    node.changeDirCountdown -= 1;
    node.shouldChangeDir = checkIfNodeShouldChangeDir(node);

    if (node.shouldChangeDir) {
      node.dirExcludes = getDirExcludes(node);
    } else {
      node.dirExcludes = [];
    }
  }

  return node;
};

export const moveTowardsMouse = (node, mouse) => {
  if (node.coords[0] > mouse.x) {
    node = moveNodeLeftBy(node);
  } else if (node.coords[0] < mouse.x) {
    node = moveNodeRightBy(node);
  }

  if (node.coords[1] > mouse.y) {
    node = moveNodeUpBy(node);
  } else if (node.coords[1] < mouse.y) {
    node = moveNodeDownBy(node);
  }

  return node;
};

export const moveNodes = nodes => nodes.map((node, index) => {
  if (node.highlightLevel === 0) {
    return moveDirectionRandomlyBy(node);
  }
  return moveTowardsMouse(node, getMouseCoords(), moveBy * 2);
});
