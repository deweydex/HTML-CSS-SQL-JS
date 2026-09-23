// ============================================
// THE BAR AT THE TOP OF THE PAGE
// ============================================
// Two small jobs:
// 1. Measure how tall the bar is and store it in the CSS variable
//    --nav-h, so the pinned editors and the "jump to" links can stop
//    just below it instead of underneath it.
// 2. Highlight the link for the part of the page you're reading.
//
// IDEAS IN THIS FILE: reading an element's size and position
// (offsetHeight, getBoundingClientRect), the scroll and resize events,
// requestAnimationFrame, ResizeObserver, and aria-current. (The
// (function () { ... })() wrapper is an IIFE: see the top of
// appearance.js.)

(function () {
    'use strict';

    const nav = document.querySelector('.page-nav');
    if (!nav) return;

    const links = [...nav.querySelectorAll('.page-nav-links a')];
    // Each link's href is "#something": find the element with that id
    const targets = links
        .map(link => document.getElementById(link.getAttribute('href').slice(1)))
        .filter(Boolean);

    function measure() {
        document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
    }

    let lastCurrent;
    function highlight() {
        // The current part is the last one whose top has scrolled up past
        // a line a little below the bar.
        // getBoundingClientRect() says where an element is on the screen
        // right now: its .top is the distance from the top of the window,
        // and goes negative once the element has scrolled up past it.
        const line = nav.offsetHeight + 80;
        let current = null;
        for (const target of targets) {
            if (target.getBoundingClientRect().top <= line) current = target;
        }
        if (current === lastCurrent) return;
        lastCurrent = current;
        for (const link of links) {
            if (current && link.getAttribute('href') === '#' + current.id) {
                // ARIA-CURRENT EXPLAINED:
                // Screen readers announce this link as "current location".
                // styles.css uses the same attribute to colour it, so
                // what sighted readers see and what screen readers hear
                // come from one source.
                link.setAttribute('aria-current', 'location');
                centreInBar(link);
            } else {
                link.removeAttribute('aria-current');
            }
        }
    }

    /** On a phone the links scroll sideways: keep the highlighted one in view */
    function centreInBar(link) {
        const box = link.parentElement;
        if (box.scrollWidth <= box.clientWidth) return;
        box.scrollLeft = link.offsetLeft - box.offsetLeft - (box.clientWidth - link.offsetWidth) / 2;
    }

    // REQUESTANIMATIONFRAME EXPLAINED:
    // Scroll events fire many times a second. This waits for the browser's
    // next repaint and does the work once, instead of on every event.
    let queued = false;
    function onScroll() {
        if (queued) return;
        queued = true;
        requestAnimationFrame(function () {
            queued = false;
            highlight();
        });
    }

    measure();
    highlight();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () {
        measure();
        highlight();
    });
    // The Appearance button is added to the bar after this runs, and
    // fonts can change its height, so measure again when the bar changes
    if (window.ResizeObserver) new ResizeObserver(measure).observe(nav);
})();
