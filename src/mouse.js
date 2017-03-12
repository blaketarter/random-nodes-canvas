const mouse = {
  x: null,
  y: null,
};

export const setMouseCoords = (e) => {
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
};

export const getMouseCoords = () => ({
  x: mouse.x,
  y: mouse.y,
});
