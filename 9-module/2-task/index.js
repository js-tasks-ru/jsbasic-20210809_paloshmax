import Carousel from "../../6-module/3-task/index.js";
import slides from "../../6-module/3-task/slides.js";

import RibbonMenu from "../../7-module/1-task/index.js";
import categories from "../../7-module/1-task/categories.js";

import StepSlider from "../../7-module/4-task/index.js";
import ProductsGrid from "../../8-module/2-task/index.js";

import CartIcon from "../../8-module/1-task/index.js";
import Cart from "../../8-module/4-task/index.js";

export default class Main {
  constructor() {}

  async render() {
    // ... ваш код
    this.carousel = new Carousel(slides);
    document.querySelector(`[data-carousel-holder]`).append(this.carousel.elem);

    this.ribbonMenu = new RibbonMenu(categories);
    document.querySelector(`[data-ribbon-holder]`).append(this.ribbonMenu.elem);

    this.stepSlider = new StepSlider({ steps: 5, value: 3 });
    document.querySelector(`[data-slider-holder]`).append(this.stepSlider.elem);

    this.cartIcon = new CartIcon();
    document
      .querySelector(`[data-cart-icon-holder]`)
      .append(this.cartIcon.elem);

    this.cart = new Cart(this.cartIcon);

    let requestItems = await fetch("./products.json");
    if (requestItems.ok) {
      this.listItems = await requestItems.json();
      let productsContainer = document.querySelector(
        `[data-products-grid-holder]`
      );
      productsContainer.innerHTML = "";
      this.productsGrid = new ProductsGrid(this.listItems);
      productsContainer.append(this.productsGrid.elem);

      this.productsGrid.updateFilter({
        noNuts: document.getElementById("nuts-checkbox").checked,
        vegeterianOnly: document.getElementById("vegeterian-checkbox").checked,
        maxSpiciness: this.stepSlider.options.currentStep,
        category: this.ribbonMenu.value,
      });
    }

    document.body.addEventListener("product-add", (e) => {
      let item = this.listItems.find((item) => {
        return item.id === e.detail;
      });
      this.cart.addProduct(item);
    });
    document.body.addEventListener("slider-change", (e) => {
      this.productsGrid.updateFilter({
        maxSpiciness: e.detail,
      });
    });
    document.body.addEventListener("ribbon-select", (e) => {
      this.productsGrid.updateFilter({
        category: e.detail,
      });
    });
    document.getElementById("nuts-checkbox").addEventListener("change", (e) => {
      this.productsGrid.updateFilter({
        noNuts: e.target.checked,
      });
    });
    document
      .getElementById("vegeterian-checkbox")
      .addEventListener("change", (e) => {
        this.productsGrid.updateFilter({
          vegeterianOnly: e.target.checked,
        });
      });
  }
}
