// ==UserScript==
// @name     haz4f
// @description Laden des Artikel-Textes aus dem JSON im Quelltext
// @version  0.1
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @include https://*.haz.de/*
// ==/UserScript==

var scripts = document.getElementsByTagName("script");

for(var i=0; i < scripts.length; i++){
  	 
    if(scripts[i].type == "application/ld+json"){
    	unsafeWindow.console.log("Lade Script Nummer: " + i);
		script_text=scripts[i].innerHTML;
		try{
        	unsafeWindow.console.log("Parse Script Nummer: " + i);
      		article = JSON.parse(script_text);
				if(article.articleBody != ""){
        			article_text = article.articleBody;
        			unsafeWindow.console.log(article_text);
				}
		}
		catch(err) {
			console.log(i);
		}
    }
}

//$('.pdb-article-body-paidcontentintro').css({'display' : 'none'});
$('.pdb-article-paidcontent-registration').css({'display' : 'none'});
$('.pdb-article-body-blurred').css({'display' : 'none'});

document.getElementsByClassName("pdb-article-body")[0].innerHTML = article_text;
