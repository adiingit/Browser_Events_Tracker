function updateEvent(updates) {
    this.tab_event = this.tab_event || {};
    this.tab_event.status = updates.status;
    this.tab_event.ended = updates.ended;
    
            chrome.runtime.sendMessage(chrome.runtime.id,{ ready: true, event_updated: this.tab_event, tabId: this.id }, function(response) {
                console.log(response);
            });
        


}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "start_recording_event") {
            var video = document.getElementsByTagName("video")[0];
            var event = {};
            console.log(video);
            if (video) {
                video.addEventListener('playing', updateEvent.bind(request, { status: 'played', ended: video.ended }));
                video.addEventListener('pause', updateEvent.bind(request, { status: 'paused', ended: video.ended }));
            } else {
                sendResponse({ error: 'No video object found' });
            }
        }
    }
);
