var matchUrl = '*://www.youtube.com/watch?v*';
var queryInfo = { url: matchUrl },
    event = {};
chrome.tabs.query(queryInfo, function(tabs) {
    var cl = $('#content-list');

    tabs.forEach(function(tab) {
        console.log(tab);
        var imageClass = tab.audible ? 'pauseImage' : 'playImage';

        event[tab.id] = {
            status: 'stopped',
            ended: false
        };
        var x = `
			<div class="item" id=${tab.id}>
				<div id=record${tab.id}></div>
				<div class="tabInfo" id="jump${tab.id}">
					<div class="close" id="close${tab.id}" title="close tab"></div>
					<div class="title">${tab.title}</div>
					<div class="url">${tab.url}</div>
				</div>
			</div>
		`;


        cl.append($(x));

        $('#' + tab.id).on('click', { tabId: tab.id }, function(e) {
            console.log('loaded tab with e state ', e.data.tabId);
            chrome.tabs.sendMessage(e.data.tabId, { message: 'start_recording_event', tab_event: event[tab.id], id: e.data.tabId }, function(response) {
                if (response && response.error) {
                    console.log('No video found in tab');
                }
            });
        });

        $('#jump' + tab.id).on('click', { tabId: tab.id, windowId: tab.windowId }, function(e) {
            console.log('Clicked tab with e state ', e.data.tabId);
            chrome.windows.update(e.data.windowId, { focused: true });
            chrome.tabs.update(e.data.tabId, { active: true });
        });

        $('#close' + tab.id).on('click', { tabId: tab.id }, function(e) {
            console.log('Clicked tab with e state ', e.data.tabId);
            chrome.tabs.remove(e.data.tabId);
        });


    });

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            
            var recordElement = `
				<div id="status${request.tabId}">
					Status : asds
				</div>
				<div id="ended${request.tabId}">
					Ended : fgfd
				</div>`;

            $('#record' + request.tabId).html(recordElement);
            $('#record' + request.tabId + ' > #status' + request.tabId).html('Status : ' + request.event_updated.status);
            $('#record' + request.tabId + ' > #ended' + request.tabId).html('Ended : ' + request.event_updated.ended);

            sendResponse(chrome.runtime.id);
        }
    );

    if (tabs.length == 0) {
        var x = `
			<div style="text-align: center">No active youtube tabs</div>
		`
        $('body').attr('style', 'margin: 0; padding: 0');
        $('html').attr('style', 'margin: 0; padding: 0');
        cl.append($(x));
    }
});
