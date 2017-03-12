import {
  clamp,
} from './utils';

import {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  UP_LEFT,
  UP_RIGHT,
  DOWN_LEFT,
  DOWN_RIGHT,
  getRandomDirection,
} from './directions';

import {
  getMouseCoords,
} from './mouse';

import {
  checkIfNodeShouldChangeDir,
  getDirExcludes,
} from './node';

const moveBy = 0.05;
const changeDirCountdown = 120;

export const moveNodeUpBy = (node) => {
  node.setY(clamp(node.y - moveBy, node.minY, node.maxY));
};

export const moveNodeDownBy = (node) => {
  node.setY(clamp(node.y + moveBy, node.minY, node.maxY));
};

export const moveNodeRightBy = (node) => {
  node.setX(clamp(node.x + moveBy, node.minX, node.maxX));
};

export const moveNodeLeftBy = (node) => {
  node.setX(clamp(node.x - moveBy, node.minX, node.maxX));
};

export const moveNodeUpLeft = (node) => {
  moveNodeUpBy(node);
  moveNodeLeftBy(node);
};

export const moveNodeUpRight = (node) => {
  moveNodeUpBy(node);
  moveNodeRightBy(node);
};

export const moveNodeDownLeft = (node) => {
  moveNodeDownBy(node);
  moveNodeLeftBy(node);
};

export const moveNodeDownRight = (node) => {
  moveNodeDownBy(node);
  moveNodeRightBy(node);
};

const moveNodeDirSwitch = (node, dir) => {
  switch (dir) {
    case UP:
      node.setDir(UP);
      moveNodeUpBy(node);
      break;
    case DOWN:
      node.setDir(DOWN);
      moveNodeDownBy(node);
      break;
    case LEFT:
      node.setDir(LEFT);
      moveNodeLeftBy(node);
      break;
    case RIGHT:
      node.setDir(RIGHT);
      moveNodeRightBy(node);
      break;
    case UP_LEFT:
      node.setDir(UP_LEFT);
      moveNodeUpLeft(node);
      break;
    case UP_RIGHT:
      node.setDir(UP_RIGHT);
      moveNodeUpRight(node);
      break;
    case DOWN_LEFT:
      node.setDir(DOWN_LEFT);
      moveNodeDownLeft(node);
      break;
    case DOWN_RIGHT:
      node.setDir(DOWN_RIGHT);
      moveNodeDownRight(node);
      break;
    default:
      node.setDir(DOWN_LEFT);
      moveNodeDownLeft(node);
  }
};

export const moveDirectionRandomlyBy = (node) => {
  if (node.shouldChangeDir || node.changeDirCountdown <= 0 || !node.dir) {
    let dir;

    if (node.shouldChangeDir) {
      dir = getRandomDirection(node);
      node.setShouldChangeDir(false);
    } else {
      dir = getRandomDirection(node);
    }

    node.setDirCountdown(changeDirCountdown);

    moveNodeDirSwitch(node, dir);
  } else {
    moveNodeDirSwitch(node, node.dir);
    node.setDirCountdown(node.changeDirCountdown - 1);
    node.setShouldChangeDir(checkIfNodeShouldChangeDir(node));

    if (node.shouldChangeDir) {
      node.setDirExcludes(getDirExcludes(node));
    } else {
      node.setDirExcludes([]);
    }
  }

  return node;
};

export const moveTowardsMouse = (node, mouse) => {
  if (node.x > mouse.x) {
    moveNodeLeftBy(node);
  } else if (node.x < mouse.x) {
    moveNodeRightBy(node);
  }

  if (node.y > mouse.y) {
    moveNodeUpBy(node);
  } else if (node.y < mouse.y) {
    moveNodeDownBy(node);
  }

  return node;
};

export const moveNodes = nodes => nodes.map((node) => {
  if (node.highlightLevel === 0) {
    return moveDirectionRandomlyBy(node);
  }
  return moveTowardsMouse(node, getMouseCoords(), moveBy * 2);
});
