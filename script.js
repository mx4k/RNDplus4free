// ==UserScript==
// @name        haz epaper anpassungen
// @namespace   steinpreis.de
// @description Ändert unter anderem die serifenlose Schriftart auf epaper.haz.de
// @include     *epaper.haz.de/*
// @version     0.2
// @grant       GM_addStyle
// ==/UserScript==


// Schriftart geändert

GM_addStyle ( ".newscontainer {" + 
             "font-family: Droid Serif !important; " +
             "font-size: 17px !important; " +
             "@import url('https://fonts.googleapis.com/css?family=Droid+Serif') !important;} " );

GM_addStyle ( ".previewbox.article {" + 
             "font-family: Droid Serif !important; " +
             "font-size: 17px !important; " +
             "@import url('https://fonts.googleapis.com/css?family=Droid+Serif') !important;} " );


// Artikelbreite erhöht

GM_addStyle ( ".articlebox { width: 750px !important; } " );


// Lightbox verdunkelt
GM_addStyle ( "#lightboxbackground { opacity:.7;} " );


// Datum im Header verkleinert

GM_addStyle ( "#header .head .date { margin-top:2px !important; " +
             "margin-left:2px !important;} " );


// Header verkleinert und angepasst

GM_addStyle ( "#header .head .logo { cursor:default !important; " +
             "position: relative !important; "+
             "height: 45px !important;}" );
GM_addStyle ( "#header .head { height: inherit !important; " +
             "border-bottom: #016aa1 !important;" +
             "border-bottom-style: solid !important;" +
             "border-bottom-width:1px !important; }");
GM_addStyle ( ".logo { background-size:contain !important;} " );
GM_addStyle ( ".divider { height:0px !important;} " );
GM_addStyle ( ".toolbar { background-image:none !important; " +
             "border-bottom: #016aa1 !important;" +
             "border-bottom-style: solid !important;" +
             "border-bottom-width:1px !important;" +
             "height:26px !important;}");


// Sidebar links angepasst
GM_addStyle ( "#leftmenu { background-image:none !important; " +
             "background: whitesmoke !important; "+
             "margin: 10px 24px 20px 10px !important;}" );
GM_addStyle ( "#leftmenudynamicsections { height:502px !important; }" );

// Sidebar rechts angepasst
GM_addStyle ( ".pages li.selected .barleft { background-image:none !important; }" );
GM_addStyle ( ".pages li.selected .bartop { background-image:none !important; }" );
GM_addStyle ( ".pages li.selected .barright { background-image:none !important; }" );
GM_addStyle ( ".pages li.selected .barbottom { background-image:none !important; }" );
GM_addStyle ( ".pages li { margin:0px 0 !important; }" );


// Höhe gnaze Seite anpassen
GM_addStyle ( ".maincontent .newspaperpage .previewpage { height:710px !important; }" );
GM_addStyle ( ".maincontent { margin:10px 0 0; } " );
