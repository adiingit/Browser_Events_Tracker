var user = {};
var matchUrl = '*://*/*';
var queryInfo = { url: matchUrl },
    event = {};
var tabsContext = {};

chrome.runtime.onMessage.addListener(function(request) {
    if (request && request.contentReady) {
        chrome.identity.getProfileUserInfo(function(userInfo) {
            user = userInfo;
        });
        init();
    }
});
//function getLoggedInUser(callback){

//}

//getLoggedInUser();

/*chrome.identity.onSignInChanged.addListener(function(account,signedIn){
	if(account.id === user.id || !signedIn)
		return;
	getLoggedInUser();
});*/
function sendMessage(tab, tabsContext) {
    chrome.tabs.sendMessage(tab.id, { message: 'start_recording', context: tabsContext[tab.id], user: user }, function(response) {
        if (chrome.runtime.lastError) {
            chrome.tabs.executeScript(tab.id, { file: "../../caliper-event-model.js" });
            chrome.tabs.executeScript(tab.id, {
                file: "../../content.js",
                runAt: "document_end"
            }, function() {
                if (!chrome.runtime.lastError) {
                    sendMessage(tab,tabsContext);
                }
            });
        } else {
            console.log("Message got through !");
            if (response && response.error) {
                console.log('No video found in tab');
            } else {
                console.log(response);
            }
        }


    });
}

function init() {
    /*chrome.tabs.query(queryInfo, function(tabs) {
        tabs.forEach(function(tab) {
            tabsContext[tab.id] = {
                id: tab.id,
                url: tab.url,
                title: tab.title
            };

            sendMessage(tab, tabsContext);


        });

        if (tabs.length == 0) {
            console.log('no tabs found');
        }
    });*/
    chrome.tabs.onUpdated.addListener(function(tabId, info) {
    if (info.status == "complete") {
        if (tabsContext.hasOwnProperty(tabId)) {
            chrome.tabs.get(tabId, function(tab) {
                tabsContext[tab.id] = {
                    id: tab.id,
                    url: tab.url,
                    title: tab.title
                };
                sendMessage(tab, tabsContext);
            });
        }
    }
});
}



