function onLoading(tabId, details) {
  browser.storage.local.get("optinPluginEnabled").then(result => {
    if (result.optinPluginEnabled == "true") {
      updateTimeTrackingdata(tabId);

      var trackinfo = getTabContainerById(tabId).trackInfo;

      getLocalIPs(function(ips) {
        getLocalValueStorage("optin_userid", function(result) {
          if (result) trackinfo.userid = result.optin_userid;

          if (ips) trackinfo.ips = ips;

          addTrackInfo(trackinfo);
          manageTrackingDataUpload();
        });
      });
    }
  });
}

var updateTimeTrackingdata = function(tabId) {
  var tabContext = getTabContainerById(tabId);

  var endPageTime = new Date();
  totalPageTime = (endPageTime - tabContext.trackInfo.loadTime) / 1000;

  tabContext.trackInfo.endPageTime = endPageTime;
  tabContext.trackInfo.totalPageTime = totalPageTime;

  updateTabContainer(tabContext);
};

function getLocalIPs(callback) {
  chrome.cookies.get(
    { name: "optin_userip", url: "http://www.earnhoney.com" },
    function(result) {
      if (!result) {
        $.get("https://api.ipify.org", function(ip) {
          chrome.cookies.set({
            name: "optin_userip",
            url: "http://www.earnhoney.com",
            value: ip || "0.0.0.0"
          });

          callback(ip);
        });
      }else{
        callback(result.value);
      }
    }
  );
}
