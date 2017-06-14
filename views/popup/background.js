chrome.tabs.onCreated.addListener(function(tabId , info) {
    //if (info.status == "complete") {
        console.log(tabId);
        console.log("background.js "+Date());
    //}
    });