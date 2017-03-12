const mouse = {
  x: null,
  y: null,
};

export const setMouseCoords = (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
};

export const getMouseCoords = () => ({
  x: mouse.x,
  y: mouse.y,
});
