export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this._steps = steps;
    let slider = this._createFragment(
      `
      <div class="slider">
        <div class="slider__thumb">
          <span class="slider__value">${value}</span>
        </div>
        <div class="slider__progress"></div>
        <div class="slider__steps">
        ${new Array(this._steps).fill().reduce((acc, _, key) => {
          if (key === value)
            acc = acc.concat(`<span class="slider__step-active"></span>`);
          else acc = acc.concat(`<span></span>`);
          return acc;
        }, "")}
        </div>
      </div>
    `,
      true
    );
    this._currentStep = value;
    this._engine(slider);
    this._elem = slider;
  }
  _engine(slider) {
    setTimeout(() => {
      let segments = slider.querySelector(".slider__steps").children;
      let segmentsCoords = Array.prototype.map.call(segments, (point) => {
        return point.getBoundingClientRect().left;
      });
      let closestPoint = (arr, point) => {
        if (!Array.isArray(arr)) return [];
        point = Number.isFinite(point) ? point : 0;
        let prevDiff = Infinity;
        let result = arr.findIndex((value, key) => {
          let diff = Math.abs(value - point);
          return diff >= prevDiff ? true : ((prevDiff = diff), false);
        });
        result = result === -1 ? arr.length - 1 : result - 1;
        return { key: result, value: arr[result] };
      };

      let sliderValue = slider.querySelector(".slider__value");
      let tumb = slider.querySelector(".slider__thumb");
      let progress = slider.querySelector(".slider__progress");

      let render = (e) => {
        /// удаляем прошлый стиль
        segments[this._currentStep].classList.remove("slider__step-active");

        /// вычисляем шаг и добавляем новый стиль
        if (e) this._currentStep = closestPoint(segmentsCoords, e.clientX).key;
        sliderValue.textContent = this._currentStep;
        segments[this._currentStep].classList.add("slider__step-active");

        let position = (100 / (this._steps - 1)) * this._currentStep + "%";
        progress.style.width = position;
        tumb.style.left = position;
      };
      render();
      slider.addEventListener("click", (e) => {
        console.log(e);
        render(e);

        let sliderChangeEvent = new CustomEvent("slider-change", {
          detail: this._currentValue,
          bubbles: true,
        });
        e.target.dispatchEvent(sliderChangeEvent);
      });
    });
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
