export default class Carousel {
  constructor(slides) {
    this.slides = slides;

    this.initialSlideNumber = 0;
    this._render();
  }

  _setInterface(number) {
    let leftStyle = this.parts.arrowLeft.style;
    let rightStyle = this.parts.arrowRight.style;

    if (number > 0 && number < this.slides.length - 1) {
      setValue(leftStyle, "display", "");
      setValue(rightStyle, "display", "");
    } else if (number === 0) {
      setValue(leftStyle, "display", "none");
    } else if (number === this.slides.length - 1) {
      setValue(rightStyle, "display", "none");
    }

    function setValue(elem, prop, value) {
      if (elem[prop] === value) return false;
      else elem[prop] = value;
      return true;
    }
  }
  _engine() {
    let slideContainer = this.parts.sliderContainer;
    let slideNumber = this.initialSlideNumber;
    this._elem.addEventListener("click", (e) => {
      let target = e.target.closest(".carousel__arrow");
      if (!target) return;

      let offset = slideContainer.offsetWidth;

      if (target.classList.contains("carousel__arrow_left")) {
        if (slideNumber > 0) {
          slideNumber--;
          slideContainer.style.transform = `translateX(${
            -offset * slideNumber
          }px)`;
        }
      }

      if (target.classList.contains("carousel__arrow_right")) {
        if (slideNumber < slideContainer.children.length - 1) {
          slideNumber++;
          slideContainer.style.transform = `translateX(${
            -offset * slideNumber
          }px)`;
        }
      }
      this._setInterface(slideNumber);
    });

    /// Фикс перерасчета (в демонстрации этого нет)
    window.addEventListener("resize", () => {
      let offset = slideContainer.offsetWidth;
      slideContainer.style.transform = `translateX(${-offset * slideNumber}px)`;
    });
  }

  _render() {
    this._elem = this._createFragment(
      `
    <div class="carousel">
      <div class="carousel__arrow carousel__arrow_left">
        <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
      </div>
      <div class="carousel__arrow carousel__arrow_right">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </div>
      <div class="carousel__inner">
      </div>
    </div>
    `,
      true
    );

    this.parts = {
      arrowLeft: this._elem.querySelector(".carousel__arrow_left"),
      arrowRight: this._elem.querySelector(".carousel__arrow_right"),
      sliderContainer: this._elem.querySelector(".carousel__inner"),
    };

    this.slides
      .map((slide) => {
        let element = this._createFragment(
          `
          <div class="carousel__slide" data-id="${slide.id}">
            <img src="/assets/images/carousel/${
              slide.image
            }" class="carousel__img" alt="slide">
            <div class="carousel__caption"> 
              <span class="carousel__price">€${slide.price.toFixed(2)}</span>
              <div class="carousel__title">${slide.name}</div>
              <button type="button" class="carousel__button">
                <img src="/assets/images/icons/plus-icon.svg" alt="icon">
              </button>
            </div>
          </div>
        `,
          true
        );
        element.addEventListener("click", (e) => {
          let target = e.target.closest(".carousel__button");
          if (!target) return;
          let productAddEvent = new CustomEvent("product-add", {
            detail: slide.id,
            bubbles: true,
          });
          target.dispatchEvent(productAddEvent);
        });
        return element;
      })
      .forEach((slide) => {
        this.parts.sliderContainer.append(slide);
      });

    this._setInterface(this.initialSlideNumber);
    this._engine();
  }

  _createFragment(html, isElement) {
    isElement = isElement || false;
    let fragment = document.createElement("template");
    fragment.innerHTML = html;
    return isElement === false
      ? fragment.content
      : fragment.content.firstElementChild;
  }

  get elem() {
    return this._elem;
  }
}
