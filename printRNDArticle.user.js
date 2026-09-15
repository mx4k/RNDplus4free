// ==UserScript==
// @name         RND – Artikel drucken
// @namespace    de.notme112.printRNDArticle
// @version      1.0
// @description  Ersetzt den Body durch den RND-Artikel und startet den Druckdialog mit Y
// @match        https://*.haz.de/*.html*
// @match        https://*.neuepresse.de/*.html*
// @match        https://*.sn-online.de/*.html*
// @match        https://*.waz-online.de/*.html*
// @match        https://*.dnn.de/*.html*
// @match        https://*.goettinger-tageblatt.de/*.html*
// @match        https://*.lvz.de/*.html*
// @match        https://*.ln-online.de/*.html*
// @match        https://*.kn-online.de/*.html*
// @match        https://*.maz-online.de/*.html*
// @match        https://*.ostsee-zeitung.de/*.html*
// @match        https://*.paz-online.de/*.html*
// @match        https://*.rnd.de/*.html*
// @match        https://*.dewezet.de/*.html*
// @match        https://*.cz.de/*.html*
// @match        https://*.szlz.de/*.html*
// @match        https://*.saechsische.de/*.html*
// @match        https://*.dieharke.de/*.html*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener('keydown', function (event) {
        if (event.key.toLowerCase() !== 'y') {
            return;
        }

        const target = event.target;
        if (
            target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement ||
            target instanceof HTMLSelectElement ||
            target.isContentEditable
        ) {
            return;
        }

        const article = document.querySelector('#contentMain > article');

        if (!article) {
            console.warn('RND-Druck: #contentMain > article wurde nicht gefunden.');
            return;
        }

        event.preventDefault();
        const articleContent = article.innerHTML;
        document.body.innerHTML = articleContent;

        const firstNav = document.querySelector('nav');
        if (firstNav) {
            firstNav.remove();
        }

        setTimeout(() => {
            window.print();
        }, 100);
    });
})();
