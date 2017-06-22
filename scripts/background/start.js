var matchUrl = 'https://slor.s3.amazonaws.com';
var edAppContext, edAppcontent = false,
    user, edAppTabId;

chrome.runtime.onMessage.addListener(function(request) {
    edAppcontent = false;
    if (request && request.edAppcontentReady) {
        chrome.identity.getProfileUserInfo(function(userInfo) {
            user = userInfo;
            if (user)
                edAppcontent = request.edAppcontentReady;
        });
        alert('start.js - edApp content ready');
        if (edAppTabId) {
            chrome.tabs.get(edAppTabId, function(tab) {
                startRecordingEdApp(tab);
            });
        }
    }


});

function startRecordingEdApp(tab) {
    if (edAppcontent && tab.url.startsWith(matchUrl)) {
        edAppContext = {
            id: tab.id,
            url: tab.url,
            title: tab.title,
            opened: true,
            visitedTabs: []
        };

        chrome.tabs.sendMessage(tab.id, { message: 'start_recording_edApp', context: edAppContext }, function(response) {
            
        });
    }
}

chrome.runtime.onMessage.addListener(function(request){
    if(request.message==="link_clicked"){
        edAppContext.visitedTabs.push({ tabId: null, url: request.href });
    }
});

chrome.tabs.onUpdated.addListener(function(tabId, info) {
    edAppTabId = tabId;

    if (edAppcontent && info.status === 'completed') {
        chrome.tabs.get(tabId, function(tab) {
            startRecordingEdApp(tab);
        });
    }
});

chrome.tabs.onRemoved.addListener(function(tabId) {
    if (edAppcontent && tabId === edAppContext.id) {
        edAppTabId = null;
        edAppContext = {};
        chrome.tabs.sendMessage(tabId, { message: 'stop_recording_edApp', context: edAppContext }, function(response) {

        });
    }
});
