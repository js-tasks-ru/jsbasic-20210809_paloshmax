function showSalary(users, age) {
  let res = "";
  users = users.filter((value) => {
    return value.age <= age;
  });
  for (var i = 0; i < users.length; i++) {
    if (users[i].age <= age) {
      res = res.concat(`${users[i].name}, ${users[i].balance}`);
      if (i < users.length - 1) res = res.concat("\n");
    }
  }
  return res;
}
