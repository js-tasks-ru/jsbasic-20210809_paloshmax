export default function promiseClick(button) {
  // ваш код...
  if (!(button instanceof HTMLElement)) return;
  return new Promise((resolve) => {
    button.addEventListener(
      "click",
      (e) => {
        resolve(e);
      },
      { once: true }
    );
  });
}
