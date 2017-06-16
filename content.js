chrome.runtime.sendMessage({ contentReady: true});

function updateVideoData(updates) {
    this.tab_event = this.tab_event || {};
    this.tab_event.status = updates.status;
    console.log(updates.status);

    // call method to update event model    


}


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "start_recording") {
            //step - prepare event model
            var event = caliper.createEvent();
            event['@context'] = request.context.id;
            event['@actor'] = {
                '@id': request.id,
                '@type': 'PERSON',
                '@name': request.email
            };


            //step - fetch logged in user

            //step  fetch url


            //step - check for a video and track it
            var video = document.getElementsByTagName("video")[0];
            if (video) {
                event['@type'] = 'VIDEO';
                event['@object'] = {

                };
                video.addEventListener('playing', updateVideoData.bind(request, { status: 'played at '.concat(Date().toString()), event: event }));
                video.addEventListener('pause', updateVideoData.bind(request, { status: 'paused at '.concat(Date().toString()), event: event }));
            } else {
                console.log('No video object found');
            }

            //step - update event
            //step - post event
            alert(JSON.stringify(event));
            sendResponse(event);

        }
    }
);
