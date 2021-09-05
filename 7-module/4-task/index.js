export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this._options = {
      steps: steps,
      segments: steps - 1,
      currentStep: value,
    };
    this._render();
  }

  _render() {
    this._elem = this._createFragment(
      `
      <div class="slider">
        <div class="slider__thumb">
          <span class="slider__value"></span>
        </div>
        <div class="slider__progress"></div>
        <div class="slider__steps">
        ${`<span></span>`.repeat(this._options.steps)}
        </div>
      </div>
    `,
      true
    );
    this._parts = {
      value: this._elem.querySelector(".slider__value"),
      thumb: this._elem.querySelector(".slider__thumb"),
      progress: this._elem.querySelector(".slider__progress"),
      steps: this._elem.querySelector(".slider__steps"),
    };
    this._setInterface(this._calculations());
    this._engine();
  }

  _setInterface({ amount, percents }) {
    this._parts.thumb.style.left = percents + "%";
    this._parts.progress.style.width = percents + "%";

    this._parts.value.textContent = amount;

    if (this._options.currentStep !== amount)
      this._parts.steps.children[this._options.currentStep].classList.remove(
        "slider__step-active"
      );
    this._parts.steps.children[amount].classList.add("slider__step-active");

    /// Сохраняем текущий шаг для следующего
    this._options.currentStep = amount;
  }

  _calculations(e, displace) {
    let amount = this._options.currentStep;
    let segments = this._options.segments;
    let percents;
    let normalisedPos;
    if (e instanceof Event) {
      let cursorPos = e.clientX - this._elem.getBoundingClientRect().left;
      let segmentLength = this._elem.offsetWidth / segments;
      amount = Math.round(cursorPos / segmentLength);
      amount = amount < 0 ? 0 : amount > segments ? segments : amount;
      if (e.type === "click" || e.type === "pointerup") {
        normalisedPos = (amount * segmentLength) / this._elem.offsetWidth;

        let sliderChangeEvent = new CustomEvent("slider-change", {
          detail: amount,
          bubbles: true,
        });
        this._elem.dispatchEvent(sliderChangeEvent);
      } else {
        normalisedPos = (cursorPos - displace) / this._elem.offsetWidth;
        if (normalisedPos <= 0) normalisedPos = 0;
        if (normalisedPos >= 1) normalisedPos = 1;
      }
    } else {
      normalisedPos = amount / segments;
    }
    percents = normalisedPos * 100;
    return { amount, percents };
  }

  _getDisplacement(e) {
    let styleLeft = this._parts.thumb.style.left;
    let startX = this._parts.thumb.getBoundingClientRect().left;
    this._parts.thumb.style.left =
      e.clientX - this._elem.getBoundingClientRect().left + "px";
    let endX = this._parts.thumb.getBoundingClientRect().left;
    this._parts.thumb.style.left = styleLeft;
    return endX - startX;
  }

  _handlerClick(e) {
    e.preventDefault();

    this._setInterface(this._calculations(e));
  }

  _handlerClickDown(e) {
    e.preventDefault();

    this._elem.classList.add("slider_dragging");
    this._elem.removeEventListener("click", this._handlerClick);

    let displace = this._getDisplacement(e);

    let handlerMove = (e) => {
      e.preventDefault();

      this._setInterface(this._calculations(e, displace));
    };

    let handlerClear = (e) => {
      e.preventDefault();

      this._elem.classList.remove("slider_dragging");
      setTimeout(() =>
        this._elem.addEventListener("click", this._handlerClick)
      );
      this._setInterface(this._calculations(e));

      document.removeEventListener("pointermove", handlerMove);
      document.removeEventListener("pointerup", handlerClear);
    };

    document.addEventListener("pointermove", handlerMove);
    document.addEventListener("pointerup", handlerClear);
  }

  _engine() {
    this._handlerClick = this._handlerClick.bind(this);
    this._handlerClickDown = this._handlerClickDown.bind(this);
    this._setInterface(this._calculations());
    this._elem.addEventListener("click", this._handlerClick);
    this._parts.thumb.addEventListener("pointerdown", this._handlerClickDown);
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
