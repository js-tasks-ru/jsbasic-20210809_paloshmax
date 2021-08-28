function showSalary(users, age) {
  return users
    .reduce((acc, value) => {
      if (value.age <= age)
        acc = acc.concat(`${value.name}, ${value.balance}\n`);
      return acc;
    }, "")
    .slice(0, -1);
}
