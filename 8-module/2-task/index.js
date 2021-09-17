import createElement from "../../assets/lib/create-element.js";
import ProductCard from "../../6-module/2-task/index.js";

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this._filters = {
      noNuts: false,
      vegeterianOnly: false,
      maxSpiciness: 4,
      category: "",
    };
    this.render();
  }

  render() {
    this._elem = createElement(`
      <div class="products-grid">
        <div class="products-grid__inner">
        </div>
      </div>
    `);

    this._productsElement = this.products.map((product) => {
      return new ProductCard(product).elem;
    });

    this._container = this._elem.querySelector(".products-grid__inner");

    this._productsElement.forEach((product) => {
      this._container.append(product);
    });
  }
  updateFilter(filters) {
    let items = document.createDocumentFragment();
    Object.assign(this._filters, filters);

    this._container.innerHTML = "";

    this.products
      .reduce((acc, product) => {
        let noNuts =
          this._filters.noNuts === false
            ? true
            : this._filters.noNuts === !product.nuts
            ? true
            : false;
        let vegeterian =
          this._filters.vegeterianOnly === false
            ? true
            : this._filters.vegeterianOnly === product.vegeterian
            ? true
            : false;
        let spiciness = this._filters.maxSpiciness >= product.spiciness;
        let category =
          this._filters.category === ""
            ? true
            : this._filters.category === product.category
            ? true
            : false;
        if (noNuts && vegeterian && spiciness && category) acc.push(product);
        return acc;
      }, [])
      .forEach((product) => {
        items.append(new ProductCard(product).elem);
      });

    this._container.append(items);
  }
  get elem() {
    return this._elem;
  }
}
