export const clamp = (input, min, max) => {
  return Math.min(Math.max(input, min), max);
};

export const randomInArr = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const getRandomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
