import gsap from "gsap";

import HoverAnimation from "./HoverAnimation";

import categories from "./categories.json";

class FilteredList {
    hiddenItems = new Map();

    constructor(container) {
        this.container = container;
        this.elements = document.getElementsByClassName("gallery__content");
        this.initHtml();
        this.hoverAnimation = new HoverAnimation(".gallery__content");
    }

    async setFilter(text) {
        const show = [];
        const hide = [];

        [...this.elements].forEach((el) => {
            if (text === "All cases" || el.dataset.menu === text)
                show.push(el);
            else
                hide.push(el);
        });

        await Promise.all(hide.map(el => this.asyncHideItem(el)));
        show.forEach(el => this.showItem(el));
    }

    asyncHideItem = async (el) => new Promise(resolve => this.hideItem(el, resolve));

    selectItem(el) {
        this.hoverAnimation.unlisten();
        const titleAndCategory = el.querySelector(".gallery__content__info");
        const back = el.querySelector(".gallery__content__bg");

        const offsetTop = el.offsetTop;
        gsap.set(this.container, { pointerEvents: "none" });
        gsap.set(el.nextElementSibling, { marginTop: 100 })

        const tl = gsap.timeline({
            defaults: {
                ease: "sin.in",
                duration: 0.6,
            }
        });

        tl.set(el, {
            backgroundImage: "none",
            flexBasis: () => this.container.getBoundingClientRect().height,
            top: () => offsetTop,
            zIndex: 10,
            position: "absolute",
        }, "<").to([...this.elements].filter(elm => elm !== el), {
            opacity: 0,
        }, "<").to(".filter-nav", {
            opacity: 0
        }, "<").to(back, {
            height: "100%",
            top: () => "-=" + (offsetTop - 50)
        }, "<50%").to(titleAndCategory, {
            zIndex: 20,
            top: () => "-=" + (offsetTop - 50)
        }, "<").to(titleAndCategory, {
            top: "-=140"
        }, "<80%").to(titleAndCategory, {
            color: "black"
        }, "<50%");
    }

    hideItem(el, resolve) {
        if (this.hiddenItems.has(el))
            return resolve?.();

        const tl = gsap.timeline({
            defaults: {
                duration: 0.4,
                ease: "sine.inOut"
            }
        })
            .to(el, {
                clipPath: "inset(0 0 100% 0)",
            }).to(el, {
                height: 0,
                flexBasis: 0,
                onComplete: () => resolve?.()
            });

        this.hiddenItems.set(el, tl);
    }

    showItem(el) {
        if (!this.hiddenItems.has(el))
            return;

        this.container.prepend(el);
        this.hiddenItems.get(el).reverse();
        this.hiddenItems.delete(el);
    }

    prepareItems() {
        this.container.style.pointerEvents = "none";
        const tl = gsap.timeline()
            .to(".gallery__content__bg", {
                opacity: 1,
                duration: 0,
                y: -1,
                backgroundImage: "",
                backgroundColor: "white",
            }).to(".gallery__content__bg", {
                height: 0,
                duration: 0.8,
                ease: "sine.inOut",
                stagger: 0.1,
                onComplete: () => {
                    tl.reverse(-1);
                    this.container.style.pointerEvents = "all";
                }
            });
    }

    initHtml() {
        const html = categories
            .map(this.newElement)
            .join("");

        this.container.insertAdjacentHTML("beforeend", html);
        [...this.elements].forEach(el => el.onclick = this.selectItem.bind(this, el));
    }

    newElement({ title, category, menu, image }) {
				const imgUrl = new URL(`/src/img/${image}.jpg`, import.meta.url);
        return `<div data-menu="${menu}" class="gallery__content" style="background-image: url(${imgUrl.href})">
            <div class="gallery__content__bg" style="background-image: url(${imgUrl.href})"></div>
            <div class="gallery__content__info">
                <h1 class="gallery__content__title">${title}</h1>
                <span class="gallery__content__category">${category}</span>
            </div>
        </div>`;
    }
}

export default FilteredList;
