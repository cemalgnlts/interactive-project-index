import gsap from "gsap";

class HoverAnimation {
    animations = new Map();
    constructor(el) {
        this.elements = gsap.utils.toArray(el);
        this.elements.forEach(el => {
            el.onmouseenter = this.onEnter.bind(this, el);
            el.onmouseleave = this.onLeave.bind(this, el);
        });
    }

    onEnter(el) {
        const info = el.querySelector(".gallery__content__info");
        const infoBg = el.querySelector(".gallery__content__bg");

        const tl = gsap.timeline({
            defaults: {
                duration: 0.5,
                ease: "power2.inOut",
            }
        });

        tl.to(infoBg, {
            zIndex: 2,
            duration: 0
        }).to(info, {
            opacity: 1,
        }).to(infoBg, {
            "--inset-top": 0,
            "--inset-bottom": 0,
            opacity: 1,
        }, "<");


        this.animations.set(el, tl);
    }

    onLeave(el) {
        this.animations.get(el).reverse();
        this.animations.delete(el);
    }

    unlisten() {
        this.elements.forEach(el => el.onmouseenter = el.onmouseleave = null);
    }
}

export default HoverAnimation;
