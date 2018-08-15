optinContext = {};
optinContext.tabs = [];

var createNewTabContainer = function(tabId){            
    
    var tabContext = {}
    tabContext.trackInfo = {};
    
    tabContext.tabId = tabId;
    tabContext.trackInfo.url = null;
    tabContext.trackInfo.loadTime = undefined;
    tabContext.trackInfo.endPageTime = undefined;
    tabContext.trackInfo.totalPageTime = 0;
    tabContext.trackInfo.pageClicks = 0;
    tabContext.trackInfo.firstClickTime = 0;       
    tabContext.trackInfo.height = 0;
    tabContext.trackInfo.width = 0;
    tabContext.trackInfo.cookies = [];
    tabContext.trackInfo.mouseTrack = [];
    
    optinContext.tabs.push(tabContext);

    return optinContext.tabs.find(tc => tc.tabId === tabId);
}

getTabContainerById = function(tabId){
    var tabContext = optinContext.tabs.find(tc => tc.tabId === tabId);
    if(!tabContext)
        tabContext = createNewTabContainer(tabId);
    
    return tabContext;
}

updateTabContainer = function(tabContext){    
    var index = -1;
    optinContext.tabs.forEach(function(context) {
        index++;
        if(context.tabId === tabContext.tabId){
            optinContext.tabs[index] = tabContext;
        }
    }, this);
}