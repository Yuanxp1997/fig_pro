export function getLightenHexColor(hexColor: string, amount: number): string {
  // Remove the '#' if present
  const sanitizedHex = hexColor.replace(/^#/, "");

  // Convert the hex string to an integer
  const colorInt = parseInt(sanitizedHex, 16);

  // Extract the red, green, and blue components
  const red = (colorInt >> 16) & 0xff;
  const green = (colorInt >> 8) & 0xff;
  const blue = colorInt & 0xff;

  // Calculate the new color components (lighter shade)
  const newRed = Math.min(255, red + amount);
  const newGreen = Math.min(255, green + amount);
  const newBlue = Math.min(255, blue + amount);

  // Combine the components back into a single color
  const newColorInt = (newRed << 16) | (newGreen << 8) | newBlue;

  // Convert the integer back to a hex string
  const newHexColor = `#${newColorInt.toString(16).padStart(6, "0")}`;

  return newHexColor;
}
