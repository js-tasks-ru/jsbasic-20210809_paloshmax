function camelize(str) {
  let prevChr;
  return str.split("").reduce((acc, value) => {
    if (prevChr === "-") value = value.toUpperCase();
    prevChr = value;
    return value !== "-" ? acc.concat(value) : acc;
  }, "");
}
