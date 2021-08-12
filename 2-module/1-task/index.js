function sumSalary(salaries) {
  let sum = 0;
  for (var [key, value] of Object.entries(salaries)) {
    if (salaries.hasOwnProperty(key)) {
      sum +=
        typeof value === "number" &&
        !Number.isNaN(value) &&
        value !== Infinity &&
        value !== -Infinity
          ? value
          : 0;
    }
  }
  return sum;
}
