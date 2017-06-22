var edAppTab;
//chrome.runtime.sendMessage({ contentReady: true });

function updateVideoData(updates) {
    this.tab_event = this.tab_event || {};
    this.tab_event.status = updates.status;
    var mediaEvent = new Caliper.Events.MediaEvent();

    alert('content.js - video:' + updates.status);
    alert('new mediaEvent:'+ JSON.stringify(mediaEvent,1));
    //alert('new mediaEvent:');


    // call method to update event model    


}


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        if (request.message === "start_recording") {
            var uiEvents = [{type:'mouseover'},{type:'scroll'}];
            //step - prepare event model
            if (!request.edAppContext.opened) {
                return;
            }
            var navigationEvent = new Caliper.Events.NavigationEvent();

            alert('new navigationEvent:'+ JSON.stringify(navigationEvent));

            for(i in uiEvents) {
                document.addEventListener(uiEvents[i].type, function(e) {
                    var viewEvent = new Caliper.Events.ViewEvent();
                    if (uiEvents[i].triggered) return;
                    uiEvents[i].triggered = true;
                    alert('new viewEvent:'+JSON.stringify(viewEvent));
                });
            }

            /*event['@context'] = request.tabsContext.id;
            event['@actor']['@id'] = request.id;
*/

            //step - fetch logged in user

            //step  fetch url

            //event['@type'] = 'WEB_PAGE';
            //step - check for a video and track it
            var video = document.getElementsByTagName("video")[0];
            //alert(video);
            if (video) {
                video.addEventListener('playing', updateVideoData.bind(request, { status: 'played at '.concat(Date().toString()), event: event }));
                video.addEventListener('pause', updateVideoData.bind(request, { status: 'paused at '.concat(Date().toString()), event: event }));
            } else {
                console.log('No video object found');
            }

            //step - update event
            //step - post event
            //navigationEvent.eventTime = Date().toString();
            //alert(JSON.stringify(event));
            //chrome.runtime.sendMessage(null,{"message":"event_created","event":event});
            // sendResponse(event);
            //return true;

        }

        if (request.message === 'stop_recording') {
            //send closed event
            if (!request.edAppContext.opened) {
                return;
            }
            alert('tab closed');
            //chrome.runtime.sendMessage(null,{"message":"event_created","event":event});
            //return true;
        }
    }
);
