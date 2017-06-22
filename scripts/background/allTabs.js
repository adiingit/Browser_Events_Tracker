var tabsContext = {};

/*chrome.runtime.onMessage.addListener(function(request) {
    if (request.message === "start_recording_edApp") {
        alert('allTabs.js - edApp:' + edAppContext.opened);
    } else if (request.message === "stop_recording_edApp") {
        alert('allTabs.js - edApp:' + edAppContext.opened);
    }
});*/


function edAppLoaded() {
    alert('allTabs.js - edApploaded:' + (edAppContext && edAppContext.opened));
    return edAppContext && edAppContext.opened;
}

function sendMessage(tab, tabsContext, edAppContext, closed) {
    /*if (closed) {
        chrome.tabs.sendMessage(tab.id, { message: 'stop_recording', tabsContext: tabsContext[tab.id], edAppContext: edAppContext, user: user}, function(response) {
           // alert('allTabs.js - sendMessage:'+response);
        });
    } else {*/
        chrome.tabs.sendMessage(tab.id, { message: 'start_recording', tabsContext: tabsContext[tab.id], edAppContext: edAppContext, user: user}, function(response) {
            //alert('allTabs.js - sendMessage:'+response);
        });
   // }
}


chrome.tabs.onUpdated.addListener(function(tabId, info) {
    if (edAppLoaded() && tabId !== edAppContext.id && info.status == "complete") {
        chrome.tabs.get(tabId, function(tab) {
            if (tab.url.includes('slor.s3.amazonaws.com') || (tabsContext.hasOwnProperty(tabId) && tabsContext[tabId].url === tab.url)) {
                return;
            }
            //apply filter
            alert('allTabs.js - onupdated tab listener - edAppContext.visitedTabs:'+JSON.stringify(edAppContext.visitedTabs));
            edAppContext.visitedTabs.forEach(function(visitedTab) {
                if(visitedTab.tabId !== tab.id && visitedTab.url === tab.url){
                    visitedTab.tabId = tab.id;
                }
            });

            tabsContext[tab.id] = {
                id: tab.id,
                url: tab.url,
                title: tab.title
            };
            sendMessage(tab, tabsContext, edAppContext);

        });
    }
});


chrome.runtime.onMessage.addListener(function(request){
    if(request.message && request.message==="event_created"){
        alert(JSON.stringify(request.event,1));
    }
});

//apply tab closed listener
chrome.tabs.onRemoved.addListener(function(tabId) {
    delete tabsContext[tabId];
    /*chrome.tabs.get(tabId, function(tab) {
        sendMessage(tab, tabsContext, edAppContext,true);    
    });*/
    
});
