export const exportAsPNG = (canvas) => {
  const dataURL = canvas.toDataURL({
    format: "png",
    quality: 1, // Adjust quality (0-1)
  });

  // Create a link element to trigger download
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "canvas.png";
  link.click();
};

export const exportAsSVG = (canvas) => {
  const svgData = canvas.toSVG();

  // Create a blob for the SVG data
  const blob = new Blob([svgData], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  // Create a link element to trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = "canvas.svg";
  link.click();

  // Cleanup URL after download
  URL.revokeObjectURL(url);
};
