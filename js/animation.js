/**
 * Generate the dependencies for all animation frames.
 */
function generateAnimations() {
	for (let frame of document.querySelectorAll(".animation-frame")) {
		generateAnimationDependencies(frame);
		activateAnimationFramework(frame);
	}
}

/**
 * Generate the elements needed to execute animations and add them to the parent element.
 * @param {Element} parent - The parent element having the "animation-frame" class.
 */
function generateAnimationDependencies(parent) {
	const currentSlide = document.createElement("div");
	currentSlide.classList.add("current-slide");

	const nextSlide = document.createElement("div");
	nextSlide.classList.add("next-slide");

	const slideDisplay = document.createElement("div");
	slideDisplay.classList.add("slide-display");
	slideDisplay.appendChild(currentSlide);
	slideDisplay.appendChild(nextSlide);

	parent.appendChild(slideDisplay);
}

// A variable converting the incremental id of a animation-frame to the list of available slides.
const frameIdToSlides = [];

// A variable converting a frame id to the element.
const frameIdToElement = [];

// A variable converting an id to the slide number.
const idToSlide = {};

/**
 * An iterator that allows iterations over all available slides.
 * Moreover, the main document frame is itself considered to be a slide as well.
 */
function* getSlideIterator() {
	yield document;
	for (const slides of frameIdToSlides) {
		for (const slide of slides[0]) {
			yield slide;
		}
	}
}

/**
 * Get the available slides within the provided element.
 * @param {Element} parent - The parent element having the "animation-frame" class.
 * @returns The list of slides if available, otherwise empty list.
 */
function getSlides(parent) {
	return frameIdToSlides[parseInt(parent.dataset.frameId)][0] || [];
}

/**
 * Store the list of slides that is associated to the provided element.
 * @param {*} parent - The parent element having the "animation-frame" class.
 * @param {*} slides - The slides contained within the animation frame.
 */
function storeSlides(parent, slides) {
	parent.dataset.frameId = frameIdToSlides.length;
	frameIdToSlides.push([slides]);
	frameIdToElement.push(parent);
}

/**
 * Get the frame element associated to the given frame id.
 * @param {*} frameId - The id of the frame to get the element of.
 * @returns The stored value at index frame id.
 */
function getFrame(frameId) {
	return frameIdToElement[parseInt(frameId)];
}

/**
 * Get the slide element associated to the given html id.
 * @param {*} id - A html/css id string.
 * @returns The slide associated with the target css id.
 */
function getSlide(id) {
	return idToSlide[id];
}

/**
 * Activate the animation framework in the given element.
 * @param {Element} parent - The parent element having the "animation-frame" class.
 */
function activateAnimationFramework(parent) {
	// Decouple the child items from the parent.
	const slides = parent.querySelectorAll(":scope > .animation-slide");
	storeSlides(parent, slides);
	slides.forEach((v, i) => {
		v.remove();
		v.dataset.slideId = i;
		v.dataset.frameId = parent.dataset.frameId;
		idToSlide[`#${v.id}`] = v;
	});

	// Base the initial page on the hash on the url.
	const hash = new URL(document.URL).hash;
	let initialIndex = 0;
	if (hash) {
		const slide = getSlide(hash);
		if (slide) {
			initialIndex = parseInt(slide.dataset.slideId);
		}
	}

	// Add the required state tracking information.
	parent.dataset.index = initialIndex;

	// Show the first page to start out with.
	const target = parent.querySelector(":scope > .slide-display > .current-slide");
	target.appendChild(slides[initialIndex]);
}

/**
 * Perform a transition from the current slide element to the next slide element.
 * @param {Element} parent - The parent element having the "animation-frame" class.
 * @param {Element} current - The element of the slide that has to be replaced.
 * @param {Element} next - The element of the slide that is the replacement.
 * @param {string} type - The type of transition ("slide" or "fade").
 * @param {string} direction - The direction in which the transition is executed. Only applicable to the "slide" type.
 */
function transition(parent, current, next, type, direction) {
	const display = parent.querySelector(":scope .slide-display");

	display.dataset.animationDirection = direction;
	display.dataset.animationType = type;

	delete display.dataset.animate;
	delete display.dataset.transition;

	setTimeout(() => {
		display.querySelector(":scope > .next-slide").textContent = "";
		display.querySelector(":scope > .next-slide").appendChild(next);

		display.querySelector(":scope > .current-slide").textContent = "";
		display.querySelector(":scope > .current-slide").appendChild(current);

		display.dataset.animate = 1;
		display.dataset.transition = 1;

		setTimeout(() => {
			delete display.dataset.animate;
			delete display.dataset.transition;

			display.querySelector(":scope > .current-slide").textContent = "";
			display.querySelector(":scope > .current-slide").appendChild(next);
		}, 1300);
	}, 25);
}

/**
 * Transition to the specified page.
 * @param {Element} parent: The parent page.
 * @param {*} pageIndex: The index of the new target page.
 * @param {*} type: The type of animation to use.
 * @returns True if transition is successfully executed, otherwise false.
 */
function changePage(parent, pageIndex, type = `slide`) {
	// Rate limit page change events.
	if (parent.dataset.timeout) {
		return false;
	}

	// Get the available slides.
	const slides = getSlides(parent);

	// Ensure that the suggested page index is within bounds. Otherwise apply limits.
	const index = parseInt(parent.dataset.index);
	const newIndex = Math.min(Math.max(0, pageIndex), slides.length - 1);

	// Get the corresponding page contents.
	const current = slides[index];
	const next = slides[newIndex];

	// Update the index and update the view through a transition if applicable.
	parent.dataset.index = newIndex;
	if (index == newIndex) {
		return true;
	}

	// Start a timeout.
	parent.dataset.timeout = 1;
	setTimeout(() => delete parent.dataset.timeout, 1350);

	if (index < newIndex) {
		// Go to previous page.
		transition(parent, current, next, type, "up");
	} else if (index > newIndex) {
		// Go to next page.
		transition(parent, current, next, type, "down");
	}

	return true;
}

export { generateAnimations, changePage, getSlides, getFrame, getSlide, getSlideIterator };
