function initCarousel() {
  // ваш код...
  const arrowRight = document.querySelector(".carousel__arrow_right");
  const arrowLeft = document.querySelector(".carousel__arrow_left");
  const slides = document.querySelector(".carousel__inner");
  let offset = slides.offsetWidth;
  let activeSlide = 0;
  arrowLeft.style.display = "none";
  let position = 0;

  function changeSlideRight() {
    position = position - offset;
    slides.style.transform = `translateX(${position}px)`;
    arrowLeft.style.display = "";
    activeSlide++;
    if (activeSlide >= 3) {
      activeSlide = 3;
      arrowRight.style.display = "none";
    }
  }

  function changeSlideLeft() {
    position = position + offset;
    slides.style.transform = `translateX(${position}px)`;
    arrowRight.style.display = "";
    activeSlide--;
    if (activeSlide <= 0) {
      activeSlide = 0;
      arrowLeft.style.display = "none";
    }
  }

  arrowRight.addEventListener("click", () => {
    changeSlideRight();
  });

  arrowLeft.addEventListener("click", () => {
    changeSlideLeft();
  });
}
