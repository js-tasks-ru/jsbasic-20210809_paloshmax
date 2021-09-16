import createElement from "../../assets/lib/create-element.js";

export default class Modal {
  constructor() {
    this.elements = {};
    this.render();

    this._close = this._close.bind(this);
    this._closeEngine();
  }
  render() {
    this._elem = createElement(`
    <div class="modal">
      <div class="modal__overlay"></div>
      <div class="modal__inner">
        <button type="button" class="modal__close">
          <img src="/assets/images/icons/cross-icon.svg" alt="close-icon">
        </button>
      </div>
    </div>
    `);
    this._inner = this._elem.querySelector(".modal__inner");
  }
  open() {
    let body = document.body;
    if (!body.classList.contains("is-modal-open")) body.prepend(this._elem);
    body.classList.add("is-modal-open");
  }
  close() {
    document.body.classList.remove("is-modal-open");
    document.removeEventListener("keydown", this._keyDownHandler);
    this._elem.remove();
  }
  setTitle(string) {
    if (!this.elements.title) {
      this.elements.title = createElement(`<div class="modal__title"></div>`);
      this._inner.append(this.elements.title);
    }
    this.elements.title.textContent = string;
  }
  setBody(node) {
    if (!this.elements.body) {
      this.elements.body = createElement(`<div class="modal__body"></div>`);
      this._inner.append(this.elements.body);
    }
    this.elements.body.innerHTML = "";
    this.elements.body.append(node);
  }
  _closeEngine() {
    /// по клику
    this._elem.addEventListener("click", this._close);
    /// по кнопке esc
    document.addEventListener("keydown", this._close);
  }
  _close(e) {
    if (e.code === "Escape" || e.target.closest(".modal__close")) {
      this._elem.remove();
      document.body.classList.remove("is-modal-open");
      this._elem.removeEventListener("click", this._close);
      document.removeEventListener("keydown", this._close);
    }
  }
}
