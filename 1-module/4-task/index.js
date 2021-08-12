function checkSpam(str) {
  str = str || "";
  return /(1xbet)|(xxx)/.test(str.toLowerCase());
}
