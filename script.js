let lastScrollY = window.scrollY;
const navbar = document.querySelector(".navbar");
const submenu = document.querySelector(".submenu"); // Submenu element
const scrollThreshold = 80; // Scroll threshold in pixels

window.addEventListener("scroll", () => {
  // Check if submenu is active
  if (submenu.classList.contains("active")) {
    return; // Do nothing when submenu is active
  }

  // Start hiding navbar only after scrolling 100px
  if (window.scrollY > scrollThreshold) {
    if (window.scrollY > lastScrollY) {
      // Scrolling down
      navbar.classList.add("nav-hide");
    } else {
      // Scrolling up
      navbar.classList.remove("nav-hide");
    }
  } else {
    // If less than 100px scrolled, ensure navbar is always visible
    navbar.classList.remove("nav-hide");
  }

  lastScrollY = window.scrollY;
});

// FAQS
// document.addEventListener("DOMContentLoaded", function () {
//   const accordionHeaders = document.querySelectorAll(".accordion-header");

//   accordionHeaders.forEach((header) => {
//     header.addEventListener("click", function () {
//       const content = this.nextElementSibling;

//       // Toggle max-height for smooth opening/closing
//       if (content.style.maxHeight) {
//         content.style.maxHeight = null;
//         header.querySelector("span i").style.transform = "rotate(0deg)";
//       } else {
//         content.style.maxHeight = content.scrollHeight + "px";
//         header.querySelector("span i").style.transform = "rotate(45deg)";
//       }
//     });
//   });
// });

// ----------FAQS
document.addEventListener("DOMContentLoaded", function () {
  const accordionHeaders = document.querySelectorAll(".accordion-header");

  accordionHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      console.log("f");
      const content = this.nextElementSibling;

      // Toggle max-height for smooth opening/closing
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
        header.querySelector("div").style.transform = "rotate(0deg)";
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        header.querySelector("div").style.transform = "rotate(45deg)";
      }
    });
  });
});

// ------------ menu
// JavaScript to toggle submenu
const menuIcon = document.getElementById("menu-icon");

menuIcon.addEventListener("click", () => {
  const isActive = submenu.classList.toggle("active");

  // Change the icon
  if (isActive) {
    menuIcon.className = "ri-close-line"; // Close icon
  } else {
    menuIcon.className = "ri-menu-fill"; // Hamburger icon
  }
});

const menuLinks = submenu.querySelectorAll("a");
// Close submenu when a link is clicked
menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    submenu.classList.remove("active"); // Close submenu
    const menuIcon = document.getElementById("menu-icon"); // Reset icon
    menuIcon.className = "ri-menu-fill";
  });
});

// Smooth scroll for all elements
const smoothScroll = (target) => {
  const section = document.querySelector(target);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

// Attach smooth scrolling to all links with data-scroll attribute
const scrollLinks = document.querySelectorAll("[data-scroll]");
scrollLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    const target = link.getAttribute("href"); // Get href target
    smoothScroll(target);
  });
});
