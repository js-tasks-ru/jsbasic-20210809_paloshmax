function initCarousel() {
  let carousel = document.querySelector(".carousel");

  if (carousel) {
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
  }
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
