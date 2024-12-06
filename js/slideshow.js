import * as animation from "./animation.js";

// Container for images
const imagesContainer = document.getElementById("images-container");
// Previous button
const previousButton = document.querySelector(".previous-button");
// Next button
const nextButton = document.querySelector(".next-button");
// Container for dots
const dotsContainer = document.getElementById("dots-indicator");

// Array for adding image-paths
let imgArray = ["../assets/slideone.png", "../assets/slidetwo.png", "../assets/slidethree.png", "../assets/slidefour.png", "../assets/slidefive.png"];

// Index current image
let currentIndex = 0; // Choose for "0", because arrays are zero-indexed

// Create empty variable for images
let images;

// Create empty variable for dots
let dots;

let nextInterval;

let activateTimeout;

// Create elements for images (from imgArray) and their dots (who will keep progression)
function createAndShowElements() {
	// For-loop (Iterates trough the imgArray)
	for (let i = 0; i < imgArray.length; i++) {
		const imgElement = document.createElement("img"); // Create elements for images
		imgElement.classList.add("images", "animation-slide"); // Give imgElements a class
		imgElement.id = `slide-${i}`;
		imgElement.src = imgArray[i]; // Assign image-paths to imgElements
		imagesContainer.appendChild(imgElement); // Append created imgElements to container

		const divElement = document.createElement("div"); // Create elements for the dots
		divElement.classList.add("dot"); // Give divElements a class
		dotsContainer.appendChild(divElement); // Append created divElements to container
	}
	images = document.querySelectorAll(".images");
	dots = document.querySelectorAll(".dot");

	getCurrentImage();
	updateDots();

	previousButton.addEventListener("click", previousImage); // Next image, by click on prev-btn
	nextButton.addEventListener("click", () => {
		nextImage(true); // Next image, by click on next-btn
	});

	dots.forEach((dot, index) => {
		dot.addEventListener("click", () => {
			fromDotToImage(index);
		});
	});

	nextInterval = setInterval(nextImage, 5000);
}

// Makes previous image appear
function previousImage() {
	const previousIndex = (currentIndex - 1 + imgArray.length) % imgArray.length; // -1 beacause going back

	const targetSlide = animation.getSlide(`#slide-${previousIndex}`);
	const status = animation.changePage(animation.getFrame(targetSlide.dataset.frameId), parseInt(targetSlide.dataset.slideId), `fade`);

	if (status) {
		currentIndex = previousIndex;

		getCurrentImage();
		updateDots();

		restartSlideAutomation();
	}
}

// Makes the next image appear
function nextImage(automate = false) {
	const nextIndex = (currentIndex + 1) % imgArray.length; // +1 because going further

	const targetSlide = animation.getSlide(`#slide-${nextIndex}`);
	const status = animation.changePage(animation.getFrame(targetSlide.dataset.frameId), parseInt(targetSlide.dataset.slideId), `fade`);

	if (status) {
		currentIndex = nextIndex;

		getCurrentImage();
		updateDots();

		if (automate) {
			restartSlideAutomation();
		}
	}
}

function getCurrentImage() {
	dots[currentIndex].id = currentIndex + 1;
	console.log(`Current image: ${currentIndex + 1}`);
}

function updateDots() {
	dots.forEach((dot, index) => {
		if (index === currentIndex) {
			dot.classList.add("active");
		} else {
			dot.classList.remove("active");
		}
	});
}

function fromDotToImage(index) {
	const targetSlide = animation.getSlide(`#slide-${index}`);
	const status = animation.changePage(animation.getFrame(targetSlide.dataset.frameId), parseInt(targetSlide.dataset.slideId), `fade`);

	if (status) {
		currentIndex = index;

		getCurrentImage();
		updateDots();

		restartSlideAutomation();
	}
}

function restartSlideAutomation() {
	if (nextInterval) {
		clearInterval(nextInterval);
	}

	if (activateTimeout) {
		clearTimeout(activateTimeout);
	}

	activateTimeout = setTimeout(() => {
		nextInterval = setInterval(nextImage, 5000);
	}, 5000);
}

export { createAndShowElements };
