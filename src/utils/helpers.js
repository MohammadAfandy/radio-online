export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const safeJSONParse = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error(error);
    return null;
  }
};
