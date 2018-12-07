const formatNumberDecimals = (num, decimalLength) => {
  // Fix num to decimal length one greater than intended so we can
  // use the last digit that will be sliced to determine whether to round up or down
  num = Number(num);
  const withExtra = num.toFixed(decimalLength ? decimalLength + 1 : 4);
  const shouldRoundUp = withExtra[withExtra.length - 1] >= 5;
  let rightLength = withExtra.slice(0, -1);
  const lastDecimal = Number(rightLength.slice(-1));
  const secondToLastDecimal = Number(rightLength.slice(-2));
  let rounded;
  if (shouldRoundUp && lastDecimal === 9) {
    rightLength[rightLength.length - 2] = (secondToLastDecimal + 1).toString();
    rightLength[rightLength.length - 1] = 0;
    rounded = rightLength;
  } else if (shouldRoundUp && lastDecimal !== 9) {
    rounded = rightLength.slice(0, -1) + (lastDecimal + 1)
  } else {
    rounded = rightLength;
  }
  return rounded[0] === '0' ? rounded.slice(1) : rounded;
}

module.exports = formatNumberDecimals;