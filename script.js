let lastScrollY = window.scrollY;
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > lastScrollY) {
    // Scrolling down
    navbar.classList.add("nav-hide");
  } else {
    // Scrolling up
    navbar.classList.remove("nav-hide");
  }
  lastScrollY = window.scrollY;
});
