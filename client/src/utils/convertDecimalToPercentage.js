const convertDecimalToPercentage = num => {
  if (typeof num !== 'string') {
    num = num.toString();
  }
  if (num[0] === '0') {
    num = num.slice(2);
  } else if (num[0] === '1') {
    return '100%';
  }
  if (num.length === 1) {
    return num + '0%';
  } else if (num.length === 2) {
    return num + '%';
  } else {
    const preDecimal = num.slice(0, 2);
    let postDecimal;
    if (Number(num[3]) < 5) {
      postDecimal = num[2]
    } else {
      postDecimal = Number(num[2]) + 1;
    }
    return preDecimal + '.' + postDecimal + '%';
  }
}

export default convertDecimalToPercentage;