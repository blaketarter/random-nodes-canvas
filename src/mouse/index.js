const mouse = {
  x: null,
  y: null,
};

export const setMouseCoords = (e) => {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
};

export const getMouseCoords = () => {
  return {
    x: mouse.x,
    y: mouse.y,
  };
};
