// ==UserScript==
// @name     RNDplus4free
// @description Laden des Artikel-Textes aus dem JSON im Quelltext
// @version  0.8.4
// @match https://*.haz.de/*.html*
// @match https://*.neuepresse.de/*.html*
// @match https://*.sn-online.de/*.html*
// @match https://*.waz-online.de/*.html*
// @match https://*.dnn.de/*.html*
// @match https://*.goettinger-tageblatt.de/*.html*
// @match https://*.lvz.de/*.html*
// @match https://*.ln-online.de/*.html*
// @match https://*.kn-online.de/*.html*
// @match https://*.maz-online.de/*.html*
// @match https://*.ostsee-zeitung.de/*.html*
// @match https://*.paz-online.de/*.html*
// @match https://*.rnd.de/*.html*
// @match https://*.dewezet.de/*.html*
// @match https://*.cz.de/*.html*
// @match https://*.szlz.de/*.html*
// @match https://*.saechsische.de/*.html*
// @match https://*.dieharke.de/*.html*
// @grant none
// ==/UserScript==

let article = "";

const app_node = document.getElementById("fusion-app")
              || document.getElementById("arc-app")
              || document.getElementById("root")
              || document.getElementById("app")
              || document.body;


// Piano renders the real body, then swaps in a skeleton + paywall, wiping
// anything we inserted. So we keep observing and re-apply whenever it reblocks.
let apply_scheduled = false;

let observer = new MutationObserver(() => {
    if (apply_scheduled) return;
    apply_scheduled = true;

    requestAnimationFrame(() => {
        apply_scheduled = false;
        apply();
    });
});

if (app_node) {
    observer.observe(app_node, {childList: true, subtree: true});
} else {
    console.warn("RNDplus4free: kein App-Container gefunden");
}


apply();

setTimeout(() => observer.disconnect(), 30000);

function apply() {
    if (!is_paywalled_article()) return;
    // leave the page alone while the real body is present (hydration flash,
    // free-period, subscriber); only step in once it's down to the skeleton
    if (is_content_loaded()) return;

    const paywall = get_paywall();
    if (paywall) paywall.style.display = "none";

    if (!article && !get_article()) return;

    if (!document.getElementById("rndplus4free-content")) {
        change_page();
    }

    remove_skeleton();
}

function is_content_loaded() {
    const body = document.querySelectorAll('[class^="Articlestyled__CenteredContentWrapper"]')[1];
    if (!body) return false;

    return body.querySelector('p, [class^="Textstyled__Text"]') !== null;
}

function remove_skeleton() {
    const body = document.querySelectorAll('[class^="Articlestyled__CenteredContentWrapper"]')[1];

    // guard against clearing an empty node, which would retrigger the observer
    if (body && body.childElementCount > 0) {
        body.innerHTML = "";
    }
}

function get_paywall() {
    // container ids carry a site-specific suffix (e.g. ...-article-haz)
    const selectors = [
        '[id^="piano-sticky-template-article"]',
        '[id^="piano-lightbox-article"]',
    ];

    for (const selector of selectors) {
        const container = document.querySelector(selector);
        if (container && container.childElementCount > 0) {
            return container;
        }
    }

    return null;
}

function is_paywalled_article() {
    return document.querySelectorAll("[class^=PaidIconstyled]").length > 0;
}

function get_article() {
    if (window.Fusion && window.Fusion.globalContent) {
        article = window.Fusion.globalContent;
        return true;
    }
    console.error("RNDplus4free: Fusion.globalContent nicht gefunden");
    return false;
}

function change_page(){
    let header = document.querySelectorAll('[class^="ArticleHeadstyled__ArticleHeader"]')[0];
    if (!header) return;

    let teaserContainer = document.querySelectorAll('[class^="ArticleHeadstyled__ArticleTeaserContainer"]')[0];
    if (teaserContainer) teaserContainer.style.height = "100%";
    reset_teaser_style();

    // single identifiable container so apply() can detect/replace it as a unit
    let content = document.createElement("div");
    content.id = "rndplus4free-content";

    insert_article_details(content);
    insert_divider(content);
    insert_article(content);

    header.append(content);
}

function reset_teaser_style() {
    let teaser = document.querySelectorAll('[class^="Textstyled__Text"]')[0];
    if (!teaser) return;
    teaser.style.overflow = "visible";
    teaser.style.height = "unset";
}

function insert_article_details(html) {
    let detailsContainer = document.createElement("div");
    detailsContainer.style.marginBottom = "24px";
    detailsContainer.style.marginTop = "16px";

    detailsContainer.style.fontFamily = "Inter, Arial-adjusted-for-Inter, Roboto-adjusted-for-Inter, sans-serif";
    detailsContainer.style.fontSize = "14px";
    detailsContainer.style.fontWeight = "500";
    detailsContainer.style.letterSpacing = "0px";
    detailsContainer.style.lineHeight = "18px";

    (article.authors || []).forEach((author) => {
        let a = document.createElement("a");
        a.rel = "author";
        a.text = author.name;

        if (author.url) {
            a.href = author.url;
        }

        let articleMetaAuthors = document.createElement("address");

        articleMetaAuthors.append(a);
        detailsContainer.append(articleMetaAuthors);
    });

    let time = document.createElement("time");
    time.datetime = article.firstPublishDate;
    let date = new Date(article.firstPublishDate);
    time.innerText = date.toLocaleString();

    detailsContainer.append(time);
    html.append(detailsContainer);
}

