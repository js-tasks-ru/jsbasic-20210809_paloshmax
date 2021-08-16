function makeFriendsList(arr) {
  let root = document.createElement("ul");
  arr.forEach((item) => {
    let el = document.createElement("li");
    el.textContent = `${item.firstName} ${item.lastName}`;
    root.append(el);
  });
  return root;
}
