function hideSelf() {
  document.addEventListener("click", (e) => {
    /// Если кликаем по внутреннему элементу кнопки,
    /// а нам нужна именно кнопка, ищем адресата через closest
    let target = e.target.closest(".hide-self-button");
    let hasClass = Array.prototype.some.call(
      target ? target.classList : [],
      (value) => value === "hide-self-button"
    );
    if (hasClass) target.hidden = "true";
  });
}
