export const clamp = (input, min, max) => Math.min(Math.max(input, min), max);

export const randomInArr = arr => arr[Math.floor(Math.random() * arr.length)];

export const getRandomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
