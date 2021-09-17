export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
  }

  addProduct(product) {
    // ваш код
    if (product == null) return;
    let productIs = this.cartItems.find((item) => {
      return item.product.id === product.id;
    });
    if (!productIs) {
      this.cartItems.push({ product, count: 1 });
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

  onProductUpdate(cartItem) {
    // реализуем в следующей задаче

    this.cartIcon.update(this);
  }
}
