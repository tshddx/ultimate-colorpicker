const mapInterval = (input, inputStart, inputEnd, outputStart, outputEnd) => {
  const inputRange = inputEnd - inputStart;
  const position = (input - inputStart) / inputRange;
  const outputRange = outputEnd - outputStart;
  return position * outputRange + outputStart;
};

export default mapInterval;
