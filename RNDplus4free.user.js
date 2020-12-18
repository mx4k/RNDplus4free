// ==UserScript==
// @name     RNDplus4free
// @description Laden des Artikel-Textes aus dem JSON im Quelltext
// @version  0.3
// @include https://*.haz.de/*
// @include https://*.neuepresse.de/*
// @include https://*.sn-online.de/*
// @include https://*.waz-online.de/*
// @include https://*.dnn.de/*
// @include https://*.goettinger-tageblatt.de/*
// @include https://*.lvz.de/*
// @include https://*.ln-online.de/*
// @include https://*.maz-online.de/*
// @include https://*.ostsee-zeitung.de/*
// @include https://*.paz-online.de/*
// @include https://*.sn-online.de/*
// ==/UserScript==

self.script_text = "";
self.article = "";
self.article_text = "";

var scripts = document.getElementsByTagName("script");

for(var i=0; i < scripts.length; i++){
    if(scripts[i].type == "application/ld+json"){
		self.script_text=scripts[i].innerHTML;
		try{
      			self.article = JSON.parse(self.script_text);
				if(self.article.articleBody != ""){
        			self.article_text = self.article.articleBody;
				}
		}
		catch(err) {
			console.log(i);
		}
    }
}

document.getElementsByClassName("pdb-article-body")[0].innerHTML = self.article_text;
