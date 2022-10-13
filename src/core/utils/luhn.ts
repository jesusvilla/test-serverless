/* Classic algorithm
export default (value: string): boolean => {
  // accept only digits
  if (!/^\d+$/.test(value)) return false;

  let nCheck: number = 0;
  let bEven: boolean = false;
  value = value.replace(/\D/g, '');

  for (let n = value.length - 1; n >= 0; n--) {
    const cDigit = value.charAt(n);
    let nDigit = parseInt(cDigit, 10);

    if (bEven) {
      if ((nDigit *= 2) > 9) {
        nDigit -= 9;
      }
    }

    nCheck += nDigit;
    bEven = !bEven;
  }

  return (nCheck % 10) == 0;
} */

// Fastest algorithm (compared in https://jsbench.me/)
const DIGITS = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];
export default (value: string): boolean => {
  let len = value ? value.length : 0;
  let bit = 1;
  let sum = 0;

  while (len) {
    len -= 1;
    const item: string = value.charAt(len);
    bit ^= 1;
    if (bit) {
      const digit = DIGITS[+item];
      if (digit === undefined) {
        return false;
      }
      sum += digit;
    } else {
      sum += parseInt(item, 10);
    }
  }

  return sum % 10 === 0 && sum > 0;
};
