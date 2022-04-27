import FilteredList from "./FilteredList";
import gsap from "gsap";
import { preloadImages } from "./utils";

const gallery = document.querySelector(".gallery");
gallery.style.pointerEvents = "none";

const filteredList = new FilteredList(gallery);

const backdropAnim = gsap.to(".gallery__backdrop", {
  paused: true,
  opacity: 1,
  duration: 0.5,
  ease: "power2.inOut"
});

gallery.onmouseenter = () => backdropAnim.restart();
gallery.onmouseleave = () => backdropAnim.reverse();

document.querySelectorAll(".filter-nav li").forEach(el => {
  el.onclick = () => {
    el.parentElement.querySelector(".nav__item--active").classList.remove("nav__item--active");
    el.classList.add("nav__item--active");
    filteredList.setFilter(el.textContent);
  }
});

preloadImages(".gallery__content,.gallery__content__bg").then(() => {
  document.body.classList.remove("loading");
  filteredList.prepareItems();
});