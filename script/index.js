//for slideshow
let index = 0;
const slider = document.getElementById("slider");
const total = slider.children.length;

setInterval(() => {
  index = (index + 1) % total;
  slider.style.transform = `translateX(-${index * 100}%)`;
}, 2000);
