import createElement from "../../assets/lib/create-element.js";

export default class CartIcon {
  constructor() {
    this.render();

    this.addEventListeners();
  }

  render() {
    this.elem = createElement('<div class="cart-icon"></div>');
  }

  update(cart) {
    if (!cart.isEmpty()) {
      this.elem.classList.add("cart-icon_visible");

      this.elem.innerHTML = `
        <div class="cart-icon__inner">
          <span class="cart-icon__count">${cart.getTotalCount()}</span>
          <span class="cart-icon__price">€${cart
            .getTotalPrice()
            .toFixed(2)}</span>
        </div>`;

      this.updatePosition();

      this.elem.classList.add("shake");
      this.elem.addEventListener(
        "animationend",
        () => {
          this.elem.classList.remove("shake");
        },
        { once: true }
      );
    } else {
      this.elem.classList.remove("cart-icon_visible");
    }
  }

  addEventListeners() {
    document.addEventListener("scroll", () => this.updatePosition());
    window.addEventListener("resize", () => this.updatePosition());
  }

  updatePosition() {
    // ваш код ...
    if (this.elem.offsetWidth === 0 && this.elem.offsetHeight === 0) return;

    let documentElement = document.documentElement;
    let startCoordIcon = this.elem.getBoundingClientRect();
    let containerCoord = document
      .querySelector(".container")
      .getBoundingClientRect().right;

    /// Initial place of icon
    if (!this.hasOwnProperty("_startY"))
      this._startY = documentElement.scrollTop + startCoordIcon.top;

    /// Mobile
    if (documentElement.clientWidth <= 767) {
      this.elem.style = "";
      return;
    }

    /// Desktop
    if (this._startY < documentElement.scrollTop) {
      let leftOffset = Math.min(
        containerCoord + 20,
        documentElement.clientWidth - this.elem.offsetWidth - 10
      );
      this.elem.style.cssText = `
        position: fixed;
        top: 50px;
        z-index: 1000;
        left: ${leftOffset}px;
      `;
    } else {
      this.elem.style = "";
    }
  }
}
