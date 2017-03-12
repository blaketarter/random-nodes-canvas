const mouse = {
  x: null,
  y: null,
  isMouseOverCanvas: false,
};

export const setMouseCoords = (e) => {
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
};

export const getMouseCoords = () => ({
  x: mouse.x,
  y: mouse.y,
  isMouseOverCanvas: mouse.isMouseOverCanvas,
});

export const onMouseEnter = () => {
  mouse.isMouseOverCanvas = true;
}

export const onMouseLeave = () => {
  mouse.isMouseOverCanvas = false;
}
