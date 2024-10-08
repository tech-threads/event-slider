import overlayImages from "../Helpers/overlayImages";
const images = [
  {
    url: "/images/logos/CodeCampPIxel.png",
    width: 133,
    height: 67,
  },
  {
    url: "/images/logos/pxArt (3).png",
    width: 240,
    height: 240,
  },
];

function SponsorSprite(getRandomNumber, canvas, coords) {
  let index = 0;

  console.log("Setting up the SponsorSprite");
  const sponsorSprite = {
    x: coords.x,
    y: coords.y,
    width: 240,
    height: 240,
    speed: 0.5,
    getNextImage: null,
  };

  sponsorSprite.getNextImage = async () => {
    try {
      console.log("Getting next sponsor");
      if (index === images.length) {
        index = 0;
      }

      const image = images[index];
      const melded = await overlayImages(
        "/images/logos/pxArt-1.png",
        image.url,
        {
          width: 240,
          height: 240,
        },
        {
          width: image.width,
          height: image.height,
        }
      );

      index++;
      return {
        ...image,
        url: melded,
      };
    } catch (e) {
      console.log("Something went wrong getting next sponsor image", e);
    }
  };
  return sponsorSprite;
}

export default SponsorSprite;
