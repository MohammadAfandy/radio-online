export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const safeJSONParse = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
};

export const abbrNum = (num, dec) => {
  let x = ('' + num).length;
  dec = Math.pow(10, dec);
  x -= x % 3;
  return Math.round(num * dec / Math.pow(10, x)) / dec + ' kMGTPE' [x / 3];
};
