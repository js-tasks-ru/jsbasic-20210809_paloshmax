export default class Carousel {
  constructor(slides) {
    /// каркас
    let container = document.createElement("div");
    container.classList.add("carousel");

    /// навигация
    let leftArrow = this._createFragment(`
      <div class="carousel__arrow carousel__arrow_left">
        <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
      </div>
    `);
    let rightArrow = this._createFragment(`
      <div class="carousel__arrow carousel__arrow_right">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </div>
    `);
    [leftArrow, rightArrow].forEach((item) => {
      container.append(item);
    });

    /// слайды
    let slidesContainer = document.createElement("div");
    slidesContainer.classList.add("carousel__inner");
    slides.forEach((slide) => {
      /// слайд
      let slideContainer = this._makeSlide(...this._getTemplateSlide, slide);
      /// события
      slideContainer.addEventListener("click", (e) => {
        let target = e.target.closest(".carousel__button");
        if (!target) return;
        let productAddEvent = new CustomEvent("product-add", {
          detail: slide.id,
          bubbles: true,
        });
        target.dispatchEvent(productAddEvent);
      });
      slidesContainer.append(slideContainer);
    });
    container.append(slidesContainer);

    /// логика слайдов
    this._engine(container);

    /// интеграция
    this._elem = container;
  }

  /// Утилитарные методы
  _makeSlide(template, replacer, data) {
    let patchedTemplate = this._replaceMatches(template, replacer, data);
    return this._createFragment(patchedTemplate, true);
  }

  _createFragment(html, isElement) {
    isElement = isElement || false;
    let fragment = document.createElement("template");
    fragment.innerHTML = html;
    return isElement === false
      ? fragment.content
      : fragment.content.firstElementChild;
  }

  _replaceMatches(template, objReplacer, objData) {
    if (typeof template !== "string") return null;
    if (typeof objReplacer !== "object") return template;
    objData = objData || {};
    for (let key of Object.keys(objReplacer)) {
      if (!Object.hasOwnProperty.call(objData, key)) continue;
      template = template.replace(new RegExp(objReplacer[key][0], "g"), () =>
        objReplacer[key][1] ? objReplacer[key][1](objData[key]) : objData[key]
      );
    }
    return template;
  }

  _engine(carousel) {
    let slideContainer = carousel.querySelector(".carousel__inner");
    let slideNumber = 0;

    let leftArrow = carousel.querySelector(".carousel__arrow_left");
    let rightArrow = carousel.querySelector(".carousel__arrow_right");
    let toggleArrows = toggleArrowsConnect(leftArrow, rightArrow);

    toggleArrows(0, slideContainer.children.length - 1, slideNumber);
    carousel.addEventListener("click", (e) => {
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
      toggleArrows(0, slideContainer.children.length - 1, slideNumber);
    });

    /// Фикс перерасчета (в демонстрации этого нет)
    window.addEventListener("resize", (e) => {
      let offset = slideContainer.offsetWidth;
      slideContainer.style.transform = `translateX(${-offset * slideNumber}px)`;
    });
    function toggleArrowsConnect(leftArrow, rightArrow) {
      let toggleDisplay = (el) => {
        if (el.style.display === "") el.style.display = "none";
        else el.style.display = "";
      };

      let leftFlag = false;
      let rightFlag = false;

      return function (start, end, current) {
        if (current === start && !leftFlag) {
          leftFlag = !leftFlag;
          toggleDisplay(leftArrow);
        } else if (leftFlag) {
          leftFlag = !leftFlag;
          toggleDisplay(leftArrow);
        }
        if (current === end && !rightFlag) {
          rightFlag = !rightFlag;
          toggleDisplay(rightArrow);
        } else if (rightFlag) {
          rightFlag = !rightFlag;
          toggleDisplay(rightArrow);
        }
      };
    }
  }

  get _getTemplateSlide() {
    let template = `
    <div class="carousel__slide" data-id="%%id%%">
      <img src="/assets/images/carousel/%%image%%" class="carousel__img" alt="slide">
      <div class="carousel__caption"> 
        <span class="carousel__price">€%%price%%</span>
        <div class="carousel__title">%%name%%</div>
        <button type="button" class="carousel__button">
          <img src="/assets/images/icons/plus-icon.svg" alt="icon">
        </button>
      </div>
    </div>
    `;
    let replacer = {
      image: ["%%image%%"],
      price: [
        "%%price%%",
        function (value) {
          return value.toFixed(2);
        },
      ],
      name: ["%%name%%"],
      id: ["%%id%%"],
    };
    return [template, replacer];
  }

  get elem() {
    return this._elem;
  }
}
