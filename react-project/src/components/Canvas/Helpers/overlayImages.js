function overlayImages(baseImageSrc, coverImageSrc, width, height) {
  return new Promise((resolve, reject) => {
    const baseImage = new Image();
    const coverImage = new Image();

    baseImage.src = baseImageSrc;
    coverImage.src = coverImageSrc;

    // Wait for both images to load
    Promise.all([
      new Promise((res) => {
        baseImage.onload = res;
      }),
      new Promise((res) => {
        coverImage.onload = res;
      }),
    ])
      .then(() => {
        // Create canvas and context
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas dimensions to the specified width and height
        canvas.width = width;
        canvas.height = height;

        baseImage.height = height;

        // Draw the base image
        ctx.drawImage(baseImage, 0, 0);

        // Calculate position to center the cover image
        const coverX = (width - coverImage.width) / 2 - 50;
        const coverY = (height - coverImage.height) / 2 - 275;

        // Draw the cover image centered on the canvas
        ctx.drawImage(coverImage, coverX, coverY);

        // Convert canvas to Blob URL
        canvas.toBlob((blob) => {
          if (blob) {
            const blobUrl = URL.createObjectURL(blob);
            resolve(blobUrl);
          } else {
            reject(new Error("Failed to create Blob from canvas."));
          }
        }, "image/png");
      })
      .catch((e) => {
        console.error(e);
        reject();
      });
  });
}

export default overlayImages;

// Example usage:
// overlayImages('baseImage.png', 'coverImage.png', 800, 600)
//     .then(blobUrl => {
//         console.log('Blob URL:', blobUrl);
//     })
//     .catch(err => {
//         console.error('Error:', err);
//     });
