// ==UserScript==
// @name         Duolingo Trim tree
// @namespace   9a84a9d7b3fef7de9d2fd7155dcd794c
// @description  Hides all golden skills with a button.
// @author       You
// @match        https://www.duolingo.com/*
// @grant        none
// @copyright    2015, Thomas de Roo
// @updateURL   https://monkeyguts.com/813.meta.js?c
// @downloadURL https://monkeyguts.com/813.user.js?c
// ==/UserScript==

console.log('Userscript loaded: Duolingo Hide all golden skills');
/*          Settings        */
var main = initHideSkills;
/*          /Settings    */

// Execute main when #app.home was added to document.body.
function onHomeAdded(mutations) {
    var addedNodes, j, addedElement;
    var i = mutations.length;
    while (i--) {
        addedNodes = mutations[i].addedNodes;
        j = addedNodes.length;
        while (j--) {
            addedElement = addedNodes[j];
            if (addedElement.id === 'app' && addedElement.className === 'home') {
                main();
                onHomeAdded.lastObserver.disconnect();
                onHomeAdded.lastObserver = new MutationObserver(function onHomeChanged(mutations) {
                    var i = mutations.length;
                    while (i--) {
                        if (mutations[i].addedNodes.length) {
                            main();
                            return;
                        }
                    }
                }).observe(addedElement, {childList: true});
                return;
            }
        }
    }
}
onHomeAdded.lastObserver = {disconnect: function() {}}; // Prevent errors.
new MutationObserver(onHomeAdded).observe(document.body, {childList: true});

if (location.pathname === '/' ) {
    main();
}


// Cookie functions

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function doToggle(){
    var hidden=getCookie("skillshidden");
    
    $(".skill-icon.small.gold").parent().toggle();
    $(".skill-tree-row.row-shortcut").toggle();
    $(".skill-icon.small.locked").parent().toggle();
    $("#toggleskills").text(function(i, text){
        if(text === "Trim tree")
        {
        	setCookie("skillshidden", "yes", 365);
        }else{
            if(text==="Untrim tree"){
            	setCookie("skillshidden", "no", 365);
            }
        }
        return text === "Trim tree" ? "Untrim tree" : "Trim tree";
    });
	


}

function inject(f) { //Inject the script into the document
    var script;
    script = document.createElement('script');
    script.type = 'text/javascript';
    script.textContent = f.toString();
    document.head.appendChild(script);
}

var timerID;

function initHideSkills(){
    inject(doToggle);
    inject(getCookie);
    inject(setCookie);
     var hiddenCookie=getCookie("skillshidden");
    var btnText ="Trim tree";
    if (hiddenCookie=="yes") {
        btnText = "Untrim tree";
    }
    timerID = window.setInterval(function(){
       var hiddenCookie2=getCookie("skillshidden");
        if(duo.view === "home"){
       if (hiddenCookie2=="yes") {
        $(".skill-icon.small.gold").parent().hide();
        $(".skill-tree-row.row-shortcut").hide();
        $(".skill-icon.small.locked").parent().hide();
        btnText = "Untrim tree";
       }else {
           $(".skill-icon.small.gold").parent().show();
        $(".skill-tree-row.row-shortcut").show();
        $(".skill-icon.small.locked").parent().show();
       }
        }
          }, 500);
    var btnHide = '</style><button style="color: white;margin-left: 10px;background:#1caff6!important;border-color:#1caff6!important;" data-tab="hideskills" class="btn btn-standard right store-button btn-store" id="toggleskills" onClick="doToggle();">'+btnText+'</button>';
    $(".tree").prepend(btnHide);
    style = document.createElement('style');
    style.textContent = "#toggleskills:hover { color:black!important; }";
    document.head.appendChild(style);
}
