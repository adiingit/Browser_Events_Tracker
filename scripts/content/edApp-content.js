chrome.runtime.sendMessage({ edAppcontentReady: true });

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "start_recording_edApp") {
            edAppTab = request.context;
            var edAppLinks = document.querySelectorAll('#content2 a[href*="http"]');
            edAppLinks.forEach(function(link) {
                (function(href) {
                    href.addEventListener('click', function() {
                    	chrome.runtime.sendMessage(null,{"message":"link_clicked","href":href.getAttribute('href')});
                        //sendResponse(href.getAttribute('href'));
                        //return true;
                    });
                })(link);
            });
        }

        if (request.message === "stop_recording_edApp") {}
    }
);
