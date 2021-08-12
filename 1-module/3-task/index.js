function ucFirst(str) {
  str = str || "";
  return Array.prototype.map
    .call(str, (value, index) => {
      return index === 0 ? value.toUpperCase() : value;
    })
    .join("");
}
