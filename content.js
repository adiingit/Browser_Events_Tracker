function updateVideoData(updates) {
    this.tab_event = this.tab_event || {};
    this.tab_event.status = updates.status;
    console.log(updates.status);
            /*chrome.runtime.sendMessage(chrome.runtime.id,{ ready: true, event_updated: this.tab_event, tabId: this.id }, function(response) {
                console.log(response);
            });*/
    // call method to update event model    


}

function setUser(){

}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "start_recording") {
            //step - prepare event model
            var eventModel = {};


            //step - fetch logged in user
            
            //step  fetch url


            //step - check for a video and track it
            var video = document.getElementsByTagName("video")[0];
            var event = {};
            console.log(video);
            if (video) {
                video.addEventListener('playing', updateVideoData.bind(request, { status: 'played at '.concat(Date().toString())}));
                video.addEventListener('pause', updateVideoData.bind(request, { status: 'paused at '.concat(Date().toString())}));
            } else {
                console.log('No video object found');
            }

            //step - update event
            //step - post event
            sendResponse(eventModel);
        }
    }
);
