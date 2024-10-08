let spriteImage = {
  url: "/images/sprites/green-zone/1 Tiles/Tile_01.png",
  width: 1920,
  height: 1000,
};

function GrassBlock1Sprite({ x, y, width, height }) {
  const sprite = {
    x: x,
    y: y,
    width: width,
    height: height,
    speed: 0.1,
  };

  spriteImage.height = height;
  spriteImage.width = width;

  sprite.getNextImage = () => {
    return spriteImage;
  };

  return sprite;
}

export default GrassBlock1Sprite;
