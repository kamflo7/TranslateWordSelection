var extensionOrigin = "chrome-extension://gbhegaeilndhkfpnhdpkbnmolcpaahcd";
var iframe;
var onMessageListener;

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
	e.parentNode.removeChild(e);
}

function removeMessageListener() {
	window.removeEventListener("message", onMessageListener);
	
}

onMessageListener = function(e) {
	if(e.origin.indexOf(extensionOrigin) == 0) {
		console.log("[injectDialog] Got window.message: " + JSON.stringify(e.data));
		
		if(e.data.action == "getTranslationData") {
			chrome.runtime.sendMessage({ action: "getTranslationData" }, function(response) {
				iframe.contentWindow.postMessage({ action: "giveTranslationData", data: response.data}, extensionOrigin);
			});
		} else if(e.data.action == "acceptDialog") {
			chrome.runtime.sendMessage({ action: "acceptDialog", data: e.data.data});
			removeIframeElement();
			removeMessageListener();
		} else if(e.data.action == "dismissDialog") {
			removeIframeElement();
			removeMessageListener();
		}
	}
}

createIframeIntoPage();
window.addEventListener("message", onMessageListener);