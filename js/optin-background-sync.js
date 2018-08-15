function localDataLimitHasReached(onLimitReached, onLimitHasNotReached) {
  getTrackDataBytesInUse(function(bytes) {
    if (bytes >= storageTrackLimit) {
      onLimitReached();
    } else {
      console.log(bytes);
      onLimitHasNotReached();
    }
  });
}

function yesterdayDataDidNotSend(onLastIsBeforeToday) {
  getLastDateTrackDataUpload(function(lastDate) {
    var last = Date.parse(lastDate);
    var today = Date.parse(new Date().toISOString().slice(0, 10));

    if (last < today) onLastIsBeforeToday();
  });
}

function uploadAndCatalogTrackData(onAfterUploadAndCatalog) {
  getTrackInfo(function(trackData) {          
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://prod-optin-network-api.azurewebsites.net/api/track",
      "method": "POST",
      "headers": {
        "Content-Type": "application/json"                
      },
      "processData": false,
      "data": JSON.stringify(trackData)
    }
    
    $.ajax(settings).done(function (response) {
      console.log(response);
      onAfterUploadAndCatalog();
    });
  });
}

function manageTrackingDataUpload() {
  localDataLimitHasReached(
    function() {
      uploadAndCatalogTrackData(clearTrackInfo);
    },
    function() {
      yesterdayDataDidNotSend(function() {
        uploadAndCatalogTrackData(clearTrackInfo);
      });
    }
  );
}
