var status;
var userName;
var userNectar;
var userOptin;
var xhr;
var domain;
var lastEhcData = {};
var isEhc = false;
var userId;
var storageTrackLimit = 1900;

var allowedDomains = [
  "earnhoney.com",
  "matchedcars.com",
  "tvminutes.com",
  "meemd.com",
  "miimd.com",
  "tvglee.com",
  "furryflix.com",
  "autopairs.com",
  "mooviemania.com"
];

var manifest = chrome.runtime.getManifest();

chrome.alarms.create("getUserStatusAlarm", {
  delayInMinutes: 0.1,
  periodInMinutes: 5
});

chrome.alarms.create("getUserNotificationAlarm", {
  delayInMinutes: 0.3,
  periodInMinutes: 120
});

chrome.runtime.onMessageExternal.addListener(function(
  request,
  sender,
  sendResponse
) {
  if (request) {
    if (request.message) {
      if (request.message == "version") {
        sendResponse({ version: manifest.version });
      }
    }
  }
  return true;
});

chrome.alarms.onAlarm.addListener(function(alarm) {
  console.log("alarm received.");
  console.log(alarm);
  if (alarm.name === "getUserStatusAlarm") {
    getUserStatus();
  }
  if (alarm.name === "getUserNotificationAlarm") {
    getUserNotification();
  }
});

function getUserStatus(callback) {
  status = "updating";
  isEhc = domain == undefined || domain.indexOf("earnhoney.com") > -1;
  xhr = new XMLHttpRequest();
  var myUrl = "";
  if (domain == undefined || domain.indexOf("www.earnhoney.com") > -1) {
    myUrl = "http://www.earnhoney.com/en/me/status";
  } else {    
    if (domain.indexOf("earnhoney.com") > -1) {
      myUrl = "http://www." + domain + "/en/me/status";
    } else {
      myUrl = "http://www." + domain + "/me/status";
    }
  }

  xhr.open("GET", myUrl, true);
  xhr.timeout = 15000;
  xhr.onload = function() {
    var resp = JSON.parse(xhr.responseText);
    if (resp.logged === true) {
      status = "loggedIn";
      userName = resp.name;
      userNectar = resp.nectar;
      userOptin = resp.optin;
      userId = resp.userId;

      setLocalValueStorage("optin_userid", userId);

      if (isEhc) {
        lastEhcData.userName = resp.name;
        lastEhcData.userNectar = resp.nectar;
        lastEhcData.userOptin = resp.optin;
        lastEhcData.status = status;
        lastEhcData.userId = userId;

      }
    } else {
      status = "loggedOut";
      if (isEhc) {
        lastEhcData.status = status;
      }
    }
    updateBadge(callback);
  };
  xhr.onerror = function() {
    status = "error";
    if (isEhc) {
      lastEhcData.status = status;
    }
    updateBadge(callback);
  };
  xhr.ontimeout = function() {
    status = "error";
    if (isEhc) {
      lastEhcData.status = status;
    }
    updateBadge(callback);
  };
  xhr.send();
}

function getUserNotification() {
  if (status !== "loggedIn") {
    return;
  }

  xhr = new XMLHttpRequest();

  var myUrl = "http://www.earnhoney.com/en/me/fancy/" + userId;

  xhr.open("GET", myUrl, true);
  xhr.timeout = 800000;
  xhr.onload = function() {
    var response = JSON.parse(xhr.responseText);
    updateBadgeBackground(response);
  };
  xhr.onerror = function() {};
  xhr.ontimeout = function() {};
  xhr.send();
}

function updateBadgeBackground(response) {
  var response = JSON.parse(xhr.responseText);
  chrome.storage.sync.get("previousUserNotification", function(result) {
    if (result.previousUserNotification === 0 && response === 1) {
      chrome.browserAction.setBadgeBackgroundColor({ color: "green" });
    } else if (result.previousUserNotification === 1 && response === 0) {
      chrome.browserAction.setBadgeBackgroundColor({ color: "red" });
    }

    chrome.storage.sync.set({ previousUserNotification: response });
  });
}

function updateBadge(callback) {
  if (status === "error") {
    chrome.browserAction.setBadgeText({ text: "!" });
  } else if (status === "loggedIn") {
    var badgeText = "" + Math.floor(userOptin);
    if (userOptin > 99999) {
      badgeText = Math.floor(userOptin / 1000) + "K";
    }
    chrome.browserAction.setBadgeText({ text: badgeText });
  } else {
    chrome.browserAction.setBadgeText({ text: "" });
  }

  if (typeof callback != "undefined") {
    callback();
  }
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    var newDomain = extractDomain(tab.url);
    if (domain == newDomain) {
      return;
    }
    domain = newDomain;
    if (domain == undefined && lastEhcData.status !== undefined) {
      updateBadgeWithDefaults();
    } else {
      getUserStatus();
    }
  }
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    domain = extractDomain(tab.url);
    if (domain == undefined && lastEhcData.status !== undefined) {
      updateBadgeWithDefaults();
    } else {
      getUserStatus();
    }
  });
});

function updateBadgeWithDefaults(callback) {
  status = lastEhcData.status;
  userName = lastEhcData.userName;
  userNectar = lastEhcData.userNectar;
  userOptin = lastEhcData.userOptin;
  updateBadge(callback);
}

function extractDomain(url) {
  var domain;

  if (url.indexOf("://") > -1) {
    domain = url.split("/")[2];
  } else {
    domain = url.split("/")[0];
  }

  domain = domain.split(":")[0];

  for (var i = 0; i < allowedDomains.length; i++) {
    if (domain.indexOf(allowedDomains[i]) > -1) {
      return domain;
    }
  }
  return undefined;
}

//Optin Tracking data
chrome.tabs.onUpdated.addListener(function(tabId, info) {
  if (info.status === "complete") {
    onPageCompleted(tabId, info);
  } else if (info.status === "loading") {
    onLoading(tabId, info);
  }
});

chrome.runtime.onMessage.addListener(function(msg, sender) {
  if (msg.from === "content") {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var activeTab = tabs[0];
      var activeTabId = activeTab.id;

      var tabContext = getTabContainerById(activeTabId);

      if (msg.subject === "updateClicks") {
        updateClick(tabContext, msg);
      } else if (msg.subject === "trackMousePosition") {
        updateMouseMove(tabContext, msg);
      } else if(msg.subject === "trackScroll"){
        updateScroll(tabContext, msg);
      }

      updateTabContainer(tabContext);
    });
  }
});
