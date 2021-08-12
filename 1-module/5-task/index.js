function truncate(str, maxlength) {
  let replacer = "…";
  return str.length > maxlength
    ? str.slice(0, maxlength - replacer.length).concat(replacer)
    : str;
}
