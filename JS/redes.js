document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".social-container");
  
  if (container) {
    container.style.opacity = "0";
    container.style.transform = "translateY(15px)";
    container.style.transition = "opacity 0.5s ease, transform 0.5s ease";

    setTimeout(() => {
      container.style.opacity = "1";
      container.style.transform = "translateY(0)";
    }, 100);
  }
});