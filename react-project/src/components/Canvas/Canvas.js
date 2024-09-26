import React, { useEffect, useRef } from "react";
import "./Canvas.css";
import SponsorSprite from "./Sprites/SponsorSprite";
import CitySprite from "./Sprites/CitySprite";

function Canvas() {
  const canvasRef = useRef(null);
  const hasSetupBeenCalled = useRef(false);
  const layers = useRef({
    stars: [],
    background: [],
    sprites: [],
    foreground: [],
  });

  useEffect(() => {
    const getRandomStartingXLocation = (canvasWidth, elementWidth) => {
      // Generate a random X position starting from the right edge of the canvas
      return getRandomNumber(0, canvasWidth);
    };

    const updateSpriteImage = async (sprite) => {
      const img = new Image();
      const nextImage = await sprite.config.getNextImage();
      console.log(nextImage);
      img.src = nextImage.url;

      img.onload = () => {
        sprite.image = img; // Store the loaded image in the element
        sprite.width = nextImage.width;
        sprite.height = nextImage.height;
      };
    };

    const getRandomNumber = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Utility function to get a random color representing stars
    const getRandomColor = () => {
      const colors = [
        "#FFFFFF", // White
        "#FFD700", // Gold
        "#FF4500", // Orange Red
        "#FF8C00", // Dark Orange
        "#B22222", // Firebrick
      ];

      return colors[Math.floor(Math.random() * colors.length)];
    };

    const createElement = async (type, config, layer, delay = 0) => {
      // Create a promise that resolves after the specified delay
      if (delay !== 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      const element = { type, ...config };

      if (type === "sprite") {
        const img = new Image();
        try {
          const nextImage = await config.getNextImage();
          config.height = nextImage.height;
          config.width = nextImage.width;
          img.src = nextImage.url;
          element.image = img; // Store the loaded image in the element
          element.config = config;
        } catch (e) {
          console.log("Something went wrong creating sprite", e);
        }
      }

      // Ensure the layer exists
      if (!layers.current[layer]) {
        console.error(
          `Layer "${layer}" does not exist. Available layers:`,
          Object.keys(layers.current)
        );
        return; // Exit early if the layer is invalid
      }

      layers.current[layer].push(element);
      console.log("Created element:", element); // Log element creation

      return element;
    };

    const drawElements = (context) => {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);

      Object.keys(layers.current).forEach((layer) => {
        layers.current[layer].forEach((element) => {
          if (element.type === "rectangle") {
            context.fillStyle = element.color || "rgba(255, 100, 100, 0.8)";
            context.fillRect(
              element.x,
              element.y,
              element.width,
              element.height
            );

            // Move rectangle
            element.x -= element.speed;
            if (
              element.x + element.width < 0 &&
              element.config &&
              element.config.noRegen === false
            ) {
              element.x = context.canvas.width;
            }

            if (element.config && element.config.perTickTranslation) {
              element.y += element.config.perTickTranslation.y * 10;
            }
          } else if (element.type === "sprite") {
            if (element.image.complete) {
              context.drawImage(
                element.image,
                element.x,
                element.y,
                element.width,
                element.height
              );
            }

            // Move sprite
            element.x -= element.speed;
            if (element.x + element.width < 0 && !element.config.noRegen) {
              updateSpriteImage(element);
              element.x = context.canvas.width; // Reset position to the right
            }
          }
        });
      });
    };

    const animate = (context) => {
      drawElements(context);
      requestAnimationFrame(() => animate(context));
    };

    async function createCityScapeSprites(
      createElement,
      getRandomNumber,
      canvas
    ) {
      await createElement(
        "sprite",
        CitySprite(getRandomNumber, canvas, {
          x: 0,
          y: canvas.height - 1000,
        }),
        "background"
      );

      await createElement(
        "sprite",
        CitySprite(getRandomNumber, canvas, {
          x: 800,
          y: canvas.height - 1000,
        }),
        "background"
      );

      await createElement(
        "sprite",
        CitySprite(getRandomNumber, canvas, {
          x: 1920,
          y: canvas.height - 1000,
        }),
        "background"
      );
    }

    const setup = async () => {
      hasSetupBeenCalled.current = true;
      console.log("setting up canvas render");
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.width = 1920;
      canvas.height = 1080;

      // Create example elements only once
      if (layers.current.background.length === 0) {
        StartShootingStars(
          getRandomNumber,
          createElement,
          getRandomStartingXLocation,
          canvas,
          getRandomColor
        ); // Start the first star creation

        await createCityScapeSprites(createElement, getRandomNumber, canvas);

        if (layers.current.foreground.length === 0) {
          let height = canvas.height - (500 - 100);

          let coords = {
            x: getRandomNumber(0, canvas.width),
            y: height, // sprite height - footer height
          };

          await createElement(
            "sprite",
            SponsorSprite(getRandomNumber, canvas, coords),
            "foreground"
          );
        }
      }

      animate(context);
    };

    function StartShootingStars(
      getRandomNumber,
      createElement,
      getRandomStartingXLocation,
      canvas,
      getRandomColor
    ) {
      let pendingInterval = null;

      const createStar = async () => {
        // Wait for a random delay
        await new Promise((resolve) =>
          setTimeout(resolve, getRandomNumber(100, 1000) * 1)
        );

        // Create a shooting star
        await createShootingStar(
          createElement,
          getRandomStartingXLocation,
          canvas,
          getRandomNumber,
          getRandomColor
        );

        // Check for the next star
        pendingInterval = setTimeout(createStar, 1000); // Schedule the next star creation
      };

      pendingInterval = setTimeout(createStar, 1000); // Start the first star creation
      return pendingInterval;
    }

    function createShootingStar(
      createElement,
      getRandomStartingXLocation,
      canvas,
      getRandomNumber,
      getRandomColor
    ) {
      createElement(
        "rectangle",
        {
          x: getRandomStartingXLocation(canvas.width, 5),
          y: getRandomNumber(200, 500),
          width: getRandomNumber(1, 12),
          height: 5,
          speed: getRandomNumber(10, 20),
          color: getRandomColor(),
          noRegen: true,
          perTickTranslation: {
            x: 0,
            y: -10,
          },
        },
        "stars",
        5000
      );
    }

    if (!hasSetupBeenCalled.current) {
      setup();
    }
  }, [layers]);

  return (
    <div className="app-canvas">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default Canvas;
