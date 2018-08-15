var keyOptinTrackData = "optinTrackData";
var keyLastDateTrackDataUpload = "optinTrackDataLastDateUpload";

function addTrackInfo(trackinfo){    
    getLocalValueStorage(keyOptinTrackData, function(result){
        if(!result.optinTrackData){
            result = { optinTrackData : []};                        
        }                        

        result.optinTrackData.push(trackinfo);            
        console.log(result.optinTrackData);
        setLocalValueStorage(keyOptinTrackData, result.optinTrackData);        
    });
}

function getTrackInfo(onGetTrackinfo){    
    getLocalValueStorage(keyOptinTrackData, function(result){
        if(!result.optinTrackData){
            result = { optinTrackData : []};                        
        }        
        
        onGetTrackinfo(result.optinTrackData);
    });
}

function clearTrackInfo(){        
    setLocalValueStorage(keyOptinTrackData, []);
}

function getTrackDataBytesInUse(onGetBytes){
    chrome.storage.local.getBytesInUse(keyOptinTrackData, onGetBytes);
}

function getLastDateTrackDataUpload(onGetDate){
    getSyncValueStorage(keyLastDateTrackDataUpload, function(result){

        if(!result.optinTrackDataLastDateUpload){
            result.optinTrackDataLastDateUpload = new Date().toISOString().slice(0, 10);
        }
        onGetDate(result.optinTrackDataLastDateUpload);
    });
}

function updateLastTrackUploadDate(){        
    setSyncValueStorage(keyLastDateTrackDataUpload, new Date().toISOString().slice(0, 10));
}