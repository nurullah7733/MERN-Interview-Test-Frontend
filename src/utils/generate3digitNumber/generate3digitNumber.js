function generate3DigitRandomNumber() {
  // Generate a random number between 0 and 999
  const randomNumber = Math.floor(Math.random() * 1000);
  // Pad the number with zeros to make it 3 digits
  const paddedNumber = randomNumber.toString().padStart(3, "0");
  return paddedNumber;
}

export default generate3DigitRandomNumber;
