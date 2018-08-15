var bg = {};
onload = setTimeout(init, 0);
var manifest = chrome.runtime.getManifest();

function init() {
    chrome.browserAction.setBadgeBackgroundColor({
        color: [255, 0, 0, 255]
    });

    chrome.runtime.getBackgroundPage(function (bgp) {
        bg = bgp;
        updatePopup();
        bgp.getUserStatus(updatePopup);
    });

    $('#moreDetailsLink').click(function(){
        openOptions();
    });

}


function updatePopup() {
    if (bg.status === "error") {
        showError();
    } else if (bg.status === "loggedOut") {
        showLoggedOut();
    } else if (bg.status === "loggedIn") {
        showLoggedIn();
    } else {
        showUpdating();
    }

    document.getElementById("ex-version").innerText = manifest.version;
}


function showError() {
    document.getElementById("updating").style.display = 'none';
    document.getElementById("not_logged").style.display = 'none';
    document.getElementById("not_logged_partner").style.display = 'none';
    document.getElementById("nectar").style.display = 'none';
    document.getElementById("error").style.display = 'block';
}

function showLoggedIn() {
    document.getElementById("updating").style.display = 'none';
    document.getElementById("not_logged").style.display = 'none';
    document.getElementById("not_logged_partner").style.display = 'none';
    document.getElementById("nectar").style.display = 'block';
    document.getElementById("error").style.display = 'none';

    document.getElementById("name").innerText = bg.userName;
    document.getElementById("honey_balance").innerText = bg.userOptin.toFixed(2);
}

function showLoggedOut() {
    document.getElementById("updating").style.display = 'none';
    if (bg.domain == undefined || bg.domain.indexOf("earnhoney.com") > -1) {
        document.getElementById("not_logged").style.display = 'block';
        document.getElementById("not_logged_partner").style.display = 'none';
    }
    else {
        document.getElementById("not_logged").style.display = 'none';
        document.getElementById("not_logged_partner").style.display = 'block';
        document.getElementById("partner-name").innerText = bg.domain;
    }
    document.getElementById("nectar").style.display = 'none';
    document.getElementById("error").style.display = 'none';
}

function showUpdating() {
    document.getElementById("updating").style.display = 'block';
    document.getElementById("not_logged").style.display = 'none';
    document.getElementById("not_logged_partner").style.display = 'none';
    document.getElementById("nectar").style.display = 'none';
    document.getElementById("error").style.display = 'none';
}

function openOptions(){
    chrome.runtime.openOptionsPage(function(){});
}