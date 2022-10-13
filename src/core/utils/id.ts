const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const CHARS_LENGTH = 62;

export default (length: number) => {
  let result = '';

  for (let i = 0; i < length; i += 1) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS_LENGTH));
  }
  return result;
};
