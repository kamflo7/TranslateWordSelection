// #3 insert IFRAME to document due to style variations from original sites
var extensionOrigin = "chrome-extension://gbhegaeilndhkfpnhdpkbnmolcpaahcd";

var iframe;

function createIframeIntoPage() {
	iframe = document.createElement('iframe');
	iframe.setAttribute("id", "dictionaryIframe");
	iframe.setAttribute("name", "dictionaryIframeName");

	iframe.style.cssText = 'border: 0; position: fixed; padding: 0; top: 50%; left: 50%; display: block; width: 620px; height: 240px; margin-left: -310px; margin-top: -120px; z-index: 50000;';
	iframe.src = chrome.runtime.getURL('dialog.html');

	document.body.appendChild(iframe);
}

console.log("[injectDialog.js] origin: " + window.location.origin);

createIframeIntoPage();

window.addEventListener("message", function(e) {
	if(e.origin.indexOf(extensionOrigin) == 0) {
		console.log("[injectDialog] Got window.message: " + JSON.stringify(e.data));
		
		if(e.data.action == "getTranslationData") {
			chrome.runtime.sendMessage({ action: "getTranslationData" }, function(response) {
				console.log("[injectDialog][Runtime::sendMessage->response] I got message: " + JSON.stringify(response));
				iframe.contentWindow.postMessage({ action: "giveTranslationData", data: response.data}, extensionOrigin);
			});
		}
	}
});