import overlayImages from "../Helpers/overlayImages";
const images = [
  {
    url: "https://pkkm22-3000.csb.app/images/logos/codecamp.png",
    width: 500,
    height: 500,
  },
  {
    url: "https://pkkm22-3000.csb.app/images/logos/vasion-300x300-1-200x200.webp",
    width: 500,
    height: 500,
  },
];

function SponsorSprite(getRandomNumber, canvas, coords) {
  let index = 0;

  console.log("Setting up the SponsorSprite");
  const sponsorSprite = {
    x: coords.x,
    y: coords.y,
    width: 500,
    height: 600,
    speed: 1,
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
        "https://pkkm22-3000.csb.app/images/logos/billboard.png",
        image.url,
        800,
        800
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
