var findMetaTags = function(trackinfo) {
  var code =
    "var meta = document.querySelector(\"meta[name='description']\");" +
    'if (meta) meta = meta.getAttribute("content");' +
    "({" +
    "    title: document.title," +
    '    description: meta || ""' +
    "});";
  browser.tabs
    .executeScript({
      code: code
    })
    .then(results => {
      if (!results) return;
      var metatags = results[0];

      trackinfo.metatags = metatags;
    });
};

function injectTrackCapabilities() {
  browser.tabs.executeScript({
    file: "js/trackCapabilities.js"
  });
}

function cookieIsOnCatalog(cookie) {
  var trackedCookiesNames = [
    "nid",
    "sid",
    "ide",
    "anid",
    "dsid",
    "flc",
    "aid",
    "taid",
    "exchange_ui",
    "_gads",
    "_gac",
    "__utma",
    "__utmb",
    "__utmc",
    "__utmz",
    "Conversion",
    "id",
    "MSN Tracker",
    "Conversion",
    "act",
    "c_user",
    "datr",
    "locale",
    "lu",
    "p",
    "presence",
    "s",
    "x-src",
    "_e_undefined_2",
    "xs"
  ];

  return (
    trackedCookiesNames.filter(
      c => c.toLowerCase() === cookie.name.toLowerCase()
    ).length > 0
  );
}

function onPageCompleted(tabId, details) {
  browser.storage.local.get("optinPluginEnabled").then(result => {
    if (result.optinPluginEnabled == "true") {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var activeTab = tabs[0];
        var activeTabId = activeTab.id;

        var tabContext = createNewTabContainer(activeTabId);

        tabContext.trackInfo.loadTime = new Date();

        tabContext.trackInfo.url = activeTab.url;

        tabContext.trackInfo.timeStamp = (Date.now() / 1000) | 0;
        tabContext.trackInfo.height = activeTab.height;
        tabContext.trackInfo.width = activeTab.width;

        findMetaTags(tabContext.trackInfo);

        browser.cookies.getAll({ url: activeTab.url }).then(function(cookies) {
          var trackedCookies = [];

          cookies.forEach(function(cookie) {
            if (cookieIsOnCatalog(cookie)) {
              trackedCookies.push({
                name: cookie.name,
                value: cookie.value,
                domain: cookie.domain
              });
            }
          }, this);

          if (trackedCookies.length > 0) {
            tabContext.trackInfo.cookies = trackedCookies;
          }

          updateTabContainer(tabContext);

          injectTrackCapabilities();
        });
      });
    }
  });
}
