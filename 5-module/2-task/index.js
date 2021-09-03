function toggleText() {
  document.addEventListener("click", (e) => {
    let target = e.target.closest(".toggle-text-button");
    if (target) {
      let textElem = document.querySelector("#text");
      if (textElem) textElem.toggleAttribute("hidden");
    }
  });
}
