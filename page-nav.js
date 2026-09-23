// ============================================
// THE BAR AT THE TOP OF THE PAGE
// ============================================
// Two small jobs:
// 1. Measure how tall the bar is and store it in the CSS variable
//    --nav-h, so the pinned editors and the "jump to" links can stop
//    just below it instead of underneath it.
// 2. Highlight the link for the part of the page you're reading.

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
        // a line a little below the bar
        const line = nav.offsetHeight + 80;
        let current = null;
        for (const target of targets) {
            if (target.getBoundingClientRect().top <= line) current = target;
        }
        if (current === lastCurrent) return;
        lastCurrent = current;
        for (const link of links) {
            if (current && link.getAttribute('href') === '#' + current.id) {
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
