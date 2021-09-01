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
    let segments = slider.querySelector(".slider__steps").children;
    let sliderValue = slider.querySelector(".slider__value");
    let tumb = slider.querySelector(".slider__thumb");
    let progress = slider.querySelector(".slider__progress");

    let render = (e) => {
      /// удаляем прошлый стиль
      segments[this._currentStep].classList.remove("slider__step-active");

      /// вычисляем шаг и добавляем новый стиль
      if (e)
        this._currentStep = closestPoint(
          getSegmentsCoords(segments),
          e.clientX
        ).key;
      sliderValue.textContent = this._currentStep;
      segments[this._currentStep].classList.add("slider__step-active");

      let position = (100 / (this._steps - 1)) * this._currentStep + "%";
      progress.style.width = position;
      tumb.style.left = position;

      if (e) {
        let sliderChangeEvent = new CustomEvent("slider-change", {
          detail: this._currentStep,
          bubbles: true,
        });
        e.target.dispatchEvent(sliderChangeEvent);
        /// вешаем обработчик после чтобы не сработал в процессе текущего клика
        setTimeout(() => this._elem.addEventListener("click", render));
      }
    };

    let coreRender = (e) => {
      moveHandler = moveHandler.bind(this);
      clearHandler = clearHandler.bind(this);
      let lastSegment = -1;
      let target = e.target.closest(".slider__thumb");
      if (!target) return;

      if (target) {
        this._elem.classList.add("slider_dragging");
        this._elem.removeEventListener("click", render);
      }
      let offsetBtn = e.clientX - tumb.getBoundingClientRect().left;
      document.addEventListener("pointermove", moveHandler);
      document.addEventListener("pointerup", clearHandler);
      function moveHandler(e) {
        /// Обработка контрольных пунктов
        if (e) {
          this._currentStep = closestPoint(
            getSegmentsCoords(segments),
            e.clientX
          ).key;
          if (lastSegment != this._currentStep && lastSegment !== -1) {
            segments[lastSegment].classList.remove("slider__step-active");
          }
        }
        sliderValue.textContent = this._currentStep;
        lastSegment = this._currentStep;
        segments[this._currentStep].classList.add("slider__step-active");

        /// Обработка передвижения
        let startOffsetX = e.clientX - this._elem.getBoundingClientRect().left;
        /// Можно и 10 вручную прописать, а можно так, интересно узнать как решить без моей выдумки
        let kickOffLeftMargin = parseInt(
          window.getComputedStyle(tumb).marginLeft
        );
        let calculations =
          (startOffsetX - offsetBtn - kickOffLeftMargin) /
          this._elem.offsetWidth;
        if (calculations <= 0) {
          calculations = 0;
        }
        if (calculations >= 1) {
          calculations = 1;
        }
        progress.style.width = calculations * 100 + "%";
        tumb.style.left = calculations * 100 + "%";

        sliderValue.textContent = this._currentStep;
      }
      function clearHandler(e) {
        /// Рендер по клику
        render(e);
        this._elem.classList.remove("slider_dragging");

        document.removeEventListener("pointerup", clearHandler);
        document.removeEventListener("pointermove", moveHandler);
      }
    };

    /// Рендер начального состояния
    render();

    slider.addEventListener("pointerdown", coreRender);
    slider.addEventListener("click", render);

    function getSegmentsCoords(segments) {
      return Array.prototype.map.call(segments, (point) => {
        return point.getBoundingClientRect().left;
      });
    }
    function closestPoint(arr, point) {
      if (!Array.isArray(arr)) return [];
      point = Number.isFinite(point) ? point : 0;
      let prevDiff = Infinity;
      let result = arr.findIndex((value, key) => {
        let diff = Math.abs(value - point);
        return diff >= prevDiff ? true : ((prevDiff = diff), false);
      });
      result = result === -1 ? arr.length - 1 : result - 1;
      return { key: result, value: arr[result] };
    }
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
