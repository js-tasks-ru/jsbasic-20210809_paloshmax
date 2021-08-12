function getMinMax(str) {
  let arr = [];
  let value;
  let regexp = /(?:-?\d+)(?:\.\d+)?/g;

  while ((value = regexp.exec(str))) {
    arr.push(value[0]);
  }

  return {
    min: Math.min(...arr),
    max: Math.max(...arr),
  };
}
