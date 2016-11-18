// ==UserScript==
// @name         Duolingo Trim tree
// @namespace    9a84a9d7b3fef7de9d2fd7155dcd794c
// @description  Hides all golden skills with a button.
// @author       Arek Olek
// @match        https://www.duolingo.com/*
// @icon         http://arkadiuszolek.student.tcs.uj.edu.pl/greasemonkey/duolingo.png
// @grant        none
// @updateURL    https://gist.github.com/camiloaa/6b902c11f7ab44a4c3ef/raw/Duolingo_Trim_tree.user.js
// @downloadURL  https://gist.github.com/camiloaa/6b902c11f7ab44a4c3ef/raw/Duolingo_Trim_tree.user.js
// @version      1.7
// ==/UserScript==

// Credit for [the idea](https://www.duolingo.com/comment/7146895) goes to Thomas de Roo.

var observer = new MutationObserver(function(mutations){
    initialize();
});

function initialize() {
    // Without the timeout, only some of the skills get hidden
    setTimeout(function() {
        if($('#toggleskills').size() === 0) {
            $('.tree').prepend('<button id="toggleskills" style="margin-left: 10px; width: 150px;" class="btn btn-standard right store-button btn-store" />');
        }
        update();

        // Handle switching languages
        observer.observe(document.querySelector('#app.home'), { childList: true });
    }, 100);
}

function update() {
    clearTimeout(update.tid);
    var item_name = "trim_treshold-" + duo.user.attributes.ui_language + "-"
                                     + duo.user.attributes.learning_language;
    var threshold = localStorage.getItem(item_name, 6);
    if (threshold == null) threshold = 6;
    var trimmed = threshold < 6;

    // Show current level and next available action
    $('#toggleskills').text(trimmed ? threshold-1 + ' bars or less' : 'Everything');
    update.tid = setTimeout(function() { $('#toggleskills').text(trimmed ? 'Grow tree' : 'Trim tree'); }, 2000);

    // Show or hide items depending on current state
    for(var strength = 0; strength <= 5; ++strength) $('.tree .skill-icon-strength-small.strength-' + strength).parent().parent().toggle(strength < threshold);
    $('.skill-icon.small.locked').parent().add('.skill-tree-row.row-shortcut').toggle(!trimmed);
    $('.skill-tree-row.bonus-row').toggle(!(trimmed && $('.skill-tree-row.bonus-row a:visible').size() === 0));
}

function strongerThan(strength) {
    for(++strength; strength <= 5; ++strength)
        if($('.skill-icon-strength-small.strength-' + strength).size() > 0)
            break;
    return strength;
}

$(document).on({
    click: function () {
        var item_name = "trim_treshold-" + duo.user.attributes.ui_language + "-"
                                         + duo.user.attributes.learning_language;
        var threshold = localStorage.getItem(item_name, 6);
        if (threshold == null) threshold = 6;
        localStorage.setItem(item_name, strongerThan(threshold > 5 ? 0 : threshold));
        update();
    }
}, '#toggleskills');

// Handle navigation that does not reload the page
new MutationObserver(function(mutations) {
    mutations.some(function(mutation) {
        for (var i = 0; i < mutation.addedNodes.length; ++i) {
            var node = mutation.addedNodes[i];
            if(node.id == 'app' && node.className == 'home') {
                initialize();
                return true;
            }
        }
    });
}).observe(document.querySelector('body'), { childList: true });

