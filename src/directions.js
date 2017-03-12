import {
  randomInArr,
} from './utils';

export const UP = 'up';
export const DOWN = 'down';
export const LEFT = 'left';
export const RIGHT = 'right';

export const UP_LEFT = 'up_left';
export const UP_RIGHT = 'up_right';
export const DOWN_LEFT = 'down_left';
export const DOWN_RIGHT = 'down_right';

export const DIR_LIST = [
  UP,
  DOWN,
  LEFT,
  RIGHT,
  UP_LEFT,
  UP_RIGHT,
  DOWN_LEFT,
  DOWN_RIGHT,
];

export const getRandomDirection = (node) => {
  const dirsMinusExcludes = DIR_LIST.filter(dir => node.dirExcludes.indexOf(dir) < 0);
  return randomInArr(dirsMinusExcludes);
};
