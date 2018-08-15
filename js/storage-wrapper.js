function setSyncValueStorage(key, value) {
  var jsonKeyValue = {};
  jsonKeyValue[key] = value;

  chrome.storage.sync.set(jsonKeyValue, function() {
    console.log("Value is set on sync to " + value);
  });
}

function getSyncValueStorage(key, onGetValue) {
  chrome.storage.sync.get(key, onGetValue);
}

function setLocalValueStorage(key, value) {
  var jsonKeyValue = {};
  jsonKeyValue[key] = value;

  chrome.storage.local.set(jsonKeyValue, function() {
    console.log("Value is set  on local to " + value);
  });
}

function getLocalValueStorage(key, onGetValue) {
  chrome.storage.local.get(key, onGetValue);
}

