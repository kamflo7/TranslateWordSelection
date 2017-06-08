var extensionOrigin = "chrome-extension://gbhegaeilndhkfpnhdpkbnmolcpaahcd";
var iframe;
var onMessageListener;
var runtimeMessageListener;

function createIframeIntoPage() {
	iframe = document.createElement('iframe');
	iframe.setAttribute("id", "dictionaryIframe");
	iframe.setAttribute("name", "dictionaryIframeName");

	iframe.style.cssText = 'border: 0; position: fixed; padding: 0; top: 50%; left: 50%; display: block; width: 620px; height: 240px; margin-left: -310px; margin-top: -120px; z-index: 50000;';
	iframe.src = chrome.runtime.getURL('dialog.html');

	document.body.appendChild(iframe);
}


function removeIframeElement() {
	var e = document.getElementById("dictionaryIframe");
	if(e != null)
		e.parentNode.removeChild(e);
}

function removeMessageListener() {
	window.removeEventListener("message", onMessageListener);	
}

function removeRuntimeMessageListener() {
	if(chrome.runtime.onMessage.hasListener(runtimeMessageListener)) {
		chrome.runtime.onMessage.removeListener(runtimeMessageListener);
	}
}

onMessageListener = function(e) {
	if(e.origin.indexOf(extensionOrigin) == 0) {
		console.log("[injectDialog window.message] Got window.message: " + JSON.stringify(e.data));
		
		if(e.data.action == "getTranslationData") {
			chrome.runtime.sendMessage({ action: "getTranslationData" }, function(response) {
				iframe.contentWindow.postMessage({ action: "giveTranslationData", data: response.data}, extensionOrigin);
			});
		} else if(e.data.action == "acceptDialog") {
			chrome.runtime.sendMessage({ action: "acceptDialog", data: e.data.data});
			removeIframeElement();
			removeMessageListener();
			removeRuntimeMessageListener();
		} else if(e.data.action == "dismissDialog") {
			chrome.runtime.sendMessage({ action: "dismissDialog"});
			removeIframeElement();
			removeMessageListener();
			removeRuntimeMessageListener();
		}
	}
}

runtimeMessageListener = function(request, sender, sendResponse) {
	if(request.action == "removeScript") {
		removeIframeElement();
		removeMessageListener();
		removeRuntimeMessageListener();
		
		console.log("[injectDialog runtime.message] Removed window&runtime listeners and iframe");
	}
};

createIframeIntoPage();
window.addEventListener("message", onMessageListener);
chrome.runtime.onMessage.addListener(runtimeMessageListener);