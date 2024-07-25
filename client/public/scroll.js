bar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY >= 20) {
    bar.classList.add("nav-scroll");
  } else if (window.scrollY < 56) {
    bar.classList.remove("nav-scroll");
  }
});
