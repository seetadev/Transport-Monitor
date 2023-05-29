/**
 * Checks that all chars of a string are simple ASCII characters, excluding UNICODE and Extended ASCII
 * @see http://www.asciitable.com/
 * @param str the string to test
 */
export const isSimpleAscii = (str: string) => {
  for (var i = 0, n = str.length; i < n; i++) {
    if (str.charCodeAt(i) > 127) {
      console.log(str[i], str.charCodeAt(i));
      return false;
    }
  }
  return true;
};
