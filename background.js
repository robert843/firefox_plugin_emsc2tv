var init = true;
var data = { online: false, viewers:null }
const CLIENT_ID = 'az1nn0ikwddnv8zop0r66fqyys0znm9';
const USER_ID = '20899820';
browser.runtime.onMessage.addListener(function(message) {
	if(message=='refresh') {
		updateStatus();
	}
});

async function updateStatus() {
  var twitchStatus = await fetch("https://api.twitch.tv/helix/streams?user_id=" + USER_ID,{ 
        headers: {
            "Client-ID": CLIENT_ID,

        }  
    }).then(function(response) {
    return response.json();
  });
    if (Array.isArray(twitchStatus.data) && twitchStatus.data.length>0) {
        if(!data.online){
            browser.browserAction.setIcon({path:'files/icon-online.png'});
            browser.notifications.create("powiadamiacz-notification", { "type": "basic", "iconUrl": chrome.extension.getURL("files/icon.png"), "title": "EmStudio", "message": "Stream jest Online!" });
                var getting = browser.storage.sync.get();
                    getting.then(function(settings){
                        if(settings.notification_sound||true){
                            var notification_sound_file = (settings.notification_sound_default||true) ? 'files/notify.wav': settings.notification_sound_file; 
                            var notifyAudio = new Audio(notification_sound_file);
				            notifyAudio.volume=(settings.volume || 100)/100;
				            notifyAudio.play();
                        }
                    });
		    var p = chrome.extension.getViews({type:'popup'});
		    if(p.length!=0) p[0].update();
        }
        data.online=true;
        data.viewers=twitchStatus.data[0].viewer_count;
    } else {
        if(data.online){
            browser.browserAction.setIcon({path:'files/icon-offline.png'});
            data.online=false;
            data.viewers=null;
        }
    }
}


if(init) {
	console.log('startup..');
	interval();
	init=false;
}

function interval() {
	updateStatus();
    var getting = browser.storage.sync.get();
    getting.then(function(settings){
        if(settings.refresh_rate){
        	window.setTimeout(interval, settings.refresh_rate*1000);
        }else {
        	window.setTimeout(interval,10*1000);
        }
        });
}
