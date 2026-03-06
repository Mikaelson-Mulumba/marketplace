document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".banner-container");
  let index = 0;

  setInterval(() => {
    index = (index + 1) % 4;
    container.style.transform = `translateX(-${index * 100}%)`;
    container.style.transition = "transform 1s ease-in-out";
  }, 5000);
});