function insert_divider(html) {
    let dividerWrapper = document.createElement("div");
    dividerWrapper.className = "ArticleHeadstyled__ArticleDivider";
    dividerWrapper.style.marginBottom = "24px";
    dividerWrapper.style.marginTop = "8px";

    let divider = document.createElement("div");
    divider.className = "Dividerstyled__Divider ";
    divider.style.borderTop = "2px dotted var(--ldc-63)";
    divider.style.fontSize = "2px";
    divider.style.height = "0px";
    divider.style.width = "100%";

    dividerWrapper.append(divider);
    html.append(dividerWrapper);
}

function create_image(info) {
    let figure = document.createElement("figure");
    figure.style.margin = "16px 0";

    let img = document.createElement("img");
    // info.src is the non-public origin; build the signed resizer URL instead
    const auth = info.auth ? Object.values(info.auth)[0] : "";
    img.src = `/resizer/v2/${info.id}.jpg?auth=${auth}&quality=70&width=828`;
    img.alt = info.alt || "";
    img.loading = "lazy";
    img.style.width = "100%";
    img.style.height = "auto";
    figure.append(img);

    if (info.caption || info.credit) {
        let figcaption = document.createElement("figcaption");
        figcaption.style.fontFamily = "Inter, Arial-adjusted-for-Inter, Roboto-adjusted-for-Inter, sans-serif";
        figcaption.style.fontSize = "12px";
        figcaption.style.lineHeight = "16px";
        figcaption.style.marginTop = "8px";

        if (info.caption) {
            let caption = document.createElement("div");
            caption.innerText = info.caption;
            caption.style.color = "var(--ldc-52)";
            figcaption.append(caption);
        }

        if (info.credit) {
            let credit = document.createElement("div");
            credit.innerText = info.credit;
            credit.style.color = "var(--ldc-63)";
            credit.style.marginTop = "8px";
            figcaption.append(credit);
        }

        figure.append(figcaption);
    }

    return figure;
}

function create_quote(element) {
    let figure = document.createElement("figure");
    figure.style.display = "flex";
    figure.style.flexDirection = "column";
    figure.style.alignItems = "center";
    figure.style.textAlign = "center";
    figure.style.borderTop = "1px solid var(--ldc-25)";
    figure.style.borderBottom = "1px solid var(--ldc-25)";
    figure.style.margin = "16px 0";
    figure.style.padding = "32px";

    let accent = document.createElement("div");
    accent.style.width = "40px";
    accent.style.height = "2px";
    accent.style.marginBottom = "16px";
    accent.style.backgroundColor = "var(--primary-color)";
    figure.append(accent);

    let blockquote = document.createElement("blockquote");
    blockquote.style.fontFamily = '"Source Serif Pro", Palatino, "Droid Serif", serif';
    blockquote.style.fontSize = "21px";
    blockquote.style.fontWeight = "600";
    blockquote.style.lineHeight = "26px";
    blockquote.style.margin = "0";

    element.elements.forEach((text) => {
        let p = document.createElement("p");
        p.innerHTML = text;
        blockquote.append(p);
    });

    figure.append(blockquote);

    if (element.author) {
        let figcaption = document.createElement("figcaption");
        figcaption.innerText = element.author;
        figcaption.style.fontFamily = "Inter, Arial-adjusted-for-Inter, Roboto-adjusted-for-Inter, sans-serif";
        figcaption.style.fontSize = "14px";
        figcaption.style.marginTop = "16px";
        figcaption.style.color = "var(--ldc-63)";
        figure.append(figcaption);
    }

    return figure;
}

function insert_article(html){
    let headlines = document.querySelectorAll('[class^="Headlinestyled__Headline"]');
    let headline_el = headlines[1] || headlines[0];
    let headline_class = headline_el ? headline_el.className : "";

    let text_el = document.querySelectorAll('[class^="Textstyled__Text"]')[0];
    let inline_text_class = text_el ? (text_el.className.match(/\b\w{6}\b/)?.[0] || "") : "";

    // element types that carry no article body and are intentionally dropped:
    // ads, paywall/newsletter widget slots and related-article teasers
    let ignored_types = ["ad", "newsletterAd", "piano", "moreItems"];

    article.elements.forEach((element) => {
        if (element.type == "header") {
            let h2 = document.createElement("h2");
            h2.className = headline_class;
            h2.innerHTML = element.text;
            h2.style.marginTop = "8px";

            html.append(h2);
        }
        else if (element.type == "text") {
            let p = document.createElement("p");
            p.className = inline_text_class;
            p.innerHTML = element.text;

            html.append(p);
        }
        else if (element.type == "image") {
            html.append(create_image(element.imageInfo));
        }
        else if (element.type == "quote") {
            html.append(create_quote(element));
        }
        else if (element.type == "list" && !element.list.isOrdered) {
            let ul = document.createElement("ul");
            ul.className = inline_text_class;

            element.list.items.forEach((item) => {
                let li = document.createElement("li");
                li.innerHTML = item.text;
                ul.append(li);
            });

            html.append(ul);
        }
        else if (ignored_types.includes(element.type)) {
            // intentionally skipped
        }
        else {
            console.log("Unknown content element type", element);
        }
    });
}
