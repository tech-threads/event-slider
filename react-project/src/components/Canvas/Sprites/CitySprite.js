const images = [
  {
    url: "https://th.bing.com/th/id/R.fbc13f1d0386dd14b4a3999e33e2448c?rik=cpWN9s8Qqi2TDA&riu=http%3a%2f%2fclipart-library.com%2fimages_k%2fsilhouette-of-city-skyline%2fsilhouette-of-city-skyline-3.png&ehk=em1Ikh%2bLydxPYyJDyEsKshZse0D%2fz7EYtlQPiUyuWQo%3d&risl=&pid=ImgRaw&r=0",
    width: 1920,
    height: 1000,
  },
];

function CitySprite(getRandomNumber, canvas, coords) {
  let index = 0;

  const citySprite = {
    x: coords.x,
    y: coords.y,
    width: 1920,
    height: 1000,
    speed: 0.1,
    getNextImage: null,
  };

  citySprite.getNextImage = async () => {
    try {
      if (index === images.length) {
        index = 0;
      }

      const image = images[index];

      index++;
      return image;
    } catch (e) {
      console.log("Something went wrong getting mountain image", e);
    }
  };
  return citySprite;
}

export default CitySprite;
