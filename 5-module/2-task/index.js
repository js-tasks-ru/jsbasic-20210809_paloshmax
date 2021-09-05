function toggleText() {
  let btnElem = document.querySelector(".toggle-text-button");
  let textElem = document.querySelector("#text");
  btnElem.addEventListener("click", () => {
    if (textElem) textElem.hidden = !textElem.hidden;
  });
}
