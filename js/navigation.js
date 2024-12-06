import * as animation from "./animation.js";

/**
 * Apply navigation controls to all elements having the animation-frame class.
 */
function initializeNavigationControls() {
    for (const element of animation.getSlideIterator()) {
        for (const anchor of element.querySelectorAll("a")) {
            createAnchorEventListener(anchor);
        }
    
        for (const frame of element.querySelectorAll(".scroll-control")) {
            applyScrollControls(frame);
        }
    
        for (const frame of element.querySelectorAll("#key-control")) {
            applyKeyControls(frame);
        }
    }
}

/**
 * Add an event listener to the target anchor to make id hrefs compatible with the animation framework.
 * @param {Element} anchor - The anchor to add the click event listener to. 
 */
function createAnchorEventListener(anchor) {
    // Only add listeners to relative by id anchors.
    if (anchor.hash) {
        // Check if the element exists and has the required data.
        const targetSlide = animation.getSlide(anchor.hash);
        if (!targetSlide) {
            console.error(`HREF target ${anchor.hash} does not exist.`)
            return;
        }
        if (!targetSlide.dataset.slideId) {
            console.error(`Target slide does not have a valid slide id assigned.`)
            return
        }
        if (!targetSlide.dataset.frameId) {
            console.error(`Target slide does not have a valid frame id assigned.`)
            return
        }

        // Add the listener.
        anchor.addEventListener("click", (event) => {
            event.preventDefault();
            animation.changePage(animation.getFrame(targetSlide.dataset.frameId), parseInt(targetSlide.dataset.slideId));
        })
    }
}

/**
 * Apply key controls to the given element.
 * @param {Element} parent - The parent element having the "animation-frame" class and "key-control" id.
 */
function applyKeyControls(parent) {
    // Create a keydown listener and perform the appropriate actions.
    document.addEventListener("keydown", (event) => keydownHandler(parent, event));
}

/**
 * Event handler for arrow buttons.
 * @param {*} parent: The parent page.
 * @param {*} event: A keydown event. 
 */
function keydownHandler(parent, event) {
    // Find the direction of the scroll and apply.
    const index = parseInt(parent.dataset.index);
    const offsetMapping = {
        "ArrowLeft"  : -1,
        "ArrowRight" : 1,
        "ArrowUp"    : -1,
        "ArrowDown"  : 1,
    }
    
    // Only look at keys in the dictionary.
    if (!event.key in offsetMapping) {
        return;
    }

    // Attempt to change the page.
    animation.changePage(parent, index + offsetMapping[event.key]);
}

/**
 * Apply scroll controls to the given element.
 * @param {Element} parent - The parent element having the "animation-frame" and "scroll-control" class.
 */
function applyScrollControls(parent) {
    // Create a scroll listener and perform the appropriate actions.
    parent.addEventListener("wheel", (event) => wheelHandler(event));
}

/**
 * Event handler for the turning of the scroll wheel/other wheel related actions.
 * @param {*} event: A wheel event.
 */
function wheelHandler(event) {
    // Find the direction of the scroll and apply.
    const parent = event.currentTarget;
    let offset = getScrollDirectionOffset(event);
    if (navigator.userAgent.indexOf('Mac OS X') != -1) {
        offset *= -1;
    }
    const index = parseInt(parent.dataset.index);

    // Attempt to change the page.
    animation.changePage(parent, index + offset);
}

/**
 * Get which offset to use based on the direction the wheel is turned in.
 * @param {*} event: A wheel event.
 * @returns 1 if up, -1 if down and 0 if no change.
 */
function getScrollDirectionOffset(event) {
    if (event.wheelDelta) {
        if (Math.abs(event.wheelDelta) < 100) {
            return 0;
        }
        return event.wheelDelta > 0 ? 1 : -1;
    }
    if (Math.abs(event.deltaY) < 5) {
        return 0;
    }
    return event.deltaY < 0 ? 1 : -1;
}

export {initializeNavigationControls}