var ver = "1.1";

window.onload = function() {
	console.log("[TranslateWorldSelection] Injected script init v="+ver);
	
	chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
		console.log("Cos odebralem "+msg.action);
		
		if(msg.action == "getPronunciation") {
			sendResponse({ data: "here will be pronunciation, but not now ;)" });
		}
	});
}

