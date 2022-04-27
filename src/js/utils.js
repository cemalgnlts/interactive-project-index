import imagesLoaded from "imagesloaded";

const preloadImages = (selector) => new Promise(resolve =>
	imagesLoaded(document.querySelectorAll(selector), { background: true }, resolve));

export {
	preloadImages
}