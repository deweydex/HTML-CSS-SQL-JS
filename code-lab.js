// ============================================
// LIVE HTML & CSS EDITOR ("CODE LAB")
// ============================================
// Every <div class="code-lab"> on the page becomes a small editor: type
// HTML (and CSS) on one side, and the preview on the other side redraws
// itself as you type.
//
// HOW THE PREVIEW WORKS:
// The preview is an <iframe>, a page inside the page. Its srcdoc
// attribute takes a whole HTML document as a string, so we build one
// from what's in the text boxes and hand it over. The iframe is
// "sandboxed": the code inside it can't run scripts or reach this page.
//
// Work is saved in localStorage, so refreshing the page doesn't lose it.
// "Start over" puts the original example back.

(function () {
    'use strict';

    const STORAGE_PREFIX = 'html-css-sql-tutorial:lab:';

    /**
     * Wait until the reader stops typing for a moment before doing
     * something, instead of doing it on every single key press
     * @param {Function} fn
     * @param {number} ms
     */
    function debounce(fn, ms) {
        let timer = null;
        return function () {
            clearTimeout(timer);
            timer = setTimeout(fn, ms);
        };
    }

    function readSaved(key) {
        try {
            return JSON.parse(localStorage.getItem(key) || 'null');
        } catch (error) {
            return null;
        }
    }

    function writeSaved(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            // Private browsing: the editor still works, it just won't remember
        }
    }

    /** Set up one code lab. Returns an object other code can use. */
    function initLab(lab) {
        const id = lab.dataset.lab;
        const htmlBox = lab.querySelector('textarea[data-lang="html"]');
        const cssBox = lab.querySelector('textarea[data-lang="css"]');
        const preview = lab.querySelector('iframe');
        const status = lab.querySelector('.code-lab-status');
        const storageKey = STORAGE_PREFIX + id;

        // Restore saved work, if there is any
        const saved = readSaved(storageKey);
        if (saved) {
            if (typeof saved.html === 'string') htmlBox.value = saved.html;
            if (cssBox && typeof saved.css === 'string') cssBox.value = saved.css;
        }

        function render() {
            const css = cssBox ? cssBox.value : '';
            // The first <style> is a plain starting point; the reader's own
            // CSS comes after it, so theirs wins whenever the two disagree.
            // <base target="_blank"> opens links in a new tab instead of
            // inside the little preview window.
            preview.srcdoc =
                '<!DOCTYPE html><html><head><meta charset="UTF-8">' +
                '<base target="_blank">' +
                '<style>body { font-family: sans-serif; line-height: 1.5; margin: 16px; color: #1a1a1a; background: #ffffff; }</style>' +
                '<style>' + css + '</style>' +
                '</head><body>' + htmlBox.value + '</body></html>';
        }

        function save() {
            writeSaved(storageKey, { html: htmlBox.value, css: cssBox ? cssBox.value : '' });
            if (status) status.textContent = 'Saved in this browser';
        }

        const update = debounce(function () {
            render();
            save();
        }, 250);

        htmlBox.addEventListener('input', update);
        if (cssBox) cssBox.addEventListener('input', update);

        lab.querySelector('.code-lab-reset').addEventListener('click', function () {
            if (!confirm('Start over? This puts the original example back and your changes in this editor will be lost.')) {
                return;
            }
            // defaultValue is what was written between the <textarea> tags
            // in the HTML file, before anyone typed anything
            htmlBox.value = htmlBox.defaultValue;
            if (cssBox) cssBox.value = cssBox.defaultValue;
            render();
            save();
            if (status) status.textContent = 'Back to the original example';
        });

        render();

        return {
            load: function (html, css) {
                if (typeof html === 'string') htmlBox.value = html;
                if (cssBox && typeof css === 'string') cssBox.value = css;
                render();
                save();
                // On a wide screen the editor is pinned beside the exercises,
                // so the page stays put and only the pinned column scrolls
                // back to its top. On a narrow screen, bring the editor into view.
                const side = lab.closest('.workspace-side');
                if (side && getComputedStyle(side).position === 'sticky') {
                    side.scrollTop = 0;
                } else {
                    lab.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                htmlBox.focus({ preventScroll: true });
            }
        };
    }

    document.addEventListener('DOMContentLoaded', function () {
        const labs = {};
        for (const lab of document.querySelectorAll('.code-lab')) {
            labs[lab.dataset.lab] = initLab(lab);
        }

        // "Load it into the editor" buttons under each answer. They carry
        // the code in data-html / data-css attributes, and which editor to
        // load it into in data-lab.
        document.addEventListener('click', function (event) {
            const button = event.target.closest('.load-into-lab');
            if (!button || !labs[button.dataset.lab]) return;
            labs[button.dataset.lab].load(button.dataset.html, button.dataset.css);
        });
    });
})();
