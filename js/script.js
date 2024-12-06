import * as form from "./form.js";
import * as animation from "./animation.js";
import * as navigation from "./navigation.js";
import * as slideshow from "./slideshow.js";

window.onload = () => {
	// Initialize the form.
	form.generateForms();

	// Create slideshow dependencies.
	slideshow.createAndShowElements();

	// Generate all animation dependencies before activating scrolling.
	animation.generateAnimations();

	// Activate navigation controls.
	navigation.initializeNavigationControls();
};
