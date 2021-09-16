import createElement from "../../assets/lib/create-element.js";
import escapeHtml from "../../assets/lib/escape-html.js";

import Modal from "../../7-module/2-task/index.js";

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    // ваш код
    if (product == null) return;
    let productIs = this.cartItems.find((item) => {
      return item.product.id === product.id;
    });
    if (!productIs) {
      productIs = { product, count: 1 };
      this.cartItems.push(productIs);
    } else {
      productIs.count++;
    }
    this.onProductUpdate(productIs);
  }

  updateProductCount(productId, amount) {
    // ваш код
    let cartItem;
    this.cartItems = this.cartItems.filter((item) => {
      if (item.product.id === productId) {
        cartItem = item;
        item.count += amount;
        return item.count <= 0 ? false : true;
      }
      return true;
    });
    if (cartItem != null) this.onProductUpdate(cartItem);
  }

  removeAllItems() {
    this.cartItems = [];
    this.cartIcon.update(this);
  }

  isEmpty() {
    // ваш код
    return this.cartItems.length === 0 ? true : false;
  }

  getTotalCount() {
    // ваш код
    return this.cartItems.reduce((acc, item) => {
      return (acc += item.count);
    }, 0);
  }

  getTotalPrice() {
    // ваш код
    return this.cartItems.reduce((acc, item) => {
      return (acc += item.product.price * item.count);
    }, 0);
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
              2
            )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    // ...ваш код
    this.modal = new Modal();

    let bodyModal = createElement("<div></div>");
    this.cartItems
      .map((item) => {
        return this.renderProduct(item.product, item.count);
      })
      .forEach((item) => bodyModal.append(item));
    bodyModal.append(this.renderOrderForm());

    bodyModal.addEventListener("click", (e) => {
      let target = e.target.closest(".cart-product");
      let btn = e.target.closest(".cart-counter__button");
      if (!target || !btn) return;
      let productId = target.dataset.productId;
      if (!productId) return;

      if (btn.classList.contains("cart-counter__button_minus")) {
        this.updateProductCount(productId, -1);
      }
      if (btn.classList.contains("cart-counter__button_plus")) {
        this.updateProductCount(productId, 1);
      }
    });
    bodyModal.querySelector(".cart-form").addEventListener("submit", (e) => {
      this.onSubmit(e);
    });

    this.modal.open();
    this.modal.setTitle("Your order");
    this.modal.setBody(bodyModal);
  }

  onProductUpdate(cartItem) {
    // ...ваш код
    this.cartIcon.update(this);

    if (!document.body.classList.contains("is-modal-open")) return;

    let productId = cartItem.product.id;
    let body = this.modal.elements.body;

    let product = body.querySelector(`[data-product-id="${productId}"]`);
    let productCount = body.querySelector(
      `[data-product-id="${productId}"] .cart-counter__count`
    );
    let productPrice = body.querySelector(
      `[data-product-id="${productId}"] .cart-product__price`
    );
    let infoPrice = body.querySelector(`.cart-buttons__info-price`);

    if (cartItem.count > 0) {
      productCount.innerHTML = cartItem.count;
      productPrice.innerHTML = `€${(
        cartItem.product.price * cartItem.count
      ).toFixed(2)}`;
      infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;
    } else {
      if (this.isEmpty()) {
        this.modal.close();
        delete this.modal;
      }
      product.remove();
    }
  }

  onSubmit(event) {
    // ...ваш код
    event.preventDefault();
    let btn = event.target.querySelector(`[type="submit"]`);
    if (!btn) return;

    btn.classList.add("is-loading");
    (async () => {
      let request = await fetch("https://httpbin.org/post", {
        method: "POST",
        body: new FormData(event.target),
      });
      if (request.ok) {
        this.removeAllItems();
        this.modal.setTitle("Success!");
        this.modal.setBody(
          createElement(`
          <div class="modal__body-inner">
            <p>
              Order successful! Your order is being cooked :) <br>
              We’ll notify you about delivery time shortly.<br>
              <img src="/assets/images/delivery.gif">
            </p>
          </div>`)
        );
      }
    })();
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}
