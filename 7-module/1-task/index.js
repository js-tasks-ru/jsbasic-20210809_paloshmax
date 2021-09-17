export default class RibbonMenu {
  constructor(categories) {
    ///this.categories = categories;
    let ribbon = this._createFragment(`<div class="ribbon"></div>`, true);
    let leftButton = this._createFragment(`
      <button class="ribbon__arrow ribbon__arrow_left ribbon__arrow_visible">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </button>
    `);
    let rightButton = this._createFragment(`
      <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </button>
    `);
    let listWrapper = this._createFragment(
      `<div class="ribbon__inner"></div>`,
      true
    );
    let listItems = this._createListItems(categories);
    ribbon.append(leftButton);
    ribbon.append((listWrapper.append(listItems), listWrapper));
    ribbon.append(rightButton);
    this.value = "";
    this._engine(ribbon);
    this._elem = ribbon;
  }
  _engine(ribbon) {
    let scrollContainer = ribbon.querySelector(".ribbon__inner");

    if (scrollContainer) {
      let stepAmount = 350;
      let switchableClass = "ribbon__arrow_visible";
      let leftArr = ribbon.querySelector(".ribbon__arrow_left");
      let rightArr = ribbon.querySelector(".ribbon__arrow_right");
      let lastActive = null;
      ribbon.addEventListener("click", (e) => {
        let target;
        if ((target = e.target.closest(".ribbon__arrow"))) {
          if (leftArr === target) {
            scrollContainer.scrollBy(-stepAmount, 0);
          }
          if (rightArr === target) {
            scrollContainer.scrollBy(stepAmount, 0);
          }
        }
        if ((target = e.target.closest(".ribbon__item"))) {
          if (lastActive !== target) {
            target.classList.add("ribbon__item_active");
            if (lastActive) lastActive.classList.remove("ribbon__item_active");
            lastActive = target;
          }
          let ribbonSelectEvent = new CustomEvent("ribbon-select", {
            detail: target.dataset.id,
            bubbles: true,
          });
          this.value = target.dataset.id;
          target.dispatchEvent(ribbonSelectEvent);
        }
      });

      scrollContainer.addEventListener(
        "scroll",
        checkArrows.bind({ left: leftArr, right: rightArr })
      );

      function checkArrows(arg) {
        let { left, right } = this || arg;
        let currentPos = Math.round(scrollContainer.scrollLeft);
        let maxPos = scrollContainer.scrollWidth - scrollContainer.offsetWidth;

        if (currentPos <= 0 && left.classList.contains(switchableClass)) {
          left.classList.remove(switchableClass);
        } else {
          left.classList.add(switchableClass);
        }

        if (currentPos >= maxPos && right.classList.contains(switchableClass)) {
          right.classList.remove(switchableClass);
        } else {
          right.classList.add(switchableClass);
        }
      }
      /// Pre-init phase for correct arrows in slider
      document.addEventListener("DOMContentLoaded", () => {
        checkArrows({ left: leftArr, right: rightArr });
      });
    }
  }
  _createListItems(arr) {
    let listElem = this._createFragment();
    Array.prototype.forEach.call(arr, (item) => {
      let itemElem = this._createFragment(
        `<a href="#" class="ribbon__item" data-id="${item.id}">${item.name}</a>`
      );
      listElem.append(itemElem);
    });
    return listElem;
  }
  _createFragment(html, isElement) {
    isElement = isElement || false;
    let fragment = document.createElement("template");
    if (typeof html === "string") fragment.innerHTML = html;
    return isElement === false
      ? fragment.content
      : fragment.content.firstElementChild;
  }
  get elem() {
    return this._elem;
  }
}
