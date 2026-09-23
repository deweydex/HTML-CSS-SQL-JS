// ============================================
// APPEARANCE PANEL
// ============================================
// Lets each reader change how the page looks: light or dark, the font,
// the text size, how wide the reading column is, and two accessibility
// switches (high contrast, reduce motion).
//
// HOW IT WORKS:
// 1. Settings are stored in the browser with localStorage, so they are
//    still there next time the page opens (on the same computer).
// 2. Each setting becomes an attribute on <html> (for example
//    data-theme="dark") or a CSS variable (for example --font-size).
// 3. styles.css has rules that match those attributes and swap in
//    different values. This file never touches a colour directly.
//
// This script is loaded in <head>, before the page is drawn, so saved
// settings apply straight away instead of flashing the default theme
// first. The panel itself is built once the rest of the page has loaded.

(function () {
    'use strict';

    /** Key the settings are saved under in localStorage */
    const STORAGE_KEY = 'html-css-sql-tutorial:appearance';

    /**
     * @typedef {Object} AppearanceSettings
     * @property {'auto'|'light'|'dark'} theme
     * @property {'sans'|'serif'|'mono'|'lexend'|'opendyslexic'} font
     * @property {number} size - Text size in pixels
     * @property {'narrow'|'medium'|'wide'} width - Reading column width
     * @property {number} codeLineHeight - Space between lines of code
     * @property {'normal'|'high'} contrast
     * @property {'normal'|'reduced'} motion
     */

    /** @type {AppearanceSettings} */
    const DEFAULTS = {
        theme: 'auto',
        font: 'sans',
        size: 16,
        width: 'medium',
        codeLineHeight: 1.5,
        contrast: 'normal',
        motion: 'normal'
    };

    /** Column widths, in rem (1rem = the chosen text size) */
    const WIDTHS = { narrow: 48, medium: 62, wide: 75 };

    const root = document.documentElement;
    const systemDark = window.matchMedia
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;

    /**
     * Read saved settings, falling back to the defaults for anything
     * missing or unreadable.
     * @returns {AppearanceSettings}
     */
    function load() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            return { ...DEFAULTS, ...saved };
        } catch (error) {
            // Private browsing or blocked storage: use the defaults
            return { ...DEFAULTS };
        }
    }

    /** @param {AppearanceSettings} settings */
    function save(settings) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (error) {
            // Settings still apply for this visit; they just won't be remembered
        }
    }

    /**
     * Turn settings into attributes and CSS variables on <html>.
     * "auto" theme follows the computer's own light/dark setting.
     * @param {AppearanceSettings} settings
     */
    function apply(settings) {
        const dark = settings.theme === 'dark' ||
            (settings.theme === 'auto' && systemDark !== null && systemDark.matches);
        root.setAttribute('data-theme', dark ? 'dark' : 'light');

        // Only set an attribute when it differs from the default, so the
        // plain stylesheet values are what a first-time visitor sees
        setOrRemove('data-font', settings.font, 'sans');
        setOrRemove('data-contrast', settings.contrast, 'normal');
        setOrRemove('data-motion', settings.motion, 'normal');

        root.style.setProperty('--font-size', settings.size + 'px');
        root.style.setProperty('--line-width', (WIDTHS[settings.width] || WIDTHS.medium) + 'rem');
        root.style.setProperty('--code-line-height', String(settings.codeLineHeight));
    }

    function setOrRemove(name, value, defaultValue) {
        if (value === defaultValue) root.removeAttribute(name);
        else root.setAttribute(name, value);
    }

    // Apply immediately, before the page is drawn
    let settings = load();
    apply(settings);

    // If the reader chose "auto", follow the computer when it switches
    if (systemDark && systemDark.addEventListener) {
        systemDark.addEventListener('change', function () {
            if (settings.theme === 'auto') apply(settings);
        });
    }

    // ============================================
    // BUILDING THE PANEL
    // ============================================

    /**
     * A row of radio buttons drawn as a segmented control.
     * @param {string} name - Which setting this row changes
     * @param {string} legend - Visible label for the row
     * @param {Array<[string, string]>} options - [value, label] pairs
     * @returns {string} HTML
     */
    function segmented(name, legend, options, extraClass) {
        const buttons = options.map(function ([value, label]) {
            const id = 'appearance-' + name + '-' + value;
            const fontClass = name === 'font' ? ' class="seg-font-' + value + '"' : '';
            return '<input type="radio" name="' + name + '" id="' + id + '" value="' + value + '">' +
                   '<label for="' + id + '"' + fontClass + '>' + label + '</label>';
        }).join('');
        return '<fieldset class="setting' + (extraClass ? ' ' + extraClass : '') + '">' +
               '<legend>' + legend + '</legend>' +
               '<div class="seg">' + buttons + '</div></fieldset>';
    }

    function range(name, label, min, max, step) {
        const id = 'appearance-' + name;
        return '<div class="setting">' +
               '<label class="setting-label" for="' + id + '">' + label + '</label>' +
               '<div class="range-row">' +
               '<input type="range" id="' + id + '" name="' + name + '" min="' + min +
               '" max="' + max + '" step="' + step + '">' +
               '<output for="' + id + '" id="' + id + '-value"></output>' +
               '</div></div>';
    }

    function buildPanel() {
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'appearance-toggle';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-controls', 'appearance-panel');
        toggle.innerHTML = '<span class="appearance-toggle-glyph" aria-hidden="true">Aa</span> ' +
            '<span class="appearance-toggle-text">Appearance</span>';

        const panel = document.createElement('aside');
        panel.className = 'appearance-panel';
        panel.id = 'appearance-panel';
        panel.hidden = true;
        panel.setAttribute('aria-labelledby', 'appearance-title');
        panel.innerHTML =
            '<div class="appearance-head">' +
                '<h2 id="appearance-title" tabindex="-1">Appearance</h2>' +
                '<button type="button" class="appearance-close">Close</button>' +
            '</div>' +
            '<p class="appearance-intro">Change how this page looks for you. ' +
            'Your choices are saved in this browser.</p>' +
            '<form class="appearance-form" onsubmit="return false">' +
                '<h3>Reading</h3>' +
                segmented('theme', 'Theme', [['auto', 'Auto'], ['light', 'Light'], ['dark', 'Dark']]) +
                segmented('font', 'Font', [['sans', 'Sans'], ['serif', 'Serif'], ['mono', 'Mono']]) +
                segmented('font', 'Or, for easier reading', [['lexend', 'Lexend'], ['opendyslexic', 'OpenDyslexic']]) +
                range('size', 'Text size', 14, 24, 1) +
                segmented('width', 'Page width', [['narrow', 'Narrow'], ['medium', 'Medium'], ['wide', 'Wide']]) +
                '<h3>Code</h3>' +
                range('codeLineHeight', 'Space between lines of code', 1.2, 2.2, 0.1) +
                '<h3>Accessibility</h3>' +
                segmented('contrast', 'High contrast', [['normal', 'Off'], ['high', 'On']]) +
                segmented('motion', 'Reduce motion', [['normal', 'Off'], ['reduced', 'On']]) +
                '<button type="button" class="appearance-reset">Reset to defaults</button>' +
            '</form>';

        // The button goes at the end of the bar at the top of the page
        (document.querySelector('.page-nav') || document.body).appendChild(toggle);
        document.body.appendChild(panel);

        const form = panel.querySelector('form');
        const sizeOutput = panel.querySelector('#appearance-size-value');
        const lineOutput = panel.querySelector('#appearance-codeLineHeight-value');

        /** Make the controls show the current settings */
        function sync() {
            for (const input of form.querySelectorAll('input[type="radio"]')) {
                input.checked = settings[input.name] === input.value;
            }
            form.elements.size.value = settings.size;
            form.elements.codeLineHeight.value = settings.codeLineHeight;
            sizeOutput.textContent = settings.size + 'px';
            lineOutput.textContent = Number(settings.codeLineHeight).toFixed(1);
        }

        // EVENT DELEGATION:
        // One listener on the whole form hears every control inside it,
        // instead of one listener per button
        form.addEventListener('input', function (event) {
            const control = event.target;
            if (!control.name || !(control.name in DEFAULTS)) return;
            settings[control.name] = control.type === 'range' ? Number(control.value) : control.value;
            apply(settings);
            save(settings);
            sync();
        });

        panel.querySelector('.appearance-reset').addEventListener('click', function () {
            settings = { ...DEFAULTS };
            apply(settings);
            save(settings);
            sync();
        });

        function open() {
            panel.hidden = false;
            toggle.setAttribute('aria-expanded', 'true');
            panel.querySelector('#appearance-title').focus();
        }

        function close(returnFocus) {
            if (panel.hidden) return;
            panel.hidden = true;
            toggle.setAttribute('aria-expanded', 'false');
            if (returnFocus) toggle.focus();
        }

        toggle.addEventListener('click', function () {
            if (panel.hidden) open();
            else close(true);
        });
        panel.querySelector('.appearance-close').addEventListener('click', function () {
            close(true);
        });

        // Escape closes the panel; so does clicking anywhere outside it
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') close(true);
        });
        document.addEventListener('click', function (event) {
            if (!panel.contains(event.target) && !toggle.contains(event.target)) close(false);
        });

        sync();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildPanel);
    } else {
        buildPanel();
    }
})();
