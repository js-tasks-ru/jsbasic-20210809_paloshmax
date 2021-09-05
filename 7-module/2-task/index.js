export default class Modal {
  constructor() {
    let modal = this._createFragment(`<div class="modal"></div>`, true);
    let overlay = this._createFragment(`<div class="modal__overlay"></div>`);
    this._inner = this._createFragment(
      `<div class="modal__inner"></div>`,
      true
    );
    let closeBtn = this._createFragment(`
      <button type="button" class="modal__close">
        <img src="/assets/images/icons/cross-icon.svg" alt="close-icon">
      </button>
    `);
    modal.append(overlay);
    modal.append(this._inner);
    this._inner.append(closeBtn);
    this._elem = modal;

    this._keyDownHandler = this._keyDownHandler.bind(this);
    this._closeEngine();
  }
  open() {
    let modal;
    if ((modal = document.querySelector(".modal"))) modal.remove();
    document.body.prepend(this._elem);
    document.body.classList.add("is-modal-open");
  }
  close() {
    document.body.classList.remove("is-modal-open");
    document.removeEventListener("keydown", this._keyDownHandler);
    this._elem.remove();
  }
  setTitle(string) {
    let titleElem = this._createFragment(
      `<div class="modal__title"></div>`,
      true
    );
    titleElem.textContent = string;
    this._inner.append(titleElem);
  }
  setBody(node) {
    let modalBody = this._createFragment(
      `<div class="modal__body"></div>`,
      true
    );
    modalBody.append(node);
    this._inner.append(modalBody);
  }
  _closeEngine() {
    /// по клику
    this._elem.addEventListener("click", (e) => {
      console.log(1);
      let target = e.target.closest(".modal__close");
      if (!target) return;
      this._elem.remove();
      document.body.classList.remove("is-modal-open");
      document.removeEventListener("keydown", this._keyDownHandler);
    });
    /// по кнопке esc
    document.addEventListener("keydown", this._keyDownHandler);
  }
  _keyDownHandler(e) {
    if (e.code === "Escape") {
      this._elem.remove();
      document.body.classList.remove("is-modal-open");
      document.removeEventListener("keydown", this._keyDownHandler);
    }
  }
  _createFragment(html, isElement) {
    isElement = isElement || false;
    let fragment = document.createElement("template");
    if (typeof html === "string") fragment.innerHTML = html;
    return isElement === false
      ? fragment.content
      : fragment.content.firstElementChild;
  }
}
