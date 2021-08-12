function factorial(n) {
  for (var i = 1, res = 1; i <= n; res *= i++);
  return res;
}
