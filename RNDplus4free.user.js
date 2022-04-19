// ==UserScript==
// @name     RNDplus4free
// @description Laden des Artikel-Textes aus dem JSON im Quelltext
// @version  0.4
// @match https://*.haz.de/*.html
// @match https://*.neuepresse.de/*.html
// ==/UserScript==

var script_text = "";
var article = "";
var article_text = "";

// Function added to wait for page to load (thx https://stackoverflow.com/a/49606079)
(function() {
    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this.addEventListener('load', function() {
            console.log('XHR finished loading', method, url);
            get_article();
            change_page();
        });

        this.addEventListener('error', function() {
            console.log('XHR errored out', method, url);
        });
        origOpen.apply(this, arguments);
    };
})();

function get_article(){
    var scripts = document.getElementsByTagName("script");

    for(var i=0; i < scripts.length; i++)
    {
        if(scripts[i].type == "application/ld+json")
        {
            script_text=scripts[i].innerHTML;
            try
            {
                article = JSON.parse(script_text);
                if(article.articleBody != "")
                {
                    article_text = article.articleBody;
                }
            }
            catch(err) {
                console.log(i);
            }
        }
    }
}

function change_page(){
    // delete ads (thx https://stackoverflow.com/a/4275292)
    var offer_element = document.querySelectorAll("[id^=piano-lightbox-article-")[0];
    offer_element.parentNode.removeChild(offer_element);

    // make header fully visible
    document.querySelectorAll("[class^=ArticleHeadstyled__ArticleTeaserContainer]")[0].style.height = "100%";

    // remove headline 2
    document.querySelectorAll("[class^=Headlinestyled__Headline")[1].innerHTML = "";

    // insert gathered article text
    document.querySelectorAll("[class^=Textstyled__InlineText")[0].innerHTML = article_text;

}
