export default function initOpts({
  width,
  height,
}) {
  const spacing = 50;
  const maxX = window.innerWidth;
  const maxY = window.innerHeight;
  const xBlocks = Math.max(1, Math.ceil(maxX / spacing));
  const yBlocks = Math.max(1, Math.ceil(maxY / spacing));
  const endSizeX = maxX - ((xBlocks - 1) * spacing);
  const endSizeY = maxY - ((yBlocks - 1) * spacing);
  const blocks = xBlocks * yBlocks;

  return {
    spacing,
    maxX,
    maxY,
    xBlocks,
    yBlocks,
    endSizeX,
    endSizeY,
    blocks,
  }
};
