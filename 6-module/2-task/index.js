export default class ProductCard {
  constructor(product) {
    let { name, price, category, image, id } = product;
    let template = `
      <div class="card">
        <div class="card__top">
          <img src="/assets/images/products/${image}" class="card__image" alt="product">
          <span class="card__price">€${Number(price).toFixed(2)}</span>
        </div>
        <div class="card__body">
          <div class="card__title">${name}</div>
          <button type="button" class="card__button">
              <img src="/assets/images/icons/plus-icon.svg" alt="icon">
          </button>
        </div>
      </div>
    `;
    this._elem = this._createFragment(template).firstElementChild;

    this._elem.addEventListener("click", (e) => {
      let target = e.target.closest(".card__button");
      if (!target) return;
      let customEvent = new CustomEvent("product-add", {
        detail: id,
        bubbles: true,
      });
      target.dispatchEvent(customEvent);
    });
  }

  _createFragment(html) {
    let fragment = document.createElement("template");
    fragment.innerHTML = html;
    return fragment.content;
  }

  get elem() {
    return this._elem;
  }
}
